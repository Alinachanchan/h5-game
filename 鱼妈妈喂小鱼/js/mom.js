var momObj = function(){
    this.x;
    this.y;
    this.angle ;
    this.momTail=[];
    this.momTail_count ;
    this.clock;

    this.momEye =[];
    this.momEye_count ;
    this.momEye_clock;
    this.momEye_random;

    this.momBody =[];
    this.momBodyBlue =[];
    this.momBody_count;

   this.hasEatOrange ;
    this.hasEatBlue;
    this.flag;
    //this.lastbeta;

}
momObj.prototype.init= function(){

    this.x = canWidth*0.5;
    this.y = canHeight*0.5;
    this.angle = 0 ;
    //this.lastbeta =0;
    //console.log(this.angle);
    for(var i=0; i<8;i++){
        this.momTail[i] = new Image();
        this.momTail[i].src = "img/bigTail"+i+".png";
    }
    this.momTail_count = 0;
    this.clock =0;
   for(var i=0;i<2;i++){
       this.momEye[i] = new Image();
       this.momEye[i].src ="img/bigEye"+i+".png";
   }
    this.momEye_count =0;
    this.momEye_clock = 0;
    this.momEye_random = 0;

    for(var i=0;i<8;i++){
        this.momBody[i] =new Image();
        this.momBody[i].src = "img/bigEat"+i+".png";
    }
    for(var i=0;i<8;i++){
        this.momBodyBlue[i] =new Image();
        this.momBodyBlue[i].src = "img/bigEatBlue"+i+".png";
    }
    this.momBody_count = 0;
    this.hasEatOrange=0 ;
    this.hasEatBlue = 0;
    this.flag = " ";
}
momObj.prototype.draw = function(){
    this.clock += deltatimme;
    if(this.clock > 200){
        this.momTail_count = (this.momTail_count+1)%8;
        this.clock = 0;
    }
    this.momEye_clock +=deltatimme;
    if(this.momEye_clock > this.momEye_random){
        this.momEye_count =(this.momEye_count+1)%2;
        if(this.momEye_count ==0){
            this.momEye_random = Math.random()*200+2000;
        }else{
            this.momEye_random = Math.random()*20+300;

        }
        this.momEye_clock =0;
    }




    var deltaY=my-this.y;
    var deltaX=mx-this.x;
    var beta = Math.atan2(deltaY,deltaX);

    this.x = lerpDistance(mx,this.x,0.9);
    this.y = lerpDistance(my,this.y,0.9);
    this.angle = lerpAngle(beta,this.angle,0.6);

    ctx1.save();

    ctx1.translate(this.x,this.y);
    ctx1.rotate(Math.PI+this.angle);
    if(this.flag == "blue"){
    ctx1.drawImage(this.momBodyBlue[this.momBody_count],-this.momBodyBlue[this.momBody_count].width*0.5,-this.momBodyBlue[this.momBody_count].height*0.5);
}else {ctx1.drawImage(this.momBody[this.momBody_count],-this.momBody[this.momBody_count].width*0.5,-this.momBody[this.momBody_count].height*0.5);
}
ctx1.drawImage(this.momEye[this.momEye_count],-this.momEye[this.momEye_count].width*0.5,-this.momEye[this.momEye_count].height*0.5);
    ctx1.drawImage(this.momTail[this.momTail_count],-this.momTail[this.momTail_count].width*0.5+30,-this.momTail[this.momTail_count].height*0.5);
    //this.lastbeta=beta;
    ctx1.restore();
}
momObj.prototype.eatfruit = function (){
    if (!data.isOver) {
        for (var i = 0; i < fruit.num; i++) {
            if (fruit.alive[i]) {
                var xdiff = fruit.x[i] - this.x;
                var ydiff = fruit.y[i] - this.y;
                var distance = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);

                if (distance < 20) {
                    //fruit dead
                    fruit.alive[i] = false;
                    this.momBody_count += 1;
                    wave.born(fruit.x[i], fruit.y[i], "white");
                    if (this.momBody_count >= 8) {
                        this.momBody_count = 7;
                    }
                    if (fruit.type[i] == fruit.orange) {
                        this.hasEatOrange += 1;
                        this.flag = "orange"
                    }
                    else {
                        this.hasEatBlue += 1;
                        this.flag = "blue"
                    }
                }
            }
        }
    }
}
momObj.prototype.feedBaby = function (){
    if (!data.isOver) {
        for (var i=0;i<baby.length;i++) {
            var xdiff = baby[i].x - this.x;
            var ydiff = baby[i].y - this.y;
            var distance = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
            if (distance < 20) {
                if (this.hasEatBlue > 0 || this.hasEatOrange > 0) { //mom feed baby
                    wave.born(baby[i].x, baby[i].y, "red");
                    baby[i].babyfade_count = 0;
                    data.addScore();
                    baby[i].hasEat+= mom.hasEatBlue*2+mom.hasEatOrange;
                    this.hasEatBlue = 0;
                    this.hasEatOrange = 0;
                    this.momBody_count = 0;
                }
            }
        }
    }

}