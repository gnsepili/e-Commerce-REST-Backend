import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User, RefreshToken } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler';
import Jwtservice from '../../services/JwtService';
import {REFRESH_SECRET} from '../../config';


const loginController={
    async login(req, res, next){
        //validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const { error } = loginSchema.validate(req.body);
        
        if(error){
            return next(error);
        }
        
        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return next(CustomErrorHandler.userNotExist('There is no account associated with this email'));    
            }

            //password match
            const match = await bcrypt.compare(req.body.password, user.password);
            console.log(match,"<.................")
            if(!match){
                return next(CustomErrorHandler.wrongCredential('Wrong password'));    
            }

            // generate token
            const accessToken = Jwtservice.sign({_id:user._id, role: user.role});
            const refreshToken = Jwtservice.sign({_id:user._id, role: user.role},'1y',REFRESH_SECRET);

            await RefreshToken.create({token:refreshToken});
            

            res.json({
                accessToken,
                refreshToken
            });

        } catch (error) {
            return next(error);
        }
        
    },
    async logout(req, res,next){
        //validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);
        
        if(error){
            return next(error);
        }
        try {
            //delete token 
            await RefreshToken.deleteOne({token:req.body.refresh_token});
            
        } catch (error) {
            return next(new Error('Something went wrong in Db while loging out'));
        }
        res.json({status:1,message: "logout successfully"});
    }

   
};
export default loginController;