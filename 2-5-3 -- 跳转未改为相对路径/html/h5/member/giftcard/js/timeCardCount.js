function timeCardCountFunc(time){
    var days=Math.floor(time/(24*60*60));
    var hours=Math.floor(Math.floor(time/(60*60))%24);
    var minutes=Math.floor(Math.floor(time/(60))%60);
    var seconds=Math.floor(Math.floor(time)%60);
    colonPositionFunc(days);
    return {days:formatNum(days),hours:formatNum(hours),minutes:formatNum(minutes),seconds:formatNum(seconds)};
}

function needCountFunc(timeAll){
    timeAll = parseInt(timeAll);
    if(timeAll>0){
        var needTime = setInterval(function(){
            timeAll--;
            var nowTime=timeCardCountFunc(timeAll);
            $("#days").html(nowTime.days);
            $("#hours").html(nowTime.hours);
            $("#minutes").html(nowTime.minutes);
            $("#seconds").html(nowTime.seconds);
            if(timeAll<=0){
                clearInterval(needTime);
            }
            if(nowTime.days<100){
                document.styleSheets[0].addRule('#days:after','right: -7%');
            }
        },1000)
    }
}

function colonPositionFunc(days){
    days=parseInt(days);
    if(days<1000){
        $("#days").css("width","25%");
    }else {
        $("#days").css("width","30%");
    }
    if(days<100){
        document.styleSheets[0].addRule('#days:after','right: -7%');
    }
}