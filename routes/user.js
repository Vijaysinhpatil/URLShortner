const express = require("express");
const { handleUserSignUp, handleUserLogin } = require("../Controllers/user");
const router = express.Router();

router.post('/',handleUserSignUp)
router.post('/login' , handleUserLogin)

module.exports = router ;
