$(document).ready(function() {
    var moneyNum;
    var getParams=GetParams();
    var ratio=getParams.ratio;//兑换倍数
    var winHeight=$(window).height();
    var store=decodeURIComponent(getParams.name);
    $(".bombBox").css("height",winHeight);

    $(".consumetitle").text(store);
    $(".more strong").text(getParams.num);
    $(".more span").text(getParams.num>1?(Math.ceil(getParams.num*ratio)):(Math.floor(getParams.num*ratio)));
    $(".deadLine span").html(newFormatStrDate(new Date(parseInt(getParams.PointsDeadline)),"."));
    if(undefined==getParams.PointsDeadline){
        $(".deadLine").hide();
    }

    //消费金兑换成功之后通知页面
    if(getParams.type=="cash"){
        $(".consumeFinishBg p").html("消费金转让成功");
        $(".exchangeNotice").html("您已以￥"+getParams.num+"的价格转让"+getParams.payMoney+"【"+decodeURIComponent(getParams.name)+"】");
        $(".giftFinish").eq(0).html("会员中心").attr("href","/html/member/memberCenter.html");
        $(".giftFinish").eq(1).html("现金账户").attr("href","/html/member/cashAccount.html");
    }else {
        $(".havePayed").html((getParams.num/ratio).toFixed(2));
        $(".havePayStore").html(store);
        $(".havePayIntegral").html(getParams.num);
    }

//获取焦点
    $(".resetPhone").focus(function (event) {
        $("#submitBtn").removeAttr("disabled");
    });

    //关闭弹窗
    $(".closeConf").click(function(){
        $(".bombBox").hide();
    });

//再次确认的提示
    $("#submitBtn").click(function() {
        var zz=Number($(".resetPhone").val());
        var zg=Number($(".more span").html());
        if(zz>zg){
            $(".tip").css('display', 'block').html("超过可兑换积分上限");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },2000);
        }
        else if(zz<1&&zz<=zg){
            $(".tip").css({'display':'block','width':'40%'}).html("兑换积分数量不可小于1");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },2000);
        }
        else if(zz.toString().indexOf(".")){
            if(zz.toString().split(".")[1]){
                if(zz.toString().split(".")[1]/1==0){
                    moneyNum=$(".resetPhone").val();
                    $(".money").html((moneyNum/ratio).toFixed(2));
                    $(".bombStore").html('【'+store+'】兑换');
                    $(".integral").html(moneyNum/1);
                    $(".bombBox").show();
                }else{
                    $(".tip").css({'display':'block','width':'40%'}).html("兑换积分数量不可为小数");
                    setTimeout(function() {
                        $(".tip").css('display', 'none');
                    },2000);
                }
            }
            else {
                moneyNum=$(".resetPhone").val();
                $(".money").html((moneyNum/ratio).toFixed(2));
                $(".bombStore").html('【'+store+'】兑换');
                $(".integral").html(moneyNum/1);
                $(".bombBox").show();
            }
        }
        else {
            moneyNum=$(".resetPhone").val();
            $(".money").html((moneyNum/ratio).toFixed(2));
            $(".bombStore").html('【'+store+'】兑换');
            $(".integral").html(moneyNum);
            $(".bombBox").show();
        }
    });

    //兑换成功跳转
    $(".confirmSure").click(function(){
        var code=getParams.code;
        var data={"couponCode":code,"points":moneyNum};
        $.post('/pay/h5/coupon/exchangepoints',{data: JSON.stringify(data)} ,function(data) {
            if(data.sc==0){
                window.location.href="/html/h5/member/giftcard/redeemFinish.html?num="+moneyNum+"&name="+store+"&ratio="+ratio;
            }
            else {
                alert("兑换失败");
            }
        });
    });

});