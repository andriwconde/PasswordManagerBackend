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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("../helpers");
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', true);
main().catch(err => helpers_1.logger.error(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.DB_QUERYSTRING, {
                sslValidate: true,
                tlsCertificateKeyFile: process.env.DB_CERTIFICATE_LOCATION,
                authMechanism: process.env.DB_AUTH_METHOD,
                authSource: process.env.DB_AUTH_SRC
            });
            helpers_1.logger.info('mongodb conected');
        }
        catch (error) {
            console.log({ error });
            helpers_1.logger.error(error);
        }
    });
}
