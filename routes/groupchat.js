const express=require('express');
const Router=express.Router();
const chatcontroller=require('../controllers/groupchat');
const authmiddleware=require('../middleware/auth');


Router.post('/group/chat',authmiddleware.userauthorization,chatcontroller.groupchatmessage);
Router.get('/group/chatmessages',chatcontroller.getallchatmessages);
Router.get('/group/grouplist',authmiddleware.userauthorization,chatcontroller.grouplist);
Router.post('/group/creategroup',authmiddleware.userauthorization,chatcontroller.creategroup);

Router.post('/group/addmember',authmiddleware.userauthorization,chatcontroller.addgroupmember);
Router.get('/group/memberslist',authmiddleware.userauthorization,chatcontroller.memberslist);

Router.post('/group/makeadmin',authmiddleware.userauthorization,chatcontroller.makeadmin);
Router.post('/group/deletemem',authmiddleware.userauthorization,chatcontroller.deletemem);


module.exports=Router;