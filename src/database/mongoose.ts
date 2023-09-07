import mongoose from "mongoose";
import dotenv from 'dotenv';
import {logger} from '../helpers'

dotenv.config();
mongoose.set('strictQuery', true);
main().catch(err => logger.error(err));

async function main() {
  try{
    await mongoose.connect(process.env.DB_QUERYSTRING as string,{
      sslValidate: true,
      tlsCertificateKeyFile: process.env.DB_CERTIFICATE_LOCATION,
      authMechanism: process.env.DB_AUTH_METHOD,
      authSource: process.env.DB_AUTH_SRC
    } as object)
    logger.info('mongodb conected');
  }catch(error){
    console.log({error})
    logger.error(error);
  }
  
  
}