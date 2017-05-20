var checkin=parseInt(GetParams().checkin);//入住时间
var checkout=parseInt(GetParams().checkout);//离开时间
var roombook={productId:GetParams().id,checkin:checkin,checkout:checkout,quantity:1,"paymentInfoList":[]};//订房所需数据
var productPrice;//总价
var productPiontPrice;//积分总价
var roomPayAmount;//订房应付
var payPointAmounts;//积分支付
var unitPrice;//单价
var unitPricePoint;//积分单价
//var selectedCouponArray=[];//已选礼券和优惠券
var bookingPayments=[];//已选资产
var nights;//订房晚数
//var cashPointsPaymentInfo=0;//是否积分抵现,0-没选，{}-已选
var canCashPoint=0;//积分可抵现总额
var objectType;//产品类型
var typeLast=[];//众享权益
//var cashPointsAmount;
var tolAmount;//库存
var canBuyQuantity;//个人最大购买量
var maxBuyQuantity;
var priceType=0;//商品定价0-现金，1-积分；默认现金
var buyPointsId;
var atidcode=[1,4,"52ac-f76d-804a-9f7c"];
var assetType,couponId,couponCode;
var payments=[];
var productInfo;
var payTypes;//供选择支付方式
var payChannelList;//供选择支付渠道
if(undefined!=atidcode){
    assetType=GetParams().assettype?GetParams().assettype:GetParams().assetType;
    couponId=GetParams().couponid?GetParams().couponid:GetParams().couponId;
    couponCode=GetParams().couponcode?GetParams().couponcode:GetParams().couponCode;
    if(assetType=="undefined"){
        assetType=undefined;
    }
    if(couponId=="undefined"){
        couponId=undefined;
    }
    if(couponCode=="undefined"){
        couponCode=undefined;
    }
}
if(location.href.indexOf("test.jihelife.com")!=-1){
    buyPointsId=51745;
}
if(location.href.indexOf("api.jihelife.com")!=-1){
    buyPointsId=38607;
}

