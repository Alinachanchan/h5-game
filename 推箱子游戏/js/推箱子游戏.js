
$(function(){                                                               //页面加载完毕，则执行以下代码
    localStorage.clear();
    move_mouse();                                                            //绑定事件，即添加事件监听器，在can_move为真时，点击人物上下左右区域控制人物移动，
    $("#main_menu li:eq(0)").click(function(){
        $(".chooseLevel ").toggleClass("show");                         //点击主界面选择关卡按钮，弹出或收起雪人选关地图
        $(".game_description,.Ranking").removeClass("show");            //收起游戏说明和排行榜对话框
    });
    $("#main_menu li:eq(1)").click(function(){
        $(".game_description").toggleClass("show");                     //点击主界面游戏说明按钮，切换游戏说明对话框
        $(".chooseLevel,.Ranking ").removeClass("show");                //收起雪人地图和排行榜对话框
    });
    $("#main_menu li:eq(2)").click(function(){
        $(".Ranking").toggleClass("show");                                //点击主界面排行榜按钮，切换排行榜对话框，
        $(".chooseLevel,.game_description ").removeClass("show");     //收起雪人地图和游戏说明对话框
        showRanking();                                                          //显示1-6关的成绩排行榜，
    });
    $(".chooseLevel > div").click(function(){
       page_state_change();                                                      //点击雪人地图上的关卡按钮,则调用进入游戏界面函数
    });
    $("#start").click(function(){
        $("#start").removeClass("show");//点击开始按钮，则隐藏开始按钮
        if(checkNum(document.getElementById("input1"))) {
            steplimit = document.getElementById("input1").value;
            timelimit = document.getElementById("input2").value;
        }
       // steplimit= $("#setup > input").eq(0).attr("value");
       // timelimit= $("#setup > input").eq(1).attr("value");
        $("#setup").fadeOut(2000);

       // alert(steplimit);
        //alert(timelimit);
        //alert($("#setup input").eq(0).attr("value"));
        playing();                                                                  //调用开始游戏函数，则进入游戏中状态
    });
    $("#exitGame").click(function(){                                            //给退出按钮添加事件监听器
        if(can_move){                                                                   //判断人物是否可以移动，即判断是否为游戏进行状态
        $("#judget").addClass("show");                                                  //弹出游戏结束对话框
        $("#judget").find(".show_score").text("您已退出本关游戏");
        game_over();                                                                    //游戏结束，即进入游戏结束状态
        }
    });
    $("#puaseGame").click(function(){                                           //给暂停按钮添加事件监听器
        if(can_move){                                                               //判断人物是否可以移动，即判断是否为游戏进行状态
                $("#pause").addClass("show");                                       //弹出游戏暂停界面
                game_over();                                                            //此时进入游戏结束状态，游戏相关数据还在，以便恢复游戏进行状态

        }
    });
    $("#pause").click(function(){                                                   //点击“点击继续”圣诞老人按钮，继续游戏
        $("#pause").removeClass("show");
        playing();                                                                      //恢复游戏进行状态
    });
    //
    $("#tomainMenu").click(function(){                                              //给“主菜单”按钮添加事件监听器
        $("#main").fadeIn(1000);                                                        //淡入主界面，游戏界面消失
        $("#judget").removeClass("show");                                               //判断输赢对话框消失
    });
    $("#chooseAgain").click(function(){                                             //给“重新选择关卡”按钮添加事件监听器
        $(".chooseLevel").addClass("_show");                                        //选择关卡的雪人地图出现
        $("#judget").removeClass("show");                                            //判断对话框消失
    });
    $("#playAgain").click(function(){                                            //给再玩一次按钮添加事件监听器
        $("#judget").removeClass("show");                                           //判断对话框消失
        showMap();                                                                     //显示游戏地图
        initialize();                                                                  //游戏进行前，进行初始化
        $("#start").addClass("show");//弹出开始按钮
        $("#setup").fadeIn(1000);
    });
    $("#nextLevel").click(function(){                                               //给“下一关”按钮添加事件监听器
        $("#judget").removeClass("show");
        chooseLevel++;                                                                   //关卡加一
        if(chooseLevel==7){
            chooseLevel=1;                                                                  //如果在第六关完成后，选择下一关，则重新进入第一关
        }
        showMap();                                                                          //显示游戏地图
        initialize();                                                                       //初始化
        $("#start").addClass("show");
        $("#setup").fadeIn(1000);
    });
    choose();                                                                             //开启选择关卡函数
});

//出现游戏界面
function page_state_change(){                 //点击选择的关卡，则切换页面，进入游戏界面
    $("#main").fadeOut(1000);                 //主界面消失
    $(".chooseLevel ").removeClass("show _show"); //选择关卡的雪人菜单消失
    $("#start").addClass("show");      //出现开始按钮
   $("#setup").fadeIn(2000);
}
function setup(){
    $("#setup > input").eq(0).attr("value");
}

