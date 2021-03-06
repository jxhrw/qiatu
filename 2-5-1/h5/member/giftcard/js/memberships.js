var requestTwo=0;
$(document).ready(function(){
    var membershipInfo={"ul":"#membershipCards","titleDiv":".cardsName"};
    var giftCardsInfo={"ul":"#giftCards","titleDiv":".giftCardName"};
    var cardListData={};
    var couponListData={"pageno":1,"pagecnt":50};
    if(GetParams().hotelIds && GetParams().hotelIds!="undefined"){
        var arr=decodeURIComponent(GetParams().hotelIds);
        arr=arr.split(",");
        cardListData.hotelIds=arr;
        couponListData.hotelIds=arr;
    }else {
        ajaxPost(ajaxUrlAll.cardList,cardListData,cardListFun);
    }
    ajaxPost(ajaxUrlAll.couponList,couponListData,couponListFun);

    //卡信息请求
    function cardListFun(res){
        if(res.data && res.data.length>0){
            $(".cardsBox").show();
            $("#hasBackground").remove();
            var cardsLi="";
            for(var i=0;i<res.data.length;i++){
                var cardName=res.data[i].couponBaseInfo.couponName,
                    effectiveTime = newFormatStrDate(new Date(parseInt(res.data[i].effectiveTime)),"/"),
                    expireTime = newFormatStrDate(new Date(parseInt(res.data[i].expireTime)),"/"),
                    backgroundImg = res.data[i].couponBaseInfo.cardFacePic?res.data[i].couponBaseInfo.cardFacePic:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494931546473&di=00f05f4228f8615fb9aaf05f468fa928&imgtype=0&src=http%3A%2F%2Fuploadfile.bizhizu.cn%2F2014%2F0912%2F20140912112409224.jpg',
                    logoImg,
                    couponCode=res.data[i].couponCode,
                    discount,
                    remain;
                var discountHtml="";
                var logoHtml='';
                if(i==res.data.length-1 && res.data[i].couponBaseInfo.cardFacePic){
                    cardName='';
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
                cardsLi+='<li class="" style="background-image: url('+ backgroundImg +')">'
                    +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'">'
                    +'<div class="cardsName"><span class="thisCardName">'+ cardName +'</span> <p class="cardDiscount fr">'+ discountHtml +'</p></div>'
                    +'<div class="cardInfo">'
                    +'<p>卡内余额： '+ remain/100 +'</p>'
                    +'<p>有效期： '+ effectiveTime + ' - ' + expireTime +'</p>'
                    +'</div>'
                    +logoHtml
                    +'</a>'
                    +'</li>'
            }
            $("#membershipCards").html(cardsLi);
            sortList(membershipInfo);
        }
        else{
            $(".cardsBox").hide();
        }
        requestTwo++;
    }

    //券信息请求
    function couponListFun(res){
        if(res.data && res.data.length>0){
            $(".giftsBox").show();
            $("#hasBackground").remove();
            var giftCardsLi="";
            for(var i=0;i<res.data.length;i++){
                //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包
                var couponType = res.data[i].couponBaseInfo.couponType,
                    getCouponName = res.data[i].couponBaseInfo.couponName,
                    effectiveTime = newFormatStrDate(new Date(parseInt(res.data[i].couponBaseInfo.effectiveTime)),"/"),
                    expireTime = newFormatStrDate(new Date(parseInt(res.data[i].couponBaseInfo.expireTime)),"/"),
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
                    giftCardNameAddClass='titleGray';
                }
                giftCardsLi+='<li class="">'
                    +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'">'
                    +'<div class="giftCardName '+ giftCardNameAddClass +'"><p><span>'+getCouponName+'</span></p></div>'
                    +'<div class="wavy"></div>'
                    +'<div class="giftInfo">'
                        //+'<p class="applicable">适用详情</p>'
                    + giftInfoHtml
                    +'<p>有效期： ' + effectiveTime + ' - '+ expireTime +'</p>'
                    +'</div>'
                    +'</a>'
                    +'</li>';

            }
            $("#giftCards").html(giftCardsLi);
            sortList(giftCardsInfo);
        }
        else{
            $(".giftsBox").hide();
        }
        requestTwo++;
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

window.onload=function(){
    var timePassed=0;
    var interval=setInterval(function(){
        timePassed++;
        if(requestTwo>=2){
            if($(".cardsBox").is(":hidden") && $(".giftsBox").is(":hidden")){
                $("body").html(hasBackground("您还没有卡和礼券","40%")).find("p").css("color","#fff");
            }
            clearInterval(interval);
        }
        if(timePassed>=10){
            clearInterval(interval);
        }
    },1000);
};