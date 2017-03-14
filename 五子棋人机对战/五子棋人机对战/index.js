

var margin = 25;

var row = 17;
var col = 17;


var gridSize = 30;
var chessRadius =12;

var canvasWidth = col*gridSize+2*margin;
var canvasHeight =row*gridSize+2*margin;

var canvas =document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

var me =true;   //代表我方先开始下

var hasOccupy = [];

window.onload = function(){
    init();
    drawChessboard();

}
function drawChessboard(){
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 0.5;
    for(var i=0;i<=row;i++){
        ctx.beginPath();
        ctx.moveTo(margin,margin+gridSize*i)
        ctx.lineTo(canvasWidth-margin,margin+gridSize*i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin+gridSize*i,margin);
        ctx.lineTo(margin+gridSize*i,canvasHeight-margin);
        ctx.stroke();
    }
}
function getCoordinate(e){

        var j = Math.floor(e.offsetX/gridSize);
        var i=  Math.floor(e.offsetY/gridSize);

        //alert(me);
        go_step(i,j,me);
}
function go_step(i,j,me){

     //console.log(hasOccupy[i][j]);
    if(hasOccupy[i][j]>0){
        return;
    }
    ctx.save();
    var gradient = ctx.createRadialGradient(margin+gridSize*j+2,margin+gridSize*i-2,0,margin+gridSize*j+2,margin+gridSize*i-2,chessRadius);

    if (me) {
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.8, "black");
    } else {
        gradient.addColorStop(0.1, "white");
        gradient.addColorStop(1, "rgb(200,200,200)");
    }
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(margin+gridSize*j,margin+gridSize*i,chessRadius,0,2*Math.PI);
    ctx.fill();
    ctx.restore();
    if(me){
        hasOccupy[i][j] = 1;
        for (var k=0;k<count;k++) {
            if (wins[i][j][k]){
                //console.log("i"+i+" j"+j+" k"+k+wins[i][j][k]);
                if(computerwins[k]==0){         //如果电脑在此赢法上没有落子
                    mywins[k]++;                //我方在此赢法计算加1

                } else if(computerwins[k]>0){
                       mywins[k] =6;
                       computerwins[k]=6;
                    }
                //console.log("me"+me+" k"+k+"  mywins[k]"+mywins[k]);

                if(mywins[k]==5){
                   alert("你赢了!!!!");
               }
            }
        }
    }else{
        hasOccupy[i][j] = 2;
        for (var k=0;k<count;k++) {
            if (wins[i][j][k]){
                if(mywins[k]==0){
                    computerwins[k]++;

                }else if(mywins[k]>0){
                    mywins[k] =6;
                    computerwins[k]=6;
                }
                //console.log("me"+me+" k"+k+"  computerwins[k]"+computerwins[k]);

                if(computerwins[k]==5){
                    alert("你输了!!!!");
                }
            }
        }
    }
    //if(this.me)
    //    console.log("i go "+this.me);
    this.me =!this.me;
     //console.log("go_step "+this.me);
    if(!this.me){computer_step();}

}
function init(){
    count=0;
    canvas.width =canvasWidth;
    canvas.height =canvasHeight;
    canvas.addEventListener("click",getCoordinate,false);
    me = true;
    //初始化hasccupy数组
    for(var i= 0;i<=row;i++){
        hasOccupy[i] =[];
        for(var j=0;j<=col;j++){
            hasOccupy[i][j] = 0;
        }
    }
    countAllwins();
//初始化mywins和computerwins数组
    for(var i=0;i<count;i++){
        mywins[i] = 0;      //mywins[i]的值有0 1 2 3 4 5 6 ，其中6代表不可能赢的状态标识
        computerwins[i] = 0;
    }
}