var step = 0;                                  //计数器 ，记录当前关卡已经移动步数
var count=0;                                    //计数器，记录当前关卡已经成功推到目标位置的箱子的个数
var position;                                   //标志位，记录人物的位置
var can_move=false;                          //标志位，控制是否人开启物移动操作
var chooseLevel=1;                              //标志位，记录当前关卡
var boxCount,steplimit,timelimit;            //记录当前关卡的箱子数目，步数限制，时间限制
var pullbackcount=0;                         //计数器，记录本关已经回退操作次数
//游戏地图，0代表路，1代表墙，2代表目标位置即房子，31至36代表不同礼物，4代表圣诞老人
var map1=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,1,1,1,-1,-1,-1,-1,
    -1,-1,-1,-1,1,2,1,-1,-1,-1,-1,
    -1,1,1,1,1,0,1,-1,-1,-1,-1,
    -1,1,2,31,0,32,1,1,1,-1,-1,
    -1, 1,1,1,4,0,32,2,1,-1,-1,
    -1, -1,-1,1,33,1,1,1,1,-1,-1,
    -1, -1,-1,1,2,1,-1,-1,-1,-1,-1,
    -1,-1,-1,1,1,1,-1,-1,-1,-1,-1,
    4,59,[],[],15,20  ];                    //最后6个数组元素分别代表箱子个数，人物位置，游戏历史记录
                                        // 成绩排行榜，本关应该在多少步之内完成，本关需要在多长时间能完成



var map2=[-1,1,1,1,1,1,-1,-1,-1,-1,-1,
    -1, 1,4,0,0,1,-1,-1,-1,-1,-1,
    -1,1,0,31,32,1,-1,1,1,1,-1,
    -1, 1,0,34,0,1,-1,1,2,1,-1,
    -1,1,1,1,0,1,1,1,2,1,-1,
    -1, -1,1,1,0,0,0,0,2,1,-1,
    -1, -1,1,0,0,0,1,0,0,1,-1,
    -1, -1,1,0,0,0,1,1,1,1,-1,
    -1,-1,1,1,1,1,1,-1,-1,-1,-1,
    3,13,[],[],70,40
];

var map3=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,1,1,1,1,1,1,1,1,-1,-1,
    -1,1,0,0,0,0,0,0,1,1,-1,
    1,1,31,1,1,1,0,0,0,1,-1,
    1,0,4,0,32,0,0,36,0,1,-1,
    1,0,2,2,1,0,33,0,1,1,-1,
    1,1,2,2,1,0,0,0,1,-1,-1,
    -1,1,1,1,1,1,1,1,1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    4,46,[],[],100,50];
var map4=[-1,-1,-1,1,1,1,1,1,1,1,-1,
    -1,-1,1,1,0,0,1,0,4,1,-1,
    -1,-1,1,0,0,0,1,0,0,1,-1,
    -1,-1,1,31,0,32,0,35,0,1,-1,
    -1,-1,1,0,33,1,1,0,0,1,-1,
    1,1,1,0,34,0,1,0,1,1,-1,
    1,2,2,2,2,2,0,0,1,-1,-1,
    1,1,1,1,1,1,1,1,1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,19,[],[],120,50];
var map5=[ -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,1,1,1,1,1,1,-1,-1,
    -1,1,1,1,0,0,0,0,1,-1,-1,
    1,1,2,0,31,1,1,0,1,1,-1,
    1,2,2,35,0,32,0,0,4,1,-1,
    1,2,2,0,34,0,33,0,1,1,-1,
    1,1,1,1,1,1,0,0,1,-1,-1,
    -1,-1,-1,-1,-1,1,1,1,1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,52,[],[],110,40];
var map6=[-1,1,1,1,1,1,1,1,1,1,-1,
    -1,1,0,0,1,1,0,0,0,1,-1,
    -1,1,0,0,0,31,0,0,0,1,-1,
    -1,1,32,0,1,1,1,0,36,1,-1,
    -1,1,0,1,2,2,2,1,0,1,-1,
    1,1,0,1,2,2,2,1,0,1,1,
    1,0,33,0,0,34,0,0,35,0,1,
    1,0,0,0,0,0,1,0,4,0,1,
    1,1,1,1,1,1,1,1,1,1,1,
    6,85,[],[],120,50
];
//游戏关卡数组
var levelList=[map1,map2,map3,map4,map5,map6];


