import Joi from 'joi';
import bcrypt from 'bcrypt';

import CustomErrorHandler from '../../services/CustomErrorHandler';
import { User } from '../../models'
import Jwtservice from '../../services/JwtService';

const registerController = {
    async register(req, res, next){
        //      CHECKLIST
        // * validate the request
        // * authorise the request
        // * check if user is in the database already
        // * prepare model
        // * store in database
        // * generate jwt token
        // * send response

        // validate the request
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });
        // console.log(req.body);
        const {error} = registerSchema.validate(req.body);
        if(error){
            // throw error; simple error throw won't work with async
            return next(error);
        }
        
        
        //check if user in the database already
        try {
            const exist = await User.exists({ email: req.body.email });
            // console.log('exist------------->',exist);
            if (exist) {
                // console.log("inside --->")
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        } catch(err) {
            return next(err);
        }
        
        //password hashing
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //model
        const {name, email} = req.body;
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        let accessToken;
        try {
            const result = await user.save();

            //token
            accessToken = Jwtservice.sign({_id:result._id, role: result.role})
        } catch (error) {
            return next(error)
        }
        res.json({
            accessToken:accessToken
        });
    }
}

export default registerController;