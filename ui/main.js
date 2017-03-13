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
    request.onreadystatchange= function(){
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