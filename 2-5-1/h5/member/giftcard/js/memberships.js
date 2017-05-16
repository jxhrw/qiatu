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
                    backgroundImg='http://img3.imgtn.bdimg.com/it/u=3408403074,1974597991&fm=23&gp=0.jpg',
                    logoImg,
                    couponCode=res.data[i].couponCode,
                    discount,
                    remain;
                if(res.data[i].subCouponList){
                    for(var j=0;j<res.data[i].subCouponList.length;j++){
                        //couponType -2 消费金、5 折扣
                        if(res.data[i].subCouponList[j].couponBaseInfo.couponType=="2"){
                            remain=res.data[i].subCouponList[j].remain;
                        }else if(res.data[i].subCouponList[j].couponBaseInfo.couponType=="5"){
                            discount=res.data[i].subCouponList[j].faceValue;
                        }
                    }
                }
                cardsLi+='<li class="" style="background-image: url('+ backgroundImg +')">'
                    +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'">'
                    +'<div class="cardsName">'+ cardName +' <p class="cardDiscount fr"><span>'+ discount/10 +'</span> 折</p></div>'
                    +'<div class="cardInfo">'
                    +'<p>卡内余额： '+ remain/100 +'</p>'
                    +'<p>有效期： '+ effectiveTime + ' - ' + expireTime +'</p>'
                    +'</div>'
                    +'<img src="" alt="logo" class="cardLogo">'
                    +'</a>'
                    +'</li>'
            }
            $("#membershipCards").html(cardsLi);
            sortList(membershipInfo);
        }
        else{
            $(".cardsBox").hide();
        }
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
                    remainValue = oRemainValue + oFreeze;
                var giftInfoHtml='';
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
                giftCardsLi+='<li class="">'
                    +'<a href="cardOrCoupons.html?couponCode='+ couponCode +'">'
                    +'<div class="giftCardName"><p><span>'+getCouponName+'</span></p></div>'
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
    setTimeout(function(){
        if($(".cardsBox").is(":hidden") && $(".giftsBox").is(":hidden")){
            $("body").html(hasBackground("您还没有卡和礼券","40%")).find("p").css("color","#fff");
        }
    },1000);
};