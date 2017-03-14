function Plane(myurl){
	this.img = new Image();
	this.resouce = myurl;
    this.x;
    this.y;
    this.width;
    this.height;
    this.clock;
    this.life;
    this.attackStyle;
	
}
Plane.prototype.init = function(){
	this.img.src = this.resouce;
	this.height = this.img.height*0.2;
	this.width = this.img.width*0.2;
	this.x = canWidth/2;
	this.y = canHeight-this.height/2;
	this.life = 1;
	this.attackStyle = 'A';
}
Plane.prototype.move = function(direction){
//	this.clock = 10;
	switch(direction){
		case 'up':
			this.y-= 20;
			break;
		case 'down':
			this.y+=20;
			break;
		case 'right':
			this.x+=20;
			break;
		case 'left':
			this.x-=20;
			break;			
	}
}
Plane.prototype.damaged = function(type,power){
	if(type === "bullet"){
		this.life -= power;		
	}else if(type === "collide"){
		this.life -= 0.001;
	}
	if(this.life <= 0){
		//game over
		if(score.leftLife>0){
			this.life = 1;
			score.loseLife();
			return;
		}
		this.life = 0;
		gameOver();
	}
}
Plane.prototype.draw = function(){
	if(!score.isOver){
		for (var i=0;i<enemyPlane.limit;i++) {
		if(enemyPlane.alive[i] == true){
			if(collide(this.x,this.y,(this.height+this.width)/6,enemyPlane.x[i],enemyPlane.y[i],enemyPlane.width[i]/2)){
			this.damaged("collide");
             enemyPlane.damaged(i,"collide");
		}
		}		
	}
    if(this.x-this.width/2<=0){
    	this.x = this.width/2;
    }
    if(this.x+this.width/2>=canWidth){
    	this.x = canWidth-this.width/2;
    }
    if(this.y-this.height/2<=0){
    	this.y = this.height/2;
    }
	if(this.y+this.height/2>=canHeight){
    	this.y = canHeight - this.height/2;
	}
	var rotate = Math.atan2(my-this.y,mx-this.x);//y,x    返回坐标点(x,y)与x轴之间的角度	
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(Math.PI/2 + rotate);              //顺时针  
    
	ctx.drawImage(this.img,-this.width/2,-this.height/2,this.width,this.height);
    ctx.fillStyle = 'rgba(0,255,0,0.8)';
	ctx.fillRect(-this.width/2,-this.height/1.5,this.width*this.life,5);
	ctx.restore();
	
	}	
}
Plane.prototype.attack = function(){
	 var rotate = Math.atan2(my-this.y,mx-this.x);//y,x    返回坐标点(x,y)与x轴之间的角度

	
//	 bullet.born(this.x,this.y, rotate,0,'C');
	 
     attack(this.attackStyle,this.x,this.y,rotate);
	 
}
Plane.prototype.ChangeAttackStyle = function(style){
	this.attackStyle = style;
}