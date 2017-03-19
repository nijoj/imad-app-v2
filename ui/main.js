/*console.log('Loaded!');
//change html
var element = document.getElementById('maintext');
element.innerHTML = 'New text';
//move image
var marginLeft=0;
var image=document.getElementById('madi');
function moveRight(){
    marginLeft=marginLeft+5;
    image.style.marginLeft=marginLeft+'px';
}
image.onclick=function(){
    var interval=setInterval(moveRight,50)
};*/

//counter endpoint

var button=document.getElementById('counter');
button.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange= function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                var counter=request.responseText;
                var span=document.getElementById('count');
                span.innerHTML=counter.toString(); 
            }
        }
    };
    request.open('GET','/counter',true);
    request.send(null);
    
};
//submit btn
var submit=document.getElementById('submit_btn');
submit.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange= function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                var names=request.responseText;
                names=JSON.parse(names);
                var list='';
                for(var i=0;i<names.length;i++){
                    list+='<li>'+names[i]+'</li>';
                }
        var ul=document.getElementById('namelist');
        ul.innerHTML=list;
        }
    }
};
var nameInput=document.getElementById('name');
var name=nameInput.value;
request.open('GET','/submit_name?name='+name,true);
request.send(null);
};
//login
var submit1=document.getElementById('submit_btn1');
submit1.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange= function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                alert('logged in successfully'); 
            }
            else if(request.status===403){
                alert('username/password incorrect');
            }
            else if(request.state===500){
                alert('Someting went wrong on server');
            }
    }
};
var username=document.getElementById('username').value;
var password=document.getElementById('password').value;
request.open('POST','/login',true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username:username,password:password}));
};