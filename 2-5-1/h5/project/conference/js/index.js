$(document).ready(function(){
    $("body").height($(window).height());

    var location = window.location.href;
    if(location.indexOf("index.html")>0){
        var lon = 120.087183;
        var lat = 30.26573;
        //attr("src","http://restapi.amap.com/v3/staticmap?location=" + lon + "," + lat + "&zoom=12&size=666*361&markers=mid,,A:" + lon + "," + lat + "&key=ee95e52bf08006f63fd29bcfbcf21df0")
        $(".map").click(function(){
            window.location.href="http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:" + lat + "," + lon + ";title:" + "西溪天堂" + ";addr:" + "杭州西溪天堂艺术中心" + "&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp";
        });
        $(".registerBtn").click(function(){
            window.location.href="/user/h5/qrcode?regsucc_tourl="+encodeURIComponent(location);
        });
        $.post("/user/h5/info",{data:JSON.stringify({})},function(res){
            if(res.sc=="0"){
                if(res.data.memberFlag=="1"){
                    $(".members").show();
                }else {
                    $(".non-members").show();
                }
            }else if(res.sc=="-1"){
                alert("请先登录");
            }else if(res.sc=="-99999"){
                alert("请稍后再试");
            }else{

            }
        });

    }
    if(location.indexOf("checkIn.html")>0){
        var actId=GetParams().actId;
        $(".checkInBtn").click(function(){
            window.location.href="/user/h5/mbcenter?member_hotelid=40810";
        });
        $.post("/activity/arrival/signin/",{data:JSON.stringify({"actId":actId})},function(res){
            if(res.sc=="0"){
                if(res.data.userType=="1"){
                    $(".checkInTrue").show();
                    $(".checkInBtn").show();
                }else if(res.data.userType=="0"){
                    $(".checkIn").show();
                    $(".checkInBtn").show();
                }
            }else if(res.sc=="-1"){
                alert("请先登录");
            }else if(res.sc=="-99999"){
                alert("请稍后再试");
            }else{
                if(res.sc=="ACT-1601"){
                    $(".checkInFalse").show();
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
                params[kv[0]] = kv[1]
            }
        }
        return params;
    }
});