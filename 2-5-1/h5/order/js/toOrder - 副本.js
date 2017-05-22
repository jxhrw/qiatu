var checkin=parseInt(GetParams().checkin);//入住时间
var checkout=parseInt(GetParams().checkout);//离开时间
var roombook={productId:GetParams().id,checkin:checkin,checkout:checkout,quantity:1};//订房所需数据
var productPrice;//总价
var productPiontPrice;//积分总价
var roomPayAmount;//订房应付
var payPointAmounts;//积分支付
var unitPrice;//单价
var unitPricePoint;//积分单价
var selectedCouponArray=[];//已选礼券和优惠券
var nights;//订房晚数
var cashPointsPaymentInfo=0;//是否积分抵现,0-没选，{}-已选
var canCashPoint=0;//积分抵现总额
var objectType;//产品类型
var typeLast=[];//众享权益
var cashPointsAmount;
var tolAmount;//库存
var canBuyQuantity;//个人最大购买量
var maxBuyQuantity;
var priceType=0;//商品定价0-现金，1-积分；默认现金
var buyPointsId;
var atidcode=[1,4,"52ac-f76d-804a-9f7c"];
var assetType,couponId,couponCode;
var payments;
var productInfo;
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

    //优惠券取消选中
    $("#clearDisc").click(function(){
        $(".discListUl li .choice").removeClass("choosed");
        $(".windowBox,.underWindow,.upWindow").hide();
        roombook.defaultSelectDiscount=0;
        cancelAllVouchers(".discListUl li");
        mutexDisplay(".discListUl li",".choice");
        coupHasSelected();
        roombook.paymentInfoList=selectedCouponArray;
        personalAssets(roombook);
    });

    //取消已选礼券
    $("#coupSelected").click(function(){
        if($("#cashCouponUl li").length!=0 || $("#roomCouponUl li").length!=0){
            if($(this).hasClass("choosed")){
                $(this).removeClass("choosed");
                $("#cashVouchers,#roomVouchers").removeClass("choosed");
                cancelAllVouchers("#cashCouponUl li");
                mutexDisplay("#cashCouponUl li",".choice2");
                cancelAllVouchers("#roomCouponUl li");
                mutexDisplay("#roomCouponUl li",".choice2");
                coupHasSelected();
                roombook.paymentInfoList=selectedCouponArray;
                personalAssets(roombook);
            }
            else {
                $(".useCoupons").show();
            }
        }
    });

    //取消已选消费金
    $("#cashVouchers").click(function(){
        if($(this).hasClass("choosed")){
            $(this).removeClass("choosed");
            cancelAllVouchers("#cashCouponUl li");
            mutexDisplay("#cashCouponUl li",".choice2");
            coupHasSelected();
            roombook.paymentInfoList=selectedCouponArray;
            personalAssets(roombook);
        }
        else {
            $("#cashCouponUl").toggle();
            $("#cashArrow").toggleClass("turnUp");
        }
    });

    //取消已选房券
    $("#roomVouchers").click(function(){
        if($(this).hasClass("choosed")){
            $(this).removeClass("choosed");
            cancelAllVouchers("#roomCouponUl li");
            mutexDisplay("#roomCouponUl li",".choice2");
            coupHasSelected();
            roombook.paymentInfoList=selectedCouponArray;
            personalAssets(roombook);
        }
        else {
            $("#roomCouponUl").toggle();
            $("#roomArrow").toggleClass("turnUp");
        }
    });

    //积分兑房
    $("#integralToRoom").click(function(){
        selectedCouponArray=[];
        roombook.defaultSelectDiscount=0;
        if($(this).hasClass("choosed")){
            roombook.paymentInfoList=[];
        }else {
            roombook.paymentInfoList=[{"payType":"3"}];
        }
        $(this).toggleClass("choosed");
        $("#coupSelected,#cashVouchers,#roomVouchers").removeClass("choosed");
        mutexDisplay(".discListUl li",".choice");
        mutexDisplay("#cashCouponUl li",".choice2");
        mutexDisplay("#roomCouponUl li",".choice2");
        personalAssets(roombook);
    });

    //积分抵现
    $("#switchOpen").click(function(){
        if(canCashPoint>0){
            delete roombook.defaultSelectDiscount;
            $(this).toggleClass("open");
            personalAssets(roombook);
        }
    });

    //创建订单
    $("#createandsubmit").click(function(){
        $("#createandsubmit").addClass("no");
        if(roomPayAmount>0 && priceType=="0"){
            var arr=[{amount:roomPayAmount,paytype:0}];
            payments=payments.concat(arr);
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
                roombook.paymentInfoList=selectedCouponArray;
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
            roombook.paymentInfoList=selectedCouponArray;
            personalAssets(roombook);
        }
    }
    //------------------------------------------------------------


    $("#roomNumber").click(function(){
        $(".windowBox,#roomNumBox").show();
    });

    $("#register").click(function(){
        $(".windowBox,.upWindow").show();
    });

    $("#shadow").click(function(){
        $(".windowBox,.underWindow,.upWindow").hide();
    });

    //$("#myDisc").click(function(){
    //    if($(".discListUl li").length!=0){
    //        $(".windowBox,#discList").show();
    //    }
    //});

    //$("#myCoup").click(function(){
    //    if($("#cashCouponUl li").length!=0 || $("#roomCouponUl li").length!=0){
    //        $(".useCoupons").show();
    //    }
    //});

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
    //订房产品数据数据请求
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
                    roombook.paymentInfoList=selectedCouponArray;
                    personalAssets(roombook,"first");
                }
                else{
                    $("#nonMember,#fillRoomInfo,#assets,.hide").show();
                    tolAmount=parseInt(roomProRes.data.tolAmount);
                    if(undefined==roomProRes.data.tolAmount|| roomProRes.data.tolAmount==1){
                        $("#roomNumber").val("仅剩1间").attr("disabled","disabled");
                    }else {
                        var roomNumberLi="";
                        $("#roomNumber").val("1间");
                        for(var i=1;i<=roomProRes.data.tolAmount && i<=10; i++){
                            roomNumberLi+="<li value='"+i+"'>"+i+"间</li>";
                        }
                        $(".roomNumberUl").html(roomNumberLi);
                    }
                    roombook.paymentInfoList=selectedCouponArray;
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
                    $("#roomVouchers").removeClass("choosed");
                    cancelAllVouchers("#roomCouponUl li");
                    mutexDisplay("#roomCouponUl li",".choice2");
                    coupHasSelected();
                    ////清理掉房券-end
                    roombook.paymentInfoList=selectedCouponArray;
                    personalAssets(roombook);
                });
            }
            else {
                errorPrompt(chinese(roomProRes.ErrorMsg),2000);
            }
        });
    }

    //个人资产
    function personalAssets(assetsData,firstLoad){
        var assetsUrl='/pay/h5/payable/booking';
        payments=[];
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
                if(undefined!=assetsRes.data.cashPointsInfo && undefined!=assetsRes.data.cashPointsInfo.paymentInfoList && $("#switchOpen").hasClass("open")){
                    payments=payments.concat(assetsRes.data.cashPointsInfo.paymentInfoList);
                }
                if(undefined!=assetsRes.data.couponInfo && undefined!=assetsRes.data.couponInfo.paymentInfoList && true==assetsRes.data.couponInfo.isSelected){
                    payments=payments.concat(assetsRes.data.couponInfo.paymentInfoList);
                }
                if(undefined!=assetsRes.data.discountCouponInfo && undefined!=assetsRes.data.discountCouponInfo.paymentInfoList && true==assetsRes.data.discountCouponInfo.isSelected){
                    payments=payments.concat(assetsRes.data.discountCouponInfo.paymentInfoList);
                }
                if(undefined!=assetsRes.data.roomPointsInfo && undefined!=assetsRes.data.roomPointsInfo.paymentInfoList && true==assetsRes.data.roomPointsInfo.isSelected){
                    payments=payments.concat(assetsRes.data.roomPointsInfo.paymentInfoList);
                }
                if(undefined!=assetsRes.data.pointsFixedInfo && true==assetsRes.data.pointsFixedInfo.isSelected && undefined!=assetsRes.data.pointsFixedInfo.paymentInfoList){
                    payments=payments.concat(assetsRes.data.pointsFixedInfo.paymentInfoList);
                }

                //优惠券抵扣
                var discountCouponAmount=0;
                if(assetsRes.data.discountCouponInfo){
                    discountCouponAmount=parseInt(assetsRes.data.discountCouponInfo.selectedDiscountCouponValue?assetsRes.data.discountCouponInfo.selectedDiscountCouponValue:0);
                    var couponDesc=assetsRes.data.discountCouponInfo.couponDesc;
                    $("#discountCouponInfo").html(couponDesc);
                    if(couponDesc && couponDesc.indexOf("￥")!=-1){
                        $("#discountCouponInfo").html(couponDesc).removeClass("paleRed");
                    }else {
                        $("#discountCouponInfo").html(couponDesc).addClass("paleRed");
                    }
                }else {
                    $("#discountCouponInfo").parents(".oneLine").hide();
                }
                //礼券抵扣
                var couponAmount=0;
                var couponDesc="";
                if(assetsRes.data.couponInfo){
                    //消费金和房券选中
                    if(true==assetsRes.data.couponInfo.isSelected){
                        $.each(assetsRes.data.couponInfo.paymentInfoList,function(i){
                            var chongfu=0;
                            var obj={convert:assetsRes.data.couponInfo.paymentInfoList[i].convert,couponCode:assetsRes.data.couponInfo.paymentInfoList[i].couponCode,payType:assetsRes.data.couponInfo.paymentInfoList[i].payType};
                            for(var j=0;j<selectedCouponArray.length;j++){
                                if(selectedCouponArray[j].couponCode==assetsRes.data.couponInfo.paymentInfoList[i].couponCode){
                                    chongfu++;
                                }
                            }
                            if(chongfu==0){
                                selectedCouponArray.push(obj);
                            }
                        });
                        mutexDisplay(".discListUl li",".choice");
                        mutexDisplay("#cashCouponUl li",".choice2");
                        mutexDisplay("#roomCouponUl li",".choice2");
                        if($("#cashCouponUl li .choice2").hasClass("choosed")){
                            $("#cashVouchers").addClass("choosed");
                        }
                        if($("#roomCouponUl li .choice2").hasClass("choosed")){
                            $("#roomVouchers").addClass("choosed");
                        }
                        coupHasSelected();
                    }
                    couponAmount=parseInt(assetsRes.data.couponInfo.selectedCouponValue?assetsRes.data.couponInfo.selectedCouponValue:0);
                    couponDesc=assetsRes.data.couponInfo.couponDesc;
                    if(couponAmount>0){
                        //couponDesc="-￥"+couponAmount/100;
                    }
                    if(/*couponDesc.indexOf("￥")!=-1*/ /[0-9]/.test(couponDesc)){
                        $("#couponInfo").html(couponDesc).removeClass("paleRed");
                    }else {
                        $("#couponInfo").html(couponDesc).addClass("paleRed");
                    }
                }else {
                    $("#couponInfo").parents(".oneLine").hide();
                }
                //积分兑房抵扣
                var roomPointsAmount=0;
                var amountByPointsExchange=0;
                if(assetsRes.data.roomPointsInfo){
                    amountByPointsExchange=parseInt(assetsRes.data.roomPointsInfo.amountByPointsExchange?assetsRes.data.roomPointsInfo.amountByPointsExchange:0);
                    if(amountByPointsExchange>0){
                        $("#integralToRoom").removeClass("no");
                        if(assetsRes.data.roomPointsInfo.isSelected==true){
                            roomPointsAmount=amountByPointsExchange;
                            $("#integralToRoom").addClass("choosed");
                            $("#roomPointsAmount").html("-￥"+roomPointsAmount/100);
                        }else {
                            cancelToRoom();
                            $("#integralToRoom").removeClass("choosed");
                            $("#roomPointsAmount").html("");
                        }
                    }else {
                        $("#integralToRoom").addClass("no");
                    }
                    $("#roomPointsInfo").html(assetsRes.data.roomPointsInfo.pointsExchangeDesc);
                }else {
                    $("#roomPointsInfo").parents(".oneLine").hide();
                }

                //积分抵现抵扣
                cashPointsAmount=0;
                if(assetsRes.data.cashPointsInfo){
                    canCashPoint=parseInt(assetsRes.data.cashPointsInfo.amountByPointsToCash?assetsRes.data.cashPointsInfo.amountByPointsToCash:0);
                    if($("#switchOpen").hasClass("open")){
                        cashPointsAmount=canCashPoint;
                    }else {
                        cashPointsAmount=0;
                        cashPointsPaymentInfo=0;
                    }
                    $("#pointsToCashDesc").html(assetsRes.data.cashPointsInfo.pointsToCashDesc);
                }else {
                    $("#pointsToCashDesc").parents(".oneLine").hide();
                }

                //积分支付
                payPointAmounts=0;
                if(assetsRes.data.pointsFixedInfo){
                    if(true==assetsRes.data.pointsFixedInfo.isSelected){
                        payPointAmounts=parseInt(assetsRes.data.pointsFixedInfo.pointsFixed?assetsRes.data.pointsFixedInfo.pointsFixed:0);
                    }
                    if(assetsRes.data.pointsFixedInfo.paymentInfoList){
                        $("#buyPoints").hide();
                        $("#createandsubmit").removeClass("unSubmit");
                    }else {
                        $("#buyPoints").show().attr("href","/html/order/virtualGoods.html?mc=zqjf&id="+buyPointsId+"&needpoints="+productPiontPrice);
                    }
                    $("#myPoints").html(assetsRes.data.pointsFixedInfo.pointsFixedDesc).parents(".oneLine").show();
                }else {
                    $("#myPoints").parents(".oneLine").hide();
                }

                if("none"==$("#discountCouponInfo").parents(".oneLine").css("display") && "none"==$("#couponInfo").parents(".oneLine").css("display") && "none"==$("#roomPointsInfo").parents(".oneLine").css("display") && "none"==$("#pointsToCashDesc").parents(".oneLine").css("display") && "none"==$("#myPoints").parents(".oneLine").css("display")){
                    $("#assets").hide();
                }

                if(priceType==1){
                    roomPayAmount=productPiontPrice-discountCouponAmount-couponAmount-roomPointsAmount-cashPointsAmount-payPointAmounts;
                    if(roomPayAmount>0){
                        $("#createandsubmit").addClass("unSubmit");
                    }
                    else {
                        $("#createandsubmit").removeClass("unSubmit");
                    }
                }else {
                    roomPayAmount=productPrice-discountCouponAmount-couponAmount-roomPointsAmount-cashPointsAmount-payPointAmounts;
                }

                //$("#roomPrice").html("￥"+productPrice/100);

                if(firstLoad=="first"){
                    //优惠券
                    if(undefined!=assetsRes.data.discountCouponInfo && assetsRes.data.discountCouponInfo.availableCouponPieces>0){
                        var discountCouponList=assetsRes.data.discountCouponInfo.discountCouponList;
                        var discountCouponLi="";
                        for(var i=0;i<discountCouponList.length;i++){
                            var spanClass="choice discChoice";
                            var thisId=JSON.stringify(discountCouponList[i].paymentInfo);
                            var thisRejectCouponCodes=JSON.stringify(discountCouponList[i].rejectCouponCodes);
                            if(typeof discountCouponList[i].isSelected!="undefined"){//有默认被选中的
                                spanClass="choice discChoice choosed";
                                selectedCouponArray.push(discountCouponList[i].paymentInfo);
                            }
                            discountCouponLi+='<li value='+thisRejectCouponCodes+'><h2>'+discountCouponList[i].couponBaseInfo.couponName+'</h2><span class="'+spanClass+'"></span><span class="thisInfo" value='+ thisId +'></span></li>';
                        }
                        $(".discListUl").html(discountCouponLi);
                        //优惠券选中
                        $(".discListUl li").on("click",function(){
                            delete roombook.defaultSelectDiscount;
                            cancelToRoom();
                            $(".discListUl li .choice").removeClass("choosed");
                            $(this).find(".choice").addClass("choosed");
                            $(".windowBox,.underWindow,.upWindow").hide();
                            var thisPaymentInfo=JSON.parse($(".thisInfo",this).attr("value"));
                            var thisRejectCouponCodes=[];
                            if(undefined!=$(this).attr("value") && "undefined"!=$(this).attr("value")){
                                thisRejectCouponCodes=JSON.parse($(this).attr("value"));
                            }
                            mutexCoupons(thisPaymentInfo,thisRejectCouponCodes);
                            coupHasSelected()
                        });
                    }
                    //消费金券
                    if(undefined!=assetsRes.data.couponInfo && undefined!=assetsRes.data.couponInfo.cashCouponList){
                        var cashCouponList=assetsRes.data.couponInfo.cashCouponList;
                        var cashCouponLi="";
                        for(var i=0;i<cashCouponList.length;i++){
                            var thisId=JSON.stringify(cashCouponList[i].paymentInfo);
                            var thisRejectCouponCodes=JSON.stringify(cashCouponList[i].rejectCouponCodes);
                            cashCouponLi+='<li value='+ thisRejectCouponCodes +'><p class="couponName">'+cashCouponList[i].couponBaseInfo.couponName+'</p><p><i>有效期：</i>'+ newFormatStrDate(new Date(parseInt(cashCouponList[i].couponBaseInfo.effectiveTime)),"/") +' - '+ newFormatStrDate(new Date(parseInt(cashCouponList[i].couponBaseInfo.expireTime)),"/") +'</p><p><i>余额：</i><span>￥<em>'+cashCouponList[i].remain/100+'</em></span></p><span class="choice2"></span><span class="thisInfo" value='+ thisId +'></span></li>'
                        }
                        $("#cashCouponUl").html(cashCouponLi);
                        //消费金券选中
                        $("#cashCouponUl li").on("click",function(){
                            delete roombook.defaultSelectDiscount;
                            cancelToRoom();
                            var thisPaymentInfo=JSON.parse($(".thisInfo",this).attr("value"));
                            var thisRejectCouponCodes=[];
                            if(undefined!=$(this).attr("value") && "undefined"!=$(this).attr("value")){
                                thisRejectCouponCodes=JSON.parse($(this).attr("value"));
                            }
                            if($(".choice2",this).hasClass("choosed")){
                                $(".choice2",this).removeClass("choosed");
                                mutexCoupons(thisPaymentInfo,thisRejectCouponCodes,"detele");
                            }else {
                                $(".choice2",this).addClass("choosed");
                                mutexCoupons(thisPaymentInfo,thisRejectCouponCodes);
                            }
                            if($("#cashCouponUl li .choice2").hasClass("choosed")){
                                $("#cashVouchers").addClass("choosed");
                            }else {
                                $("#cashVouchers").removeClass("choosed");
                            }
                            coupHasSelected()
                        });
                    }
                    else {
                        $("#cashCouponUl").parents(".couponBox").hide();
                    }
                    //房券
                    if(undefined!=assetsRes.data.couponInfo && undefined!=assetsRes.data.couponInfo.roomCouponList){
                        var roomCouponList=assetsRes.data.couponInfo.roomCouponList;
                        var roomCouponLi="";
                        for(var i=0;i<roomCouponList.length;i++){
                            var thisId=JSON.stringify(roomCouponList[i].paymentInfo);
                            var thisRejectCouponCodes=JSON.stringify(roomCouponList[i].rejectCouponCodes);
                            roomCouponLi+='<li value='+thisRejectCouponCodes+'><p class="couponName">'+roomCouponList[i].couponBaseInfo.couponName+'</p><p><i>晚数：</i><span>'+roomCouponList[i].couponBaseInfo.applyNights+'晚</span></p><span class="choice2"></span><span class="thisInfo" value='+ thisId +'></span></li>';
                        }
                        $("#roomCouponUl").html(roomCouponLi);
                        //房券选中
                        $("#roomCouponUl li").on("click",function(){
                            delete roombook.defaultSelectDiscount;
                            cancelToRoom();
                            var thisPaymentInfo=JSON.parse($(".thisInfo",this).attr("value"));
                            var thisRejectCouponCodes=[];
                            if(undefined!=$(this).attr("value") && "undefined"!=$(this).attr("value")){
                                thisRejectCouponCodes=JSON.parse($(this).attr("value"));
                            }
                            if($(".choice2",this).hasClass("choosed")){
                                $(".choice2",this).removeClass("choosed");
                                mutexCoupons(thisPaymentInfo,thisRejectCouponCodes,"detele");
                            }else {
                                /*if($("#roomCouponUl li .choice2.choosed").length>=nights*roombook.quantity){
                                    errorPrompt("使用房券数量不能大于订单间夜",2000);
                                    return;
                                }*/
                                $(".choice2",this).addClass("choosed");
                                mutexCoupons(thisPaymentInfo,thisRejectCouponCodes);
                            }
                            if($(".cashCouponUl li .choice2").hasClass("choosed")){
                                $("#roomVouchers").addClass("choosed");
                            }else {
                                $("#roomVouchers").removeClass("choosed");
                            }
                            coupHasSelected();
                        });
                    }
                    else {
                        $("#roomCouponUl").parents(".couponBox").hide();
                    }

                    //消费金和房券默认选中
                    if(undefined!=assetsRes.data.couponInfo && true==assetsRes.data.couponInfo.isSelected){
                        mutexDisplay(".discListUl li",".choice");
                        mutexDisplay("#cashCouponUl li",".choice2");
                        mutexDisplay("#roomCouponUl li",".choice2");
                        if($("#cashCouponUl li .choice2").hasClass("choosed")){
                            $("#cashVouchers").addClass("choosed");
                        }
                        if($("#roomCouponUl li .choice2").hasClass("choosed")){
                            $("#roomVouchers").addClass("choosed");
                        }
                        coupHasSelected();
                    }

                    if(buyPointsId==GetParams().id && undefined!=GetParams().needpoints){
                        var num=Math.ceil(GetParams().needpoints/100);
                        $("#virProQuantity").val(num);
                        virProChangeQuantity(num);
                    }
                }

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
            else {
                errorPrompt(chinese(assetsRes.ErrorMsg),2000);
            }
        });
    }

    //取消积分兑房
    function cancelToRoom(){
        for(var i=0;i<selectedCouponArray.length;i++){
            if("3"==selectedCouponArray[i].payType){
                selectedCouponArray.splice(i,1);
                i=i-1;
                break;
            }
        }
    }

    //券互斥this_PaymentInfo:当前券信息；this_RejectCouponCodes:当前券的互斥券
    function mutexCoupons(this_PaymentInfo,this_RejectCouponCodes,addDetele){
        var hasNot=0;
        if(addDetele=="detele"){
            for(var i=0;i<selectedCouponArray.length;i++){
                if(this_PaymentInfo.couponCode==selectedCouponArray[i].couponCode){
                    selectedCouponArray.splice(i,1);
                    i=i-1;
                    break;
                }
            }
        }
        else {
            for(var i=0;i<selectedCouponArray.length;i++){
                if(this_PaymentInfo.couponCode==selectedCouponArray[i].couponCode){
                    hasNot=1;
                }
                for(var j=0;j<this_RejectCouponCodes.length;j++){
                    if(this_RejectCouponCodes[j]==selectedCouponArray[i].couponCode){
                        selectedCouponArray.splice(i,1);
                        i=i-1;
                        break;
                    }
                }
            }
            if(hasNot==0){
                selectedCouponArray.push(this_PaymentInfo);
            }
        }
        console.log(selectedCouponArray);
        roombook.paymentInfoList=selectedCouponArray;
        personalAssets(roombook);

        //互斥展示效果
        mutexDisplay(".discListUl li",".choice");
        mutexDisplay("#cashCouponUl li",".choice2");
        mutexDisplay("#roomCouponUl li",".choice2");
        if(!$("#cashCouponUl li .choice2").hasClass("choosed")){
            $("#cashVouchers").removeClass("choosed");
        }
        if(!$("#roomCouponUl li .choice2").hasClass("choosed")){
            $("#roomVouchers").removeClass("choosed");
        }
        coupHasSelected();
        //互斥展示效果-结束
    }

    //互斥展示效果方法
    function mutexDisplay(liClass,spanClass){
        $(liClass).each(function(){
            var thisPaymentInfo=JSON.parse($(".thisInfo",this).attr("value"));
            if(selectedCouponArray.length==0){
                $(spanClass,this).removeClass("choosed");
            }
            for(var i=0;i<selectedCouponArray.length;i++){
                if(thisPaymentInfo.couponCode==selectedCouponArray[i].couponCode){
                    $(spanClass,this).addClass("choosed");
                    break;
                }
                else {
                    $(spanClass,this).removeClass("choosed");
                }
            }
        });
    }

    //是否已选礼券
    function coupHasSelected(){
        if(!$("#cashCouponUl li .choice2").hasClass("choosed") && !$("#roomCouponUl li .choice2").hasClass("choosed")){
            $("#coupSelected").removeClass("choosed");
        }else {
            $("#coupSelected").addClass("choosed");
        }
    }

    //取消所有消费金/房券
    function cancelAllVouchers(classId){
        $(classId).each(function(){
            var thisPaymentInfo=JSON.parse($(".thisInfo",this).attr("value"));
            for(var i=0;i<selectedCouponArray.length;i++){
                if(thisPaymentInfo.couponCode==selectedCouponArray[i].couponCode){
                    selectedCouponArray.splice(i,1);
                    i=i-1;
                    break;
                }
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

});



window.onload=function(){

};