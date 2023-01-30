const User=require('../models/user');
const Chatmessages=require('../models/chatmessages');
const jwt=require('jsonwebtoken');
const {Sequelize,Op}=require('sequelize');
const Group = require('../models/group');
const Usergroup = require('../models/usergroupbridge');

exports.groupchatmessage=async(req,res,next)=>{

    
    const chatmessage=req.body.chat;
    const groupid=req.body.groupid;
    console.log("HIIII-->>")
    
            await Chatmessages.create(
              {chatmessage:chatmessage,userId:req.user.id,groupId:groupid})
            .then(()=>{
            res.json({message:"message sent successfully"})
           })
         .catch(err=>{
         res.send(err)
          })
        }
  
exports.getallchatmessages=async(req,res,next)=>{

  const lastmessageid=req.query.lastmessageid;
  const groupid=req.query.groupid;

  try{
  const allmessages=await Chatmessages.findAll({
    attributes:['chatmessage','id'], 
    include:[
      {
        model:User,
        attributes:['username'],
      
        
      }       
    ],
    where:{id:{[Op.gt]:lastmessageid},  groupId:groupid}
  });

  res.status(200).json({allmessages:allmessages});

   }
  catch(err){
    console.log(err);
  }

}

exports.grouplist=async(req,res,next)=>{
    //console.log("_____HIIIII")
    try{
      const result=await Group.findAll({
        attributes:['groupname','id','groupadmin'], 
        include:[
          {
            model:User,
            where:{id:req.user.id}
          },
        ]
      });

      console.log("HELLO-->",result);
      res.status(200).json({grouplist:result});
    }
    catch(err){console.log(err)}

}

exports.creategroup=async(req,res,next)=>{
  console.log("GROUP ADMIN",req.user.id)
  try{
    const newgroup=await Group.create({groupname:req.body.groupname,
      groupadmin:req.user.id})
      console.log("mailid-->",req.body);
      //const mem1= await User.findAll({attributes:['id']},
        //{where:{email:req.body.email1}})
      //const mem1_id=mem1[0].dataValues.id;
      
      await Usergroup.create({userId:req.user.id,groupId:newgroup.id});
      //await Usergroup.create({userId:mem1_id,groupId:newgroup.id});
    
      res.json({message:'successfully created group'})
      
      }
    
    catch(err){console.log(err)}
  }

  exports.addgroupmember=async(req,res,next)=>{

    const groupid=req.body.groupid;
    const userid=req.user.id;
    const email=req.body.email;

       
    const grp_admin=await Group.findOne(
      {attributes:['groupadmin'],
      where:{id:groupid}});
    console.log("GRP-ADMIN--",grp_admin.dataValues.groupadmin);
    
      // checking whether user is admin or not
      if(grp_admin.dataValues.groupadmin==userid){
        // getting userid by using email id sent
        const mem_id=await User.findOne(
          {//attributes:['id'],
          where:{email:email}}); 
          console.log("MEM-ID-->new",mem_id.dataValues);
           // check if he is already a member
          const mem_already=await Usergroup.findOne({
            where:{userId:mem_id.dataValues.id, groupId:groupid}
          }
            );

          console.log("IAM-->",mem_already);
          if (mem_already!=null){
            res.json({message:"User is already a member of this group"});
          }

          else{
            console.log("MEMBER",mem_id.dataValues)
          if(mem_id.dataValues.id){
            
                await Usergroup.create({userId:mem_id.dataValues.id, groupId:groupid})
                .then(()=>{
                  res.json({message:"successfully added new member"})
                })
            }
            else{
              res.json({message:"No such user exists to add to group"})
            }

      }
    }
      else{
        res.json({message:"You are not admin of group to add members"})
      }
      

  }