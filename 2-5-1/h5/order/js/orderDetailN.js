var orderUrl='/order/h5/info';
var orderData={orderid:GetParams().orderid};
var ua = window.navigator.userAgent.toLowerCase();
var objectType;
var again=0;//支付中刷新次数
var referrer=document.referrer;//当前页前一页的链接

$(document).ready(function(){
    if(referrer.indexOf("myOrderList")==-1){
        sessionStorage.setItem("toOrderLeave",1);
        sessionStorage.setItem("paymentLeave",1);
    }/*else {
        sessionStorage.setItem("toOrderLeave",0);
        sessionStorage.setItem("paymentLeave",0);
    }*/
    $(".mainContent").height($(window).height());

    detailInfo();

    //取消订单
    $("#cancel").click(function(){
        $("#cancel").addClass("no");
        $(".mainContent,.cancelBox,.underWindow").hide();
        var cancelUrl='/order/h5/cancel';
        $.post(h5orClient(cancelUrl),{data:JSON.stringify(orderData)},function(res){
            if(res.sc==0){
                detailInfo();
                $(".bookingTips").css({"width":"92%","min-height":"0"});
            }
            else if(res.sc!="-99999"){
                errorPrompt((res.ErrorMsg),2000);
            }
            else {
                errorPrompt(chinese("系统开小差了"),2000);
            }
            $("#cancel").removeClass("no");
        });
    });

    //继续支付
    $("#goOnPay").click(function(){
        sessionStorage.setItem("paymentLeave",0);
        window.location.href="/html/h5/order/payment.html?orderid="+orderData.orderid;
    });

    $("#cancelBtn").click(function(){
        $(".mainContent,.cancelBox").show();
    });

    $(".refundBox").click(function(){
        $(".mainContent,.underWindow").show();
    });

    $(".shadow,#wrong,#clearDisc").click(function(){
        $(".mainContent,.cancelBox,.underWindow").hide();
    });

    //详情信息
    function detailInfo(){
        $.post(h5orClient(orderUrl),{data:JSON.stringify(orderData)},function(orderRes){
            if(orderRes.sc==0){
                objectType=orderRes.data.objectType;
                var cashAmount=0;//现金支付
                var cashCouponDeductible=0;//消费金抵扣
                var roomCouponDeductible=0;//房券抵扣
                var housingDeductible=0;//积分兑房抵扣
                var integralDeductible=0;//积分抵现抵扣
                var discDeductible=0;//折扣券抵扣
                var redPacketDeductible=0;//红包抵扣
                var countDown=parseInt(orderRes.data.countDown?orderRes.data.countDown:0);//倒计时
                var checkin=parseInt(orderRes.data.checkin);
                var checkout=parseInt(orderRes.data.checkout);
                //var nights=parseInt((checkout-checkin)/24/3600/1000);
                var nights=orderRes.data.nights?orderRes.data.nights:1;
                var quantity=orderRes.data.quantity?orderRes.data.quantity:1;
                var payments=orderRes.data.payments;
                var iconHtml;
                showCyType=orderRes.data.showCyType;
                showCyCode=orderRes.data.showCyCode?orderRes.data.showCyCode:"";
                showCyUnit=orderRes.data.showCyUnit?orderRes.data.showCyUnit:"";
                showCyAmount=orderRes.data.showCyAmount?orderRes.data.showCyAmount:0;
                if(showCyType=="0" || showCyType=="5"){
                    showCyAmount=orderRes.data.showCyAmount/100;
                }
                var payInfoDivHtml='<div class="clearfix multiLine" id="zgJia"><div class="function gray fl">总价：</div><div class="quota fr">'+ showCyCode + showCyAmount + showCyUnit  +'</div></div>';
                $("#roomName").html(orderRes.data.ordername);
                $("#checkIn").html(newFormatStrDateNoYear(new Date(checkin),"/"));
                $("#checkOut").html(newFormatStrDateNoYear(new Date(checkout),"/"));
                $("#nights").html(nights);
                $("#quantity").html(quantity);
                $("#customerName").html(orderRes.data.customerName);
                $("#customerMobile").html(orderRes.data.customerMobile);
                $("#comments").html(orderRes.data.comments);
                $("#countDown").html(countDownFun(countDown));
                $("#orderid").html(GetParams().orderid);

                if(undefined!=orderRes.data.customerAddress){
                    var customerAddress=orderRes.data.customerAddress;
                    customerAddress=customerAddress.split(",");
                    $("#customerName").html(customerAddress[0]);
                    $("#customerMobile").html(customerAddress[1]);
                    $("#customerAddress").html(customerAddress[2]).parents(".customerAddress").show();
                }

                if("31"==objectType || "30"==objectType || "40"==objectType || "99"==objectType){
                    $(".bookingTips").html("").css("padding","0.5rem 1rem");
                    $("#checkTime,#hotelBox").hide();
                }
                else if("12"==objectType || undefined==objectType){
                    $(".bookingTips").html("").css("padding","0.5rem 1rem");
                    $("#header,#customer").hide();
                    $("#hotelBox").show();
                }
                else {
                    $(".bookingTips").html(orderRes.data.cancelPolicy);
                    $("#checkTime,#hotelBox").show();
                }

                if(countDown>0){
                    $("#goOnPay").show();
                    $("#bottomFree").css("height","5.4rem");
                    var it=setInterval(function(){
                        countDown--;
                        $("#countDown").html(countDownFun(countDown));
                        if(countDown==0){
                            $("#goOnPay").hide();
                            $("#bottomFree").css("height","2.4rem");
                            detailInfo();
                            clearInterval(it);
                        }
                    },1000);
                }else {
                    $("#goOnPay").hide();
                    $("#bottomFree").css("height","2.4rem");
                }
                for (var i =0;undefined != payments && i < payments.length; i++) {
                    //1是房券，2是现金抵用券，3是积分兑房，4是积分抵现，5是优惠券,7红包
                    if(payments[i].payType==0){
                        cashAmount+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==1){
                        roomCouponDeductible+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==2){
                        cashCouponDeductible+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==3){
                        housingDeductible+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==4){
                        integralDeductible+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==5){
                        discDeductible+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==7){
                        redPacketDeductible+=parseInt(payments[i].amount);
                    }
                    else if(payments[i].payType==6){ //6积分抵积分
                        payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">积分：</div><div class="quota fr">'+ '积分' + payments[i].faceValue + '个' +'</div></div>';
                    }
                    else if(payments[i].payType==11){ //11房券抵积分
                        var faceValue=payments[i].faceValue;
                        if(undefined==faceValue){
                            faceValue=1;
                        }
                        payInfoDivHtml+='<div class="clearfix multiLine"><div class="function gray fl">房券：</div><div class="quota fr">'+ payments[i].couponAlias + faceValue + '张' +'</div></div>';
                    }
                    else if(payments[i].payType==12){ //12消费金抵积分
                        payInfoDivHtml+='<div class="clearfix multiLine"><div class="function gray fl">消费金：</div><div class="quota fr">'+ payments[i].couponAlias + payments[i].faceValue/100 + '元' +'</div></div>';
                    }
                }

                if(cashCouponDeductible>0){
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">消费金：</div><div class="quota fr">-￥'+ cashCouponDeductible/100 +'</div></div>';
                }
                if(roomCouponDeductible>0){
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">房券：</div><div class="quota fr">-￥'+ roomCouponDeductible/100 +'</div></div>';
                }
                if(discDeductible>0){
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">折扣券：</div><div class="quota fr">-￥'+ discDeductible/100 +'</div></div>';
                }
                if(redPacketDeductible>0){
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">红包：</div><div class="quota fr">-￥'+ redPacketDeductible/100 +'</div></div>';
                }
                if(housingDeductible>0){
                    payInfoDivHtml+='<div class="clearfix multiLine"><div class="function gray fl">积分兑房：</div><div class="quota fr">-￥'+ housingDeductible/100 +'</div></div>';
                }
                if(integralDeductible>0){
                    payInfoDivHtml+='<div class="clearfix multiLine"><div class="function gray fl">积分抵现：</div><div class="quota fr">-￥'+ integralDeductible/100 +'</div></div>';
                }
                if(cashAmount>0){
                    $("#shouldPay").html('￥'+ cashAmount/100);
                    payInfoDivHtml+='<div class="clearfix multiLine"><div class="function gray fl"><span id="payNot">实付：</span></div><div class="quota <!--paleRed--> fr">￥'+ cashAmount/100 +'</div></div>';
                }else if(cashAmount==0){
                    $("#shouldPay").html('￥'+ cashAmount/100);
                }


                $("#payInfoDiv").html(payInfoDivHtml);

                if(orderRes.data.closereson){
                    $("#nowStatus").html(orderRes.data.statedesc+"("+orderRes.data.closereson+")");
                    if(orderRes.data.statedesc=="待支付"){
                        $("#payNot").html("应付：");
                    }
                }
                else{
                    $("#nowStatus").html(orderRes.data.statedesc);
                    if(orderRes.data.statedesc=="待支付"){
                        $("#payNot").html("应付：");
                    }
                }
                if(orderRes.data.stateremark){
                    $("#nowTips").html(orderRes.data.stateremark);
                }else {
                    $("#nowTips").html("");
                }
                if(orderRes.data.allowCancel==1){
                    $(".bookingTips").css("min-height","2rem");
                    $("#cancelBtn").show();
                }else {
                    $("#cancelBtn").hide();
                }
                if(orderRes.data.refundStatus=="1"){
                    $("#nowTips").html("退款中");
                    $(".refundBox").show();
                }
                else if(orderRes.data.refundStatus=="9"){
                    $("#nowTips").html("已退款");
                    $(".refundBox").hide();
                }
                else {
                    $(".refundBox").hide();
                }


                switch(orderRes.data.status) {
                    case "5":
                    case "8":
                    case "11":
                    case "12":
                        iconHtml='&#xe610;';//交易完成等
                        break;
                    case "3":
                    case "4":
                        iconHtml='&#xe618;';//待支付等
                        break;
                    default:
                        iconHtml='&#xe60d;';//取消等
                        break;
                }
                $("#iconStatus").html(iconHtml);
                if(iconHtml=='&#xe618;' && again<3){
                    setTimeout(function(){
                        again++;
                        detailInfo();
                    },1500);
                }

                if((objectType=="11" || objectType=="12" || undefined==objectType) && orderRes.data.hotelId){
                   /* var paydescHtml='<div class="clearfix multiLine"><div class="function gray fl">支付方式：</div><div class="quota fr"><span>'+ orderRes.data.paydesc +'</span></div></div>';
                    /!*if($("#orderidDiv").html().indexOf("支付方式")==-1){
                        $("#orderidBox").after(paydescHtml);
                    }*!/
                    if($("#payInfoDiv").html().indexOf("支付方式")==-1){
                        $("#zgJia").after(paydescHtml);
                    }*/
                    $("#productHref .arrowImg").hide();
                    if(orderRes.data.paidTime){
                        var paidTime=newFormatStrDate(new Date(parseInt(orderRes.data.paidTime)),"/");
                        var paisSecode=timeFormatSecond(new Date(parseInt(orderRes.data.paidTime)),":");
                        var paidTimeHtml='<div class="clearfix multiLine"><div class="function gray fl">支付时间：</div><div class="quota fr"><span>'+ paidTime + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + paisSecode +'</span></div></div>';
                        if($("#orderidDiv").html().indexOf("支付时间")==-1){
                            $("#orderidBox").before(paidTimeHtml);
                        }
                    }
                    if(orderRes.data.hotelId){
                        var hoteldata={id:orderRes.data.hotelId};
                        var hotelUrl='/content/h5/hotel/detail';
                        $.post(h5orClient(hotelUrl),{data:JSON.stringify(hoteldata)},function(res) {
                            if(res.sc==0) {
                                $("#address").html(res.data.hotelBaseInfo.address);
                                $("#hotelCname").html(res.data.hotelBaseInfo.hotelCname);
                                $("#hotelCname").parents(".hotelName").click(function () {
                                    window.location.href = "/html/h5/product/detail/bnbShare.html?id=" + hoteldata.id;
                                    return;
                                });
                                var cityLat = res.data.hotelBaseInfo.locLat;
                                var cityLon = res.data.hotelBaseInfo.locLon;
                                var address = res.data.hotelBaseInfo.address;
                                var cityName = res.data.hotelBaseInfo.cityName;
                                $("#navigation").attr("href", "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:" + cityLat + "," + cityLon + ";title:" + cityName + ";addr:" + address + ";&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp");
                                $("#hotelPhone").attr("href", "tel://" + res.data.hotelBaseInfo.phone).html(res.data.hotelBaseInfo.phone);
                            }
                        });
                    }
                }
                else {
                    if(referrer.indexOf("myOrderList")!=-1 || ""==referrer){
                        $("#productHref").attr("href","/html/h5/product/detail/virtualGoods.html?id="+orderRes.data.productid).css("color","#000");
                    }else {
                        $("#productHref").attr("href","javascript:history.go(-1)").css("color","#000");
                    }
                }
            }
            else {
                errorPrompt(chinese(orderRes.ErrorMsg),2000);
            }
        });
    }

    //倒计时
    function countDownFun(num){
        minutes=parseInt(num/60);
        seconds=parseInt(num%60);
        return formatNum(minutes)+":"+formatNum(seconds);
    }
});