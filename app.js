const path=require('path');
const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');

//const morgan=require('morgan');

const app=express();
const dotenv=require('dotenv');
dotenv.config();
const sequelize=require('./util/database.js');
const User=require('./models/user.js');
const Chatmessages=require('./models/chatmessages');
const Group=require('./models/group');
const Usergroup=require('./models/usergroupbridge');

const userroutes=require('./routes/user');
const groupchatroutes=require('./routes/groupchat');

//const accesslogstream=fs.createWriteStream(path.join(__dirname,'access.log'));

//app.use(morgan('combined',{stream:accesslogstream}));


app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT"],
        credentials:true
    }

));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(userroutes);
app.use(groupchatroutes);

//app.use((req,res)=>{
  //  res.sendFile(path.join(__dirname,`frontend/${req.url}`))
//})

User.hasMany(Chatmessages);
Chatmessages.belongsTo(User);

Group.hasMany(Chatmessages);
Chatmessages.belongsTo(Group);


User.belongsToMany(Group,{through:Usergroup});
Group.belongsToMany(User,{through:Usergroup});

sequelize.sync().then(res=>{
    app.listen(process.env.PORT);
}).catch(err=>console.log(err));