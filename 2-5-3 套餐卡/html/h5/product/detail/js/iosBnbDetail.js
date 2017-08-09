//切换印象和房型
var phone1;
var reserveWay;
var couponCode=getRequest().couponCode,
couponId=getRequest().couponId,
assetType=getRequest().assetType;
console.log(assetType);
//productType:是否跳转，data1判断是否有券
var productType1, data1;
$(document).ready(function () {
    $("#nav div").click(function () {
        $("#nav div").removeClass();
        $(this).addClass("select");
        if ($(".select").attr("id") == "yinxiang") {
            $("#content_2").addClass("unselect");
            $("#content_1").removeClass("unselect");
            $(".date").addClass("unselect");
            $("footer").removeClass("unselect");
        } else {
            $("#content_1").addClass("unselect");
            $("#content_2").removeClass("unselect");
            $(".date").removeClass("unselect");
            $("footer").addClass("unselect");
        }
        ;
    });
    $("#more").click(function () {
        if ($(".hidden").length != 0) {
            $("#shopkeeper_intro").removeClass();
            $("#more p").html("收起");
            $("#more img").attr("src", "images/up.png");
        } else {
            $("#shopkeeper_intro").addClass("hidden");
            $("#more p").html("查看全部");
            $("#more img").attr("src", "images/down.png");
        }
    });
});
//首图滑动效果
var topImgIndex = function () {
    var index = $("li.on").text();
    $("#top_img_index").find("span").eq(0).text(index);
}
// IOS桥接调用
function iosBridgeObjc(url) {
    var iframe;
    iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
}
var u = navigator.userAgent, app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//url处理
var url = location.href;
host = 'http://' + window.location.host;
root = window.location.pathname;
h = $("div.list:last").find(window).height();
/*alert(root);*/
function getParameter(paraStr, url) {
    var result = "";
    //获取URL中全部参数列表数据
    var str = "&" + url.split("?")[1];
    /*var stri=url.split("?")[1];
     alert(stri);*/
    var paraName = paraStr + "=";
    //判断要获取的参数是否存在
    if (str.indexOf("&" + paraName) != -1) {
        //如果要获取的参数到结尾是否还包含“&”
        if (str.substring(str.indexOf(paraName), str.length).indexOf("&") != -1) {
            //得到要获取的参数到结尾的字符串
            var TmpStr = str.substring(str.indexOf(paraName), str.length);
            //截取从参数开始到最近的“&”出现位置间的字符
            result = TmpStr.substr(TmpStr.indexOf(paraName), TmpStr.indexOf("&") - TmpStr.indexOf(paraName));
        }
        else {
            result = str.substring(str.indexOf(paraName), str.length);
        }
    }
    else {
        result = "无此参数";
    }
    return (result.replace("&", ""));
}
var r = getParameter("id", url);
id = r.substring(r.lastIndexOf('=') + 1, r.length);
//首图滑动效果
var topImgIndex = function () {
    var index = $("li.on").text();
    $("#top_img_index").find("span").eq(0).text(index);
};
function androidToGo(urlHotelWant, paramHotelWant) {
    var person = new Person();
    person.requestCommit(urlHotelWant, paramHotelWant)
    $("#like .togo span").html(person.getRequestData().data[0].count);
    if (person.getRequestData().data[0].status == 0) {
        $("#like .togo img").attr("src", "images/ungone.png");
    }
    else {
        $("#like .togo img").attr("src", "images/gone.png");
    }
}
function androidWantTo(urlHotelLike, paramHotelLike) {
    var person = new Person();
    person.requestCommit(urlHotelLike, paramHotelLike)
    console.debug(person.getRequestData());
    $("#like .want span").html(person.getRequestData().data[1].count);
    if (person.getRequestData().data[1].status == 1) {
        $("#like .want img").attr("src", "images/star.png");
    }
    else {
        $("#like .want img").attr("src", "images/unstar.png");
    }
}
//获取url的参数
function getRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function iOSToGo(urlHotelWant, paramHotelWant) {
    $.post(urlHotelWant, {
        data: paramHotelWant
    }, function (result) {
        $("#like .togo span").html(result.data[0].count);
        if (result.data[0].status == 0) {
            $("#like .togo img").attr("src", "images/ungone.png");
        }
        else {
            $("#like .togo img").attr("src", "images/gone.png");
        }
    });
}
//1;  //去过的酒店
// 2;  //想去的酒店
//3;  //喜欢的活动

