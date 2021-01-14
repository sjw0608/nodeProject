var express = require('express');
var router = express.Router();
var Login = require('./modules/login')
var User = require('./modules/user')

router.use(Login)
router.use(User)

module.exports = router;
