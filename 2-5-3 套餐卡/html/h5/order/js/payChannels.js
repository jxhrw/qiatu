$(document).ready(function(){
    var winHeight=$(window).height();
    var couponId=GetParams().couponId;
    var jsTime=0;
    var once=0;
    var tradeToken="";
    var referrer=document.referrer;//当前页前一页的链接
    var ua = window.navigator.userAgent.toLowerCase();
    var paychannel="",paytype="";//支付渠道选择
    var cashBalance;//资产余额
    var cashPrice;//现金价格
    var priceType;
    var backPage_this=sessionStorage.getItem("backPage_payChannels");
    $(".popupT,.popupTGoBack").height(winHeight);

    var goBackUrl=JSON.parse(sessionStorage.getItem("goBackUrl"));
    if(goBackUrl==2 && document.referrer.indexOf("Detail")=="-1"){
        if("-2"==backPage_this){
            backPage_this=-2;
        }else {
            backPage_this=-1;
        }
        sessionStorage.setItem("backPage_payChannels","-1");
        window.history.go(backPage_this);
    }
    goBackUrl=0;
    sessionStorage.setItem("goBackUrl",JSON.stringify(goBackUrl));

    // IOS桥接调用
    function iosBridgeObjc(url) {
        var iframe;
        iframe = document.createElement("iframe");
        iframe.setAttribute("src", url);
        iframe.setAttribute("style", "display:none;");
        document.body.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
    }

    var goHttp;//返回到这页面是否跳转，0不跳转，1跳转
    goHttp=JSON.parse(sessionStorage.getItem("goHttp"));
    if(goHttp==1){
        goHttp=0;
        sessionStorage.setItem("goHttp",JSON.stringify(goHttp));
        var createData=JSON.parse(sessionStorage.getItem("createData"));
        if(undefined!=JSON.parse(sessionStorage.getItem("tradeToken"))){
            paychannel="jh";
            if(typeof (createData)=="object"){
                successBuy(createData,JSON.parse(sessionStorage.getItem("tradeToken")),paychannel);
            }
            if(typeof (createData)=="string"){
                successPay(createData,JSON.parse(sessionStorage.getItem("tradeToken")),paychannel);
            }
        }
    }else {
        goHttp=0;
        sessionStorage.setItem("goHttp",JSON.stringify(goHttp));
    }
    paychannel="";

    //基本信息
    var totPrice;
    var totPointsPrice;
    var referPrice;
    var countdown;//倒计时字段
    var urlProduct="/product/h5/query";
    var dataProduct={"id":GetParams().data};
    $.post(h5orClient(urlProduct),{data:JSON.stringify(dataProduct)},function(resu){
        console.log(resu);
        if(resu.sc==0){
            priceType=resu.data.productPrice.priceType;
            referPrice=resu.data.referPrice;
            var payChannelList=resu.data.payChannelList;
            var totalPrice=floatFixed2(resu.data.productPrice.totalPrice/100);
            var totalPointPrice=resu.data.productPrice.totalPointPrice;
            cashPrice=totalPrice;
            totPrice=resu.data.productPrice.totalPrice;
            totPointsPrice=totalPointPrice;
            $(".productName").html(resu.data.productName);
            $("#quota").html(referPrice);
            $("#discount").html(Math.ceil(totalPrice/referPrice*100)+"%");
            $("#subRatio").html("1："+Math.ceil(totalPointPrice/referPrice*10)/10);
            $("#payMoney").html("￥"+totalPrice);


            if(priceType==0){//0-现金 1-积分
                $("#subRatio").parents("li").hide();
                $("#payMoney2").html("￥"+totalPrice);
                for(var i=0;undefined!=payChannelList && i<payChannelList.length;i++){
                    var ua = window.navigator.userAgent.toLowerCase();
                    if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                        if(payChannelList[i]=="alipay"){
                            $(".payChannel,#alipay").show().click();
                        }
                        if(payChannelList[i]=="wx"){
                            $(".payChannel,#wx").show();
                        }
                    }
                    else {
                        if(payChannelList[i]=="wx_pub"){
                            $(".payChannel,#wx_pub").show().click();
                        }
                    }
                    if(payChannelList[i]=="jh"){
                        var data={};
                        var remainUrl='/pay/h5/balance/info';
                        //$(".payChannel,#jh").show();
                        $.post(h5orClient(remainUrl),{data:JSON.stringify(data)},function(res){
                            if(res.sc==0){
                                cashBalance=floatFixed2(res.data.cashBalance/100);
                                $("#remain").html("￥"+cashBalance);
                            }
                        });
                    }
                }
            }
            if(priceType==1){//0-现金 1-积分
                $("#discount").parents("li").hide();
                $("#payMoney2").html(totalPointPrice+"积分");
                $(".payChannel,#jf").hide().click();
            }

            if(undefined==GetParams().orderid && undefined!=GetParams().buyingId){
                setTimeout(function(){
                    pushHistory();
                    window.addEventListener("popstate", function(e) {
                        var cancelUrl='/trade/h5/buying/cancel';
                        var data={"buyingId":GetParams().buyingId};
                        $.post(h5orClient(cancelUrl),{data:JSON.stringify(data)},function(resu){
                            console.log(resu);
                            if(resu.sc==0){

                            }
                            window.history.go(-1);//alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
                        })
                    }, false);
                    function pushHistory() {
                        var state = {
                            title: "",
                            url: ""
                        };
                        sessionStorage.setItem("backPage_payChannels","-2");
                        window.history.pushState(state, "", "");
                    }
                },2000);
            }

            if(undefined!=GetParams().orderid){
                var infoUrl='/order/h5/info';
                var dataOrderid={"orderid":GetParams().orderid};
                $.post(h5orClient(infoUrl),{data:JSON.stringify(dataOrderid)},function(result) {
                    console.log(result);
                    if (result.sc == 0) {
                        countdown=parseInt(result.data.countDown);
                        countTime(countdown);
                    }
                });
            }else {
                countdown=parseInt(resu.data.countdown);
                countTime(countdown);
            }
        }
        else {
            //alert(resu.ErrorMsg);
            $("#prompt").html(resu.ErrorMsg).show();
            setTimeout(function(){
                $("#prompt").html("").hide();
            },2000);
        }
    });


    $(".payChannel li").click(function(){
        if($(this).attr("id")=="jh"){
            if(cashPrice>cashBalance){
                $("#prompt").html("您的余额不足").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
                return;
            }
        }
        if($("i",this).hasClass("current")){
            $("i",this).removeClass("current").html("&#xe62c");
            paychannel="";
        }
        else {
            $(".payChannel li i").removeClass("current").html("&#xe62c");
            $("i",this).addClass("current").html("&#xe619;");
            paychannel=$(this).attr("id");
        }
        if($(this).attr("id")=="jh"){
            paytype="0";
        }else {
            paytype="0";
        }
    });


    //创建订单，支付
    var dataAll;//创建订单接口需要的data
    $(".footerRight").click(function(){
        $(".footerRight").addClass("no");
        var payments;
        if(priceType==0){
            payments=[{"amount":totPrice,"paytype":paytype}];
            dataAll = {'productid':GetParams().data,'amount': totPrice,'payments':payments};
        }
        if(priceType==1){
            payments=[{"paytype":6,"points":totPointsPrice}];
            dataAll = {'productid':GetParams().data,'amount': totPrice,'pointamount': totPointsPrice,'payments':payments};
        }
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
                        setButton(phoneNum,owner);
                        setForget();
                    }
                    //未设置密码
                    if(res.data.existTradePasswd=="0"){
                        $(".popupT,.setPsword").show();
                        if(once==0){
                            setButton(phoneNum,owner);
                            $("#again").click(function(){
                                timee();
                            });
                            setForget();
                            once++;
                        }
                    }
                }
                else {
                    //alert(res.ErrorMsg);
                    $("#prompt").html(res.ErrorMsg).show();
                    setTimeout(function(){
                        $("#prompt").html("").hide();
                    },2000);
                }
                $(".footerRight").removeClass("no");
            });
        }else {
            if(window.location.href.indexOf("orderid")!=-1){
                successPay(GetParams().orderid,tradeToken,paychannel);
            }else {
                successBuy(dataAll,tradeToken,paychannel);
            }
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
                if(window.location.href.indexOf("orderid")!=-1){
                    successPay(GetParams().orderid,resul.data.tradeToken,paychannel)
                }else {
                    successBuy(dataAll,resul.data.tradeToken,paychannel);
                }
            }else {
                $(".checkTitle p").html("密码错误");
                $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
            }
        });
    });



    //关闭弹窗
    $(".backShadow,#checkClose").click(function(){
        $(".checkTitle p").html("&nbsp;");
        $(".popupT,.checkPsword,.textPs,.setPsword").hide();
        $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
    });
    //回到前一页
    $(".backShadowGoBack,#goBack").click(function(){
        window.history.go(-1);
    });

    //创建订单
    function successBuy(data,tradeToken,paychannel){
        var url='/order/h5/createandsubmit';
        if($(".payChannel li i").hasClass("current")){//已选择支付方式
            $.post(h5orClient(url), {data: JSON.stringify(data)},  function(res) {
                console.log(res);
                if(res.sc==0){
                    var orderid=res.data.orderid;
                    successPay(orderid,tradeToken,paychannel);
                }
                else if(res.sc=="BASE-1002"){
                    $("#prompt").html("请稍后再试").show();
                    setTimeout(function(){
                        $("#prompt").html("").hide();
                    },2000);
                }
                else{
                    //alert(data.ErrorMsg)
                    $("#prompt").html(res.ErrorMsg).show();
                    setTimeout(function(){
                        $("#prompt").html("").hide();
                    },2000);
                }
                $(".footerRight").removeClass("no");
            });
        }
        else {
            $("#prompt").html("请选择支付方式").show();
            setTimeout(function(){
                $("#prompt").html("").hide();
            },2000);
            $(".footerRight").removeClass("no");
        }
    }

    //支付
    function successPay(orderid,tradeToken,paychannel){
        var localHref;
        var data1={"orderid":orderid,"paychannel":paychannel};
        var url2='/order/h5/pay';
        if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
            localHref="dealDetail.html?app=jiheios&orderid="+orderid;
        }
        else {
            localHref="dealDetail.html?orderid="+orderid;
        }

        $.post(h5orClient(url2),{data:JSON.stringify(data1)},function(data){
            if (data.sc == 0) {
                if (null != data.data.payTicketInfo) {
                    // alert("aa")
                    console.log(data.data.payTicketInfo);
                    if(data.data.payTicketInfo.channel=='jh'){
                        //账户余额支付确认
                        var confirmChargeUrl="/pay/h5/balance/confirmCharge";
                        var confirmChargeData={"chargeId":data.data.payTicketInfo.chargeId,"tradeToken":tradeToken};
                        $.post(h5orClient(confirmChargeUrl),{data:JSON.stringify(confirmChargeData)},function(data){
                            console.log(data);
                            if(referrer.indexOf("Detail")!=-1){
                                window.history.go(-1);
                            }else {
                                if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                                    var data2='{"backPage":"2"}';
                                    var url2 = "http://www.jihelife.com?data="+data2;
                                    iosBridgeObjc(url2);
                                }
                                window.location.href=localHref;
                            }
                            $(".footerRight").removeClass("no");
                        });
                    }
                    else {
                        //微信支付宝支付
                        if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                            if(referrer.indexOf("Detail")!=-1){
                                var data1='{"orderid":"'+orderid+'","paychannel":"'+paychannel+'","act":"toPay","orderUrl":"'+'-1'+'","backPage":"2"}';
                                var url = "http://www.jihelife.com?data="+data1;
                                iosBridgeObjc(url);
                                console.log(url);
                                //window.history.go(-1);
                            }else {
                                var appHref="http://"+window.location.host+localHref;
                                var data3='{"orderid":"'+orderid+'","paychannel":"'+paychannel+'","act":"toPay","orderUrl":"'+encodeURIComponent(appHref)+'","backPage":"2"}';
                                var url3 = "http://www.jihelife.com?data="+data3;
                                iosBridgeObjc(url3);
                                console.log(url3);
                                //window.location=localHref;
                            }
                            $(".footerRight").removeClass("no");
                        }
                        else {
                            pingpp.createPayment(data.data.payTicketInfo, function (result, err) {
                                console.log(result);
                                if(result=="cancel"){
                                    //var url3=
                                    $.post('/order/h5/breakpay/'+orderid,function(data){
                                        console.log(data);
                                        if(data.sc==0){
                                            if(referrer.indexOf("Detail")!=-1){
                                                window.history.go(-1);
                                            }else {
                                                window.location.href=localHref;
                                            }
                                        }
                                    })
                                }
                                else if(result=="success"){
                                    if(referrer.indexOf("Detail")!=-1){
                                        window.history.go(-1);
                                    }else {
                                        window.location.href=localHref;
                                    }
                                }
                            });
                            $(".footerRight").removeClass("no");
                        }
                    }
                }
                else{
                    if(referrer.indexOf("Detail")!=-1){
                        window.history.go(-1);
                    }else {
                        window.location.href=localHref;
                    }
                }
            }
            else if(data.sc=="BASE-1002"){
                $("#prompt").html("请选择支付方式").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
                $(".footerRight").removeClass("no");
            }
            else{
                //alert(data.ErrorMsg)
                $("#prompt").html(data.ErrorMsg).show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
                $(".footerRight").removeClass("no");
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
                    $(".footerRight").addClass("no").addClass("grey");
                    $(".footerRight img,.footerRight span").hide();
                }
            },1000);
        }else {
            $(".popupTGoBack,#goBackBox").show();
            $(".footerRight").addClass("no").addClass("grey");
            $(".footerRight img,.footerRight span").hide();
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
                    if(referrer.indexOf("Detail")!=-1){
                        sessionStorage.setItem("createData",JSON.stringify(GetParams().orderid));
                    }else {
                        sessionStorage.setItem("createData",JSON.stringify(dataAll));
                    }
                    sessionStorage.setItem("goHttp",JSON.stringify(goHttp));
                    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                        window.location.href="../member/personinfo/password.html?type="+type+"&verifycode="+verifycode;//这是微信浏览器
                    }else{
                        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
                            window.location.href="../member/personinfo/password.html?type="+type+"&verifycode="+verifycode;//这是iOS平台下浏览器
                            if(/jihe/i.test(navigator.userAgent)){
                                window.location.href="../member/personinfo/password.html?app=jiheios&type="+type+"&verifycode="+verifycode;//这是iOS平台下app
                            }
                        }
                        if(/android/i.test(navigator.userAgent)){
                            window.location.href="../member/personinfo/password.html?type="+type+"&verifycode="+verifycode;//这是Android平台下浏览器
                        }
                    }
                }else {
                    $("#prompt").html("验证码错误").show();
                    setTimeout(function(){
                        $("#prompt").hide();
                    },2000);
                }
            });
        });
    }



    //倒计时
    function countDownFun(num){
        //var hours=parseInt(num/3600);
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