function iOSWantTo(urlHotelLike, paramHotelLike) {
    $.post(urlHotelLike, {
        data: paramHotelLike
    }, function (result) {
        $("#like .want span").html(result.data[1].count);
        if (result.data[1].status == 0) {
            $("#like .want img").attr("src", "images/unstar.png");
        }
        else {
            $("#like .want img").attr("src", "images/star.png");
        }
    });
}
var DataBase;var loginStatus;
if (isAndroid) {
    var url, andrData;
    var device = new Device();
    device.requestCommit('/content/client/hotel/detail', "{'id':'" + id + "'}");
} else if (isiOS) {
    //--------IOS中的逻辑-------------
    $(document).ready(function () {
        //var id = 15052;
        //setTimeout(ask(),1000)
        //function ask(){
      /*  var logFlag=sessionStorage.getItem("logFlag");
        console.log("haha"+logFlag);
        if(sessionStorage){
            if(logFlag==1){
                window.location.reload();
                sessionStorage.setItem("logFlag","0");
            }
        }*/
        //ifLogin();
        var reqData={"id":id,"couponId":getRequest().couponId,"assetType":getRequest().assetType}
        $.ajax({
            type: 'POST',
            url: '/content/client/hotel/detail',
            data: {data: JSON.stringify(reqData)},
            dataType: 'json',
            async: true,
            success: function (data) {
                console.debug(data);
                document.title = JSON.stringify(data.data.shareInfo);
                var imgList = data.data.productBaseInfo.imgList;
                var productName = data.data.productBaseInfo.productName, instorePayPid = data.data.productBaseInfo.instorePayPid;

                var distance = data.data.hotelBaseInfo.distanceDesc;
                //var shopkeeper = data.data.hotelBaseInfo.brandIcon;
                if(data.data.hotelBaseInfo.hotelOwner){
                    var shopkeeper = data.data.hotelBaseInfo.hotelOwner.headimgurl;
                    var shopkeeperUrl = data.data.hotelBaseInfo.hotelOwner.ownerDetailUrl+"&jsonStr="+JSON.stringify({"isShowShare":"false"});
                    var name = data.data.hotelBaseInfo.hotelOwner.name;
                }
                var tagInfoList = data.data.hotelBaseInfo.tagInfoList;
                //var shopkeeperUrl = data.data.hotelBaseInfo.brandH5url;
                var prmtDesc = data.data.hotelBaseInfo.prmtDesc;
                var address = data.data.hotelBaseInfo.address;
                var phone = data.data.hotelBaseInfo.phone;
                var brief = data.data.hotelBaseInfo.brief;
                var roomList = data.data.hotelBaseInfo.roomList;
                var recommendPromotions = data.data.hotelBaseInfo.recommendPromotions;
                var cityName = data.data.hotelBaseInfo.cityName;
                var openBooking = data.data.hotelBaseInfo.openBooking, type = data.data.hotelBaseInfo.type;

                productType1 = data.data.productBaseInfo.productType;
                phone1 = data.data.productBaseInfo.reserveWayValue;
                reserveWay = data.data.productBaseInfo.reserveWay;
                if (type == 2) {
                    $(".navDate").remove();
                    $("#content_2").remove();
                    $("footer").remove();
                    $("article").after('<div class=storePay><a class="pay">店内支付</a></div>');
                    $(".popup p").html("请登录后再支付");
                    var payUrl;
                    $(".pay").click(function () {
                        $.ajax({
                            url:"/user/h5/init",
                            type : 'post',
                            data: {data: JSON.stringify({"h5url":window.location.href})},
                            success : function(data){
                                console.log(data);
                                loginStatus=data.sc;
                                if (loginStatus == -1) {
                                    var urlDate = {"act": "toLogin"};
                                    var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
                                    iosBridgeObjc(url);
                                } else {
                                    //if (memberFlag == 1) {
                                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                if (res.sc == 0) {
                                                    var stepData = {
                                                        "act": "toInStore",
                                                        "hosteled": id,
                                                        "shanghuname": productName,
                                                        "productid": instorePayPid
                                                    };
                                                    var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                                                    iosBridgeObjc(url);
                                                }
                                            })
                                        /* } else {
                                        var urlDate = {"act": "toLogin"};
                                        var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
                                        iosBridgeObjc(url);
                                    }*/
                                }
                            }
                        });
                    })
                }
                if ((undefined != data.data.hotelBaseInfo && "1" == data.data.hotelBaseInfo.jiheBusinessMember) || (undefined != data.data.productBaseInfo && "1" == data.data.productBaseInfo.jiheBusinessMember)) {
                    $("#distance").after("<img src='/html/member/images/jiheBusinessMember.png' style='display: block;margin: 1rem auto 0 auto;height: 1.3rem;width: 5.5rem;' />")
                }

                var liHtml = '<ul class="entrance">';
                for (var i = 0; undefined != data.data.relationProducts && i < data.data.relationProducts.length; i++) {
                    var ahref = data.data.relationProducts[i].h5url;
                    if (ahref.indexOf("?") != -1) {
                        ahref += "&app=jiheios";
                    } else {
                        ahref += "?app=jiheios";
                    }
                    liHtml += '<li><span class="productName">' + data.data.relationProducts[i].productName + '</span><p class="entrancePrice"><span class="old">' + oldPrice(data.data.relationProducts[i].priceType) + '</span><a href="' + ahref + '" class="new">' + newPrice(data.data.relationProducts[i].priceType) + '</a></p></li>';
                }
                liHtml += '</ul>';
                $("article").prepend(liHtml);
                $(".entrancePrice").each(function () {
                    var height = $(this).parents("li").height();
                    $(this).css({"line-height": height + "px"});
                });
                function oldPrice(priceType){
                    if(priceType==0){
                        return "&yen;"+data.data.relationProducts[i].referPrice
                    }else if(priceType==1){
                        if(data.data.relationProducts[i].referPrice!=undefined){
                            return data.data.relationProducts[i].referPrice
                        }else{
                            return ""
                        }
                    }
                }
                function newPrice(priceType){
                    if(priceType==0){
                        return "&yen;"+data.data.relationProducts[i].price;
                    }else if(priceType==1){
                        return "积分"+data.data.relationProducts[i].price;
                    }
                }

                DataBase = data;
                //首图
                $("#top_img_index").find("span").eq(1).append(imgList.length);
                for (var i = 0; i < imgList.length; i++) {
                    var j = i + 1;
                    $(".hd ul").append("<li>" + j + "</li>");
                    $(".bd ul").append("<li><img/></li>");
                    $(".bd ul").find("img").eq(i).attr("src", imgList[i]);
                }
                //header信息
                $("#intro h1").append(productName);
                $(".shopkeeper_img").attr("src",data.data.hotelBaseInfo.brandIcon /*shopkeeper*/);
                //$(".shopkeeper_detail").attr("href",shopkeeperUrl);
                $("#distance_unit").append(distance);
                if (data.data.hotelBaseInfo.userFavorites[1].status == 0) {
                    $("#like .want img").attr("src", "images/unstar.png");
                } else {
                    $("#like .want img").attr("src", "images/star.png");
                }
                if (data.data.hotelBaseInfo.userFavorites[0].status == 0) {
                    $("#like .togo img").attr("src", "images/ungone.png");
                } else {
                    $("#like .togo img").attr("src", "images/gone.png");
                }
                $("#like .want span").append(data.data.hotelBaseInfo.userFavorites[1].count);
                $("#like .togo span").append(data.data.hotelBaseInfo.userFavorites[0].count);

                $(document).ready(function () {
                    var paramHotelWant = '{"productid":"' + data.data.hotelBaseInfo.hotelId + '","favtype":"1"}';
                    var urlHotelWant = "/user/h5/setfavorite";
                    var paramHotelLike = '{"productid":"' + data.data.hotelBaseInfo.hotelId + '","favtype":"2"}';
                    var urlHotelLike = "/user/h5/setfavorite";
                    $(".togo").click(function () {
                        iOSToGo(urlHotelWant, paramHotelWant)
                    })
                    $(".want").click(function () {
                        iOSWantTo(urlHotelLike, paramHotelLike)
                    })
                });
                if (tagInfoList) {
                    for (var l = 0; l < tagInfoList.length; l++) {
                        if (tagInfoList[l].name != "其他" && tagInfoList[l].name != "民宿") {
                            $("#tips").append("<span>" + tagInfoList[l].name + "</span>");
                        }

                    }
                }
                $("#h5body").append(prmtDesc);
                //地图显示
                var cityLat = data.data.hotelBaseInfo.locLat;
                var cityLon = data.data.hotelBaseInfo.locLon;
                $("#map").attr("src", "http://restapi.amap.com/v3/staticmap?location=" + cityLon + "," + cityLat + "&zoom=10&size=800*400&markers=mid,,A:" + cityLon + "," + cityLat + "&key=ee95e52bf08006f63fd29bcfbcf21df0");
                $("#map").click(function (event) {
                    window.location = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:" + cityLat + "," + cityLon + ";title:" + cityName + ";addr:" + address + ";&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"
                });
                $("#address").find("li").eq(0).append(address);
                $("#address").find("li").eq(1).append(phone);
                if (brief != undefined) {
                    $("#shopkeeper_intro").append(brief);
                    if (brief.length < 90) {
                        $("#more").remove();
                    }
                }
                else {
                    $(".zhangWrap").css('display', 'none');
                }
                if(name){
                    $("#shopkeeper_name").find("span").append(name);
                }
                var showCyType=data.data.productBaseInfo.productPrice.showCyType,//类型
                    showCyCode=data.data.productBaseInfo.productPrice.showCyCode,//符号
                    showCyUnit=data.data.productBaseInfo.productPrice.showCyUnit;//单位
                    if(showCyType==0||showCyType==5||showCyType == 6){
                        showTotalPrice=data.data.productBaseInfo.productPrice.showTotalPrice/100;//价格
                    }else{
                        showTotalPrice=data.data.productBaseInfo.productPrice.showTotalPrice;//价格
                    }
                    if(showCyType==0){
                        $(".price").prepend('<span class="showCyCode">'+showCyCode+'</span>'+showTotalPrice);
                    }else{
                        $(".price").prepend('<p class="showCyCode" style="color:#999;">'+showCyCode+'</p>'+showTotalPrice+showCyUnit);
                    }
                //猜你喜欢
                var recommendbox = "<a href=\"#\"><div class=\"prom_list\"><img src=\"images/p4.jpeg\" class=\"prom_img\"><p class=\"prom_title\"></p><p class=\"prom_price\"><span> 起/<span class=\"prom_unit\"></span>晚</span></p></div></a><div class=\"gap_2\"></div>";
                if (recommendPromotions) {
                    for (var n = 0; n < recommendPromotions.length; n++) {
                        $("#content_1").append(recommendbox);
                        $("#content a:last").attr("href", recommendPromotions[n].h5url);
                        $(".prom_img:last").attr("src", recommendPromotions[n].imgUri);
                        $(".prom_title:last").append(recommendPromotions[n].productName);
                        $(".prom_price:last").prepend(recommendPromotions[n].price);
                    }
                } else {
                    $("#title_guess").remove();
                    $(".gap").eq(1).remove();
                }
                $("#content_1").append("<img id=\"end_line\" src=\"images/TheEnd.png\">");
                //房型
                var typebox = " <div class=\"type\"><img class=\"type_img\"><div><p class=\"type_name\"></p></div><p class=\"type_intro\"></p><p class=\"type_price\"><em></em></em><span class=\"type_number\"></span><span><span class=\"type_unit\"></span>/晚</span> <strong>预定</strong></p></div>";
                if (roomList) {
                    for (var k = 0; k < roomList.length; k++) {
                    var roomshowCyType=roomList[k].productInfo.productPrice.showCyType,//类型
                        roomshowCyCode=roomList[k].productInfo.productPrice.showCyCode,//符号
                        roomshowTotalPrice,
                        roomshowCyUnit=roomList[k].productInfo.productPrice.showCyUnit,//单位
                        totalPrice=roomList[k].productInfo.productPrice.totalPrice;//价格
                        if(roomshowCyType==0||roomshowCyType==5||roomshowCyType==6){
                            roomshowTotalPrice=roomList[k].productInfo.productPrice.showTotalPrice/100;//价格
                        }else{
                            roomshowTotalPrice=roomList[k].productInfo.productPrice.showTotalPrice;//价格
                        }
                        $("#content_2").append(typebox);
                        if (roomList[k].imgList) {
                            $("img.type_img:last").attr("src", roomList[k].imgList[0]);
                        }
                        $("p.type_name:last").append(roomList[k].name);
                        if (roomList[k].roomBrief) {
                            $("p.type_intro:last").append(roomList[k].roomBrief);
                        }
                        if (roomList[k].productInfo && roomList[k].productInfo.productType != 0) {
                            //$("span.type_number:last").append(roomshowTotalPrice+'&nbsp;');
                        $(".type").eq(k).find(".type_price .type_number").html(roomshowTotalPrice + '&nbsp;');
                            $(".type").eq(k).find(".type_unit").html(roomshowCyUnit);
                            if(roomshowCyType==0){
                                $(".type").eq(k).find(".type_price").prepend(roomshowCyCode);
                            }else{
                            if (roomshowCyType == 6) {
                                $(".type").eq(k).find(".type_price .type_number").html(roomshowCyCode + '&nbsp;' + roomshowTotalPrice + '&nbsp;').css("font-family", "黑体");
                                $(".type").eq(k).find(".type_price").prepend('<span class="roomshowCyCode" style="width:15.4rem;color:#979797;font-size:0.8rem;line-height:1.2rem;text-decoration:line-through;"><span style="color:#9b9b9b;">' + totalPrice / 100 + '元</span></span><br>');
                                $(".type").eq(k).find(".type_price .type_number").css({
                                    "font-size": "0.867rem",
                                    "line-height": "1.6rem"
                                });
                                $(".type").eq(k).find(".type_price strong").html("Time会员预订").css({
                                    "background": "-webkit-linear-gradient(left top,#66ce9d,#62b8ba)",
                                    "letter-spacing": "0"
                                });
                            } else {
                                $(".type").eq(k).find(".type_price").prepend('<p class="roomshowCyCode" style="width:15.4rem;color:#999;font-size:0.8rem;line-height:1.2rem">' + roomshowCyCode + '</p>');
                                $(".type").eq(k).find(".type_price .type_number").css({
                                    "font-size": "0.867rem",
                                    "line-height": "1.6rem"
                                });
                            }
                            }
                            if (roomList[k].productInfo.tolAmount == 0) {
                                $(".type").eq(k).children(".type_price").css("color","#999").children("strong").addClass("gray").css("background","#d8d8d8").html("满房");
                                $(".type").eq(k).children(".type_price").children(".type_number").css("color","#999");
                            }
                        }
                        else {
                            $("span.type_number:last").append(roomList[k].price);
                            $(".type").eq(k).children(".type_price").children("em").addClass("unselect");
                        }
                    }
                    //$("#content_2").append("<div class=\"gap_3\"></div>");
                }

                //调用地图
                $(document).ready(function () {
                    document.getElementById("map").onclick = function () {
                        var data = '{"longitude":"' + cityLon + '","latitude":"' + cityLat + '","BuildingName":"' + productName + '","city":"' + cityName + '","address":"' + address + '","act":"toMap"}';
                        var url = "http://www.jihelife.com?data=" + data;
                        iosBridgeObjc(url);
                    };
                });

                //弹窗
                $("footer button").click(function () {
                    if (data.data.productBaseInfo.productType == 0) {
                        if (data.data.productBaseInfo.reserveWay == 1 || data.data.productBaseInfo.reserveWay == 4 || data.data.productBaseInfo.reserveWay == 5) {

                            $("footer button").html("订购")
                            var phone = data.data.productBaseInfo.reserveWayValue;

                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                if (res.sc == 0) {
                                    /*console.debug(res)
                                     window.location = phone*/
                                    window.location ='/h5_2.0/tip.html?jumpurl='+ encodeURIComponent(phone);
/*
                                    var stepData = {"act": "toWebView", "h5url": encodeURIComponent(phone)}
                                    var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                                    iosBridgeObjc(url);
*/
                                }
                            })
                            // window.location=phone
                            /*window.location=phone
                             var stepData={"act":"toWebView","h5url":encodeURIComponent(phone)}
                             var url = "http://www.jihelife.com?data="+JSON.stringify(stepData);

                             iosBridgeObjc(url);*/
                        }
                        else if (data.data.productBaseInfo.reserveWay == 2) {
                            var phone = data.data.productBaseInfo.reserveWayValue;
                            $("#phone").attr("href", "tel://'" + phone + "'");

                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                if (res.sc == 0) {
                                    console.debug(res)
                                    $("#tanchuang_background").removeClass("disappear");
                                    $("#tanchuang").removeClass("disappear");
                                }
                            })


                            // $("#tanchuang_background").removeClass("disappear");
                            // $("#tanchuang").removeClass("disappear");
                            $("#tanchuang_background").click(function () {
                                $(this).addClass("disappear");
                                $("#tanchuang").addClass("disappear");
                            })
                        }
                        else if (data.data.productBaseInfo.reserveWay == 3) {
                            //调用APP价格日历
                            $("footer button").html("查看价格日历")
                            /* $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                             if (res.sc == 0) {
                             console.debug(res)
                             var data = '{"act":"toCalendar","id":"' + id + '"}';
                             var url = "http://www.jihelife.com?data=" + data;
                             iosBridgeObjc(url);
                             }
                             })*/
                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                console.debug(res)
                                if (res.sc == 0) {
                                    var date1 = $("#date_chickin").html();
                                    var date2 = $("#date_checkout").html()
                                    //alert(date1date2)
                                    // console.debug(date1,date2)


                                    var tt = {"id": id, "checkin": date1, "checkout": date2}
                                    $.post('/content/client/hotel/otaurl', {data: JSON.stringify(tt)}, function (result) {
                                        console.debug(result)
                                        /*window.location = result.data.bookUrl*/
                                        window.location ='/h5_2.0/tip2.html?a=1&jumpurl='+ encodeURIComponent(result.data.bookUrl);
                                    });
                                }
                            });

                            // var data = '{"act":"toCalendar","id":"' + id + '"}';
                            // var url = "http://www.jihelife.com?data="+data;
                            // iosBridgeObjc(url);
                        }
                    } else {
                        var data1 = null;
                        $.ajax({
                            type: 'get',
                            url: '/member/h5/assets',
                            dataType: 'json',
                            success: function (data) {
                                console.log(data);
                                data1 = data;
                            }
                        })
                        //alert("333");
                        console.log(data1);
                        $('#fangxing').addClass("select");
                        $('#yinxiang').removeClass("select");
                        $("#content_1").addClass("unselect");
                        $("#content_2").removeClass("unselect");
                        $(".date").removeClass("unselect");
                        $("footer").addClass("unselect");
                    }
                });


                $(".type .type_price strong").click(function () {
                    $.ajax({
                        url:"/user/h5/init",
                        type : 'post',
                        data: {data: JSON.stringify({"h5url":window.location.href})},
                        success : function(data){
                            console.log(data);
                            loginStatus=data.sc;
                            if(loginStatus==-1){
                                var urlDate = {"act": "toLogin"};
                                iosBridgeObjc("http://www.jihelife.com?data=" + JSON.stringify(urlDate));
                            }
                        }
                    });
                                                    var cl = $(this).attr("class");
                                var bor = $(this).siblings("em").attr("class");
                                var el = $(this).parent(".type_price").parent(".type").index();
                                // alert(el)
                                // alert(bor)
                                if (productType1 != 0 && openBooking != 1) {//没有券的话让productType=0,为1时直接打开直订
                                    $.post('/member/h5/assets', function (data) {
                                        if (data.sc == "0") {
                                            data1 = data.data.couponPieces;
                                        }
                                        else {
                                            data1 = 0;
                                        }
                                        if (data1 == 0) {
                                            productType1 = 0;
                                            phone1 = DataBase.data.productBaseInfo.otaReserveWayValue;
                                        }
                                    });
                                    setTimeout(function () {
                                        if (cl == "gray") {
                                            return;
                                        }
                                        else if (productType1 == 0) {
                                            //alert("aaa")
                                            if (data.data.productBaseInfo.reserveWay == 1 || data.data.productBaseInfo.reserveWay == 4 || data.data.productBaseInfo.reserveWay == 5) {
                                                // alert("shsg")
                                                $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                    if (res.sc == 0) {
                                                        console.debug(res)
                                                        var stepData = {
                                                            "act": "toWebView",
                                                            "h5url": encodeURIComponent(phone1)
                                                        }
                                                        var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                                                        iosBridgeObjc(url);
                                                    }
                                                })
                                            }
                                            else if (data.data.productBaseInfo.reserveWay == 2) {
                                                // alert("shsg12")
                                                $("#phone").attr("href", "tel://'" + phone1 + "'");
                                                $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                    if (res.sc == 0) {
                                                        console.debug(res)
                                                        $("#tanchuang_background").removeClass("disappear");
                                                        $("#tanchuang").removeClass("disappear");
                                                    }
                                                })
                                                $("#tanchuang_background").click(function () {
                                                    $(this).addClass("disappear");
                                                    $("#tanchuang").addClass("disappear");
                                                })
                                            }
                                            else if (data.data.productBaseInfo.reserveWay == 3) {
                                                //alert("222")
                                                $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                    console.debug(res)
                                                    if (res.sc == 0) {
                                                        console.debug(res)
                                                        var data = '{"act":"toCalendar","id":"' + id + '"}';
                                                        var url = "http://www.jihelife.com?data=" + data;
                                                        iosBridgeObjc(url);
                                                    }
                                                });
                                            }

                                        }
                                        else {
                                            //alert("333")
                                            var url = data.data.hotelBaseInfo.roomList[el].productInfo.reserveWayValue;
                                            var obj = GetParams(url);
                                            var json;
                                            if(assetType!=undefined){
                                                json={productType:"2",id:obj.id,checkin:obj.checkin,checkout:obj.checkout,couponcode:couponCode,couponid:couponId,assettype:assetType,act:"toOrder"}
                                            }else{
                                                json = {productType:"2",id:obj.id,checkin:obj.checkin,checkout:obj.checkout,act:"toOrder"};
                                            }
                                            console.log(JSON.stringify(json));
                                            json = "http://www.jihelife.com?data=" + JSON.stringify(json);
                                            iosBridgeObjc(json);
                                        }
                                    }, 500)
                                }
                                else {
                                    if (cl == "gray") {
                                        return;
                                    }
                                    else if (productType1 == 0) {
                                        //alert("aaa")
                                        if (data.data.productBaseInfo.reserveWay == 1 || data.data.productBaseInfo.reserveWay == 4 || data.data.productBaseInfo.reserveWay == 5) {
                                            // alert("shsg")
                                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                if (res.sc == 0) {
                                                    console.debug(res)
                                                    var stepData = {
                                                        "act": "toWebView",
                                                        "h5url": encodeURIComponent(phone1)
                                                    }
                                                    var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                                                    iosBridgeObjc(url);
                                                }
                                            })
                                        }
                                        else if (data.data.productBaseInfo.reserveWay == 2) {
                                            // alert("shsg12")
                                            $("#phone").attr("href", "tel://'" + phone1 + "'");
                                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                if (res.sc == 0) {
                                                    console.debug(res)
                                                    $("#tanchuang_background").removeClass("disappear");
                                                    $("#tanchuang").removeClass("disappear");
                                                }
                                            })
                                            $("#tanchuang_background").click(function () {
                                                $(this).addClass("disappear");
                                                $("#tanchuang").addClass("disappear");
                                            })
                                        }
                                        else if (data.data.productBaseInfo.reserveWay == 3) {
                                            //alert("222")
                                            $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                console.debug(res)
                                                if (res.sc == 0) {
                                                    console.debug(res)
                                                    var data = '{"act":"toCalendar","id":"' + id + '"}';
                                                    var url = "http://www.jihelife.com?data=" + data;
                                                    iosBridgeObjc(url);
                                                }
                                            });
                                        }

                                    }
                                    else {
                                        //alert("333")
                                        var url = data.data.hotelBaseInfo.roomList[el].productInfo.reserveWayValue;
                                        var obj = GetParams(url);
                                            if(assetType!=undefined){
                                                json={productType:"2",id:obj.id,checkin:obj.checkin,checkout:obj.checkout,couponcode:couponCode,couponid:couponId,assettype:assetType,act:"toOrder"}
                                            }else{
                                                json = {productType:"2",id:obj.id,checkin:obj.checkin,checkout:obj.checkout,act:"toOrder"};
                                            }
                                        console.log(JSON.stringify(json));
                                        json = "http://www.jihelife.com?data=" + JSON.stringify(json);
                                        iosBridgeObjc(json);
                                    }
                                }

                    //$.ajax({
