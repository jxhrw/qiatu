var couponid;
var jinzhi;
$(document).ready(function(){
    couponid = GetParams().couponId;
    getRecList(1, 1000,couponid); 
    var url="/pay/h5/coupon/record";
    var data={"couponCode":GetParams().code};
    if(GetParams().subCouponCode && 'undefined'!=GetParams().subCouponCode){
        data={"couponCode":GetParams().subCouponCode}
    }
    $.post(url,{data:JSON.stringify(data)},function(res){
        console.log(res);
        if(res.sc==0) {
            $(".card-name").html(res.data.couponBaseInfo.couponName);
            $(".card-code span").html(res.data.couponCode);
            var coupontype = res.data.couponBaseInfo.couponType;
            if (undefined != res.data.monthRecordInfo) {
                var recordInfo = res.data.monthRecordInfo;
                var sectionHtml="";
                for (var key in recordInfo) {
                    var section = "";
                    var hearder = '<header class="group-header">' + key.split("-")[0] + "年" + key.split("-")[1] + "月" + '</header>';
                    var groupItem="";
                    for(var i=0;i<recordInfo[key].length;i++){
                        var consumptionType,consumptionTypeClass;
                        //0-消费金发放,1-房券兑房,2-现金券抵现,5-折扣券使用,7-红包支付,10-转换支付别人的券支付，收入券,11-消费金兑换积分,12-积分兑换消费金,13-交易转出,14-交易转入,40-消费金回收,41-房券兑房取消,42-现金券抵现取消,45-折扣券使用取消,47-红包支付取消,
                        switch(recordInfo[key][i].recordType) {
                            case "0":
                                consumptionType='发放';
                                consumptionTypeClass='tuikuan';
                                break;
                            case "1":
                            case "2":
                            case "5":
                            case "7":
                                consumptionType='消费';
                                consumptionTypeClass='zhusu';
                                break;
                            case "10":
                                consumptionType='转换支付';
                                consumptionTypeClass='duihuan';
                                break;
                            case "11":
                                consumptionType='兑换积分';
                                consumptionTypeClass='duihuan';
                                break;
                            case "12":
                                consumptionType='积分兑换';
                                consumptionTypeClass='duihuan';
                                break;
                            case "13":
                                consumptionType='转让';
                                consumptionTypeClass='zhusu transfer';
                                break;
                            case "14":
                                consumptionType='购买';
                                consumptionTypeClass='tuikuan';
                                break;
                            case "40":
                                consumptionType='回收';
                                consumptionTypeClass='tuikuan';
                                break;
                            case "41":
                            case "42":
                            case "45":
                            case "47":
                                consumptionType='退款';
                                consumptionTypeClass='tuikuan';
                                break;
                            default:
                                consumptionType='变动';
                                consumptionTypeClass='zhusu';
                                break;
                        }
                        var changeMoneyClass,amount;//金额改变时的颜色
                        if(parseInt(recordInfo[key][i].amount)>=0 && coupontype != "9" && coupontype != "1"){
                            changeMoneyClass="";
                            amount='+'+recordInfo[key][i].amount/100;
                        }else if(parseInt(recordInfo[key][i].amount)>=0 && coupontype == "9"){
                            changeMoneyClass="";
                            amount='+'+recordInfo[key][i].amount + "天";
                        }else if(parseInt(recordInfo[key][i].amount)>=0 && coupontype == "1"){
                            changeMoneyClass="";
                            amount='+'+recordInfo[key][i].amount + "张";
                        }else if (parseInt(recordInfo[key][i].amount)<0 && coupontype != "1") {
                            changeMoneyClass="red";
                            amount=recordInfo[key][i].amount/100
                        }else if (parseInt(recordInfo[key][i].amount)<0 && coupontype == "1") {
                            changeMoneyClass="red";
                            amount=recordInfo[key][i].amount+"张";
                        }else if (recordInfo[key][i].amount == undefined) {
                            amount = recordInfo[key][i].recordTypeDesc;
                        }
                        var orderId;//有无订单id显示
                        if(undefined!=recordInfo[key][i].orderId && "13"!=recordInfo[key][i].recordType){
                            orderId='<p class="order-id">'
                                +'<span class="field-label">订单号:</span>'
                                +'<span class="field-content">'+recordInfo[key][i].orderId+'</span>'
                                +'</p>';
                        }else {
                            orderId="";
                        }
                        var amountAndBalance;
                        var amountHtml='';
                        if(amount){
                            amountHtml='<p class="order-amount">'
                                +'<span class="'+changeMoneyClass+'">'+ consumptionType +'</span></p>';
                        } 
                        if(recordInfo[key][i].recordType=="7" || recordInfo[key][i].recordType=="47" || recordInfo[key][i].recordType=="1" || recordInfo[key][i].recordType=="41"){
                            amountAndBalance='';
                        }
                        else if(recordInfo[key][i].recordType=="5" || recordInfo[key][i].recordType=="45"){
                            amountAndBalance=amountHtml;
                        }
                        else {
                            var remain;
                            var remainHtml="";
                            if(undefined==recordInfo[key][i].remain){
                                remain=0;
                            }else {
                                remain=recordInfo[key][i].remain;
                            }
                            if(remain && remain >= 0 && coupontype != "9" ){
                                remainHtml='<p class="card-balance">'
                                    +'<span class="field-label">余额:</span>'
                                    +'<span class="field-content">'
                                    +'<span class="rmb"></span>'+remain/100
                                    +'</span>'
                                    +'</p>';
                            } else if (remain && remain >= 0 && coupontype == "9") {
                                remainHtml='<p class="card-balance">'
                                    +'<span class="field-label">余额:</span>'
                                    +'<span class="field-content">'
                                    +'<span class="rmb"></span>'+remain+"天"
                                    +'</span>'
                                    +'</p>';
                            }
                            amountAndBalance=amountHtml + remainHtml;
                        }
                        groupItem+='<div class="group-item">'
                            +'<div class="cell-main">'
                            +amountAndBalance
                            +'<p class="order-date">'
                            +'<span class="field-label">日期:</span><span class="field-date">'
                            +getDate(parseInt(recordInfo[key][i].createTime))+' &nbsp; '+ timeFormatSecond(new Date(parseInt(recordInfo[key][i].createTime)),":")
                            +'</span></p>'
                            +orderId
                            +'</div>'
                            +'<div class="cell-aside">'
                            +'<div class="consumptionType '+consumptionTypeClass+'">'+ amount +'</div>'
                            +'</div><div style="clear:both"></div>'
                            +'</div>'
                    }
                    section='<section class="history-group">'+ hearder + groupItem +'</section>' ;
                    sectionHtml=section+sectionHtml;
                }
                $("main section").after(sectionHtml);
                $(".transfer").parent().parent(".group-item").addClass("makeOver");
                //转让明细
                // var check = "<div class='checkTransfer'><a href='javascript:void(0)''>查看转让明细</a><div class='triangle-down'></div></div>";
                // $(".makeOver").after(check);
                for (var i=0;i<$(".cell-main").length;i++) {
                    var height = $(".cell-main:eq("+ i +")").height();
                    $(".consumptionType:eq("+ i +")").css({
                        "height":height+'px',
                        "line-height":height+'px'
                    })
                }
            }
            else {
                $("main").html(hasBackground('该抵用券没有消费记录','30%'));
            }
        }
    });

    $(".yes").on("click",function () {
        console.log($(this).attr("id"));
        var sell = $(this).attr("id").match(/\d/g).join("");
        console.log(sell);                                              
        $.post("/trade/h5/selling/cancel", { data: JSON.stringify({ "sellingid": sell }) }, function (data) {
            if (data.sc == 0) {//取消成功
                $(".popCancel").hide();
                $(".popSuccess").show();
                $(".tcBack").show();
                $(".popSuccess p").html("取消成功，冻结的资金或消费金将在2个小时内返还到您的几何会员账户");
                ShowDiv();
               // alert("取消成功，冻结的资金或消费金将在2个小时内返还到您的几何会员账户");
                var getCouponId;
                $("#"+sell).parent(".item").addClass("transactionEnd");
                $(".transactionEnd").remove();

            } else if (data.sc == "TRADE-1002") {//无法取消,冻结
                $(".popCancel").hide();
                $(".popSuccess").show();
                $(".tcBack").show();
                $(".popSuccess p").html("有人正在购买你的消费金，暂无法取消交易，请稍后尝试");
                ShowDiv();
            } else {
                $(".popCancel").hide();
                $(".popSuccess").show();
                $(".tcBack").show();
                $(".popSuccess p").html("对不起，此次取消失败，请稍后尝试");
                ShowDiv();
            }
            if ($(".item").length == 0) {
                $(".transactionIng").hide();
            } else if ($(".item").length > 0) {
                $(".transactionIng").show();
            }   
        });
    });
    $(".konw").click(function () {
        $(".popSuccess").hide();
        $(".tcBack").hide();
        CloseDiv();
    })
    $(".wrong").on("click",function () {
        $(".popCancel").hide();
        $(".tcBack").hide();
        CloseDiv();
    })
//显示转让明细
    $("body").on("click",".checkTransfer",function () {
        console.log("aaa");
        $(".checkDetail").show();
        $(".tcBack").show();
        ShowDiv();
    });
    $(".checkDetailButtom").click(function () {
        $(".checkDetail").hide();
        $(".tcBack").hide();
        CloseDiv();
    });
});

