import mongoose from "mongoose";
import validator from "validator"

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true
    },
    surname:{
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value: string){
            if(value.length < 8){
                throw new Error('The password must be at least 8 characters')
            }
        }
    },
    publicKey:{
        type: String,
        unique: true,
    }
});

const User = mongoose.model('Users',UserSchema); 
export default User;
