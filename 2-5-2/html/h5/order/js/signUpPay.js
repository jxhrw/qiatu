$(document).ready(function(){
    $(".screenBox,.screenFull").height($(window).height());

    $("#winResults").click(function(){
        $("#winningList").show();
    });

    $(".shadow,.close").click(function(){
        $(".screenFull").hide();
    });

    $(".plus:last-child").css("display","none");

    var price,paidToURL,productDesc,imgSrc;
    var productId=GetParams().id;
    var payType;//支付方式
    var data="{'id':"+productId+"}";
    $.ajax({
        url:"/product/h5/query",
        type:'POST',
        data:{data:data},
        dataType:'json',
        success:function(data){
            console.log(data);
            price=data.data.productPrice.totalPrice;
            paidToURL=data.data.serviceUrl;
            productDesc=data.data.productDesc;
            imgSrc=data.data.imgList[0];
            payType=data.data.payTypes[0];
            document.title=data.data.productName;
            $(".activityName").html(data.data.productName);
            $(".bannerBgp").css("background-img",'url('+imgSrc+')');
            $(".activityPrize").html(productDesc);
            if(payType==0){//现金支付
                $("#price").html(parseInt(data.data.productPrice.totalPrice/100));
            }
            if(payType==4){//积分支付
                $("#payWeChat").html(parseInt(data.data.productPrice.totalPointPrice)+" 积分支付").css("text-align","center");
            }
        },
        error: function(error){
            console.log(error.status);
        }
    });

    $("#payWeChat").click(function(){
        $("#payWeChat").css({"pointer-events": "none"});
        setTimeout(function(){
            $("#payWeChat").css({"pointer-events": ""});
        },5000);
        createAndPayServiceOrder(productId,price,paidToURL,payType);
    });

    function createAndPayServiceOrder(productId, price, paidToUrl, payType) {  //产品ID、产品价格、支付成功后跳转url、支付方式
        queryParam = {'productid': productId};
        $.post("/order/h5/list",{data: JSON.stringify(queryParam)},function (resp, status) {
            var orderObject = null;
            if("0" == resp.sc && resp.data.length > 0){
                for(var i=0;i<resp.data.length;i++){
                    if(2 == resp.data[i].paystatus){
                        window.location.href = paidToUrl;
                        return;
                    }
                    if(9 != resp.data[i].status){
                        orderObject = resp.data[i];
                        break;
                    }
                }
                $("#payWeChat").css({"pointer-events": ""});
            }

            if(null != orderObject ){//代支付状态
                if(payType==0){
                    payParam = {"orderid":orderObject.orderid,'paychannel': 'wx_pub2'};
                }
                if(payType==4){
                    payParam = {"orderid":orderObject.orderid};
                    var ry=confirm("确认支付吗？");
                    if (ry!=true) {
                        return;
                    }
                }
                $.post("/order/h5/pay", {data: JSON.stringify(payParam)},function (resp, status) {
                    if ("0" == resp.sc) {
                        var orderid = resp.data.orderid;
                        if (null != resp.data.payTicketInfo) {
                            pingpp.createPayment(resp.data.payTicketInfo, function (result, err) {
                                if ("cancel" == result) {
                                    $.post('/order/h5/breakpay/' + orderid, function (resp, status) {
                                        console.log(resp);
                                    })
                                } else if ("success" == result) {
                                    checkPayStatus(orderid, paidToUrl);
                                }
                            });
                        } else {
                            window.location.href = paidToUrl;
                        }
                    }else if("ORDER-1006" == resp.sc){
                        window.location.href = paidToUrl;
                    }else {
                        errorPrompt(chinese(resp.ErrorMsg),2000);
                    }
                    $("#payWeChat").css({"pointer-events": ""});
                });
            }else{
                if(payType==0){
                    createParam = {
                        'productid': productId,
                        'quantity': 1,
                        'amount': price,
                        'payments': [{'paytype': 0, 'amount': price}],
                        'paychannel': 'wx_pub2'
                    };
                }
                if(payType==4){
                    createParam = {
                        'productid': productId,
                        'quantity': 1,
                        'amount': price,
                        'payments': [{'paytype': 4, 'amount': price, 'points': price/8}]
                    };
                    var ry=confirm("确认支付吗？");
                    if (ry!=true) {
                        return;
                    }
                }
                $.post("/order/h5/createandpay", {data: JSON.stringify(createParam)},
                    function (resp, status) {
                        console.log(resp);
                        if (resp.sc == "0") {
                            var orderid = resp.data.orderid;
                            if (null != resp.data.payTicketInfo) {
                                pingpp.createPayment(resp.data.payTicketInfo, function (result, err) {
                                    console.log(result);
                                    console.log(err);
                                    if ("cancel" == result) {
                                        $.post('/order/h5/breakpay/' + orderid, function (resp, status) {
                                            console.log(resp);
                                        })
                                    } else if ("success" == result) {
                                        checkPayStatus(orderid, paidToUrl);
                                    }
                                });
                            } else {
                                window.location.href = paidToUrl;
                            }
                        }
                        else if("ORDER-1010" == resp.sc){
                            window.location.href = paidToUrl;
                        }
                        else {
                            errorPrompt(chinese(resp.ErrorMsg),2000);
                        }
                        $("#payWeChat").css({"pointer-events": ""});
                    }
                );
            }
        });
    }

    function checkPayStatus(orderid, paidToUrl) {
        var infoParm = {"orderid": orderid};
        setTimeout(function () {
            $.post('/order/h5/info', {data: JSON.stringify(infoParm)}, function (resp, status) {
                //判断支付状态
                if ("0" == resp.sc && "2" == resp.data.paystatus && "9" != resp.data.status) {
                    console.log(resp);
                    //支付成功跳转到目标页面
                    window.location.href = paidToUrl;
                } else {
                    console.log(resp);
                }
                $("#payWeChat").css({"pointer-events": ""});
            })
        }, 1000);
    }


});