/*
                        url: "/user/client/info",
                        type: 'post',
                        data: {data: JSON.stringify({})},
*/
                        //success: function (ress) {
                            //console.log(ress);
                           // if (ress.sc == 0) {
                               // memberStatus = ress.sc;
                                //memberFlag = ress.data.memberFlag;
                                //if (memberFlag == 1 && memberStatus == 0) {

                                //}
                                /*else {
                                    var urlDate = {"act": "toLogin"};
                                    var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
                                    iosBridgeObjc(url);
                                }*/
                           // }
                            /*else {
                                var urlDate = {"act": "toLogin"};
                                var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
                                iosBridgeObjc(url);
                            }*/
                        //}
                   // });

                });

                //除生成日历外新加部分

                var date = new Date();
                var today = date.getDay();
                $(".date li").eq(0).find("strong").html(bZero(date.getMonth() + 1) + "月" + bZero(date.getDate()) + "日");
                $(".date li").eq(1).find("strong").html(bZero(date.getMonth() + 1) + "月" + bZero(date.getDate() + 1) + "日");
                $(".date li").eq(0).find("span").eq(0).html("今天");
                $(".date li").eq(1).find("span").eq(0).html(weekDay((today + 1) % 7));
                $(".date li").click(function () {
                    $(".date_mask").show();
                    $("#content_2").addClass("unselect");
                    if ($(".date_mask_alert_top").css("position") == "fixed") {
                        $(window).scrollTop($(window).width() / 25 * 14 - $(".date_mask_alert_top").height() + 1);
                    }
                });
                $(".tipOtaName .yes").click(function () {
                    $("#content_2").removeClass("unselect");
                    $(".date_mask").hide();
                });


