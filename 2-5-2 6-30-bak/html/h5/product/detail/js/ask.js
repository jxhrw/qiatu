w = $(window).width();
//匹配header签名&&评论的展示
    function Person() {

        var requestData = "";
        this.setRequestData = function (_requestData) {
            requestData = _requestData;
        };
        this.getRequestData = function () {
            return requestData;
        }

        this.requestCommit = function (allUrl, allData) {
            var testHeader = jihe.getHeaderData(allData);

            var testHeaderB = decodeURIComponent(testHeader);
            var obj = eval("(" +testHeaderB + ")");
            $.ajax({
                type: 'POST',
                url: allUrl, async: false,
                data: {data: allData},
                beforeSend: function (XMLHttpRequest) {
                    /*XMLHttpRequest.setRequestHeader('apiversion', ''+obj.apiversion )
                     XMLHttpRequest.setRequestHeader('channel', ''+obj.channel)
                     XMLHttpRequest.setRequestHeader('location', ''+obj.location)
                     XMLHttpRequest.setRequestHeader('userid', ''+obj.userid)
                     XMLHttpRequest.setRequestHeader('uuid', ''+obj.uuid)
                     XMLHttpRequest.setRequestHeader('sign', ''+obj.sign)*/
                     XMLHttpRequest.setRequestHeader('apiversion', String(obj.apiversion) )
                     XMLHttpRequest.setRequestHeader('channel', String(obj.channel))
                     XMLHttpRequest.setRequestHeader('location', String(obj.location))
                     XMLHttpRequest.setRequestHeader('userid', String(obj.userid))
                     XMLHttpRequest.setRequestHeader('uuid', String(obj.uuid))
                     XMLHttpRequest.setRequestHeader('sign', String(obj.sign))
                    /*XMLHttpRequest.setRequestHeader('apiversion', '2.0')
                    XMLHttpRequest.setRequestHeader('channel', 'HuaWei@android_2.0')
                    XMLHttpRequest.setRequestHeader('location', '120.073086,30.282003')
                    XMLHttpRequest.setRequestHeader('userid', '7')
                    XMLHttpRequest.setRequestHeader('uuid', '4bfa4ee1a806059b')
                    XMLHttpRequest.setRequestHeader('sign', '11ce05ac015bf548d1c21986bee8166d')*/
                },
                success: function (data) {
                    requestData = (data);
                }
            })


        }
    }
function invokeObjc(url) {
    var iframe;
    iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
}
//转成对象

/*function json(data){
    var define=data;
    jsonData=eval('('+define+')');
    return;
}*/
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
                        days=(year-y)*366+(month-m)*29+(day-d)+1;
                    }
                    else{
                        days=(year-y)*366+(month-m)*29+(day-d);
                    }
                }
                else{
                    if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                        days=(year-y)*366+(month-m)*30+(day-d)+1;
                    }
                    else{
                        days=(year-y)*366+(month-m)*30+(day-d);
                    }
                }
            }
            else //能被100整除,但不能被400整除的,不是闰年
            {
                if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                    if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                        days=(year-y)*365+(month-m)*31+(day-d)+1;
                    }
                    else{
                        days=(year-y)*365+(month-m)*31+(day-d);
                    }
                }
                else if(m==2){
                    if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                        days=(year-y)*365+(month-m)*28+(day-d)+1;
                    }
                    else{
                        days=(year-y)*365+(month-m)*28+(day-d);
                    }
                }
                else{
                    if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                        days=(year-y)*365+(month-m)*30+(day-d)+1;
                    }
                    else{
                        days=(year-y)*365+(month-m)*30+(day-d);
                    }
                }
            }
        }
        else //能被4整除,但不能被100整除的,不是闰年
        {
            if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                    days=(year-y)*365+(month-m)*31+(day-d)+1;
                }
                else{
                    days=(year-y)*365+(month-m)*31+(day-d);
                }
            }
            else if(m==2){
                if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                    days=(year-y)*365+(month-m)*28+(day-d)+1;
                }
                else{
                    days=(year-y)*365+(month-m)*28+(day-d);
                }
            }
            else{
                if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                    days=(year-y)*365+(month-m)*30+(day-d)+1;
                }
                else{
                    days=(year-y)*365+(month-m)*30+(day-d);
                }
            }
        }
    }
    else //不能被4整除的,不是闰年
    {
        if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
            if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                days=(year-y)*365+(month-m)*31+(day-d)+1;
            }
            else{
                days=(year-y)*365+(month-m)*31+(day-d);
            }
        }
        else if(m==2){
            if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                days=(year-y)*365+(month-m)*28+(day-d)+1;
            }
            else{
                days=(year-y)*365+(month-m)*28+(day-d);
            }
        }
        else{
            if((hour-h)/24+(minute-f)/60/24+(second-se)/3600/24>0){
                days=(year-y)*365+(month-m)*30+(day-d)+1;
            }
            else{
                days=(year-y)*365+(month-m)*30+(day-d);
            }
        }
    }
}

