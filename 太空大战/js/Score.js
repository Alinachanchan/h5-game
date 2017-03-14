function Score(){
	this.allEnemyPlane;    //出现的敌机总数
	this.hasKilled;          //已经消灭的敌机总数
	this.leftLife;          //飞机剩下的生命条数
	this.isOver;            //游戏是否结束
	this.score;
	this.lifeArr =[];
	this.level;
	this.win;
}
Score.prototype.init = function(){
	this.allEnemyPlane = 0;
	this.hasKilled = 0;
	this.isOver = false;
	this.score = 0;
	this.leftLife = 3;
	this.level =1;
	this.win = false;
	for(var i=0;i<this.leftLife;i++){
	 this.lifeArr[i] = lifebox.born(canWidth-i*30-10,canHeight-20,20,20,"./imgs/life2.png",2);
	}
}
Score.prototype.draw = function(){

	ctx.save();
	ctx.font="30px Verdana";

	var gradient=ctx.createLinearGradient(canWidth/2,0,canWidth,0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.5","blue");
	gradient.addColorStop("1.0","red");

	ctx.strokeStyle=gradient;
	ctx.strokeText("Score："+this.score+"    Level: "+this.level,canWidth/2,40);
	if(this.isOver&&!this.win){
		
	  ctx.strokeText("GAME OVER!!",canWidth/2-100,canHeight/2);		
	}
	if(this.level == 9){
		
	  ctx.strokeText("YOU WIN!!",canWidth/2-100,canHeight/2);
	  gameOver();
//	  this.isOver = false;
	this.win = true;
	}
	ctx.restore();
	
	


	
}
Score.prototype.addScore = function(){
	this.score += 10;
}
Score.prototype.countAll = function(){
	if(!this.isOver){
		this.allEnemyPlane++;
		if(this.allEnemyPlane%20 == 0){
		 var index = random2(['A','B','C','D','E']); 
		  equit.born(index);
		}
		if(this.allEnemyPlane%30 == 0){
	      var i = lifebox.born(Math.random()*canWidth/5*3+canWidth/5,canHeight*Math.random()*3/5+canHeight/5,40,40,"./imgs/lifeBox.gif",1);
		}
		if(this.allEnemyPlane%30 == 0){
			this.level++;
	}
	}
	
}
Score.prototype.countHasKilled = function(){
	this.hasKilled++;
}
Score.prototype.addLife = function(){
	this.leftLife++;
	var i = lifebox.born(canWidth-30*this.leftLife+20,canHeight-20,20,20,"./imgs/life2.png",2);
	this.lifeArr.push(i);
}
Score.prototype.loseLife = function(){
	this.leftLife--;
	var i = this.lifeArr.pop();
	lifebox.dead(i);
}