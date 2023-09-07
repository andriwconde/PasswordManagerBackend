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
exports.getVersion = exports.userRegister = exports.userKeysInterchange = exports.bioLogin = exports.userLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsend_1 = __importDefault(require("jsend"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../helpers");
const moment_1 = __importDefault(require("moment"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const expirationTime = parseInt(process.env.JWT_EXPIRE_TIME);
    try {
        if (req.body.email !== null && req.body.password !== null && req.body.bioPK === null) {
            console.log({ body: req.body });
            const user = yield userModel_1.default.find({ email: req.body.email });
            if (user.length) {
                bcrypt_1.default.compare(req.body.password, user[0].password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        console.log({ err });
                        res.send(jsend_1.default.error(err));
                    }
                    else if (result) {
                        const token = jsonwebtoken_1.default.sign({ userId: user[0]._id, email: user[0].email }, process.env.TOKEN_KEY, { expiresIn: expirationTime });
                        res.send(jsend_1.default.success({
                            token,
                            tokenExpDate: (0, moment_1.default)().add(1, 'h').format("DD-MM-YYYYTHH:mm:ss"),
                            user: {
                                id: user[0]._id,
                                email: user[0].email,
                                name: user[0].name,
                                bioPK: false
                            }
                        }));
                    }
                    else {
                        res.send(jsend_1.default.error(`username or password incorrect`));
                    }
                }));
            }
            else {
                res.send(jsend_1.default.error(`username or password incorrect`));
            }
        }
        else if (req.body.email !== null && req.body.password !== null && typeof req.body.bioPK === 'string') {
            const user = yield userModel_1.default.find({ email: req.body.email });
            if (user[0]._id && user[0].password !== req.body.password) {
                bcrypt_1.default.compare(req.body.password, user[0].password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        console.log({ err });
                        res.send(jsend_1.default.error(err));
                    }
                    else if (result) {
                        const setbioPK = yield userModel_1.default.updateOne({ email: req.body.email }, { $set: { bioPK: req.body.bioPK } });
                        if (setbioPK.acknowledged) {
                            res.send(jsend_1.default.success({
                                user: {
                                    id: user[0]._id,
                                    email: user[0].email,
                                    name: user[0].name,
                                    bioPK: true
                                }
                            }));
                        }
                    }
                    else {
                        res.send(jsend_1.default.error(`username or password incorrect`));
                    }
                }));
            }
        }
    }
    catch (error) {
        res.send(jsend_1.default.error(error));
        helpers_1.logger.error(error);
    }
});
exports.userLogin = userLogin;
const bioLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload, signature } = req.body;
    try {
        console.log(payload);
        const userId = payload.split('__')[1];
        const user = yield userModel_1.default.find({ _id: userId });
        const verifier = crypto_1.default.createVerify('RSA-SHA256');
        verifier.update(payload);
        const isVerified = verifier.verify(`-----BEGIN PUBLIC KEY-----\n${user[0].bioPK}\n-----END PUBLIC KEY-----`, signature, 'base64');
        if (!isVerified) {
            res.send(jsend_1.default.error({ message: 'Unfortunetely we could not verify your Biometric authentication', code: 401 }));
        }
        else {
            res.send(jsend_1.default.success({
                user: {
                    id: user[0]._id,
                    email: user[0].email,
                    name: user[0].name,
                    bioPK: true
                }
            }));
        }
    }
    catch (err) {
        res.send(jsend_1.default.error(err));
        helpers_1.logger.error(err);
    }
});
exports.bioLogin = bioLogin;
const userKeysInterchange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.updateOne({ _id: req.body.user_id }, { $set: { bioPK: req.body.bioPK } });
});
exports.userKeysInterchange = userKeysInterchange;
const userRegister = (req, res, next) => {
    bcrypt_1.default.hash(req.body.password, 8, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
        }
        else if (hash) {
            const user = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: hash
            };
            const userRes = new userModel_1.default(user);
            try {
                yield userRes.save();
                res.send(jsend_1.default.success(userRes));
            }
            catch (error) {
                res.send(jsend_1.default.error(error));
                helpers_1.logger.error(error);
            }
        }
    }));
};
exports.userRegister = userRegister;
const getVersion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(jsend_1.default.success('v1'));
});
exports.getVersion = getVersion;
