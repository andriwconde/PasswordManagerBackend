import { RequestHandler } from "express";
import  Account  from "../models/accountModel"
import jsend from "jsend";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { jwtValidator,logger } from "../helpers";
import moment from "moment";
import crypto from "crypto";

dotenv.config();

export const updateAccount: RequestHandler = async (req, res, next)=>{
    
}

export const deleteAccount:RequestHandler = async(req, res, next)=>{
    
}

export const saveAccount:RequestHandler = async(req, res, next)=>{

    try{

        res.send(jsend.success({'hola':'hola'}));
    }catch(err){
        logger.error(err)
    }
}
