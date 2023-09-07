import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    account:{
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author', 
      },
});

const Account = mongoose.model('Account',AccountSchema); 
export default Account;