//子弹池
function Bullet(owner){
	this.x = [];
	this.y = [];
	this.direction = [];      //发射方向
	this.directionChange = [];
	this.alive = [];
	this.limit = 100;
//	this.size = [];
//	this.speed = [];
	this.owner = owner;
	this.type = [];          //子弹型号
}
Bullet.prototype.typeInformation = {
	A :{speed:3,size:3,color:'white',power:0.1},
	B :{speed:3,size:5,color:'yellow',power:0.2},
	C :{speed:5,size:7,color:'blue',power:0.5},
	D :{speed:10,size:10,color:'pink',power:1}
}
Bullet.prototype.init  = function(){
	for(var i=0;i<this.limit;i++){
		this.alive[i] = false;
	}
}

Bullet.prototype.born = function(x,y,direction,directionChange,type){
	for(var i=0;i<this.limit;i++){
        if(this.alive[i] == false){
        	this.x[i] = x;
        	this.y[i] = y;
        	this.direction[i] = direction;
        	this.directionChange[i] = directionChange ;
//      	this.size[i] = size;
//      	this.speed[i] = speed;
        	this.type[i] = type;
        	this.alive[i] = true;
        	break;
        }
	}

}
Bullet.prototype.dead = function(i){
	 this.alive[i] = false;
}
//Bullet.prototype.fly = function(){
//	
//}
Bullet.prototype.draw = function(){
	var speed;
	var size;
	var type;
	var power;
	for(var i =0;i<this.limit;i++){
		if(this.alive[i] == true){
			  type = this.type[i];			
			  speed = this.typeInformation[type].speed;
			  size = this.typeInformation[type].size;
			  power = this.typeInformation[type].power;
			if(this.x[i]<0||this.x[i]>canWidth||this.y[i]>canHeight||this.y[i]<0){    //忽略子弹大小
				this.dead(i);
			}
			this.x[i] = this.x[i]+  Math.cos(this.direction[i])*speed;
			this.y[i] = this.y[i]+  Math.sin(this.direction[i])*speed;			
            this.direction[i] = this.direction[i]+ this.directionChange[i];

			//与敌机碰撞检测
			if(this.owner == "me"){
			for(var j=0;j<enemyPlane.limit;j++){
				if(enemyPlane.alive[j] == true){
					if(collide(this.x[i],this.y[i],size,enemyPlane.x[j],enemyPlane.y[j],(enemyPlane.width[j]+enemyPlane.height[j])/4)){
                   enemyPlane.damaged(j,"bullet",power);
//  	          console.log("collide");                 
                   this.dead(i);
                   score.addScore();
				}
				}				
			}
			}
			//与我方飞机碰撞检测
			if(this.owner == "enemy"){
				if(collide(this.x[i],this.y[i],size,plane.x,plane.y,(plane.width+plane.height)/4)){
                  plane.damaged("bullet",power);
                  this.dead(i);
			}
			}		
			ctx.save();		
			ctx.beginPath();
			ctx.arc( this.x[i],this.y[i],size ,0,2*Math.PI);
			ctx.fillStyle = this.typeInformation[type].color;
			ctx.fill();
			ctx.restore();
					}
	}
}
