var babyObj =function (){
    this.x;
    this.y ;
    this.age;
    this.hasEat;
    this.tail =  new Image();
    this.angel ;
    this.babyfade = [];
    this.clock;
    this.babyfade_count;

    this.babyeye = [];
    this.babyeye_count;
    this.babyeye_clock;
    this.babyeye_random;

    this.tail_animate;
    this.clock1;
    this.speed;
    this.angle2;
    this.r;
}
babyObj.prototype.init = function (){
    this.x =Math.random()*300;
    this.y =Math.random()*300;

    this.tail.src = "img/babyTail0.png";
    this.angle = 0;
    for(var i=0; i<20;i++){
        this.babyfade[i] = new Image();
        this.babyfade[i].src = "img/babyFade"+i+".png";
    }
    this.babyfade_count = 0;
    this.clock =0;

    for(var i=0;i<2;i++){
        this.babyeye[i] = new Image();
        this.babyeye[i].src ="img/babyEye"+i+".png";
    }
    this.babyeye_count = 0;
    this.babyeye_clock = 0;
    this.babyeye_random =0;

    this.speed =( Math.random()-0.5)*0.004;

    this.angle2 = Math.random();
    this.r =Math.random()*200+200;
    this.tail_animate=0;
    this.clock1 =0;
    this.age =1 ;
    this.hasEat = 0;
}
babyObj.prototype.draw = function () {
    this.clock +=deltatimme;
    this.clock1 +=deltatimme;
    if(this.clock1>100) {
        this.tail_animate = (this.tail_animate + 1)%4;
        this.clock1=0
    }
    if(this.clock >1000){
        this.babyfade_count =this.babyfade_count+1;

        if(this.babyfade_count>=20){
            this.babyfade_count=19;
            //gameover
            data.isOver = true;

        }
        this.clock =0;
    }

       this.babyeye_clock +=deltatimme;
    if(this.babyeye_clock > this.babyeye_random){
        this.babyeye_count =(this.babyfade_count+1)%2;
        if(this.babyeye_count ==0){
            this.babyeye_random = Math.random()*200+3000;
        }else{
            this.babyeye_random = Math.random()*20+60;

        }
        this.babyeye_clock =0;
    }

    ctx1.save();
    if(this.hasEat>5){
        this.age += 0.1;
        this.hasEat= 0;
        if(this.age >=2)
        this.age = 2;
    }


    if (  Math.pow((this.x-mom.x) *(this.x-mom.x) + (this.y-mom.y) * (this.y-mom.y), 0.5)>80) {
        var deltaY = Math.cos(this.angle2) * this.r + mom.y - this.y;
        var deltaX = Math.sin(this.angle2) * this.r + mom.x - this.x;
        var beta = Math.atan2(deltaY, deltaX);
        this.angle = lerpAngle(beta, this.angle, 0.4);
        this.x = lerpDistance(Math.sin(this.angle2) * this.r + mom.x, this.x, 0.99);//目标x值 sin(angle)*r+mom.x;
        this.y = lerpDistance(Math.cos(this.angle2) * this.r + mom.y, this.y, 0.99);
        this.angle2 += deltatimme * this.speed;
    } else {
        var deltaY =  mom.y - this.y;
        var deltaX = mom.x - this.x;
        var beta = Math.atan2(deltaY, deltaX);
        this.angle = lerpAngle(beta, this.angle, 0.4);
        this.x = lerpDistance(mom.x, this.x, 0.96);//目标x值 sin(angle)*r+mom.x;
        this.y = lerpDistance( mom.y, this.y, 0.96);
    }

    ctx1.translate(this.x,this.y);
    ctx1.scale(0.5*this.age,0.5*this.age);
    ctx1.rotate(this.angle+Math.PI);
    ctx1.drawImage(this.babyfade[this.babyfade_count],-this.babyfade[this.babyfade_count].width/2,-this.babyfade[this.babyfade_count].height/2);
    ctx1.drawImage(this.babyeye[this.babyeye_count],-this.babyeye[this.babyeye_count].width/2,-this.babyeye[this.babyeye_count].height/2);
    ctx1.drawImage(this.tail,-this.tail.width/2+23+this.tail_animate,-this.tail.height/2);
    ctx1.restore();


}