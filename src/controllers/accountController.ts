import { RequestHandler } from "express";
import  Account  from "../models/accountModel"
import jsend from "jsend";
import dotenv from 'dotenv';
import { logger } from "../helpers";
import crypto from "crypto";
import fs from "fs"
import { ObjectId } from "mongodb";
import  User  from "../models/userModel"


dotenv.config();

export const updateAccount: RequestHandler = async (req, res, next)=>{
  try{
  const update = await Account.updateOne({_id:req.body.account_id},{$set:{account: req.body.encryptedAccount}})
  if(update.acknowledged){
    res.send(jsend.success({status: true, action:'Updated', msg:'account updated successfully'}))
  }else{
    res.send(jsend.success({status: false, action:'Updated', msg:'something was wrong updating account', code:402}))
  }
}catch(err){
    logger.error(err)
}
}

export const deleteAccount:RequestHandler = async(req, res, next)=>{
  try{
    const deleteAccount = await Account.deleteOne({_id:req.body.account_id})
    if(deleteAccount.acknowledged){
      res.send(jsend.success({status: true, action:'Deleted' ,msg:'account deleted successfully'}))
    }else{
      res.send(jsend.success({status: false, action:'Deleted' , msg:'something was wrong deleting account', code:402}))
    }
  }catch(err){
      logger.error(err)
  }
}

export const deleteManyAccounts:RequestHandler = async(req, res, next)=>{
  try{
    const deleteAccounts = await Account.deleteMany({_id:{$in:req.body.accountsArray}})
    if(deleteAccounts.acknowledged){
      res.send(jsend.success({status: true, action:'Deleted' ,msg:'accounts deleted successfully'}))
    }else{
      res.send(jsend.success({status: false, action:'Deleted' , msg:'something was wrong deleting account', code:402}))
    }
  }catch(err){
      logger.error(err)
  }
}

export const getAccounts:RequestHandler = async(req, res, next)=>{
    const user_id = req.body.user_id
    const user = await User.find({_id:user_id})
    const accounts = await Account.find({user_id: new ObjectId(user_id)})
    const privateKey = fs.readFileSync('./certificates/private-key.pem');
    const frontEcryptedAcounts = accounts.map(account=>{
        const encryptedMessageBuffer = Buffer.from(account.account , 'base64');
        const decryptedMessageBuffer = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            encryptedMessageBuffer
          );
        const decryptedMessage = decryptedMessageBuffer.toString('utf8');
        const decryptedParsedAccount = JSON.parse(decryptedMessage)
        decryptedParsedAccount._id = account._id
        const decryptedStringifiedAccount = JSON.stringify(decryptedParsedAccount)
        const encryptedBuffer = crypto.publicEncrypt(
            {
              key: user[0].frontPK,
              padding: crypto.constants.RSA_PKCS1_PADDING, // PKCS#1 padding
            }as any,
            Buffer.from(decryptedStringifiedAccount)
          );
        const fontEncryptedAccount = encryptedBuffer.toString('base64')
        return fontEncryptedAccount
    })
    res.send(jsend.success(frontEcryptedAcounts));
}

export const getAccount:RequestHandler = async(req, res, next)=>{
    const account_id = req.body.account_id
    const account = await Account.find({_id: new ObjectId(account_id)})
    const user = await User.find({_id:account[0].user_id})
    const privateKey = fs.readFileSync('./certificates/private-key.pem');
    const encryptedMessageBuffer = Buffer.from(account[0].account, 'base64');
    const decryptedMessageBuffer = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        encryptedMessageBuffer
      );
    const decryptedMessage = decryptedMessageBuffer.toString('utf8');
    const decryptedParsedAccount = JSON.parse(decryptedMessage)
    decryptedParsedAccount._id = account[0]._id
    const decryptedStringifiedAccount = JSON.stringify(decryptedParsedAccount)
    const encryptedBuffer = crypto.publicEncrypt(
        {
          key: user[0].frontPK,
          padding: crypto.constants.RSA_PKCS1_PADDING, // PKCS#1 padding
        } as any,
        Buffer.from(decryptedStringifiedAccount)
      );
    const fontEncryptedAccount = encryptedBuffer.toString('base64')
    res.send(jsend.success(fontEncryptedAccount));
}

export const saveAccount:RequestHandler = async(req, res, next)=>{
    const newAccount = new Account({
        account: req.body.encryptedAccount,
        user_id: req.body.user_id
    })
    try{
        const newAccountRes = await newAccount.save()
        if(typeof newAccountRes.account === 'string'){
          res.send(jsend.success({status: true, action:'Create' ,msg:'account created successfully'}))
        }else{
            res.send(jsend.success({status: false, action:'Create' ,msg:'error creating account'}));
        }
    }catch(err){
        logger.error(err)
    }
}
