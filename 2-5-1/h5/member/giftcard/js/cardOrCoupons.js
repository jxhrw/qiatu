$(document).ready(function(){


    var couponCardData={"couponCode":GetParams().couponCode};
    ajaxPost(ajaxUrlAll.couponCardDetail,couponCardData,couponListFun,'');

    //卡券信息请求
    function couponListFun(res){
        if(res.data && res.data.couponBaseInfo){
            var cardsDiv="";
            //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包;3-储值卡
            var couponType = res.data.couponBaseInfo.couponType,
                getCouponName = res.data.couponBaseInfo.couponName,
                effectiveTime = newFormatStrDate(new Date(parseInt(res.data.couponBaseInfo.effectiveTime)),"/"),
                expireTime = newFormatStrDate(new Date(parseInt(res.data.couponBaseInfo.expireTime)),"/"),
                couponCode = res.data.couponCode,
                couponId = res.data.couponId,
                applyNights = res.data.couponBaseInfo.applyNights,
                faceValue = parseInt(res.data.faceValue),//总额或折扣
                oFreeze = res.data.freeze ? parseInt(res.data.freeze):0,
                oRemainValue = parseInt(res.data.remain),
                remainValue = oRemainValue + oFreeze,

                usageStatus = res.data.usageStatus,
                backgroundImg='http://img3.imgtn.bdimg.com/it/u=3408403074,1974597991&fm=23&gp=0.jpg',
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
                exchangePoints = res.data.couponBaseInfo.exchangePoints;//可换积分
            if(couponType=="3"){
                var discount,remain;
                document.title="我的会员卡";
                $(".recharge").show();
                $("#introTitle").html("卡的使用说明");
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
                        }else if(res.data.subCouponList[j].couponBaseInfo.couponType=="5"){
                            discount=res.data.subCouponList[j].faceValue;
                        }
                    }
                }
                cardsDiv+='<div class="card" style="background-image: url('+ backgroundImg +')">'
                    +'<div class="cardsName">'+ getCouponName +' <p class="cardDiscount fr"><span>'+ discount/10 +'</span> 折</p></div>'
                    +'<div class="cardInfo">'
                    +'<p>卡内余额： '+ remain/100 +'</p>'
                    +'<p>有效期： '+ effectiveTime + ' - ' + expireTime +'</p>'
                    +'</div>'
                    +'<img src="" alt="logo" class="cardLogo">'
                    +'</div>';
            }
            else {
                var giftInfoHtml='';
                document.title="我的礼券";
                $(".forIntegral").show();
                $("#introTitle").html("适用说明");
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
                    +'<div class="giftCardName"><p><span>'+getCouponName+'</span></p></div>'
                    +'<div class="wavy"></div>'
                    +'<div class="giftInfo">'
                        //+'<p class="applicable">适用详情</p>'
                    + giftInfoHtml
                    +'<p>有效期： ' + effectiveTime + ' - '+ expireTime +'</p>'
                    +'</div>';
            }
            $(".cardsBox").html(cardsDiv);

            clickHref($(".booking"),bookingUrl);
            if(businessExchange==1){
                var $dom1=$(".forNight"),
                    $dom2=$(".forGoods");
                $dom1.removeClass("unavailable");
                $dom2.removeClass("unavailable");
                clickHref($dom1,exchangeUrl);
                clickHref($dom2,goodspurchaseUrl);
            }
            if(tradable==1){
                var $dom=$(".transfer");
                $dom.removeClass("unavailable");
                clickHref($dom,h5url_trade_out);
            }
            if(exchangePoints==1){
                var $dom=$(".forIntegral");
                $dom.removeClass("unavailable");
                clickHref($dom,"redeem.html?code=" + couponCode + "&num=" + oRemainValue / 100 + "&name=" + getCouponName + "&ratio=" + getRatio + "&PointsDeadline=" + exchangePointsDeadline);
            }
            //usageStatus:5-未到使用时间,4-已过期,2-已使用
            if(usageStatus == 5 || usageStatus == 4 || usageStatus == 2){
                $(".function td").addClass("unavailable");
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

    function clickHref(dom,href){
        dom.click(function(){
            window.location.href=href;
        });
    }
});