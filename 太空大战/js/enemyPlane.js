//敌机池
function EnemyPlane(){
	this.img = [];
	this.x  = [];
	this.y = [];
	this.width = [];
	this.height = [];
	this.canAttack = [];            //攻击时钟
	this.canEscape = [];            //是否逃避
	this.speed = [];
	this.limit = 10;
	this.alive = [];
	this.life = [];
}
EnemyPlane.prototype.planeCount = 0;
EnemyPlane.prototype.planeType = {
	
}
EnemyPlane.prototype.init = function(){
	for (var i=0;i<this.limit;i++) {
		this.img[i] = new Image();
		this.img[i].src = "./imgs/plane"+ i%3+".gif";
		this.alive[i] = false;
		this.canAttack[i] = 0; 
	}		
}
EnemyPlane.prototype.born = function(x,y,width,height,speed){
	for (var i=0;i<this.limit;i++) {
		if(this.alive[i] == false){
			this.x[i] = x;
			this.y[i] = y;
			this.width[i] = width;
			this.height[i] = height;
			this.speed[i] = speed;
			this.alive[i] = true;
			EnemyPlane.prototype.planeCount++;
			this.life[i] = 1;
			break;
		}
	}	
}
EnemyPlane.prototype.draw = function(){
	if(EnemyPlane.prototype.planeCount < score.level+1){
			this.born(Math.random()*canWidth,0,50+Math.random()*30,50+Math.random()*30,Math.random()*2+1);
			score.countAll();
		}
	
	for (var i=0;i<this.limit;i++) {
		if(this.alive[i] == true){
			this.canAttack[i]++;
             if(this.canAttack[i] >= 500 - score.level*50){
             	var rotate = Math.atan2( plane.y-this.y[i],plane.x-this.x[i]); //注意参数位置
             	enemyBullet.born(this.x[i],this.y[i],rotate,0,random2(['A','B','C','D']));
             	this.canAttack[i] = 0;
             }
			this.y[i] = this.y[i] + this.speed[i];
//			this.y[i] = this.y[i] + 0.1;
			if((this.x[i]+ this.width[i]/2)<0 || (this.x[i]- this.width[i]/2)>canWidth ||(this.y[i]- this.height[i]/2)>canHeight){
				this.alive[i] = false;
		     	EnemyPlane.prototype.planeCount--;				
			}
			ctx.save();
			ctx.drawImage(this.img[i],this.x[i]-this.width[i]/2,this.y[i]-this.height[i]/2,this.width[i],this.height[i]);
			ctx.fillStyle = 'rgba(0,255,0,0.8)';
			ctx.fillRect(this.x[i]-this.width[i]/2,this.y[i]-this.height[i]/1.5,this.width[i]*this.life[i],5);

			ctx.restore();
			
            
		}
	}	
}
EnemyPlane.prototype.damaged = function(i,type,power){
	if(type == "bullet"){
		this.life[i] -=power;		
	}else if(type === "collide"){
		this.life[i] -=0.001;				
	}

 	if(this.life[i] <=0){
		this.alive[i] = false;
		EnemyPlane.prototype.planeCount--;
		score.countHasKilled();
	}
}
EnemyPlane.prototype.addLife = function(i){
     this.alive[i] = 1;
}