//根据当前关卡显示地图
function showMap(){
    var i=0;
    boxCount=levelList[chooseLevel-1][99];
    position=levelList[chooseLevel-1][100];
    lastStep=levelList[chooseLevel-1][101];
    lastTimeLong=levelList[chooseLevel-1][102];
    steplimit=levelList[chooseLevel-1][103];
    document.getElementById("input1").value=steplimit;
    timelimit=levelList[chooseLevel-1][104];
    document.getElementById("input2").value=timelimit;
    while (i<99){
        var it= $(".game_panel div").eq(i);   //缓存对象
         it.removeClass("man room wall floor gift1 gift2 gift3 gift4 gift5 gift6 match man_room");//显示地图首先清理界面
        switch (levelList[chooseLevel-1][i]) {
            case -1:
                it.attr("sign", "-1").addClass("normal");
                break;
            case 0:
               it.attr("sign", "0").addClass("floor");
                break;
            case 1:
                it.addClass("wall").attr("sign", "1");
                break;
            case 2:
                it.attr("sign", "2").addClass("room");
                break;
            case 31:
                it.addClass("gift1").attr("sign", "31");
                break;
            case 32:
                it.addClass("gift2").attr("sign", "32");
                break;
            case 33:
                it.addClass("gift3").attr("sign", "33");
                break;
            case 34:
                it.addClass("gift4").attr("sign", "34");
                break;
            case 35:
                it.addClass("gift5").attr("sign", "35");
                break;
            case 36:
                it.addClass("gift6").attr("sign", "36");
                break;
            case 4:
                it.addClass("man").attr("sign", "4");
                break;
        }
        i++;
    }
}
//选择关卡
function choose(){
    $(".chooseLevel div").click(function(){
        chooseLevel= $(this).attr("level");       //获取事件源的level属性的值
        showMap();                                 //显示地图
        initialize();                              //初始化
});}

//游戏进行状态
function playing(){
    move();                                       //允许人物移动
    startjudget();                                  //启动监视游戏输赢机制
    startclock();                                   //开启时间进度条计时机制
    startPull_backSystem();                        //开启回退机制

}

//游戏结束状态
function game_over(){
    notmove();                                      //不允许人物移动
    stopclock();                                    //停止时间进度条
    stopjudget();                                     //停止输赢监视机制
    stopPull_backSystem();                              //关闭回退机制
}

//判断输赢函数，监视游戏输赢
function judget() {
    var it = count - boxCount;
    var timenow = h * 3600 + m * 60 + s;
    if (it == 0) {                                              //已经将所有箱子推入目标位置
        $("#judget > img").attr("src","img/奖杯.png");
        $("#judget").addClass("show").find("img").addClass("show");            //弹出成功的对话框
        $("#judget").find(".show_score").text("成功!!您用时" + h + "时" + m + "分" + s + "秒" + ss + "毫秒,用了" + step + "步!!!!" + "分数为" + score());//显示本关分数
        game_over();            //游戏结束

        history();//将此次闯关成绩存入历史记录
        ranking();//将此闯关记录存入排行榜
        showranking();//刷新排行榜

    }
    if ((step > steplimit) || (timenow > timelimit)) {

        $("#judget > img").attr("src","img/游戏失败.png");
        $("#judget").addClass("show").find("img").addClass("show");
        if (step > steplimit) {                                             //判断输的原因，超过步数限制
            $("#judget div:last-child").text("您已超过此关的步数限制，您输了");
        }
        if (timenow > timelimit) {                                          //超过时间限制
            $("#judget div:last-child").text("您已超过此关的时间限制，您输了");
        }
       game_over();                                                           //游戏结束

    }
}
//游戏初始化
function initialize(){
    count=0;
    step=0;
    stepBackArray.length=0;//栈清空
    pullbackcount=0;     //已经回退步数清零
    m=0,h=0,s=0,ss=1;
    //var t=h+"时"+m+"分"+s+"秒"+ss+"毫秒";  //时分秒运算
    $("#judget").find("img").removeClass("show");
    $(".showtime").css("width",200+"px").removeClass("warning").css( "background-color","bisque" );
    $(".showStep").removeClass("warning");
    $("#show").removeClass("show");
}

//允许移动
function  move() {
    can_move=true;
    $(".right")[0].addEventListener("click",moveright,false);

    $(".left")[0].addEventListener("click",moveleft,false);

    $(".down")[0].addEventListener("click",movedown,false);

    $(".up")[0].addEventListener("click",moveup,false);

}

//禁止人物移动
function notmove(){
    can_move=false;
    $(".right")[0].removeEventListener("click",moveright,false);

    $(".left")[0].removeEventListener("click",moveleft,false);

    $(".down")[0].removeEventListener("click",movedown,false);

    $(".up")[0].removeEventListener("click",moveup,false);

}

//鼠标控制人物移动函数
function move_mouse(){
    $("div.gameblock").click(function(){
        //  var is_sameCol=false;                   //标志位 判断点击元素和人物是否在同一列
        // var is_sameRow=false;                    //标志位  判断点击元素和人物是否在统一行
        if(can_move==true){
        var col =(position+1)%11;                //人物所在列数为col列
        var row = parseInt((position+1)/11)+1;   //人物所在行数为row行
        var click_position=$(this).index();    //获取点击元素的数组下标
        var click_col=(click_position+1)%11;    //获取点击元素所在列数
        var click_row= parseInt((click_position+1)/11)+1;  //获取点击元素所在行数
        if(col==click_col){
            if(click_position>position){
                movedown();
            }
            else if(click_position<position){
                moveup();
            }
        }
        if(row==click_row){
            if(click_position>position){
                moveright();
            }
            else  if(click_position<position){
                moveleft();
            }
        }  }
    });
}

//响应键盘事件，用键盘方向键控制人物移动
function Keytest(event) {

    switch(event.keyCode){
        case 38:
            $(".up").click();
            break;
        case 40:
            $(".down").click();
            break;
        case 37:
            $(".left").click();
            break;
        case 39:
            $(".right").click();
            break;
    }
}

