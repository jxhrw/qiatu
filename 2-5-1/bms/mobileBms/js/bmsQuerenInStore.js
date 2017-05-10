$(document).ready(function() {
    var arr=[];
    var arr3=[];
    var data={"orderid":orderid};
    var winHeight=$(window).height();
    var ordername,quantity,nights,amount; //房型，数量，几晚，总价
    $("body,.orderDetailPopup").css("height",winHeight);

    $.post('/order/bmsh5/info', {data: JSON.stringify(data)},  function(data) {
        console.log(data);
        ordername=data.data.ordername;
        quantity=data.data.quantity;
        nights=data.data.nights;
        amount=data.data.amount/100;
        //可取消时显示取消按钮，已取消不显示
        if(data.data.allowCancel==1){
            $(".cancelBox").show();
        }else {
            $(".cancelBox").hide();
        }
        //一秒钟判断一次，已取消清除计时器
        var iny=setInterval(function(){
            if(data.data.allowCancel==1){
                $(".cancelBox").show();
            }else {
                $(".cancelBox").hide();
                clearInterval(iny);
            }
        },1000);

        if(data.sc==0){
            $(".memberinfo li").eq(0).children("span").eq(0).html(data.data.bookerName);
            $(".memberinfo li").eq(0).children("span").eq(1).html(data.data.bookerMobile);
            if(data.data.memberGrade==0){
                $(".memberinfo li").eq(0).children("span").eq(2).html("黄金会员")
            }
            else if(data.data.memberGrade==1){
                $(".memberinfo li").eq(0).children("span").eq(2).html("白金会员")
            }
            else if(data.data.memberGrade==2){
                $(".memberinfo li").eq(0).children("span").eq(2).html("黑卡会员")
            }
            $(".productinfo li").eq(0).children("strong").html(data.data.statedesc);
            $(".productinfo li").eq(1).children("strong").html(data.data.orderid);
            $(".priceinfo li").eq(0).children("strong").html("￥"+data.data.amount/100);
            for (var i =0; i < data.data.settlePayments.length; i++) {
                //1是房券，2是现金抵用券，3是积分兑房，4是积分抵现
                if(data.data.settlePayments[i].payType==2){
                    arr.push(data.data.settlePayments[i].amount/100);
                }
                else if(data.data.settlePayments[i].payType==4){
                    arr3.push(data.data.settlePayments[i].amount/100);
                }
            }
            amountDi=0;
            for (var a= 0; a< arr.length; a++) {
                amountDi += arr[a];
            }
            amountDi3=0;
            for (var a= 0; a< arr3.length; a++) {
                amountDi3 += arr3[a];
            }
            if (arr.length!=0) {
                $(".priceinfo li").eq(1).children("strong").html("￥"+amountDi);
            }
            if (arr3.length!=0) {
                $(".priceinfo li").eq(2).children("strong").html("￥"+amountDi3);
            }
//判断订单状态 -1未创建 0待提交 1代确认房态 2房态确认处理中 3待支付 4支付中 5已支付 6预定处理中 8已确认【预订】11已发货 12交易完成 9 已取消

        }
    });

    //bookresult  0:无房拒绝,2:价格错误原因拒绝,3:其他原因拒绝,1:预定成功
    $(".cancelOrder").click(function(){
        $(".orderDetailPopup").show();
    });
    $(".kong").css("height",$(".orderDetailPopup").height()-$(".popupBox").height()).click(function(){
        $(".orderDetailPopup").hide();
    });
    $(".orderDetailPopup .popupTitle i").click(function(){
        $(".orderDetailPopup").hide();
    });
    $(".orderDetailPopup .confirm").click(function(){
        var data1={"orderid":orderid,'bookresult':3};
        $.post('/order/bmsh5/bookresult', {data: JSON.stringify(data1)},  function(data) {
            console.log(data);
            if(data.sc==0){
                // alert("aaa12")
                location.reload();
            }
        })
    })
});
