var urlHotel = host + "/leapp/le.hotel.info";
var paramHotel = '{"id":"' + id + '"}';
var person = new Person();

person.requestCommit(urlHotel, paramHotel)
/*testHeader(param);*/
console.debug(person.getRequestData());


/*$(document).ready(function() {*/

   /*alert(result);*/
    var sc=person.getRequestData().sc;
    var id=person.getRequestData().data.hotelModel.hotelId;
    var title=person.getRequestData().data.hotelModel.hotelName;
    var desc=person.getRequestData().data.hotelModel.description;
    var img=person.getRequestData().data.hotelModel.imageUrlList;
    var address=person.getRequestData().data.hotelModel.address;
    var phone=person.getRequestData().data.hotelModel.phone;
    var longitude=person.getRequestData().data.hotelModel.longitude;
    var latitude=person.getRequestData().data.hotelModel.latitude;
    var price=person.getRequestData().data.hotelModel.priceInfo.price;
    var checkin=person.getRequestData().data.hotelModel.priceInfo.checkin;
    var checkout=person.getRequestData().data.hotelModel.priceInfo.checkout;
    var day=person.getRequestData().data.hotelModel.priceInfo.priceDays;
    var goTo=person.getRequestData().data.hotelModel.goToCount;
    var want=person.getRequestData().data.hotelModel.wantCount;
    var userGoToStatus=person.getRequestData().data.hotelModel.userGoToStatus;
    var userWantStatus=person.getRequestData().data.hotelModel.userWantStatus;
    var shortPro=person.getRequestData().data.hotelModel.shortPromotionModelList;
    var imgLink= person.getRequestData().data.hotelModel.imgLink;
    var hotelFacilieits=person.getRequestData().data.hotelModel.hotelFacilieits;
    var hotelRoomModelList=person.getRequestData().data.hotelModel.hotelRoomModelList;
//桥梁
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        /*alert("if里面的东西");*/

        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            /*alert("else里面的东西");*/
            callback(WebViewJavascriptBridge)
        }, false)
    }
}




    if(sc==0){
        $(".loading").css("display","none");
    }else{
        $(".loading").css("display","block");
    }
    if(userGoToStatus==1){
            $(".like .qg i").removeClass("qg_current");
        }
   else
        {
            $(".like .qg i").addClass("qg_current");
        }
   if(userWantStatus==0){
            $(".like .xq i").addClass("xq_current");
        }
   else
        {
            $(".like .xq i").removeClass("xq_current");
        }
    //描述
    $(".item_hotel_share p a").html(desc);
     //价格
    var showPrice=parseInt(price);
    $(".content .price span").html(showPrice);
    if(price==-1){
        $(".content .price").html("也许有房").css("color","#FE5F5C");
    }

    //地址
    $(".mapWrap .adress").html(address);
    //天数
    if(day==1){
        $(".content .price i").html();
    }
    else{
        $(".content .price i").html(day);
    }
    //去过
         $(".qg em").html(goTo);
    //想去
     $(".xq em").html(want);
    //图片遍历
    $.each(img,function(i){
        $("#focus .bd ul").append('<li><a href="javascript:;"><img _src="'+img[i]+'?imageView2/1/w/'+aaa+'/h/'+600+'" /></a><a class="tit" href="javascript:;">'+title+'</a></li>');
        TouchSlide({ 
					slideCell:"#focus",
					titCell:".hd ul",
					mainCell:".bd ul", 
					effect:"left",
					autoPage:true,
					switchLoad:"_src"
				});	
            })
    //map
        $(".mapWrap .adress").html(address);
        $(".mapWrap .phone").html(phone);
        $("<img/>").attr("src", "http://restapi.amap.com/v3/staticmap?location="+longitude+","+latitude+"&zoom=10&size=800*400&markers=mid,,A:"+longitude+","+latitude+"&key=ee95e52bf08006f63fd29bcfbcf21df0").appendTo(".mapPicIn");
    //时间
        var mydate = new Date();
        var y=mydate.getFullYear();
        var m=mydate.getMonth()+1;
        var d=mydate.getDate();
        var date=y+"-"+m+"-"+d;

     if(shortPro==""){
        $(".item_active").css('display', 'none'); 
        }
    $.each(shortPro,function(i){
        var applinkApp = "applinkApp" + i;
        $(".item_active").append('<dl style="position: relative;"><div style="position: absolute;width:100%;height:100px;top:0px;left:0px;" id="'+applinkApp+'"  ></div><dt></dt><dd class="item_right"><span class="item_right_top"><a style="color:#1a1a1a;" href="jihe://toRecommend//'+shortPro[i].proId+'">'+shortPro[i].title+'</a></span><span class="item_right_center"><span class="item_right_time"><i></i><strong></strong>天结束</span><strong class="item_right_pirce"><i>￥</i><em>'+shortPro[i].price+'</em>起/<em style="font-size:14px;" id="day"></em>晚</strong></span></dd></dl>');

        if(shortPro[i].countDay==1){
            $("dl").eq(i).children(".item_right").children(".item_right_center").children(".item_right_pirce").children("#day").html();
        }
        else{
            $("dl").eq(i).children(".item_right").children(".item_right_center").children(".item_right_pirce").children("#day").html(shortPro[i].countDay);
        }
        if(shortPro[i].grade==1){
            $("dl").eq(i).children("dt").addClass("item_left2");
        }
        else if(shortPro[i].grade==2){
            $("dl").eq(i).children("dt").addClass("item_left1");
        }
        else{
            $("dl").eq(i).children("dt").addClass("item_left3");
        }




        var Begin= new Date(shortPro[i].reserveEndDate);
        /*alert(Begin);*/
        var time4 = Begin.getFullYear();
        var time5 = Begin.getMonth() + 1;
        var time6 = Begin.getDate();
        var time7 = Begin.getHours(); //获取当前小时数(0-23)
        var time8 =Begin.getMinutes(); //获取当前分钟数(0-59)
        var time9= Begin.getSeconds(); //获取当前秒数(0-59)
        time(time4,time5,time6,time7,time8,time9);
        if (days <= 30&&days>0) {
            $("dl").eq(i).children(".item_right").children(".item_right_center").children(".item_right_time").children("strong").html(days);
        }
        else if(days<=0){
            $("dl").eq(i).children(".item_right").children(".item_right_center").children(".item_right_time").html("已结束");
        }
        else {
            $("dl").eq(i).children(".item_right").children(".item_right_center").children(".item_right_time").css("display","none");
        }

        document.getElementById('applinkApp'+i).onclick = function(e) {

            var data = "http://www.jihelife.com?act=toRecommend&title="+shortPro[i].title+"&hotelName="+title+"&imageUrl="+img[0]+"&id="+shortPro[i].proId;
            /* alert("DDDDFF");*/
            connectWebViewJavascriptBridge(function(bridge) {

                bridge.send(data, function(responseData) {


                })

            })

        }





    })

