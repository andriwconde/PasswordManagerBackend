import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
});

const Account = mongoose.model('Account',AccountSchema); 
export default Account;