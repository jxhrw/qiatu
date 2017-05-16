/**
 * Created by Spr on 2016/8/20.
 */
$(document).ready(function(){
    sessionStorage.setItem("toOrderLeave",0);
    sessionStorage.setItem("paymentLeave",0);
    var effNumber= 1,//购买数量的有效数字,初始为1
        maxBuyQuantity,//个人最大购买件数
        hasBuyQuantity,//已购买数量
        canBuyQuantity,//能够数量
        groupBuyingThreshold,//成团数量
        effectiveTime,// 生效时间
        expiredTime,//失效时间
        totalPrice,//现金单价
        totalPointPrice,//积分单价
        tolAmount,//库存，总库存=tolAmount+sellAmount
        memberGrade,//会员等级
        points,//个人会员积分
        productName,//产品名称
        principal,//需存本金
        rights=[],//消费权益、额外分红...
        //dividend,//额外分红
        sellAmount,//已售数量
        payChannelList,//支持现金支付渠道列表
        disabled,//点击是否有效，0无效，1有效
        serviceInfoList,//服务信息
        objectType,//产品类型
        cancelPolicy,//取消规则
        saleEndtime=0,//类intoGroup里的截止购买时间
        sellingRulesDesc,//销售规则描述
        sellingRuleList;//销售规则列表
    assetType=GetParams().assettype?GetParams().assettype:GetParams().assetType;
    couponId=GetParams().couponid?GetParams().couponid:GetParams().couponId;
    couponCode=GetParams().couponcode?GetParams().couponcode:GetParams().couponCode;

    var windowWidth=$(window).width();
    var isApp;//判断是否app，且哪种app
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
        isApp="jiheios";
    }
    var wxP= 0,wx_pubP= 0,aliP= 0,ali_pubP= 0,mzP=0;//支付方式，0代表不存在
    var isMember;//1会员，0非会员

    // IOS桥接调用
    function iosBridgeObjc(url) {
        var iframe;
        iframe = document.createElement("iframe");
        iframe.setAttribute("src", url);
        iframe.setAttribute("style", "display:none;");
        document.body.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
    }

    $(".chooseBox").css("z-index","9");
    //获取产品信息
    pickInformation();

    //加减号位置
    if(/android/i.test(navigator.userAgent)){
        $(".reduce").css("line-height","1.9rem");
        $(".add").css("line-height","1.9rem");
    }

    //价格显示滑动定位
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
        $(".chooseBox .number").focus(function(){
            if($(".chooseBox").css("position")=="fixed"){
                setTimeout(function(){
                    $("#cheng").css("height","3.33rem");
                    $(".chooseBox").css({"position":"absolute","top":$("body").scrollTop(),"-webkit-box-shadow":"0 0 10px #dcdada","-moz-box-shadow":"0 0 10px #dcdada","box-shadow":"0 0 10px #dcdada"});
                },100);
            }
            $(".footer").css({"position":"absolute"});
            $(window).scroll(function() {
                var height=$(".packageName").height();
                var top=$(".packageName").offset().top-$("body").scrollTop();
                if(top+height<=0){
                    $("#cheng").css("height","3.33rem");
                    $(".chooseBox").css({"position":"absolute","top":$("body").scrollTop(),"-webkit-box-shadow":"0 0 10px #dcdada","-moz-box-shadow":"0 0 10px #dcdada","box-shadow":"0 0 10px #dcdada"});
                }
                else {
                    $("#cheng").css("height","0");
                    $(".chooseBox").css({"position":"relative","top":"0","-webkit-box-shadow":"none","-moz-box-shadow":"none","box-shadow":"none"});
                }
            });
        }).blur(function(){
            if($(".chooseBox").css("position")=="fixed"||$(".chooseBox").css("position")=="absolute"){
                $("#cheng").css("height","3.33rem");
                $(".chooseBox").css({"position":"fixed","top":"0","-webkit-box-shadow":"0 0 10px #dcdada","-moz-box-shadow":"0 0 10px #dcdada","box-shadow":"0 0 10px #dcdada"});
            }
            else {
                $("#cheng").css("height","0");
                $(".chooseBox").css({"position":"relative","top":"0","-webkit-box-shadow":"none","-moz-box-shadow":"none","box-shadow":"none"});
            }
            $(".footer").css({"position":"fixed"});
            scrollS();
        });
    }
    $(window).scroll(function() {
        scrollS();
    });
    $(window).on("touchmove",function() {
        scrollS();
    });

    function scrollS(){
        var height=$(".packageName").height();
        var top=$(".packageName").offset().top-$("body").scrollTop();
        if(top+height<=0){
            $("#cheng").css("height","3.33rem");
            $(".chooseBox").css({"position":"fixed","top":"0","-webkit-box-shadow":"0 0 10px #dcdada","-moz-box-shadow":"0 0 10px #dcdada","box-shadow":"0 0 10px #dcdada"});
        }
        else {
            $("#cheng").css("height","0");
            $(".chooseBox").css({"position":"relative","top":"0","-webkit-box-shadow":"none","-moz-box-shadow":"none","box-shadow":"none"});
        }
    }
    //下拉刷新
