var express = require('express');
var router = express.Router();


const customerDataController = require(__pathControllers + "customerDataController");
const check_login = require(__pathServices + 'check_login');

/* GET users listing. */
router.get('/', (req, res, next) => { customerDataController.customerDataPage(req, res, next) });
router.user('/admin', check_login(req, res, next), require('./admin'));
router.user('/profile', check_login(req, res, next), require('./profile'));

module.exports = router;