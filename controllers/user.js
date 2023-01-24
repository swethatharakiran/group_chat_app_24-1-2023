const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
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
                res.json({message:"User already exists, Please Login"})
            }
            else{
            await User.create({username:username,email:email,phone:phone,password:hash})
            .then(()=>{
            res.json({message:"successfully signed up"})
           })
         .catch(err=>{
         res.send(err)
          })
         } //else ends
        }
      })
        
}


exports.loginaction=(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    if(email==undefined||email.length===0||password==undefined||password.length===0){
        res.status(400).json({message:"fields should not be empty"});
    }
    else{
        User.findAll({where:{email:email}}).then(user=>{
          if(user[0].email==email)
            {
              console.log(user[0].password);//from database
              bcrypt.compare(password,user[0].password,async(err,result)=>{
                    if(err){
                        throw new Error("something went wrong");
                    }
                    else{
                        if(result===true){
                            
                                res.status(200).json({message:"login successful",
                                statuscode:'200',
                                token:generatetoken(user[0].id)})
                            
                            }
                        else{
                            res.status(401).json({message:"User not authorized/password is incorrect"})
                        }
                    }
                })                       
            }
            else{
                res.status(404).json({message:"user does not exist"})
            }
        }).catch(err=>res.status(500).json({message:"error and mostly user does not exist"}));
    }
    }
    catch(err){console.log(err)}

}

function generatetoken(id){
    return jwt.sign({userid:id},'secretkey123') // encrypts userid using secretkey123 key
}
