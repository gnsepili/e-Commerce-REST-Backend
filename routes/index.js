import express from 'express'
import {registerController, loginController, userController} from '../controllers';
import auth from '../middlewares/auth';

const router = express.Router();
console.log('in route index========')
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/userInfo',auth , userController.userInfo);


export default router;