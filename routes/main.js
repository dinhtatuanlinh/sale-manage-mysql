var express = require('express');
var router = express.Router();


const customerDataController = require(__pathControllers + "customerDataController");


/* GET users listing. */
router.get('/', (req, res, next) => { customerDataController.customerDataPage(req, res, next) });


module.exports = router;