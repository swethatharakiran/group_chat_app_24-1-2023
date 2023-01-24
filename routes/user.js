const express=require('express');
const Router=express.Router();
const usercontroller=require('../controllers/user');


Router.post('/user/signup',usercontroller.signupaction);

module.exports=Router;