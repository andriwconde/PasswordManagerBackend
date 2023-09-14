import { Router } from 'express';
import  { saveAccount, deleteAccount, updateAccount, getAccounts, getAccount, deleteManyAccounts }  from "../controllers/accountController"
import { jwtValidator } from '../helpers';
const router = Router();

router.post('/getAccounts', /* jwtValidator, */ getAccounts);

router.post('/getAccount', jwtValidator, getAccount);

router.post('/add', /* jwtValidator, */  saveAccount);

router.post('/update', /* jwtValidator, */ updateAccount);

router.post('/delete', /* jwtValidator, */ deleteAccount);


router.post('/deleteMany', /* jwtValidator, */ deleteManyAccounts);

export default router