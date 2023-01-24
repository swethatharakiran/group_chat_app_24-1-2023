const User=require('../models/user');
const bcrypt=require('bcrypt');
const saltrounds=10;

exports.signupaction=async(req,res,next)=>{
    
    const username=req.body.username;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;

    if(username ==undefined|| username.length===0||email==undefined ||
        email.length===0 || phone==undefined||phone.length===0||
        password==undefined||password.length===0){
        res.status(400).json({err:"null parameters , something is not entered"})
    }
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
            const duplicate=await User.findAll({where:{email:email}})
            if(duplicate.length!=0){
                res.json({message:"User already exists, give different mailid"})
            }
            else{
            await User.create({username:username,email:email,phone:phone,password:hash})
            .then(()=>{
            res.json({message:"successfully created new user"})
           })
         .catch(err=>{
         res.send(err)
          })
         } //else ends
        }
      })
        
}