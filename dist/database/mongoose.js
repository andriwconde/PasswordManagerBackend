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
            yield mongoose_1.default.connect(`mongodb+srv://cluster0.mjvcmx0.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority`, {
                sslValidate: true,
                tlsCertificateKeyFile: './src/database/X509-cert-5815967020738054664.pem',
                authMechanism: 'MONGODB-X509',
                authSource: '$external'
            });
            helpers_1.logger.info('mongodb conected');
        }
        catch (error) {
            console.log({ error });
            helpers_1.logger.error(error);
        }
    });
}
