$(document).ready(function(){
    var statusing;
    var productId;
    var winHeight=$(window).height();
    var data={"orderid":GetParams().orderid};
    $(".popupT").height(winHeight);

    var goBackUrl=2;
    sessionStorage.setItem("goBackUrl",JSON.stringify(goBackUrl));


    dealDetail();
    var countMore=1;



    $(".cancel").click(function(){
        $(".popupT,.cancelPrompt").show();
    });
    $("#close,.backShadow").click(function(){
        $(".popupT,.cancelPrompt").hide();
    });
    $("#checkAgainBtn").click(function(){
        $(".popupT,.cancelPrompt").hide();
        $("#checkAgainBtn").addClass("no");
        var cancelUrl='/order/h5/cancel';
        $.post(h5orClient(cancelUrl),{data:JSON.stringify(data)},function(res){
            console.log(res);
            if(res.sc==0){
                dealDetail();
            }
            $("#checkAgainBtn").removeClass("no");
        })
    });
    $(".bottom").click(function(){
        window.location.href="/html/order/payChannels.html?orderid="+GetParams().orderid+"&data="+productId;
    });
    $(".giftBox").click(function(){
        var ua = window.navigator.userAgent.toLowerCase();
        var memberUrl='/user/h5/info';
        //请求是否会员
        var dataN={};
        $.post(h5orClient(memberUrl),{data:JSON.stringify(dataN)},function(data) {
            console.log(data);
            if (data.sc == "0") {
                if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                    var data1='{"act":"toCoupon"}';
                    var url = "http://www.jihelife.com?data="+data1;
                    iosBridgeObjc(url);
                }
                else {
                    if(data.data.memberFlag=="0"){
                        window.location.href="/html/member/attention.html?refered=consumption";
                    }
                    else {
                        window.location.href="/html/jh-giftcard/build/index.html";
                    }
                }
            }
            else if (data.sc !="-99999") {
                errorPrompt(data.ErrorMsg,2000);
            }
            else {
                errorPrompt(chinese(data.ErrorMsg),2000)
            }
        });
    });

    function dealDetail(){
        //判断订单状态 -1未创建 0待提交 1代确认房态 2房态确认处理中 3待支付 4支付中 5已支付 6预定处理中 8已确认【预订】11已发货 12交易完成 9 已取消
        var infoUrl='/order/h5/info';
        var countDown;//订单有效期倒计时
        $.post(h5orClient(infoUrl),{data:JSON.stringify(data)},function(res) {
            console.log(res);
            if (res.sc == 0) {
                var iconHtml;
                statusing=res.data.status;
                productId=res.data.productid;
                switch(res.data.status) {
                    case "8":
                    case "11":
                    case "12":
                        iconHtml='&#xe610;';//交易完成等
                        break;
                    case "3":
                    case "4":
                    case "5":
                        iconHtml='&#xe618;';//待支付等
                        break;
                    default:
                        iconHtml='&#xe60d;';//取消等
                        break;
                }
                if(res.data.status=="3" || res.data.status=="4"){
                    if(countMore<3){
                        setTimeout(function(){
                            dealDetail();
                        },2000);
                        countMore++;
                    }
                    countDown=parseInt(res.data.countDown);
                    $(".orderDesc").show().find("span").html(countDownFun(countDown));
                    if(countDown>0){
                        var it=setInterval(function(){
                            countDown--;
                            $(".orderDesc span").html(countDownFun(countDown));
                            if(countDown==0){
                                clearInterval(it);
                                dealDetail();
                            }
                        },1000);
                    }
                    $(".giftBox").hide();
                    $(".bottom").show();
                    $(".giftBtnBox").show();
                }
                if(res.data.status=="12"){
                    $(".orderDesc,.giftBtnBox,.bottom").hide();
                    $(".cancel").hide();
                    $("#payTime,.giftBtnBox").show();
                    $("#orderTime").html(newFormatStrDate(new Date(parseInt(res.data.payTime)),"/")+"&nbsp;&nbsp;&nbsp;"+timeFormatSecond(new Date(parseInt(res.data.payTime)),":"));
                    //查看我的礼券
                    $(".giftBox").show();
                }
                if(res.data.status=="9"){
                    $(".orderDesc,.giftBtnBox,.bottom").hide();
                }
                $(".title .iconfont").html(iconHtml);
                $("#statusDesc").html(res.data.statedesc);
                $(".orderTitle").html(res.data.ordername);
                $("#referPrice").html(res.data.referPrice);
                if(undefined!=res.data.payments){
                    if("0"==res.data.payments[0].payType){
                        $("#amount").html("￥"+floatFixed2(res.data.payments[0].amount/100));
                    }
                    if("6"==res.data.payments[0].payType){
                        $("#amount").html(res.data.payments[0].points+"积分");
                    }
                }
                //$("#amount").html("￥"+floatFixed2(res.data.amount/100));
            }
        });
    }



    //倒计时
    function countDownFun(num){
        //var hours=parseInt(num/3600);
        minutes=parseInt(num/60);
        seconds=parseInt(num%60);
        return formatNum(minutes)+":"+formatNum(seconds);
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

window.onload = function(){
    var referrer=document.referrer;//当前页前一页的链接
    /*if(referrer.indexOf("payChannels")!=-1){
        pushHistory();
        window.addEventListener("popstate", function(e) {
            window.history.go(-2);//alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
        }, false);
        function pushHistory() {
            var state = {
                title: "title"
            };
            window.history.pushState(state, "title");
        }
    }*/
};

