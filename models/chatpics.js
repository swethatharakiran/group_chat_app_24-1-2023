const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Chatimage=sequelize.define('chatpicture',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    
    picture:{
        type:Sequelize.BLOB,
        
    }
    
});


module.exports=Chatimage;