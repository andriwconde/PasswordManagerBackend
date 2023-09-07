import { Router } from 'express';
import  { saveAccount, deleteAccount, updateAccount }  from "../controllers/accountController"
import { jwtValidator } from '../helpers';
const router = Router();

router.post('/update', updateAccount);

router.post('/delete', deleteAccount);

router.post('/add', saveAccount);


export default router