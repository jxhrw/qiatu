var iconStatusArr = {},
    cardCodeArr = [],
    couponCodeArr = [];
$(document).ready(function () {
    var id = getRequest().member_hotelid;
    var slideIndex;
    $(".icons-bottom").attr("title", $(".active").attr("id"));
    $.ajax({ //商户详情接口
        type: "post",
        async: false,
        url: '/content/h5/merchant/detail',
        data: {
            data: JSON.stringify({
                id: id
            })
        },
        success: function (data) {
            console.log(data);
            var groupName = data.data.groupName, //集团名
                productId = data.data.instorepayPid, //店内支付产品id
                hotelName = data.data.hotelCname, //酒店名称
                groupMembers = data.data.groupMembers; //集团信息
            var payUrl = payUrl = "/html/h5/order/instorePay.html?member_hotelid=" + id + "&productId=" + productId + "&storeName=" + hotelName; //店内支付地址
            $("title").html(groupName + "会员中心");
            $(".pay").click(function () {
                window.location.href = payUrl;
            });
            $(".orders").click(function () {
                window.location.href = "/html/h5/order/myOrderList.html?hotelid=" + id;
            });
            var hotelIds = []; //集团所有的hotelId
            $.each(groupMembers, function (i) {
                hotelIds.push(groupMembers[i].hotelId);
                var phoneNumber = groupMembers[i].phone;
                if (groupMembers[i].hotelId == id) {
                    $(".tel span").html(phoneNumber);
                }
                if (!phoneNumber) {
                    $(".tel").hide();
                }
            });
            console.log(hotelIds);
            $(".book").click(function () {
                if (1 == hotelIds.length) {
                    window.location.href = "/html/h5/product/detail/bnbShare.html?id=" + hotelIds[0];
                } else {
                    window.location.href = "/html/h5/product/list/exchangeList.html?hotelIds=" + hotelIds.join(",") + "&button=0";
                }
            });
            $(".checkmore").attr("href", "/html/h5/member/giftcard/memberships.html?hotelIds=" + encodeURIComponent(hotelIds.join(",")));
            getList("cards", hotelIds);
            getList("coupons", hotelIds);
            if ("cards" == $(".icons-bottom").attr("title")) {
                console.log(iconStatusArr.cardIconArr);
                if (undefined != iconStatusArr.cardIconArr) {
                    $(".hotels").attr("title", iconStatusArr.cardIconArr[0].hotels.status);
                    $(".hotels a").attr("href", iconStatusArr.cardIconArr[0].hotels.url);
                    $(".goods").attr("title", iconStatusArr.cardIconArr[0].goods.status);
                    $(".goods a").attr("href", iconStatusArr.cardIconArr[0].goods.url);
                    $(".transfer").attr("title", iconStatusArr.cardIconArr[0].transfer.status);
                    $(".transfer a").attr("href", iconStatusArr.cardIconArr[0].transfer.url);
                    for (var i = 0; i < $(".icons-bottom li").length; i++) {
                        if ("1" === $(".icons-bottom li").eq(i).attr("title")) {
                            $(".icons-bottom li").eq(i).removeClass("invalid");
                        } else if ("0" === $(".icons-bottom li").eq(i).attr("title")) {
                            $(".icons-bottom li").eq(i).addClass("invalid");
                        }
                    }
                }

            }

            active(".tabs li");
            var mySwiper = new Swiper(".swiper-container", {
                observer: true,
                slidesPerView: "auto",
                centeredSlides: true,
                watchSlidesProgress: true,
                onProgress: function (a) {
                    var b, c, d;
                    for (b = 0; b < a.slides.length; b++)
                        c = a.slides[b],
                        d = c.progress,
                        es = c.style,
                        scale = 1 - Math.min(Math.abs(.2 * d), 1),
                        es.opacity = 1 - Math.min(Math.abs(d / 2), 1),
                        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = "scale(" + scale + ")"
                },
                onSetTransition: function (a, b) {
                    for (var c = 0; c < a.slides.length; c++)
                        es = a.slides[c].style,
                        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = b + "ms"
                },
                onSlideChangeEnd: function (swiper) {
                    //alert(swiper.activeIndex); //切换结束时，告诉我现在是第几个slide
                    if ("coupons" == $(".icons-bottom").attr("title")) {
                        console.log(iconStatusArr.couponIconArr);
                        var iconStatusObj = (iconStatusArr.couponIconArr)[swiper.activeIndex];
                        $(".hotels").attr("title", iconStatusObj.hotels.status);
                        $(".hotels a").attr("href", iconStatusObj.hotels.url);
                        $(".goods").attr("title", iconStatusObj.goods.status);
                        $(".goods a").attr("href", iconStatusObj.goods.url);
                        $(".transfer").attr("title", iconStatusObj.transfer.status);
                        $(".transfer a").attr("href", iconStatusObj.transfer.url);
                        $(".varied-icon").attr("title", iconStatusObj.variedIcon.status);
                        $(".varied-icon a").attr("href", iconStatusObj.variedIcon.url);

                    } else if ("cards" == $(".icons-bottom").attr("title")) {
                        console.log(iconStatusArr.cardIconArr);
                        var iconStatusObj = (iconStatusArr.cardIconArr)[swiper.activeIndex];
                        $(".hotels").attr("title", iconStatusObj.hotels.status);
                        $(".hotels a").attr("href", iconStatusObj.hotels.url);
                        $(".goods").attr("title", iconStatusObj.goods.status);
                        $(".goods a").attr("href", iconStatusObj.goods.url);
                        $(".transfer").attr("title", iconStatusObj.transfer.status);
                        $(".transfer a").attr("href", iconStatusObj.transfer.url);

                    }
                    for (var i = 0; i < $(".icons-bottom li").length; i++) {
                        if ("1" === $(".icons-bottom li").eq(i).attr("title")) {
                            $(".icons-bottom li").eq(i).removeClass("invalid");
                        } else if ("0" === $(".icons-bottom li").eq(i).attr("title")) {
                            $(".icons-bottom li").eq(i).addClass("invalid");
                        }
                    }
                },
                onTouchEnd: function (swiper) {
                    //alert(swiper.activeIndex); //切换结束时，告诉我现在是第几个slide
                    if ("coupons" == $(".icons-bottom").attr("title")) {
                        console.log(iconStatusArr.couponIconArr);
                        var iconStatusObj = (iconStatusArr.couponIconArr)[swiper.activeIndex];
                        $(".hotels").attr("title", iconStatusObj.hotels.status);
                        $(".hotels a").attr("href", iconStatusObj.hotels.url);
                        $(".goods").attr("title", iconStatusObj.goods.status);
                        $(".goods a").attr("href", iconStatusObj.goods.url);
                        $(".transfer").attr("title", iconStatusObj.transfer.status);
                        $(".transfer a").attr("href", iconStatusObj.transfer.url);
                        $(".varied-icon").attr("title", iconStatusObj.variedIcon.status);
                        $(".varied-icon a").attr("href", iconStatusObj.variedIcon.url);

                    } else if ("cards" == $(".icons-bottom").attr("title")) {
                        console.log(iconStatusArr.cardIconArr);
                        var iconStatusObj = (iconStatusArr.cardIconArr)[swiper.activeIndex];
                        $(".hotels").attr("title", iconStatusObj.hotels.status);
                        $(".hotels a").attr("href", iconStatusObj.hotels.url);
                        $(".goods").attr("title", iconStatusObj.goods.status);
                        $(".goods a").attr("href", iconStatusObj.goods.url);
                        $(".transfer").attr("title", iconStatusObj.transfer.status);
                        $(".transfer a").attr("href", iconStatusObj.transfer.url);
                    }
                    for (var i = 0; i < $(".icons-bottom li").length; i++) {
                        if ("1" === $(".icons-bottom li").eq(i).attr("title")) {
                            $(".icons-bottom li").eq(i).removeClass("invalid");
                        } else if ("0" === $(".icons-bottom li").eq(i).attr("title")) {
                            $(".icons-bottom li").eq(i).addClass("invalid");
                        }
                    }
                }
            });

        }
    });
    console.log(iconStatusArr);
    // for (var i = 0; i < $(".tabs li").length; i++) {
    //     var type = $(".tabs li").eq(i).attr("id");
    //     if ($("." + type).children(":first") == 0) {
    //         if (type == "cards") {
    //             $("." + type).html("无可用会员卡");
    //         } else if (type == "coupons") {
    //             $("." + type).html("无可用礼券");
    //         }
    //     }
    // }
    getDetail(".card", cardCodeArr, 0);
    getDetail(".coupon", couponCodeArr, 0);
    getDetail(".couponQRCode", couponCodeArr, 1);
    // $(".coupon").click(function(){
    //     console.log($(this).parent().index());

    // });
});

