"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../controllers/accountController");
const router = (0, express_1.Router)();
router.post('/update', accountController_1.updateAccount);
router.post('/delete', accountController_1.deleteAccount);
router.post('/add', accountController_1.saveAccount);
exports.default = router;