function getRecList(pageno, pagecnt,couponid) {//获取转让记录列表的方法
    $.post('/trade/h5/selling/record', { data: JSON.stringify({ "pageno": pageno, "pagecnt": pagecnt,"couponId":couponid}) }, function (data) {
        console.log(data);
        $.each(data.data, function (i) {
                rExpireTime = parseInt(data.data[i].expiredTime),
                rAvailAmount = parseInt(data.data[i].availableAmount),
                rSellAmount = parseInt(data.data[i].sellAmount),
                rLockAmount = parseInt(data.data[i].lockAmount),
                rSell = rAvailAmount + rSellAmount + rLockAmount,
                rPrice = parseInt(data.data[i].price),
                rPriceType = data.data[i].priceType,
                rPointsPrice = data.data[i].pointsPrice,
                rSold = parseInt(data.data[i].sellPrice),
                rServiceCharge = parseInt(data.data[i].serviceCharge),
                rStatus = data.data[i].status,
                sellingId = data.data[i].sellingId;
                pointsPrice(priceType);

            var record = '<div class="item"> <div class="itemLeft">转让额度<div><span>' + rSell / 100 + '</span></div></div><div class="itemCentre" id='+ sellingId +'><ul class="description '+ sellingId +'"><ul class="couponTrades"></ul><li><span class="couponTradesTxt">转让总价:</span><span>' + pointsPrice(rPriceType) + '</span></li><li><span class="couponTradesTxt">已成交:</span><span>' + rSellAmount / 100 + '</span></li><li><span class="couponTradesTxt">成交总价:</span><span>' + priceType(rPriceType, rSold) + '</span></li><li><span class="couponTradesTxt">交易服务费:</span><span>' + priceType(rPriceType, rServiceCharge) + '</span></li> <li class="effective"><span class="couponTradesTxt">转让截止时间：</span><time><span class="expireTime">' + expire(rExpireTime) + '</span></time></li></ul></div></div>';
            $('.recList>div').append(record);
            $(tradeStatus(rStatus)).insertBefore("."+sellingId);
            if (rStatus == 0) {
                $("#"+sellingId).after('<div class="itemRight cancel"><a href="javascript:;">取消交易</a></div>');
                $(".cancel").on("click", function () {//点击取消交易
                    $(".popCancel").show();
                    $(".popCancel span").html($(this).parent(".couponTrades").siblings(".couponName").html());
                    $(".tcBack").show();
                    var id = $(this).prev().attr("id");
                    $(".yes").attr("id", "num" + id);
                    ShowDiv();
                });
            } else {
                $("#"+sellingId).parent(".item").addClass("transactionEnd");
                $(".transactionEnd").remove();
            }

            if ($(".item").length == 0) {
                $(".transactionIng").hide();
            } else if ($(".item").length > 0) {
                $(".transactionIng").show();
            }
        });
    });


}