//日历部分

                var date = new Date();
                $(".dateXian li").eq(0).find("strong").html(bZero(date.getMonth() + 1) + "月" + bZero(date.getDate()) + "日");
                $(".dateXian li").eq(1).find("strong").html(bZero(date.getMonth() + 1) + "月" + bZero(date.getDate() + 1) + "日");
                var today = date.getDay();
                $(".dateXian li").eq(0).find("span").html("今天");
                $(".dateXian li").eq(1).find("span").html(weekDay((today + 1) % 7));


                //生成日历
                for (var i = 0; i < 6; i++) { //i小于几代表几个月
                    var nowYear = date.getFullYear();
                    var nowMonth = (date.getMonth() + i) % 12 + 1;
                    if (date.getMonth() + i >= 12) {
                        nowYear++;
                    }
                    if (nowMonth < 10) {
                        $("#calendar").append("<div>" + nowYear + "/0" + nowMonth + "<span class='year'>" + nowYear + "</span><span class='month'>" + nowMonth + "</span></div><table></table>");
                    } else {
                        $("#calendar").append("<div>" + nowYear + "/" + nowMonth + "<span class='year'>" + nowYear + "</span><span class='month'>" + nowMonth + "</span></div><table></table>");
                    }
                    var stringTime = nowYear + "/" + nowMonth + "/" + 1;
                    /*获取当前月一号的星期开始*/
                    var timestamp2 = Date.parse(new Date(stringTime));
                    var time = new Date(timestamp2);
                    var everyTime = time.getDay();
                    /*获取当前月一号的星期结束*/
                    var dayCount = (new Date(nowYear, nowMonth, 0)).getDate();
                    /*获取当前月的天数*/
                    var line = Math.ceil((everyTime + dayCount) / 7);//日历上这个月需要几行
                    var num = 1 - everyTime;
                    if (i == 0) {
                        for (var k = 0; k < line; k++) {
                            $("#calendar table").eq(i).append("<tr></tr>");
                            var nowDate = date.getDate();//获取今天的日期
                            for (var j = 0; j < 7; j++) {
                                if (num > 0 && num <= dayCount) {
                                    if (num < nowDate) {
                                        $("#calendar table").eq(i).find("tr").eq(k).append("<td style='color: #999;'name='999'>" + num + "</td>");
                                    } else if (num == nowDate) {
                                        $("#calendar table").eq(i).find("tr").eq(k).append("<td style='font-size:0.8rem;'>今天</td>");
                                    } else {
                                        $("#calendar table").eq(i).find("tr").eq(k).append("<td>" + num + "</td>");
                                    }
                                } else {
                                    $("#calendar table").eq(i).find("tr").eq(k).append("<td></td>");
                                }
                                num++;
                            }
                        }
                    } else {
                        for (var k = 0; k < line; k++) {
                            $("#calendar table").eq(i).append("<tr></tr>");
                            for (var j = 0; j < 7; j++) {
                                if (num > 0 && num <= dayCount) {
                                    $("#calendar table").eq(i).find("tr").eq(k).append("<td>" + num + "</td>");
                                } else {
                                    $("#calendar table").eq(i).find("tr").eq(k).append("<td></td>");
                                }
                                num++;
                            }
                        }
                    }
                }

                //点击事件
                var firstS = 1;//1代表这次点击是入住，2代表这次点击是离店
                var cancel = 0;//0不取消，1取消
                var lastYear,
                    lastMonth,
                    lastDate,
                    lastDay;//上一次点击的年月日星期
                var lastIndex;//上一次点击的日期在第几个表
                $("#calendar table td").click(function () {
                    var index = $(this).index();//得到周几
                    var year = $(this).parents("table").prev("div").find(".year").html();
                    var month = $(this).parents("table").prev("div").find(".month").html();
                    var toDate = $(this).html().split("<span>")[0];
                    if (toDate == "今天") {
                        toDate = date.getDate();
                    }
                    if (toDate) {//表示点的不是空白
                        var color = $(this).attr("name");
                        if (color != "999") {//表示点的不是已过去的日期
                            if (Date.parse(new Date(year + "/" + month + "/" + toDate)) < Date.parse(new Date(lastYear + "/" + lastMonth + "/" + lastDate))) {
                                firstS = 1;
                            }
                            if (Date.parse(new Date(year + "/" + month + "/" + toDate)) == Date.parse(new Date(lastYear + "/" + lastMonth + "/" + lastDate))) {
                                firstS = 1;
                                if ($(this).css("background-image") != "none") {
                                    cancel = 1;
                                } else {
                                    cancel = 0;
                                }
                            }
                            if (firstS == 1) {//入住
                                if (cancel == 0) {
                                    $("#calendar table td").find("span").parents("td").css("color", "#000");
                                    $("#calendar table td").css({
                                        "background-image": "none",
                                        "background-color": "#fff"
                                    }).find("span").remove();
                                    $(this).css({
                                        "background-image": "url(http://7xio74.com2.z0.glb.clouddn.com/ru.png)",
                                        "background-color": "#fff",
                                        "color": "#fff"
                                    }).append("<span>入住</span>");
                                    $(".dateXian li").eq(0).find("strong").html(bZero(month) + "月" + bZero(toDate) + "日");
                                    $(".dateXian li").eq(0).find("span").html(weekDay(index));
                                    firstS = 2;
                                    lastYear = year;
                                    lastMonth = month;
                                    lastDate = toDate;
                                    lastDay = index;
                                    lastIndex = $(this).parents("table").index();
                                }
                                if (cancel == 1) {
                                    $("#calendar table td").find("span").parents("td").css("color", "#000");
                                    $("#calendar table td").css({
                                        "background-image": "none",
                                        "background-color": "#fff"
                                    }).find("span").remove();
                                    cancel = 0;
                                    lastYear = null;
                                    lastMonth = null;
                                    lastDate = null;
                                    lastIndex = null;
                                }
                                return;
                            }
                            if (firstS == 2) {//离店
                                $(this).css({
                                    "background-image": "url(http://7xio74.com1.z0.glb.clouddn.com/li.png)",
                                    "background-color": "#cfe5e5",
                                    "color": "#fff"
                                }).append("<span>离店</span>");
                                var loop = ($(this).parents("table").index() - lastIndex) / 2 + 1;//总共涉及到几个月
                                var begin = (lastIndex - 1) / 2;
                                var end = ($(this).parents("table").index() - 1) / 2;
                                if (loop == 1) {
                                    $("#calendar table").eq(begin).find("td").each(function () {
                                        //console.log($(this).html()*1==lastDate*1)
                                        if ($(this).css("background-image") == "url(http://7xio74.com2.z0.glb.clouddn.com/ru.png)") {
                                            $(this).css({
                                                "background-image": "url(http://7xio74.com2.z0.glb.clouddn.com/ru.png)",
                                                "background-color": "#cfe5e5"
                                            });
                                        }
                                        if ($(this).html() * 1 > lastDate && $(this).html() * 1 < toDate) {
                                            $(this).css("background-color", "#cfe5e5");
                                        }
                                    })
                                }
                                if (loop >= 2) {
                                    $("#calendar table").eq(begin).find("td").each(function () {
                                        if ($(this).css("background-image") == "url(http://7xio74.com2.z0.glb.clouddn.com/ru.png)") {
                                            $(this).css({
                                                "background-image": "url(http://7xio74.com2.z0.glb.clouddn.com/ru.png)",
                                                "background-color": "#cfe5e5"
                                            });
                                        }
                                        if ($(this).html() * 1 > lastDate) {
                                            $(this).css("background-color", "#cfe5e5");
                                        }
                                    });
                                    $("#calendar table").eq(end).find("td").each(function () {
                                        if ($(this).html() * 1 < toDate && $(this).html()) {
                                            $(this).css("background-color", "#cfe5e5");
                                        }
                                    });
                                    for (var i = 1; i < loop - 1; i++) {
                                        $("#calendar table").eq(begin + i).find("td").each(function () {
                                            if ($(this).html()) {
                                                $(this).css("background-color", "#cfe5e5");
                                            }
                                        });
                                    }
                                }
                                $(".dateXian li").eq(1).find("strong").html(bZero(month) + "月" + bZero(toDate) + "日");
                                $(".dateXian li").eq(1).find("span").html(weekDay(index));
                                $(".date li").eq(0).find("strong").html(bZero(lastMonth) + "月" + bZero(lastDate) + "日");
                                $(".date li").eq(1).find("strong").html(bZero(month) + "月" + bZero(toDate) + "日");
                                $(".date li").eq(0).find("span").eq(0).html(weekDay(lastDay));
                                $(".date li").eq(1).find("span").eq(0).html(weekDay(index));
                                var checkIn = Date.parse(new Date(lastYear + "/" + lastMonth + "/" + lastDate + "  08:00:00"));
                                var checkOut = Date.parse(new Date(year + "/" + month + "/" + toDate + "  08:00:00"));
                                var che = (checkOut - checkIn) / (24 * 3600 * 1000);
                                $("#date_checkin").html(checkIn);
                                $("#date_checkout").html(checkOut);
                                // alert(che)
                                var dataN={"id":id,"checkIn":checkIn,"checkOut":checkOut,"couponId":getRequest().couponId,"assetType":getRequest().assetType};
                                $.ajax({
                                    type: 'POST',
                                    url: '/content/h5/room/list',
                                    data: {data: JSON.stringify(dataN)},
                                    dataType: 'json',
                                    //async:false,
                                    success: function (data) {
                                        //console.log(data);
                                        if (data.sc == 0) {
                                            var nameCl = $("#content_2").attr("class");
                                            if (nameCl == "unselect") {
                                                $(".unselect .type").remove();
                                                $(".unselect .gap_3").remove();
                                                $("#content_2").removeClass("unselect");
                                            }
                                            var typebox = " <div class=\"type\"><img class=\"type_img\"><div><p class=\"type_name\"></p></div><p class=\"type_intro\"></p><p class=\"type_price\"><em>均价</em><span class=\"type_number\"></span><span><span class=\"type_unit\"></span>/晚</span> <strong>预定</strong></p></div>";
                                            var roomList = data.data;
                                            console.log(roomList);
                                            for (var k = 0; k < roomList.length; k++) {
                                                // alert(roomList.length)
                                            var roomshowCyType=roomList[k].productInfo.productPrice.showCyType,//类型
                                                roomshowCyCode=roomList[k].productInfo.productPrice.showCyCode,//符号
                                                //roomshowTotalPrice,
                                                roomshowAvgPrice,
                                                roomshowCyUnit=roomList[k].productInfo.productPrice.showCyUnit,//单位
                                                roomTotalPrice = roomList[k].productInfo.productPrice.totalPrice;//价格
                                                if(roomshowCyType==0||roomshowCyType==5||roomshowCyType == 6){
                                                    //roomshowTotalPrice=roomList[k].productInfo.productPrice.showTotalPrice/100;//价格
                                                    roomshowAvgPrice=roomList[k].productInfo.productPrice.showAvgPrice/100;
                                                }else{
                                                    //roomshowTotalPrice=roomList[k].productInfo.productPrice.showTotalPrice;//价格
                                                    roomshowAvgPrice=roomList[k].productInfo.productPrice.showAvgPrice;
                                                }

                                                $("#content_2").append(typebox);
                                                if (roomList[k].imgList) {
                                                    $(".type").eq(k).children(".type_img").attr("src", roomList[k].imgList[0]);
                                                }
                                                $(".type").eq(k).find(".type_name").append(roomList[k].name);
                                                if (roomList[k].roomBrief) {
                                                    $(".type").eq(k).children("p.type_intro").append(roomList[k].roomBrief);
                                                }
                                                    $(".type").eq(k).children(".type_price").children(".type_number").append(roomshowAvgPrice);
                                                if (roomList[k].productInfo) {
                                                    $(".type").eq(k).find(".type_unit").html(roomshowCyUnit);
                                                    if(roomshowCyType==0){
                                                        $(".type").eq(k).find(".type_price").prepend(roomshowCyCode);
                                                    }else{
                                                if (roomshowCyType == 6) {
                                                    $(".type").eq(k).find(".type_price .type_number").html(roomshowCyCode + '&nbsp;' + roomshowAvgPrice + '&nbsp;').css("font-family", "黑体");
                                                    $(".type").eq(k).find(".type_price").prepend('<span class="roomshowCyCode" style="width:15.4rem;color:#979797;font-size:0.8rem;line-height:1.2rem;text-decoration:line-through;"><span style="color:#9b9b9b;">' + roomTotalPrice / 100 + '元</span></span><br>');
                                                    $(".type").eq(k).find(".type_price .type_number").css({
                                                        "font-size": "0.867rem",
                                                        "line-height": "1.6rem"
                                                    });
                                                    $(".type").eq(k).find(".type_price strong").html("Time会员预订").css({
                                                        "background": "-webkit-linear-gradient(left top,#66ce9d,#62b8ba)",
                                                        "letter-spacing": "0"
                                                    });
                                                } else {
                                                    $(".type").eq(k).find(".type_price").prepend('<p class="roomshowCyCode" style="width:15.4rem;color:#999;font-size:0.8rem;line-height:1.2rem">' + roomshowCyCode + '</p>');
                                                    $(".type").eq(k).find(".type_price .type_number").css({
                                                        "font-size": "0.867rem",
                                                        "line-height": "1.6rem"
                                                    });
                                                }
                                                    }
                                                    if (roomList[k].productInfo.tolAmount == 0) {
                                                        $(".type").eq(k).children(".type_price").css("color","#999").children("strong").addClass("gray").css("background","#d8d8d8").html("满房");
                                                        $(".type").eq(k).children(".type_price").children(".type_number").css("color","#999");
                                                    }
                                                }
                                                else {
                                                    $(".type").eq(k).children(".type_price").children(".type_number").append(roomList[k].price);
                                                    $(".type").eq(k).children(".type_price").children("em").addClass("unselect");
                                                }
                                            }
                                        }


                                        $(".type .type_price strong").click(function () {
                                            $.ajax({
                                                url:"/user/h5/init",
                                                type : 'post',
                                                data: {data: JSON.stringify({"h5url":window.location.href})},
                                                success : function(data){
                                                    console.log(data);
                                                    loginStatus=data.sc;
                                                    if(loginStatus==-1){
                                                        var urlDate = {"act": "toLogin"};
                                                        iosBridgeObjc("http://www.jihelife.com?data=" + JSON.stringify(urlDate));
                                                    }
                                                }
                                            });
                                                        var cl = $(this).attr("class")
                                                        var bor = $(this).siblings("em").attr("class")
                                                        var el = $(this).parent(".type_price").parent(".type").index();
                                                        if (productType1 != 0) {//没有券的话让productType=0
                                                            $.post('/member/h5/assets', function (data) {
                                                                if (data.sc == "0") {
                                                                    data1 = data.data.couponPieces;
                                                                }
                                                                else {
                                                                    data1 = 0;
                                                                }
                                                                if (data1 == 0) {
                                                                    productType1 = 0;
                                                                    phone1 = DataBase.data.productBaseInfo.otaReserveWayValue;
                                                                }
                                                            });
                                                            setTimeout(function () {
                                                                if (cl == "gray") {
                                                                    return;
                                                                }
                                                                else if (productType1 == 0) {
                                                                    if (reserveWay == 1 || reserveWay == 4 || reserveWay == 5) {
                                                                        $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                                            if (res.sc == 0) {
                                                                                console.debug(res);
                                                                                var stepData = {
                                                                                    "act": "toWebView",
                                                                                    "h5url": encodeURIComponent(phone1)
                                                                                }
                                                                                var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                                                                                iosBridgeObjc(url);
                                                                            }
                                                                        })
                                                                    }
                                                                    else if (reserveWay == 2) {
                                                                        $("#phone").attr("href", "tel://'" + phone1 + "'");
                                                                        $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                                            if (res.sc == 0) {
                                                                                console.debug(res)
                                                                                $("#tanchuang_background").removeClass("disappear");
                                                                                $("#tanchuang").removeClass("disappear");
                                                                            }
                                                                        });
                                                                        $("#tanchuang_background").click(function () {
                                                                            $(this).addClass("disappear");
                                                                            $("#tanchuang").addClass("disappear");
                                                                        })
                                                                    }
                                                                    else if (reserveWay == 3) {
                                                                        $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                                            console.debug(res)
                                                                            if (res.sc == 0) {
                                                                                console.debug(res)
                                                                                var data = '{"act":"toCalendar","id":"' + id + '"}';
                                                                                var url = "http://www.jihelife.com?data=" + data;
                                                                                iosBridgeObjc(url);
                                                                            }
                                                                        });
                                                                    }

                                                                }
                                                                else {
                                                                    /*     var url=data.data.hotelBaseInfo.roomList[el].productInfo.reserveWayValue;*/
                                                                    if(assetType!=undefined){
                                                                        var json={productType:"2",id:data.data[el].productInfo.productId,checkin:String(checkIn),checkout:String(checkOut),couponcode:couponCode,couponid:couponId,assettype:assetType,act:"toOrder"}                                                           
                                                                    }else{
                                                                        var json ={productType:"2",id:data.data[el].productInfo.productId,checkin:String(checkIn),checkout:String(checkOut),act:"toOrder"};
                                                                    }
                                                                    console.log(JSON.stringify(json));
                                                                    json = "http://www.jihelife.com?data=" + JSON.stringify(json);
                                                                    iosBridgeObjc(json);
                                                                }
                                                            }, 500)
                                                        }
                                                        else {
                                                            if (cl == "gray") {
                                                                return;
                                                            }
                                                            else if (productType1 == 0) {
                                                                if (reserveWay == 1 || reserveWay == 4 || reserveWay == 5) {
                                                                    $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                                        if (res.sc == 0) {
                                                                            console.debug(res);
                                                                            var stepData = {
                                                                                "act": "toWebView",
                                                                                "h5url": encodeURIComponent(phone1)
                                                                            }
                                                                            var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                                                                            iosBridgeObjc(url);
                                                                        }
                                                                    })
                                                                }
                                                                else if (reserveWay == 2) {
                                                                    $("#phone").attr("href", "tel://'" + phone1 + "'");
                                                                    $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                                        if (res.sc == 0) {
                                                                            console.debug(res)
                                                                            $("#tanchuang_background").removeClass("disappear");
                                                                            $("#tanchuang").removeClass("disappear");
                                                                        }
                                                                    });
                                                                    $("#tanchuang_background").click(function () {
                                                                        $(this).addClass("disappear");
                                                                        $("#tanchuang").addClass("disappear");
                                                                    })
                                                                }
                                                                else if (reserveWay == 3) {
                                                                    $.post('/content/h5/clickOrderBtn', {data: '{"id":' + id + '}'}, function (res) {
                                                                        console.debug(res)
                                                                        if (res.sc == 0) {
                                                                            console.debug(res)
                                                                            var data = '{"act":"toCalendar","id":"' + id + '"}';
                                                                            var url = "http://www.jihelife.com?data=" + data;
                                                                            iosBridgeObjc(url);
                                                                        }
                                                                    });
                                                                }

                                                            }
                                                            else {
                                                                /*     var url=data.data.hotelBaseInfo.roomList[el].productInfo.reserveWayValue;*/
                                                                    if(assetType!=undefined){
                                                                        var json={productType:"2",id:data.data[el].productInfo.productId,checkin:String(checkIn),checkout:String(checkOut),couponcode:couponCode,couponid:couponId,assettype:assetType,act:"toOrder"}                                                           
                                                                    }else{
                                                                        var json ={productType:"2",id:data.data[el].productInfo.productId,checkin:String(checkIn),checkout:String(checkOut),act:"toOrder"};
                                                                    }
                                                                console.log(JSON.stringify(json));
                                                                json = "http://www.jihelife.com?data=" + JSON.stringify(json);
                                                                iosBridgeObjc(json);
                                                            }
                                                        }
                                            // alert(el)
                                            // alert(bor)
                                            //房型里面的预定判断
                                            //var memberStatus;
                                            //var memberFlag;
                                            //$.ajax({
                                            /*    url: "/user/client/info",
                                                type: 'post',
                                                data: {data: JSON.stringify({})},
                                                success: function (ress) {
                                                    console.log(ress);*/
                                                    //if (ress.sc == 0) {
                                                        //memberStatus = ress.sc;
                                                        //memberFlag = ress.data.memberFlag;
                                                       // if (memberFlag == 1 && memberStatus == 0) {
                                                       // }
                                                        /*else {
                                                            var urlDate = {"act": "toLogin"};
                                                            var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
                                                            iosBridgeObjc(url);
                                                        }*/
                                                    //}
                                                    /*else {
                                                        var urlDate = {"act": "toLogin"};
                                                        var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
                                                        iosBridgeObjc(url);
                                                    }*/
                                                //}
                                           // });
                                        });

                                        $(".date_mask").hide();
                                    }
                                });
                                firstS = 1;
                                lastYear = null;
                                lastMonth = null;
                                lastDate = null;
                                lastIndex = null;
                                $(".date_mask").hide();
                                return;
                            }
                        }
                    }
                });


                //首图滑动索引号
                $(document).ready(function () {
                    TouchSlide({slideCell: "#top_img", titCell: ".hd li", mainCell: ".bd ul"});
                    setInterval("topImgIndex()", 800);
                });
            },
            error: function () {
            }
        });
        // }

    })
}


