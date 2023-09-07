"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    account: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Author',
    },
});
const Account = mongoose_1.default.model('Account', AccountSchema);
exports.default = Account;
