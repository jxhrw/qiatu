$(document).ready(function(){
    var url="/coupon/h5/record";
    var data={"couponCode":GetParams().code};
    $.post(url,{data:JSON.stringify(data)},function(res){
        console.log(res);
        if(res.sc==0) {
            $(".card-name").html(res.data.couponBaseInfo.couponName);
            $(".card-code span").html(res.data.couponCode);
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
                                consumptionType='&nbsp;转换<br>&nbsp;支付';
                                consumptionTypeClass='duihuan';
                                break;
                            case "11":
                                consumptionType='&nbsp;兑换<br>&nbsp;积分';
                                consumptionTypeClass='duihuan';
                                break;
                            case "12":
                                consumptionType='&nbsp;积分<br>&nbsp;兑换';
                                consumptionTypeClass='duihuan';
                                break;
                            case "13":
                                consumptionType='转让';
                                consumptionTypeClass='zhusu';
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
                        }
                        var changeMoneyClass,amount;//金额改变时的颜色
                        if(parseInt(recordInfo[key][i].amount)>=0){
                            changeMoneyClass="";
                            amount='+'+recordInfo[key][i].amount/100;
                        }else {
                            changeMoneyClass="red";
                            amount=recordInfo[key][i].amount/100
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
                        if(recordInfo[key][i].recordType=="7" || recordInfo[key][i].recordType=="47" || recordInfo[key][i].recordType=="1" || recordInfo[key][i].recordType=="41"){
                            amountAndBalance='';
                        }
                        else if(recordInfo[key][i].recordType=="5" || recordInfo[key][i].recordType=="45"){
                            amountAndBalance='<p class="order-amount">'
                                +'<span class="'+changeMoneyClass+'">'+ amount +'</span></p>';
                        }
                        else {
                            var remain;
                            if(undefined==recordInfo[key][i].remain){
                                remain=0;
                            }else {
                                remain=recordInfo[key][i].remain;
                            }
                            amountAndBalance='<p class="order-amount">'
                                +'<span class="'+changeMoneyClass+'">'+ amount +'</span></p>'
                                +'<p class="card-balance">'
                                +'<span class="field-label">余额:</span>'
                                +'<span class="field-content">'
                                +'<span class="rmb"></span>'+remain/100
                                +'</span>'
                                +'</p>';
                        }
                        groupItem+='<div class="group-item">'
                            +'<div class="cell-aside">'
                            +'<div class="consumptionType '+consumptionTypeClass+'">'+ consumptionType +'</div>'
                            +'</div>'
                            +'<div class="cell-main">'
                            +amountAndBalance
                            +'<p class="order-date">'
                            +'<span class="field-label">日期:</span>'
                            +newFormatStrDateNoYear(new Date(parseInt(recordInfo[key][i].createTime)),"/")+' &nbsp;&nbsp;&nbsp;&nbsp; '+ timeFormatSecond(new Date(parseInt(recordInfo[key][i].createTime)),":")
                            +'</p>'
                            +orderId
                            +'</div>'
                            +'</div>'
                    }
                    section='<section class="history-group">'+ hearder + groupItem +'</section>';
                    //$("main").append(section);
                    sectionHtml=section+sectionHtml;
                }
                $("main").html(sectionHtml);
            }
            else {
                $("main").html(hasBackground('该抵用券没有消费记录','30%'));
            }
        }
    });
});