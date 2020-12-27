const express=require('express');
const router=express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController=require('../controller/user')

//add user in database
router.post('/signup',UserController.user_signup)

//For login
router.post('/login',UserController.user_login)

//delete user in database
router.delete('/:userId',checkAuth,UserController.user_delete);

module.exports=router