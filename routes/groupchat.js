const express=require('express');
const Router=express.Router();
const chatcontroller=require('../controllers/groupchat');
const authmiddleware=require('../middleware/auth');


Router.post('/group/chat',authmiddleware.userauthorization,chatcontroller.groupchatmessage);
Router.get('/group/chatmessages',chatcontroller.getallchatmessages);



module.exports=Router;