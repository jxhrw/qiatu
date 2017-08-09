$(document).ready(function(){
    $(".popups").css('height',$(window).height());
    $(".closeBtn").click(function(){
        $(".popups").hide();
    });
});

function ajaxPost(url,data,successFunc,errorFunc){
    $.post(url,{data:JSON.stringify(data)},function(res){
        if(res.sc=='0'){
            successFunc(res);
        }else if(res.sc=="-99999"){
            //errorPrompt("请稍后再试",2000);
        }else {
            if(errorFunc){
                errorFunc(res);
            }
        }
    });
}

//获取url的参数
function GetParams() {
    var queryString = window.location.search; //获取url中"?"符后的字串
    var params = {};
    if (queryString.indexOf("?") != -1) {
        queryString = queryString.substr(1);
        paramArray = queryString.split("&");
        for(var i = 0; i < paramArray.length; i ++) {
            kv = paramArray[i].split("=");
            params[kv[0]] = decodeURIComponent(kv[1]);
        }
    }
    return params;
}

function formatNum(num){//补0
    return num.toString().replace(/^(\d)$/, "0$1");
}
function formatStrDate(vArg,format){//格式化日期0-0-0,format 格式 - 或/
    vArg=new Date(parseInt(vArg));
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + format + formatNum(vArg[1]) + format + formatNum(vArg[2]);
            break;
        case "object":
            return vArg.getFullYear() + format + formatNum(vArg.getMonth() + 1) + format + formatNum(vArg.getDate());
            break;
    }
}
function formatStrDateNoYear(vArg,format){//格式化日期0-0,format 格式 - 或 /
    vArg=new Date(parseInt(vArg));
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return formatNum(vArg[1]) + format + formatNum(vArg[2]);
            break;
        case "object":
            return formatNum(vArg.getMonth() + 1) + format + formatNum(vArg.getDate());
            break;
    }
}

function timeFormatSecond(vArg,format){//格式化时间0：0：0
    vArg=new Date(parseInt(vArg));
    switch(typeof vArg) {
        case "object":
            return formatNum(vArg.getHours()) + format + formatNum(vArg.getMinutes()) + format + formatNum(vArg.getSeconds());
            break;
    }
}

//去掉时间的秒钟
function secondIsNon(time){
    if(time.split(":").length>=3){
        time=time.split(":")[0]+":"+time.split(":")[1];
    }
    return time;
}


function chinese(str){
    var ss=str.replace(/[^\u4e00-\u9fa5]/gi,"");
    return ss;
}