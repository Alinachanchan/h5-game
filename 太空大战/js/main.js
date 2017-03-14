var can;

var ctx;

var canWidth;
var canHeight;

var mx;
var my;

var plane;
var bullet;
var enemyPlane;
var enemyBullet;
var score;
var equit;
var lifebox;

function init(){
	can =document.getElementById("mycanvas");
    ctx = can.getContext('2d');
	canWidth = can.width;
	canHeight = can.height;
    
    drawBg();
    //绑定事件
    can.addEventListener("mousemove",onMouseMove,false);
    can.addEventListener("click",onClick,false);
    document.addEventListener("keydown",keyMove,false);
    
    plane = new Plane("./imgs/plane.gif");
	plane.init();
	
	bullet = new Bullet("me");
	bullet.init();
	
	enemyPlane = new EnemyPlane();
	enemyPlane.init();
	
	enemyBullet = new Bullet("enemy");
    enemyBullet.init();
    
    equit = new Equipment();
    equit.init();
    
    lifebox = new LifeBox();
    lifebox.init();
    
    score = new Score();
    score.init();
}
function gameOver(){
	
	 can.removeEventListener("mousemove",onMouseMove,false);
    can.removeEventListener("click",onClick,false);
    document.removeEventListener("keydown",keyMove,false);
    score.isOver = true;
    
    
}
window.onload = function(){
   
	init();
    gameloop();

//	plane.draw();
};
function gameloop(){
	window.requestAnimationFrame(gameloop);     //根据浏览器性能     动态指定动画时间
	ctx.clearRect(0,0,canWidth,canHeight);
    drawBg();
    plane.draw();
    score.draw();
    enemyPlane.draw();
    bullet.draw();  
    enemyBullet.draw();
    equit.draw();
    lifebox.draw();
//  bullet.born(10,10);

}
function onMouseMove(e){          
         if (e.offsetX || e.layerX) {
            mx = e.offsetX == undefined ? e.layerX : e.offsetX;
            my = e.offsetY == undefined ? e.layerY : e.offsetY;
          }
}
function onClick(e){
     plane.attack();
}
function keyMove(event) {
    switch(event.keyCode){
        case 38:
            plane.move("up");
            break;
        case 40:
            plane.move("down");    
            break;
        case 37:
            plane.move("left");
            break;
        case 39:
            plane.move("right");   
            break;
    }
}