$(document).ready(function(){
    var getParams=GetParams();
    var cardListData={};
    var comboListData={};
    var couponListData={"pageno":1,"pagecnt":5};
    var unUseListData={};

    var header = $(".header").height();
    var clientHeight = window.innerHeight - header;
    var clientWidth = window.innerWidth;
    $(".couponList").css({ "height": clientHeight, "width": clientWidth });

    var scrollAble = 1;
    /*if(getParams.hotelIds && getParams.hotelIds!="undefined"){
        var arr=decodeURIComponent(getParams.hotelIds);
        arr=arr.split(",");
        cardListData.hotelIds=arr;
        couponListData.hotelIds=arr;
        ajaxPost(ajaxUrlAll.couponList,couponListData,couponListFun);
    }else {
        ajaxPost(ajaxUrlAll.cardList,cardListData,cardListFun);
    }*/

    memberList(cardListData);
    comboList(comboListData);
    couponList(couponListData);
    unUseList(unUseListData);


    $("body").bind("touchmove",function(e){e.preventDefault();}).unbind("touchmove");

    function memberList(data){
        ajaxPost(ajaxUrlAll.cardList,data,cardListFun);
    }
    function comboList(data){
        ajaxPost(ajaxUrlAll.comboList,data,comboListFun);
    }
    function couponList(data){
        ajaxPost(ajaxUrlAll.couponList,data,couponListFun);
    }
    function unUseList(data){
        ajaxPost(ajaxUrlAll.unNormalList,data,unUseListFun);
    }

    //每种类别下拉加载
    function scrollLoad(dom,data,allPage,func){
        dom.scroll(function() {
            var scrollTop = dom.scrollTop();
            var windowHeight = dom.find(".content").height();
            if (scrollTop + clientHeight >= windowHeight - 1 && scrollAble==1 && data.pageno<allPage) {
                scrollAble=0;
                data.pageno++;
                func(data);
            }
        });
    }

    //卡信息请求
    function cardListFun(res){
        scrollAble=1;
        var memberNum=res.totalAmount?res.totalAmount:0;
        var memberClass=".memberList ul li";
        $("#memberNum").html(memberNum);
        if(res.pageinfo && res.pageinfo.pageAmount && res.pageinfo.pageNo==1){
            scrollLoad($(".memberList"),cardListData,res.pageinfo.pageAmount,memberList);
        }

        if(res.data && res.data.length>0){
            for(var i=0;i<res.data.length;i++){
                var menberHtml=cardSingleFun(res.data[i]);
                $("#member").append(menberHtml);
                colonPositionFunc($("#days").html());
            }
            $("#loadMember").show();
        }else if($(memberClass).length==0){
            $(".memberList").html(hasBackground_min("无可用会员卡","40%"));
        }

        if(memberNum==1){
            $("#ccMember").show();
        }else{
            $("#ccMember").hide();
        }
        if(memberNum==$(memberClass).length && memberNum>0){
            $("#loadMember").html('已经加载完了').hide();
        }
    }
    //套餐卡信息请求
    function comboListFun(res){
        scrollAble=1;
        var comboNum=res.totalAmount?res.totalAmount:0;
        var comboClass=".comboList ul li";
        $("#comboNum").html(comboNum);
        if(res.pageinfo && res.pageinfo.pageAmount && res.pageinfo.pageNo==1){
            scrollLoad($(".comboList"),comboListData,res.pageinfo.pageAmount,comboList);
        }

        if(res.data && res.data.length>0){
            for(var i=0;i<res.data.length;i++){
                var comboHtml=comboSingleFun(res.data[i],i);
                $("#combo").append(comboHtml);
                var $dom=$(".comboCard").eq(i).find(".cardName span");
                var rowNum=Math.round($dom.height()/parseFloat($dom.css('line-height')));
                if(rowNum>2){
                    $dom.parents(".cardName").css("padding-top","1.667rem");
                }
            }
            $("#loadCombo").show();
        }else if($(comboClass).length==0){
            $(".comboList").html(hasBackground_min("无可用套餐卡","40%"));
        }

        if(comboNum==1){
            $("#ccCombo").show();
        }else{
            $("#ccCombo").hide();
        }
        if(comboNum==$(comboClass).length && comboNum>0){
            $("#loadCombo").html('已经加载完了').hide();
        }
    }
    //券信息请求
    function couponListFun(res){
        scrollAble=1;
        var couponNum=res.totalAmount?res.totalAmount:0;
        var couponClass=".couList ul li";
        $("#couponNum").html(couponNum);
        if(res.pageinfo && res.pageinfo.pageAmount && res.pageinfo.pageNo==1){
            scrollLoad($(".couList"),couponListData,res.pageinfo.pageAmount,couponList);
        }

        if(res.data && res.data.length>0){
            for(var i=0;i<res.data.length;i++){
                var couponHtml=couponSingleFun(res.data[i]);
                $("#coupon").append(couponHtml);
            }
            $("#loadCoupon").show();
        }else if($(couponClass).length==0){
            $(".couList").html(hasBackground_min("无可用礼券","40%"));
        }

        if(couponNum==1){
            $("#ccCoupon").show();
        }else{
            $("#ccCoupon").hide();
        }
        if(couponNum==$(couponClass).length && couponNum>0){
            $("#loadCoupon").html('已经加载完了').hide();
        }
    }
    //作废券信息请求
    function unUseListFun(res){
        scrollAble=1;
        var unUserNum=res.totalAmount?res.totalAmount:0;
        var unUserClass=".unUseList ul li";
        $("#unUseNum").html(unUserNum);
        if(res.pageinfo && res.pageinfo.pageAmount && res.pageinfo.pageNo==1){
            scrollLoad($(".unUseList"),unUseListData,res.pageinfo.pageAmount,unUseList);
        }

        if(res.data && res.data.length>0){
            for(var i=0;i<res.data.length;i++){
                if(res.data[i].couponBaseInfo.couponType=="3" || res.data[i].couponBaseInfo.couponType=="9"){
                    var menberHtml=cardSingleFun(res.data[i]);
                    $("#unUse").append(menberHtml);
                    colonPositionFunc($("#days").html());
                }
                else if(res.data[i].couponBaseInfo.couponType=="10"){
                    var comboHtml=comboSingleFun(res.data[i],i);
                    $("#unUse").append(comboHtml);
                }
                else {
                    var couponHtml=couponSingleFun(res.data[i]);
                    $("#unUse").append(couponHtml);
                }
            }
            $("#loadUnUse").show();
        }else if($(unUserClass).length==0){
            $(".unUseList").html(hasBackground_min("无作废卡券","40%"));
        }

        if(unUserNum==1){
            $("#ccUnUse").show();
        }else{
            $("#ccUnUse").hide();
        }
        if(unUserNum==$(unUserClass).length && unUserNum>0){
            $("#loadUnUse").html('已经加载完了').hide();
        }
    }
});
