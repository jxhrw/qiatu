var orderUrl='/order/h5/info';
var orderData={orderid:GetParams().orderid};
var referrer=document.referrer;//当前页前一页的链接
var paychannel;//支付渠道
var priceType;//0-现金，1-积分支付
var productid;//产品id
var ua = window.navigator.userAgent.toLowerCase();
var objectType;
var cashBalance;//会员账户余额
var jsTime=0;
var once=0;//标记，执行一次
var showCyType;
var cashAmount;//现金支付

$(document).ready(function(){
    $(".popupT").height($(window).height());
    if(sessionStorage.getItem("paymentLeave")==1){
        sessionStorage.setItem("paymentLeave",0);
        window.history.back();
    }
    if(sessionStorage.getItem("paymentLeave")==2){
        var tradeToken=sessionStorage.getItem("tradeToken");
        sessionStorage.setItem("tradeToken","");
        sessionStorage.setItem("paymentLeave",0);
        successPay(GetParams().orderid,tradeToken,"jh");
    }

    $.post(h5orClient(orderUrl),{data:JSON.stringify(orderData)},function(orderRes){
        if(orderRes.sc==0){
            objectType=orderRes.data.objectType;
            cashAmount=0;//现金支付
            var cashCouponDeductible=0;//消费金抵扣
            var roomCouponDeductible=0;//房券抵扣
            var housingDeductible=0;//积分兑房抵扣
            var integralDeductible=0;//积分抵现抵扣
            var discDeductible=0;//折扣券抵扣
            var redPacketDeductible=0;//红包抵扣
            var countDown=parseInt(orderRes.data.countDown?orderRes.data.countDown:0);//倒计时
            var checkin=parseInt(orderRes.data.checkin);
            var checkout=parseInt(orderRes.data.checkout);
            var nights=parseInt((checkout-checkin)/24/3600/1000);
            var payments=orderRes.data.payments;
            showCyType=orderRes.data.showCyType;
            showCyCode=orderRes.data.showCyCode?orderRes.data.showCyCode:"";
            showCyUnit=orderRes.data.showCyUnit?orderRes.data.showCyUnit:"";
            showCyAmount=orderRes.data.showCyAmount?orderRes.data.showCyAmount:0;
            if(showCyType=="0" || showCyType=="5"){
                showCyAmount=orderRes.data.showCyAmount/100;
            }
            var payInfoDivHtml='<div class="clearfix multiLine2"><div class="function gray fl">总价：</div><div class="quota fr">'+ showCyCode + showCyAmount + showCyUnit +'</div></div>';


            if("31"==objectType || "30"==objectType || "40"==objectType){
                $("#virOrderDetail").hide();
                $("#virtualProName,#payInfo,#tipsAndPhone").show();
                $("#virProName").html(orderRes.data.ordername);
                $("#virCustomerName").html(orderRes.data.customerName);
                $("#virCustomerMobile").html(orderRes.data.customerMobile);
                $("#virProNumber").html(orderRes.data.quantity);
                $("#virComments").html(orderRes.data.comments);

                if(undefined!=orderRes.data.customerAddress){
                    var customerAddress=orderRes.data.customerAddress;
                    customerAddress=customerAddress.split(",");
                    $("#virCustomerName").html(customerAddress[0]);
                    $("#virCustomerMobile").html(customerAddress[1]);
                    $("#virProAddress").html(customerAddress[2]);
                }else {
                    $("#virProAddress").parents(".multiLine").hide();
                }
            }
            else if("12"==objectType || undefined==objectType){
                //店内支付
                $("#virOrderDetail,#lookVirOrderDetail").hide();
                $("#virtualProName,#payInfo,#tipsAndPhone").show();
                $("#virProName").html(orderRes.data.hotelCname+orderRes.data.ordername);
            }
            else {
                $("#roomProName,#payInfo,#tipsAndPhone,.bookingTips").show();
                $(".bookingTips").html(orderRes.data.cancelPolicy);
                $("#roomName").html(orderRes.data.ordername);
                $("#checkIn").html(newFormatStrDateNoYear(new Date(checkin),"/"));
                $("#checkOut").html(newFormatStrDateNoYear(new Date(checkout),"/"));
                $("#nights").html(nights);
                $("#customerName").html(orderRes.data.customerName);
                $("#customerMobile").html(orderRes.data.customerMobile);
                $("#comments").html(orderRes.data.comments);
                $("#countDown").html(countDownFun(countDown));
            }

            if(countDown>0){
                var it=setInterval(function(){
                    countDown--;
                    $("#countDown").html(countDownFun(countDown));
                    if(countDown==0){
                        $("#immPay").addClass("no").addClass("noClick");
                        $(".timeIcon,#countDown").hide();
                        clearInterval(it);
                    }
                },1000);
            }else {
                $("#immPay").addClass("no").addClass("noClick");
                $(".timeIcon,#countDown").hide();
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
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">积分：</div><div class="quota fr">'+ '' + payments[i].faceValue + '个' +'</div></div>';
                }
                else if(payments[i].payType==11){ //11房券抵积分
                    var faceValue=payments[i].faceValue;
                    if(undefined==faceValue){
                        faceValue=1;
                    }
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">房券：</div><div class="quota fr">'+ payments[i].couponAlias + faceValue + '张' +'</div></div>';
                }
                else if(payments[i].payType==12){ //12消费金抵积分
                    payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">消费金：</div><div class="quota fr">'+ payments[i].couponAlias + payments[i].faceValue/100 + '元' +'</div></div>';
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
                payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">积分兑房：</div><div class="quota fr">-￥'+ housingDeductible/100 +'</div></div>';
            }
            if(integralDeductible>0){
                payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">积分抵现：</div><div class="quota fr">-￥'+ integralDeductible/100 +'</div></div>';
            }
            if(cashAmount>0){
                $("#shouldPay").html('￥'+ cashAmount/100);
                payInfoDivHtml+='<div class="clearfix multiLine2"><div class="function gray fl">应付：</div><div class="quota paleRed fr">￥'+ cashAmount/100 +'</div></div>';
            }else if(cashAmount==0){
                $("#shouldPay").html('￥'+ cashAmount/100);
            }
            if(undefined!=orderRes.data.payments && orderRes.data.payments.length==1 && orderRes.data.payments[0].payType==6){
                payInfoDivHtml='<div class="clearfix multiLine2"><div class="function gray fl">总价：</div><div class="quota fr">'+ orderRes.data.payments[0].points +'积分</div></div>'
                    +'<div class="clearfix multiLine2"><div class="function gray fl">应付：</div><div class="quota paleRed fr">'+ orderRes.data.payments[0].points +'积分</div></div>';
            }
            $("#payInfoDiv").html(payInfoDivHtml);

            productid={id:orderRes.data.productid};
            var productUrl='/product/h5/query';
            $.post(h5orClient(productUrl),{data:JSON.stringify(productid)},function(proRes){
                if(proRes.sc==0){
                    priceType=proRes.data.productPrice.priceType;
                    var payChannelList=proRes.data.payChannelList;
                    var payChannelUlHtml="";
                    var memberUrl="/member/h5/info";
                    var memberData={};
                    $.post(h5orClient(memberUrl),{data:JSON.stringify(memberData)},function(res){
                        if(res.sc==0){
                            if(cashAmount>0){
                                cashBalance=parseInt(res.data.cashBalance?res.data.cashBalance:0);
                                for(var i=0;undefined!=payChannelList && i<payChannelList.length;i++){
                                    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                                        //iOS app打开
                                        if("alipay"==payChannelList[i]){
                                            payChannelUlHtml+='<li id="alipay"><img class="alipay" src="images/alipay.png" alt="">支付宝支付<span class="choice2 fr"></span></li>';
                                        }
                                        if("wx"==payChannelList[i]){
                                            payChannelUlHtml+='<li id="wx"><img class="wxpay" src="images/wxpay.png" alt="">微信支付<span class="choice2 fr"></span></li>';
                                        }
                                    }
                                    else if (ua.match(/MicroMessenger/i) == "micromessenger") {
                                        //在微信中打开
                                        if("wx_pub2"==payChannelList[i]){
                                            payChannelUlHtml+='<li id="wx_pub2"><img class="wxpay" src="images/wxpay.png" alt="">微信支付<span class="choice2 fr"></span></li>';
                                        }else if("wx_pub"==payChannelList[i]){
                                            payChannelUlHtml+='<li id="wx_pub"><img class="wxpay" src="images/wxpay.png" alt="">微信支付<span class="choice2 fr"></span></li>';
                                        }
                                    }
                                    else {
                                        //在普通浏览器打开
                                        if("alipay_wap"==payChannelList[i]){
                                            payChannelUlHtml+='<li id="alipay_wap"><img class="alipay" src="images/alipay.png" alt="">支付宝支付<span class="choice2 fr"></span></li>';
                                        }
                                    }
                                    if("jh"==payChannelList[i]){
                                        if(cashBalance>=cashAmount){
                                            payChannelUlHtml+='<li id="jh"><img class="jhpay" src="images/jhpay.png" alt="">账户余额支付(<span id="remain">￥'+ cashBalance/100 +'</span>)<span class="choice2 fr"></span></li>';
                                        }else {
                                            payChannelUlHtml+='<li id="jh" class="no" style="color: #999;"><img class="jhpay" src="images/jhpaygrey.png" alt="">账户余额支付(<span id="remain">￥'+ cashBalance/100 +'</span>)<span class="choice2 fr"></span></li>';
                                        }
                                    }
                                    if("mz"==payChannelList[i]){
                                        payChannelUlHtml='';
                                        paychannel="mz";
                                        $("#immPay .payWord").html("米庄支付");
                                        break;
                                    }
                                }
                                if(payChannelUlHtml!=""){
                                    $("#payMethod").show();
                                    $("#payChannelUl").html(payChannelUlHtml);
                                    var $payChannelUlLi=$("#payChannelUl li");
                                    if($payChannelUlLi.length==1){
                                        $payChannelUlLi.find(".choice2").addClass("choosed");
                                        paychannel=$payChannelUlLi.attr("id");
                                    }
                                    $payChannelUlLi.on("touchstart",function(){
                                        if($(".choice2",this).hasClass("choosed")){
                                            $(".choice2",this).removeClass("choosed");
                                            paychannel="";
                                        }
                                        else {
                                            $(".payChannelList li .choice2").removeClass("choosed");
                                            $(".choice2",this).addClass("choosed");
                                            paychannel=$(this).attr("id");
                                        }
                                    });
                                }
                            }
                            else {
                                for(var i=0;undefined!=payChannelList && i<payChannelList.length;i++){
                                    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                                        //iOS app打开
                                        paychannel="wx";
                                    }
                                    else if (ua.match(/MicroMessenger/i) == "micromessenger") {
                                        //在微信中打开
                                        if("wx_pub2"==payChannelList[i]){
                                            paychannel="wx_pub2";
                                        }else if("wx_pub"==payChannelList[i]){
                                            paychannel="wx_pub";
                                        }
                                    }
                                    else {
                                        //在普通浏览器打开
                                        paychannel="alipay_wap";
                                    }
                                }
                                if(undefined!=orderRes.data.payments && orderRes.data.payments.length==1 && (orderRes.data.payments[0].payType==6 ||orderRes.data.payments[0].payType==11 || orderRes.data.payments[0].payType==12)){
                                    paychannel="jf";
                                }
                            }
                        }
                        else {
                            errorPrompt(chinese(res.ErrorMsg),2000);
                        }
                    })
                }
                else {
                    errorPrompt(chinese(proRes.ErrorMsg),2000);
                }
            });
        }
        else {
            errorPrompt(chinese(orderRes.ErrorMsg),2000);
        }
    });

    //立即支付
    $("#immPay").click(function(){
        $("#immPay").addClass("no");
        if(cashAmount>0){
            if(paychannel=="jh"){
                var phoneNum;
                var owner;
                var url3='/user/h5/existtradepasswd';
                var data3={};
                $.post(h5orClient(url3),{data:JSON.stringify(data3)},function(res){
                    if(res.sc==0){
                        phoneNum=res.data.mobileAccount;
                        owner=res.data.realName;
                        //已设置密码
                        if(res.data.existTradePasswd=="1"){
                            $(".popupT,.checkPsword").show();
                            inputFocus("#inputPassword");
                            digitalInputMethod("#inputPassword",".keyboard","6","table","password",".button");
                            if(once==0){
                                setButton(phoneNum,owner);
                                setForget();
                                once++;
                            }
                        }
                        //未设置密码
                        if(res.data.existTradePasswd=="0"){
                            $(".popupT,.setPsword").show();
                            if(once==0){
                                setButton(phoneNum,owner);
                                setForget();
                                once++;
                            }
                        }
                    }
                    else {
                        errorPrompt(chinese(res.ErrorMsg),2000);
                    }
                    $("#immPay").removeClass("no");
                });
            }
            else if(undefined!=paychannel && paychannel!=""){
                successPay(GetParams().orderid,"",paychannel);
            }
            else {
                errorPrompt(chinese("请选择支付方式"),2000);
                $("#immPay").removeClass("no");
            }
        }else {
            successPay(GetParams().orderid,"","");
        }
    });

    //余额支付
    $("#checkBtn").click(function(){
        $("#checkBtn").addClass("no");
        var urlPassword='/user/h5/checktradepasswd';
        var data={'tradepasswd':getPassword("#inputPassword","table","password")};
        $.post(h5orClient(urlPassword),{data:JSON.stringify(data)},function(resul){
            console.log(resul);
            if(resul.sc==0){
                successPay(GetParams().orderid,resul.data.tradeToken,paychannel);
            }else {
                $(".checkTitle p").html("密码错误");
                $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
            }
        });
    });

    //验证码重新发送
    $("#again").click(function(){
        timee();
    });

    $("#checkClose,.backShadow").click(function(){
        $(".popupT,.setPsword,.checkPsword,.textPs").hide();
        $(".checkTitle p").html("&nbsp;");
        $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
    });

    $("#lookVirOrderDetail").click(function(){
        $("#virOrderDetail").show();
    });

    //支付
    function successPay(orderid,tradeToken,paychannel){
        var localHref=window.location.href.split("/html")[0]+"/html/h5/order/orderDetailN.html?orderid="+orderid;
        var data1={"orderid":orderid,"paychannel":paychannel};
        if(paychannel=="jf"){
            delete data1.paychannel;
        }
        var url2='/order/h5/pay';
        if(paychannel=="mz" || paychannel=="alipay_wap"){
            data1.successurl=localHref;
            data1.cancelurl=localHref;
        }
        $.post(h5orClient(url2),{data:JSON.stringify(data1)},function(data){
            if (data.sc == 0) {
                if (null != data.data.payTicketInfo) {
                    if(data.data.payTicketInfo.channel=='jh'){
                        //账户余额支付确认
                        var confirmChargeUrl="/pay/h5/balance/confirmCharge";
                        var confirmChargeData={"chargeId":data.data.payTicketInfo.chargeId,"tradeToken":tradeToken};
                        $.post(h5orClient(confirmChargeUrl),{data:JSON.stringify(confirmChargeData)},function(data){
                            console.log(data);
                            if(referrer.indexOf("Detail")!=-1){
                                sessionStorage.setItem("paymentLeave",1);
                                window.history.go(-1);
                            }else {
                                if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                                    var data2='{"backPage":"2"}';
                                    var url2 = "http://www.jihelife.com?data="+data2;
                                    iosBridgeObjc(url2);
                                }
                                sessionStorage.setItem("paymentLeave",1);
                                window.location.href=localHref;
                            }
                            $("#immPay").removeClass("no");
                        });
                    }
                    else if(data.data.payTicketInfo.channel=='mz'){
                        sessionStorage.setItem("paymentLeave",1);
                        window.location.href=data.data.payTicketInfo.redirectUrl;
                    }
                    else {
                        //微信、支付宝、app支付
                        if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                            if(referrer.indexOf("Detail")!=-1){
                                var data1='{"orderid":"'+orderid+'","paychannel":"'+paychannel+'","act":"toPay","orderUrl":"'+'-1'+'","backPage":"2"}';
                                var url = "http://www.jihelife.com?data="+data1;
                                iosBridgeObjc(url);
                                console.log(url);
                                sessionStorage.setItem("paymentLeave",1);
                                //window.history.go(-1);
                            }else {
                                var appHref=localHref;
                                var data3='{"orderid":"'+orderid+'","paychannel":"'+paychannel+'","act":"toPay","orderUrl":"'+encodeURIComponent(appHref)+'","backPage":"2"}';
                                var url3 = "http://www.jihelife.com?data="+data3;
                                iosBridgeObjc(url3);
                                console.log(url3);
                                sessionStorage.setItem("paymentLeave",1);
                                //window.location=localHref;
                            }
                            $("#immPay").removeClass("no");
                        }
                        else {
                            pingpp.createPayment(data.data.payTicketInfo, function (result, err) {
                                console.log(result);
                                if(result=="cancel"){
                                    $.post('/order/h5/breakpay/'+orderid,function(data){
                                        console.log(data);
                                        if(data.sc==0){
                                            if(referrer.indexOf("Detail")!=-1){
                                                sessionStorage.setItem("paymentLeave",1);
                                                window.history.go(-1);
                                            }else {
                                                sessionStorage.setItem("paymentLeave",1);
                                                window.location.href=localHref;
                                            }
                                        }
                                    })
                                }
                                else if(result=="success"){
                                    if(referrer.indexOf("Detail")!=-1){
                                        sessionStorage.setItem("paymentLeave",1);
                                        window.history.go(-1);
                                    }else {
                                        sessionStorage.setItem("paymentLeave",1);
                                        window.location.href=localHref;
                                    }
                                }
                            });
                            $("#immPay").removeClass("no");
                        }
                    }
                }
                else{
                    if(referrer.indexOf("Detail")!=-1){
                        sessionStorage.setItem("paymentLeave",1);
                        window.history.go(-1);
                    }else {
                        sessionStorage.setItem("paymentLeave",1);
                        window.location.href=localHref;
                    }
                }
            }
            else if(data.sc=="BASE-1002"){
                errorPrompt(chinese(data.ErrorMsg),2000);
                $("#immPay").removeClass("no");
            }
            else{
                errorPrompt(chinese(data.ErrorMsg),2000);
                $("#immPay").removeClass("no");
            }
        });
    }

    //计时显示
    function countTime(countdown){
        $("#countdown").html(countDownFun(countdown));
        if(countdown>0){
            var it=setInterval(function(){
                countdown--;
                $("#countdown").html(countDownFun(countdown));
                if(countdown==0){
                    clearInterval(it);
                    $(".popupTGoBack,#goBackBox").show();
                    $("#immPay").addClass("no").addClass("grey");
                    $("#immPay img,#immPay span").hide();
                }
            },1000);
        }else {
            $(".popupTGoBack,#goBackBox").show();
            $("#immPay").addClass("no").addClass("grey");
            $("#immPay img,#immPay span").hide();
        }
    }

    //提出短信验证框
    function setButton(phone,name){
        $("#setButton,.checkForget").click(function(){
            $("#digital").remove();
            $(".checkPsword").hide();
            $(".popupT,.setPsword").hide();
            timee();
            $("#owner").html(name);
            $("#phoneNum").html(phone.substr(0,3)+"****"+phone.substr(7,4));
            $(".popupT,.textPs").show();
            if($(this).attr("id")=="setButton"){
                goHttp=0;
            }else {
                goHttp=1;
            }
        });
    }

    //设置、忘记密码
    function setForget(){
        $("#sure").click(function(){
            var verifycode=$(".SMSVer input").val();
            var url="/user/h5/checkverifycode";
            var data={verifycode:verifycode};
            $.post(h5orClient(url),{data:JSON.stringify(data)},function(resu){
                console.log(resu);
                var type;//类型，1-设置，2-忘记，3-修改，4-校验
                if(goHttp==0){
                    type=1;
                }else if(goHttp==1){
                    type=2;
                }
                if(resu.sc=="0"){
                    sessionStorage.setItem("paymentLeave",2);
                    window.location.href="/html/h5/member/personinfo/password.html?type="+type+"&verifycode="+verifycode;
                }else {
                    errorPrompt(chinese("验证码错误"),2000);
                }
            });
        });
    }

    //倒计时
    function countDownFun(num){
        minutes=parseInt(num/60);
        seconds=parseInt(num%60);
        return formatNum(minutes)+":"+formatNum(seconds);
    }

    //有输入/待输入的地方有黑色边框
    function inputFocus(id){
        $(id).find("td").css({"border-color":"#9b9b9b"});
        for(var i=0;i<$(id).find("td").length;i++){
            if($(id).find("td").eq(i).html()==""){
                $(id).find("td").eq(i).css({"border-color":"#000"});
                return;
            }else{
                $(id).find("td").eq(i).css({"border-color":"#000"});
            }
        }
    }

    //id输入的位置，class键盘放入的位置,num规定输入的个数，method输入位置的类型-table型是分隔的形式，password数字可见/不可见，class2确认按钮是否可点
    function digitalInputMethod(id,_class,num,method,password,_class2){
        var table='<table id="digital" cellpadding="0" cellspacing="0" width="100%">'
            +'<tr>'
            +'<td>1</td><td>2</td><td>3</td>'
            +'</tr>'
            +'<tr>'
            +'<td>4</td><td>5</td><td>6</td>'
            +'</tr>'
            +'<tr>'
            +'<td>7</td><td>8</td><td>9</td>'
            +'</tr>'
            +'<tr>'
            +'<td style="background-color: #d2d5db;"></td><td>0</td><td id="delete"><em></em></td>'
            +'</tr>'
            +'</table>';
        $(_class).html(table);
        $("#delete").css({"background":"#d2d5db"}).find("em").css({"background":"url(/html/member/images/delete.jpg) no-repeat center/contain","display":"inline-block","width":"1.53rem","height":"1.13rem"});
        $("#digital").css({"text-align":"center","font-size":"1.4rem","table-layout":"fixed"}).find("td").css({"border-right":"1px solid #8c8c8c","border-bottom":"1px solid #8c8c8c","padding":"1rem 0","cursor":"pointer","-moz-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","-khtml-user-select":"none","user-select":"none"});
        $("#digital tr td:last-child").css({"border-right":"0"});
        $("#digital tr:last-child td").css({"border-bottom":"0"});
        $("#digital td").on('touchstart',function(){
            var thisId=$(this).attr("id");
            if("delete"!=thisId){
                inputMethod(this,id,num,method,password,_class2)
            }
            else {
                //删除
                if("table"==method){
                    $(_class2).addClass("no");
                    for(var j=$(id).find("td").length-1;j>=0;j--){
                        if($(id).find("td").eq(j).html()){
                            $(id).find("td").eq(j).html("").removeAttr("value");
                            inputFocus("#inputPassword");
                            return;
                        }
                    }
                }
                else {
                    var html=$(id).html();
                    var valueNum=!$(id).attr("value")?"":$(id).attr("value");
                    if(html.length<=1){
                        $(id).html("").removeAttr("value");
                    }
                    else {
                        html=html.substr(0,html.length-1);
                        valueNum=valueNum.substr(0,valueNum.length-1);
                        $(id).html(html).attr("value",valueNum);
                    }
                }
            }
            inputFocus("#inputPassword");
        });
    }
    function inputMethod(_this,id,num,method,password,_class2){
        var i=$(_this).html();
        var point="<div class='star'>*</div>";
        if(""!=i){
            if("table"==method){
                for(var j=0;j<$(id).find("td").length && j<num;j++){
                    if(!$(id).find("td").eq(j).html()){
                        if("password"==password){
                            $(id).find("td").eq(j).html(point).attr("value",i);
                        }else {
                            $(id).find("td").eq(j).html(i);
                        }
                        if(j==(num-1)){
                            passwordOver(_class2);
                        }
                        return;
                    }
                }
            }
            else {
                var html=$(id).html();
                var valueNum=!$(id).attr("value")?"":$(id).attr("value");
                if(html.length<num || num==undefined){
                    if("password"==password){
                        $(id).html(html+point).attr("value",valueNum+i);
                    }else {
                        $(id).html(html+i);
                    }
                    if((html+i).length==num){
                        passwordOver(_class2);
                    }
                }
            }
        }
    }
    //获得密码，id--id,method--table/div,password--password(类型是不可见)/''(可见)
    function getPassword(id,method,password){
        var pass="";
        if("table"==method){
            if("password"==password){
                $(id).find("td").each(function(){
                    pass+=!$(this).attr("value")?"":$(this).attr("value");
                });
            }else {
                $(id).find("td").each(function(){
                    pass+=$(this).html();
                });
            }
        }else {
            if("password"==password){
                pass=!$(id).attr("value")?"":$(id).attr("value");
            }else {
                pass=$(id).html();
            }
        }
        return pass;
    }

    //输完后自动执行的函数
    function passwordOver(_class2){
        $(_class2).removeClass("no");
    }

    function timee(){
        if(jsTime==0){
            var data={'verifycodetype':2};
            $("#again").addClass("no");
            var url='/user/h5/getverifycode';
            $.post(h5orClient(url),{data:JSON.stringify(data)},function(resu){
                console.log(resu);
            });
            jsTime=60;
            var timeCon=setInterval(function(){
                jsTime--;
                $("#again").html(jsTime+"S");
                if(jsTime==0){
                    $("#again").html("重新发送").removeClass("no");
                    clearInterval(timeCon);
                }
            },1000)
        }
    }


});