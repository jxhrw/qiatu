var couponType;
//var hotelId;
$(document).ready(function () {
    couponType = getRequest().couponType;
    //券的类型couponType:1-房券，2-消费金，5-折扣券

    var baseInfo = {

        },
        useCondition = {};
    //baseInfo.couponType=couponType;
    if (couponType == 1) { //房券
        $(".wrap").attr("id", "roomVouchers");
        $("#couponType").html("房券");
        $.ajax({ //创建券的基本信息
            type: "GET",
            async: false,
            url: '/product/bms/room/list',
            success: function (roomData) {
                console.log(roomData);
                $.each(roomData.data, function (i) {
                    var productName = roomData.data[i].productName,
                        productId = roomData.data[i].productId;
                    var room = '<li><span class="checkbox" value="house" title="' + productId + '"></span>' + productName + '</li>'
                    $("#roomLists").append(room);
                })
            }
        });
        $.ajax({ //创建券的基本信息
            type: "GET",
            async: false,
            url: '/content/bms/merchant/detail',
            success: function (idData) {
                hotelId = idData.data.hotelId;
            }
        });
    } else if (couponType == 2) { //消费金
        $(".wrap").attr("id", "consumption");
        $("#couponType").html("消费金");
        $(".alsoUse").html("折扣券");
    } else if (couponType == 5) { //折扣券
        $(".wrap").attr("id", "discountCoupon");
        $("#couponType").html("折扣券");
        $(".alsoUse").html("消费金");
        $.ajax({ //创建券的基本信息
            type: "GET",
            async: false,
            url: '/content/bms/group/hotellist',
            success: function (merchantData) {
                console.log(merchantData);
                $.each(merchantData.data, function (i) {
                    var hotelCname = merchantData.data[i].hotelCname,
                        hotelId = merchantData.data[i].hotelId;
                    var merchant = '<li><span class="checkbox" value="merchant" title="' + hotelId + '"></span>' + hotelCname + '</li>';
                    $("#chooseMerchant").append(merchant);
                    if (merchantData.data.length == 1) {
                        $("#chooseMerchant .checkbox").hide().addClass("selected");
                    }
                })
            }
        });
    }
    $("." + $(".wrap").attr("id")).show();
    if (getRequest().couponId != undefined) {
        //$(".consumerType li").eq(b).find(".checkbox").removeClass("selected");
        $.ajax({ //创建券的基本信
            type: "post",
            async: false,
            data: {
                data: JSON.stringify({
                    couponId: getRequest().couponId
                })
            },
            url: '/coupon/bms/termDetail',
            success: function (info) {
                console.log(info.data);
                $("#setName").val(info.data.couponName); //券名称
                $("#discount").val(info.data.faceValue / 10); //券折扣
                $("#effective_begin").val(getDate(parseInt(info.data.effectiveTime))); //生效日期
                $("#effective_end").val(getDate(parseInt(info.data.expireTime))); //失效日期
                $.each(info.data.couponProductList, function (i) {
                    if (info.data.couponProductList != undefined) { //部分房型可用
                        if (info.data.couponProductList[i].productId != -1) {
                            $("#chooseRoom").addClass("selected").parent().prev().find(".radio").removeClass("selected");
                            $("#availableRoom").show();
                            for (var r = 0; r < $("#roomLists li").length; r++) {
                                if ($("#roomLists li").eq(r).find(".checkbox").attr("title") == info.data.couponProductList[i].productId) {
                                    $("#roomLists li").eq(r).find(".checkbox").addClass("selected");
                                }
                            }
                        } else { //可用商户
                            for (var h = 0; h < $("#chooseMerchant li").length; h++) {
                                if ($("#chooseMerchant li").eq(h).find(".checkbox").attr("title") == info.data.couponProductList[i].hotelId) {
                                    $("#chooseMerchant li").eq(h).find(".checkbox").addClass("selected");
                                }
                            }
                        }
                    }
                })
                $.each(info.data.useConditionList, function (i) { //不可用日期
                    if (info.data.useConditionList[i].conditionType == "cond-date") {
                        $("#setLimitedDate").parent().prev().find(".radio").removeClass("selected");
                        $("#setLimitedDate").addClass("selected");
                        $("#chooseDateBox").show();
                        for (var d = 0; d < $("#dateCondition td").length; d++) {
                            if ($("#dateCondition td").eq(d).find(".checkbox").attr("title") == info.data.useConditionList[i].conditionValue) {
                                $("#dateCondition td").eq(d).find(".checkbox").addClass("selected");
                            }
                        }
                        // console.log(parseInt(info.data.useConditionList[i].conditionValue));

                        if (!isNaN(parseInt(info.data.useConditionList[i].conditionValue))) {
                            var limitedDate = info.data.useConditionList[i].conditionValue.replace(/\./g, "-");
                            if ((/^(\d{4})-(\d{2})-(\d{2})$/).test(limitedDate)) {
                                var times = limitedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                                var optionalDateHtml = $(".optionalDate").html;
                                var hasYear = 0;
                                var repeat = 0;
                                if (optionalDateHtml != "") {
                                    $(".optionalDate .years").each(function () {
                                        if (times[1] == $(this).attr("id")) {
                                            hasYear++;
                                            $("li", this).each(function () {
                                                if (times[2] + '.' + times[3] == $(this).attr("id")) {
                                                    repeat++;
                                                }
                                            });
                                        }
                                    });
                                }
                                if (hasYear != 0 && repeat == 0) {
                                    $("#" + times[1] + " .customDate").append('<li class="fl" id="' + times[2] + '.' + times[3] + '"><span class="selectedDay">' + times[2] + '.' + times[3] + '</span><span class="deleteDay">×</span></li>');
                                }
                                if (hasYear == 0 && repeat == 0) {
                                    $(".optionalDate").append(
                                        '<div class="years" id="' + times[1] + '">' +
                                        '<p class="noUsey"><span>' + times[1] + '</span>年不可用日期：</p>' +
                                        '<ul class="customDate clearfix">' +
                                        '<li class="fl" id="' + times[2] + '.' + times[3] + '"><span class="selectedDay">' + times[2] + '.' + times[3] + '</span><span class="deleteDay">×</span></li>' +
                                        '</ul>' +
                                        '</div>');
                                }
                            }
                        }
                    }
                    if (info.data.useConditionList[i].conditionType == "cond-producttype") { //类型
                        for (var p = 0; p < $(".consumerType li").length; p++) { //使用次数
                            if ($(".consumerType li").eq(p).find(".checkbox").attr("title") == info.data.useConditionList[i].conditionValue) {
                                $(".consumerType li").eq(p).find(".checkbox").addClass("selected");
                            }
                        }
                    }
                    if (info.data.useConditionList[i].conditionType == "cond-coupontype") { //能否同时使用
                        for (var t = 0; t < $("#ifTogether .radio").length; t++) { //使用次数
                            if ($("#ifTogether .radio").eq(t).attr("title") == info.data.useConditionList[i].ifCanUse) {
                                $("#ifTogether .radio").eq(t).addClass("selected");
                                $("#ifTogether .radio").eq(t).parent().siblings().find(".radio").removeClass("selected");
                            }
                        }
                    }
                })
                for (var u = 0; u < $("#usageCount li").length; u++) { //使用次数
                    if ($("#usageCount li").eq(u).find(".radio").attr("title") == info.data.usageCount) {
                        $("#usageCount li").eq(u).find(".radio").addClass("selected");
                        $("#usageCount li").eq(u).siblings().find(".radio").removeClass("selected");
                    }
                }
                for (var o = 0; o < $("#aheadDays option").length; o++) { //需要提前预定的天数
                    $.each(info.data.useConditionList, function (i) {
                        if (info.data.useConditionList[i].conditionType == "cond-aheadoftime") {
                            $("#needAhead").parent().prev().find(".radio").removeClass("selected");
                            $("#needAhead").addClass("selected");
                            $("#limitDays").show();
                            if ($("#aheadDays option").eq(o).val() == info.data.useConditionList[i].conditionValue) {
                                $("#aheadDays option").eq(o).attr("selected", "selected");
                            }
                        }
                    })
                }
                $("#remark").val(info.data.remark); //券备注
            }
        })
        var baseInfoUrl = '/coupon/bms/updateBaseInfo',
            applyProductUrl = '/coupon/bms/updateApplyProduct',
            useConditionUrl = '/coupon/bms/updateUseCondition';
    } else {
        var baseInfoUrl = '/coupon/bms/addBaseInfo',
            applyProductUrl = '/coupon/bms/addApplyProduct',
            useConditionUrl = '/coupon/bms/addUseCondition';
        $(".consumerType li").eq(0).find(".checkbox").addClass("selected");
        $(".consumerType li").eq(1).find(".checkbox").addClass("selected");

    }
    $("#discount").bind('input propertychange', function () { //监听文本域内容的变化
        if ($("#discount").val().indexOf(".") > -1) {
            if ($("#discount").val().split(".")[1].length > 1) {
                $("#discount").val(round($("#discount").val(), 1));
            }
        }
        if ($("#discount").val() < 0 || $("#discount").val() > 9.9) {
            $("#discount").val("");
        }
    })
    $(".alertBox").height($(window).height());

    //单选
    $(".radio").parent().on("click", function () {
        var thisVal = $(this).find(".radio").attr("value");
        //alert(thisVal);
        if ($(this).find(".radio").hasClass("selected")) {
            //$(this).removeClass("selected");
        } else {
            $(".radio").each(function () {
                if (thisVal == $(this).attr("value")) {
                    $(this).removeClass("selected");
                }
            });
            $(this).find(".radio").addClass("selected");
        }
        if ("availableDate" == thisVal) {
            availabilityDate($(this).find(".radio"));
        }
        if ("timeLimit" == thisVal) {
            timeLimit($(this).find(".radio"));
        }
        if ("avaRoom" == thisVal) {
            availableRoom($(this).find(".radio"));
        }
        if ("useLimit" == thisVal) {
            useLimit($(this).find(".radio"));
        }
    });
    //多选
    $(".checkbox").parent().click(function () {
        if ($(this).find(".checkbox").hasClass("selected")) {
            $(this).find(".checkbox").attr("value", 0).removeClass("selected");
        } else {
            $(this).find(".checkbox").addClass("selected").attr("value", 1);
        }
    });

    //选择不可用日期
    $("#addDay").click(function () {
        var this_time = $("#unavailableDate").val();
        if ((/^(\d{4})-(\d{2})-(\d{2})$/).test(this_time)) {
            var times = this_time.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            var optionalDateHtml = $(".optionalDate").html;
            var hasYear = 0;
            var repeat = 0;
            if (optionalDateHtml != "") {
                $(".optionalDate .years").each(function () {
                    if (times[1] == $(this).attr("id")) {
                        hasYear++;
                        $("li", this).each(function () {
                            if (times[2] + '.' + times[3] == $(this).attr("id")) {
                                repeat++;
                            }
                        });
                    }
                });
            }
            if (hasYear != 0 && repeat == 0) {
                $("#" + times[1] + " .customDate").append('<li class="fl" id="' + times[2] + '.' + times[3] + '"><span class="selectedDay">' + times[2] + '.' + times[3] + '</span><span class="deleteDay">×</span></li>');
            }
            if (hasYear == 0 && repeat == 0) {
                $(".optionalDate").append(
                    '<div class="years" id="' + times[1] + '">' +
                    '<p class="noUsey"><span>' + times[1] + '</span>年不可用日期：</p>' +
                    '<ul class="customDate clearfix">' +
                    '<li class="fl" id="' + times[2] + '.' + times[3] + '"><span class="selectedDay">' + times[2] + '.' + times[3] + '</span><span class="deleteDay">×</span></li>' +
                    '</ul>' +
                    '</div>');
            }
        }
    });

    //删除日期
    $(".optionalDate").on("click", ".deleteDay", function () {
        if ($(this).parents(".customDate").find("li").length == 1) {
            $(this).parents(".years").remove();
        }
        $(this).parents("li").remove();
    });

    //删除同时使用的券
    $("#alsoUse").on("click", ".deleteDay", function () {
        var name = $(this).parents("li").find(".selectedDay").html();
        $(this).parents("li").remove();
        $("#couponUl li").each(function () {
            if (name == $(".couponName", this).html()) {
                $(".checkbox", this).removeClass("selected");
            }
        });
    });

    //打开可同时使用的券选择/关闭
    $("#alsoUseBox").click(function () {
        $("#chooseCouponBox").show();
    });
    $(".maskClose").click(function () {
        $(".alertBox").hide();
    });

    //添加可同时使用的券
    $("#chooseSure").click(function () {
        var couponHtml = "";
        $("#couponUl li").each(function () {
            if ($(".checkbox", this).hasClass("selected")) {
                couponHtml += '<li class="fl"><span class="selectedDay">' + $(".couponName", this).html() + '</span><span class="deleteDay">×</span></li>'
            }
        });
        $("#alsoUse").html(couponHtml);
        $(".alertBox").hide();
    });

    //时间不为空
    $(".timeChoiceBox input").blur(function () {
        var this_id = $(this).attr("id");
        setTimeout(function () {
            nonEmpty(this_id);
        }, 300);
    });
    //console.log(hotelId);
    $("#discountCoupon #save").click(function () {
        if ($("#setName").val() == "") {
            jiHeAlert.open("请填写券名称");
        } else if ($("#setName").val() != "" && $("#discount").val() == "") {
            jiHeAlert.open("请设置券的折扣");
        } else {
            if ($("#setName").val() != "" && $("#discount").val() != "" && $("#nonEmpty").hasClass("selected")) {
                if ($("#effective_begin").val() == "" || $("#effective_end").val() == "") {
                    jiHeAlert.open("日期不能为空");
                }
            }
        }
        baseInfo = new addBaseInfo();
        useCondition = new addUseCondition();
        console.log(baseInfo);
        var addBaseInfoData = {};
        addBaseInfoData.couponBaseInfo = baseInfo;
        if (getRequest().couponId != undefined) {
            addBaseInfoData.couponBaseInfo.couponId = getRequest().couponId;
        }
        var applyProductArr = [];
        for (var s = 0; s < $("#chooseMerchant li").length; s++) {
            if ($("#chooseMerchant li").eq(s).find(".checkbox").hasClass("selected") == 1) {
                var applyProduct = {};
                //applyProduct.couponId = couponId;
                applyProduct.hotelId = $("#chooseMerchant li").eq(s).find(".checkbox").attr("title");
                applyProduct.productId = -1;
                applyProduct.ifCanUse = 1;
                applyProductArr.push(applyProduct);
            }
        }
        console.log(applyProductArr);
        //var addApplyProduct = {};
        //addApplyProduct.couponId = couponId;
        //addApplyProduct.couponProductList = applyProductArr;
        if(applyProductArr.length1 = 0){
            addBaseInfoData.couponBaseInfo.couponProductList = applyProductArr;
        }
        // $.ajax({//创建券的适用商户
        //     type: "post",
        //     async: false,
        //     url: applyProductUrl,
        //     data: { data: JSON.stringify(addApplyProduct) },
        //     success: function (getApplyProduct) {
        //         console.log(getApplyProduct);
        //     }
        // });
        console.log($(".consumerType li").length);
        var consumerTypeArr = [];
        for (var i = 0; i < $(".consumerType li").length; i++) { //可用消费类型
            var consumerType = {};
            if ($(".consumerType li").eq(i).find(".checkbox").hasClass("selected")) {
                //consumerType.couponId = couponId;
                consumerType.conditionType = "cond-producttype";
                consumerType.conditionValue = $(".consumerType li").eq(i).find(".checkbox").attr("title"),
                    consumerType.ifCanUse = 1;
                consumerTypeArr.push(consumerType);
            }
            console.log($(".consumerType li").eq(i).find(".checkbox").attr("title"))
        }
        for (var j = 0; j < $("#dateCondition td").length; j++) { //设置不可用日期
            var consumerType = {};
            if ($("#dateCondition td").eq(j).find(".checkbox").hasClass("selected")) {
                //consumerType.couponId = couponId;
                consumerType.conditionType = "cond-date";
                consumerType.conditionValue = $("#dateCondition td").eq(j).find(".checkbox").attr("title");
                consumerType.ifCanUse = 0;
                consumerTypeArr.push(consumerType);
            }
        }
        var customDateArr = [];
        if ($("#setLimitedDate").hasClass("selected")) {
            for (var k = 0; k < $(".years").length; k++) { //自定义不可用日期
                var consumerType = {};
                for (var m = 0; m < $(".years").eq(k).find(".customDate li").length; m++) {
                    customDate = $(".years").eq(k).attr("id") + '.' + $(".years").eq(k).find(".customDate li").eq(m).attr("id");
                    customDate = customDate.replace(/\./g, "-");
                    console.log(customDate);
                    customDateArr.push(customDate);
                }
                console.log(customDateArr);
            }
            if (customDateArr.length != 0) {
                //consumerType.couponId = couponId;
                consumerType.conditionType = "cond-date";
                consumerType.conditionValue = customDateArr.join(',');
                consumerType.ifCanUse = 0;
                consumerTypeArr.push(consumerType);
            }
        }
        if ($("#ifTogether .selected").attr("title") == 1) { //能否同时使用
            var consumerType = {};
            //consumerType.couponId = couponId;
            consumerType.conditionType = "cond-coupontype";
            consumerType.conditionValue = 2;
            consumerType.ifCanUse = 1;
            consumerTypeArr.push(consumerType);
        } else {
            var consumerType = {};
            //consumerType.couponId = couponId;
            consumerType.conditionType = "cond-coupontype";
            consumerType.conditionValue = 2;
            consumerType.ifCanUse = 0;
            consumerTypeArr.push(consumerType);
        }
        console.log(consumerTypeArr);
        //var addUseCondition = {};
        //addUseCondition.couponId = couponId;
        addBaseInfoData.couponBaseInfo.useConditionList = consumerTypeArr;
        // $.ajax({//券的使用条件
        //     type: "post",
        //     url: useConditionUrl,
        //     data: { data: JSON.stringify(addUseCondition) },
        //     success: function (getUseCondition) {
        //         console.log(getUseCondition);
        //     }
        // });
        console.log(addBaseInfoData);
        $.ajax({ //创建券的基本信息
            type: "post",
            async: false,
            url: baseInfoUrl,
            data: {
                data: JSON.stringify(addBaseInfoData)
            },
            success: function (getBaseInfo) {
                console.log(getBaseInfo);
                // if (getRequest().couponId != undefined) {
                //     var couponId = getRequest().couponId;
                // } else {
                //     var couponId = getBaseInfo.data.couponId;
                // }
                if (getBaseInfo.sc == 0) {
                    window.location.href = '/html/bms/pcBms/BMSCouponDeploy/BMSCouponDeploy.html';
                }
            }
        });
    })
    $("#roomVouchers #save").click(function () {
        if ($("#setName").val() == "") {
            jiHeAlert.open("请填写券名称");
        } else {
            if ($("#setName").val() != "" && $("#nonEmpty").hasClass("selected")) {
                if ($("#effective_begin").val() == "" || $("#effective_end").val() == "") {
                    jiHeAlert.open("日期不能为空");
                }
            }
        }
        baseInfo = new addBaseInfo();
        useCondition = new addUseCondition();
        console.log(baseInfo);
        var addBaseInfoData = {};
        addBaseInfoData.couponBaseInfo = baseInfo;
        if (getRequest().couponId != undefined) {
            addBaseInfoData.couponBaseInfo.couponId = getRequest().couponId;
        }
        // if (getRequest().couponId != undefined) {
        //     var couponId = getRequest().couponId;
        // } else {
        //     var couponId = getBaseInfo.data.couponId;
        // }
        var applyProductArr = [],
            consumerTypeArr = [];
        if ($("#chooseRoom").hasClass("selected")) {
            var productIdArr = [];
            var applyProduct = {};
            for (var s = 0; s < $("#roomLists li").length; s++) {
                if ($("#roomLists li").eq(s).find(".checkbox").hasClass("selected")) {
                    productIds = $("#roomLists li").eq(s).find(".checkbox").attr("title");
                    productIdArr.push(productIds);
                }
            }
            if(hotelId){
                applyProduct.hotelId = hotelId;
            }
            applyProduct.productId = productIdArr.join(',');
            applyProduct.ifCanUse = 1;
            applyProductArr.push(applyProduct);
        } else {
            var applyProduct = {};
            if(hotelId){
                applyProduct.hotelId = hotelId;
            }
            applyProduct.productId = -1;
            applyProduct.ifCanUse = 1;
            applyProductArr.push(applyProduct);
        }
        console.log(applyProduct);
        //var addApplyProduct = {};
        //addApplyProduct.couponId = couponId;
        // addApplyProduct.couponProductList = applyProductArr;
        addBaseInfoData.couponBaseInfo.couponProductList = applyProductArr;
        // $.ajax({//创建券的适用商户
        //     type: "post",
        //     async: false,
        //     url: applyProductUrl,
        //     data: { data: JSON.stringify(addApplyProduct) },
        //     success: function (getApplyProduct) {
        //         console.log(getApplyProduct);
        //     }
        // });

        console.log($(".consumerType li").length);
        if ($("#setLimitedDate").hasClass("selected")) {
            for (var j = 0; j < $("#dateCondition td").length; j++) { //设置不可用日期
                var consumerType = {};
                if ($("#dateCondition td").eq(j).find(".checkbox").hasClass("selected")) {
                    consumerType.conditionType = "cond-date";
                    consumerType.conditionValue = $("#dateCondition td").eq(j).find(".checkbox").attr("title");
                    consumerType.ifCanUse = 0;
                    consumerTypeArr.push(consumerType);
                }
            }

            var customDateArr = [];
            for (var k = 0; k < $(".years").length; k++) { //自定义不可用日期
                var consumerType = {};
                for (var m = 0; m < $(".years").eq(k).find(".customDate li").length; m++) {
                    customDate = $(".years").eq(k).attr("id") + '.' + $(".years").eq(k).find(".customDate li").eq(m).attr("id");
                    customDate = customDate.replace(/\./g, "-");
                    console.log(customDate);
                    customDateArr.push(customDate);
                }
                console.log(customDateArr);
            }
            if (customDateArr.length != 0) {
                consumerType.conditionType = "cond-date";
                consumerType.conditionValue = customDateArr.join(',');
                consumerType.ifCanUse = 0;
                consumerTypeArr.push(consumerType);
            }
        }
        if ($("#needAhead").hasClass("selected")) {
            var consumerType = {};
            console.log($("#aheadDays option:selected").val());
            consumerType.conditionType = "cond-aheadoftime";
            consumerType.conditionValue = $("#aheadDays option:selected").val();
            consumerType.ifCanUse = 1;
            consumerTypeArr.push(consumerType);
        }
        console.log(consumerTypeArr);
        //var addUseCondition = {};
        //addUseCondition.couponId = couponId;
        // addUseCondition.useConditionList = consumerTypeArr;
        if (consumerTypeArr.length != 0) {
            addBaseInfoData.couponBaseInfo.useConditionList = consumerTypeArr;
        }
        // $.ajax({//券的使用条件
        //     type: "post",
        //     async: false,
        //     url: useConditionUrl,
        //     data: { data: JSON.stringify(addUseCondition) },
        //     success: function (getUseCondition) {
        //         console.log(getUseCondition);
        //     }
        // });
        $.ajax({ //创建券的基本信息
            type: "post",
            async: false,
            url: baseInfoUrl,
            data: {
                data: JSON.stringify(addBaseInfoData)
            },
            success: function (getBaseInfo) {
                console.log(getBaseInfo);
                if (getBaseInfo.sc == 0) {
                    window.location.href = '/html/bms/pcBms/BMSCouponDeploy/BMSCouponDeploy.html';
                }
            }
        });
    });
});

