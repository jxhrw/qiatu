$(function () {
    var leaveFlag = sessionStorage.getItem("leave");//存储离开页面的状态
    if (leaveFlag == 1) {//检测到离开过页面则重新加载页面，并将状态归零
        sessionStorage.setItem("leave", "0");
        window.location.reload();
    }
    var header = $(".header").height();
    //alert(header);
    var clientHeight = window.innerHeight - header;
    var clientWidth = window.innerWidth;
    //alert(clientHeight);
    //alert(clientWidth);
    $(".couponList").css({ "height": clientHeight, "width": clientWidth });
    getAllList({ "pageno": 1, "pagecnt": 50 });//获取全部列表
    getTradableList();//获取可转让列表
    getRecList(1, 4); //获取转让记录列表
    $(".yes").on("click", function () {//确认取消
        console.log($(this).attr("id"));
        var sell = $(this).attr("id").match(/\d/g).join("");
        console.log(sell);
        $.post("/trade/h5/selling/cancel", { data: JSON.stringify({ "sellingid": sell }) }, function (data) {
            console.log(data);
            if (data.sc == 0) {//取消成功
                $(".popCancel").hide();
                $(".popSuccess").show();
                $(".popSuccess p").html("取消成功，冻结的资金或消费金将在2个小时内返还到您的几何会员账户");
                var getCouponId;
                $.post('/trade/h5/selling/record', { data: JSON.stringify({ "pageno": 1, "pagecnt": 10 }) }, function (data) {
                    console.log(data);
                    var index = $("#" + sell).parent(".item").index();
                    $("#" + sell).html(tradeStatus(data.data[0].status));
                    getCouponId = data.data[index].couponId;
                });
                $.post('/pay/h5/coupon/list', { data: JSON.stringify({ "pageno": 1, "pagecnt": 50 }) }, function (res) {
                    //console.log(res);
                    $.each(res.data, function (i) {
                        var oFreeze = parseInt(res.data[i].freeze),
                            oRemainValue = parseInt(res.data[i].remain),
                            remainValue = oRemainValue + freeze(oFreeze);
                        $(".allList .item").eq(i).find(".oRemainValue").html(oRemainValue / 100);
                        $(".allList .item").eq(i).find(".oFreeze").html(freeze(oFreeze) / 100);
                        $(".allList .item").eq(i).find(".remainValue").html(remainValue / 100);
                    })
                });
                $.post('/pay/h5/coupon/list', { data: JSON.stringify({ "pageno": 1, "pagecnt": 50, "tradable": 1 }) }, function (trade) {
                    console.log(trade);
                    $.each(trade.data, function (i) {
                        var tFreeze = freeze(trade.data[i].freeze),
                            tSell = parseInt(trade.data[i].remain),
                            tRemain = tSell + freeze(tFreeze);
                        $(".transList .item").eq(i).find(".tRemain").html(tRemain / 100);
                        $(".transList .item").eq(i).find(".tFreeze").html(freeze(tFreeze) / 100);
                        $(".transList .item").eq(i).find(".tSell").html(tSell / 100);
                    })
                });
            } else if (data.sc == "TRADE-1002") {//无法取消,冻结
                $(".popCancel").hide();
                $(".popSuccess").show();
                $(".popSuccess p").html("有人正在购买你的消费金，暂无法取消交易，请稍后尝试");
            } else {
                $(".popCancel").hide();
                $(".popSuccess").show();
                $(".popSuccess p").html("对不起，此次取消失败，请稍后尝试");
            }
        });

    });
    $(".sucYes").on("click", function () {//关闭用来显示取消状态的弹窗
        $(".popSuccess").hide();
        $(".mask").hide();
    });
    $(".wrong").on("click", function () {//点错了
        $(".popCancel").hide();
        $(".mask").hide();
    });
    $(".mask").on("click", function () {
        $(this).hide();
        $(".popCancel").hide();
        $(".popSuccess").hide();
    });
    var b = 1;
    $(".recList").scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(this)[0].scrollHeight;
        if ($(".load").html() == "已经加载完") {
            return;
        }
        else {
            if (scrollTop + clientHeight + 3 >= scrollHeight) {
                b++;
                getRecList(b, 4);
            }
        }
    });
});
//获取各列表的方法
function getAllList(reqData) {//获取全部礼券列表方法
    $.post('/coupon/h5/list', { data: JSON.stringify(reqData) }, function (data) {
        console.log(data);
        if (data.data.length == 0) {
            $(".allList").html("<div class='hasNone'>您还没有礼券</div>");
            blankPage("hasNone");
        }
        //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包
        for (var i = 0; i < data.data.length; i++) {
            var couponName = data.data[i].couponBaseInfo.couponName,
                effectiveTime = parseInt(data.data[i].couponBaseInfo.effectiveTime),
                expireTime = parseInt(data.data[i].couponBaseInfo.expireTime),
                nowTime = new Date().getTime();
            var item = '<div class="item"> <h1 class="couponName"><span class="cName">' + couponName + '</span><span class="suit fr">适用详情</span></h1><ul class="description"> <li class="effective">有效期：<time><span class="effectiveTime">' + getDate(effectiveTime) + '</span>-<span class="expireTime">' + getDate(expireTime) + '</span></time></li></ul><ul class="couponTrades"><li class="use"><a href="#">订房</a></li> </ul></div>';
            $(".allList").append(item);
        }
        for (var j = 0; j < data.data.length; j++) {
            var couponType = data.data[j].couponBaseInfo.couponType,
                getCouponName = data.data[j].couponBaseInfo.couponName,
                getRatio = data.data[j].couponBaseInfo.exchangePointsRatio,
                couponCode = data.data[j].couponCode,
                currencyType = data.data[j].couponBaseInfo.currencyType,
                couponId = data.data[j].couponId,
                businessExchange = data.data[j].couponBaseInfo.businessExchange,
                bookingUrl = data.data[j].bookingUrl,
                exchangeUrl = data.data[j].exchangeUrl,//换宿
                goodspurchaseUrl = data.data[j].goodspurchaseUrl,//换商品
                tradable = data.data[j].couponBaseInfo.tradable,
                exchangePointsDeadline = parseInt(data.data[j].couponBaseInfo.exchangePointsDeadline),
                exchangePoints = data.data[j].couponBaseInfo.exchangePoints,
                faceValue = parseInt(data.data[j].faceValue),
                oFreeze = parseInt(data.data[j].freeze),
                oRemainValue = parseInt(data.data[j].remain),
                remainValue = oRemainValue + freeze(oFreeze),
                usageStatus = data.data[j].usageStatus;
            if (tradable == 1) {
                $(".allList .item").eq(j).find(".use").before('<li><a class=sell href="#">转让</a></li>');
                $(".allList .item").eq(j).find(".couponTrades").prepend('<li class="more iconfont icon-dot"><ul class="moreBtns"><li><a class="buy" href="#">购买</a></li></ul></li>');
                var sellUrl = "../../market/saleConsumption.html?couponcode=" + couponCode + "&currencyType=" + currencyType,
                    buyUrl = "../../order/buyConsumption.html?couponId=" + couponId;
                $(".allList .item").eq(j).find(".sell").prop("href", sellUrl);
                $(".allList .item").eq(j).find(".buy").prop("href", buyUrl);
                $(".allList .sell").click(function () {
                    sessionStorage.setItem("leave", "1");
                });
                $(".allList .buy").click(function () {
                    sessionStorage.setItem("leave", "1");
                })
            }
            $(".allList .item").eq(j).find(".use a").prop("href", bookingUrl);
            if (businessExchange == 1) {
                $(".allList .item").eq(j).find(".use").before('<li><a href="' + goodspurchaseUrl + '">换商品</a></li><li><a href="' + exchangeUrl + '">换宿</a></li>')
            }
            if (couponType == 1) {//通兑房券、无限浪房券
                var applyNights = data.data[j].couponBaseInfo.applyNights;
                console.log(applyNights + "晚");
                $(".allList .effective").eq(j).after('<li>晚数：&nbsp;&nbsp;<strong>' + applyNights + '晚</strong></li>');
            } else if (couponType == 2) {//消费金
                if (exchangePoints == 1) {
                    $(".allList .item").eq(j).find(".moreBtns").append('<li><a class="redeem" href="#">兑换积分</a></li>');
                    var redeemUrl = "./redeem.html?code=" + couponCode + "&num=" + oRemainValue / 100 + "&name=" + getCouponName + "&ratio=" + getRatio + "&PointsDeadline=" + exchangePointsDeadline;
                    $(".allList .couponTrades").eq(j).find(".redeem").prop("href", redeemUrl);
                }
                $(".allList .effective").eq(j).after('<li>余额：&nbsp;&nbsp;<span class="remainValue">' + remainValue / 100 + '</span></li>');
                $(".allList .effective").eq(j).next().after('<li>冻结额度：&nbsp;&nbsp;<span class="oFreeze">' + freeze(oFreeze) / 100 + '</span></li>');
                $(".allList .effective").eq(j).next().next().after('<li>可用额度：&nbsp;&nbsp;<strong class="oRemainValue">' + oRemainValue / 100 + '</strong></li>');

            } else if (couponType == 5) {
            } else if (couponType == 7) {
                $(".allList .effective").eq(j).after('<li>金额：&nbsp;&nbsp;<strong>' + faceValue / 100 + '</strong></li>');
            }

            if (usageStatus == 5) {//未到使用时间
                $(".allList .couponTrades").eq(j).html("<p class='unavailable'>未到使用时间</p>");
            } else if (usageStatus == 4) {//已过期
                $(".allList .couponTrades").eq(j).html("<p class='unavailable'>已过期</p>");
            }
            else if (usageStatus == 2) {//已使用
                $(".allList .couponTrades").eq(j).html("<p class='unavailable'>已使用</p>");
                $(".allList .couponTrades").eq(j).parent().addClass("expired");
            }
        }
        $(".cName").on("click", function () {
            var index = $(this).index();
            var couponCode = data.data[index].couponCode;
            window.location.href = "./history.html?code=" + couponCode;
        });
        // $(".allList .more").on("click", function (e) {
        //     if (e && e.stopPropagation) {//非IE浏览器
        //         e.stopPropagation();
        //     }
        //     else {//IE浏览器
        //         window.event.cancelBubble = true;
        //     }
        // });
        $(".allList .more").on("click", function () {
            $(".getMore").show();
            $(".getMore ul").html($(this).find(".moreBtns").html());
            $(".mask").show();
        });
        $(".cancelBtn").on("click", function () {
            $(".getMore").hide();
            $(".mask").hide();
        });
        $(".mask").click(function () {
            $(".getMore").hide();
            $(this).hide();
        });
        $(".allList .suit").on("click", function (e) {
            //event.stopPropagation();
            if (e && e.stopPropagation) {//非IE浏览器
                e.stopPropagation();
            }
            else {//IE浏览器
                window.event.cancelBubble = true;
            }
        });
        getDetail();//出现弹窗
        $(".allList .suit").click(function () {//获取详情
            var index = $(this).parents(".item").index();
            var couponId = data.data[index].couponId;
            $.post('/coupon/h5/termDetail', { data: JSON.stringify({ "couponId": couponId }) }, function (data) {
                console.log(data);
                var sCouponName = data.data.couponName,
                    sCouponType = data.data.couponType;
                if (sCouponType == 5 || sCouponType == 7) {
                    $(".couponType span:first-of-type").html('优惠券');
                } else {
                    $(".couponType span:first-of-type").html('礼券');
                }
                $(".suitDesc>h2").html(sCouponName);
                var sProductUsable = data.data.productUsable;
                $.each(sProductUsable, function (i) {
                    $(".productUsable").append('<li class="hotelItem">' + sProductUsable[i].hotelName + '<br/><span class="useDesc"></span></li>');
                    if (sProductUsable[i].productUsableDesc) {
                        $(".hotelItem").eq(i).find(".useDesc").html(sProductUsable[i].productUsableDesc);
                    }
                });

                var sDateUsable = data.data.dateUsable;
                if (sDateUsable) {//使用日期限制
                    $.each(sDateUsable, function (i) {
                        $(".dateUsable").show();
                        $(".dateUsable").append('<li>' + sDateUsable[i] + '</li>');
                    });
                } else {
                    $(".dateUsable").hide();
                }

                var sBookCondition = data.data.bookCondition;
                if (sBookCondition) {//使用限制条件
                    $.each(sBookCondition, function (i) {
                        $(".bookCondition").show();
                        $(".bookCondition").append('<li>' + sBookCondition[i] + '</li>');
                    });
                } else {
                    $(".bookCondition").hide();
                }

                var sRemark = data.data.remark;
                if (sRemark) {//使用的注意条件
                    $(".remark").show();
                    $(".remark").append('<li>' + sRemark + '</li>');
                } else {
                    $(".remark").hide();
                }

                var sAgreementInfo = data.data.agreementInfo;
                if (sAgreementInfo) {
                    $(".remark").after('<ul class="agreementInfo"><a style="color: #336dc1" href="' + sAgreementInfo.h5Url + '">' + sAgreementInfo.name + '</a></ul>');
                }

            });
        });
    });
}
function getTradableList() { //获取可转让列表方法
    $.post('/coupon/h5/list', { data: JSON.stringify({ "pageno": 1, "pagecnt": 50, "tradable": 1 }) }, function (data) {
        console.log(data);
        if (data.data.length == 0) {
            $(".transList").html("<div class='hasNone'>您还没有礼券</div>");
            blankPage("hasNone");
        }
        //couponType:1-房券;couponType:2-消费金;couponType:5-折扣券;couponType:7-红包
        for (var i = 0; i < data.data.length; i++) {
            var couponName = data.data[i].couponBaseInfo.couponName,
                effectiveTime = parseInt(data.data[i].couponBaseInfo.effectiveTime),
                expireTime = parseInt(data.data[i].couponBaseInfo.expireTime),
                //bookingUrl = data.data[i].couponBaseInfo.bookingUrl,
                nowTime = new Date().getTime();
            var item = '<div class="item"> <h1 class="couponName"><span class="cName">' + couponName + '</span><span class="suit fr">适用详情</span></h1><ul class="description"> <li class="effective">有效期：<time><span class="effectiveTime">' + getDate(effectiveTime) + '</span>-<span class="expireTime">' + getDate(expireTime) + '</span></time></li></ul><ul class="couponTrades"><li class="use"><a href="#">订房</a></li> </ul></div>';
            $(".transList").append(item);
        }
        for (var j = 0; j < data.data.length; j++) {
            var couponType = data.data[j].couponBaseInfo.couponType,
                getCouponName = data.data[j].couponBaseInfo.couponName,
                getRatio = data.data[j].couponBaseInfo.exchangePointsRatio,
                couponCode = data.data[j].couponCode,
                currencyType = data.data[j].couponBaseInfo.currencyType,
                couponId = data.data[j].couponId,
                businessExchange = data.data[j].couponBaseInfo.businessExchange,
                bookingUrl = data.data[j].bookingUrl,
                exchangeUrl = data.data[j].exchangeUrl,//换宿
                goodspurchaseUrl = data.data[j].goodspurchaseUrl,//换商品
                tradable = data.data[j].couponBaseInfo.tradable,
                exchangePointsDeadline = parseInt(data.data[j].couponBaseInfo.exchangePointsDeadline),
                exchangePoints = data.data[j].couponBaseInfo.exchangePoints,
                faceValue = parseInt(data.data[j].faceValue),
                oFreeze = parseInt(data.data[j].freeze),
                oRemainValue = parseInt(data.data[j].remain),
                remainValue = oRemainValue + freeze(oFreeze),
                usageStatus = data.data[j].usageStatus;
            if (tradable == 1) {
                $(".transList .item").eq(j).find(".use").before('<li><a class=sell href="#">转让</a></li>');
                $(".transList .item").eq(j).find(".couponTrades").prepend('<li class="more iconfont icon-dot"><ul class="moreBtns"><li><a class="buy" href="#">购买</a></li></ul></li>');
                var sellUrl = "../../market/saleConsumption.html?couponcode=" + couponCode + "&currencyType=" + currencyType,
                    buyUrl = "../../order/buyConsumption.html?couponId=" + couponId;
                $(".transList .item").eq(j).find(".sell").prop("href", sellUrl);
                $(".transList .item").eq(j).find(".buy").prop("href", buyUrl);
                $(".transList .sell").click(function () {
                    sessionStorage.setItem("leave", "1");
                });
                $(".transList .buy").click(function () {
                    sessionStorage.setItem("leave", "1");
                })
            }
            console.log(businessExchange);
            $(".transList .item").eq(j).find(".use a").prop("href", bookingUrl);
            if (businessExchange == 1) {
                $(".transList .item").eq(j).find(".use").before('<li><a href="' + goodspurchaseUrl + '">换商品</a></li><li><a href="' + exchangeUrl + '">换宿</a></li>')
            }
            if (couponType == 1) {//通兑房券、无限浪房券
                var applyNights = data.data[j].couponBaseInfo.applyNights;
                console.log(applyNights + "晚");
                $(".transList .effective").eq(j).after('<li>晚数：&nbsp;&nbsp;<strong>' + applyNights + '晚</strong></li>');
            } else if (couponType == 2) {//消费金
                if (exchangePoints == 1) {
                    $(".transList .item").eq(j).find(".moreBtns").append('<li><a class="redeem" href="#">兑换积分</a></li>');
                    var redeemUrl = "./redeem.html?code=" + couponCode + "&num=" + oRemainValue / 100 + "&name=" + getCouponName + "&ratio=" + getRatio + "&PointsDeadline=" + exchangePointsDeadline;
                    $(".transList .couponTrades").eq(j).find(".redeem").prop("href", redeemUrl);
                }
                $(".transList .effective").eq(j).after('<li>余额：&nbsp;&nbsp;<span class="remainValue">' + remainValue / 100 + '</span></li>');
                $(".transList .effective").eq(j).next().after('<li>冻结额度：&nbsp;&nbsp;<span class="oFreeze">' + freeze(oFreeze) / 100 + '</span></li>');
                $(".transList .effective").eq(j).next().next().after('<li>可用额度：&nbsp;&nbsp;<strong class="oRemainValue">' + oRemainValue / 100 + '</strong></li>');

            } else if (couponType == 5) {

            } else if (couponType == 7) {
                $(".transList .effective").eq(j).after('<li>金额：&nbsp;&nbsp;<strong>' + faceValue / 100 + '</strong></li>');
            }

            if (usageStatus == 5) {//未到使用时间
                $(".transList .couponTrades").eq(j).html("<p class='unavailable'>未到使用时间</p>");
            } else if (usageStatus == 4) {//已过期
                $(".transList .couponTrades").eq(j).html("<p class='unavailable'>已过期</p>");
            }
            else if (usageStatus == 2) {//已使用
                $(".transList .couponTrades").eq(j).html("<p class='unavailable'>已使用</p>");
                $(".transList .couponTrades").eq(j).parent().addClass("expired");
            }
        }
        $(".cName").on("click", function () {
            var index = $(this).index();
            var couponCode = data.data[index].couponCode;
            window.location.href = "./history.html?code=" + couponCode;
        });
        // $(".transList .more").on("click", function (e) {
        //     if (e && e.stopPropagation) {//非IE浏览器
        //         e.stopPropagation();
        //     }
        //     else {//IE浏览器
        //         window.event.cancelBubble = true;
        //     }
        // });
        $(".transList .more").on("click", function () {
            $(".getMore").show();
            $(".getMore ul").html($(this).find(".moreBtns").html());
            $(".mask").show();
        });
        $(".cancelBtn").on("click", function () {
            $(".getMore").hide();
            $(".mask").hide();
        });
        $(".mask").click(function () {
            $(".getMore").hide();
            $(this).hide();
        });
        $(".transList .suit").on("click", function (e) {
            //event.stopPropagation();
            if (e && e.stopPropagation) {//非IE浏览器
                e.stopPropagation();
            }
            else {//IE浏览器
                window.event.cancelBubble = true;
            }
        });
        getDetail();//出现弹窗
        $(".transList .suit").click(function () {//获取详情

            var index = $(this).parents(".item").index();
            var couponId = data.data[index].couponId;
            $.post('/coupon/h5/termDetail', { data: JSON.stringify({ "couponId": couponId }) }, function (data) {
                console.log(data);
                var sCouponName = data.data.couponName,
                    sCouponType = data.data.couponType;
                if (sCouponType == 5 || sCouponType == 7) {
                    $(".couponType span:first-of-type").html('优惠券');
                } else {
                    $(".couponType span:first-of-type").html('礼券');
                }
                $(".suitDesc>h2").html(sCouponName);
                var sProductUsable = data.data.productUsable;
                $.each(sProductUsable, function (i) {
                    $(".productUsable").append('<li class="hotelItem">' + sProductUsable[i].hotelName + '<br/><span class="useDesc"></span></li>');
                    if (sProductUsable[i].productUsableDesc) {
                        $(".hotelItem").eq(i).find(".useDesc").html(sProductUsable[i].productUsableDesc);
                    }
                });

                var sDateUsable = data.data.dateUsable;
                if (sDateUsable) {//使用日期限制
                    $.each(sDateUsable, function (i) {
                        $(".dateUsable").show();
                        $(".dateUsable").append('<li>' + sDateUsable[i] + '</li>');
                    });
                } else {
                    $(".dateUsable").hide();
                }

                var sBookCondition = data.data.bookCondition;
                if (sBookCondition) {//使用限制条件
                    $.each(sBookCondition, function (i) {
                        $(".bookCondition").show();
                        $(".bookCondition").append('<li>' + sBookCondition[i] + '</li>');
                    });
                } else {
                    $(".bookCondition").hide();
                }

                var sRemark = data.data.remark;
                if (sRemark) {//使用的注意条件
                    $(".remark").show();
                    $(".remark").append('<li>' + sRemark + '</li>');
                } else {
                    $(".remark").hide();
                }

                var sAgreementInfo = data.data.agreementInfo;
                if (sAgreementInfo) {
                    $(".remark").after('<ul class="agreementInfo"><a style="color: #336dc1" href="' + sAgreementInfo.h5Url + '">' + sAgreementInfo.name + '</a></ul>');
                }

            });
        });
    });
}
function getRecList(pageno, pagecnt) {//获取转让记录列表的方法
    $.post('/trade/h5/selling/record', { data: JSON.stringify({ "pageno": pageno, "pagecnt": pagecnt }) }, function (data) {
        console.log(data);
        $.each(data.data, function (i) {
            var rCouponName = data.data[i].couponName,
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
            function pointsPrice(priceType) {//出售总价判断
                if (priceType == 0) {//现金
                    return "&yen" + rPrice / 100;
                } else if (priceType == 1) {//积分
                    return rPointsPrice + "积分";
                }
            }
            var record = '<div class="item"> <h1 class="couponName">' + rCouponName + '</h1><ul class="description"> <li>转让额度:<span>' + rSell / 100 + '</span></li><li>转让总价:&nbsp;<span>' + pointsPrice(rPriceType) + '</span></li><li >已成交:&nbsp;&nbsp;<span>' + rSellAmount / 100 + '</span></li><li>成交总价:&nbsp;<span>' + priceType(rPriceType, rSold) + '</span></li><li>交易服务费:<span>' + priceType(rPriceType, rServiceCharge) + '</span></li> <li class="effective">转让截止时间：&nbsp;<time><span class="expireTime">' + expire(rExpireTime) + '</span></time></li></ul><ul id="' + sellingId + '" class="couponTrades"></ul></div>';
            $('.recList>div').append(record);
            $("#" + sellingId).append(tradeStatus(rStatus));
            if (rStatus == 0) {
                $("#" + sellingId + " .waiting").after('<li class="cancel"><a href="javascript:;">取消交易</a></li>');
                $("#" + sellingId + " .cancel").on("click", function () {//点击取消交易
                    $(".popCancel").show();
                    $(".popCancel span").html($(this).parent(".couponTrades").siblings(".couponName").html());
                    $(".mask").show();
                    var id = $(this).parent().attr("id");
                    console.log(id);
                    $(".yes").attr("id", "num" + id);
                });
            }
        });
        if (data.data.length < 4 && data.data.length >= 0) {
            $(".load").html("已经加载完");
        }
        if ($(".recList .item").length == 0) {
            $(".recList").html("<div class='hasNone'>您还没有转让记录</div>");
            blankPage("hasNone");
        }
    });
}

