let express = require('express');
let router = express.Router();
let Login = require('../../controllers/LoginControllers')

router.get('/getCode', Login.createdCode)
router.post('/register', Login.register)
router.post('/login',Login.login)

module.exports = router;
