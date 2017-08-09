$(document).ready(function(){
    var getParams=GetParams();
    var couponCardData={"couponCode":getParams.couponCode};
    ajaxPost(ajaxUrlAll.couponCardDetail,couponCardData,couponListFun,'');
    var bodyPadding=parseFloat($("body").css("padding-top").split("px")[0])+parseFloat($("body").css("padding-bottom").split("px")[0]);
    $('body').css({"min-height":$(window).height()-bodyPadding,"background":"#595d6a url('images/cardOrCouponBg.jpg') no-repeat center/cover"});
    $(".confirmBox").css("height",$(window).height());

    $(".shadow,.noRemove").click(function(){
        $(".confirmBox").hide();
    });

    //卡券信息请求
    function couponListFun(res){
        if(res.data && res.data.couponBaseInfo){
            var cardsDiv="";
            //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包;3-储值卡
            var couponType = res.data.couponBaseInfo.couponType,
                getCouponName = res.data.couponBaseInfo.couponName,
                effectiveTime = newFormatStrDate(new Date(parseInt(res.data.effectiveTime)),"/"),
                expireTime = newFormatStrDate(new Date(parseInt(res.data.expireTime)),"/"),
                couponCode = res.data.couponCode,
                couponId = res.data.couponId,
                applyNights = res.data.couponBaseInfo.applyNights,
                faceValue = parseInt(res.data.faceValue),//总额或折扣
                oFreeze = res.data.freeze ? parseInt(res.data.freeze):0,
                oRemainValue = parseInt(res.data.remain),
                remainValue = oRemainValue + oFreeze,

                usageStatus = res.data.usageStatus,
                backgroundImg = res.data.couponBaseInfo.cardFacePic,
                logoImg,
                currencyType = res.data.couponBaseInfo.currencyType,//转让的售出类型
                getRatio = res.data.couponBaseInfo.exchangePointsRatio,//兑换比例
                businessExchange = res.data.couponBaseInfo.businessExchange,//可换宿、商品
                bookingUrl = res.data.bookingUrl,//订房
                exchangeUrl = res.data.exchangeUrl,//换宿
                goodspurchaseUrl = res.data.goodspurchaseUrl,//换商品
                h5url_trade_in = res.data.h5url_trade_in,
                h5url_trade_out = res.data.h5url_trade_out,
                tradable = res.data.couponBaseInfo.tradable,//可转让
                exchangePointsDeadline = parseInt(res.data.couponBaseInfo.exchangePointsDeadline),
                exchangePoints = res.data.couponBaseInfo.exchangePoints,//可换积分
                removeFlag = res.data.removeFlag;
            if(res.data.couponBaseInfo.cardFacePic){
                getCouponName='';
            }
            var discountHtml='';
            var logoHtml='';
            var subCouponCode;
            var noUseHtml='';
            var giftCardNameAddClass='';
            if (usageStatus == -2){ //移除
                $(".function").remove();
            }
            if (usageStatus == 5 || usageStatus == 4 || usageStatus == 2 || usageStatus == -2) {//5-未到使用时间,4-已过期,2-已使用
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
                if(usageStatus==-2){
                    noUseDesc="已移除";
                }
                giftCardNameAddClass='titleGray';
                noUseHtml+='<div class="noUseLogo">'+noUseDesc+'</div>';
            }
            if(couponType=="3"){
                var discount,remain=0;
                document.title="我的会员卡";
                $(".recharge").show();
                $("#introTitle").html("使用说明");
                $("#card").show();
                if (usageStatus == 2) {
                    $(".recharge,.placeholder").show();
                }
                if(res.data.subCouponList){
                    for(var j=0;j<res.data.subCouponList.length;j++){
                        //couponType -2 消费金、5 折扣
                        if(res.data.subCouponList[j].couponBaseInfo.couponType=="2"){
                            remain=res.data.subCouponList[j].remain;
                            bookingUrl = res.data.subCouponList[j].bookingUrl;
                            exchangeUrl = res.data.subCouponList[j].exchangeUrl;
                            goodspurchaseUrl = res.data.subCouponList[j].goodspurchaseUrl;
                            h5url_trade_in = res.data.subCouponList[j].h5url_trade_in;
                            h5url_trade_out = res.data.subCouponList[j].h5url_trade_out;
                            subCouponCode = res.data.subCouponList[j].couponCode;
                        }else if(res.data.subCouponList[j].couponBaseInfo.couponType=="5"){
                            discount=res.data.subCouponList[j].faceValue;
                        }
                    }
                }
                if(discount){
                    discountHtml='<span>'+ discount/10 +'</span> 折';
                }
                if(logoImg){
                    logoHtml='<img src="" alt="logo" class="cardLogo">';
                }
                cardsDiv='<div class="card" style="background: url('+ backgroundImg +') no-repeat center/100% 100%;">'
                    +noUseHtml
                    +'<div class="cardsName"><span class="thisCardName">'+ getCouponName +'</span> <p class="cardDiscount fr">'+discountHtml+'</p></div>'
                    +'<div class="cardInfo">'
                    +'<p>卡内余额： '+ remain/100 +'</p>'
                    +'<p>有效期： '+ effectiveTime + ' - ' + expireTime +'</p>'
                    +'</div>'
                    +logoHtml
                    +'</div>';
            }
            else {
                var giftInfoHtml='';
                document.title="我的礼券";
                $(".forIntegral").show();
                $("#introTitle").html("适用说明");
                $("#coupon").show();
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
                }
                else {
                    giftInfoHtml='<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>'
                        +'<p>&nbsp;</p>';
                }
                cardsDiv='<div class="coupon">'
                    +noUseHtml
                    +'<div class="giftCardName '+ giftCardNameAddClass +'"><p><span>'+getCouponName+'</span></p></div>'
                    +'<div class="wavy"></div>'
                    +'<div class="giftInfo">'
                        //+'<p class="applicable">适用详情</p>'
                    + giftInfoHtml
                    +'<p>有效期： ' + effectiveTime + ' - '+ expireTime +'</p>'
                    +'</div>';
            }
            $(".cardsBox").html(cardsDiv).click(function(){
                if(subCouponCode){
                    window.location.href='/html/h5/member/giftcard/history.html?code='+getParams.couponCode+"&subCouponCode="+subCouponCode+"&couponId="+couponId;
                }else {
                    window.location.href='/html/h5/member/giftcard/history.html?code='+getParams.couponCode+"&couponId="+couponId;
                }
            });

            if(usageStatus == 5 || usageStatus == 4 || usageStatus == 2){
                $(".noUseLogo").hide();
            }
            if(removeFlag=="-2"){
                $(".noUseLogo").hide();
                $(".function").css("width","auto").find("td").hide().css("width","4rem");
                $(".removed").show().removeClass("unavailable").click(function(){
                    $(".confirmBox").show();
                });
                $(".remove").click(function(){
                    ajaxPost(ajaxUrlAll.couponCardRemove,couponCardData,couponRemoveFun,'');
                });
            }

            if(bookingUrl){
                var $dom=$(".booking");
                $dom.removeClass("unavailable");
                clickHref($dom,bookingUrl);
            }
            if(businessExchange==1){
                var $dom1=$(".forNight"),
                    $dom2=$(".forGoods");
                if(exchangeUrl){
                    $dom1.removeClass("unavailable");
                    clickHref($dom1,exchangeUrl);
                }
                if(goodspurchaseUrl){
                    $dom2.removeClass("unavailable");
                    clickHref($dom2,goodspurchaseUrl);
                }
            }
            if(tradable==1){
                var $dom=$(".transfer");
                if(h5url_trade_out){
                    $dom.removeClass("unavailable");
                    clickHref($dom,h5url_trade_out);
                }
            }
            if(exchangePoints==1){
                var $dom=$(".forIntegral");
                $dom.removeClass("unavailable");
                clickHref($dom,"redeem.html?code=" + couponCode + "&num=" + oRemainValue / 100 + "&name=" + getCouponName + "&ratio=" + getRatio + "&PointsDeadline=" + exchangePointsDeadline);
            }
            if (usageStatus == 5 || usageStatus == 4 || usageStatus == 2) {
                $(".booking").addClass("unavailable");
            }

            //适用详情
            var sProductUsable = res.data.couponBaseInfo.productUsable;
            var sDateUsable = res.data.couponBaseInfo.dateUsable;
            var sBookCondition = res.data.couponBaseInfo.bookCondition;
            var sRemark = res.data.couponBaseInfo.remark;
            var sAgreementInfo = res.data.couponBaseInfo.agreementInfo;
            var equityInfoList = res.data.couponBaseInfo.equityInfoList;
            /*if(sProductUsable){
             $(".introWord").append('<ul class="productUsable"><li class="proTitle">可用商户及房型</li></ul>');
             $.each(sProductUsable, function (i) {
             $(".productUsable").append('<li class="hotelItem">' + sProductUsable[i].hotelName + '<br/><span class="useDesc"></span></li>');
             if (sProductUsable[i].productUsableDesc) {
             $(".hotelItem").eq(i).find(".useDesc").html(sProductUsable[i].productUsableDesc);
             }
             });
             }
             if (sDateUsable) {//使用日期限制
             $(".introWord").append('<ul class="dateUsable"></ul>');
             $.each(sDateUsable, function (i) {
             $(".dateUsable").append('<li>' + sDateUsable[i] + '</li>');
             });
             }
             if (sBookCondition) {//使用限制条件
             $(".introWord").append('<ul class="bookCondition"></ul>');
             $.each(sBookCondition, function (i) {
             $(".bookCondition").append('<li>' + sBookCondition[i] + '</li>');
             });
             }
             if (sRemark) {//使用的注意条件
             $(".introWord").append('<ul class="remark"></ul>');
             $(".remark").append('<li>' + sRemark + '</li>');
             }
             if (sAgreementInfo) {
             $(".introWord").after('<ul class="agreementInfo"><a style="color: #336dc1" href="' + sAgreementInfo.h5Url + '">' + sAgreementInfo.name + '</a></ul>');
             }*/
            if(sProductUsable){
                $(".introWord").append('<div class="productUsable">可用商户及房型： </div>');
                $.each(sProductUsable, function (i) {
                    var hotelHtml='<span class="hotelItem">' + sProductUsable[i].hotelName + '</span>';
                    var useDesc='；';

                    if (sProductUsable[i].productUsableDesc) {
                        useDesc='<span class="useDesc">（'+ sProductUsable[i].productUsableDesc +'）</span>；';
                    }
                    $(".productUsable").append(hotelHtml+useDesc);
                });
            }
            if (sDateUsable) {//使用日期限制
                $(".introWord").append('<div class="dateUsable"></div>');
                $.each(sDateUsable, function (i) {
                    $(".dateUsable").append(sDateUsable[i] + '；');
                });
            }
            if (sBookCondition) {//使用限制条件
                $(".introWord").append('<div class="bookCondition"></div>');
                $.each(sBookCondition, function (i) {
                    $(".bookCondition").append(sBookCondition[i] + '；');
                });
            }
            if (sRemark) {//使用的注意条件
                $(".introWord").append('<div class="remark"></div>');
                $(".remark").append(sRemark + '；');
            }
            if(equityInfoList){
                $(".introWord").append('<div class="equityInfo"></div>');
                $.each(equityInfoList, function (i) {
                    $(".equityInfo").append(equityInfoList[i].equityDesc + '；');
                });
            }
            if (sAgreementInfo) {
                $(".introWord").after('<div class="agreementInfo"><a href="' + sAgreementInfo.h5Url + '">《' + sAgreementInfo.name + '》</a></div>');
            }
        }
        else{
            $(".giftsBox").hide();
        }
    }

    //卡券移除
    function couponRemoveFun(res){
        //window.history.go(-1);
        $(".noUseIcon").hide();
        $(".noUseLogo").html("已移除").show();
        $(".function,.confirmBox").hide();
    }

    function clickHref(dom,href){
        dom.click(function(){
            window.location.href=href;
        });
    }

});