//用于判断已经成功推入圣诞屋是哪一种礼物
function which_gift(_this){
    var itt;
    if(_this.hasClass("gift1")){
        itt=31;
    }
    if(_this.hasClass("gift2")){
        itt=32;
    }
    if(_this.hasClass("gift3")){
        itt=33;
    }
    if(_this.hasClass("gift4")){
        itt=34;
    }
    if(_this.hasClass("gift5")){
        itt=35;
    }
    if(_this.hasClass("gift6")){
        itt=36;
    }
    return itt;
}

function moveright() {

    var _this= $(".game_panel").children().eq(position);
    if (_this.next().attr("sign") == 0) {                 //如果下一个位置是空白
        _this.next().addClass("man").attr("sign", "4");
        if (_this.attr("sign") == 6) {
            _this.removeClass("man_room").attr("sign", "2");
            record(position,6,position+1,0,undefined,undefined ,count);
        }
        else{
            _this.removeClass("man").addClass("floor").attr("sign", "0");
            record(position,4,position+1,0,undefined,undefined,count);   //入栈
                }
        position++;
        step++;


    }
    else if (parseInt(_this.next().attr("sign"))>30&&parseInt(_this.next().attr("sign"))<37) {//将箱子移向空白位置
        var it=_this.next().attr("sign");
        var itt=it-30;
        if (_this.next().next().attr("sign") == 0) {
            _this.next().next().addClass("gift"+itt).attr("sign", it);
            _this.next().removeClass("gift"+itt).addClass("man").attr("sign", "4");
            if (_this.attr("sign") == 6) {
                _this.removeClass("man_room").attr("sign", "2");
                record(position,6,position+2,0,position+1,it,count);
            }
            else{
                _this.removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+2,0,position+1,it,count);
            }
            position++;
            step++;
        }
        else if (_this.next().next().attr("sign") == 2) {         //将箱子移到目标位置
            _this.next().next().addClass("match").addClass("gift"+itt).attr("sign", 5);
            _this.next().removeClass("gift"+itt).addClass("man").attr("sign", "4");
            if (_this.attr("sign") == 6) {
                _this.removeClass("man_room").attr("sign", "2");
                record(position,6,position+2,2,position+1,it,count);
            }
            else{
                _this.removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+2,2,position+1,it,count);
            }
            count++;
            position++;
            step++;
        }
    }
    else if(_this.next().attr("sign") == 5) {//将箱子从目标位置移出
        var it=_this.next().attr("class");
        var itt;
        itt=which_gift(_this.next());
       // alert(itt);
        if (_this.next().next().attr("sign") == 0) {
            _this.next().next().addClass("gift"+(itt-30)).attr("sign",itt);
            _this.next().addClass("man_room").removeClass("gift"+(itt-30)).removeClass("match").attr("sign", "6");
            if (_this.attr("sign") == 6) {
                _this.removeClass("man_room").attr("sign", "2");
                record(position,6,position+2,0,position+1,5,count);
            }
            else{
                _this.removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+2,0,position+1,5,count);
            }
            count--;
            position++;
            step++;
        }
        else if (_this.next().next().attr("sign") == 2) {
            _this.next().next().addClass("match").addClass("gift"+(itt-30)).attr("sign", 5);
            _this.next().addClass("man_room").removeClass("match").removeClass("gift"+(itt-30)).attr("sign", "6");
            if (_this.attr("sign") == 6) {
                _this.removeClass("man_room").attr("sign", "2");
                record(position,6,position+2,2,position+1,5,count);
            }
            else{
                _this.removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+2,2,position+1,5,count);
            }
            position++;
            step++;
        }

    }
    else if (_this.next().attr("sign") == 2) {//人进入目标位置
        _this.next().addClass("man_room").attr("sign", "6");
        if (_this.attr("sign") == 6) {
            _this.removeClass("man_room").attr("sign", "2");
            record(position,6,position+1,2,undefined,undefined,count);
        }
        else{
            _this.removeClass("man").addClass("floor").attr("sign", "0");
            record(position,4,position+1,2,undefined,undefined,count);
        }
        position++;
        step++;

    }
}
function moveup() {

    var _this= $(".game_panel").children();
         if (_this.eq(position-11).attr("sign") == 0) {      //如果下一个位置是空白

         _this.eq(position-11).addClass("man").attr("sign", "4");
         if (_this.eq(position).attr("sign") == 6) {
         _this.eq(position).removeClass("man_room").attr("sign", "2");
         record(position,6,position-11,0,undefined,undefined ,count);
         }
         else{
         _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
         record(position,4,position-11,0,undefined,undefined,count);//入栈
         }
         position=position-11;
         step++;

         }
         else if (parseInt(_this.eq(position-11).attr("sign"))>30&&parseInt(_this.eq(position-11).attr("sign"))<37) {//将箱子移向空白位置
         var it=_this.eq(position-11).attr("sign");
         var itt=it-30;
         if (_this.eq(position-22).attr("sign") == 0) {
         _this.eq(position-22).addClass("gift"+itt).attr("sign", it);
         _this.eq(position-11).removeClass("gift"+itt).addClass("man").attr("sign", "4");
         if (_this.eq(position).attr("sign") == 6) {
             _this.eq(position).removeClass("man_room").attr("sign", "2");
         record(position,6,position-22,0,position-11,it,count);
         }
         else{
             _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
         record(position,4,position-22,0,position-11,it,count);
         }
         position=position-11;
         step++;
         }
         else if (_this.eq(position-22).attr("sign") == 2) {         //将箱子移到目标位置
         _this.eq(position-22).addClass("match").addClass("gift"+itt).attr("sign", 5);
         _this.eq(position-11).removeClass("gift"+itt).addClass("man").attr("sign", "4");
         if (_this.eq(position).attr("sign") == 6) {
             _this.eq(position).removeClass("man_room").attr("sign", "2");
         record(position,6,position-22,2,position-11,it,count);
         }
         else{
             _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
         record(position,4,position-22,2,position-11,it,count);
         }
         count++;
         position=position-11;
         step++;
         }
         }
         else if(_this.eq(position-11).attr("sign") == 5) {//将箱子从目标位置移出
         var it=_this.eq(position-11).attr("class");
         var itt;
         itt=which_gift(_this.eq(position-11));
            // alert(itt);
         if (_this.eq(position-22).attr("sign") == 0) {
         _this.eq(position-22).addClass("gift"+(itt-30)).attr("sign",itt);
         _this.eq(position-11).addClass("man_room").removeClass("gift"+(itt-30)).removeClass("match").attr("sign", "6");
         if (_this.eq(position).attr("sign") == 6) {
             _this.eq(position).removeClass("man_room").attr("sign", "2");
         record(position,6,position-22,0,position-11,5,count);
         }
         else{
             _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
         record(position,4,position-22,0,position-11,5,count);
         }
         count--;
         position=position-11;
         step++;
         }
         else if (_this.eq(position-22).attr("sign") == 2) {
         _this.eq(position-22).addClass("match").addClass("gift"+(itt-30)).attr("sign", 5);
           //  alert(itt);
             _this.eq(position-11).addClass("man_room").removeClass("match").removeClass("gift"+(itt-30)).attr("sign", "6");
            // alert(_this.eq(position-11).attr("class"));
         if (_this.eq(position).attr("sign") == 6) {
             _this.eq(position).removeClass("man_room").attr("sign", "2");
         record(position,6,position-22,2,position-11,5,count);
         }
         else{
             _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
         record(position,4,position-22,2,position-11,5,count);
         }
         position=position-11;
         step++;
         }

         }
         else if (_this.eq(position-11).attr("sign") == 2) {//人进入目标位置
             //var test=$(".game_panel").children().eq(position-11).attr("sign")+"aaaaaaaaa"+$(".game_panel").children().eq(position-11).attr("class");
            // alert(test);
             _this.eq(position-11).addClass("man_room").attr("sign", "6");
         if (_this.eq(position).attr("sign") == 6) {
             _this.eq(position).removeClass("man_room").attr("sign", "2");
             //alert($(".game_panel").children().eq(position).attr("sign")+"aaaaaaaaa"+$(".game_panel").children().eq(position).attr("class"));

             record(position,6,position-11,2,undefined,undefined,count);
         }
         else{
             _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
         record(position,4,position-11,2,undefined,undefined,count);
         }
             //alert($(".game_panel").children().eq(position).attr("sign")+"aaaaaaaaa"+$(".game_panel").children().eq(position).attr("class"));

             position=position-11;
         step++;

         }
         }
