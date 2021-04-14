import express from 'express'
import {registerController, loginController, userController, refreshController} from '../controllers';
import auth from '../middlewares/auth';

const router = express.Router();
console.log('in route index========')
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/userInfo',auth , userController.userInfo);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);


export default router;