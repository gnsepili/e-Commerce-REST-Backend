import multer from 'multer';
import path from 'path';
import Joi from 'joi';
import fs from 'fs';

import CustomErrorHandler from '../services/CustomErrorHandler';
import { Product } from '../models';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>cb(null,'uploads/'),
    filename: (req,file, cb)=> {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    } 
});


const handleMultiPartData=multer({storage, limit:{filesize: 1000000 * 10}}).single('image'); //10Mb
const productController={
    async store(req, res, next){
        handleMultiPartData(req, res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required()
            });
    
            const { error } = productSchema.validate(req.body);

            if (error){
                //delete the uploaded file if error occurs
                fs.unlink(`${rootDir}/${filePath}`, (err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                return next(error);
            }

            const {name, price, size} = req.body;
            let document;

            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch (error) {
                return next(error)
            }
            res.status(201).json(document);
        })
    }
}

export default productController;