function movedown() {
    var _this= $(".game_panel").children();
    if (_this.eq(position+11).attr("sign") == 0) {      //如果下一个位置是空白

        _this.eq(position+11).addClass("man").attr("sign", "4");
        if (_this.eq(position).attr("sign") == 6) {
            _this.eq(position).removeClass("man_room").attr("sign", "2");
            record(position,6,position+11,0,undefined,undefined ,count);
        }
        else{
            _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
            record(position,4,position+11,0,undefined,undefined,count);//入栈
        }
        position=position+11;
        step++;

    }
    else if (parseInt(_this.eq(position+11).attr("sign"))>30&&parseInt(_this.eq(position+11).attr("sign"))<37) {//将箱子移向空白位置
        var it=_this.eq(position+11).attr("sign");
        var itt=it-30;
        if (_this.eq(position+22).attr("sign") == 0) {
            _this.eq(position+22).addClass("gift"+itt).attr("sign", it);
            _this.eq(position+11).removeClass("gift"+itt).addClass("man").attr("sign", "4");
            if (_this.eq(position).attr("sign") == 6) {
                _this.eq(position).removeClass("man_room").attr("sign", "2");
                record(position,6,position+22,0,position+11,it,count);
            }
            else{
                _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+22,0,position+11,it,count);
            }
            position=position+11;
            step++;
        }
        else if (_this.eq(position+22).attr("sign") == 2) {         //将箱子移到目标位置
            _this.eq(position+22).addClass("match").addClass("gift"+itt).attr("sign", 5);
            _this.eq(position+11).removeClass("gift"+itt).addClass("man").attr("sign", "4");
            if (_this.eq(position).attr("sign") == 6) {
                _this.eq(position).removeClass("man_room").attr("sign", "2");
                record(position,6,position+22,2,position+11,it,count);
            }
            else{
                _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+22,2,position+11,it,count);
            }
            count++;
            position=position+11;
            step++;
        }
    }
    else if(_this.eq(position+11).attr("sign") == 5) {//将箱子从目标位置移出
        var it=_this.eq(position+11).attr("class");
        var itt;
        itt=which_gift(_this.eq(position+11));
        if (_this.eq(position+22).attr("sign") == 0) {
            _this.eq(position+22).addClass("gift"+(itt-30)).attr("sign",itt);
            _this.eq(position+11).addClass("man_room").removeClass("gift"+(itt-30)).removeClass("match").attr("sign", "6");
            if (_this.eq(position).attr("sign") == 6) {
                _this.eq(position).removeClass("man_room").attr("sign", "2");
                record(position,6,position+22,0,position+11,5,count);
            }
            else{
                _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+22,0,position+11,5,count);
            }
            count--;
            position=position+11;
            step++;
        }
        else if (_this.eq(position+22).attr("sign") == 2) {
            _this.eq(position+22).addClass("match").addClass("gift"+(itt-30)).attr("sign", 5);
            _this.eq(position+11).addClass("man_room").removeClass("match").removeClass("gift"+(itt-30)).attr("sign", "6");
            if (_this.eq(position).attr("sign") == 6) {
                _this.eq(position).removeClass("man_room").attr("sign", "2");
                record(position,6,position+22,2,position+11,5,count);
            }
            else{
                _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
                record(position,4,position+22,2,position+11,5,count);
            }
            position=position+11;
            step++;
        }

    }
    else if (_this.eq(position+11).attr("sign") == 2) {//人进入目标位置
        _this.eq(position+11).addClass("man_room").attr("sign", "6");
        if (_this.eq(position).attr("sign") == 6) {
            _this.eq(position).removeClass("man_room").attr("sign", "2");
            record(position,6,position+11,2,undefined,undefined,count);
        }
        else{
            _this.eq(position).removeClass("man").addClass("floor").attr("sign", "0");
            record(position,4,position+11,2,undefined,undefined,count);
        }
        position=position+11;
        step++;

    }
}
 function moveleft() {
 var _this= $(".game_panel").children().eq(position);
 if (_this.prev().attr("sign") == 0) {//如果下一个位置是空白
 _this.prev().addClass("man").attr("sign", "4");
 if (_this.attr("sign") == 6) {
 _this.removeClass("man_room").attr("sign", "2");
 record(position,6,position-1,0,undefined,undefined ,count);
 }
 else{
 _this.removeClass("man").addClass("floor").attr("sign", "0");
 record(position,4,position-1,0,undefined,undefined,count);//入栈
 }
 position--;
 step++;

 }
 else if (parseInt(_this.prev().attr("sign"))>30&&parseInt(_this.prev().attr("sign"))<37) {//将箱子移向空白位置
 var it=_this.prev().attr("sign");
 var itt=it-30;
 if (_this.prev().prev().attr("sign") == 0) {
 _this.prev().prev().addClass("gift"+itt).attr("sign", it);
 _this.prev().removeClass("gift"+itt).addClass("man").attr("sign", "4");
 if (_this.attr("sign") == 6) {
 _this.removeClass("man_room").attr("sign", "2");
 record(position,6,position-2,0,position-1,it,count);
 }
 else{
 _this.removeClass("man").addClass("floor").attr("sign", "0");
 record(position,4,position-2,0,position-1,it,count);
 }
 position--;
 step++;
 }
 else if (_this.prev().prev().attr("sign") == 2) {         //将箱子移到目标位置
 _this.prev().prev().addClass("match").addClass("gift"+itt).attr("sign", 5);
 _this.prev().removeClass("gift"+itt).addClass("man").attr("sign", "4");
 if (_this.attr("sign") == 6) {
 _this.removeClass("man_room").attr("sign", "2");
 record(position,6,position-2,2,position-1,it,count);
 }
 else{
 _this.removeClass("man").addClass("floor").attr("sign", "0");
 record(position,4,position-2,2,position-1,it,count);
 }
 count++;
 position--;
 step++;
 }
 }
 else if(_this.prev().attr("sign") == 5) {//将箱子从目标位置移出
 var it=_this.prev().attr("class");
 var itt;
 itt=which_gift(_this.prev());
 if (_this.prev().prev().attr("sign") == 0) {
 _this.prev().prev().addClass("gift"+(itt-30)).attr("sign",itt);
 _this.prev().addClass("man_room").removeClass("gift"+(itt-30)).removeClass("match").attr("sign", "6");
 if (_this.attr("sign") == 6) {
 _this.removeClass("man_room").attr("sign", "2");
 record(position,6,position-2,0,position-1,5,count);
 }
 else{
 _this.removeClass("man").addClass("floor").attr("sign", "0");
 record(position,4,position-2,0,position-1,5,count);
 }
 count--;
 position--;
 step++;
 }
 else if (_this.prev().prev().attr("sign") == 2) {
 _this.prev().prev().addClass("match").addClass("gift"+(itt-30)).attr("sign", 5);
 _this.prev().addClass("man_room").removeClass("match").removeClass("gift"+(itt-30)).attr("sign", "6");
 if (_this.attr("sign") == 6) {
 _this.removeClass("man_room").attr("sign", "2");
 record(position,6,position-2,2,position-1,5,count);
 }
 else{
 _this.removeClass("man").addClass("floor").attr("sign", "0");
 record(position,4,position-2,2,position-1,5,count);
 }
 position--;
 step++;
 }

 }
 else if (_this.prev().attr("sign") == 2) {//人进入目标位置
 _this.prev().addClass("man_room").attr("sign", "6");
 if (_this.attr("sign") == 6) {
 _this.removeClass("man_room").attr("sign", "2");
 record(position,6,position-1,2,undefined,undefined,count);
 }
 else{
 _this.removeClass("man").addClass("floor").attr("sign", "0");
 record(position,4,position-1,2,undefined,undefined,count);
 }
 position--;
 step++;

 }
 }