//预订
document.getElementById('footerBtn').onclick = function(e) {

    var data = "http://www.jihelife.com?act=toHotelBook&id="+id+"&checkin="+checkin+"&checkout="+checkout;
    /* alert("DDDDFF");*/
    connectWebViewJavascriptBridge(function(bridge) {

        bridge.send(data, function(responseData) {


        })

    })

}


        //酒店设施

        $.each(hotelFacilieits,function(i){
            if(i%2==0&&hotelFacilieits[i+1]!=undefined){
            $(".sheshi>ul").append('<li> <span>'+hotelFacilieits[i]+'</span><span>'+hotelFacilieits[i+1]+'</span></li>');
            }
            else if(i%2==0&&hotelFacilieits[i+1]==undefined){
                $(".sheshi>ul").append('<li> <span>'+hotelFacilieits[i]+'</span></li>');
            }
            else{
                false;
            }
        });
        //酒店房型


        $("#hotel_jieshao").click(function(event) {
         $(this).addClass("currentli").siblings().removeClass("currentli");
         $(".item_hotel_share p").css("display","block");
         $(".footer").css("display","block");
         $(".mapWrap").css("display","block");
         $(".slideBox").css("display","none");
         $(".sheshi").css("display","none");
         });
         $("#hotel_sheshi").click(function(event) {
         $(this).addClass("currentli").siblings().removeClass("currentli");
         $(".item_hotel_share p").css("display","none");
         $(".footer").css("display","none");
         $(".mapWrap").css("display","none");
         $(".sheshi").css("display","block");
         $(".slideBox").css("display","none");
         });
        var c=0;
         $("#hotel_fangxin").click(function(event) {
             $(".slideBox").css("display","block");
             c++;
             $(this).attr("class",c);
             if($(this).attr('class')==1){
                 $.each(hotelRoomModelList,function(i){
                     var a=i;
                     $(".slideBox .bd ul").append('<li id="'+a+'"><a class="pic" href="javascript:;"><img src="'+hotelRoomModelList[i].imgLinkList[0]+'" /></a><a class="tit" href="#">'+hotelRoomModelList[i].roomName+'</a><ol id="ol'+a+'"></ol></li>');
                     var roomDescModelList=hotelRoomModelList[i].roomDescModelList;
                     $.each(roomDescModelList,function(i){
                         if(i>0){
                             $("#ol"+a).append('<li><strong>'+roomDescModelList[i].title+'</strong>:<span>'+roomDescModelList[i].value+'</span></li>');
                         }


                     });
                     TouchSlide({
                         slideCell:"#slideBox",
                         titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                         mainCell:".bd ul",
                         effect:"left",
                         autoPage:true //自动分页
                     });
                 });
                 /*$(".slideBox").css("display","block");*/
             }
             else{
                 $(".slideBox").css("display","block");
             }

         $(this).addClass("currentli").siblings().removeClass("currentli");
         $(".item_hotel_share p").css("display","none");
         $(".footer").css("display","none");
         $(".mapWrap").css("display","none");
         $(".sheshi").css("display","none");

         });


    



    
  
   


/*});*/
function toGo(){

    var urlHotelWant = host + "/leapp/le.user.like";
    var paramHotelWant = '{"id":"' + id + '","type":"1"}';
    var person = new Person();

    person.requestCommit(urlHotelWant, paramHotelWant)
    /*testHeader(param);*/
    console.debug(person.getRequestData());

        $(".qg em").html(person.getRequestData().data.goToCount);


        if(person.getRequestData().data.goToStatus==1){
            $(".like .qg i").removeClass("qg_current");
        }
        else
        {
            $(".like .qg i").addClass("qg_current");
        }
}

function wantTo(){
    var urlHotelLike = host + "/leapp/le.user.like";
    var paramHotelLike = '{"id":"' + id + '","type":"2"}';
    var person = new Person();

    person.requestCommit(urlHotelLike, paramHotelLike)
    /*testHeader(param);*/
    console.debug(person.getRequestData());
        $(".xq em").html(person.getRequestData().data.wantCount);

        if(person.getRequestData().data.wantStatus==0){
            $(".like .xq i").addClass("xq_current");
        }
        else
        {
            $(".like .xq i").removeClass("xq_current");
        }
}