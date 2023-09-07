"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
require("./database/mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("./helpers");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use('/user', userRoutes_1.default);
app.use('/account', accountRoutes_1.default);
app.listen(port, () => {
    helpers_1.logger.info(`Server listening on port: ${port} at http://localhost:${port}`);
});
