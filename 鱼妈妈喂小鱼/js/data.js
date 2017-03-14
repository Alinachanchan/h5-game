var dataObj = function () {
    this.isOver;
    this.score;
    this.alpha;
    this.level;

}
dataObj.prototype.init = function () {
    this.score = 0;
    this.isOver =false;
    this.alpha =0;
    this.level = 1;
}
dataObj.prototype.draw = function(){
    ctx2.save();
    ctx2.shadowBlur = 30;
    ctx2.shadowColor ="white"
    ctx2.font ="20px 黑体";
    ctx2.fillStyle = "white";
    ctx2.textAlign = "center";
    if(this.score > 30*this.level){
        this.level += 1;
        baby.push(new babyObj());
        baby[baby.length-1].init();
    }
    ctx2.fillText("SCORE: "+this.score+"   LEVEL :"+this.level,canWidth/2,canHeight-50);
    if (this.isOver) {
        this.alpha +=deltatimme*0.001;
        ctx2.fillStyle = "rgba(255,255,255," + this.alpha + ")";
        ctx2.fillText("GAMEOVER", canWidth / 2 , canHeight / 2);
    }
    ctx2.restore();

}
dataObj.prototype.addScore = function (){

    this.score += mom.hasEatBlue*2+mom.hasEatOrange;


}