//利用栈做回退机制，根据每关难度，每一关的限制的回退步数不一样
var stepBackArray=Array();
//在记录移动之前的位置，一次移动最少影响两个方格，最多影响三个方格
function record(position1,sign1,position2,sign2,position3,sign3,count){
    var group=[position1,sign1,position2,sign2,position3,sign3,count];
    stepBackArray.unshift(group);//进栈


}
//回退函数
function pull_back(){
    var it=stepBackArray.shift();//出栈
    //alert(it);
    if(it==undefined){
        alert("您还未移动，所以不能进行回退操作！！！");
        return;
    }
    if(pullbackcount==5){
        alert("您已经回退了5步");
        return;
    }
    var ittt=which_gift($(".game_panel div").eq(it[2]));
   // alert();
    //alert(ittt);
    for(i=1;i<6;i=i+2){
        var _position=it[i-1];
        var sign=it[i];

        // alert(_position+"   "+sign);
        if(_position==undefined){//如果影响只有两个方格，则跳出循环
            break;
        }
        var itt= $(".game_panel div").eq(_position);   //缓存对象
        itt.removeClass("man room wall  gift1 gift2 gift3 gift4 gift5 gift6 match man_room");//显示地图首先清理界面

        //alert(sign);
        switch (sign){
            case 0:
                itt.attr("sign", "0");
                break;
            case 1:
                itt.addClass("wall").attr("sign", "1");
                break;
            case 2:
                itt.attr("sign", "2").addClass("room");
                break;
            case '31':
                itt.addClass("gift1").attr("sign", "31");
                break;
            case "32":
                itt.addClass("gift2").attr("sign", "32");
                break;
            case '33':
                itt.addClass("gift3").attr("sign", "33");
                break;
            case '34':
                itt.addClass("gift4").attr("sign", "34");
                break;
            case '35':
                itt.addClass("gift5").attr("sign", "35");
                break;
            case '36':
                itt.addClass("gift6").attr("sign", "36");
                break;
            case 4:
                itt.addClass("man").attr("sign", "4");
                break;
            case 5:
                if(ittt!=undefined){

                    itt.addClass("match room").addClass("gift"+(ittt-30)).attr("sign", "5");
                }
                break;
            case 6:
                itt.addClass("man_room").attr("sign", "6");
                break;
        }
    }
    count=it[6];
    step--;
    position=it[0];
    pullbackcount++;
}
//允许回退
function startPull_backSystem(){

    $("#stepBack")[0].addEventListener("click",pull_back,false);
}
//不允许回退
function  stopPull_backSystem(){

    $("#stepBack")[0].removeEventListener("click",pull_back,false);

}


