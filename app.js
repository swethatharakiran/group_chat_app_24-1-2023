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

const userroutes=require('./routes/user');

//const accesslogstream=fs.createWriteStream(path.join(__dirname,'access.log'));

//app.use(morgan('combined',{stream:accesslogstream}));


app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(userroutes);

//app.use((req,res)=>{
  //  res.sendFile(path.join(__dirname,`frontend/${req.url}`))
//})

sequelize.sync().then(res=>{
    app.listen(process.env.PORT);
}).catch(err=>console.log(err));