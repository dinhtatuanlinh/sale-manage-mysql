var express = require('express');
var router = express.Router();

const profileController = require(__pathControllers + "profileController");

router.get('/', (req, res, next) => { profileController.profileDataPage(req, res, next) });
router.post('/edit/:id', (req, res, next) => { profileController.profileEdit(req, res, next) });
module.exports = router;