//计步器
setInterval("stepshow()",10);
function stepshow(){
    var it=steplimit-step;
    $(".showStep").text("剩余步数"+it);
    if(it<=5){
        $(".showStep").addClass("warning");
    }
}

//记录当前已经成功推箱子的个数
setInterval("stepmatch()",10);
function stepmatch(){
    $(".showmatch").text(count);}


//计时器  实现时间进度条
var se,m=0,h=0,s=0,ss=1;

function second(){


    if((ss%100)==0){s+=1;ss=1;}

    if(s>0 &&(s%60)==0){m+=1;s=0;}

    if(m>0 &&(m%60)==0){h+=1;m=0;}

    var t=h+"时"+m+"分"+s+"秒"+ss+"毫秒";  //时分秒运算
    var timenow=h*3600+m*60+s;
    var widthnow=((timelimit-timenow)/timelimit)*200;
    $(".showtime").css("width",widthnow+"px");
   if(widthnow<=50){
       $(".showtime").css("background-color","red").addClass("warning");
   }
    //动态计时，就是在很短的时间里不停给显示时间的地方更新数值，由于速度很快，这样计时器看起来时刻都在变化。
    // 但其实不是的，它从本质上还是静态的，这跟js的伪多线程原理是一样的。
    ss+=1;

}

