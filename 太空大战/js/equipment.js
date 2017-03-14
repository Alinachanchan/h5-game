function Equipment(){
	this.x ;
	this.y ;
	this.width;
	this.height;
	this.type;
	this.img;
	this.alive;
	this.clock;
}
Equipment.prototype.init =function(){
	this.img = new Image();
	this.img.src = "imgs/equip.gif";
	this.height = 30;
	this.width = 30;
	this.alive = false;
	this.clock = 100;
}
Equipment.prototype.born =function(type){
	if(this.alive == false){
		 	this.alive = 500;
		    this.x = canWidth/5*4*Math.random()+canWidth/5;
		    this.y = canHeight/5*4*Math.random()+canHeight/5;
		    this.type = type;
	}
   
}
Equipment.prototype.draw =function(){
	if(this.alive > 0){
		this.alive--;
		if(this.alive<100){
//			this.glitter();
			this.clock--;
		}
		if(collide(this.x,this.y,this.height,plane.x,plane.y,(plane.width+plane.height)/4)){
			this.alive = false;
			plane.ChangeAttackStyle(this.type);
		}
		if(this.clock%4 == 0){
			ctx.save();
			ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
			ctx.font="20px Verdana";
	
			var gradient=ctx.createLinearGradient(canWidth/2,0,canWidth,0);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","blue");
			gradient.addColorStop("1.0","red");
			ctx.strokeStyle=gradient;
			ctx.strokeText(this.type,this.x,this.y);
			ctx.restore();
		}
	    	
	}	
}
//Equipment.prototype.glitter =function(){
//	
//}