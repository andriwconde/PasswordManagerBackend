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
exports.saveAccount = exports.deleteAccount = exports.updateAccount = void 0;
const jsend_1 = __importDefault(require("jsend"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("../helpers");
dotenv_1.default.config();
const updateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.updateAccount = updateAccount;
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deleteAccount = deleteAccount;
const saveAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send(jsend_1.default.success({ 'hola': 'hola' }));
    }
    catch (err) {
        helpers_1.logger.error(err);
    }
});
exports.saveAccount = saveAccount;
