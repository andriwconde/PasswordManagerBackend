"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAccount = exports.getAccount = exports.getAccounts = exports.deleteManyAccounts = exports.deleteAccount = exports.updateAccount = void 0;
const accountModel_1 = __importDefault(require("../models/accountModel"));
const jsend_1 = __importDefault(require("jsend"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("../helpers");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv_1.default.config();
const updateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const update = yield accountModel_1.default.updateOne({ _id: req.body.account_id }, { $set: { account: req.body.encryptedAccount } });
        if (update.acknowledged) {
            res.send(jsend_1.default.success({ status: true, action: 'Updated', msg: 'account updated successfully' }));
        }
        else {
            res.send(jsend_1.default.success({ status: false, action: 'Updated', msg: 'something was wrong updating account', code: 402 }));
        }
    }
    catch (err) {
        helpers_1.logger.error(err);
    }
});
exports.updateAccount = updateAccount;
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteAccount = yield accountModel_1.default.deleteOne({ _id: req.body.account_id });
        if (deleteAccount.acknowledged) {
            res.send(jsend_1.default.success({ status: true, action: 'Deleted', msg: 'account deleted successfully' }));
        }
        else {
            res.send(jsend_1.default.success({ status: false, action: 'Deleted', msg: 'something was wrong deleting account', code: 402 }));
        }
    }
    catch (err) {
        helpers_1.logger.error(err);
    }
});
exports.deleteAccount = deleteAccount;
const deleteManyAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteAccounts = yield accountModel_1.default.deleteMany({ _id: { $in: req.body.accountsArray } });
        if (deleteAccounts.acknowledged) {
            res.send(jsend_1.default.success({ status: true, action: 'Deleted', msg: 'accounts deleted successfully' }));
        }
        else {
            res.send(jsend_1.default.success({ status: false, action: 'Deleted', msg: 'something was wrong deleting account', code: 402 }));
        }
    }
    catch (err) {
        helpers_1.logger.error(err);
    }
});
exports.deleteManyAccounts = deleteManyAccounts;
const getAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.body.user_id;
    const user = yield userModel_1.default.find({ _id: user_id });
    const accounts = yield accountModel_1.default.find({ user_id: new mongodb_1.ObjectId(user_id) });
    const privateKey = fs_1.default.readFileSync('./certificates/private-key.pem');
    const frontEcryptedAcounts = accounts.map(account => {
        const encryptedMessageBuffer = Buffer.from(account.account, 'base64');
        const decryptedMessageBuffer = crypto_1.default.privateDecrypt({
            key: privateKey,
            padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
        }, encryptedMessageBuffer);
        const decryptedMessage = decryptedMessageBuffer.toString('utf8');
        const decryptedParsedAccount = JSON.parse(decryptedMessage);
        decryptedParsedAccount._id = account._id;
        const decryptedStringifiedAccount = JSON.stringify(decryptedParsedAccount);
        const encryptedBuffer = crypto_1.default.publicEncrypt({
            key: user[0].frontPK,
            padding: crypto_1.default.constants.RSA_PKCS1_PADDING, // PKCS#1 padding
        }, Buffer.from(decryptedStringifiedAccount));
        const fontEncryptedAccount = encryptedBuffer.toString('base64');
        return fontEncryptedAccount;
    });
    res.send(jsend_1.default.success(frontEcryptedAcounts));
});
exports.getAccounts = getAccounts;
const getAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const account_id = req.body.account_id;
    const account = yield accountModel_1.default.find({ _id: new mongodb_1.ObjectId(account_id) });
    const user = yield userModel_1.default.find({ _id: account[0].user_id });
    const privateKey = fs_1.default.readFileSync('./certificates/private-key.pem');
    const encryptedMessageBuffer = Buffer.from(account[0].account, 'base64');
    const decryptedMessageBuffer = crypto_1.default.privateDecrypt({
        key: privateKey,
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
    }, encryptedMessageBuffer);
    const decryptedMessage = decryptedMessageBuffer.toString('utf8');
    const decryptedParsedAccount = JSON.parse(decryptedMessage);
    decryptedParsedAccount._id = account[0]._id;
    const decryptedStringifiedAccount = JSON.stringify(decryptedParsedAccount);
    const encryptedBuffer = crypto_1.default.publicEncrypt({
        key: user[0].frontPK,
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING, // PKCS#1 padding
    }, Buffer.from(decryptedStringifiedAccount));
    const fontEncryptedAccount = encryptedBuffer.toString('base64');
    res.send(jsend_1.default.success(fontEncryptedAccount));
});
exports.getAccount = getAccount;
const saveAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccount = new accountModel_1.default({
        account: req.body.encryptedAccount,
        user_id: req.body.user_id
    });
    try {
        const newAccountRes = yield newAccount.save();
        if (typeof newAccountRes.account === 'string') {
            res.send(jsend_1.default.success({ status: true, action: 'Create', msg: 'account created successfully' }));
        }
        else {
            res.send(jsend_1.default.success({ status: false, action: 'Create', msg: 'error creating account' }));
        }
    }
    catch (err) {
        helpers_1.logger.error(err);
    }
});
exports.saveAccount = saveAccount;
