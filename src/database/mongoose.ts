import mongoose from "mongoose";
import dotenv from 'dotenv';
import {logger} from '../helpers'

dotenv.config();
mongoose.set('strictQuery', true);
main().catch(err => logger.error(err));

async function main() {
  try{
    await mongoose.connect(`mongodb+srv://cluster0.mjvcmx0.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority` as string,{
      sslValidate: true,
      tlsCertificateKeyFile: './src/database/X509-cert-5815967020738054664.pem',
      authMechanism: 'MONGODB-X509',
      authSource: '$external'
    })
    logger.info('mongodb conected');
  }catch(error){
    console.log({error})
    logger.error(error);
  }
  
  
}