var can1;
var can2;

var ctx1;
var ctx2;

var lasttime, deltatimme;

var bgroud = new Image();

document.body.onload = game;

var canWidth,canHeight;

var ane ;
var fruit;
var mom;
var baby = [];
var mx,my;
var data;
var wave;

function game (){
   init();
   gameloop();
}
function init(){
   //获得canvas context
   can1 = document.getElementById('canvas1');
   ctx1 = can1.getContext('2d');  //爱心鱼 圆 UI
   can2 = document.getElementById('canvas2'); //背景 海葵 果实
   ctx2 = can1.getContext('2d');

   lasttime = Date.now();
   deltatimme = 0;

   bgroud.src = "./img/background.jpg";

   canHeight = can1.height;
   canWidth = can1.width;

   ane = new aneObj();
   ane.init();

   fruit = new fruitObj();
   fruit.init();

   mom = new momObj();
   mom.init();

   baby.push( new babyObj());
   baby[0].init();
   //console.log(baby);

   mx = canWidth*0.5;
   my = canHeight*0.5;

   data = new dataObj();
   data.init();
   wave = new waveObj();
   wave.init();



 can1.addEventListener('mousemove',onMouseMove,false);
}
function gameloop(){
    requestAnimationFrame(gameloop); // 动态时间间隔，根据浏览器的性能 setInterval setTimeout 是指定时间间隔
   var now = Date.now();
   deltatimme = now - lasttime;
   if(deltatimme>30)deltatimme=30;
   lasttime = now;

   drawBackground();
   ane.draw();
   fruit.draw();
   mom.draw();

     for (var i = 0;i<baby.length; i++ ) {
        baby[i].draw();
        //console.log(baby[0] );
    }

   mom.eatfruit();
   mom.feedBaby();

   data.draw();
   wave.draw();


}
function onMouseMove(e){
   if (!data.isOver) {
         if (e.offsetX || e.layerX) {
            mx = e.offsetX == undefined ? e.layerX : e.offsetX;
            my = e.offsetY == undefined ? e.layerY : e.offsetY;

           }
       }
   //mx -=canWidth*0.5;
   //my -=canHeight *0.5;
}