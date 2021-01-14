let express = require('express');
let router = express.Router();
let User = require('../../controllers/UserControllers')

router.get('/getUserInfo',User.getUserInfo)

module.exports = router;