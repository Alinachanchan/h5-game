//定义海葵类
var aneObj = function(){
    this.x = [];
    this.len = [];
    this.headx =[];
    this.clock;
}
aneObj.prototype.num = 50;
aneObj.prototype.init =function(){
    for(var i=0;i<this.num;i++){
        this.x[i] = i*16+Math.random()*20;//[0,1)
        this.len[i] = 200+Math.random()*50;
        this.headx[i] =this.x[i];
        this.clock =0;
    }

}
aneObj.prototype.draw =function (){
    this.clock +=deltatimme*0.0005;

    var angle =Math.sin(this.clock)*100;
        ctx2.save();               //保存当前环境的状态
        ctx2.strokeStyle = "#3b154e";
        ctx2.lineWidth = 20;
        ctx2.lineCap ="round";
        ctx2.globalAlpha = 0.6;
          for(var i=0;i<this.num;i++){

            ctx2.beginPath();           //告诉画笔我要绘制一个路径
              ctx2.moveTo(this.x[i],canHeight);
              ctx2.quadraticCurveTo(this.x[i],canHeight-150,this.x[i]+angle,canHeight-this.len[i]);

              //ctx2.lineTo(this.x[i],canHeight - this.len[i]);

              ctx2.stroke();    //返回之前保存的环境的路径状态和属性
          }
        ctx2.restore();
}