//可调用的方法
function getDate(time) {//将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}
function getDetail() {//适用详情弹窗
    $(".suit").click(function () {
        $(".mask").fadeIn();
        $(".popup").animate({ bottom: "0" });
    });
    $(".know").click(function () {
        $(".mask").fadeOut();
        $(".popup").animate({ bottom: "-22rem" });
        $(".productUsable").html('<li class="proTitle">可用商户及房型</li>');
        $(".dateUsable").html("");
        $(".bookCondition").html("");
        $(".remark").html("");
        $(".agreementInfo").html("");
    });
    $(".close").click(function () {
        $(".mask").fadeOut();
        $(".popup").animate({ bottom: "-22rem" });
        $(".productUsable").html('<li class="proTitle">可用商户及房型</li>');
        $(".dateUsable").html("");
        $(".bookCondition").html("");
        $(".remark").html("");
        $(".agreementInfo").html("");
    });
    $(".mask").click(function () {
        $(this).fadeOut();
        $(".popup").animate({ bottom: "-22rem" });
        $(".productUsable").html('<li class="proTitle">可用商户及房型</li>');
        $(".dateUsable").html("");
        $(".bookCondition").html("");
        $(".remark").html("");
        $(".agreementInfo").html("");
    });
}
function expire(expire) {//出售截止时间的判断
    if (expire) {
        return getDate(expire);
    } else {
        return "<span class='soldOut'>卖完为止</span>";
    }
}
function freeze(freeze) {//冻结额度的判断
    if (freeze) {
        return parseInt(freeze);
    } else {
        return 0;
    }
}
function priceType(priceType, price) {//判断是现金交易还是积分
    if (priceType == 0) {//现金
        return "&yen" + price / 100;
    } else if (priceType == 1) {//积分
        return price + "积分";
    }
}
function tradeStatus(status) {//交易状态的判断
    if (status == 0) {
        return "<p class='waiting'>交易中</p>"
    } else if (status == 4) {
        return "<p class='ok'>已取消</p>"
    } else if (status == 5) {
        return "<p class='ok'>交易完成</p>"
    }
}
function blankPage(hasNone) {
    $("." + hasNone).css({
        "text-align": "center",
        "margin-top": "40%",
        "background": 'url("http://7xio74.com1.z0.glb.clouddn.com/blankPage.png") no-repeat center top/40%',
        "padding-top": "13rem"
    })
}
