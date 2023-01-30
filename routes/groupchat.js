const express=require('express');
const Router=express.Router();
const chatcontroller=require('../controllers/groupchat');
const authmiddleware=require('../middleware/auth');


Router.post('/group/chat',authmiddleware.userauthorization,chatcontroller.groupchatmessage);
Router.get('/group/chatmessages',chatcontroller.getallchatmessages);
Router.get('/group/grouplist',authmiddleware.userauthorization,chatcontroller.grouplist);
Router.post('/group/creategroup',authmiddleware.userauthorization,chatcontroller.creategroup);

Router.post('/group/addmember',authmiddleware.userauthorization,chatcontroller.addgroupmember);


module.exports=Router;