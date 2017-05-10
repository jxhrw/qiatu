 u = navigator.userAgent, app = navigator.appVersion;
 isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
 isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//匹配header签名&&评论的展示
if(isAndroid ==true) {


    function Person() {

        var requestData = "";
        this.setRequestData = function (_requestData) {
            requestData = _requestData;
        };
        this.getRequestData = function () {
            return requestData;
        }


        this.requestCommit = function (allUrl, allData) {
            var testHeader = window.AndroidObj.getHeaderData(allData);
            var obj = eval("(" + testHeader + ")");
            $.ajax({
                type: 'POST',
                url: allUrl, async: false,
                data: {data: allData},
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader('apiversion', ''+obj.apiversion )
                    XMLHttpRequest.setRequestHeader('channel', ''+obj.channel)
                    XMLHttpRequest.setRequestHeader('location', ''+obj.location)
                    XMLHttpRequest.setRequestHeader('userid', ''+obj.userid)
                    XMLHttpRequest.setRequestHeader('uuid', ''+obj.uuid)
                    XMLHttpRequest.setRequestHeader('sign', ''+obj.sign)
                },
                success: function (data) {
                    requestData = (data);
                }
            })


        }
    }
}






//时间
var mydate = new Date();
var y = mydate.getFullYear(); //获取完整的年份(4位,1970-????)
var m = mydate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
var d = mydate.getDate();
var h = mydate.getHours(); //获取当前小时数(0-23)
 var f = mydate.getMinutes(); //获取当前分钟数(0-59)
 var se= mydate.getSeconds(); //获取当前秒数(0-59)
var date = y + "-" + m + "-" + d;
 function time(year,month,day,hour,minute,second){

     if (m%4==0)
     {
         if (m%100==0)
         {
             if (m%400==0) //能被400整除的,是闰年
             {
                 if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                     if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                         days=(year-y)*366+(month-m)*31+(day-d)+1;
                     }
                     else{
                         days=(year-y)*366+(month-m)*31+(day-d);
                     }
                 }
                 else if(m==2){
                     if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                         days=(year-y)*366+(month-m)*31+(day-d)+1;
                     }
                     else{
                         days=(year-y)*366+(month-m)*31+(day-d);
                     }
                 }
                 else{
                     if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                         days=(year-y)*366+(month-m)*31+(day-d)+1;
                     }
                     else{
                         days=(year-y)*366+(month-m)*31+(day-d);
                     }
                 }
             }
             else //能被100整除,但不能被400整除的,不是闰年
             {
                 if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                     if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                         days=(year-y)*366+(month-m)*31+(day-d)+1;
                     }
                     else{
                         days=(year-y)*366+(month-m)*31+(day-d);
                     }
                 }
                 else if(m==2){
                     if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                         days=(year-y)*366+(month-m)*31+(day-d)+1;
                     }
                     else{
                         days=(year-y)*366+(month-m)*31+(day-d);
                     }
                 }
                 else{
                     if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                         days=(year-y)*366+(month-m)*31+(day-d)+1;
                     }
                     else{
                         days=(year-y)*366+(month-m)*31+(day-d);
                     }
                 }
             }
         }
         else //能被4整除,但不能被100整除的,不是闰年
         {
             if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                 if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                     days=(year-y)*366+(month-m)*31+(day-d)+1;
                 }
                 else{
                     days=(year-y)*366+(month-m)*31+(day-d);
                 }
             }
             else if(m==2){
                 if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                     days=(year-y)*366+(month-m)*31+(day-d)+1;
                 }
                 else{
                     days=(year-y)*366+(month-m)*31+(day-d);
                 }
             }
             else{
                 if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                     days=(year-y)*366+(month-m)*31+(day-d)+1;
                 }
                 else{
                     days=(year-y)*366+(month-m)*31+(day-d);
                 }
             }
         }
     }
     else //不能被4整除的,不是闰年
     {
         if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
             if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                 days=(year-y)*366+(month-m)*31+(day-d)+1;
             }
             else{
                 days=(year-y)*366+(month-m)*31+(day-d);
             }
         }
         else if(m==2){
             if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                 days=(year-y)*366+(month-m)*31+(day-d)+1;
             }
             else{
                 days=(year-y)*366+(month-m)*31+(day-d);
             }
         }
         else{
             if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                 days=(year-y)*366+(month-m)*31+(day-d)+1;
             }
             else{
                 days=(year-y)*366+(month-m)*31+(day-d);
             }
         }
     }
 }

//桥接
/* function connectWebViewJavascriptBridge(callback) {
     if (window.WebViewJavascriptBridge) {

         callback(WebViewJavascriptBridge)
     } else {
         document.addEventListener('WebViewJavascriptBridgeReady', function() {
             callback(WebViewJavascriptBridge)
         }, false)
     }
 }*/





function include(path){
    var a=document.createElement("script");
    a.type = "text/javascript";
    a.src=path;
    a.charset="utf-8";

    var head=document.getElementsByTagName("head")[0];
    head.appendChild(a);


}


//点击如何获得

function off() {
    $(".main").css('display', 'none');
}
var num;
$(document).ready(function() {
    /*var h=$(window).height();*/
    $('#li .dian').live("click",function(){
        num = $(this).parent("li").index();
        $(".main").eq(num).css('display', 'block')
    });
    $(".fc").height($(window).height())
});