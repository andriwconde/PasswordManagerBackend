"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const helpers_1 = require("../helpers");
const router = (0, express_1.Router)();
router.post('/login', userController_1.userLogin);
router.post('/bioLogin', userController_1.bioLogin);
router.post('/register', userController_1.userRegister);
router.get('/version', helpers_1.jwtValidator, userController_1.getVersion);
exports.default = router;
