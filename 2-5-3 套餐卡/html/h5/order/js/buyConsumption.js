$(document).ready(function(){
    var winHeight=$(window).height();
    var couponId=GetParams().couponId;
    var exchangeUrl;//点使用酒店用立即使用的链接
    var priceType; //定价类型，0现金，1积分
    var payMethod=GetParams().payMethod;//支付方式，cash现金 point积分
    var buyingId;
    $(".popupT").height(winHeight);

    var goBackUrl=0;
    sessionStorage.setItem("goBackUrl",JSON.stringify(goBackUrl));

    var isGoBack=JSON.parse(sessionStorage.getItem("isGoBack"));//回来的时候刷新，针对ios不定刷新问题
    if(isGoBack==1 && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
        sessionStorage.setItem("isGoBack",JSON.stringify(0));
        window.location.reload();
    }else {
        //基本信息
        saleConsume();
    }

    if(undefined==payMethod || "point"==payMethod){
        $("#yuan").hide();
        $("#jf").show();
    }
    if("cash"==payMethod){
        $("#jf").hide();
        $("#yuan").show();
    }

    //输入购买金额
    var oldNum;
    $("#buyMoney").val("").keyup(function(){
        var $saleMoney=$("#buyMoney");
        positiveInteger($saleMoney,oldNum,0,1e8);
    });



   /* $('input').focus(function () {
       /!* $("html,body").animate({scrollTop:100});*!/
    });*/
    //对于ios input focus时 fixed 失效问题
    var ua = window.navigator.userAgent.toLowerCase();
     $('input').focus(function () {
        $("html,body").animate({scrollTop:100});
     });
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //这是iOS平台下浏览器
        var _this = $(".footer");
        var footHei=_this.height();
        var docHeight=$(document).height();
        $('input').focus(function () {
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

    //扩展弹框区域
    $(".buyAmount").click(function(){
        $("#buyMoney").focus();
    });

    //关闭弹窗
    $(".backShadow,.popupTClose,.useKnow,#close,#iknow").click(function(){
        $(".popupT,#confirmEdu,#instructions,#applicableHotel,#checkAgain,#noIntegral").hide();
    });

    //适用说明
    $("#explainBtn").click(function(){
        $(".popupT,#instructions").show();
    });

    //适用酒店
    $("#hotelBtn").click(function(){
        //$(".popupT,#applicableHotel").show();列表展示未完成
        //按照立即使用的url
        if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
            var hotelData={"hotelUrl":encodeURIComponent(exchangeUrl),"act":"toHotel"};
            var hotelUrl = "http://www.jihelife.com?data="+JSON.stringify(hotelData);
            iosBridgeObjc(hotelUrl);
        }
        else {
            window.location.href=exchangeUrl;
        }
    });

    //购买
    var productId,totPrice;
    $(".footRight,#goOn").click(function(){
        $(".footRight,#goOn").addClass("no");
        var buyPrice=$("#buyMoney").val();
        var payPrice=$("#shouldPrice").html();
        if(buyPrice>0 && payPrice>0){
            $(".footRight").addClass("no");
            var memberData={};
            $.post(h5orClient("/member/h5/info"),{data:JSON.stringify(memberData)},function(memRes){
                if(memRes.sc==0){
                    var points=parseInt(memRes.data.points);
                    //var points=10;
                    if(points>=parseInt(payPrice) || GetParams().payMethod=="cash"){
                        var url='/trade/h5/buying/confirm';
                        var data={"couponId":couponId,"amount":Math.round(buyPrice*100),"price":Math.round(payPrice*100),"priceType":priceType};
                        if(undefined==payMethod || "point"==payMethod){
                            data.price=payPrice;
                        }
                        if("cash"==payMethod){
                            data.price=Math.round(payPrice*100);
                        }
                        $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
                            console.log(res);
                            if(res.sc==0){
                                buyingId=res.data.buyingId;
                                var ua = window.navigator.userAgent.toLowerCase();
                                if(undefined==res.data.productId || "-1"==res.data.productId){
                                    if(undefined==payMethod || "point"==payMethod){
                                        $("#oldPrice").html(payPrice+"积分");
                                        $("#newPrice").html(res.data.pointsPrice+"积分");
                                        $("#shouldPrice").html(res.data.pointsPrice);
                                    }
                                    if("cash"==payMethod){
                                        $("#oldPrice").html("￥"+payPrice);
                                        $("#newPrice").html("￥"+floatFixed2(res.data.price/100));
                                        $("#shouldPrice").html(floatFixed2(res.data.price/100));
                                    }
                                    $(".popupT,#checkAgain").show();
                                }else {
                                    sessionStorage.setItem("isGoBack",JSON.stringify(1));
                                    /* if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                                     window.location.href='/html/order/payChannels.html?app=jiheios&data='+res.data.productId;
                                     }*/
                                    if(undefined==payMethod || "point"==payMethod){
                                        window.location.href='/html/h5/order/payChannels.html?payMethod=point&data='+res.data.productId+'&buyingId='+buyingId;
                                    }
                                    if("cash"==payMethod){
                                        window.location.href='/html/h5/order/payChannels.html?data='+res.data.productId+'&buyingId='+buyingId;
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
                            $(".footRight,#goOn").removeClass("no");
                        });
                    }
                    else {
                        $(".popupT,#noIntegral").show();
                        $("#buyIntegral").click(function(){
                            window.location.href="../product/detail/virtualGoods.html?id=38607&mc=zqjf";
                        });
                        $(".footRight,#goOn").removeClass("no");
                    }
                }else {
                    $("#prompt").html("请稍后再试").show();
                    setTimeout(function(){
                        $("#prompt").html("").hide();
                    },2000);
                    $(".footRight,#goOn").removeClass("no");
                }
            });


        }
        else {
            $("#prompt").html("请输入购买额度").show();
            setTimeout(function(){
                $("#prompt").html("").hide();
            },2000);
            $(".footRight,#goOn").removeClass("no");
        }
    });


    //计算总价请求
    var calculated;
    function calculatedPrice(old){
        $(".footRight").addClass("no");
        clearTimeout(calculated);
        calculated=setTimeout(function(){
            if(""==$("#buyMoney").val() || Math.round($("#buyMoney").val()*100)==0) {
                $("#enjoyDiscount").hide();
            }
            var url='/trade/h5/buying/computeprice';
            var data={"couponId":couponId,"amount":Math.round($("#buyMoney").val()*100),"priceType":priceType};
            if(undefined==payMethod || "point"==payMethod){
                $(".perWord").html("兑换比例");
            }
            if("cash"==payMethod){
                $(".perWord").html("可享折扣");
            }
            if($("#buyMoney").val()>0){
                $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
                    //console.log(res);
                    if(res.sc==0){
                        if(Math.round($("#buyMoney").val()*100)>res.data.amount){
                            $("#prompt").html("消费金可购额度不足").show();
                            setTimeout(function(){
                                $("#prompt").html("").hide();
                            },2000);
                            $("#buyMoney").val(Math.round(res.data.amount/100));
                        }
                        if(res.data.amount==0){
                            $("#enjoyDiscount").hide();
                            return;
                        }
                        if(""!=$("#buyMoney").val() && Math.round($("#buyMoney").val()*100)>0 && "cash"==payMethod){
                            $("#enjoyDiscount").show();
                        }else{
                            $("#enjoyDiscount").hide();
                        }
                        var discount=res.data.discount;
                        var exchangeRate=res.data.exchangeRate;
                        var pointsPrice=res.data.pointsPrice;
                        if(undefined==payMethod || "point"==payMethod){
                            $("#shouldPrice").html(res.data.pointsPrice);
                            if(undefined!=exchangeRate){
                                $("#pert").html("1:"+Math.ceil(exchangeRate)/10);
                            }
                        }
                        if("cash"==payMethod){
                            $("#shouldPrice").html(floatFixed2(res.data.price/100));
                            if(undefined!=discount){
                                $("#pert").html(Math.ceil(discount)+"%")
                            }
                        }
                    }
                    else {
                        $("#buyMoney").val(old);
                        //alert(res.ErrorMsg);
                        $("#prompt").html("请稍后再试").show();
                        setTimeout(function(){
                            $("#prompt").html("").hide();
                        },2000);
                    }
                    oldNum=$("#buyMoney").val();
                    $(".footRight").removeClass("no");
                });
            }
            else {
                $("#shouldPrice").html("0");
            }
            clearTimeout(calculated);
        },1000);
    }

    //输入正整数

    function positiveInteger($dom,old,min,max){
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
            }
            if(parseInt(now)<min){
                now=min;
            }
            $dom.val(now);
        }
        calculatedPrice(old);
    }


    //获取基本信息
    function saleConsume(){
        var url='/coupon/h5/baseinfo';
        var data={"couponId":couponId};
        $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
            console.log(res);
            if(res.sc==0){
                priceType=res.data.priceType;
                if(undefined==payMethod || "point"==payMethod){
                    priceType=1;
                    $(".saleIntegral").show();
                    $(".saleIntegral a").attr("href","../product/detail/virtualGoods.html?id=38607&mc=zqjf");
                }
                if("cash"==payMethod){
                    priceType=0;
                }
                $(".nameCons").html(res.data.couponName);
                $(".banner").attr("src",res.data.exhibitPic);
                $("#deadLine").html(newFormatStrDate(new Date(parseInt(res.data.expireTime)),"/"));
                if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                    exchangeUrl=res.data.exchangeUrlApp;
                }
                else {
                    exchangeUrl=res.data.exchangeUrl;
                }
                if(undefined!=res.data.productUsable){
                    var html="<h3>可用商户及房型</h3>";
                    var hotel="";
                    for(var i=0;i<res.data.productUsable.length;i++){
                        if(undefined!=res.data.productUsable[i].productUsableDesc){
                            html+='<div class="sub-item">'
                                +'<h4>'+res.data.productUsable[i].hotelName+'</h4>'
                                +'<div class="sub-content">'+res.data.productUsable[i].productUsableDesc+'</div>'
                                +'</div>';
                        }
                        else {
                            html+='<div class="sub-item">'
                                +'<h4>'+res.data.productUsable[i].hotelName+'</h4>'
                                +'</div>';
                        }
                        hotel+='<li><a href="" class="clearfix"><div class="useHotelLeft fl">'+res.data.productUsable[i].hotelName+'</div><div class="useHotelRight fr"></div></a></li>'
                    }
                    $("#productUsable").show().html(html);
                    $("#applicableHotel").find(".useHotel").html(hotel);
                }
                if(undefined!=res.data.dateUsable){
                    $("#dateUsable").show().find("h3").html(res.data.dateUsable[0]);
                }
                if(undefined!=res.data.bookCondition){
                    $("#bookCondition").show().find("h3").html(res.data.bookCondition[0]);
                }
                if(undefined!=res.data.remark){
                    $("#remark").show().find("h3").html(res.data.remark);
                }

                //每几秒刷新出售信息
                salesDetails(couponId);
                setInterval(function(){
                    salesDetails(couponId);
                },8000);

                isOrder();
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
        var data={"couponid":couponId,"type":"1","priceType":priceType};//type 0卖(积分) 1买(￥),priceType定价类型
        if(undefined==payMethod || "point"==payMethod){
            data.type=0;
            $(".selling th").eq(2).html("转让单价(积分)");
            $(".selling th").eq(3).html("售价(积分)");
        }
        if("cash"==payMethod){
            data.type=1;
        }
        $.post(h5orClient(url),{data: JSON.stringify(data)},function(ress){
            //console.log(ress);
            if(ress.sc=="0"){
                var $table='';
                if(ress.data.length<=0){
                    $table+='<tr><td colspan="4" style="border-bottom: none;">暂无卖单</td></tr>';
                }else {
                    for(var i=0;undefined!=ress.data && i<ress.data.length;i++){
                        var discount;
                        var price;
                        if(undefined==payMethod || "point"==payMethod){
                            discount=(ress.data[i].exchangeRate/10).toFixed(1);
                            price=ress.data[i].pointsPrice;
                        }
                        if("cash"==payMethod){
                            discount=ress.data[i].discount+"%";
                            price=ress.data[i].price/100;
                        }
                        $table+='<tr><td>' + (i+1) + '</td><td>' + ress.data[i].availableAmount/100 + '</td><td>' + discount + '</td><td>' + price + '</td></tr>';
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

    //判断是否有未支付的订单
    function isOrder(){
        var isOrderUrl="/trade/h5/buying/product";
        var isOrderData={"couponid":couponId};
        $.post(h5orClient(isOrderUrl),{data: JSON.stringify(isOrderData)},function(res){
            console.log(res);
            if(res.sc==0){
                buyingId=res.data.buyingId;
                if(undefined==res.data.productBaseInfo){
                    return;
                }
                $(".backShadow").addClass("no");
                $("#productName").html(res.data.productBaseInfo.productName);
                $("#productAmount").html(res.data.productBaseInfo.referPrice);
                if(undefined==payMethod || "point"==payMethod){
                    $("#productPrice").html(res.data.productBaseInfo.productPrice.totalPointPrice+"积分");
                }
                if("cash"==payMethod){
                    $("#productPrice").html("￥"+floatFixed2(res.data.productBaseInfo.productPrice.totalPrice/100));
                }
                $(".popupT,#isProduct").show();
                if(undefined==res.data.orderBaseInfo){//只生成产品，未创建订单
                    $("#orderAgain").click(function(){
                        $("#orderAgain").addClass("no");
                        var cancelUrl='/trade/h5/buying/cancel';
                        var data={"buyingId":res.data.buyingId};
                        $.post(h5orClient(cancelUrl),{data:JSON.stringify(data)},function(resu){
                            console.log(resu);
                            if(resu.sc==0){
                                $(".popupT,#isProduct").hide();
                                $(".backShadow").removeClass("no");
                                salesDetails(couponId);
                            }
                            $("#orderAgain").removeClass("no");
                        })
                    });
                    $("#toPay").click(function(){
                        sessionStorage.setItem("isGoBack",JSON.stringify(1));
                        if(undefined==payMethod || "point"==payMethod){
                            window.location.href='/html/h5/order/payChannels.html?payMethod=point&data='+res.data.productBaseInfo.productId+'&buyingId='+buyingId;
                        }
                        if("cash"==payMethod){
                            window.location.href='/html/h5/order/payChannels.html?data='+res.data.productBaseInfo.productId+'&buyingId='+buyingId;
                        }
                    });
                }
                else {//已创建订单
                    $("#orderAgain").click(function(){
                        $("#orderAgain").addClass("no");
                        var cancelUrl='/order/h5/cancel';
                        var data={"orderid":res.data.orderBaseInfo.orderid};
                        $.post(h5orClient(cancelUrl),{data:JSON.stringify(data)},function(resu){
                            console.log(resu);
                            if(resu.sc==0){
                                $(".popupT,#isProduct").hide();
                                $(".backShadow").removeClass("no");
                                salesDetails(couponId);
                            }
                            $("#orderAgain").removeClass("no");
                        })
                    });
                    $("#toPay").click(function(){
                        sessionStorage.setItem("isGoBack",JSON.stringify(1));
                        if(undefined==payMethod || "point"==payMethod){
                            window.location.href='/html/h5/order/payChannels.html?payMethod=point&data='+res.data.productBaseInfo.productId+"&orderid="+res.data.orderBaseInfo.orderid+'&buyingId='+buyingId;
                        }
                        if("cash"==payMethod){
                            window.location.href='/html/h5/order/payChannels.html?data='+res.data.productBaseInfo.productId+"&orderid="+res.data.orderBaseInfo.orderid+'&buyingId='+buyingId;
                        }
                    });
                }
            }
        });
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