//可调用方法

function priceType(priceType, price) {//判断是现金交易还是积分
    if (priceType == 0) {//现金
        return "&yen" + price / 100;
    } else if (priceType == 1) {//积分
        return price + "积分";
    }
}

function expire(expire) {//出售截止时间的判断
    if (expire) {
        return getDate(expire);
    } else {
        return "<span class='soldOut'>卖完为止</span>";
    }
}

function getDate(time) {//将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}
function tradeStatus(status) {//交易状态的判断
    if (status == 0) {
        return "<p class='waiting'>转让交易中</p>"
    } else if (status == 4) {
        return "<p class='ok'>已取消</p>"
    } else if (status == 5) {
        return "<p class='ok'>已转让</p>"
    }
}
//获取url的参数
function GetParams() {
    var queryString = window.location.search; //获取url中"?"符后的字串
    var params = {};
    if (queryString.indexOf("?") != -1) {
        queryString = queryString.substr(1);
        paramArray = queryString.split("&");
        for(var i = 0; i < paramArray.length; i ++) {
            kv = paramArray[i].split("=");
            params[kv[0]] = kv[1]
        }
    }
    return params;
}
function pointsPrice(priceType) {//出售总价判断
    if (priceType == 0) {//现金
        return "&yen" + rPrice / 100;
    } else if (priceType == 1) {//积分
        return rPointsPrice + "积分";
    }
}
//格式化时间戳  
function getDate(time) {//将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}
//禁用触摸事件
function ShowDiv() {
    window.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        return false;
    }
}
//解除禁止触摸事件
function CloseDiv() {
    window.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = true;
        e.stopPropagation && e.stopPropagation();
        return true;
    }
}