//补0
function bZero(a) {
    if (a < 10) {
        a = "0" + a;
    }
    return a;
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

//获取url?后的参数
function GetParams(Url) {
    var queryString = Url; //获取url中的字串
    queryString = decodeURIComponent(Url);
    var params = {};
    if (queryString.indexOf("?") != -1) {
        queryString = queryString.substr(1);
        paramArray = queryString.split("?");
        paramArray = paramArray[paramArray.length - 1].split("&");
        for (var i = 0; i < paramArray.length; i++) {
            kv = paramArray[i].split("=");
            params[kv[0]] = kv[1]
        }
    }
    return params;
}
//判断是否登录
/*function ifLogin() {
    $.ajax({
        url: "/user/h5/info",
        type: 'post',
        async: false,
        success: function (data) {
            console.log(data);
            memberStatus = data.sc;
            if (memberStatus == 0) {
                memberFlag = data.data.memberFlag;
                console.log(memberFlag);
            }
            console.log(memberStatus);
        }
    });
}*/
// function ifLogin(){
//     $.ajax({
//         url:"/user/h5/init",
//         type : 'post',
//         data: {data: JSON.stringify({"h5url":window.location.href})},
//         success : function(data){
//             console.log(data);
//             loginStatus=data.sc;
//         }
//     });
// }

//弹窗的复用方法
/*
function popup() {
    $(".popup").show();
    $(".mask").show();
    $(".login").click(function () {
        sessionStorage.setItem("logFlag","1");
        var urlDate = {"act": "toLogin"};
        var url = "http://www.jihelife.com?data=" + JSON.stringify(urlDate);
        iosBridgeObjc(url);
    });
}
*/
/*
function cancelPop() {
    $(".popup").hide();
    $(".mask").hide();
}
*/
//支付权限
/*
function authority() {
    popup();
    $(".see").click(function () {
        cancelPop();
    });
    $(".mask").click(function () {
        cancelPop();
    });
}
*/




