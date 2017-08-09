var requestTwo=0;
$(document).ready(function(){
    var membershipInfo={"ul":"#membershipCards","titleDiv":".cardName"};
    var giftCardsInfo={"ul":"#giftCards","titleDiv":".cardName"};
    var uselessCardsInfo={"ul":"#uselessCards","titleDiv":".cardName"};
    var cardListData={};
    var couponListData={"pageno":1,"pagecnt":200};
    var getParams=GetParams();
    if(getParams.hotelIds && getParams.hotelIds!="undefined"){
        var arr=decodeURIComponent(getParams.hotelIds);
        arr=arr.split(",");
        cardListData.hotelIds=arr;
        couponListData.hotelIds=arr;
        ajaxPost(ajaxUrlAll.couponList,couponListData,couponListFun);
    }else {
        ajaxPost(ajaxUrlAll.cardList,cardListData,cardListFun);
    }

    //卡信息请求
    function cardListFun(res){
        if(res.data && res.data.length>0){
            $("#hasBackground").remove();
            for(var i=0;i<res.data.length;i++){
                var cardsLi="";
                var couponType = res.data[i].couponBaseInfo.couponType,
                    cardName=res.data[i].couponBaseInfo.couponName,
                    cardNameColor=res.data[i].couponBaseInfo.cardFaceFontColor,
                    effectiveTime = newFormatStrDate(new Date(parseInt(res.data[i].effectiveTime)),"/"),
                    expireTime = newFormatStrDate(new Date(parseInt(res.data[i].expireTime)),"/"),
                    backgroundImg = res.data[i].couponBaseInfo.cardFacePic,
                    logoImg='',
                    couponCode=res.data[i].couponCode,
                    discount=0,
                    remain=0,
                    usageStatus=res.data[i].usageStatus,
                    existName= 0,
                    cardInfoHtml='';
                var discountHtml="";
                var logoHtml='';
                var noUseHtml='';
                var countHtml='';
                if(res.data[i].couponBaseInfo.cardFaceText == "0"){ //0-没字，1-有字
                    existName=1;
                }
                if(res.data[i].subCouponList){
                    for(var j=0;j<res.data[i].subCouponList.length;j++){
                        //couponType -2 消费金、5 折扣
                        if(res.data[i].subCouponList[j].couponBaseInfo.couponType=="2"){
                            remain=res.data[i].subCouponList[j].remain?res.data[i].subCouponList[j].remain:0;
                        }else if(res.data[i].subCouponList[j].couponBaseInfo.couponType=="5"){
                            discount=res.data[i].subCouponList[j].faceValue?res.data[i].subCouponList[j].faceValue:0;
                        }
                    }
                }
                if(discount){
                    discountHtml='<span>'+ discount/10 +'</span> 折';
                }
                if(logoImg){
                    logoHtml='<img src="" alt="logo" class="cardLogo">';
                }
                if (usageStatus == 5 || usageStatus == 4 || usageStatus == 2) {//5-未到使用时间,4-已过期,2-已使用
                    var noUseDesc;
                    if(usageStatus==5){
                        noUseDesc="未启用";
                        noUseHtml='<div class="noUseIcon" style="background: url(images/corner-noable.png) no-repeat center/100% 100%"></div>';
                    }
                    if(usageStatus==4){
                        noUseDesc="已过期";
                        noUseHtml='<div class="noUseIcon" style="background: url(images/corner-expired.png) no-repeat center/100% 100%"></div>';
                    }
                    if(usageStatus==2|| remain==0){
                        noUseDesc="已使用";
                        noUseHtml='<div class="noUseIcon" style="background: url(images/corner-used.png) no-repeat center/100% 100%"></div>';
                    }
                    //noUseHtml='<div class="noUseLogo">'+noUseDesc+'</div>';
                }
                if(couponType!='9'){
                    cardInfoHtml='<div class="cardInfo">'
                        +'<p>卡内余额： '+ remain/100 +'</p>'
                        +'<p>有效期： '+ effectiveTime + ' - ' + expireTime +'</p>'
                        +'</div>';
                }else {
                    var timeAll = parseInt(res.data[i].diffTime?res.data[i].diffTime:0);
                    var freezeTime = res.data[i].freezeTime;//freezeTime  0未冻结 1以冻结
                    /*timeAll=366*24*60*60-1;
                     freezeTime=0;
                     backgroundImg="/html/h5/member/7.jpg";*/

                    var tdHtml=(freezeTime!=1)?('<tr><td>天</td><td>小时</td><td>分钟</td><td>秒</td></tr>'):('<tr><td colspan="4">此刻时间为您驻留 Enjoy</td></tr>');
                    var timeCardCount=timeCardCountFunc(timeAll);
                    countHtml='<table class="countDown">' +
                        '<tr><th id="days">'+ timeCardCount.days +'</th><th id="hours">'+ timeCardCount.hours +'</th><th id="minutes">'+ timeCardCount.minutes +'</th><th id="seconds">'+ timeCardCount.seconds +'</th></tr>' +
                        tdHtml +
                        '</table>';

                    if(freezeTime!=1){
                        needCountFunc(timeAll);
                    }
                }
                cardsLi+='<li class="membershipCard" style="background: url('+ backgroundImg +') no-repeat center/100% 100%;">'
                    +'<span class="isExistName" value="'+ existName +'"></span>'
                    +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'"  style="color:'+cardNameColor+'">'
                    +noUseHtml
                    +'<div class="cardName cardsName"><span class="thisCardName">'+ cardName +'</span> <p class="cardDiscount fr">'+ discountHtml +'</p></div>'
                    +cardInfoHtml
                    +logoHtml
                    +countHtml
                    +'</a>'
                    +'</li>';

                if (usageStatus == 5 || usageStatus == 4 || usageStatus == 2) {//5-未到使用时间,4-已过期,2-已使用
                    $("#uselessCards").append(cardsLi);
                    $(".uselessBox").show();
                }else {
                    $("#membershipCards").append(cardsLi);
                    $(".cardsBox").show();
                }
                colonPositionFunc($("#days").html());
            }
            sortList(membershipInfo);
            if($("#membershipCards li:last-child").find(".isExistName").attr("value")=="1"){
                $("#membershipCards li:last-child").find(".thisCardName").html("");
            }
        }
        requestTwo++;
        ajaxPost(ajaxUrlAll.couponList,couponListData,couponListFun);
    }

    //券信息请求
    function couponListFun(res){
        if(res.data && res.data.length>0){
            $("#hasBackground").remove();
            for(var i=0;i<res.data.length;i++){
                var giftCardsLi="";
                //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包
                var couponType = res.data[i].couponBaseInfo.couponType,
                    getCouponName = res.data[i].couponBaseInfo.couponName,
                    effectiveTime = newFormatStrDate(new Date(parseInt(res.data[i].effectiveTime)),"/"),
                    expireTime = newFormatStrDate(new Date(parseInt(res.data[i].expireTime)),"/"),
                    couponCode = res.data[i].couponCode,
                    couponId = res.data[i].couponId,
                    applyNights = res.data[i].couponBaseInfo.applyNights,
                    faceValue = parseInt(res.data[i].faceValue),//总额或折扣
                    oFreeze = res.data[i].freeze ? parseInt(res.data[i].freeze):0,
                    oRemainValue = parseInt(res.data[i].remain),
                    remainValue = oRemainValue + oFreeze,
                    usageStatus = res.data[i].usageStatus;
                var giftInfoHtml='';
                var giftCardNameAddClass='';
                var noUseHtml='';
                if(couponType=="1"){
                    giftInfoHtml='<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>'
                        +'<p>晚数： '+ applyNights +'晚</p>';
                }
                else if(couponType=="2"){
                    giftInfoHtml='<p>可用额度： '+ oRemainValue/100 +'</p>'
                        +'<p>冻结额度： '+ oFreeze/100 +'</p>'
                        +'<p>卡内余额： '+ remainValue/100 +'</p>';
                }
                else if(couponType=="5"){
                    giftInfoHtml='<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>'
                        +'<p>折扣： '+ faceValue/10 +'折</p>';
                }
                else if(couponType=="7"){
                    giftInfoHtml='<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>'
                        +'<p>金额： '+ faceValue/100 +'</p>';
                }else {
                    giftInfoHtml='<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>';
                }
                if (usageStatus == 5 || usageStatus == 4 || usageStatus == 2) {//5-未到使用时间,4-已过期,2-已使用
                    var noUseDesc;
                    if(usageStatus==5){
                        noUseDesc="未启用";
                        noUseHtml='<div class="noUseIcon" style="background: url(images/corner-noable.png) no-repeat center/100% 100%"></div>';
                    }
                    if(usageStatus==4){
                        noUseDesc="已过期";
                        noUseHtml='<div class="noUseIcon" style="background: url(images/corner-expired.png) no-repeat center/100% 100%"></div>';
                    }
                    if(usageStatus==2){
                        noUseDesc="已使用";
                        noUseHtml='<div class="noUseIcon" style="background: url(images/corner-used.png) no-repeat center/100% 100%"></div>';
                    }
                    giftCardNameAddClass='titleGray';
                    //noUseHtml='<div class="noUseLogo">'+noUseDesc+'</div>';
                }
                giftCardsLi+='<li class="giftCard">'
                    +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'">'
                    +noUseHtml
                    +'<div class="cardName giftCardName '+ giftCardNameAddClass +'"><p><span>'+getCouponName+'</span></p></div>'
                    +'<div class="wavy"></div>'
                    +'<div class="giftInfo">'
                        //+'<p class="applicable">适用详情</p>'
                    + giftInfoHtml
                    +'<p>有效期： ' + effectiveTime + ' - '+ expireTime +'</p>'
                    +'</div>'
                    +'</a>'
                    +'</li>';
                if (usageStatus == 5 || usageStatus == 4 || usageStatus == 2) {//5-未到使用时间,4-已过期,2-已使用
                    $("#uselessCards").append(giftCardsLi);
                    $(".uselessBox").show();
                }else {
                    $("#giftCards").append(giftCardsLi);
                    $(".giftsBox").show();
                }
            }
            sortList(giftCardsInfo);
        }
        sortList(uselessCardsInfo);
        if($("#uselessCards li:last-child").find(".isExistName").attr("value")=="1"){
            $("#uselessCards li:last-child").find(".thisCardName").html("");
        }
        requestTwo++;
        //是否空
        if(!$(".cardsBox").is(":hidden") || !$(".giftsBox").is(":hidden") || !$(".uselessBox").is(":hidden")){

        }else {
            $("body").html(hasBackground("您还没有卡和礼券","40%")).find("p").css("color","#fff");
        }
    }

    //设定卡券位置
    function sortList(info){
        var $cardsListLi=$(info.ul+" li");
        var cardsLength=$cardsListLi.length;
        var cardLiHeight=$cardsListLi.height();
        var cardNameHeight=$(info.titleDiv).height();
        $(info.ul).height(cardNameHeight*(cardsLength-1)+cardLiHeight);
        $cardsListLi.each(function(){
            $(this).css("top",cardNameHeight*$(this).index());
        });
    }
});

/*
 window.onload=function(){
 var timePassed=0;
 var interval=setInterval(function(){
 timePassed++;
 if(requestTwo>=2){
 if(!$(".cardsBox").is(":hidden") || !$(".giftsBox").is(":hidden") || !$(".uselessBox").is(":hidden")){
 }else {
 $("body").html(hasBackground("您还没有卡和礼券","40%")).find("p").css("color","#fff");
 }
 clearInterval(interval);
 }
 if(timePassed>=10){
 clearInterval(interval);
 }
 },1000);
 };*/