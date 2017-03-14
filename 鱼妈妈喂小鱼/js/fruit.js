fruitObj = function(){
    this.size = [];
    this.x = [];
    this.y =[];
    this.blue = new Image();
    this.orange = new Image();
    this.num = 50;
    this.alive =[];
    this.speed =[];
    this.type =[];
}
fruitObj.prototype.init=function(){
    this.blue.src ="img/blue.png";
    this.orange.src = "img/fruit.png";
    for(var i=0;i<this.num;i++){
        this.alive[i] = false;
        this.size[i] = 0;
        this.speed[i] = 0;
        this.type[i]=this.blue;
        Math.random()>=0.2 ?this.type[i]=this.orange:this.type[i]=this.blue;
    }

}
fruitObj.prototype.draw=function(){
    this.judget_is_alive();

      ctx2.save();

      //ctx2.translate(canWidth*0.5,canHeight*0.5);
    for(var i=0;i< this.num;i++){
        if(this.alive[i] == true){
            ctx2.drawImage(this.type[i],this.x[i]-this.blue.width*0.5,this.y[i],this.size[i],this.size[i]);
            if(this.size[i] <=15)
                      this.size[i]+=this.speed[i]*deltatimme;

            else {
                this.y[i]-=this.speed[i]*deltatimme+0.5;
                if(this.y[i]<=0){
                    this.alive[i] = false;
                }
            }
        }


    }
     ctx2.restore();
}
fruitObj.prototype.judget_is_alive = function(){
    var count =0;
    for(var i=0;i<this.num;i++){
        if(this.alive[i] == true){
            count++;
            //console.log(count);
        }
    }

    if(count < 0.5*this.num){
        this.born();
    }
}
   fruitObj.prototype.born = function(){
       for(var i=0;i<this.num;i++){
       if(this.alive[i] == false){
           break;
       }
       }
       this.alive[i] = true;
       //console.log(this.alive[i]);
       var it =Math.round(Math.random()*ane.num);
       this.x[i] =ane.headx[it];
       this.y [i]=canHeight-ane.len[it]+Math.random()*20;
       this.speed[i] = Math.random()*0.01+0.001;
       this.size[i] = 0;
   }
