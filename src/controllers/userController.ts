import { RequestHandler } from "express";
import  User  from "../models/userModel"
import jsend from "jsend";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { jwtValidator,logger } from "../helpers";
import fs from "fs"
import moment from "moment";
import crypto from "crypto";

dotenv.config();

export const userLogin: RequestHandler = async (req, res, next)=>{
    const privateKey = fs.readFileSync('./certificates/private-key.pem');
    const encryptedMessageBuffer = Buffer.from(req.body.encryptedAccount , 'base64');
    const decryptedMessageBuffer = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        encryptedMessageBuffer
      );
    const decryptedMessage = decryptedMessageBuffer.toString('utf8');
    const decryptedParsedAccount = JSON.parse(decryptedMessage)
    try{
        if(decryptedParsedAccount.email !== null && decryptedParsedAccount.password !== null && decryptedParsedAccount.bioPK === null){
            const user = await User.find({email:decryptedParsedAccount.email})
            if(user.length){
                bcrypt.compare(decryptedParsedAccount.password,user[0].password,async (err,result)=>{
                    if(err){
                        console.log({err})
                        res.send(jsend.error(err))
                    }else if(result){
                        const expirationTime = parseInt(process.env.JWT_EXPIRE_TIME as string)
                        const token = jwt.sign({user_id:user[0]._id,email: user[0].email}, process.env.TOKEN_KEY as string,{expiresIn: expirationTime}) 
                        res.send(jsend.success({
                            token,
                            tokenExpDate: moment().add(10,'m').format("DD-MM-YYYYTHH:mm:ss"),
                            user: {
                                id:user[0]._id,
                                email: user[0].email,
                                name: user[0].name,
                                bioPK:false
                            }
                        })) 
                    }else{
                        res.send(jsend.error(`username or password incorrect`))
                    }  
                })
            }else{
                res.send(jsend.error(`username or password incorrect`))
            }
        }else if(decryptedParsedAccount.email !== null && decryptedParsedAccount.password !== null && typeof decryptedParsedAccount.bioPK === 'string'){
            const user = await User.find({email:decryptedParsedAccount.email})
            if(user[0]._id && user[0].password !== decryptedParsedAccount.password){
                bcrypt.compare(decryptedParsedAccount.password,user[0].password,async (err,result)=>{
                    if(err){
                        console.log({err})
                        res.send(jsend.error(err))
                    }else if(result){
                        const setbioPK = await User.updateOne({_id: user[0]._id},{$set:{bioPK: decryptedParsedAccount.bioPK}})
                        if(setbioPK.acknowledged){
                            res.send(jsend.success({
                                user: {
                                    id:user[0]._id,
                                    email: user[0].email,
                                    name: user[0].name,
                                    bioPK:true
                                }
                            })) 
                        }
                    }else{
                        res.send(jsend.error(`username or password incorrect`))
                    }  
                })
            }
        }
    }catch(error){
        res.send(jsend.error(error as string))
        logger.error(error)
    }
}

export const bioLogin:RequestHandler = async(req, res, next)=>{
    const {payload,signature} = req.body
    try{
      const user_id = payload.split('__')[1]
      const user = await User.find({ _id: user_id })
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(payload);
      const isVerified = verifier.verify(
          `-----BEGIN PUBLIC KEY-----\n${user[0].bioPK}\n-----END PUBLIC KEY-----`,
          signature, 'base64'
        );
      if(!isVerified){
          res.send(jsend.error({message:'Unfortunetely we could not verify your Biometric authentication' , code: 401} ))
      }else{
          const expirationTime = parseInt(process.env.JWT_EXPIRE_TIME as string)
          const token = jwt.sign({user_id:user[0]._id,email: user[0].email}, process.env.TOKEN_KEY as string,{expiresIn: expirationTime}) 
          res.send(jsend.success({
              token,
              tokenExpDate: moment().add(10,'m').format("DD-MM-YYYYTHH:mm:ss"),
              user: {
                  id:user[0]._id,
                  email: user[0].email,
                  name: user[0].name,
                  bioPK:true
              }
          }))
      }
    }catch(err){
        res.send(jsend.error(err as string))
        logger.error(err)
    }
}

export const userFPK:RequestHandler = async(req, res, next)=>{
    try{
        const updteFPK = await User.updateOne({_id:req.body.user_id},{$set:{frontPK: req.body.frontPK}})
        if (updteFPK.acknowledged){
            res.send(jsend.success({status: true, action:'StoredFPK' ,msg:'frontend public Key stored successfully'}));
        }else{
            res.send(jsend.success({status: false, action:'StoredFPK' ,msg:'error storing frontend public Key'}));
        }
    }catch(err){
        res.send(jsend.success({status: false, action:'StoredFPK' ,msg:'error storing frontend public Key'}));
    }
        
}

export const getPublicKey: RequestHandler = (req, res, next) =>{
    const publicKey = fs.readFileSync('./certificates/public-key.pem')
        res.send(jsend.success({backendPK:publicKey.toString()}));
}

export const userRegister: RequestHandler =(req, res, next)=>{

    bcrypt.hash(req.body.password,8, async(err,hash)=>{
        if(err){
            console.log(err)
        }else if(hash){            
            const newUser = new User({
                name:req.body.name,
                surname:req.body.surname,
                email:req.body.email,
                password: hash
                })
            try{
                await newUser.save()
                res.send(jsend.success(newUser));
            }catch(error){
                res.send(jsend.error(error as string))
                logger.error(error)
            }
        }
    });
}

export const getVersion: RequestHandler = async(req, res, next)=>{

    res.send(jsend.success('v1'))
}