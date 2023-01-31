let grouplist=document.getElementById('grouplist');
let creategroup=document.getElementById('creategroup');
//const obj1={};
const token=localStorage.getItem('token');
window.addEventListener('DOMContentLoaded',()=>{
try{
    axios.get("http://localhost:3000/group/grouplist",{headers:{"Authorization":token}})
    .then(result=>{
        console.log(result.data);
        for(let i=0;i<result.data.grouplist.length;i++){
        grouplist.innerHTML+=`<li style="list-style:none"><button type ="submit" class="btn btn-secondary" 
        onclick="href_func(${result.data.grouplist[i].id})">
        ${result.data.grouplist[i].groupname}</button></li><br>`
        }

    })
}
catch(err){console.log(err)}
});

function href_func(gid){
    localStorage.setItem('groupid',gid);
    console.log(gid);
    window.location.href="chatwindow.html";
}


creategroup.addEventListener('submit',oncreategrp);

function oncreategrp(e){
    e.preventDefault();
    const obj2={
        groupname:document.getElementById('gname').value,
        //email1:document.getElementById('mem_email1').value,
        //email2:document.getElementById('mem_email2').value
    }
    try{
    axios.post("http://localhost:3000/group/creategroup",obj2,
    {headers:{"Authorization":token}})
    .then(result=>{
        //console.log(result)
        alert(result.data.message)})
    }
    catch(err){console.log(err)}
}




