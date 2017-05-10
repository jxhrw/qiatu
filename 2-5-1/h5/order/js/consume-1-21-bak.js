/**
 * Recreated by qianyun Yang on 2017/1/9.
 */
/*新增现金支付功能，重构前人所写js，html基本未作改动*/
$(document).ready(function () {
    var id=getRequest().member_hotelid,
        productId=getRequest().productId,
        storeName=getRequest().storeName;
    var couponList,message,couponDesc,cValueArr=[],shouldPay,couponValue=0,pointsToCash,cashPointsInfo,pointsValue=0,totalValue,payments;
    //console.log(id);
    //console.log(productId);
    $(".consumetitle").html(storeName);
    //请求券和积分的接口
    data={"id":id,"productId":productId};
    $.ajax({
        type: 'post',
        async:false,
        url: '/pay/h5/payable/offline',
        data: {data:JSON.stringify(data)},
        dataType: 'json',
        success : function(data){
            console.log(data);
            if(data.data.cashPointsInfo){
                var message={
                    "pieces":parseInt(data.data.couponInfo.availableCouponPieces),
                    "couponRemain":parseFloat(data.data.couponInfo.availableCouponRemain/100),
                    "points":parseFloat(data.data.cashPointsInfo.points),
                    "pointsToCash":parseFloat(data.data.cashPointsInfo.amountByPointsToCash/100),
                    "pointsToCashDesc":data.data.cashPointsInfo.pointsToCashDesc
                };
                if(message.points){//有积分则显示积分
                    $(".pointsBalance").html(message.points.toLocaleString());
                    $(".pointsToCash").html(message.pointsToCash);
                }else{//无积分则不显示该选项
                    //$(".points").hide();
                    $(".points").html('<div class="iconfont" style="display: inline-block;font-size: 1.1rem;color:#cdcdd3;border-radius: 50%;">&#xe62c;</div>&nbsp;&nbsp;<p style="display: inline-block">'+message.pointsToCashDesc+'</p>');
                }
            }else{
                var message={
                    "pieces":parseInt(data.data.couponInfo.availableCouponPieces),
                    "couponRemain":parseFloat(data.data.couponInfo.availableCouponRemain/100)
                };
                $(".points").hide();
            }
            cashPointsInfo=data.data.cashPointsInfo;
            pointsTocash=message.pointsToCash;
            if(message.pieces>0){//有礼券则显示礼券
                $(".couponBalance").html(format(message.couponRemain));
                couponList=data.data.couponInfo.cashCouponList;
                $.each(couponList, function (i) {
                    couponDesc={
                        "effectiveTime":getDate(parseInt(couponList[i].effectiveTime)),
                        "expiredTime":getDate(parseInt(couponList[i].expireTime)),
                        "couponName":couponList[i].couponBaseInfo.couponName,
                        "remain":parseFloat(couponList[i].remain/100)
                    };
                    var coupon='<li class="coupon"><h1>'+couponDesc.couponName+'</h1><div class="inTime"><span class="inTime">有效期：<a>'+couponDesc.effectiveTime+'-'+couponDesc.expiredTime+'</a></span></div><div class="balance"><span class="balance">余额：</span><strong><em class="rmbSign">￥</em>'+format(couponDesc.remain)+'</strong></div><em class="iconfont couponIconfont">&#xe62c;</em></li>';
                    $(".content").append(coupon);
                });
            }else{//无礼券则不显示该选项
                $(".giftCoupons").html('<span class="iconfont iconfont-unconfirm" style="display: inline-block">&#xe62c;</span>&nbsp;&nbsp;礼券可用余额:<p style="float: right;color: #969696">'+data.data.couponInfo.couponDesc+'</p>');
            }
            if(message.points){//有积分则显示积分
                $(".pointsBalance").html(message.points.toLocaleString());
                $(".pointsToCash").html(message.pointsToCash);
            }else{//无积分则不显示该选项
                //$(".points").hide();
                $(".points").html('<span class="iconfont iconfont-unconfirm" style="display: inline-block">&#xe62c;</span>&nbsp;&nbsp;<p style="display: inline-block">'+message.pointsToCashDesc+'</p>');
            }
        }
    });
    //选中礼券选项
    $('.giftCoupons span.iconfont').click(function () {
        if($(this).hasClass('iconfont-unconfirm1')){//没有选中样式时 弹出选择礼券的弹窗
            popup();
            cValueArr=[];
        }else{//选中则取消选中
            $(this).html('&#xe62c;').removeClass('iconfont-confirm1').addClass('iconfont-unconfirm1');
            $(".iconfont.couponIconfont1").html('&#xe62c;').removeClass('couponIconfont1').addClass('couponIconfont');
            couponValue=0;
            //$(".payValue").html($(".resetPhone").val());
            if(couponValue!=undefined){
                shouldPay=totalValue-couponValue-pointsValue;
            }else {
                shouldPay=totalValue;
            }
            if(shouldPay<0){
                shouldPay=0;
            }
            $(".payValue").html(floatFixed2(shouldPay));

        }
    });
    $('.giftCoupons .triangle').click(function(){//点击小三角出现选择礼券的弹窗
        popup();
        cValueArr=[];
    });
    $(".head a").click(function () {//点击X号关闭弹窗
        cancelPop();
    });
    $(".wrapPopup").click(function () {//点击遮罩关闭弹窗
        cancelPop();
    });
    $(".content li").click(function(){//选择相应的礼券
        if($(this).find('em.iconfont').hasClass('couponIconfont')){
            $(this).find('em.iconfont').html('&#xe619;').removeClass('couponIconfont').addClass('couponIconfont1');
        }else{
            $(this).find('em.iconfont').html('&#xe62c;').removeClass('couponIconfont1').addClass('couponIconfont');
        }
    });
    //点击确定按钮
    $('.footer').click(function(){
        //礼券被选中后
        for(var i=0;i<$('em.iconfont').length;i++){
            if($('em.iconfont').eq(i).hasClass('couponIconfont1')){
                $('.wrapPopup').hide();
                $('.couponPopup').hide();
                $('em.iconfont').eq(i).addClass('select');
            }else{
                $('.wrapPopup').hide();
                $('.couponPopup').hide();
                $('em.iconfont').eq(i).removeClass('select');
            }
            if($('em.iconfont').hasClass('couponIconfont1')){
                $('.giftCoupons span.iconfont').html('&#xe619;').removeClass('iconfont-unconfirm1').addClass('iconfont-confirm1');
            }else{
                $('.giftCoupons span.iconfont').html('&#xe62c;').removeClass('iconfont-confirm1').addClass('iconfont-unconfirm1');
            }
        }
        if(couponList){
            for(var i=0;i<couponList.length;i++){
                if($('em.iconfont').eq(i).hasClass('couponIconfont1')){
                    cValueArr.push(couponList[i].remain)
                }
            }
        }
        console.log(cValueArr);
        if(cValueArr.length!=0){
            couponValue=eval(cValueArr.join("+"))/100;//输入的总额
        }else{
            couponValue=0;//输入的总额
        }
        console.log(totalValue);
        console.log("扣除礼券金额"+couponValue);
        if(couponValue==0){
           // $(".couponValue strong").html(couponValue).parent().parent().hide();
        }else if(couponValue>0){
           // $(".couponValue strong").html(couponValue).parent().parent().show();
        }
        if(couponValue!=undefined){
            shouldPay=totalValue-couponValue-pointsValue;
        }else {
            shouldPay=totalValue;
        }
        if(shouldPay<0){
            shouldPay=0;
        }
        $(".payValue").html(floatFixed2(shouldPay));
    });

    //选中积分选项
    $('.points').click(function () {
        if ($(this).find("span").hasClass('iconfont-unconfirm')) {//未选中变选中状态
            $(this).find("span").html('&#xe619;').removeClass('iconfont-unconfirm').addClass('iconfont-confirm');
        }else{//选中则取消选中
            $(this).find("span").html('&#xe62c;').removeClass('iconfont-confirm').addClass('iconfont-unconfirm');
        }
        if($('span.iconfont').hasClass('iconfont-confirm')){//积分被选中
            pointsValue=$(".pointsToCash").html();
            console.log("选中积分扣除"+pointsValue);
            //$(".pointsValue strong").parent().parent().show();
        }else if($('span.iconfont').hasClass('iconfont-unconfirm')){
            pointsValue=0;
            console.log("取消积分扣除"+pointsValue);
           // $(".pointsValue strong").html(pointsValue).parent().parent().hide();
        }
      //  if(couponValue!=undefined||pointsValue!=undefined){
            shouldPay=totalValue-couponValue-pointsValue;
    /*    }else {
            shouldPay=totalValue;
        }*/
        console.log(totalValue);
        console.log("应付"+shouldPay);
        if(shouldPay<0){
            shouldPay=0;
        }
        $(".payValue").html(floatFixed2(shouldPay));

    });
    $(".resetPhone").bind('input propertychange',function (){//监听文本域内容的变化
        if($(".resetPhone").val()!=""){
            $("#submitBtn").removeAttr("disabled");
        }
        totalValue=$(this).val();
        $(".totalValue strong").html(totalValue);
        if($('span.iconfont').hasClass('iconfont-confirm')){//积分被选中
            pointsValue=$(".pointsToCash").html();
            console.log("选中积分扣除"+pointsValue)
        }else if($('span.iconfont').hasClass('iconfont-unconfirm')){
            pointsValue=0;
            console.log("取消积分扣除"+pointsValue);
        }
        //if(couponValue!=undefined||pointsValue!=undefined){
            shouldPay=totalValue-couponValue-pointsValue;
       /* }else {
            shouldPay=totalValue;
        }*/
        console.log(totalValue);
        console.log("应付"+shouldPay);
        if(shouldPay<0){
            shouldPay=0;
        }
        $(".payValue").html(floatFixed2(shouldPay));
    });
/*
    $("#submitBtn").click(function () {
        $(".consume").hide();
        $(".order").show();
    });
*/
    $(".storeName h1").html(storeName);
    var balanceData={};
    var b;
    $.ajax({
        type: 'post',
        async:'false',
        url: '/pay/h5/balance/info',
        data: {data:JSON.stringify(balanceData)},
        dataType: 'json',
        success : function(data){
            var cashBalance=data.data.cashBalance/100;
            $(".jhPay span").html(cashBalance);
        }});
    $(".wxPay").click(function () {
        $(this).find('em.iconfont').html('&#xe619;').removeClass('iconfont-unconfirm2').addClass('iconfont-confirm2');
        $(".jhPay").find('em.iconfont').html('&#xe62c;').removeClass('iconfont-confirm2').addClass('iconfont-unconfirm2');
    });
    $(".jhPay").click(function () {
        $(this).find('em.iconfont').html('&#xe619;').removeClass('iconfont-unconfirm2').addClass('iconfont-confirm2');
        $(".wxPay").find('em.iconfont').html('&#xe62c;').removeClass('iconfont-confirm2').addClass('iconfont-unconfirm2');
    });
    $(".payValue2 strong").html($(".payValue").html());
    $("#submitBtn").click(function () {
        $(".consume").hide();
            $(".order").show();
            if(shouldPay!=0){
                $(".payChannel").show();
                $(".wxPay").find('em.iconfont').removeClass('iconfont-unconfirm2').addClass('iconfont-confirm2');
            }else{
                $(".payChannel").hide();
                $(".wxPay").find('em.iconfont').removeClass('iconfont-confirm2').addClass('iconfont-unconfirm2');
            }
            var paymentInfoList=[];
            if(couponList){//有礼券列表
                for(var i=0;i<couponList.length;i++){
                    if($('em.iconfont').eq(i).hasClass('couponIconfont1')){//选中样式
                        paymentInfoList.push(couponList[i].paymentInfo);
                    }
                }
            }
            if(cashPointsInfo){
                if(cashPointsInfo.amountByPointsToCash>0){//有积分时
                    if($('span.iconfont').hasClass('iconfont-confirm')){//积分被选中
                        paymentInfoList.push(cashPointsInfo.paymentInfo);
                    }
                }
            }
            var data={"id":id,"productId":productId,"amount": totalValue*100,"paymentInfoList":paymentInfoList};
            $.post('/pay/h5/payable/confirmpayment',{data: JSON.stringify(data)},function(data){
                console.log(data);
                if(data.sc=="0"){
                    if(typeof data.data.couponInfo!="undefined"){//礼券paymentInfoList存在
                        payments=data.data.couponInfo.paymentInfoList;
                        var payCouponArr=[];
                        $.each(data.data.couponInfo.paymentInfoList,function (i) {
                            payAmount=data.data.couponInfo.paymentInfoList[i].amount/100;
                            payCouponArr.push(payAmount);
                        });
                        console.log("haha"+eval(payCouponArr.join("+")));
                        $(".couponValue strong").html(eval(payCouponArr.join("+")));
                        if(eval(payCouponArr.join("+"))!=0){
                            $(".couponValue").show();
                        }else{
                            $(".couponValue").hide();
                        }
                        if(typeof data.data.cashPointsInfo!="undefined"){//这个参数存在
                            if(typeof data.data.cashPointsInfo.paymentInfoList!="undefined"){
                                if($('span.iconfont').hasClass('iconfont-confirm')){//积分被选中
                                    payments.push(data.data.cashPointsInfo.paymentInfoList[0]);
                                    $(".pointsValue strong").html(data.data.cashPointsInfo.paymentInfoList[0].amount/100);
                                    if(data.data.cashPointsInfo.paymentInfoList[0].amount!=0){
                                        $(".pointsValue").show();
                                    }else{
                                        $(".pointsValue").hide();
                                    }
                                }
                            }

                        }else{
                            payments.push({"amount":shouldPay*100,"payType":0});
                        }
                    }
                    else {
                        if($('span.iconfont').hasClass('iconfont-confirm')){//积分被选中
                            payments=data.data.cashPointsInfo.paymentInfoList;
                            $(".pointsValue strong").html(data.data.cashPointsInfo.paymentInfoList[0].amount/100);
                            if(data.data.cashPointsInfo.paymentInfoList[0].amount!=0){
                                $(".pointsValue").show();
                            }else{
                                $(".pointsValue").hide();
                            }
                            payments.push({"amount":shouldPay*100,"payType":0});
                        }else if($('span.iconfont').hasClass('iconfont-unconfirm')){
                            payments=[{"amount":totalValue*100,"payType":0}];
                        }
                    }
                    console.log(payments);
                }
            })
    });
   // if($(".order").css("display")=="block"){
        window.addEventListener("popstate", function(e) {
            if($(".consume").css("display")=="block"){
                pushHistory();
                $(".order").hide();
                $(".consume").show();
            }
        }, false);
  //  }
    $(".payBtn").click(
        function () {
            var comfirmData;
            if($(".wxPay").find('em.iconfont').hasClass('iconfont-confirm2')){
                comfirmData={"id":id,"productId":productId,"amount": totalValue*100,"payments":payments,"quantity":1,"payChannel":"wx_pub"};
            }else if($(".wxPay").find('em.iconfont').hasClass('iconfont-unconfirm2')){
                comfirmData={"id":id,"productId":productId,"amount": totalValue*100,"payments":payments,"quantity":1};
            }
            console.log(comfirmData);
            $.post('/order/h5/createandpay',{data:JSON.stringify(comfirmData)},function(data){
                console.log(data);
                if(data.sc==0){
                   var orderid=data.data.orderid,
                    hotelid=data.data.hotelId;
                    if(data.data.payTicketInfo!=null){
                        if(data.data.payTicketInfo.channel=='wx_pub'){
                            pingpp.createPayment(data.data.payTicketInfo, function (result, err) {
                                console.log(result);
                                if(result=="cancel"){
                                    $.post('/order/h5/breakpay/'+orderid,function(data){
                                        console.log(data);
                                        if(data.sc==0){
                                            var order={"orderid":orderid};
                                            $.post('/order/h5/cancel',{data:JSON.stringify(order)},function(res){
                                                console.log(res);
                                                if(res.sc==0){
                                                    location.reload()
                                                }
                                            })
                                        }
                                    })
                                }
                                else if(result=="success"){
                                        window.location.href="/html/h5/order/orderDetailN.html?orderid="+orderid+"&hotelid="+hotelid;
                                }
                            });
                        }
                    }else {
                        window.location.href="/html/h5/order/orderDetailN.html?orderid="+orderid+"&hotelid="+hotelid;
                    }
                }

/*
                orderid=data.data.orderid;
                if(data.sc=="0"){
                    //订单支付页面
                    data={"orderid":orderid};
                    console.log(data);
                    $.post('/order/h5/info',{data: JSON.stringify(data)},function(data){
                        console.log(data);

                        window.location.href="/html/member/orderDetail.html?orderid="+orderid+"&hotelid="+data.data.hotelId;
                    });
                }
*/
            })
        }
    )
});
window.onload=function(){
    $(".resetPhone").val("");
};
//获取url的参数
function getRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
//三位数以上添加","进行分隔
function format (num) {
    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
//弹窗
function popup(){
    $('.wrapPopup').show();
    $('.couponPopup').show();
}
//关闭弹窗
function cancelPop(){
    $('.wrapPopup').hide();
    $('.couponPopup').hide();
    for(var i=0;i<$('em.iconfont').length;i++){
        if ($('em.iconfont').eq(i).hasClass('select')) {
            $('em.iconfont').eq(i).html('&#xe619;').removeClass('couponIconfont').addClass('couponIconfont1');
        }else {
            $('em.iconfont').eq(i).html('&#xe62c;').removeClass('couponIconfont1').addClass('couponIconfont');
        }
    }
}
//将时间戳转化为日期
function getDate(time) {
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}
//超出两位保留两位有效数字
function floatFixed2(res){
    if(res.toString().indexOf(".")) {
        if (res.toString().split(".")[1]) {
            if(res.toString().split(".")[1].length>2){
                if (res.toString().split(".")[1] / 1 == 0) {
                    return res*1;
                }else {
                    return res.toFixed(2);
                }
            }else {
                return res;
            }
        }else {
            return res;
        }
    }else {
        return res;
    }
}
//是否返回上一页面


function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}
