import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";


const userController = {
    async userInfo(req, res, next){
        try {
            console.log('inside route-------->')
            const user = await User.findOne({_id:req.user._id}).select('-password -updatedAt -__v');
            console.log(user)
            if(!user){
                console.log('user nt----------->');
                return next(CustomErrorHandler.userNotExist());
            }
            res.json(user);
        } catch (error) {
            return next(error);
        }
    }
}

export default userController;