function active(dom) {
    $(dom).click(function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var tabName = $(this).attr("id");
        $("." + tabName).css("display", "block");
        $("." + tabName).siblings().css("display", "none");
        tabName == "coupons" && $("." + tabName + " .swiper-slide").length > 5 ? $(".checkmore").css("visibility", "visible") : $(".checkmore").css("visibility", "hidden");
        $(".icons-bottom").attr("title", tabName);
        if ("coupons" === tabName) {
            if ($(".coupon").length == 0) {
                $(".icons-bottom").css("visibility", "hidden");
            } else {
                $(".icons-bottom").css("visibility", "visible");
            }

            $(".varied-icon").removeClass("recharge").addClass("exchange").html('<a><span></span>兑换积分</a>');
            var currentIndex = $("." + tabName).find(".swiper-slide-active").index();
            //alert(currentIndex);
            if (undefined != iconStatusArr.couponIconArr) {
                $(".hotels").attr("title", iconStatusArr.couponIconArr[currentIndex].hotels.status);
                $(".hotels a").attr("href", iconStatusArr.couponIconArr[currentIndex].hotels.url);
                $(".goods").attr("title", iconStatusArr.couponIconArr[currentIndex].goods.status);
                $(".goods a").attr("href", iconStatusArr.couponIconArr[currentIndex].goods.url);
                $(".transfer").attr("title", iconStatusArr.couponIconArr[currentIndex].transfer.status);
                $(".transfer a").attr("href", iconStatusArr.couponIconArr[currentIndex].transfer.url);
                $(".varied-icon").attr("title", iconStatusArr.couponIconArr[currentIndex].variedIcon.status);
                $(".varied-icon a").attr("href", iconStatusArr.couponIconArr[currentIndex].variedIcon.url);
                for (var i = 0; i < $(".icons-bottom li").length; i++) {
                    if ("1" === $(".icons-bottom li").eq(i).attr("title")) {
                        $(".icons-bottom li").eq(i).removeClass("invalid");
                    } else if ("0" === $(".icons-bottom li").eq(i).attr("title")) {
                        $(".icons-bottom li").eq(i).addClass("invalid");
                    }
                }
            }
        } else {
            if ($(".card").length == 0) {
                $(".icons-bottom").css("visibility", "hidden");
            } else {
                $(".icons-bottom").css("visibility", "visible");
            }
            $(".varied-icon").removeClass("exchange").addClass("recharge").html('<span></span>充值');
            var currentIndex = $("." + tabName).find(".swiper-slide-active").index();
            //alert(currentIndex);
            if (undefined != iconStatusArr.cardIconArr) {
                $(".hotels").attr("title", iconStatusArr.cardIconArr[currentIndex].hotels.status);
                $(".hotels a").attr("href", iconStatusArr.cardIconArr[currentIndex].hotels.url);
                $(".goods").attr("title", iconStatusArr.cardIconArr[currentIndex].goods.status);
                $(".goods a").attr("href", iconStatusArr.cardIconArr[currentIndex].goods.url);
                $(".transfer").attr("title", iconStatusArr.cardIconArr[currentIndex].transfer.status);
                $(".transfer a").attr("href", iconStatusArr.cardIconArr[currentIndex].transfer.url);
                for (var i = 0; i < $(".icons-bottom li").length; i++) {
                    if ("1" === $(".icons-bottom li").eq(i).attr("title")) {
                        $(".icons-bottom li").eq(i).removeClass("invalid");
                    } else if ("0" === $(".icons-bottom li").eq(i).attr("title")) {
                        $(".icons-bottom li").eq(i).addClass("invalid");
                    }
                }
            }
        }
    })
}

