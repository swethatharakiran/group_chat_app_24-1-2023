const f3=document.getElementById('chatwindowform');
const chats=document.getElementById('grpchats');
console.log("HI from CHATFRONTEND");
setInterval(()=>{
    axios.get("http://localhost:3000/group/chatmessages")
.then((result)=>{
       console.log(result.data);
       showchats(result.data);       

}).catch(err=>{console.log(err)})
},1000);

  function showchats(data){
    for(let i=0;i<data.allmessages.length;i++)
       {
        const uname=data.allmessages[i].user.username;
        const chatmessage=data.allmessages[i].chatmessage;
        chats.innerHTML+=`<li style="list-style:none" class='chatmessage'><b>${uname}:</b> ${chatmessage}</li>`;
       }
    }


f3.addEventListener("submit",onchatsubmit);

async function onchatsubmit(e){
    e.preventDefault();
    const chat=document.getElementById('chat').value;
    const obj3={
        chat:chat
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