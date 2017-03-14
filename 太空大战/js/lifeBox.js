function LifeBox(){
	this.x = [];
	this.y = [];
	this.width =[];
	this.height= [];
    this.img = [];
    this.alive = [];
    this.type = [];
//  this.clock =100;
}
LifeBox.prototype.init=function(){

	
	for(var i=0;i<10;i++){
	this.img[i] = new Image();
		
		this.alive[i] = false;
	}
}
LifeBox.prototype.born=function(x,y,width,height,src,type){
	for(var i=0;i<10;i++){
       if(this.alive[i] == false){
       	this.x[i] = x;
		this.y [i]= y;
		this.width[i] = width;
		this.height[i] = height;
		this.alive[i] = 500;
		this.img[i].src = src;
		this.type[i] =type;
		
		return i;
		
       }
	}
	
}
LifeBox.prototype.dead = function(i){
	this.alive[i] = false;
}
LifeBox.prototype.draw = function(){
	for(var i=0;i<10;i++){
       if(this.alive[i] >0){
       	if(this.type[i] ===1){
       		this.alive[i]--;
       		
       		if(collide(this.x[i],this.y[i],this.width[i]/2,plane.x,plane.y,(plane.width+plane.height)/4)){
       		score.addLife();
       		this.alive[i] =false;
       	}
       	for(var j=0;j<enemyPlane.limit;j++){
				if(enemyPlane.alive[j] == true){
					if(collide(this.x[i],this.y[i],this.width[i]/2,enemyPlane.x[j],enemyPlane.y[j],(enemyPlane.width[j]+enemyPlane.height[j])/4)){
                   enemyPlane.addLife(j);
                   this.alive[i] =false;
				}
				}				
			}
	
       	}
       	
          ctx.save();
          ctx.drawImage(this.img[i],this.x[i]-this.width[i]/2,this.y[i]-this.height[i]/2,this.width[i],this.height[i]);
		  ctx.restore();
       }
	}
}
