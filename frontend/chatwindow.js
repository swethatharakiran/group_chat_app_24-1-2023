const f3=document.getElementById('chatwindowform');
const chats=document.getElementById('grpchats');
const mem_list=document.getElementById('mem_list');
const token=localStorage.getItem('token');
const gid=localStorage.getItem('groupid');
//console.log("HI from CHATFRONTEND");
//setInterval(()=>{
//    axios.get("http://localhost:3000/group/chatmessages")
//.then((result)=>{
       //console.log(result.data);
 //      showchats(result.data.allmessages);       

//}).catch(err=>{console.log(err)})
//},1000);

  function showchats(data){
    for(let i=0;i<data.length;i++)
       {
        const uname=data[i].username;
        const chatmessage=data[i].chatmessage;
        chats.innerHTML+=`<li style="list-style:none" class='chatmessage'><b>${uname}:</b> ${chatmessage}</li>`;
       }
    }


f3.addEventListener("submit",onchatsubmit);

async function onchatsubmit(e){
    e.preventDefault();
    const chat=document.getElementById('chat').value;
    const groupid=localStorage.getItem('groupid');
    const obj3={
        chat:chat,
        groupid:groupid
    }
    
    try{
    const response=await axios.post("http://localhost:3000/group/chat",obj3,
    {headers:{"Authorization":token}})
    
    console.log(response.data)
    alert(response.data.message); //message sent success
    
    }

    catch(err){console.log(err)
        document.body.innerHTML+=`<div style="color:red">${err.message}</div>`
        
    
    };
 
}
// Refresh
let lastmessageid;
window.addEventListener('DOMContentLoaded',async()=>{
    let oldmessages=[];
    console.log("--->",oldmessages)
    const local_data=JSON.parse(localStorage.getItem('oldmessages'));
    console.log("local_data",local_data)
    //console.log(oldmessages);
        
    console.log("GID",gid);
    try{
    if(local_data==null||local_data.length==0){
        lastmessageid=-1;
        axios.get(
    `http://localhost:3000/group/chatmessages?lastmessageid=${lastmessageid}&groupid=${gid}`)
        .then((result)=>{
       //console.log("hello-->",result.data.allmessages[0].id);
       const totalmsgs=result.data.allmessages.length;
       if(totalmsgs<10){
        for(let i=0;i<result.data.allmessages.length;i++){
            oldmessages.push({id:result.data.allmessages[i].id,
                      username:result.data.allmessages[i].user.username,
                      chatmessage:result.data.allmessages[i].chatmessage });
           }

       }

       //showchats(result.data.allmessages); 
       //copying to local storage only last 10 messages
       else{
       for(let i=result.data.allmessages.length-10;i<result.data.allmessages.length;i++){
        oldmessages.push({id:result.data.allmessages[i].id,
                  username:result.data.allmessages[i].user.username,
                  chatmessage:result.data.allmessages[i].chatmessage });
       }
    }
       console.log("OLDIES",oldmessages);
       showchats(oldmessages);
       localStorage.setItem('oldmessages',JSON.stringify(oldmessages));      

}).catch(err=>{console.log(err)})
}
else{
    oldmessages=JSON.parse(localStorage.getItem('oldmessages'));
    console.log("oldmsgs--",oldmessages);
    console.log("oldmsgs",oldmessages[oldmessages.length-1].id);
    lastmessageid=oldmessages[oldmessages.length-1].id;
axios.get(
`http://localhost:3000/group/chatmessages?lastmessageid=${lastmessageid}&groupid=${gid}`)

  .then((result1)=>{
       //console.log(result.data);
        let newmessages=[];
       for(let i=0;i<result1.data.allmessages.length;i++){
        newmessages.push({id:result1.data.allmessages[i].id,
                  username:result1.data.allmessages[i].user.username,
                  chatmessage:result1.data.allmessages[i].chatmessage });
       }
       let messages=oldmessages.concat(newmessages);
       console.log("newmsgs--",newmessages);
       console.log("msgs-concat",messages);
       showchats(messages); 
       if (messages.length>10){
        messages.shift();
       }  
       localStorage.setItem('oldmessages',JSON.stringify(messages));
        

}).catch(err=>{console.log(err)})
}
// To list/display group members

await axios.get(`http://localhost:3000/group/memberslist?groupid=${gid}`,
{headers:{"Authorization":token}})
.then(result=>{
    console.log("LISTING",result.data.memlist);
    const grp_mem=result.data.memlist;
    console.log("FRONTEND",grp_mem);
    for(let i=0;i<grp_mem.length;i++){
        if(grp_mem[i].isadmin==0){
        mem_list.innerHTML+=`<tr id="${grp_mem[i].id}">
        <td><b>${grp_mem[i].username}</b></td> 
        <td id="${grp_mem[i].id}a"><button onclick="make_admin('${grp_mem[i].id}')">
        make admin</button></td>
        <td><button  onclick="remove_mem('${grp_mem[i].id}')">remove</button></td>
        </tr>`
        }
        else{
            mem_list.innerHTML+=
            `<tr id="${grp_mem[i].id}">
            <td><b>${grp_mem[i].username}</b></td>
            <td> admin</td>
        <td><button  onclick="remove_mem('${grp_mem[i].id}')">remove</button></td>
        </tr>`
        }
      }
    });

}// try ends
catch(err){console.log(err)}

// to get picture sent in grp
})

async function make_admin(mem_id){//userid
    const ob1={
        mem_id:mem_id,
        groupid:gid
    }
    await axios.post("http://localhost:3000/group/makeadmin",
    ob1,{headers:{"Authorization":token}})
    .then(result=>{
        const td=document.getElementById(`${mem_id}a`);
        td.innerHTML="admin"
        alert(result.data.message);
    })
    .catch(err=>console.log(err))

}

async function remove_mem(mem_id){
    
    const memid={
        mem_id:mem_id,
        groupid:gid
    }

    await axios.post("http://localhost:3000/group/deletemem",
    memid,{headers:{"Authorization":token}})
    .then((result)=>{
        console.log(result);
        mem_list.deleteRow(document.getElementById(mem_id))
        console.log(result.data.message);
        alert(result.data.message);
    }).catch(err=>{
        console.log(err)
        
    })


}

function search_user(){
    //e.preventDefault();
    const token=localStorage.getItem('token');
    const mem=document.getElementById('searchuser').value;
    const gid={
        groupid:localStorage.getItem('groupid'),
        email:mem
    };
    try{
        axios.post("http://localhost:3000/group/addmember",
        gid, {headers:{"Authorization":token}})
        .then(result=>{
            alert(result.data.message);
        })
    }
    catch(err){console.log(err)}

}

async function send_image(files){

    alert(files[0].name);
    console.log(files[0]);
    let file1=files[0];
    const groupid=localStorage.getItem('groupid');
    const obj4={
        groupid:groupid,
        picture:file1
    }
    
    try{
    const response=await axios.post("http://localhost:3000/group/chatimage",obj4,
    {headers:{"Authorization":token}})
    
    console.log(response.data)
    alert(response.data.message); //message sent success
    
    }

    catch(err){console.log(err)
        document.body.innerHTML+=`<div style="color:red">${err.message}</div>`
        
    
    };
    console.log(file1);
   
}