"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsend_1 = __importDefault(require("jsend"));
const jwtValidator = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];
    if (token == null) {
        res.send(jsend_1.default.error({ message: 'invalid or expired token', code: 401 }));
    }
    else {
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.send(jsend_1.default.error({ message: 'invalid or expired token', code: 403 }));
            }
            else {
                next();
            }
        });
    }
};
exports.jwtValidator = jwtValidator;
