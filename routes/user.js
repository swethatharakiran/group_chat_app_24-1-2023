const express=require('express');
const Router=express.Router();
const usercontroller=require('../controllers/user');


Router.post('/user/signup',usercontroller.signupaction);
Router.post('/user/login',usercontroller.loginaction);

module.exports=Router;