//滑动刷新
    var start_Y,end_Y;
    $('body').on('touchstart',function(e) {
        var _touch = e.originalEvent.targetTouches[0];
        start_Y= _touch.pageY;
    });
    $('body').on('touchmove',function(e) {
        var _touch = e.originalEvent.changedTouches[0];
        end_Y= _touch.pageY;
    });
    $('body').on('touchend',function(e) {
        if($("body").scrollTop()<=0){
            if(end_Y-start_Y>30){
                pickInformation();
                end_Y=0;
                start_Y=0;
            }
        }
    });

    //修改订购数量
    if($(".numberBox .number").val()<=1){
        $(".numberBox .reduce").attr("disabled","false").css("background-color","#f3cbcb");
    }


    //加号修改
    $(".numberBox .add").click(function(){
        var i=$(".numberBox .number").val();

        if(i*1+1>tolAmount*1 && tolAmount*1!=-1){//判断是否超出库存,-1代表无限
            $(".smallBomb").html("商品库存不足").show();
            setTimeout(function(){
                $(".smallBomb").html("").hide();
            },2000);
            $(".numberBox .number").val(effNumber);
        }
        else {
            if(maxBuyQuantity>0){
                if(i*1>=canBuyQuantity*1){
                    $(".smallBomb").html("每人最多可购买"+maxBuyQuantity+"份").show();
                    setTimeout(function(){
                        $(".smallBomb").html("").hide();
                    },2000);
                    $(".numberBox .number").val(effNumber);
                    return;
                }
            }
            effNumber=i*1+1;
            $(".numberBox .number").val(effNumber);
            if(objectType==31){
                var num=$(".schedule ul li").length;
                for(var i=0;i<num;i++){
                    $(".schedule ul li").eq(i).find("span").html(floatFixed2(rights[i]*effNumber));
                }
                //$(".schedule ul li").eq(0).find("span").html(floatFixed2(principal*effNumber));
                if(totalPrice>0) {
                    $(".price span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
                }
            }
            if(totalPrice>0 && totalPointPrice>0){
                $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber)+","+floatFixed2(totalPointPrice*effNumber)+"积分");
            }
            else {
                $(".footer div:first-child span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
            }
         /*   else if(totalPrice>0){
                $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber));
            }
            else if(totalPointPrice>0){
                $(".footer div:first-child span").html(floatFixed2(totalPointPrice*effNumber)+"积分");
            }*/
            $(".numberBox .reduce").css("background-color","#ec6969");
        }

    });
    //减号修改
    $(".numberBox .reduce").click(function(){
        var i=$(".numberBox .number").val();
        if(i<=1){
            $(this).attr("disabled","false").css("background-color","#f3cbcb");
        }else {
            effNumber=i*1-1;
            if(effNumber<=1){
                $(this).attr("disabled","false").css("background-color","#f3cbcb");
            }
            $(".numberBox .number").val(effNumber);
            if(objectType==31){
                var num=$(".schedule ul li").length;
                for(var i=0;i<num;i++){
                    $(".schedule ul li").eq(i).find("span").html(floatFixed2(rights[i]*effNumber));
                }
                //$(".schedule ul li").eq(0).find("span").html(floatFixed2(principal*effNumber));
                if(totalPrice>0) {
                    $(".price span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
                }
            }
            if(totalPrice>0 && totalPointPrice>0){
                $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber)+","+floatFixed2(totalPointPrice*effNumber)+"积分");
            }
            else {
                $(".footer div:first-child span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
            }
          /*  else if(totalPrice>0){
                $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber));
            }
            else if(totalPointPrice>0){
                $(".footer div:first-child span").html(floatFixed2(totalPointPrice*effNumber)+"积分");
            }*/
        }
    });
    //现金输入修改
    $(".numberBox .number").blur(function(){
        var i=$(this).val();
        //console.log(isNaN(i))
        if(i<=0 || i.indexOf(".")>-1 || isNaN(i)){
            //alert("数量必须为正整数");
            $(".footer div").addClass("disabled");
            $(".smallBomb").html("数量必须为正整数").show();
            setTimeout(function(){
                $(".smallBomb").html("").hide();
                $(".footer div").removeClass("disabled");
            },2000);
            $(this).val(effNumber);
        }
        else {
            if(i*1>tolAmount && tolAmount*1!=-1){//判断是否超出库存
                $(".footer div").addClass("disabled");
                $(".smallBomb").html("商品库存不足").show();
                setTimeout(function(){
                    $(".smallBomb").html("").hide();
                    $(".footer div").removeClass("disabled");
                },2000);
                $(".numberBox .number").val(effNumber);
            }
            else {
                if(maxBuyQuantity>0){
                    if(i*1>maxBuyQuantity*1){
                        $(".footer div").addClass("disabled");
                        $(".smallBomb").html("每人最多可购买"+maxBuyQuantity+"份").show();
                        setTimeout(function(){
                            $(".smallBomb").html("").hide();
                            $(".footer div").removeClass("disabled");
                        },2000);
                        $(".numberBox .number").val(effNumber);
                        return;
                    }
                }
                effNumber=i*1;
                $(".numberBox .number").val(effNumber);
                if(objectType==31){
                    var num=$(".schedule ul li").length;
                    for(var i=0;i<num;i++){
                        $(".schedule ul li").eq(i).find("span").html(floatFixed2(rights[i]*effNumber));
                    }
                    //$(".schedule ul li").eq(0).find("span").html(floatFixed2(principal*effNumber));
                    if(totalPrice>0) {
                        $(".price span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
                    }
                }
                if(totalPrice>0 && totalPointPrice>0){
                    $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber)+","+floatFixed2(totalPointPrice*effNumber)+"积分");
                }
                else {
                    $(".footer div:first-child span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
                }
               /* else if(totalPrice>0){
                    $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber));
                }
                else if(totalPointPrice>0){
                    $(".footer div:first-child span").html(floatFixed2(totalPointPrice*effNumber)+"积分");
                }*/

                if(effNumber==1){
                    $(".numberBox .reduce").css("background-color","#f3cbcb");
                }
                if(effNumber>1){
                    $(".numberBox .reduce").css("background-color","#ec6969");
                }
            }
        }
    });
    //积分输入修改
    $(".handNum input").blur(function(){
        var i=$(this).val();
        if(i<=0 || i.indexOf(".")>-1 || isNaN(i)){
            $(".smallBomb").html("数量必须为正整数").show();
            setTimeout(function(){
                $(".smallBomb").html("").hide();
            },2000);
            $(this).val(effNumber);
        }
        else {
            if(maxBuyQuantity>0){
                if(i*1>maxBuyQuantity*1){
                    $(".smallBomb").html("每人最多可购买"+maxBuyQuantity+"份").show();
                    setTimeout(function(){
                        $(".smallBomb").html("").hide();
                    },2000);
                    $(".numberBox .number").val(effNumber);
                    return;
                }
            }
            effNumber=i*1;
            $(".numberBox .number").val(effNumber);
            if(totalPrice>0 && totalPointPrice>0){
                $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber)+","+floatFixed2(totalPointPrice*effNumber)+"积分");
            }
            else {
                $(".footer div:first-child span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);
            }
           /* else if(totalPrice>0){
                $(".footer div:first-child span").html("￥"+floatFixed2(totalPrice*effNumber));
            }
            else if(totalPointPrice>0){
                $(".footer div:first-child span").html(floatFixed2(totalPointPrice*effNumber)+"积分");
            }*/
        }
    });


    //全屏阴影高度
    $(".payBoxShadow").css("height",$(window).height());
    //关闭支付弹窗,购买说明弹窗
    $(".shadow").css("height",$(window).height()-$(".payBox").height()).click(function(){
        $(".payBoxShadow").hide();
        $(".know").show();
    });
    $(".title span,.know").click(function(){
        $(".payBoxShadow").hide();
        $(".know").show();
    });

    $("#hasOrder").click(function(){
        $(".payBoxShadow").hide();
        $(".notPay").hide();
    });

    $("#iknow").click(function(){
        $(".payBoxShadow").hide();
    });
    $("#buyIntegral").click(function(){
        window.location.href="/html/h5/order/virtualGoods.html?id=38607&mc=zqjf";
    });

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

    //数字小于10补0
    function zero(x){
        if(x<10){
            return "0"+x;
        }else {
            return x;
        }
    }

    //获取时间
    function getTime(dates){
        var time=new Date(parseInt(dates));
        var year,month,date,hour,minute;
        year=time.getFullYear();
        month=time.getMonth()+1;
        date=time.getDate();
        hour=time.getHours();
        minute=time.getMinutes();
        return year+"-"+zero(month)+"-"+zero(date)+" "+zero(hour)+":"+zero(minute);
    }

    //获取信息
    function pickInformation(){
        var productId=GetParams().id;
        var data={id:productId};//{'id':"+productId+"};
        if(undefined!=assetType){
            data.assetType=assetType;
        }
        if(undefined!=couponId){
            data.couponId=couponId;
        }
        $.ajax({
            url:"/product/h5/query",
            type:'POST',
            data:{data:JSON.stringify(data)},
            dataType:'json',
            success:function(data){
                console.log(data);
                if(data.sc==0){
                    maxBuyQuantity=data.data.maxBuyQuantity*1;
                    groupBuyingThreshold=data.data.groupBuyingThreshold*1;
                    expiredTime=data.data.expiredTime;
                    totalPrice=data.data.productPrice.totalPrice/100;
                    totalPointPrice=data.data.productPrice.totalPointPrice*1;
                    sellingRuleList=data.data.sellingRuleList;
                    tolAmount=data.data.tolAmount*1;
                    productName=data.data.productName;
                    sellAmount=data.data.sellAmount*1;
                    serviceInfoList=data.data.serviceInfoList;
                    payChannelList=data.data.payChannelList;
                    sellingRulesDesc=data.data.sellingRulesDesc;
                    objectType=data.data.objectType;
                    cancelPolicy=data.data.cancelPolicy;
                    saleEndtime=data.data.saleEndtime;
                    showCyCode=data.data.productPrice.showCyCode?data.data.productPrice.showCyCode:"";
                    showCyUnit=data.data.productPrice.showCyUnit?data.data.productPrice.showCyUnit:"";
                    showTotalPrice=data.data.productPrice.showTotalPrice?data.data.productPrice.showTotalPrice:0;
                    showCyType=data.data.productPrice.showCyType?data.data.productPrice.showCyType:0;//显示金额类型：0-现金，1-积分，4-房券 5-消费金
                    if(showCyType=="0" || showCyType=="5"){
                        showTotalPrice=showTotalPrice/100;
                    }
                    if(data.data.priceType=="1"){
                        $("#jfBuy").show();
                    }else {
                        $("#jfBuy").hide();
                    }

                    //理财产品
                    if(data.data.objectType==31){
                        $(".price").html("存入本金：<span></span><a id='needDeposit'></a>");
                        if(groupBuyingThreshold<=1){
                            $(".infoPay").show();
                        }
                    }
                    /*//实物产品要地址
                    if(data.data.objectType==40){
                        $(".address").show();
                    }*/

                    if(undefined!=data.data.additionalInfo){
                        $("#needDeposit").html("（"+data.data.additionalInfo+"）");
                    }
                    var dataN="{'productIdList':["+productId+"]}";
                    var countList;
                    if(isApp==undefined){
                        countList="/order/h5/count";
                    }else if(isApp=="jiheios"){
                        countList="/order/client/count";
                    }
                    $.post(countList,{data:dataN},function(res){
                        console.log(res);
                        var totalPaidQuantity=res.data[productId].paidQuantity*1;//购买并支付数量
                        if(res.sc=="0"){
                            if(undefined!=res.data[productId].mypaidQuantity){
                                hasBuyQuantity=res.data[productId].mypaidQuantity;
                            }else {
                                hasBuyQuantity=0;
                            }
                            $("#personNum").html(res.data[productId].paidUsercount);
                            $("#personMon").html(floatFixed2(res.data[productId].paidAmount/1e6)+"万元");
                        }else {
                            hasBuyQuantity=0;
                        }
                        canBuyQuantity=maxBuyQuantity-hasBuyQuantity*1;

                        if(data.data.objectType!=31){
                            $(".footer div:last-child").html("购买");
                        }

                        //认购按钮的三种状态
                        if("4"==data.data.status){
                            $(".footer div:last-child").css({"background":"#c8cacc","border-top-color":"#c8cacc","border-bottom-color":"#c8cacc"}).addClass("disabled").html("即将开始");
                        }
                        else if(tolAmount==0 && undefined!=totalPaidQuantity && totalPaidQuantity<sellAmount){//库存0，还有未支付订单
                            var mog='<p style="position: absolute;width:100%;top: -1.67rem;;height:1.67rem;line-height:1.67rem;background-color: #ec6969;color: #fff;text-align: center;font-size: 0.9rem;padding: 0;">有人还未付款，若30分钟内仍未付款，您将有认购机会</p>';
                            var htmlLL=$(".footer div:first-child").html()+mog;
                            $(".footer div:first-child").html(htmlLL);
                            $(".footer div:last-child").css({"background":"#828d9a","border-top-color":"#828d9a","border-bottom-color":"#828d9a"}).html("还有认购机会");
                        }
                        else if(tolAmount==0 && undefined!=totalPaidQuantity && totalPaidQuantity==sellAmount){//已告罄
                            $(".footer div:last-child").css({"background":"#c8cacc","border-top-color":"#c8cacc","border-bottom-color":"#c8cacc"}).addClass("disabled").html("已售罄");
                        }

                        for(var i=0;i<payChannelList.length;i++){
                            if(payChannelList[i]=="mz"){
                                mzP=1;
                            }
                            if(payChannelList[i]=="wx"){
                                wxP=1;
                            }
                            if(payChannelList[i]=="wx_pub"){
                                wx_pubP=1;
                            }
                            if(payChannelList[i]=="alipay"){
                                aliP=1;
                            }
                            if(payChannelList[i]=="alipay_pub"){
                                ali_pubP=1;
                            }
                        }

                        $(".packageName").html(productName);
                        var num=$(".numberBox input").val();
                        document.title=data.data.productName;
                        if(groupBuyingThreshold>1){
                            var percentage=parseInt(sellAmount/groupBuyingThreshold*100);//丢弃小数部分
                            $("#speed span").html(percentage+"%");
                            $(".line").css("width",percentage+"%");
                            $(".schedule,.intoGroup,.endTime").show();
                            $(".endTime span").html(getTime(saleEndtime));
                            $("#speed").css("margin-left",-$("#speed").width()/2-0.2*windowWidth/25);
                            $(".scheduleLineBox").css("padding-bottom","1.5rem");
                            if(totalPrice>0){
                                $("#target span").html(groupBuyingThreshold*totalPrice/1e4+"万");
                            }
                            if(totalPointPrice>0){
                                $("#target span").html(groupBuyingThreshold*totalPointPrice/1e4+"万");
                            }


                            $(".scheduleLine,#target").css("width","100%");
                            $("#speed").css("left",percentage+"%");
                            if(percentage>100){
                                $("#speed").css("left","100%");
                            }
                            if(totalPrice>0){
                                $("#has em").html(sellAmount*totalPrice/1e4+"万元");
                            }else if(totalPointPrice>0){
                                $("#has em").html(sellAmount*totalPointPrice/1e4+"万积分");
                            }

                            if(tolAmount!=-1) {
                                if(groupBuyingThreshold<(tolAmount+sellAmount)){
                                    if(totalPrice>0){
                                        $("#have").show().find("em").html((tolAmount+sellAmount)*totalPrice/1e4+"万元");
                                    }else if(totalPointPrice>0){
                                        $("#have").show().find("em").html((tolAmount+sellAmount)*totalPointPrice/1e4+"万积分");
                                    }
                                }
                            }
                        }
                        $(".titleChart").attr("src",data.data.imgs+'?imageView2/1/w/750/h/480');

                        $(".price span").html(showCyCode+showTotalPrice+showCyUnit);
                        if(showCyType=="4" || showCyType=="5"){
                            $(".footer div:first-child span").html(showTotalPrice+showCyUnit);
                        }else {
                            $(".footer div:first-child span").html(showCyCode+showTotalPrice+showCyUnit);
                        }

                        if(totalPrice>0 && totalPointPrice>0){
                           /* $(".price span").html("￥"+totalPrice+","+totalPointPrice+"积分");
                            $(".footer div:first-child span").html("￥"+totalPrice*num+","+totalPointPrice*num+"积分");*/
                        }
                        else if(totalPrice>0){
                           /* $(".price span").html(showCyCode+floatFixed2(showTotalPrice)+showCyUnit);
                            $(".footer div:first-child span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);*/
                            principal=totalPrice;
                        }
                        else if(totalPointPrice>0){
                            /*$(".price span").html(showCyCode+floatFixed2(showTotalPrice)+showCyUnit);
                            $(".footer div:first-child span").html(showCyCode+floatFixed2(showTotalPrice*effNumber)+showCyUnit);*/
                        }
                        $(".details").html(data.data.productDesc);

                        //理财产品
                        if(data.data.objectType==31){
                            $(".schedule,.schedule ul").show();
                            //需存本金（3年锁定期）
                            //$(".schedule ul li").eq(0).find("span").html(totalPrice*effNumber);
                            //服务信息
                            var html=$(".schedule ul li").eq(0).html();
                            //html="<li>"+html+"</li>";
                            html="";
                            rights=[];
                            var typeLast=[];
                            for(var i=0;undefined!=serviceInfoList && i<serviceInfoList.length;i++){
                                //type=3消费金，4利息
                                if(serviceInfoList[i].type=="4" || serviceInfoList[i].type=="3"){
                                    var have=0;
                                    for(var j=0;j<typeLast.length;j++){
                                        if(typeLast[j].type==serviceInfoList[i].type){
                                            typeLast[j].serviceValue=typeLast[j].serviceValue*1+serviceInfoList[i].serviceValue*1;
                                            have++;
                                        }
                                    }
                                    if(have==0){
                                        typeLast.push({"type":serviceInfoList[i].type,"serviceName":serviceInfoList[i].serviceName,"serviceValue":serviceInfoList[i].serviceValue});
                                    }
                                }
                            }
                            //console.log(typeLast);
                            for(var i=0;i<typeLast.length;i++){
                                rights.push(typeLast[i].serviceValue/100);
                                html=html+'<li>'+typeLast[i].serviceName+'<p class="fr">￥<span>'+effNumber*typeLast[i].serviceValue/100+'</span></p></li>';
                            }
                            $(".schedule ul").html(html);
                            if($(".schedule ul li").length==0 && $(".intoGroup").css("display")=="none" && $(".endTime").css("display")=="none"){
                                $(".schedule,.schedule ul").hide();
                            }
                        }

                        //去支付
                        $(".footer div:last-child").click(function(){
                            var proId={"productid":productId};
                            var listUrl='/order/h5/list';
                            $.post(h5orClient(listUrl),{data:JSON.stringify(proId)},function(res){
                                if(res.sc=="0"){
                                    if(undefined!=res.data && res.data.length>0){
                                        $("#hasOrder").show();
                                        $(".notPay").show();
                                        $(".notPayLook").click(function(){
                                            window.location.href="/html/h5/order/orderDetailN.html?orderid="+res.data[0].orderid;
                                        });
                                    }
                                    else {
                                        payment();
                                    }
                                }
                                else {
                                    payment();
                                }
                            });
                        });
                    });
                }
            },
            error: function(error){
                console.log(error.status);
            }
        });
    }


    function payment(){
        var productId=GetParams().id;
        var data={id:productId};
        if(undefined!=assetType){
            data.assetType=assetType;
        }
        if(undefined!=couponId){
            data.couponId=couponId;
        }
        $.ajax({
            url:"/product/h5/query",
            type:'POST',
            data:{data:JSON.stringify(data)},
            dataType:'json',
            success:function(data){
                if(data.sc==0){
                    maxBuyQuantity=data.data.maxBuyQuantity*1;
                    groupBuyingThreshold=data.data.groupBuyingThreshold*1;
                    expiredTime=data.data.expiredTime;
                    totalPrice=data.data.productPrice.totalPrice/100;
                    totalPointPrice=data.data.productPrice.totalPointPrice*1;
                    sellingRuleList=data.data.sellingRuleList;
                    tolAmount=data.data.tolAmount*1;
                    productName=data.data.productName;
                    sellAmount=data.data.sellAmount*1;
                    serviceInfoList=data.data.serviceInfoList;
                    payChannelList=data.data.payChannelList;
                    sellingRulesDesc=data.data.sellingRulesDesc;
                    objectType=data.data.objectType;
                    cancelPolicy=data.data.cancelPolicy;
                    saleEndtime=data.data.saleEndtime;

                    var productId=GetParams().id;
                    var num=1;//$(".numberBox input").val();
                    var memberUrl;
                    if(isApp==undefined){
                        memberUrl='/member/h5/info';
                    }
                    if(isApp=="jiheios"){
                        memberUrl='/member/client/info';
                        //app暂时不支持购买
                        /*$(".Box2 .confContent").html("<p style='margin-bottom: 1.5rem;'>请在微信【几何会员】公众号购买该产品</p><p style='text-align: left;'>购买方法：用微信搜索【几何民宿】公众号并关注，然后点击公众号底部的【消费权益共享计划】菜单进行购买。</p>");
                        $(".Box2").show();
                        return;*/
                    }
                    //请求是否会员
                    var dataN={};
                    $.post(memberUrl,{data:JSON.stringify(dataN)},function(data){
                        console.log(data);
                        if(data.sc=="0"){
                            isMember=1;
                            memberGrade=data.data.memberGrade;
                            points=data.data.points;
                            //原收货信息验证位置
                        }
                        else if(data.sc=="-1"){
                            if(isApp==undefined){
                                var urlLocation=window.location.href;
                                //location.href="/user/h5/auth?h5url="+urlLocation;
                                location.href="/user/h5/mbcenter?regsucc_tourl="+urlLocation;
                                return;
                            }
                            if(isApp=="jiheios"){
                                data1='{"act":"toLogin"}';
                                var url = "http://www.jihelife.com?data="+data1;
                                iosBridgeObjc(url);
                                $(".payBoxShadow").hide();
                                return;
                            }
                        }
                        else {
                            isMember=0;
                            memberGrade=-1;
                        }
                        //商品购买说明,buyerType=-1 非会员，0 金卡，1 白金卡，2 黑卡
                        //effNumber=$(".number").val();
                        effNumber=1;
                        if(sellingRuleList){
                            for(var i=0;i<sellingRuleList.length;i++){
                                if(sellingRuleList[i].buyerType==memberGrade){
                                    effectiveTime=sellingRuleList[i].saleBegintime;
                                }
                            }
                        }
                        if(totalPointPrice>0 && totalPointPrice*effNumber>points){
                            /*$(".smallBomb").html("积分余额不足").show();
                            setTimeout(function(){
                                $(".smallBomb").html("").hide();
                            },2000);*/
                            /*$(".Box4").show();
                            return;*/
                        }
                        if(effNumber*1>tolAmount*1 && tolAmount*1!=-1){//判断是否超出库存
                            $(".smallBomb").html("商品库存不足").show();
                            setTimeout(function(){
                                $(".smallBomb").html("").hide();
                            },2000);
                            return;
                        }
                        if(effNumber*1>canBuyQuantity*1 && maxBuyQuantity*1!=-1){//判断是否超出个人最大购买数量
                            $(".smallBomb").html("每人最多可购买"+maxBuyQuantity+"份").show();
                            setTimeout(function(){
                                $(".smallBomb").html("").hide();
                            },2000);
                            return;
                        }
                        /*if(objectType==40 && ($("#cusName").val()=="" || $("#cusPhone").val()=="" || $("#addressInput").val()=="")){
                            $(".smallBomb").html("请输入收货信息").show();
                            setTimeout(function(){
                                $(".smallBomb").html("").hide();
                            },2000);
                            $(".footer div").removeClass("disabled");
                            return false;
                        }*/

                        var dataN={
                            "userinfo":{"memberInfo":{"memberGrade":memberGrade}},
                            "id":productId,
                            "amount":num
                        };
                        if(isApp==undefined){//微信端
                            $.post("/product/h5/stock/judge",{data:JSON.stringify(dataN)},function(res){
                                console.log(res);
                                if(res.sc==0){
                                    var data,
                                        totPrice= 0,
                                        totPointPrice=0;
                                    var arr=[];
                                    if(totalPrice>0){
                                        totPrice=totalPrice*effNumber*100;
                                        arr.push({'paytype':0,"amount":totPrice});
                                    }
                                    if(totalPointPrice>0){
                                        totPointPrice=totalPointPrice*effNumber;
                                        arr.push({'paytype':6,"points":totPointPrice});
                                    }
                                    if( totPrice > 0 ){
                                        data = {'productid':productId,'quantity': effNumber,'amount': totPrice,'pointamount': totPointPrice,'payments': arr,'channel':GetParams().mc};
                                    }
                                    else{
                                        data = {'productid':productId,'quantity': effNumber,'pointamount': totPointPrice,'payments': arr,'channel':GetParams().mc};
                                    }
                                    /*if(objectType==40){
                                        data.customeraddress=$("#cusName").val()+","+$("#cusPhone").val()+","+$("#addressInput").val();
                                    }*/
                                    var data2=JSON.stringify(data);
                                    console.log(data);
                                    if(undefined!=GetParams().needpoints){
                                        window.location.href='/html/h5/order/toOrder.html?id='+data.productid+"&needpoints="+GetParams().needpoints+'&assettype='+assetType+'&couponid='+couponId+'&couponcode='+couponCode;
                                    }else {
                                        window.location.href='/html/h5/order/toOrder.html?id='+data.productid+'&assettype='+assetType+'&couponid='+couponId+'&couponcode='+couponCode;
                                    }
                                }
                                else if(res.sc=="PRODUCT-1010"){
                                    var urlLocation=window.location.href;
                                    var html=res.ErrorMsg+'<div class="isMember"><p class="memb">该产品仅限几何会员可参与购买</p><a href="/user/h5/mbcenter?regsucc_tourl='+urlLocation+'">注册加入会员</a></div>';
                                    $(".Box2 .confContent").html(html);
                                    $(".Box2").show();
                                }
                                else if(res.sc=="PRODUCT-1011"){
                                    $(".smallBomb").html(res.ErrorMsg).show();
                                    setTimeout(function(){
                                        $(".smallBomb").html("").hide();
                                    },2000);
                                }
                                else {
                                    $(".Box2 .confContent").html(res.ErrorMsg);
                                    $(".Box2").show();
                                }
                            });
                        }

                        if(isApp=="jiheios"){//appIOS
                            $.post("/product/client/stock/judge",{data:JSON.stringify(dataN)},function(res){
                                console.log(res);
                                if(res.sc==0){
                                    var payWay;
                                    if($(this).hasClass("sure") && $(this).html()=="确认支付"){
                                        payWay="jf";
                                    }
                                    else if($("div",this).hasClass("weixin")){
                                        payWay="wx";
                                    }
                                    else if($("div",this).hasClass("zfbao")){
                                        payWay="alipay";
                                    }
                                    else if($(this).hasClass("sure") && $(this).html()=="米庄支付"){
                                        payWay="mz";
                                    }
                                    $(".Box3").hide();
                                    var data,
                                        totPrice= 0,
                                        totPointPrice=0;
                                    var arr=[];
                                    if(totalPrice>0){
                                        totPrice=totalPrice*effNumber*100;
                                        arr.push({'paytype':0,"amount":totPrice});
                                    }
                                    if(totalPointPrice>0){
                                        totPointPrice=totalPointPrice*effNumber;
                                        arr.push({'paytype':6,"points":totPointPrice});
                                    }
                                    if( totPrice>0){
                                        data = {'productid':productId,'quantity': effNumber,'amount': totPrice,'pointamount': totPointPrice,'payments': arr,'channel':GetParams().mc};
                                    }

                                    else {
                                        data = {'productid':productId,'quantity': effNumber,'pointamount': totPointPrice,'payments': arr,'channel':GetParams().mc};
                                    }
                                    /*if(objectType==40){
                                        data.customeraddress=$("#cusName").val()+","+$("#cusPhone").val()+","+$("#addressInput").val();
                                    }*/
                                    var data2=JSON.stringify(data);
                                    console.log(data);
                                    if(undefined!=GetParams().needpoints){
                                        window.location.href='/html/h5/order/toOrder.html?id='+data.productid+"&needpoints="+GetParams().needpoints+'&assettype='+assetType+'&couponid='+couponId+'&couponcode='+couponCode;
                                    }else {
                                        window.location.href='/html/h5/order/toOrder.html?id='+data.productid+'&assettype='+assetType+'&couponid='+couponId+'&couponcode='+couponCode;
                                    }
                                }
                                else if(res.sc=="PRODUCT-1010"){
                                    var html=res.ErrorMsg+'<div class="isMember"><p class="memb">该产品仅限几何会员可参与购买</p><a>注册加入会员</a></div>';
                                    $(".Box2 .confContent").html(html);
                                    $(".Box2").show();
                                    $(".Box2 .confContent .isMember a").click(function(){
                                        data1='{"act":"toLogin"}';
                                        var url = "http://www.jihelife.com?data="+data1;
                                        iosBridgeObjc(url);
                                        $(".payBoxShadow").hide();
                                    });
                                }
                                else if(res.sc=="PRODUCT-1011"){
                                    $(".smallBomb").html(res.ErrorMsg).show();
                                    setTimeout(function(){
                                        $(".smallBomb").html("").hide();
                                    },2000);
                                }
                                else {
                                    $(".Box2 .confContent").html(res.ErrorMsg);
                                    $(".Box2").show();
                                }
                            });

                        }
                    });
                }
            },
            error: function(error){
                console.log(error.status);
            }
        });

    }


});


