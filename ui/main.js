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

var button=document.getElementById("counter");
var counter=0;
button.onClick=function(){
    counter++;
    var span=document.getElementById('count');
    span.innerHTML=counter.toString();
}