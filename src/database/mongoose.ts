import mongoose from "mongoose";
import dotenv from 'dotenv';
import {logger} from '../helpers'

dotenv.config();
mongoose.set('strictQuery', true);
main().catch(err => logger.error(err));

async function main() {
  try{
    await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}` as string)
    logger.info('mongodb conected');
  }catch(error){
    console.log({error})
    logger.error(error);
  }
  
  
}