var wins = [];
//赢法计数器
var count =0;
//初始化所有的赢法数组
function countAllwins(){
    var uu=0;
    //wins三维数组的初始化
    for(var i= 0;i<=row;i++){
        wins[i] = [];
        for(var j=0;j<=col;j++){
            wins[i][j] =[];
        }
    }

    for(var i= 0;i<=row;i++){
        for(var j=0;j<=col-4;j++){
            for(var k=0;k<5;k++){
                wins[i][j+k][count] = true;    //第count赢法中，只有wins[i][j][count]至wins[i][j+4][count]的值为true
            }
            count++;
        }
    }

    for(var i= 0;i<=col;i++){
        for(var j=0;j<=row-4;j++){
            for(var k=0;k<5;k++){
                wins[j+k][i][count] = true;    //第count赢法中，只有wins[i][j][count]至wins[i][j+4][count]的值为true
            }
            count++;
            uu++;
        }
    }

    for(var i= 0;i<=row-4;i++){
        for(var j=0;j<=col-4;j++){
            for(var k=0;k<5;k++){
                wins[i+k][j+k][count] = true;    //第count赢法中，只有wins[i][j][count]至wins[i][j+4][count]的值为true
            }
            count++;
        }
    }

    for(var i= row;i>=4;i--){
        for(var j=0;j<=col-4;j++){
            for(var k=0;k<5;k++){
                wins[i-k][j+k][count] = true;    //第count赢法中，只有wins[i][j][count]至wins[i][j+4][count]的值为true
            }
            count++;
        }
    }
    //console.log(uu);

}

//输赢程度判断
var mywins = [];
var computerwins = [];

function computer_step(){
    var myscore = [];
    var computerscore = [];
    //初始化
    for(var i=0;i<=row;i++){
        myscore[i] =[];
        computerscore[i] =[];
        for(var j=0;j<=col;j++){
            myscore[i][j] =0;
            computerscore[i][j]=0;
        }
    }
    var cou=0;
    //console.log(myscore);
    //统计
    for(var i=0;i<=row;i++){
        for(var j=0;j<=col;j++){
            for(var k=0;k<count;k++){
                //console.log("dd");

                //    //console.log(myscore[i][j]+"  "+computerscore[i][j]);
            //    //console.log("ff");
                if((wins[i][j][k]==true)&&(hasOccupy[i][j]==0)){    //如果该赢法存在且该位置没有落子
                    cou++;
                     switch(mywins[k]){
                        case 1:myscore[i][j] += 100;break;
                        case 2: myscore[i][j] += 200;break;
                        case 3:myscore[i][j] += 500;break;
                        case 4: myscore[i][j]+= 5000;break;
                    }
                    switch(computerwins[k]){
                        case 1:computerscore[i][j]=+120;break;
                        case 2: computerscore[i][j]+=220;break;
                        case 3:computerscore[i][j]+=1500;break;
                        case 4: computerscore[i][j]+=50000;break;
                        console.log(myscore[i][j]+"  "+computerscore[i][j]);
                    }
                }
            }
        }
    }
 //console.log(myscore[1][1]);
    //求出得分最高者
    var max = 0;
    var u= 0;
    var v=0;
    for(var i=0;i<=row;i++){
        for(var j=0;j<=col;j++){

            if(myscore[i][j]>max){
                max = myscore[i][j];
                //console.log(myscore[i][j]+"  "+max);
                u = i;
                v =j;
            }
            if(computerscore[i][j]>max){
                max = computerscore[i][j];
                //console.log(computerscore[i][j]+"  "+max);
                u = i;
                v =j;
            }

        }
    }
    //console.log("computer go "+me);
    go_step(u,v,me);

}
function test(){
    //var cou=0;
    var k= document.getElementById("input1").value;
    var j= document.getElementById("input2").value;

    //
    //
    //
    //for(var k=0;k<count;k++){
    //    if(mywins[k]>0&&mywins[k]!=6){
    //     console.log("k:"+k+" mywins[k]="+mywins[k]);
    //    }
    //}
    //for(var k=0;k<count;k++){
    //    if(computerwins[k]>0&&computerwins[k]!=6){
    //        console.log("k:"+k+" computerwins[k]="+computerwins[k]);
    //    }
    //}
    //alert(mywins);
    for(var i=0;i<=row;i++){
        for(var j=0;j<=col;j++){
            //for(var k=0;k<count;k++){
                if(wins[i][j][k]==true){
                    console.log("i"+i+" j"+j+" k"+k);
                }

            //}
        }
    }

}