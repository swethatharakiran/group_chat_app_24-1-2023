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
      
      await Usergroup.create({isadmin:1,userId:req.user.id,groupId:newgroup.id});
      //await Usergroup.create({userId:mem1_id,groupId:newgroup.id});
    
      res.json({message:'successfully created group'})
      
      }
    
    catch(err){console.log(err)}
  }

  exports.addgroupmember=async(req,res,next)=>{

    const groupid=req.body.groupid;
    const userid=req.user.id;
    const email=req.body.email;

       
    const grp_admin=await Usergroup.findOne(
      {attributes:['isadmin'],
      where:{groupId:groupid,userId:req.user.id}});
    console.log("GRP-ADMIN--",grp_admin.dataValues.isadmin);
    
      // checking whether user is admin or not
      if(grp_admin.dataValues.isadmin==1){//he is admin
        // getting userid(of to be mem) by using email id sent for adding to grp
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
            
                await Usergroup.create({isadmin:0,userId:mem_id.dataValues.id, groupId:groupid})
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

  exports.memberslist=async(req,res,next)=>{
        
     const userid=req.user.id;
     const groupid=req.query.groupid;
     console.log("MEMLIST");
     try{
     const userids=await Usergroup.findAll({
      attributes:['userId','groupId','isadmin'], 
      where:{groupId:groupid},
    });
    console.log("USERIDS length-->>>",userids.length);
    let user_ids=[];
    let ids_withadminstatus=[]
    for(let i=0;i<userids.length;i++){
    user_ids.push(userids[i].dataValues.userId);
      ids_withadminstatus.push({userid:userids[i].dataValues.userId, 
        isadmin:userids[i].dataValues.isadmin});
    }
    console.log("USERIDS-->>>",user_ids);
    const usernames= await User.findAll(
      {
        attributes:['username','id'],
        where:{id:{[Op.in]:user_ids}}
      },
    );
    const grp_mem_det=[];
    for(let i=0;i<usernames.length;i++){
      const member_det=await Usergroup.findOne({where:{userId:usernames[i].id,groupId:groupid}})
      grp_mem_det.push({username:usernames[i].username,
        isadmin:member_det.isadmin, 
        id:member_det.userId})
        console.log(member_det.isadmin)
    }
      //await User.findAll({where:{userids}})
      console.log("USERNAMES-->",usernames);
      console.log("MEM_DETAILS-->>>",grp_mem_det);

      res.json({memlist:grp_mem_det})
    }
    catch(err){console.log(err)}
  }

    exports.makeadmin=async(req,res,next)=>{
        try{
          const groupid=req.body.groupid;
          const grp_admin=await Usergroup.findOne(
            {attributes:['isadmin'],
            where:{groupId:groupid,userId:req.user.id}});
          console.log("GRP-ADMIN--",grp_admin.dataValues.isadmin);
          
            // checking whether user is admin or not
            if(grp_admin.dataValues.isadmin==1){//he is admin

          await Usergroup.update(
            {isadmin:1},
            {where:{userId:req.body.mem_id,groupId:req.body.groupid}})
            .then(()=>{
              res.json({message:"made as admin successfully"})
            })
          }
          else{
            res.json({message:"You are not admin"})
          }
        }
        catch(err){console.log(err)}


  }

  exports.deletemem=async(req,res,next)=>{
    try{
      const groupid=req.body.groupid;
      const grp_admin=await Usergroup.findOne(
        {attributes:['isadmin'],
        where:{groupId:groupid,userId:req.user.id}});
      console.log("GRP-ADMIN--",grp_admin.dataValues.isadmin);
      
        // checking whether user is admin or not
        if(grp_admin.dataValues.isadmin==1){//he is admin

      await Usergroup.destroy({where:{userId:req.body.mem_id,groupId:req.body.groupid}})
      .then(()=>{
        res.json({message:"Removed Successfully"});
        console.log("FROM DEL BKND");
      })
     }
     else{
      res.json({message:"You are not admin"})
     }

    }
    catch(err){console.log(err)}

  }