const f3=document.getElementById('chatwindowform');
const chats=document.getElementById('grpchats');
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
    const token=localStorage.getItem('token');
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

let lastmessageid;
window.addEventListener('DOMContentLoaded',()=>{
    let oldmessages=[];
    console.log("--->",oldmessages)
    const local_data=JSON.parse(localStorage.getItem('oldmessages'));
    console.log("local_data",local_data)
    console.log(oldmessages);
    
    const gid=localStorage.getItem('groupid');
    console.log("GID",gid);
    if(local_data===null){
        lastmessageid=-1;
        axios.get(
    `http://localhost:3000/group/chatmessages?lastmessageid=${lastmessageid}&groupid=${gid}`)
        .then((result)=>{
       console.log("hello-->",result.data.allmessages[0].id);
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

})

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