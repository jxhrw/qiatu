$(window).ready(function(){
    var windowHeight=$(window).height();
    var weekTop=$(".tipOtaName").css("height").split("px")[0]*1+15;
    $(".calendarBox").css("height",windowHeight);
    $("#mask,#mask1").css({"height":windowHeight-30,"top":"15px"});
    $(".calendarBox .weekDay").css("top",weekTop);
    $(".detailEdit li").click(function() {
        if($("span",this).hasClass("detailEditli1")||$("span",this).hasClass("detailEditli2")||$("span",this).hasClass("detailEditli3")){
            $(".calendarBox").show();
        }
    });

    var date=new Date();
    var curMonthDays = new Date(date.getFullYear(), (date.getMonth()+1), 0).getDate();
    var today=date.getDay();

    createCalendar(6,"calendar");
    createCalendar(6,"calendar1");

    var checkIn,checkOut,checkLeave;
    //点击事件
    var firstS=1;//1代表这次点击是入住，2代表这次点击是离店
    var cancel=0;//0不取消，1取消
    var lastYear,
        lastMonth,
        lastDate,
        lastDay;//上一次点击的年月日星期
    var lastIndex;//上一次点击的日期在第几个表
    //住宿消费
    $("#calendar table td").click(function(){
        var index=$(this).index();//得到周几
        var year=$(this).parents("table").prev("div").find(".year").html();
        var month=$(this).parents("table").prev("div").find(".month").html();
        var toDate=$(this).html().split("<span>")[0];
        if(toDate=="今天"){
            toDate=date.getDate();
        }
        if(toDate){//表示点的不是空白
            var color=$(this).attr("name");
            if(color!="999"){//表示点的不是已过去的日期
                if( Date.parse(new Date(year+"/"+month+"/"+toDate)) < Date.parse(new Date(lastYear+"/"+lastMonth+"/"+lastDate)) ){
                    firstS=1;
                }
                if( Date.parse(new Date(year+"/"+month+"/"+toDate)) == Date.parse(new Date(lastYear+"/"+lastMonth+"/"+lastDate)) ){
                    firstS=1;
                    if($(this).css("background-color")!="#fff"){
                        cancel=1;
                    }else {
                        cancel=0;
                    }
                }
                if(firstS==1){//入住
                    if(cancel==0){
                        $("#calendar table td").find("span").parents("td").css("color","#000");
                        $("#calendar table td").css({"background-color":"#fff"}).find("span").remove();
                        $(this).css({"background-color":"#66afba","color":"#fff"}).append("<span>入住</span>");
                        firstS=2;
                        lastYear=year;
                        lastMonth=month;
                        lastDate=toDate;
                        lastDay=index;
                        lastIndex=$(this).parents("table").index();
                    }
                    if(cancel==1){
                        $("#calendar table td").find("span").parents("td").css("color","#000");
                        $("#calendar table td").css({"background-color":"#fff"}).find("span").remove();
                        cancel=0;
                        lastYear=null;
                        lastMonth=null;
                        lastDate=null;
                        lastIndex=null;
                    }
                    return;
                }
                if(firstS==2){//离店
                    $(this).css({"background-color":"#66afba","color":"#fff"}).append("<span>离店</span>");
                    var loop=($(this).parents("table").index()-lastIndex)/2+1;//总共涉及到几个月
                    var begin=(lastIndex-1)/2;
                    var end=($(this).parents("table").index()-1)/2;
                    if(loop==1){
                        $("#calendar table").eq(begin).find("td").each(function(){
                            //console.log($(this).html()*1==lastDate*1)
                            if($(this).css("background-color")=="#66afba"){
                                $(this).css({"background-color":"#66afba"});
                            }
                            if($(this).html()*1>lastDate && $(this).html()*1<toDate){
                                $(this).css("background-color","#cfe5e5");
                            }
                        })
                    }
                    if(loop>=2){
                        $("#calendar table").eq(begin).find("td").each(function(){
                            if($(this).css("background-color")=="#66afba"){
                                $(this).css({"background-color":"#66afba"});
                            }
                            if($(this).html()*1>lastDate){
                                $(this).css("background-color","#cfe5e5");
                            }
                        });
                        $("#calendar table").eq(end).find("td").each(function(){
                            if($(this).html()*1<toDate && $(this).html()){
                                $(this).css("background-color","#cfe5e5");
                            }
                        });
                        for(var i=1;i<loop-1;i++){
                            $("#calendar table").eq(begin+i).find("td").each(function(){
                                if($(this).html()){
                                    $(this).css("background-color","#cfe5e5");
                                }
                            });
                        }
                    }
                    checkIn= Date.parse(new Date(lastYear+"/"+lastMonth+"/"+lastDate+"  08:00:00"));
                    checkOut= Date.parse(new Date(year+"/"+month+"/"+toDate+"  08:00:00"));
                    che=(checkOut-checkIn)/(24*3600*1000);
                    // alert(che)
                    firstS=1;
                    lastYear=null;
                    lastMonth=null;
                    lastDate=null;
                    lastIndex=null;
                    return;
                }
            }
        }
    });

    //非住宿消费
    $("#calendar1 table td").click(function(){
        var year=$(this).parents("table").prev("div").find(".year").html();
        var month=$(this).parents("table").prev("div").find(".month").html();
        var toDate=$(this).html().split("<span>")[0];
        if(toDate=="今天"){
            toDate=date.getDate();
        }
        if(toDate){//表示点的不是空白
            var color=$(this).attr("name");
            if(color!="999"){//表示点的不是已过去的日期
                $("#calendar1 table td").find("span").parents("td").css("color","#000");
                $("#calendar1 table td").css({"background-color":"#fff"}).find("span").remove();
                if($(this).css("background-color")!="#66afba"){
                    $(this).css({"background-color":"#66afba","color":"#fff"}).append("<span>离店</span>");
                    checkLeave= Date.parse(new Date(year+"/"+month+"/"+toDate+"  08:00:00"));
                }
            }
        }
    });

    //点取消
    $(".close").click(function () {
        $(".calendarBox,#mask,#mask1").hide();
    });

    //住宿点确定
    $("#mask .yes").click(function(){
        if(checkIn!=undefined && checkOut!=undefined){
            $(".detailEditli2").html(dateFormat(checkIn));
            $(".detailEditli3").html(dateFormat(checkOut));
            $(".calendarBox,#mask,#mask1").hide();
        }
    });

    //非住宿点确定
    $("#mask1 .yes").click(function(){
        if(checkLeave!=undefined){
            $(".detailEditli1").html(dateFormat(checkLeave));
            $(".calendarBox,#mask,#mask1").hide();
        }
    });

    //生成日历
    function createCalendar(showMonth,calendarId){
        //showMonth 几个月，calendarId 生成位置的id
        var calendarTable="#"+calendarId+" table";
        var calendarNewId="#"+calendarId;
        for(var i=0;i<showMonth;i++){ //i小于几代表几个月
            var nowYear=date.getFullYear();
            var nowMonth=(date.getMonth()+i)%12+1;
            if(date.getMonth()+i>=12){
                nowYear++;
            }
            if(nowMonth<10){
                $(calendarNewId).append("<div style='color: #333;font-size: 1.2rem;'>"+nowYear+"/0"+nowMonth+"<span class='year'>"+nowYear+"</span><span class='month'>"+nowMonth+"</span></div><table></table>");
            }else {
                $(calendarNewId).append("<div style='color: #333;font-size: 1.2rem;'>"+nowYear+"/"+nowMonth+"<span class='year'>"+nowYear+"</span><span class='month'>"+nowMonth+"</span></div><table></table>");
            }
            var stringTime = nowYear+"/"+nowMonth+"/"+1; /*获取当前月一号的星期开始*/
            var timestamp2 = Date.parse(new Date(stringTime));
            var time=new Date(timestamp2);
            var everyTime=time.getDay();  /*获取当前月一号的星期结束*/
            var dayCount=(new Date(nowYear,nowMonth,0)).getDate(); /*获取当前月的天数*/
            var line=Math.ceil((everyTime+dayCount)/7);//日历上这个月需要几行
            var num=1-everyTime;
            if(i==0){
                for(var k=0;k<line;k++){
                    $(calendarTable).eq(i).append("<tr></tr>");
                    var nowDate=date.getDate();//获取今天的日期
                    for(var j=0;j<7;j++){
                        if(num>0&&num<=dayCount){
                            if(num<nowDate){
                                $(calendarTable).eq(i).find("tr").eq(k).append("<td style='color: #999;'name='999'>"+num+"</td>");
                            }else if(num==nowDate){
                                $(calendarTable).eq(i).find("tr").eq(k).append("<td style='font-size:0.8rem;'>今天</td>");
                            }else {
                                $(calendarTable).eq(i).find("tr").eq(k).append("<td>"+num+"</td>");
                            }
                        }else {
                            $(calendarTable).eq(i).find("tr").eq(k).append("<td></td>");
                        }
                        num++;
                    }
                }
            }else {
                for(var k=0;k<line;k++){
                    $(calendarTable).eq(i).append("<tr></tr>");
                    for(var j=0;j<7;j++){
                        if(num>0&&num<=dayCount){
                            $(calendarTable).eq(i).find("tr").eq(k).append("<td>"+num+"</td>");
                        }else {
                            $(calendarTable).eq(i).find("tr").eq(k).append("<td></td>");
                        }
                        num++;
                    }
                }
            }
        }
    }

    //日期格式xxxx-xx-xx
    function dateFormat(timeStamp){
        var time=new Date(timeStamp);
        var year=time.getFullYear();
        var month=time.getMonth()+1;
        var date=time.getDate();
        return bZero(year)+"-"+bZero(month)+"-"+bZero(date);
    }

    //数字转换成周几
    function weekDay(x) {
        if (x == 0) {
            return "周日";
        }
        if (x == 1) {
            return "周一";
        }
        if (x == 2) {
            return "周二";
        }
        if (x == 3) {
            return "周三";
        }
        if (x == 4) {
            return "周四";
        }
        if (x == 5) {
            return "周五";
        }
        if (x == 6) {
            return "周六";
        }
    }

    //补0
    function bZero(a){
        if(a<10){
            a="0"+a;
        }
        return a;
    }
});