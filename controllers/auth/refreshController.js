import Joi from 'joi';
import { User,RefreshToken } from '../../models';
import JwtService from '../../services/JwtService';
import {REFRESH_SECRET} from '../../config';
import CustomErrorHandler from '../../services/CustomErrorHandler';


const refreshController = {
    async refresh(req, res, next){
        //validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);
        
        if(error){
            return next(error);
        }
        let refreshToken;
        try {
            refreshToken = await RefreshToken.findOne({token: req.body.refresh_token})
            console.log(refreshToken);
            if(!refreshToken){
                return next(new CustomErrorHandler.unAutherised('Invalid Refresh Token'));
            }
            let userId;
            try {
                const {_id} = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
                console.log(userId);
            } 
            catch (error) {
                return next(new CustomErrorHandler.unAutherised('Invalid Refresh Token'));
            }

            const user = User.findOne({_id:userId});
            if(!user){
                return next(new CustomErrorHandler.unAutherised('No user found'));
            }
            
            // generate token
            const accessToken = JwtService.sign({_id:user._id, role: user.role});
            const refresh_Token = JwtService.sign({_id:user._id, role: user.role},'1y',REFRESH_SECRET);
            console.log(refresh_Token);
            //db whitelist
            await RefreshToken.create({token:refresh_Token});
            

            res.json({
                accessToken,
                refresh_Token
            });
        } 
        catch (error) {
            return next(new Error('something went wrong ' + error.message));
        }
    }
}

export default refreshController;
