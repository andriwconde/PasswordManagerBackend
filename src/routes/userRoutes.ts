import { Router } from 'express';
import  { userLogin, userRegister, getVersion, bioLogin, userFPK, getPublicKey }  from "../controllers/userController"
import { jwtValidator } from '../helpers';

const router = Router();

router.post('/login', userLogin);

router.post('/bioLogin', bioLogin);

router.post('/userFPK', userFPK);

router.get('/BPK',getPublicKey)

router.post('/register', userRegister);

router.get('/version', /*jwtValidator,*/ getVersion);

export default router