function startclock(){se=setInterval("second()",10);}
function stopclock(){ clearInterval(se);}
//计时器结束


//判断是否成功
function startjudget(){
    see=setInterval("judget()",10);

}
function stopjudget(){
    clearInterval(see);
}
//将本次成功闯关成绩保存到历史记录,使用队列机制，最多只能保存最近的5次历史记录
function history(){
    var it= h+"时"+m+"分"+s+"秒"+ss+"毫秒";
    var group=[step,it,score()];
    if(levelList[chooseLevel-1][101].length==5){
        //  alert("haha");                                 //每次入队之前判断是否队满
        levelList[chooseLevel-1][101].pop();            //队满出队
    }
    levelList[chooseLevel-1][101].unshift(group);//入队
}
//根据本次闯关所用步数和时间折算此次闯关成绩,满分10000，
function score(){
    var timenow=h*3600+m*60+s;
    return  parseInt((steplimit-step)/steplimit*7000+(timelimit-timenow)/timelimit*3000);
}
//将本次成功闯关记录保存到本关排行榜，使用排序功能,排行榜只能保存前5名
function ranking() {
    var i = 0;
    var it = h + "时" + m + "分" + s + "秒" + ss + "毫秒";
    var group = [step, it, score()];

    if (levelList[chooseLevel - 1][102].length == 5) {        //每次入队之前判断是否队满
        levelList[chooseLevel - 1][102].pop();            //队满出队
    }
    for (i = 0; i < 5; i++) {
        if (levelList[chooseLevel - 1][102][i] == undefined) {
            // alert("不存在");
            levelList[chooseLevel - 1][102].splice(i, 0, group);
            // alert(levelList[chooseLevel-1][102].length);
            // alert("不存在"+ levelList[chooseLevel-1][103]+"i:"+i);
            break;
        }                                                       //跳出循环.                      //排序，插入
        else  if (score() > levelList[chooseLevel - 1][102][i][2]) {
            levelList[chooseLevel - 1][102].splice(i, 0, group);
            // alert(levelList[chooseLevel-1][103].length);
            // alert( levelList[chooseLevel-1][103]);
            break;
        }

    }
   // localStorage.clear();
   // local_save();




}

function showhistory(){
    $("#show").addClass("show");
    $("#show").empty();
    var it;
    var i;
    if(levelList[chooseLevel-1][101].length==0){
        $("#show").append("<h4>还未游戏历史记录</h4>");
        return;
    }
    for( i=0;i<5;i++){
        it="历史记录"+(i+1)+"：     步数:"+levelList[chooseLevel-1][101][i][0]+"!完成时间:"+levelList[chooseLevel-1][101][i][1]+"!得分:"+levelList[chooseLevel-1][101][i][2];
        $("#show").append("<h4></h4>");
        $("#show ").children().eq(i).text(it);
    }
}
function showranking(){
    $("#show").addClass("show");
    $("#show").empty();
    var itt,i;
    if(levelList[chooseLevel-1][102].length==0){
        $("#show").append("<h4>还未游戏历排行记录</h4>");
        return;
    }
    for( i=0;i<5;i++){
         itt="第"+(i+1)+"名：    步数："+levelList[chooseLevel-1][102][i][0]+"！完成时间："+levelList[chooseLevel-1][102][i][1]+"！得分："+levelList[chooseLevel-1][102][i][2];
         $("#show").append("<h4></h4>");
         $("#show ").children().eq(i).text(itt);

    }
}

function showRanking(){

    $(".Ranking").empty();
    var level;
    for(level=0;level<6;level++){
        $(".Ranking").append("<h4>第"+(level+1)+"关</h4>");
        //alert(levelList[level][102].length);
        if(levelList[level][102].length!=0){

            for( i=0;i<levelList[level][102].length;i++){
               var itt="第"+(i+1)+"名：    步数："+levelList[chooseLevel-1][102][i][0]+"！完成时间："+levelList[chooseLevel-1][102][i][1]+"！得分："+levelList[chooseLevel-1][102][i][2];
                $(".Ranking").append("<h4>"+itt+"</h4>");
               // $(".Ranking").children().eq(i+1).text(itt);

            }
        }
        else
            $(".Ranking").append("<h4>本关无游戏记录</h4>");
    }
   // local_save();
    //showlocal_save();
}
function checkNum(obj){

    if(!isNaN(obj.value)){
        return true;
    }

    else{  alert("请输入数字类型! 否则将使用默认值")
        return false;
    }
}


/*function local_save(){
    //localStorage.clear();
  for(var i=0;i<levelList[chooseLevel-1][102].length;i++){
      var name="第"+chooseLevel+"关第"+(i+1)+"名";
      var it=levelList[chooseLevel-1][102][i].join(",");
      localStorage.setItem(name,it);
      //alert( localStorage.getItem(name));

  }

}
function showlocal_save(){
    var name="第"+chooseLevel+"关第"+1+"名";
    alert( localStorage.getItem(name));

}*/
