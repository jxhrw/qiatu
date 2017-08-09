$(document).ready(function(){
    var once=0;
    var jsTime=0;
    var winHeight=$(window).height();
    var existTradePasswd;//是否设置密码，1-设置，0-未设置
    var currencyType;//定价类型，0现金，1积分
    var subRatio=11;//积分兑换现金比例，1:0.11
    var subRatio2=12;//市场参考价兑换比例，1:0.12
    $(".popupT").height(winHeight);

    var goHttp;//返回到这页面是否跳转，0不跳转，1跳转
    goHttp=JSON.parse(sessionStorage.getItem("goHttp"));
    if(goHttp==1){
        goHttp=0;
        sessionStorage.setItem("goHttp",JSON.stringify(goHttp));
        var saleInfo=JSON.parse(sessionStorage.getItem("saleInfo"));
        if(undefined!=sessionStorage.getItem("tradeToken") && ""!=sessionStorage.getItem("tradeToken")){
            saleInfo.tradeToken=sessionStorage.getItem("tradeToken");
            successSale(saleInfo);
        }
    }else {
        goHttp=0;
        sessionStorage.setItem("goHttp",JSON.stringify(goHttp));
    }


    var saleDay="30";  //挂单时间 全局变量，默认30天
    var couponId;  //券id类型，用于查询同样在出售的券的信息，全局变量

    var feesProportion; //服务费收取比例，全局变量
    saleConsume();

    //全部出售
    $(".saleAll").click(function(){
        var a=$("#canSale").html();
        $("#saleMoney").val(a);
        calculatedPrice();
    });

    //折扣 加
    $(".add").on('touchstart',function(){
        $("#saleMoney,#numDiscount").blur();
        changeDiscount("add");
        calculatedPrice();
    });

    //折扣 减
    $(".reduce").on('touchstart',function(){
        $("#saleMoney,#numDiscount").blur();
        changeDiscount("reduce");
        calculatedPrice();
    });

    //折扣 输入改变
    var numDis;
    var oldDiscount;
    $("#numDiscount").focus(function(){
        numDis=$("#numDiscount").val();
    }).keyup(function(){
        var $numDiscount=$("#numDiscount");
        if(currencyType==0){
            positiveInteger($numDiscount,oldDiscount,1,100);
        }else if(currencyType==1){
            positiveIntegerFloat($numDiscount,oldDiscount,1,9,"单价不能高于9积分");
        }
        oldDiscount=$numDiscount.val();
    }).blur(function(){
        var numDiscount=$("#numDiscount");
        var num=numDiscount.val();
        if(!isNaN(num)){
            if(currencyType==0){
                if(num<=1){
                    num=1;
                }else if(num>=100){
                    num=100;
                }
                if(num==1){
                    $(".add").css("color","#d13f4c");
                    $(".reduce").css("color","#b3b3b3");
                }
                else if(num==100){
                    $(".add").css("color","#b3b3b3");
                    $(".reduce").css("color","#d13f4c");
                }
                else {
                    $(".add,.reduce").css("color","#d13f4c");
                }
                num=(num/1).toFixed(0);
            }else if(currencyType==1){
                if(num<=1){
                    num=1;
                }else if(num>=9){
                    num=9;
                }
                if(num==1){
                    $(".add").css("color","#d13f4c");
                    $(".reduce").css("color","#b3b3b3");
                }
                else if(num==9){
                    $(".add").css("color","#b3b3b3");
                    $(".reduce").css("color","#d13f4c");
                }
                else {
                    $(".add,.reduce").css("color","#d13f4c");
                }
                num=(num/1).toFixed(1);
            }
            numDiscount.val(num);
        }
        else {
            numDiscount.val(numDis);
        }
        calculatedPrice();
    });

    //输入可售金额
    var oldNum;
    $("#saleMoney").val("");
    $("#saleMoney").keyup(function(){
        var $saleMoney=$("#saleMoney");
        var canSale=$("#canSale").html();
        positiveInteger($saleMoney,oldNum,0,canSale,"您没有那么多消费金");
        oldNum=$saleMoney.val();
    });


    //对于ios input focus时 fixed 失效问题
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        //这是微信浏览器
    }else{*/
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            //这是iOS平台下浏览器
            var multiple=5.9;
            if(/jihe/i.test(navigator.userAgent)){
                //这是iOS平台下浏览器
                //multiple=7.2;
                multiple=5.9;
            }
            $('input').focus(function () {
                var _this = $(".footer");
                var docHeight=$(document).height();
                var footHei=_this.height();
                setTimeout(function(){
                    var winTop=$(window).scrollTop();
                    startScrollY=winTop+docHeight-260-footHei;
                    $(".footer").css({'position': 'absolute','top':startScrollY, 'bottom': ''});
                    $(window).bind('scroll', function () {
                        //setTimeout(function(){
                        var winTop=$(window).scrollTop();
                        startScrollY=winTop+docHeight-260-footHei;
                        $(".footer").css({'position': 'absolute','top':startScrollY, 'bottom': ''});
                        //},1000);
                    });
                },50);
            }).blur(function () {//输入框失焦后还原初始状态
                $(".footer").css({'position': 'fixed','top':'inherit', 'bottom': '0'});
                $(window).unbind('scroll');
            });
        }
    //}


    //关闭弹窗
    $(".backShadow,.popupTClose").click(function(){
        $(".backShadow").css("z-index","0");
        $("#digital").remove();
        $(".checkTitle p").html("&nbsp;");
        $(".SMSVer input").val("");
        $(".popupT,#saleLong,#confirmationAmount,.setPsword,.checkPsword,.textPs").hide();
        $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
    });

    //挂单时长选择
    $(".stickTime").click(function(){
        $(".popupT,#saleLong").show();
    });
    $(".saleHowLong li").click(function(){
        var $id=$(this).attr("id");
        var $html=$(this).html();
        saleDay=$id;
        $("#saleStatus").html($html);
        $(".popupT,#saleLong").hide();
    });

    //发布出售确认，先验证是否有密码
    var phoneNum;
    var owner;
    $(".footRight").click(function(){
        var url='/user/h5/existtradepasswd';
        var data={};
        $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
            if(res.sc==0){
                phoneNum=res.data.mobileAccount;
                owner=res.data.realName;
                existTradePasswd=res.data.existTradePasswd;
                //已设置密码
                if(res.data.existTradePasswd=="1"){
                    var shouldPrice=$("#shouldPrice").html();
                    var saleMoney=$("#saleMoney").val();
                    if(undefined==saleMoney || 0==saleMoney){
                        $("#prompt").html("请输入转让额度").show();
                        setTimeout(function(){
                            $("#prompt").hide();
                        },2000);
                        return;
                    }
                    $("#goldName").html($(".nameCons").html());
                    //$("#goldStatus").html("出售");
                    $("#goldSale").html(saleMoney);
                    if(currencyType==0){
                        $("#goldDiscount").html($("#numDiscount").val() + "%");
                        $("#goldPrice").html("￥"+shouldPrice);
                        $("#goldFees").html("￥"+floatFixed2(shouldPrice*feesProportion/100));
                    }
                    if(currencyType==1){
                        $("#kind").html("转让单价");
                        $("#goldDiscount").html($("#numDiscount").val()+"积分");
                        $("#goldPrice").html(shouldPrice+"积分");
                        $("#goldFees").html(Math.ceil(shouldPrice*feesProportion/100)+"积分");
                    }
                    $(".popupT,#confirmationAmount").show();

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
                $("#prompt").html("请稍后再试").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
            }
        });
    });

    $("#checkClose").click(function(){
        $(".checkTitle p").html("&nbsp;");
        $(".checkPsword").hide();
        $(".backShadow").css("z-index","0");
        $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
    });

    $(".confirmSure").click(function(){
        $(".popupT,.checkPsword").show();
        $(".backShadow").css("z-index","1");
        inputFocus("#inputPassword");
        digitalInputMethod("#inputPassword",".keyboard","6","table","password",".button");
        setButton(phoneNum,owner);
        setForget();
    });

    $("#checkBtn").click(function(){
        $(this).addClass("no");
        var urlPassword='/user/h5/checktradepasswd';
        var data={'tradepasswd':getPassword("#inputPassword","table","password")};
        $.post(h5orClient(urlPassword),{data:JSON.stringify(data)},function(resul){
            console.log(resul);
            if(resul.sc==0){
                var data={"tradetoken":resul.data.tradeToken,"couponcode":GetParams().couponcode,"amount":Math.round($("#saleMoney").val()*100),"discount":$("#numDiscount").val(),"expiredtime":saleDay};
                if(currencyType==1){
                    data={"tradetoken":resul.data.tradeToken,"couponcode":GetParams().couponcode,"amount":Math.round($("#saleMoney").val()*100),"exchangeRate":Math.round($("#numDiscount").val()*10),"expiredtime":saleDay};
                }
                console.log(data);
                successSale(data);
            }else {
                $(".checkTitle p").html("密码错误");
                $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
                /*$("#prompt").html("密码错误").show();
                 setTimeout(function(){
                 $("#prompt").hide();
                 },2000);*/
            }
            $(this).removeClass("no");
        });
    });


    //以下是封装的方法

    //发布调用上传数据
    function successSale(data){
        var url='/trade/h5/selling/add';
        $.post(h5orClient(url),{data:JSON.stringify(data)},function(resu){
            console.log(resu);
            if(resu.sc==0){
                $(".popupT,#confirmationAmount").hide();
                var ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                    window.location.href="release.html?app=jiheios&sellingid="+resu.data;
                }
                else {
                    window.location.href="release.html?sellingid="+resu.data;
                }
            }
            else if(resu.sc=="BASE-1002"){
                $("#prompt").html("信息不齐全").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
            }
            else {
                //alert(resu.ErrorMsg);
                $("#prompt").html("请稍后再试").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
            }
        });
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
                    var saleInfo={"couponcode":GetParams().couponcode,"amount":Math.round($("#saleMoney").val()*100),"discount":$("#numDiscount").val(),"expiredtime":saleDay};
                    if(currencyType==1){
                        saleInfo={"couponcode":GetParams().couponcode,"amount":Math.round($("#saleMoney").val()*100),"exchangeRate":Math.round($("#numDiscount").val()*10),"expiredtime":saleDay};
                    }
                    sessionStorage.setItem("saleInfo",JSON.stringify(saleInfo));
                    sessionStorage.setItem("goHttp",JSON.stringify(goHttp));
                    var isHavePasswd={"existTradePasswd":existTradePasswd,"money":$("#saleMoney").val(),"discount":$("#numDiscount").val(),"priceType":currencyType};
                    sessionStorage.setItem("isHavePasswd",JSON.stringify(isHavePasswd));
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

    //折扣加减
    function changeDiscount(change){
        var numDiscount=$("#numDiscount");
        var a=numDiscount.val()/1;
        if(change=="add"){
            if(currencyType==1){
                if(a<9){
                    a+=0.1;
                    if(a==9){
                        $(".add").css("color","#b3b3b3");
                    }else {
                        $(".add").css("color","#d13f4c");
                    }
                    $(".reduce").css("color","#d13f4c");
                }
                else {
                    if(!isNaN(a)){
                        a=9;
                        $("#prompt").html("单价不能高于9积分").css("width","13rem").show();
                        setTimeout(function(){
                            $("#prompt").html("").css("width","10rem").hide();
                        },2000);
                    }else {
                        a=numDis;
                    }
                }
                numDiscount.val(parseFloat(a).toFixed(1));
            }
            else {
                if(a<100){
                    a++;
                    if(a==100){
                        $(".add").css("color","#b3b3b3");
                    }else {
                        $(".add").css("color","#d13f4c");
                    }
                    $(".reduce").css("color","#d13f4c");
                }
                numDiscount.val(a);
            }
        }
        if(change=="reduce"){
            if(currencyType==1){
                if(a>1){
                    a-=0.1;
                    if(a==1){
                        $(".reduce").css("color","#b3b3b3");
                    }else {
                        $(".reduce").css("color","#d13f4c");
                    }
                    $(".add").css("color","#d13f4c");
                }else {
                    if(!isNaN(a)){
                        a=1;
                        $("#prompt").html("单价不能低于1积分").css("width","13rem").show();
                        setTimeout(function(){
                            $("#prompt").html("").css("width","10rem").hide();
                        },2000);
                    }else {
                        a=numDis;
                    }
                }
                numDiscount.val(a.toFixed(1));
            }
            else {
                if(a>1){
                    a--;
                    if(a==1){
                        $(".reduce").css("color","#b3b3b3");
                    }else {
                        $(".reduce").css("color","#d13f4c");
                    }
                    $(".add").css("color","#d13f4c");
                }
                numDiscount.val(a);
            }
        }
    }

    //显示总价
    function calculatedPrice(){
        /*var numDiscount=$("#numDiscount");
        var saleMoney=$("#saleMoney");*/
        var numDisc,saleMon;
        numDisc=$("#numDiscount").val()*1;
        saleMon=$("#saleMoney").val()*1;
        if(isNaN(numDisc)){
            numDisc=0;
        }
        if(currencyType==0){
            $("#shouldPrice").html((numDisc*saleMon/100).toFixed(2));
        }else if(currencyType==1){
            $("#shouldPrice").html(Math.floor(numDisc*(saleMon).toFixed(1)));
            if((numDisc*(saleMon).toFixed(1)).toFixed(0)>0){
                $("#canKao").remove();
                $(".price").css({"position":"relative","top":"-0.3rem"});
                var priceHtml=$(".price").html();
                var ckPrice=Math.ceil(numDisc*(saleMon).toFixed(1))*subRatio2/100;
                if(ckPrice<1){
                    ckPrice=ckPrice.toFixed(1);
                }else {
                    ckPrice=ckPrice.toFixed(0);
                }
                priceHtml+='<span id="canKao" style="position: absolute;width: 9rem;line-height: 1rem;top: 1.2rem;left: 0;color: #d13f4c;font-size: 0.6rem;">市场参考价：￥'+ckPrice+'</span>';
                $(".price").html(priceHtml);
            }else {
                $("#canKao").remove();
                $(".price").css({"position":"relative","top":"0"});
            }
        }
    }

    //输入正整数
    function positiveInteger($dom,old,min,max,reminder){
        var saleMoney=$dom.val();
        var now=saleMoney.replace(/[^0-9]/g,'');
        if(now==""){
            if(undefined==old || old.length<=1){
                old="";
            }
            if(saleMoney==""){
                old="";
            }
            $dom.val(old);
        }else {
            if(parseInt(now)>max){
                now=max;
                $("#prompt").html(reminder).css("width","13rem").show();
                setTimeout(function(){
                    $("#prompt").css("width","10rem").hide();
                },2000);
            }
            if(parseInt(now)<min){
                now=min;
            }
            $dom.val(now);
        }
        calculatedPrice();
    }

    //输入正整数变小数
    function positiveIntegerFloat($dom,old,min,max,reminder){
        var saleMoney=$dom.val();
        if(saleMoney>10 && saleMoney<=Math.round(max*10)){
            if((saleMoney/10)>=9){
                $dom.val((9).toFixed(1));
            }else {
                $dom.val((saleMoney/10).toFixed(1));
            }
        }
        else if(saleMoney>Math.round(max*10) || (saleMoney>9 && saleMoney<10)){
            $("#prompt").html(reminder).css("width","13rem").show();
            setTimeout(function(){
                $("#prompt").css("width","10rem").hide();
            },2000);
            $dom.val((9).toFixed(1));
        }
        calculatedPrice();
    }


    //获取基本信息
    function saleConsume(){
        var url='/trade/h5/selling/coupondetail';
        var data={"couponcode":GetParams().couponcode};
        $.post(h5orClient(url),{data: JSON.stringify(data)},function(res){
            console.log(res);
            if(res.sc=="0"){
                currencyType=res.data.couponInfo.couponBaseInfo.priceType;
                var recentDiscount=res.data.discount;
                var dealDiscount=res.data.dealDiscount;
                var dealPointsPrice=res.data.dealPointsPrice;
                couponId=res.data.couponInfo.couponBaseInfo.couponId;
                feesProportion=res.data.commission*1;
                $(".nameCons").html(res.data.couponInfo.couponBaseInfo.couponName);
                $("#deadLine").html(newFormatStrDate(new Date(parseInt(res.data.couponInfo.couponBaseInfo.expireTime)),"/"));
                $("#canSale").html(parseInt(res.data.couponInfo.remain/100));
                $("#feesProportion").html(feesProportion + "%");

                //最近成交折扣
                $("#numDiscount").val("70");
                if(currencyType==1){
                    $("#numDiscount").val("6.5");
                }
                /*if(undefined==recentDiscount || "-1"==recentDiscount){
                    $(".canSale p").hide();
                    $("#numDiscount").val("70");
                    if(currencyType==1){
                        $("#numDiscount").val("6.5");
                    }
                }else {
                    $("#recentDiscount").html(recentDiscount + "%");
                    var recentDiscount2=70;
                    $("#numDiscount").val(recentDiscount2);//可调节的折扣
                    if(currencyType==1){
                        /!*$("#numDiscount").val(((recentDiscount2/subRatio)<9?(recentDiscount2/subRatio):9).toFixed(1));*!/
                        $("#numDiscount").val("6.5");
                    }
                }*/

                if(currencyType==1){
                    if(undefined==dealPointsPrice || "-1"==dealPointsPrice){
                        $(".discountHtmlBox").hide();
                    }else {
                        $("#recentDiscount").html(dealPointsPrice/10+"积分");
                    }
                    $("#discountHtml").html("最近成交单价：");
                    $("#currencyType").html("转让单价：");
                    $("#symbol").html("积分");
                    $(".canSale p,#yuan").hide();
                    //$(".jfA,#jf").show();
                    $("#jf").show();
                    $(".selling th:nth-child(1)").css({"width": "2rem"});
                    $(".selling th:nth-child(3)").css({"width": "9rem"});
                    $(".selling tr th").eq(2).html("转让单价(积分)");
                    $(".selling tr th").eq(3).html("售价(积分)");
                }else {
                    if(undefined==dealDiscount || "-1"==dealDiscount){
                        $(".discountHtmlBox").hide();
                    }else {
                        $("#recentDiscount").html(dealDiscount+"%");
                    }
                }

                salesDetails(couponId);

                setInterval(function(){
                    salesDetails(couponId);
                },8000);

                if(undefined!=JSON.parse(sessionStorage.getItem("isHavePasswd"))){
                    var isIt=JSON.parse(sessionStorage.getItem("isHavePasswd"));
                    if(isIt.existTradePasswd==0 && ( undefined!=JSON.parse(sessionStorage.getItem("tradeToken"))&& ""!=JSON.parse(sessionStorage.getItem("tradeToken")) ) ){
                        $("#saleMoney").val(isIt.money);
                        $("#numDiscount").val(isIt.discount);
                        var shouldPrice=floatFixed2(isIt.money*isIt.discount/100);
                        $("#shouldPrice").html(shouldPrice);
                        var saleMoney=$("#saleMoney").val();
                        if(undefined==saleMoney || 0==saleMoney){
                            $("#prompt").html("请输入转让额度").show();
                            setTimeout(function(){
                                $("#prompt").hide();
                            },2000);
                            return;
                        }
                        $("#goldName").html($(".nameCons").html());
                        //$("#goldStatus").html("出售");
                        $("#goldSale").html(saleMoney);

                        if(currencyType==0){
                            $("#goldDiscount").html($("#numDiscount").val() + "%");
                            $("#goldPrice").html("￥"+shouldPrice);
                            $("#goldFees").html("￥"+floatFixed2(shouldPrice*feesProportion/100));
                        }
                        if(currencyType==1){
                            $("#kind").html("转让单价");
                            $("#goldDiscount").html($("#numDiscount").val()+"积分");
                            $("#goldPrice").html(Math.ceil(shouldPrice*100)+"积分");
                            $("#goldFees").html(Math.ceil(shouldPrice*feesProportion)+"积分");
                        }
                        $(".popupT,#confirmationAmount").show();
                    }
                }
                sessionStorage.setItem("tradeToken",JSON.stringify(""));
            }
            else {
                //alert(res.ErrorMsg);
                $("#prompt").html("请稍后再试").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
            }
        });
    }

    //出售消费金的详情
    function salesDetails(couponId){
        var url='/trade/h5/selling/onsale';
        var data={"couponid":couponId,"type":"0","priceType":currencyType};//type0卖 1买,priceType定价类型
        $.post(h5orClient(url),{data: JSON.stringify(data)},function(ress){
            //console.log(ress);
            if(ress.sc=="0"){
                var $table='';
                if(ress.data.length<=0){
                    $table+='<tr><td colspan="4" style="border-bottom: none;">暂无卖单</td></tr>';
                }else {
                    for(var i=0;undefined!=ress.data && i<ress.data.length;i++){
                        if(ress.data[i].priceType==0){
                            $table+='<tr><td>' + (i+1) + '</td><td>' + ress.data[i].availableAmount/100 + '</td><td>' + ress.data[i].discount + '%</td><td>' + ress.data[i].price/100 + '</td></tr>';
                        }
                        else if(ress.data[i].priceType==1){
                            $table+='<tr><td>' + (i+1) + '</td><td>' + ress.data[i].availableAmount/100 + '</td><td>' + (ress.data[i].exchangeRate/10).toFixed(1) + '</td><td>' + ress.data[i].pointsPrice + '</td></tr>';
                        }
                    }
                }
                $("#selling").html($table);
            }
            else {
                //alert(ress.ErrorMsg);
                $("#prompt").html("请稍后再试").show();
                setTimeout(function(){
                    $("#prompt").html("").hide();
                },2000);
            }
        });
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

});