function nonEmpty(id) {
    var dom = $("#" + id);
    if ($("#nonEmpty").hasClass("selected") && "" == dom.val()) {
        dom.parents(".timeChoiceBox").find(".nonEmpty").show();
    } else {
        dom.parents(".timeChoiceBox").find(".nonEmpty").hide();
    }
}

function availabilityDate(dom) {
    if (dom.hasClass("open") && dom.hasClass("selected")) {
        $("#chooseDateBox").show();
    } else {
        $("#chooseDateBox").hide();
    }
}

function timeLimit(dom) {
    if (dom.hasClass("open") && dom.hasClass("selected")) {
        $("#limitDays").show();
    } else {
        $("#limitDays").hide();
    }
}

function availableRoom(dom) {
    if (dom.hasClass("open") && dom.hasClass("selected")) {
        $("#availableRoom").show();
    } else {
        $("#availableRoom").hide();
    }
}

function useLimit(dom) {
    if (dom.hasClass("open") && dom.hasClass("selected")) {
        $("#conditions").show();
    } else {
        $("#conditions").hide();
    }
}
//获取url的参数
function getRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function getDate(time) { //将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
}

function getTimestamp(date) {
    return Date.parse(date.replace(/-/g, "/"));
}
//券基本信息
function addBaseInfo() {
    this.couponName = $("#setName").val(); //券名
    this.couponType = couponType; //券类型
    if ($("#nonEmpty").hasClass("selected")) {
        this.effectiveTime = getTimestamp($("#effective_begin").val()); //券生效日期
        this.expireTime = getTimestamp($("#effective_end").val()); //券失效日期
    }
    if (couponType == 1) {
        this.applyNights = 1;
    }
    if ($("#discount").val() != "") { //为折扣券时，增加一个faceValue属性
        this.faceValue = $("#discount").val() * 10; //券面值
        if ($("#usageCount .selected").attr("title") == 1) { //券使用次数
            this.usageCount = 1;
        } else {
            this.usageCount = -1;
        }
    }
    console.log($("#usageCount .selected").attr("title"));
    if ($("#remark").val() != "" || $("#remark").val() == undefined) { //券备注
        this.remark = $("#remark").val();
    }
}
//券使用条件
function addUseCondition() {}

function round(v, e) { //四舍五入保留
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
}