import { RequestHandler } from "express";
import  User  from "../models/userModel"
import jsend from "jsend";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { jwtValidator,logger } from "../helpers";
import moment from "moment";
import crypto from "crypto";

dotenv.config();

export const userLogin: RequestHandler = async (req, res, next)=>{
    const expirationTime = parseInt(process.env.JWT_EXPIRE_TIME as string)
    try{
        if(req.body.email !== null && req.body.password !== null && req.body.bioPK === null){
            console.log({body:req.body})
            const user = await User.find({email:req.body.email})
            if(user.length){
                bcrypt.compare(req.body.password,user[0].password,async (err,result)=>{
                    if(err){
                        console.log({err})
                        res.send(jsend.error(err))
                    }else if(result){
                        const token = jwt.sign({userId:user[0]._id,email: user[0].email}, process.env.TOKEN_KEY as string,{expiresIn: expirationTime}) 
                        res.send(jsend.success({
                            token,
                            tokenExpDate: moment().add(1,'h').format("DD-MM-YYYYTHH:mm:ss"),
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
        }else if(req.body.email !== null && req.body.password !== null && typeof req.body.bioPK === 'string'){
            const user = await User.find({email:req.body.email})
            if(user[0]._id && user[0].password !== req.body.password){
                bcrypt.compare(req.body.password,user[0].password,async (err,result)=>{
                    if(err){
                        console.log({err})
                        res.send(jsend.error(err))
                    }else if(result){
                        const setbioPK = await User.updateOne({email:req.body.email},{$set:{bioPK: req.body.bioPK}})
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
        console.log(payload)
        const userId = payload.split('__')[1]
        const user = await User.find({ _id: userId })

        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(payload);
        const isVerified = verifier.verify(
            `-----BEGIN PUBLIC KEY-----\n${user[0].bioPK}\n-----END PUBLIC KEY-----`,
            signature, 'base64'
          );
        if(!isVerified){
            res.send(jsend.error({message:'Unfortunetely we could not verify your Biometric authentication' , code: 401} ))
        }else{
            res.send(jsend.success({
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

export const userKeysInterchange:RequestHandler = async(req, res, next)=>{

    await User.updateOne({_id:req.body.user_id},{$set:{bioPK: req.body.bioPK}})
}

export const userRegister: RequestHandler =(req, res, next)=>{

    bcrypt.hash(req.body.password,8, async(err,hash)=>{
        if(err){
            console.log(err)
        }else if(hash){
            const user = {
                name:req.body.name,
                surname:req.body.surname,
                email:req.body.email,
                password: hash
                }
            
            const userRes = new User(user)
            try{
                await userRes.save()
                res.send(jsend.success(userRes));
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