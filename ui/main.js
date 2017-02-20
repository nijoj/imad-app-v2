console.log('Loaded!');
//change html
var element = document.getElementById('maintext');
element.innerHTML = 'New text';
//move image
var marginLeft=0;
var image=document.getElementById('madi');
function moveRight(){
    marginLeft=marginLeft+1;
    image.style.marginLeft=marginLeft+'px';
}
image.onClick=function(){
    var interval=setInterval(moveRight,50)
};