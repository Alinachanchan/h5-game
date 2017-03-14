function collide(x,y,r,targetx,targety,targetr){
	var _dis = Math.sqrt((x-targetx)*(x - targetx)+(y-targety)*(y-targety));
    if(_dis < (r+targetr)){
         
//  	console.log("hahaha");
        return true;
    }	
}
function attack(type,x,y,rotate){
	switch(type){
		case 'A':
			shoot(x,y,rotate,'A',20,0,0.2);
			x = x + 20*Math.cos(rotate);
			y = y + 20*Math.sin(rotate);
			shoot(x,y,rotate,"A",20,0,0.2);
			 break;
		case "B":
		    shoot(x,y,rotate,'B',20,0.001,0);
			x = x + 20*Math.cos(rotate);
			y = y + 20*Math.sin(rotate);
			shoot(x,y,rotate,"B",20,0.001,0);
			break;
		case 'C':
		    shoot(x,y,rotate,'C',20,0,0);
		    x = x + 20*Math.cos(rotate);
			y = y + 20*Math.sin(rotate);
		    shoot(x,y,rotate,'C',20,0,0);
			break;
		case 'D':
			bullet.born(x,y, rotate,0,'D');
			x = x + 40*Math.cos(rotate);
			y = y + 40*Math.sin(rotate);
			bullet.born(x,y, rotate,0,'D');
			
		    break;
		case 'E':
			shoot(x,y,rotate,'C',20,0,0.1);
			x = x + 20*Math.cos(rotate);
			y = y + 20*Math.sin(rotate);
			shoot(x,y,rotate,"C",20,0,0.1);
			x = x + 20*Math.cos(rotate);
			y = y + 20*Math.sin(rotate);
			shoot(x,y,rotate,"C",20,0,0.1);
			x = x + 20*Math.cos(rotate);
			y = y + 20*Math.sin(rotate);
			shoot(x,y,rotate,"C",20,0,0.1);
			break;		    
	}
}
function shoot(x,y,rotate,type,gap,bend,divergency){
	rotate = rotate + Math.PI/2;
	bullet.born(x+2*gap*Math.cos(rotate-Math.PI),y+2*gap*Math.sin(rotate-Math.PI), rotate-Math.PI/2-2*divergency,-5*bend,type);
    bullet.born(x+gap*Math.cos(rotate-Math.PI),y+gap*Math.sin(rotate-Math.PI),  rotate-Math.PI/2-divergency,-2*bend,type);
	bullet.born(x,y, rotate-Math.PI/2,0,type);
	bullet.born(x+gap*Math.cos(rotate),y+gap*Math.sin(rotate), rotate-Math.PI/2+divergency,2*bend,type);
	bullet.born(x+2*gap*Math.cos(rotate),y+2*gap*Math.sin(rotate), rotate-Math.PI/2+2*divergency,5*bend,type);
}
function random2(arr){
	var len = arr.length;
	var a = Math.random()*len;
	a = Math.floor(a);
	return arr[a];
}
