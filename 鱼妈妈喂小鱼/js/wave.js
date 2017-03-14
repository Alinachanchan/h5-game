var waveObj = function () {
    this.num ;
    this.alive = [];
    this.r = [];
    this.alpha = [];
    this.x=[];
    this.y =[];
    this.type =[];
}
waveObj.prototype.init = function (){
    this.num = 10;
    for(var i = 0; i<this.num; i++){
        this.alive[i] = false;
    }
}
waveObj.prototype.draw = function (){

    ctx1.save();
    ctx1.lineWidth = 3;
    ctx1.shadowBlur=10;
    ctx1.shadowColor="white";
    for (var i = 0;i<this.num ;i++) {
        if (this.alive[i]) {
            this.r[i] +=deltatimme*0.08;
            if(this.r[i] >50)
            this.alive[i]=false;
            this.alpha[i] =1-this.r[i]/50;

            if (this.type[i] == "white") {
                ctx1.strokeStyle = "rgba(255,255,255," + this.alpha[i] + ")";
            } else {
                ctx1.lineWidth = 4;
                ctx1.strokeStyle = "rgba(255,0,0," + this.alpha[i] + ")";

            }
            ctx1.beginPath();


            ctx1.arc(this.x[i],this.y[i],this.r[i],0,Math.PI*2,true);
            ctx1.closePath();
            ctx1.stroke();
        }
    }
    ctx1.restore();
}
waveObj.prototype.born = function (x,y,type){
       for(var i=0;i<this.num;i++){
           if(!this.alive[i]){
               this.alive[i] = true;
               this.x[i] =x;
               this.y[i] =y;
               this.r[i] = 0;
               this.alpha[i] = 1;
               this.type[i] =type;
               break;
           }
       }
}