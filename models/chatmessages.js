const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Chats=sequelize.define('chatmessages',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    
    chatmessage:{
        type:Sequelize.STRING,
        allowNull:false
    }
    
});


module.exports=Chats;