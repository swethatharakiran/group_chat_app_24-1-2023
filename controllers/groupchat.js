const User=require('../models/user');
const Chatmessages=require('../models/chatmessages');
const jwt=require('jsonwebtoken');

exports.groupchatmessage=async(req,res,next)=>{
    
    const chatmessage=req.body.chat;
    console.log("HIIII-->>")
    
            await Chatmessages.create({chatmessage:chatmessage,userId:req.user.id})
            .then(()=>{
            res.json({message:"message sent successfully"})
           })
         .catch(err=>{
         res.send(err)
          })
        }
  
exports.getallchatmessages=async(req,res,next)=>{
  console.log("HI FROM HERE")

  try{
  const allmessages=await Chatmessages.findAll({
    attributes:['chatmessage'],
    include:[
      {
        model:User,
        attributes:['username']
      }
    ]
  });
  res.status(200).json({allmessages:allmessages});

   }
  catch(err){
    console.log(err);
  }

}