$(document).ready(function(){
    if(sessionStorage.getItem("toOrderLeave")==1){
        sessionStorage.setItem("toOrderLeave",0);
        window.history.back();
    }

    roombookProductData();

    isMember();

    $("#virProQuantity").val("1");
    $(".mainContent").height($(window).height());

    //发验证码
    $("#sendCode").click(function(){
        timee();
    });

    //注册，绑定
    $("#registerBtn").click(function(){
        $("#registerBtn").addClass("no");
        if($(this).html()=="注册"){
            var data={"accountname":$("#registerPhone").val(),"verifycode":$("#registerCode").val()};
            var url='/user/h5/bindmobile';
            if($("#registerPhone").val()=="" || $("#registerCode").val()==""){
                errorPrompt("手机号/验证码必填",2000);
                $("#registerBtn").removeClass("no");
                return;
            }
            $.post(h5orClient(url),{data: JSON.stringify(data)},function(res){
                console.log(res);
                if(res.sc==0){
                    isMember();
                }else {
                    errorPrompt(chinese("系统繁忙"),2000);
                }
                $("#registerBtn").removeClass("no");
            });
        }
        else if($(this).html()=="绑定"){
            var data={"realname":$("#registerName").val()};
            var url='/user/h5/registermember';
            if($("#registerName").val()==""){
                errorPrompt("姓名必填",2000);
                $("#registerBtn").removeClass("no");
                return;
            }
            $.post(h5orClient(url),{data: JSON.stringify(data)},function(res){
                if(res.sc==0){
                    $(".windowBox,.upWindow").hide();
                    isMember();
                }else {
                    errorPrompt(chinese("系统繁忙"),2000);
                }
                $("#registerBtn").removeClass("no");
            });
        }
    });

    //资产选择   oneLine;ul li 本店资产选择;function 取消选择 和 积分兑房
    $("#assets").on("click",".oneLine",function(){
        var $singleAsset=$(this).parents(".singleAsset");
        var $ul=$singleAsset.find("ul");
        var $arrowImg=$(".arrowImg",this);
        if($ul.css("display")=="none"){
            $(".singleAsset ul").hide();
            $(".singleAsset .arrowImg").removeClass("turnUp");
            $arrowImg.addClass("turnUp");
            $ul.show();
        }else {
            $arrowImg.removeClass("turnUp");
            $ul.hide();
        }
    }).on("click","ul li",function(){
        var $li=$(this);
        var $choiceBtn=$li.find(".choiceBtn");
        var this_paymentInfo=JSON.parse($li.find("._paymentInfo").attr("value"));
        var this_rejectCouponCodes=($li.find("._rejectCouponCodes").attr("value") && "undefined"!=$li.find("._rejectCouponCodes").attr("value"))?JSON.parse($li.find("._rejectCouponCodes").attr("value")):[];
        //与交换资产大类互斥
        if($("#exchangeAssets .choice").hasClass("choosed")){
            roombook.paymentInfoList=[];
        }
        if($choiceBtn.hasClass("choosed")){
            removeArrayEle(roombook.paymentInfoList,this_paymentInfo);
        }else {
            roombook.paymentInfoList=roombook.paymentInfoList.concat(this_paymentInfo);
            removeArray(roombook.paymentInfoList,this_rejectCouponCodes);
        }
        personalAssets(roombook);
    }).on("click",".function",function(event){
        event.stopPropagation();
        var $ul=$(this).parents(".singleAsset").find("ul");
        var $li=$ul.find("li");
        if("integralToRoom"==$(".choice",this).attr("id")){
            if($(".choice",this).hasClass("choosed")){
                roombook.paymentInfoList=[];
            }else {
                roombook.paymentInfoList=[{"payType":"3"}]
            }
        }else if(!$(".choice",this).hasClass("choosed")){
            return false;
        }
        $.each($li,function(i){
            var this_paymentInfo=JSON.parse($li.eq(i).find("._paymentInfo").attr("value"));
            removeArrayEle(roombook.paymentInfoList,this_paymentInfo);
        });
        personalAssets(roombook);
    });

    //交换资产选择
    $(".contentBox").on("click","#exchangeAssetsLis li",function(){
        var $li=$(this);
        var $choiceBtn=$li.find(".choice");
        var this_paymentInfo=JSON.parse($li.find("._paymentInfo").attr("value"));
        var this_rejectCouponCodes=($li.find("._rejectCouponCodes").attr("value") && "undefined"!=$li.find("._rejectCouponCodes").attr("value"))?JSON.parse($li.find("._rejectCouponCodes").attr("value")):[];
        //与资产选择大类互斥
        if($("#assets .choice").hasClass("choosed")){
            roombook.paymentInfoList=[];
        }
        if($choiceBtn.hasClass("choosed")){
            removeArrayEle(roombook.paymentInfoList,this_paymentInfo);
        }else {
            roombook.paymentInfoList=roombook.paymentInfoList.concat(this_paymentInfo);
            removeArray(roombook.paymentInfoList,this_rejectCouponCodes);
        }
        personalAssets(roombook);
    });

    //积分抵现
    $("#switchOpen").click(function(){
        if(canCashPoint>0){
            //delete roombook.defaultSelectDiscount;
            $(this).toggleClass("open");
            personalAssets(roombook);
        }
    });

    //创建订单
    $("#createandsubmit").click(function(){
        $("#createandsubmit").addClass("no");
        if(roomPayAmount>0 && priceType=="0"){
            var hasCashPay=0;
            var arr=[{amount:roomPayAmount,paytype:0}];
            $.each(payments,function(i){
                if(payments[i].paytype=="0"){
                    hasCashPay++;
                }
            });
            if(hasCashPay==0){
                payments=payments.concat(arr);
            }
        }
        var roomData;
        if("31"==objectType || "30"==objectType || "40"==objectType){
            roomData = {'productid':GetParams().id,'quantity': roombook.quantity,'amount': productPrice,'comments':$("#virRemarks").val(),'payments': payments};
            if(priceType==1){
                delete roomData.amount;
                roomData.pointamount=productPiontPrice;
            }
            if("40"==objectType){
                if($("#virCusName").val()!="" && $("#virCusPhone").val()!="" && $("#virCusAddress").val()!=""){
                    roomData.customeraddress=$("#virCusName").val()+","+$("#virCusPhone").val()+","+$("#virCusAddress").val();
                }else {
                    errorPrompt("收货信息不足",2000);
                    $("#createandsubmit").removeClass("no");
                    return;
                }
            }
        }
        else{
            roomData = {'productid':GetParams().id,'customername':$("#roomCusName").val(),'customermobile':$("#roomCusPhone").val() ,'checkin': roombook.checkin,'checkout': roombook.checkout,'quantity': roombook.quantity,'amount': productPrice,'comments':$("#roomRemarks").val(),'payments': payments};
        }
        if(priceType==1){
            delete roomData.amount;
            roomData.pointamount=productPiontPrice;
            roomData.assetType=assetType;
            roomData.couponId=couponId;
        }
        roomData.productInfo=productInfo;
        $.post('/order/h5/createandsubmit', {data: JSON.stringify(roomData)},  function(roomress) {
            if(roomress.sc==0){
                sessionStorage.setItem("toOrderLeave",1);
                window.location.href="/html/h5/order/payment.html?orderid="+roomress.data.orderid;
            }else {
                var errorMsg=roomress.ErrorMsg;
                if(errorMsg.indexOf("必须参数")!=-1){
                    errorMsg="缺少信息";
                }
                errorPrompt(chinese(errorMsg),2000);
            }
            $("#createandsubmit").removeClass("no");
        });
    });

    //虚拟产品----------------------------------------------------
    $(".addBtn").on("touchstart",function(){
        var num=parseInt($("#virProQuantity").val())+1;
        $("#virProQuantity").val(num);
        virProChangeQuantity(num);
    });

    $(".redBtn").on("touchstart",function(){
        var num=parseInt($("#virProQuantity").val())-1;
        if(num<1){
            num=1;
        }
        $("#virProQuantity").val(num);
        virProChangeQuantity(num);
    });

    $("#virProQuantity").focus(function(){
        $("#createandsubmit").addClass("no");
    }).blur(function(){
        var num=parseInt($("#virProQuantity").val());
        virProChangeQuantity(num);
        setTimeout(function(){
            $("#createandsubmit").removeClass("no");
        },1000);
    });

    function virProChangeQuantity(num){
        if(maxBuyQuantity!=-1){
            var productId=GetParams().id;
            var dataN="{'productIdList':["+productId+"]}";
            var countList="/order/h5/count";
            $.post(h5orClient(countList),{data:dataN},function(res) {
                var hasBuyQuantity = 0;
                var totalPaidQuantity = res.data[productId].paidQuantity * 1;//购买并支付数量
                if (res.sc == "0") {
                    if (undefined != res.data[productId].mypaidQuantity) {
                        hasBuyQuantity = parseInt(res.data[productId].mypaidQuantity);
                    } else {
                        hasBuyQuantity = 0;
                    }
                } else {
                    hasBuyQuantity = 0;
                }
                canBuyQuantity = maxBuyQuantity - hasBuyQuantity;
                if(num>tolAmount && tolAmount!=-1){//判断是否超出库存
                    errorPrompt("商品库存不足",2000);
                    return;
                }
                if(num>canBuyQuantity && canBuyQuantity!=-1){//判断是否超出个人最大购买数量
                    errorPrompt("每人最多可购买"+maxBuyQuantity+"份",2000);
                    return;
                }
                productPrice=floatFixed2(unitPrice*num);
                if(priceType==1){
                    productPiontPrice=Math.round(unitPricePoint*num);
                }
                if(showCyType=="0" || showCyType=="5"){
                    $("#virProPrice").html(showCyCode+Math.round(showTotalPrice*num)/100+showCyUnit);
                    $("#principal").html(showCyCode+Math.round(showTotalPrice*num)/100+showCyUnit);
                }
                else {
                    $("#virProPrice").html(showCyCode+Math.round(showTotalPrice*num)+showCyUnit);
                    $("#principal").html(showCyCode+Math.round(showTotalPrice*num)+showCyUnit);
                }
                $("#rightsDiv .multiLine").each(function(){
                    var i=$(this).index();
                    $(".rightsUnit",this).html("￥"+floatFixed2(typeLast[i].serviceValue*num/100));
                });
                roombook.quantity=num;
                //roombook.paymentInfoList=selectedCouponArray;
                personalAssets(roombook);
            });
        }else {
            productPrice=floatFixed2(unitPrice*num);
            if(priceType==1){
                productPiontPrice=Math.round(unitPricePoint*num);
            }
            if(showCyType=="0" || showCyType=="5"){
                $("#virProPrice").html(showCyCode+Math.round(showTotalPrice*num)/100+showCyUnit);
                $("#principal").html(showCyCode+Math.round(showTotalPrice*num)/100+showCyUnit);
            }
            else {
                $("#virProPrice").html(showCyCode+Math.round(showTotalPrice*num)+showCyUnit);
                $("#principal").html(showCyCode+Math.round(showTotalPrice*num)+showCyUnit);
            }
            $("#rightsDiv .multiLine").each(function(){
                var i=$(this).index();
                $(".rightsUnit",this).html("￥"+floatFixed2(typeLast[i].serviceValue*num/100));
            });
            roombook.quantity=num;
            //roombook.paymentInfoList=selectedCouponArray;
            personalAssets(roombook);
        }
    }
    //------------------------------------------------------------


    $("#roomNumber").parents(".quota").click(function(){
        $(".windowBox,#roomNumBox").show();
    });

    $("#register").click(function(){
        $(".windowBox,.upWindow").show();
    });

    $("#shadow").click(function(){
        $(".windowBox,.underWindow,.upWindow").hide();
    });

    $("#coupChoose").click(function(){
        $(".useCoupons").hide();
    });

    $("#cashArrow").click(function(){
        $(this).toggleClass("turnUp");
        $("#cashCouponUl").toggle();
    });

    $("#roomArrow").click(function(){
        $(this).toggleClass("turnUp");
        $("#roomCouponUl").toggle();
    });

    //function 订房-------------------------------------------start
    //产品数据数据请求
    function roombookProductData(){
        var productId={id:GetParams().id,checkin:checkin,checkout:checkout};
        if(undefined!=assetType){
            productId.assetType=assetType;
        }
        if(undefined!=couponId){
            productId.couponId=couponId;
        }
        var roomProUrl='/product/h5/query';
        $.post(h5orClient(roomProUrl),{data:JSON.stringify(productId)},function(roomProRes){
            if(roomProRes.sc==0){
                priceType=parseInt(roomProRes.data.productPrice.priceType?roomProRes.data.productPrice.priceType:roomProRes.data.priceType);
                maxBuyQuantity=parseInt(roomProRes.data.maxBuyQuantity);
                unitPrice=parseInt(roomProRes.data.productPrice.totalPrice);
                unitPricePoint=parseInt(roomProRes.data.productPrice.totalPointPrice?roomProRes.data.productPrice.totalPointPrice:0);
                productPrice=unitPrice;
                productPiontPrice=unitPricePoint;
                nights=parseInt((checkout-checkin)/24/3600/1000);
                objectType=roomProRes.data.objectType;
                payTypes=roomProRes.data.payTypes;
                payChannelList=roomProRes.data.payChannelList;
                showCyCode=roomProRes.data.productPrice.showCyCode?roomProRes.data.productPrice.showCyCode:"";
                showCyUnit=roomProRes.data.productPrice.showCyUnit?roomProRes.data.productPrice.showCyUnit:"";
                showTotalPrice=roomProRes.data.productPrice.showTotalPrice?roomProRes.data.productPrice.showTotalPrice:0;
                showCyType=roomProRes.data.productPrice.showCyType?roomProRes.data.productPrice.showCyType:0;//显示金额类型：0-现金，1-积分，4-房券 5-消费金

                var productPriceInfo={
                    priceType:priceType,
                    totalPrice:roomProRes.data.productPrice.totalPrice,
                    dailyPrice:roomProRes.data.productPrice.dailyPrice,
                    totalPointPrice:roomProRes.data.productPrice.totalPointPrice,
                    dailyPointPrice:roomProRes.data.productPrice.dailyPointPrice,
                    pointPriceSrc:roomProRes.data.productPrice.pointPriceSrc,
                    showCyType:roomProRes.data.productPrice.showCyType,
                    showTotalPrice:roomProRes.data.productPrice.showTotalPrice,
                    showCyUnit:roomProRes.data.productPrice.showCyUnit,
                    showCyCode:roomProRes.data.productPrice.showCyCode
                };
                productInfo={
                    hotelId:roomProRes.data.hotelId,
                    productId:roomProRes.data.productId,
                    productType:roomProRes.data.productType,
                    cashExchFlag:roomProRes.data.cashExchFlag,
                    payTypes:roomProRes.data.payTypes,
                    pointPayTypes:roomProRes.data.pointPayTypes,
                    productPrice:productPriceInfo,
                    jiheBusinessMember:roomProRes.data.jiheBusinessMember
                };

                $("#roomProName").html(roomProRes.data.productName);
                $("#roomCheckIn").html(newFormatStrDateNoYear(new Date(checkin),"/"));
                $("#roomCheckOut").html(newFormatStrDateNoYear(new Date(checkout),"/"));
                $("#nights").html(nights);

                if("31"==objectType || "30"==objectType || "40"==objectType){
                    var serviceInfoList=roomProRes.data.serviceInfoList;
                    var rightHtml="";
                    if("31"==objectType){
                        $("#virtualPro,#fillProInfo,#lock,#rights,#assets,.hide").show();
                        $("#virSubHeading").html("您选择了众享方案");
                        for(var i=0;undefined!=serviceInfoList && i<serviceInfoList.length;i++){
                            //type=3消费金，4利息
                            if(serviceInfoList[i].type=="4" || serviceInfoList[i].type=="3"){
                                var have=0;
                                for(var j=0;j<typeLast.length;j++){
                                    if(typeLast[j].type==serviceInfoList[i].type){
                                        typeLast[j].serviceValue=parseInt(typeLast[j].serviceValue)+parseInt(serviceInfoList[i].serviceValue);
                                        have++;
                                    }
                                }
                                if(have==0){
                                    typeLast.push({"type":serviceInfoList[i].type,"serviceName":serviceInfoList[i].serviceName,"serviceValue":serviceInfoList[i].serviceValue});
                                }
                            }
                        }
                        if(typeLast.length>0){
                            for(var i=0;i<typeLast.length;i++){
                                rightHtml+='<div class="clearfix multiLine"><div class="function gray fl"><span>'+ typeLast[i].serviceName +'</span></div><div class="quota fr"><span class="rightsUnit">￥'+ typeLast[i].serviceValue/100 +'</span></div></div>';
                            }
                            $("#rightsDiv").html(rightHtml);
                        }else {
                            $("#rights").hide();
                        }
                    }
                    else {
                        $("#virtualPro,#fillProInfo,#assets,.hide").show();
                    }
                    if("40"==objectType){
                        $(".addressInfo").show();
                    }
                    $("#virProName").html(roomProRes.data.productName);
                    if(priceType==1){
                        $(".hide").hide();
                    }
                    if(showCyType=="0" || showCyType=="5"){
                        $("#virProUnit").html(showCyCode+Math.round(showTotalPrice)/100+showCyUnit);
                        $("#virProPrice").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)/100+showCyUnit);
                        $("#principal").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)/100+showCyUnit);
                    }
                    else {
                        $("#virProUnit").html(showCyCode+Math.round(showTotalPrice)+showCyUnit);
                        $("#virProPrice").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)+showCyUnit);
                        $("#principal").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)+showCyUnit);
                    }

                    $("#lockTime").html(roomProRes.data.additionalInfo);
                    //roombook.paymentInfoList=selectedCouponArray;
                    personalAssets(roombook,"first");
                }
                else{
                    $("#nonMember,#fillRoomInfo,#assets,.hide").show();
                    tolAmount=parseInt(roomProRes.data.tolAmount);
                    if(undefined==roomProRes.data.tolAmount|| roomProRes.data.tolAmount==1){
                        $("#roomNumber").val("仅剩1间").parents(".quota").addClass("no");
                    }else {
                        var roomNumberLi="";
                        $("#roomNumber").val("1间");
                        for(var i=1;i<=roomProRes.data.tolAmount && i<=10; i++){
                            roomNumberLi+="<li value='"+i+"'>"+i+"间</li>";
                        }
                        $(".roomNumberUl").html(roomNumberLi);
                    }
                    //roombook.paymentInfoList=selectedCouponArray;
                    personalAssets(roombook,"first");
                }

                if(roomProRes.data.tolAmount=="0"){
                    $("#createandsubmit").addClass("unSubmit");
                }

                //选中房间数
                $(".roomNumberUl li").on("click",function(){
                    $("#roomNumber").val($(this).html());
                    $(".windowBox,.underWindow,.upWindow").hide();
                    roombook.quantity=parseInt($(this).attr("value"));
                    productPrice=unitPrice*roombook.quantity;
                    productPiontPrice=unitPricePoint*roombook.quantity;
                    //清理掉房券-start
                    /*$("#roomVouchers").removeClass("choosed");
                    cancelAllVouchers("#roomCouponUl li");
                    mutexDisplay("#roomCouponUl li",".choice2");
                    coupHasSelected();*/
                    ////清理掉房券-end
                    //roombook.paymentInfoList=selectedCouponArray;
                    personalAssets(roombook);
                });
            }
            else {
                errorPrompt(chinese(roomProRes.ErrorMsg),2000);
            }
        });
    }

    //资产选择展示
    function assetsShow(couponDisplayList,ulId,choiceBtn){
        $.each(couponDisplayList,function(i){
            if(couponDisplayList[i].isSelected){
                roombook.paymentInfoList=roombook.paymentInfoList.concat(couponDisplayList[i].paymentInfoList);
                $(ulId+" li").eq(i).find(choiceBtn).addClass("choosed");
                var dikou;
                var action="抵扣";
                var deductionDesc="";
                if("#exchangeAssetsLis"==ulId){
                    if(couponDisplayList[i].couponBaseInfo.couponType=="2" || couponDisplayList[i].couponBaseInfo.couponType=="3"){
                        deductionDesc="本次支付：￥"+((couponDisplayList[i].paidFaceValue)?couponDisplayList[i].paidFaceValue/100:0);
                    }else {
                        deductionDesc="本次支付："/*+((couponDisplayList[i].paidFaceValue)?couponDisplayList[i].paidFaceValue:0)*/+"1张";
                    }
                }else {
                    action='扣减';
                }
                if(showCyType=="0"){
                    dikou=showCyCode+couponDisplayList[i].costAmount/100;
                }else {
                    if(showCyType=="1"){
                        dikou=showCyCode+((couponDisplayList[i].costPoints)?couponDisplayList[i].costPoints:0)+showCyUnit;
                    }
                    else if(showCyType=="5"){
                        action="扣减";
                        deductionDesc="";
                        dikou="￥"+((couponDisplayList[i].paidFaceValue)?couponDisplayList[i].paidFaceValue/100:0)+showCyUnit;
                    }
                    else{
                        dikou=((couponDisplayList[i].paidFaceValue)?couponDisplayList[i].paidFaceValue:0)+showCyUnit;
                    }
                }
                if($(ulId+" li").eq(i).find(".deduction").length==0){
                    $(ulId+" li").eq(i).append('<div class="deduction"><span class="deductionDesc">'+deductionDesc+'</span>&nbsp;&nbsp; '+action+' <span class="deductAmount">'+ dikou +'</span></div>');
                }else {
                    $(ulId+" li").eq(i).find(".deductionDesc").html(deductionDesc);
                    $(ulId+" li").eq(i).find(".deductAmount").html(dikou);
                }
            }else {
                $(ulId+" li").eq(i).find(choiceBtn).removeClass("choosed");
                $(ulId+" li").eq(i).find(".deduction").remove();
            }
        });
    }
    //资产选择隐藏
    function assetsHide(ulId){
        $(ulId+" .choiceBtn").removeClass("choosed");
        $(ulId+" li").find(".deduction").remove();
    }

    //个人资产
    function personalAssets(assetsData,firstLoad){
        var assetsUrl='/pay/h5/payable/booking';
        if(undefined!=assetType){
            assetsData.assetType=assetType;
        }
        if(undefined!=couponId){
            assetsData.couponId=couponId;
        }
        if(undefined!=couponCode){
            assetsData.couponCode=couponCode;
        }
        assetsData.productInfo=productInfo;
        if(undefined!=assetsData.checkin && (assetsData.checkin==null || isNaN(assetsData.checkin))){
            delete assetsData.checkin;
        }
        if(undefined!=assetsData.checkout && (assetsData.checkout==null || isNaN(assetsData.checkout))){
            delete assetsData.checkout;
        }
        $.post(h5orClient(assetsUrl),{data:JSON.stringify(assetsData)},function(assetsRes){
            if(assetsRes.sc==0){
                if(!assetsRes.data.membershipCardInfo && !assetsRes.data.cashCouponInfo && !assetsRes.data.roomCouponInfo && !assetsRes.data.discountCouponInfo && !assetsRes.data.redPacketInfo && !assetsRes.data.roomPointsInfo){
                    $("#assets").hide();
                }
                if(firstLoad=="first"){
                    //会员卡
                    if(assetsRes.data.membershipCardInfo){
                        $("#membershipCardInfo").parents(".singleAsset").show();
                        $("#mbCardsInfo").html(assetsRes.data.membershipCardInfo.couponDesc);
                        var membershipCardList=assetsRes.data.membershipCardInfo.couponDisplayList;
                        var membershipCardUl='';
                        $.each(membershipCardList,function(i){
                            var couponName=membershipCardList[i].couponBaseInfo.couponName;
                            var effectiveTime=parseInt(membershipCardList[i].couponBaseInfo.effectiveTime);
                            var expireTime=parseInt(membershipCardList[i].couponBaseInfo.expireTime);
                            var remain,discount;
                            var paymentInfo=JSON.stringify(membershipCardList[i].paymentInfoList);
                            var rejectCouponCodes=JSON.stringify(membershipCardList[i].rejectCouponCodes);
                            var rejectPayTypes=JSON.stringify(membershipCardList[i].rejectPayTypes);
                            $.each(membershipCardList[i].subCouponList,function(j){
                                if(membershipCardList[i].subCouponList[j].couponBaseInfo.couponType=="2"){
                                    remain=membershipCardList[i].subCouponList[j].remain;
                                }
                                if(membershipCardList[i].subCouponList[j].couponBaseInfo.couponType=="5"){
                                    discount=membershipCardList[i].subCouponList[j].faceValue;
                                }
                            });
                            membershipCardUl+='<li>'
                                +'<span class="_paymentInfo" value='+ paymentInfo +'></span>'
                                +'<span class="_rejectCouponCodes" value='+ rejectCouponCodes +'></span>'
                                +'<span class="_rejectPayTypes" value='+ rejectPayTypes +'></span>'
                                    //+'<span class="choiceBtn"></span>'
                                +'<div class="couponCardName">'+ couponName +' <span>'+ discount/10 +'折</span><span class="choiceBtn"></span></div>'
                                +'<div class="other"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'
                                +'<div class="other"><pre>余额：　</pre> <span>￥'+ remain/100 +'</span></div>'
                                    //+'<div class="deduction">抵扣 <span class="deductAmount">￥200</span></div>'
                                +'</li>';
                        });
                        $("#membershipCardInfo").html(membershipCardUl);
                    }
                    //消费金
                    if(assetsRes.data.cashCouponInfo){
                        $("#cashCouponInfo").parents(".singleAsset").show();
                        $("#cashCouponsInfo").html(assetsRes.data.cashCouponInfo.couponDesc);
                        var cashCouponList=assetsRes.data.cashCouponInfo.couponDisplayList;
                        var cashCouponUl='';
                        $.each(cashCouponList,function(i){
                            var couponName=cashCouponList[i].couponBaseInfo.couponName;
                            var effectiveTime=parseInt(cashCouponList[i].couponBaseInfo.effectiveTime);
                            var expireTime=parseInt(cashCouponList[i].couponBaseInfo.expireTime);
                            var remain=cashCouponList[i].remain;
                            var paymentInfo=JSON.stringify(cashCouponList[i].paymentInfoList);
                            var rejectCouponCodes=JSON.stringify(cashCouponList[i].rejectCouponCodes);
                            var rejectPayTypes=JSON.stringify(cashCouponList[i].rejectPayTypes);
                            cashCouponUl+='<li>'
                                +'<span class="_paymentInfo" value='+ paymentInfo +'></span>'
                                +'<span class="_rejectCouponCodes" value='+ rejectCouponCodes +'></span>'
                                +'<span class="_rejectPayTypes" value='+ rejectPayTypes +'></span>'
                                    //+'<span class="choiceBtn"></span>'
                                +'<div class="couponCardName">'+ couponName +'<span class="choiceBtn"></span></div>'
                                /*+'<div class="other"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'*/
                                +'<div class="other"><pre>余额：　</pre> <span>￥'+ remain/100 +'</span></div>'
                                    //+'<div class="deduction">抵扣 <span class="deductAmount">￥200</span></div>'
                                +'</li>';
                        });
                        $("#cashCouponInfo").html(cashCouponUl).find(".choiceBtn").css("bottom","-0.3rem");
                    }
                    //房券
                    if(assetsRes.data.roomCouponInfo){
                        $("#roomCouponInfo").parents(".singleAsset").show();
                        $("#roomCouponsInfo").html(assetsRes.data.roomCouponInfo.couponDesc);
                        var roomCouponList=assetsRes.data.roomCouponInfo.couponDisplayList;
                        var roomCouponUl='';
                        $.each(roomCouponList,function(i){
                            var couponName=roomCouponList[i].couponBaseInfo.couponName;
                            var effectiveTime=parseInt(roomCouponList[i].couponBaseInfo.effectiveTime);
                            var expireTime=parseInt(roomCouponList[i].couponBaseInfo.expireTime);
                            var applyNights=roomCouponList[i].couponBaseInfo.applyNights;
                            var paymentInfo=JSON.stringify(roomCouponList[i].paymentInfoList);
                            var rejectCouponCodes=JSON.stringify(roomCouponList[i].rejectCouponCodes);
                            var rejectPayTypes=JSON.stringify(roomCouponList[i].rejectPayTypes);
                            roomCouponUl+='<li>'
                                +'<span class="_paymentInfo" value='+ paymentInfo +'></span>'
                                +'<span class="_rejectCouponCodes" value='+ rejectCouponCodes +'></span>'
                                +'<span class="_rejectPayTypes" value='+ rejectPayTypes +'></span>'
                                    //+'<span class="choiceBtn"></span>'
                                +'<div class="couponCardName">'+ couponName +'<span class="choiceBtn"></span></div>'
                                +'<div class="other"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'
                                +'<div class="other"><pre>晚数：　</pre> <span>'+ applyNights +'晚</span></div>'
                                    //+'<div class="deduction">抵扣 <span class="deductAmount">￥200</span></div>'
                                +'</li>';
                        });
                        $("#roomCouponInfo").html(roomCouponUl);
                    }
                    //折扣券
                    if(assetsRes.data.discountCouponInfo){
                        $("#discountCouponInfo").parents(".singleAsset").show();
                        $("#discCouponsInfo").html(assetsRes.data.discountCouponInfo.couponDesc);
                        var discountCouponList=assetsRes.data.discountCouponInfo.couponDisplayList;
                        var discountCouponUl='';
                        $.each(discountCouponList,function(i){
                            var couponName=discountCouponList[i].couponBaseInfo.couponName;
                            var effectiveTime=parseInt(discountCouponList[i].couponBaseInfo.effectiveTime);
                            var expireTime=parseInt(discountCouponList[i].couponBaseInfo.expireTime);
                            var discount=discountCouponList[i].faceValue;
                            var paymentInfo=JSON.stringify(discountCouponList[i].paymentInfoList);
                            var rejectCouponCodes=JSON.stringify(discountCouponList[i].rejectCouponCodes);
                            var rejectPayTypes=JSON.stringify(discountCouponList[i].rejectPayTypes);
                            discountCouponUl+='<li>'
                                +'<span class="_paymentInfo" value='+ paymentInfo +'></span>'
                                +'<span class="_rejectCouponCodes" value='+ rejectCouponCodes +'></span>'
                                +'<span class="_rejectPayTypes" value='+ rejectPayTypes +'></span>'
                                    //+'<span class="choiceBtn"></span>'
                                +'<div class="couponCardName">'+ couponName +'<span class="choiceBtn"></span></div>'
                                +'<div class="other"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'
                                +'<div class="other"><pre>折扣：　</pre> <span>'+ discount/10 +'折</span></div>'
                                    //+'<div class="deduction">抵扣 <span class="deductAmount">￥200</span></div>'
                                +'</li>';
                        });
                        $("#discountCouponInfo").html(discountCouponUl);
                    }
                    //红包
                    if(assetsRes.data.redPacketInfo){
                        $("#redPacketInfo").parents(".singleAsset").show();
                        $("#envelopesInfo").html(assetsRes.data.redPacketInfo.couponDesc);
                        var redPacketList=assetsRes.data.redPacketInfo.couponDisplayList;
                        var redPacketUl='';
                        $.each(redPacketList,function(i){
                            var couponName=redPacketList[i].couponBaseInfo.couponName;
                            var effectiveTime=parseInt(redPacketList[i].couponBaseInfo.effectiveTime);
                            var expireTime=parseInt(redPacketList[i].couponBaseInfo.expireTime);
                            var remain=redPacketList[i].faceValue;
                            var paymentInfo=JSON.stringify(redPacketList[i].paymentInfoList);
                            var rejectCouponCodes=JSON.stringify(redPacketList[i].rejectCouponCodes);
                            var rejectPayTypes=JSON.stringify(redPacketList[i].rejectPayTypes);
                            redPacketUl+='<li>'
                                +'<span class="_paymentInfo" value='+ paymentInfo +'></span>'
                                +'<span class="_rejectCouponCodes" value='+ rejectCouponCodes +'></span>'
                                +'<span class="_rejectPayTypes" value='+ rejectPayTypes +'></span>'
                                    //+'<span class="choiceBtn"></span>'
                                +'<div class="couponCardName">'+ couponName +'<span class="choiceBtn"></span></div>'
                                +'<div class="other"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'
                                +'<div class="other"><pre>余额：　</pre> <span>￥'+ remain/100 +'</span></div>'
                                    //+'<div class="deduction">抵扣 <span class="deductAmount">￥200</span></div>'
                                +'</li>';
                        });
                        $("#redPacketInfo").html(redPacketUl);
                    }
                    //积分兑房
                    if(assetsRes.data.roomPointsInfo){
                        $("#roomPointsInfo").html(assetsRes.data.roomPointsInfo.pointsExchangeDesc).parents(".singleAsset").show();
                    }
                    //交换资产
                    if(assetsRes.data.jiheXCouponInfo){
                        $("#exchangeAssets").show();
                        var jiheXCouponList=assetsRes.data.jiheXCouponInfo.couponDisplayList;
                        var jiheXCouponUl='';
                        $.each(jiheXCouponList,function(i){
                            var couponName=jiheXCouponList[i].couponBaseInfo.couponName;
                            var effectiveTime=parseInt(jiheXCouponList[i].couponBaseInfo.effectiveTime);
                            var expireTime=parseInt(jiheXCouponList[i].couponBaseInfo.expireTime);
                            var discount=jiheXCouponList[i].faceValue;
                            var paymentInfo=JSON.stringify(jiheXCouponList[i].paymentInfoList);
                            var rejectCouponCodes=JSON.stringify(jiheXCouponList[i].rejectCouponCodes);
                            var rejectPayTypes=JSON.stringify(jiheXCouponList[i].rejectPayTypes);
                            var couponType=jiheXCouponList[i].couponBaseInfo.couponType;
                            var jiheXCouponLi;
                            //couponType 1房券，2消费金，3会员卡
                            if(couponType=="1"){
                                jiheXCouponLi='<div class="otherEc"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'
                                    +'<div class="otherEc"><pre>晚数：　</pre> <span>'+ jiheXCouponList[i].couponBaseInfo.applyNights +'晚</span></div>';
                            }else if(couponType=="2" || couponType=="3"){
                                var remain;
                                if(couponType=="3"){
                                    $.each(jiheXCouponList[i].subCouponList,function(j){
                                        if(jiheXCouponList[i].subCouponList[j].couponBaseInfo.couponType=="2"){
                                            remain=jiheXCouponList[i].subCouponList[j].remain;
                                        }
                                    });

                                }else {
                                    remain=jiheXCouponList[i].remain;
                                }
                                if(!jiheXCouponList[i].couponBaseInfo.masterCardId){
                                    jiheXCouponLi='<div class="otherEc"><pre>余额：　</pre> <span>￥'+ remain/100 +'</span></div>';
                                }else {
                                    jiheXCouponLi='<div class="otherEc"><pre>有效期：</pre> <span>'+ newFormatStrDate(new Date(effectiveTime),"/") +'-'+ newFormatStrDate(new Date(expireTime),"/") +'</span></div>'
                                        +'<div class="otherEc"><pre>余额：　</pre> <span>￥'+ remain/100 +'</span></div>';
                                }
                            }
                            jiheXCouponUl+='<li>'
                                +'<span class="_paymentInfo" value='+ paymentInfo +'></span>'
                                +'<span class="_rejectCouponCodes" value='+ rejectCouponCodes +'></span>'
                                +'<span class="_rejectPayTypes" value='+ rejectPayTypes +'></span>'
                                +'<span class="choice"></span>'
                                +'<div class="couponCardNameEc">'+ couponName +'</div>'
                                + jiheXCouponLi
                                    //+'<div class="deduction">抵扣 <span class="deductAmount">￥200</span></div>'
                                +'</li>';
                        });
                        $("#exchangeAssetsLis").html(jiheXCouponUl);
                    }
                    //积分抵现
                    if(assetsRes.data.cashPointsInfo){
                        $("#pointsToCashDesc").parents(".singleAsset").show().parents("#integralAssets").show().find(".subHeading").html("积分抵现");

                    }
                    //积分支付 默认选择
                    if(assetsRes.data.pointsFixedInfo){
                        $("#myPoints").parents(".singleAsset").show().parents("#integralAssets").show().find(".subHeading").html("积分支付");
                    }

                    if(buyPointsId==GetParams().id && undefined!=GetParams().needpoints){
                        var num=Math.ceil(GetParams().needpoints/100);
                        $("#virProQuantity").val(num);
                        virProChangeQuantity(num);
                    }
                }

                roombook.defaultSelectDiscount=0;
                roombook.paymentInfoList=[];
                if(assetsRes.data.paymentInfoList){
                    payments=assetsRes.data.paymentInfoList;
                }else {
                    payments=[];
                }
                //积分支付 和 积分抵现选中 没有data.paymentInfoList 其他资产会有
                //是否积分抵现
                if(assetsRes.data.cashPointsInfo && assetsRes.data.cashPointsInfo.paymentInfoList && $("#switchOpen").hasClass("open")){
                    payments=payments.concat(assetsRes.data.cashPointsInfo.paymentInfoList);
                }
                //是否积分支付
                if(assetsRes.data.pointsFixedInfo && assetsRes.data.pointsFixedInfo.paymentInfoList && assetsRes.data.pointsFixedInfo.isSelected){
                    payments=payments.concat(assetsRes.data.pointsFixedInfo.paymentInfoList);
                }
                var membershipCardAmount=0,
                    couponAmount= 0,
                    roomCouponAmount= 0,
                    discountCouponAmount= 0,
                    redPacketAmount= 0,
                    roomPointsAmount= 0,
                    jiheXCouponAmount= 0,
                    cashPointsAmount=0,
                    payPointAmounts=0;
                //会员卡展示
                if(assetsRes.data.membershipCardInfo && assetsRes.data.membershipCardInfo.isSelected){
                    membershipCardAmount=assetsRes.data.membershipCardInfo.selectedCouponValue;
                    var couponDisplayList=assetsRes.data.membershipCardInfo.couponDisplayList;
                    $("#mbCards").addClass("choosed");
                    assetsShow(couponDisplayList,"#membershipCardInfo",".choiceBtn");
                }else {
                    $("#mbCards").removeClass("choosed");
                    assetsHide("#membershipCardInfo");
                }
                //消费金展示
                if(assetsRes.data.cashCouponInfo && assetsRes.data.cashCouponInfo.isSelected){
                    couponAmount=assetsRes.data.cashCouponInfo.selectedCouponValue;
                    var couponDisplayList=assetsRes.data.cashCouponInfo.couponDisplayList;
                    $("#cashCoupons").addClass("choosed");
                    assetsShow(couponDisplayList,"#cashCouponInfo",".choiceBtn");
                }else {
                    $("#cashCoupons").removeClass("choosed");
                    assetsHide("#cashCouponInfo");
                }
                //房券展示
                if(assetsRes.data.roomCouponInfo && assetsRes.data.roomCouponInfo.isSelected){
                    roomCouponAmount=assetsRes.data.roomCouponInfo.selectedCouponValue;
                    var couponDisplayList=assetsRes.data.roomCouponInfo.couponDisplayList;
                    $("#roomCoupons").addClass("choosed");
                    assetsShow(couponDisplayList,"#roomCouponInfo",".choiceBtn");
                }else {
                    $("#roomCoupons").removeClass("choosed");
                    assetsHide("#roomCouponInfo");
                }
                //折扣券展示
                if(assetsRes.data.discountCouponInfo && assetsRes.data.discountCouponInfo.isSelected){
                    discountCouponAmount=assetsRes.data.discountCouponInfo.selectedCouponValue;
                    var couponDisplayList=assetsRes.data.discountCouponInfo.couponDisplayList;
                    $("#discCoupons").addClass("choosed");
                    assetsShow(couponDisplayList,"#discountCouponInfo",".choiceBtn");
                }else {
                    $("#discCoupons").removeClass("choosed");
                    assetsHide("#discountCouponInfo");
                }
                //红包展示
                if(assetsRes.data.redPacketInfo && assetsRes.data.redPacketInfo.isSelected){
                    redPacketAmount=assetsRes.data.redPacketInfo.selectedCouponValue;
                    var couponDisplayList=assetsRes.data.redPacketInfo.couponDisplayList;
                    $("#envelopes").addClass("choosed");
                    assetsShow(couponDisplayList,"#redPacketInfo",".choiceBtn");
                }else {
                    $("#envelopes").removeClass("choosed");
                    assetsHide("#redPacketInfo");
                }
                //积分兑房展示
                if(assetsRes.data.roomPointsInfo && assetsRes.data.roomPointsInfo.isSelected){
                    roomPointsAmount=assetsRes.data.roomPointsInfo.amountByPointsExchange;
                    roombook.paymentInfoList=roombook.paymentInfoList.concat(assetsRes.data.roomPointsInfo.paymentInfoList);
                    $("#integralToRoom").addClass("choosed");
                }else {
                    $("#integralToRoom").removeClass("choosed");
                }
                //交换 资产展示
                if(assetsRes.data.jiheXCouponInfo){
                    jiheXCouponAmount=assetsRes.data.jiheXCouponInfo.selectedCouponValue?assetsRes.data.jiheXCouponInfo.selectedCouponValue:0;
                    var couponDisplayList=assetsRes.data.jiheXCouponInfo.couponDisplayList;
                    assetsShow(couponDisplayList,"#exchangeAssetsLis",".choice");
                }
                //积分抵现
                if(assetsRes.data.cashPointsInfo){
                    cashPointsAmount=0;
                    canCashPoint=parseInt(assetsRes.data.cashPointsInfo.amountByPointsToCash?assetsRes.data.cashPointsInfo.amountByPointsToCash:0);
                    if(!assetsRes.data.cashPointsInfo.paymentInfoList){
                        $("#switchOpen").removeClass("open");
                    }
                    if($("#switchOpen").hasClass("open")){
                        cashPointsAmount=canCashPoint;
                    }
                    $("#pointsToCashDesc").html(assetsRes.data.cashPointsInfo.pointsToCashDesc);
                }
                //积分支付
                if(assetsRes.data.pointsFixedInfo){
                    var pointsFixedDesc= assetsRes.data.pointsFixedInfo.pointsFixedDesc;
                    if(true==assetsRes.data.pointsFixedInfo.isSelected){
                        payPointAmounts=parseInt(assetsRes.data.pointsFixedInfo.pointsFixed?assetsRes.data.pointsFixedInfo.pointsFixed:0);
                    }
                    if(assetsRes.data.pointsFixedInfo.paymentInfoList){
                        $("#buyPoints").hide();
                        $("#createandsubmit").removeClass("unSubmit");
                    }else {
                        if(pointsFixedDesc.indexOf("应付为0")>-1){
                            $("#buyPoints").hide();
                        }else {
                            $("#buyPoints").show().attr("href","/html/h5/order/virtualGoods.html?mc=zqjf&id="+buyPointsId+"&needpoints="+productPiontPrice);
                        }
                    }
                    $("#myPoints").html(pointsFixedDesc);
                }

                if(priceType==1){
                    roomPayAmount=productPiontPrice-membershipCardAmount-couponAmount-roomCouponAmount-discountCouponAmount-redPacketAmount-roomPointsAmount-jiheXCouponAmount-cashPointsAmount-payPointAmounts;
                    if(roomPayAmount>0){
                        $("#createandsubmit").addClass("unSubmit");
                    }
                    else {
                        $("#createandsubmit").removeClass("unSubmit");
                    }
                }else {
                    roomPayAmount=productPrice-membershipCardAmount-couponAmount-roomCouponAmount-discountCouponAmount-redPacketAmount-roomPointsAmount-jiheXCouponAmount-cashPointsAmount-payPointAmounts;
                    if(roomPayAmount>0 && $.inArray("0", payTypes)!=-1 && (!payChannelList || payChannelList.length==0)){
                        $("#createandsubmit").addClass("unSubmit");
                    }
                    else if(roomPayAmount>0 && $.inArray("0", payTypes)==-1){
                        $("#createandsubmit").addClass("unSubmit");
                    }
                    else {
                        $("#createandsubmit").removeClass("unSubmit");
                    }
                }

                //$("#roomPrice").html("￥"+productPrice/100);

                if(priceType==1 && (showCyType=="4" || showCyType=="5" || showCyType=="1")){
                    if(showCyType=="5"){
                        $("#roomPrice").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)/100+showCyUnit);
                    }
                    else {
                        $("#roomPrice").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)+showCyUnit);
                    }
                    $("#roomPayAmount").html("￥"+0/100).parents(".toOrderBtn").find(".hide").hide();
                }
                else {
                    $("#roomPayAmount").html("￥"+roomPayAmount/100);
                    $("#roomPrice").html(showCyCode+Math.round(showTotalPrice*roombook.quantity)/100+showCyUnit);
                }
            }
            else if(assetsRes.sc=="-99999"){
                errorPrompt("请稍后再试",2000);
            }
            else {
                errorPrompt(chinese(assetsRes.ErrorMsg),2000);
            }
        });
    }

    //请求是否是会员/member/h5/info
    function isMember(){
        var memData={};
        var memUrl='/user/h5/info';
        $.post(h5orClient(memUrl),{data:JSON.stringify(memData)},function(memRes){
            if(memRes.sc==0){
                if(memRes.data.memberFlag==1){
                    $("#virCusName,#roomCusName").val(memRes.data.realname);
                    $("#virCusPhone,#roomCusPhone").val(memRes.data.mobileAccount.accountName);
                    $("#goReg").hide();
                }
                else if(undefined==memRes.data.mobileAccount){
                    $("#registerPhone").parents(".registerBox").show();
                    $("#registerCode").parents(".registerBox").show();
                    $("#registerName").parents(".registerBox").hide();
                    $("#goReg").show();
                }
                else {
                    $("#registerPhone").parents(".registerBox").hide();
                    $("#registerCode").parents(".registerBox").hide();
                    $("#registerName").parents(".registerBox").show();
                    $("#registerBtn").html("绑定");
                    $("#goReg").show();
                }
            }
            else {
                errorPrompt(chinese(assetsRes.ErrorMsg),2000);
            }
        });
    }
    //function 订房-------------------------------------------end

    //注册
    var jsTime=0;
    function timee(){
        if(jsTime==0){
            jsTime=60;
            var data={'verifycodetype':0,'accountname':$("#registerPhone").val()};
            $("#sendCode").addClass("unable");
            var url='/user/h5/getverifycode';
            $.post(h5orClient(url),{data:JSON.stringify(data)},function(resu){
                if(resu.sc!="0"){
                    errorPrompt(resu.ErrorMsg,2000);
                    jsTime=0;
                    $("#sendCode").removeClass("unable");
                    return;
                }else {
                    $("#sendCode").html(jsTime+"S");
                    var timeCon=setInterval(function(){
                        jsTime--;
                        $("#sendCode").html(jsTime+"S");
                        if(jsTime==0){
                            $("#sendCode").html("重新发送").removeClass("unable");
                            clearInterval(timeCon);
                        }
                    },1000)
                }
            });
        }
    }

    function removeArray(a,b){
        //把数组a中a.couponCode 和数组b相同的a的元素移除
        for(var i=0;i< b.length;i++){
            for(var j=0;j< a.length;j++){
                if(a[j].couponCode==b[i]){
                    a.splice(j,1);
                    j=j-1;
                }
            }
        }
        return a;
    }
    function removeArrayEle(a,b){
        //把数组a中a.couponCode 和数组b.couponCode相同的a的元素移除
        for(var i=0;i< b.length;i++){
            for(var j=0;j< a.length;j++){
                if(a[j].couponCode==b[i].couponCode){
                    a.splice(j,1);
                    j=j-1;
                }
            }
        }
        return a;
    }
});



window.onload=function(){

};