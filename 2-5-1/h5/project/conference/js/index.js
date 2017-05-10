$(document).ready(function(){
    $("body").height($(window).height());

    var lon = 120.087183;
    var lat = 30.26573;
    $(".map").attr("src","http://restapi.amap.com/v3/staticmap?location=" + lon + "," + lat + "&zoom=12&size=666*361&markers=mid,,A:" + lon + "," + lat + "&key=ee95e52bf08006f63fd29bcfbcf21df0").click(function(){
        window.location.href="http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:" + lat + "," + lon + ";title:" + "西溪天堂" + ";addr:" + "杭州西溪天堂艺术中心" + "&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp";
    });
    $(".registerBtn").click(function(){
        window.location.href="/user/h5/qrcode";
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
});