function getDetail(dom, arr, Lstate) {
    $(dom).click(function (e) {
        e.stopPropagation();
        //window.location.href = "http://test.jihelife.com/html/h5/member/giftcard/cardOrCoupons.html?couponCode=8aa6-3755-eba3-4211";
        if (dom == ".couponQRCode") {
            var domIndex = $(this).parent().parent().index();
        } else {
            var domIndex = $(this).parent().index();
        }
        console.log(domIndex);
        window.location.href = "/html/h5/member/giftcard/cardOrCoupons.html?couponCode=" + arr[domIndex] + "&lstate=" + Lstate;
    })
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

function getList(type, hotelIds) { //获取列表信息
    if ("cards" == type) { //会员卡列表
        var cardIconArr = [];
        $.ajax({ //商户详情接口
            type: "post",
            async: false,
            url: '/coupon/h5/cardList',
            data: {
                data: JSON.stringify({
                    hotelIds: hotelIds,
                    pageno: 1,
                    pagecnt: 50
                })
            },
            success: function (data) {
                console.log(data);
                if ("0" === data.pageinfo.recordAmount) {
                    $(".cards .swiper-wrapper").html('<div class="blank">无可用会员卡</div>');
                    if ($(".icons-bottom").attr("title") == "cards") {
                        $(".icons-bottom").css("visibility", "hidden");
                    }
                } else {
                    $("#cards small").html('(' + data.pageinfo.recordAmount + ')');
                }
                if (undefined != data.data) {
                    $.each(data.data, function (i) {
                        var cardName = data.data[i].couponBaseInfo.couponName, //卡名
                            cardFacePic = data.data[i].couponBaseInfo.cardFacePic, //卡背景
                            effectiveTime = parseInt(data.data[i].effectiveTime), //生效日期
                            expireTime = parseInt(data.data[i].expireTime), //失效日期
                            couponCode = data.data[i].couponCode, //券码
                            usableRemain, //可用额度
                            businessExchange = data.data[i].couponBaseInfo.businessExchange, //是否可换
                            exchangeUrl, //换宿
                            goodspurchaseUrl, //换商品
                            tradable = data.data[i].couponBaseInfo.tradable, //是否可转让：1-是；0-否
                            transferUrl, //转让,
                            faceValue,
                            subCouponList = data.data[i].subCouponList;
                        if (subCouponList) {
                            $.each(subCouponList, function (j) {
                                var couponType = subCouponList[j].couponBaseInfo.couponType;
                                if ("2" === couponType) { //消费金
                                    usableRemain = parseInt(subCouponList[j].remain);
                                    exchangeUrl = subCouponList[j].exchangeUrl;
                                    goodspurchaseUrl = subCouponList[j].goodspurchaseUrl;
                                    transferUrl = subCouponList[j].h5url_trade_out;

                                } else if ("5" === couponType) { //折扣券
                                    faceValue = parseInt(subCouponList[j].faceValue);
                                }
                            });
                        } else {
                            usableRemain = 0;
                            exchangeUrl = data.data[i].exchangeUrl;
                            //goodspurchaseUrl = data.data[i].goodspurchaseUrl;
                        }
                        var card = '<div class="swiper-slide">' +
                            '<div class="card">' +
                            '<h1 class="name">' + cardName + '</h1>' +
                            '<div class="faceValue"><strong>' + faceValue / 10 + '</strong><span>折</span></div>' +
                            '<ul class="desc">' +
                            '<li class="balance">卡内余额：<span>' + usableRemain / 100 + '</span></li>' +
                            '<li class="expiration">有效期：<span>' + getDate(expireTime) + '</span></li>' +

                            '</ul>' +
                            '<img style="visibility:hidden">' +
                            '</div>';
                        $(".cards .swiper-wrapper").append(card); //动态添加
                        if (undefined == faceValue) {
                            $(".card").eq(i).find(".faceValue").hide();
                        }
                        if (undefined != cardFacePic) {
                            $(".card").eq(i).find(".name").hide();
                            $(".card").eq(i).css("background", 'url(' + cardFacePic + ') no-repeat center top/100%');
                        }
                        var iconStatus = {};
                        if ("1" === tradable) { //是否可转让
                            iconStatus.transfer = {
                                "status": 1,
                                "url": transferUrl
                            };
                        } else {
                            iconStatus.transfer = {
                                "status": 0,
                                "url": null
                            };
                        }
                        // if ("1" === exchangePoints) {//是否可兑换积分
                        //     iconStatus.variedIcon = { "status": 1, "url": redeemUrl };
                        // } else {
                        //     iconStatus.variedIcon = { "status": 0, "url": null };
                        // }
                        if ("1" === businessExchange) { //是否可换宿换商品
                            if (exchangeUrl) {
                                iconStatus.hotels = {
                                    "status": 1,
                                    "url": exchangeUrl
                                };
                            } else {
                                iconStatus.hotels = {
                                    "status": 0,
                                    "url": null
                                };
                            }
                            if (goodspurchaseUrl) {
                                iconStatus.goods = {
                                    "status": 1,
                                    "url": goodspurchaseUrl
                                };
                            } else {
                                iconStatus.goods = {
                                    "status": 0,
                                    "url": null
                                };
                            }
                        } else {
                            iconStatus.hotels = {
                                "status": 0,
                                "url": null
                            };
                            iconStatus.goods = {
                                "status": 0,
                                "url": null
                            };
                        }
                        cardIconArr.push(iconStatus);
                        cardCodeArr.push(couponCode);
                    });
                    console.log(cardCodeArr);
                    iconStatusArr.cardIconArr = cardIconArr;
                }
            }
        });
    } else if ("coupons" == type) { //礼券列表
        //couponType:1-房券;couponType:2-消费金;couponType:3-会员卡;couponType:5-折扣券;couponType:7-红包
        var couponIconArr = [];
        $.ajax({ //商户详情接口
            type: "post",
            async: false,
            url: '/coupon/h5/list',
            data: {
                data: JSON.stringify({
                    hotelIds: hotelIds,
                    pageno: 1,
                    pagecnt: 50
                })
            },
            success: function (data) {
                console.log(data);
                if ("0" === data.pageinfo.recordAmount) {
                    $(".coupons .swiper-wrapper").html('<div class="blank">无可用礼券</div>');
                } else {
                    $("#coupons small").html('(' + data.pageinfo.recordAmount + ')');
                }
                if (undefined != data.data) {
                    $.each(data.data, function (i) {
                        var couponName = data.data[i].couponBaseInfo.couponName, //券名
                            couponType = data.data[i].couponBaseInfo.couponType, //卡券类型
                            effectiveTime = parseInt(data.data[i].effectiveTime), //生效日期
                            expireTime = parseInt(data.data[i].expireTime), //失效日期
                            //bookingUrl = data.data[i].bookingUrl,//预订
                            couponCode = data.data[i].couponCode, //券码
                            faceValue = parseInt(data.data[i].faceValue), //面额
                            freeze = data.data[i].freeze, //冻结额度
                            usableRemain = parseInt(data.data[i].remain), //可用额度
                            businessExchange = data.data[i].couponBaseInfo.businessExchange, //是否可换
                            exchangeUrl = data.data[i].exchangeUrl, //换宿
                            goodspurchaseUrl = data.data[i].goodspurchaseUrl, //换商品
                            tradable = data.data[i].couponBaseInfo.tradable, //是否可转让：1-是；0-否
                            transferUrl = data.data[i].h5url_trade_out, //转让,
                            exchangePoints = data.data[i].couponBaseInfo.exchangePoints,
                            exchangePointsDeadline = parseInt(data.data[i].couponBaseInfo.exchangePointsDeadline),
                            ratio = parseInt(data.data[i].couponBaseInfo.exchangePointsRatio);
                        var redeemUrl = "/html/h5/member/giftcard/redeem.html?code=" + couponCode + "&num=" + usableRemain / 100 + "&name=" + couponName + "&ratio=" + ratio + "&PointsDeadline=" + exchangePointsDeadline;;
                        usageStatus = data.data[i].usageStatus; //使用状态
                        var iconStatus = {};
                        if (undefined == freeze) {
                            freeze = 0;
                        } else {
                            parseInt(freeze);
                        }
                        var totalRemain = usableRemain + freeze; //卡内余额
                        var coupon = '<div class="swiper-slide">' +
                            '<div class="coupon">' +
                            '<h1 class="name">' + couponName + '</h1>' +
                            '<ul class="desc">' +
                            '<li class="expiration">有效期：<span>' + getDate(effectiveTime) + '</span> - <span>' + getDate(expireTime) + '</span></li>' +
                            '</ul>' +
                            '<img src="images/maicon.png" class="couponQRCode">' +
                            '</div>' +
                            '</div>';
                        $(".coupons .swiper-wrapper").append(coupon); //动态添加
                        if ("1" === couponType) { //房券
                            var applyNights = '<li>晚数：<span>' + data.data[i].couponBaseInfo.applyNights + '</span>晚</li>';
                            $(".coupon").eq(i).find(".desc").prepend(applyNights);
                        } else if ("2" === couponType) { //消费金
                            var sum = '<li>可用额度：<span>' + usableRemain / 100 + '</span></li>' +
                                '<li>冻结额度：<span>' + freeze / 100 + '</span></li>' +
                                '<li>卡内余额：<span>' + totalRemain / 100 + '</span></li>';
                            $(".coupon").eq(i).find(".desc").prepend(sum);
                        } else if ("5" === couponType) { //折扣券
                            var discount = '<li>折扣：<span>' + faceValue / 10 + '</span>折</li>';
                            $(".coupon").eq(i).find(".desc").prepend(discount);
                        } else if ("7" === couponType) { //红包
                            var redEnvelope = '<li>金额：<span>' + faceValue / 100 + '</span></li>';
                            $(".coupon").eq(i).find(".desc").prepend(redEnvelope);
                        }
                        if ("1" === tradable) { //是否可转让
                            iconStatus.transfer = {
                                "status": 1,
                                "url": transferUrl
                            };
                        } else {
                            iconStatus.transfer = {
                                "status": 0,
                                "url": null
                            };
                        }
                        if ("1" === exchangePoints) { //是否可兑换积分
                            iconStatus.variedIcon = {
                                "status": 1,
                                "url": redeemUrl
                            };
                        } else {
                            iconStatus.variedIcon = {
                                "status": 0,
                                "url": null
                            };
                        }
                        if ("1" === businessExchange) { //是否可换宿换商品
                            if (exchangeUrl) {
                                iconStatus.hotels = {
                                    "status": 1,
                                    "url": exchangeUrl
                                };
                            } else {
                                iconStatus.hotels = {
                                    "status": 0,
                                    "url": null
                                };
                            }
                            if (goodspurchaseUrl) {
                                iconStatus.goods = {
                                    "status": 1,
                                    "url": goodspurchaseUrl
                                };
                            } else {
                                iconStatus.goods = {
                                    "status": 0,
                                    "url": null
                                };
                            }
                        } else {
                            iconStatus.hotels = {
                                "status": 0,
                                "url": null
                            };
                            iconStatus.goods = {
                                "status": 0,
                                "url": null
                            };
                        }
                        couponIconArr.push(iconStatus);
                        couponCodeArr.push(couponCode);
                    });
                    console.log(couponIconArr);
                    console.log(couponCodeArr);

                    iconStatusArr.couponIconArr = couponIconArr;
                }
            }
        });
    }
}

function getDate(time) { //将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}