//登录
/*function login()
{
    $.ajaxSetup({
        async: false
    });
    $.post("/leapp/le.user.info", { data:'{}' }, function (data) {
        return result;
    }, "Json");
}*/





function include(path){
    var a=document.createElement("script");
    a.type = "text/javascript";
    a.src=path;
    a.charset="utf-8";

    var head=document.getElementsByTagName("head")[0];
    head.appendChild(a);


}
//点赞接口1是去过 2是想去 3是喜欢
 function iOSChangLikeCount( urlLike,dataLike) {
    $.post(urlLike, {
        data: dataLike
    }, function (result) {

        if (result.data.likeStatus> 0) {
            $(".proLike i").addClass("likeCurrent");
        } else {
            $(".proLike i").removeClass("likeCurrent");
        }
    });
}
function androidChangLikeCount( urlLike,dataLike) {
    var person = new Person();
    person.requestCommit(urlLike, dataLike)

        if (person.getRequestData().data.likeStatus> 0) {
            $(".proLike i").addClass("likeCurrent");
        } else {
            $(".proLike i").removeClass("likeCurrent");
        }

}


function androidToGo(urlHotelWant,paramHotelWant){


    var person = new Person();

    person.requestCommit(urlHotelWant, paramHotelWant)

    $(".togo b").html(person.getRequestData().data.goToCount);


    if(person.getRequestData().data.goToStatus==0){
        $(".togo i").removeClass("togoCurrent");
    }
    else
    {
        $(".togo i").addClass("togoCurrent");
    }
}
function iOSToGo(urlHotelWant,paramHotelWant) {
    $.post(urlHotelWant, {
        data: paramHotelWant
    }, function (result) {

        $(".togo b").html(result.data.goToCount);


        if(result.data.goToStatus==0){
            $(".togo i").removeClass("togoCurrent");
        }
        else
        {
            $(".togo i").addClass("togoCurrent");
        }
    });
}

function androidWantTo(urlHotelLike,paramHotelLike){

    var person = new Person();

    person.requestCommit(urlHotelLike, paramHotelLike)
    console.debug(person.getRequestData());
    $(".want b").html(person.getRequestData().data.wantCount);

    if(person.getRequestData().data.wantStatus==1){
        $(".want i").addClass("wantCurrent");
    }
    else
    {
        $(".want i").removeClass("wantCurrent");
    }
}

function iOSWantTo(urlHotelLike,paramHotelLike){

    $.post(urlHotelLike, {
        data: paramHotelLike
    }, function (result) {

        $(".want b").html(result.data.wantCount);


        if(result.data.wantStatus==0){
            $(".want i").removeClass("wantCurrent");
        }
        else
        {
            $(".want i").addClass("wantCurrent");
        }
    });
}
//自己跳先判断是否登录
function comment(){
    var urlInfo ="/leapp/le.user.info";
    var paramInfo = '{}';
    if(isiOS==true){
        $.post(urlInfo, {
            data: paramInfo
        }, function (result) {

            if(result.data.user.loginstatus==1){
                window.location="/h5_2.0/comment.html?id="+id;
            }
            else{
                var data={"act":"toLogin"}
                var url = "http://www.jihelife.com?data="+JSON.stringify(data);

                invokeObjc(url)
              /*  jihe.toLogin()*/
            }
        });
    }
    else{
        var person = new Person();
        person.requestCommit(urlInfo, paramInfo);
        if(person.getRequestData().data.user.loginstatus==1){
            window.location="/h5_2.0/comment.html?id="+id;
        }
        else{

            jihe.toLogin()
        }
    }



}














//桥接

//android桥接
 function adroidData(data){
    jihe.toWebView(data);
 }

//iosData桥接
 function iosData(data){
     function connectWebViewJavascriptBridge(callback) {
         if (window.WebViewJavascriptBridge) {
             callback(WebViewJavascriptBridge)
         } else {
             document.addEventListener('WebViewJavascriptBridgeReady', function() {
                 callback(WebViewJavascriptBridge)
             }, false)
         }
     }
         connectWebViewJavascriptBridge(function(bridge) {

             bridge.send(data, function(responseData) {
                 log('JS got response', responseData)
             })

         })
 }




 



//嵌套路径

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
    var w=$(window).width();
    
 $("header .icon").css({"height": w * 0.13, "width": w * 0.13});


    

});