const f3=document.getElementById('chatwindowform');
f3.addEventListener("submit",onchatsubmit);

async function onchatsubmit(e){
    e.preventDefault();
    const chat=document.getElementById('chat').value;
    const obj3={
        chat:chat
    }
    try{
    const response=await axios.post("http://localhost:3000/group/chat",obj3)
    
    
    console.log(response.data)
    alert(response.data.message); //message sent success
    
    }

    catch(err){console.log(err)
        document.body.innerHTML+=`<div style="color:red">${err.message}</div>`
        
    
    };
}