$(document).ready(function(){
    var winHeight=$(window).height();
    $(".popupT").height(winHeight);
    var cancelOrNot=GetParams().status;//状态:0-售卖中,1-已取消, 2-已售罄
    if(undefined!=cancelOrNot && 0!=cancelOrNot){
        noCancel();
    }

    var url="/trade/h5/selling/detail";
    var data={"sellingid":GetParams().sellingid};
    $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
        console.log(res);
        if(res.sc==0){
            if(res.data.status==0){
                $("#stateDesc").html("发布成功");
            }
            if(res.data.status==1){
                $("#stateDesc").html("已取消");
                noCancel();
            }
            if(res.data.status==2){
                $("#stateDesc").html("已售罄");
                noCancel();
            }
            $("#relTitle").html(res.data.couponName);
            $("#saleNum").html(parseInt(res.data.availableAmount/100));
            $("#saleDiscount").html(res.data.discount+"%");
            $("#saleMoney").html("￥"+floatFixed2(res.data.price/100));
            $("#timeSecond").html(newFormatStrDate(new Date(parseInt(res.data.createTime)),"/")+'&nbsp;&nbsp;&nbsp;'+timeFormatSecond(new Date(parseInt(res.data.createTime)),":"));
            if(res.data.priceType==1){
                $("#kind").html("转让单价：");
                $("#saleDiscount").html(floatFixed2(res.data.exchangeRate/10)+" 积分");
                $("#saleMoney").html(res.data.pointsPrice+" 积分");
            }
        }
    });

    //关闭弹窗
    $(".backShadow,#close").click(function(){
        $(".popupT,#checkAgain,#returnInfo").hide();
    });

    $("#returnInfoBtn").click(function(){
        window.location.reload();
    });

    //取消
    $("#relCancel").click(function(){
        $(".popupT,#checkAgain").show();
    });

    //确认取消
    $("#checkAgainBtn").click(function(){
        $("#checkAgainBtn").addClass("no");
        $("#checkAgain").hide();
        $("#returnInfo").show();
        var urlCancel='/trade/h5/selling/cancel';
        var dataCancel={"sellingid":GetParams().sellingid};
        $.post(h5orClient(urlCancel),{data:JSON.stringify(dataCancel)},function(res){
            console.log(res);
            if(res.sc==0){
               $("#returnPrompt").html("取消成功，未成交的消费金已取消冻结状态");
                $("#checkAgainBtn,#relCancel").addClass("no");
            }
            else if(res.sc=="TRADE-1002"){
                $("#returnPrompt").html("有人正在购买您的消费金，暂无法取消交易，请稍后尝试");
                $("#checkAgainBtn").removeClass("no");
            }
            else {
                $("#returnPrompt").html("对不起，此次取消失败，请稍后尝试");
                $("#checkAgainBtn").removeClass("no");
            }
        });
    });

    //查看我的礼券
    $("#giftCard").click(function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
            var data1='{"act":"toBackCoupon"}';
            var url = "http://www.jihelife.com?data="+data1;
            iosBridgeObjc(url);
        }
        else {
            //window.location.href="/html/jh-giftcard/build/index.html";
            window.history.go(-2);
        }
    });


    //无取消按钮
    function noCancel(){
        $("#relCancel").hide();
        $("#giftCard").attr("class","relBtnCenter");
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

});