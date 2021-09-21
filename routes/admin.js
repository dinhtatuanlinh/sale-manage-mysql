var express = require('express');
var router = express.Router();

const adminController = require(__pathControllers + "adminController");
router.get('/', (req, res, next) => { adminController.adminPage(req, res, next) });
router.post('/editsetting', (req, res, next) => { adminController.adminEditSetting(req, res, next) });
router.post('/properties/:param', (req, res, next) => { adminController.adminChangeProperties(req, res, next) });

module.exports = router;