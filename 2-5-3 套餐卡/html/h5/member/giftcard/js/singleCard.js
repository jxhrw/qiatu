//卡信息请求
function cardSingleFun(single){
    var cardsLi="";
    var couponType = single.couponBaseInfo.couponType,
        cardName=single.couponBaseInfo.couponName,
        cardNameColor=single.couponBaseInfo.cardFaceFontColor,
        effectiveTime = newFormatStrDate(new Date(parseInt(single.effectiveTime)),"/"),
        expireTime = newFormatStrDate(new Date(parseInt(single.expireTime)),"/"),
        backgroundImg = single.couponBaseInfo.cardFacePic,
        logoImg='',
        couponCode=single.couponCode,
        discount=0,
        remain=0,
        usageStatus=single.usageStatus,
        cardInfoHtml='';
    var discountHtml="";
    var logoHtml='';
    var noUseHtml='';
    var countHtml='';
    var thisNameStyle='';
    if(single.couponBaseInfo.cardFaceText == "0"){ //0-没字，1-有字
        cardName='';
    }
    if(single.subCouponList){
        for(var j=0;j<single.subCouponList.length;j++){
            //couponType -2 消费金、5 折扣
            if(single.subCouponList[j].couponBaseInfo.couponType=="2"){
                remain=single.subCouponList[j].remain?single.subCouponList[j].remain:0;
            }else if(single.subCouponList[j].couponBaseInfo.couponType=="5"){
                discount=single.subCouponList[j].faceValue?single.subCouponList[j].faceValue:0;
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
            +'<p>余额 <span class="opacity">卡&nbsp;&nbsp;&nbsp;</span>'+ remain/100 +'</p>'
            +'<p>有效期 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>'+ effectiveTime + ' - ' + expireTime +'</p>'
            +'<p>卡号 <span class="opacity">卡&nbsp;&nbsp;&nbsp;</span>'+ couponCode +'</p>'
            +'</div>';
    }else {
        var timeAll = parseInt(single.diffTime?single.diffTime:0);
        var freezeTime = single.freezeTime;//freezeTime  0未冻结 1以冻结
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

    if(cardName.length>10){
        cardName=cardName.substr(0,10)+'<br>'+cardName.substr(10);
        thisNameStyle='style=top:-0.333rem;'
    }
    cardsLi='<li class="membershipCard" style="background: url('+ backgroundImg +') no-repeat center/100% 100%;">'
        +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'"  style="color:'+cardNameColor+'">'
        +noUseHtml
        +'<div class="cardName cardsName"><span class="thisCardName" '+thisNameStyle+'>'+ cardName +'</span> <p class="cardDiscount fr">'+ discountHtml +'</p></div>'
        +cardInfoHtml
        +logoHtml
        +countHtml
        +'</a>'
        +'</li>';

    return cardsLi;
    /*$("#membershipCards").append(cardsLi);
    colonPositionFunc($("#days").html());*/
}

//券信息请求
function couponSingleFun(single){
    var giftCardsLi="";
    //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包
    var couponType = single.couponBaseInfo.couponType,
        getCouponName = single.couponBaseInfo.couponName,
        effectiveTime = newFormatStrDate(new Date(parseInt(single.effectiveTime)),"/"),
        expireTime = newFormatStrDate(new Date(parseInt(single.expireTime)),"/"),
        couponCode = single.couponCode,
        couponId = single.couponId,
        applyNights = single.couponBaseInfo.applyNights,
        faceValue = parseInt(single.faceValue?single.faceValue:0),//总额或折扣
        oFreeze = single.freeze ? parseInt(single.freeze):0,
        oRemainValue = parseInt(single.remain?single.remain:0),
        remainValue = oRemainValue + oFreeze,
        usageStatus = single.usageStatus;
    var giftInfoHtml='';
    var giftCardNameAddClass='';
    var noUseHtml='';
    if(couponType=="1"){
        giftInfoHtml='<p>&nbsp;</p>'
            +'<p>&nbsp;</p>'
            +'<p>晚数 <span class="opacity">卡&nbsp;&nbsp;&nbsp;</span>'+ applyNights +'晚</p>'
            +'<p>有效期 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>' + effectiveTime + ' - '+ expireTime +'</p>';
    }
    else if(couponType=="2"){
        giftInfoHtml='<p>可用额度 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>'+ oRemainValue/100 +'</p>'
            +'<p>冻结额度 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>'+ oFreeze/100 +'</p>'
            +'<p>卡内余额 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>'+ remainValue/100 +'</p>'
            +'<p>有效期 <span class="opacity">卡&nbsp;&nbsp;&nbsp;</span>' + effectiveTime + ' - '+ expireTime +'</p>';
    }
    else if(couponType=="5"){
        giftInfoHtml='<p>&nbsp;</p>'
            +'<p>&nbsp;</p>'
            +'<p>折扣 <span class="opacity">卡&nbsp;&nbsp;&nbsp;</span>'+ faceValue/10 +'折</p>'
            +'<p>有效期 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>' + effectiveTime + ' - '+ expireTime +'</p>';
    }
    else if(couponType=="7"){
        giftInfoHtml='<p>&nbsp;</p>'
            +'<p>&nbsp;</p>'
            +'<p>金额 <span class="opacity">卡&nbsp;&nbsp;&nbsp;</span>'+ faceValue/100 +'</p>'
            +'<p>有效期 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>' + effectiveTime + ' - '+ expireTime +'</p>';
    }else {
        giftInfoHtml='<p>&nbsp;</p>'
            +'<p>&nbsp;</p>'
            +'<p>&nbsp;</p>'
            +'<p>有效期 <span class="opacity">&nbsp;&nbsp;&nbsp;</span>' + effectiveTime + ' - '+ expireTime +'</p>';
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
    giftCardsLi='<li class="giftCard">'
        +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'">'
        +noUseHtml
        +'<div class="cardName giftCardName '+ giftCardNameAddClass +'"><p><span>'+getCouponName+'</span></p></div>'
        +'<div class="wavy"></div>'
        +'<div class="giftInfo">'
            //+'<p class="applicable">适用详情</p>'
        + giftInfoHtml

        +'</div>'
        +'</a>'
        +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'&&lstate=1">'
        +'<img src="images/maicon.png" class="couponQRCode">'
        +'</a>'
        +'</li>';
    //$("#membershipCards").append(giftCardsLi);
    return giftCardsLi;
}

//套餐卡信息请求
function comboSingleFun(single,index){
    var combosLi="";
    var couponType = single.couponBaseInfo.couponType,
        cardName=single.couponBaseInfo.couponName,
        cardNameColor=single.couponBaseInfo.cardFaceFontColor,
        effectiveTime = newFormatStrDate(new Date(parseInt(single.effectiveTime)),"/"),
        expireTime = newFormatStrDate(new Date(parseInt(single.expireTime)),"/"),
        backgroundImg = single.couponBaseInfo.cardFacePic,
        logoImg='',
        couponCode=single.couponCode,
        discount=0,
        remain=0,
        usageStatus=single.usageStatus,
        cardInfoHtml='';
    var discountHtml="";
    var logoHtml='';
    var noUseHtml='';
    var countHtml='';
    var styleBackgroundImg='style="background:  url('+ backgroundImg +') no-repeat center/100% 100%;"';
    /*if(single.couponBaseInfo.cardFaceText == "0"){ //0-没字，1-有字
        cardName='';
    }*/
    cardInfoHtml='<div class="cardInfo">'
        //+'<p>卡内余额： '+ remain/100 +'</p>'
        +'<p><span style="margin-right: 1rem;">有效期</span>'+ effectiveTime + ' - ' + expireTime +'</p>'
        +'</div>';

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
        //noUseHtml='<div class="noUseLogo">'+noUseDesc+'</div>';
    }
    combosLi='<li class="comboCard">'
        +'<a href="comboList.html?name='+ cardName +'&code='+ couponCode +'"  style="color:'+cardNameColor+'">'
        +'<div class="shadow1" '+styleBackgroundImg+'></div>'
        +'<div class="shadow2" '+styleBackgroundImg+'></div>'
        +'<div class="comboContent" '+styleBackgroundImg+'>'
        +noUseHtml
        +'<div class="cardName cardsName"><span class="thisCardName-no-use">'+ cardName +'</span> <p class="cardDiscount fr">'+ discountHtml +'</p></div>'
        +cardInfoHtml
        /*+logoHtml
        +countHtml*/
        +'</div>'
        +'</a>'
        +'</li>';

    return combosLi;
}


//套餐卡激活
function comboActivate(name,href,code){
    var html = '<div class="confirmBoxActivate">' +
        '<div class="shadowActivate"></div>' +
        '<div class="whiteBoxActivate">' +
        '<div class="boxContentActivate">' +
        '<div class="hintActivate">您将激活 '+name+' <br><br> 套餐卡激活后无法整套赠送给其他亲友，套餐卡内资产一旦使用无法进行退卡，请知悉 <br><br></div>' +
        '<div class="buttonBoxActivate">' +
        '<button class="ActivateSureBtn">确定激活</button>' +
        '<button class="ActivateCancelBtn">取消</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").append(html);
    $(".shadowActivate,.ActivateCancelBtn").click(function(){
        $(".confirmBoxActivate").remove();
    });
    $(".ActivateSureBtn").off("click").click(function(){
        var data={couponCode:code};
        ajaxPost(ajaxUrlAll.activateCard,data,function(res){
            if(window.location.href.indexOf("comboList.html")!=-1){
                usageStatus = 100;//不等于0就行
                $(".defaultHide").hide();
            }
            $(".confirmBoxActivate").remove();
            window.location.href = href;
        },function(res){
            //errorPrompt(res.err,2000);
        });
    });

    $(".confirmBoxActivate").css({
        "position": "fixed",
        "top": "0",
        "left": "0",
        "width": "100%",
        "z-index": "100",
        "height": $(window).height()
    });
    $(".shadowActivate").css({
        "width": "100%",
        "height": "100%",
        "background": "rgba(0,0,0,0.7)"
    });
    $(".whiteBoxActivate").css({
        "font-size": "0.8rem",
        "width": "66.67%",
        "background": "#fff",
        "border-radius": "0.3rem",
        "-moz-border-radius": "0.3rem",
        "-webkit-border-radius": "0.3rem",
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "transform": "translate(-50%,-50%)"
    });
    $(".boxContentActivate").css({
        "padding": "2rem 2rem 1.7rem 2rem"
    });
    $(".hintActivate").css({
        "color": "#4a4a4a",
        "line-height": "1.5rem",
        "margin-bottom": "1.5rem"
    });
    $(".buttonBoxActivate").css({
        "text-align": "right"
    });
    $(".ActivateSureBtn").css({
        "color": "#e2574c",
        "border": "none",
        "background": "#fff",
        "font-size": "0.8rem",
        "font-weight": "bold"
    });
    $(".ActivateCancelBtn").css({
        "color": "#4a4a4a",
        "border": "none",
        "background": "#fff",
        "font-size": "0.8rem",
        "font-weight": "bold",
        "margin-left": "2.27rem",
        "margin-right": "2rem"
    });
}
