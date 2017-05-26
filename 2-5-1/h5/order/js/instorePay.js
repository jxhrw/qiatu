// var jiheXCouponCodeArr = [],
//     jiheXRejectCodeArr = [];
var jiheXNeedInfoArr = [];
var assetsNeedInfo = {};
var cardNeedInfoArr = [];
var cashCouponNeedInfoArr = [];
var roomCouponNeedInfoArr = [];
var discountCouponNeedInfoArr = [];
var redPacketNeedInfoArr = [];
var totaljiheXPayment;
var totalAssetsPayment;
var selectedPayment = [];
var subAmount;
var cashPointsPayments;
$(document).ready(function () {
    $("body").css("min-height", window.innerHeight);
    $(".enterAmount input").on("focus", function () {
        $(this).attr("placeholder", "");
    });
    var hotelName = getRequest().storeName;
    productId = getRequest().productId;
    id = getRequest().member_hotelid;
    $(".hotelName").html(hotelName);
    $.ajax({//请求资产接口
        type: "post",
        url: '/user/h5/info',
        success: function (ifMember) {
            memberFlag = ifMember.data.memberFlag;
            if ("1" == memberFlag) {
                var paymentData = { productId: productId };
                $(".brief .iconfont").click(function (e) {
                    if ($(this).hasClass("icon-selected")) {
                        e.stopPropagation();
                    }
                });
                $(".brief").click(function () {
                    $(this).next().toggle();
                    if ("block" == $(this).next().css("display")) {
                        $(this).parent().siblings().find(".subOptions").css("display", "none");
                        $(this).parent().siblings().find(".desc").removeClass("up");
                        $(this).find(".desc").addClass("up");
                    } else {
                        $(this).find(".desc").removeClass("up");
                    }
                });
                initialInfo(paymentData);
                //console.log(jiheXCouponCodeArr);
                // console.log(jiheXRejectCodeArr);
                console.log(jiheXNeedInfoArr);
                var amount = 0;
                $(".enterAmount input").on('focus', function () {//监听输入框内容的变化
                    setTimeout(function () {
                        $(".enterAmount input").blur();
                    }, 3800);
                })

                //  $(".enterAmount input").bind('input propertychange', function () {//监听输入框内容的变化
                //         var inputNum = $(".enterAmount input").val();
                //         var reg = /^((?!0)\d+(\.\d{1,2})?)$/g;
                //         if (!reg.test(inputNum)) {
                //             errorPrompt("仅支持小数点后两位",2000);
                //         }
                //  })
                $(".enterAmount input").on('blur', function () {//监听输入框内容的变化     
                    if (0 == $(".enterAmount input").val().length) {
                        $(".subOptions").addClass("disabled");
                        $(".exchangeAssets").addClass("disabled");
                        $(".pointsToCash").addClass("disabled");
                        $(".submit span").html("&yen;0");
                    } else {
                        amount = parseInt($(".enterAmount input").val() * 100);
                        $(".subOptions").removeClass("disabled");
                        $(".exchangeAssets").removeClass("disabled");
                        $(".pointsToCash").removeClass("disabled");
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment.length) {
                            // $(".submit span").html("&yen;"+(amount-subAmount)/100);
                            // alert("2");
                            var typeData = { productId: productId, amount: amount, paymentInfoList: totalAssetsPayment };
                            $.ajax({//请求资产接口
                                type: "post",
                                async: false,
                                url: '/pay/h5/payable/booking',
                                data: { data: JSON.stringify(typeData) },
                                success: function (data) {
                                    cardNeedInfoArr = [];
                                    cashCouponNeedInfoArr = [];
                                    roomCouponNeedInfoArr = [];
                                    discountCouponNeedInfoArr = [];
                                    redPacketNeedInfoArr = [];
                                    if (data.data.paymentInfoList) {
                                        totalAssetsPayment = data.data.paymentInfoList;
                                        var amountArr = [];
                                        for (var p = 0; p < totalAssetsPayment.length; p++) {
                                            amountArr.push(parseInt(totalAssetsPayment[p].amount));
                                        }
                                        subAmount = (amount - amountArr.reduce(function (x, y) {
                                            return x + y
                                        }));
                                        //       $(".submit span").html("&yen;" + subAmount / 100);
                                    } else {
                                        subAmount = amount;
                                    }
                                    $(".submit span").html("&yen;" + subAmount / 100);

                                    if (undefined != data.data.membershipCardInfo) {//会员卡展示
                                        $("#memberCards").show();
                                        var cardInfo = data.data.membershipCardInfo.couponDisplayList;
                                        $.each(cardInfo, function (i) {
                                            var rejectCouponCodes = cardInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = cardInfo[i].paymentInfoList,//支付信息
                                                isSelected = cardInfo[i].isSelected,//是否选中
                                                costAmount = cardInfo[i].costAmount,
                                                cardNeedInfo = {};
                                            if (undefined != isSelected) {
                                                cardNeedInfo.isSelected = isSelected;
                                            } else {
                                                cardNeedInfo.isSelected = false;
                                            }
                                            // cardNeedInfo.couponCode = couponCode;
                                            cardNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            cardNeedInfo.paymentInfoList = paymentInfoList;
                                            cardNeedInfo.costAmount = costAmount;
                                            cardNeedInfoArr.push(cardNeedInfo);
                                        });
                                        $.each(cardNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cardNeedInfoArr[i].costAmount) / 100 + '</span></p>';

                                            if (true == cardNeedInfoArr[i].isSelected) {
                                                $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#memberCards .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#memberCards .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.membershipCardInfo.isSelected) {
                                            $("#memberCards .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.membershipCardInfo.selectedCouponValue) {
                                                $("#memberCards .desc").css("color", "#e2574c").html('- &yen; ' + data.data.membershipCardInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#memberCards .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#memberCards .desc").css("color", "#4a4a4a").html(data.data.membershipCardInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.cashCouponInfo) {//消费金展示
                                        var cashCouponInfo = data.data.cashCouponInfo.couponDisplayList;
                                        $.each(cashCouponInfo, function (i) {
                                            var rejectCouponCodes = cashCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = cashCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = cashCouponInfo[i].isSelected,//是否选中
                                                costAmount = cashCouponInfo[i].costAmount,
                                                cashCouponNeedInfo = {};

                                            if (undefined != isSelected) {
                                                cashCouponNeedInfo.isSelected = isSelected;
                                            } else {
                                                cashCouponNeedInfo.isSelected = false;
                                            }
                                            cashCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            cashCouponNeedInfo.paymentInfoList = paymentInfoList;
                                            cashCouponNeedInfo.costAmount = costAmount;
                                            cashCouponNeedInfoArr.push(cashCouponNeedInfo);
                                        });
                                        $.each(cashCouponNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cashCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == cashCouponNeedInfoArr[i].isSelected) {
                                                $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#cashCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#cashCoupons .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.cashCouponInfo.isSelected) {
                                            $("#cashCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.cashCouponInfo.selectedCouponValue) {
                                                $("#cashCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.cashCouponInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#cashCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#cashCoupons .desc").css("color", "#4a4a4a").html(data.data.cashCouponInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.roomCouponInfo) {//房券展示
                                        var roomCouponInfo = data.data.roomCouponInfo.couponDisplayList;
                                        $.each(roomCouponInfo, function (i) {
                                            var rejectCouponCodes = roomCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = roomCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = roomCouponInfo[i].isSelected,//是否选中
                                                costAmount = roomCouponInfo[i].costAmount,
                                                roomCouponNeedInfo = {};

                                            if (undefined != isSelected) {
                                                roomCouponNeedInfo.isSelected = isSelected;
                                            } else {
                                                roomCouponNeedInfo.isSelected = false;
                                            }
                                            roomCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            roomCouponNeedInfo.paymentInfoList = paymentInfoList;
                                            roomCouponNeedInfo.costAmount = costAmount;
                                            roomCouponNeedInfoArr.push(roomCouponNeedInfo);
                                        });
                                        $.each(roomCouponNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(roomCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == roomCouponNeedInfoArr[i].isSelected) {
                                                $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#roomCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#roomCoupons .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.roomCouponInfo.isSelected) {
                                            $("#roomCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.roomCouponInfo.selectedCouponValue) {
                                                $("#roomCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.roomCouponInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#roomCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#roomCoupons .desc").css("color", "#4a4a4a").html(data.data.roomCouponInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.discountCouponInfo) {//折扣券展示
                                        var discountCouponInfo = data.data.discountCouponInfo.couponDisplayList;
                                        $.each(discountCouponInfo, function (i) {
                                            var rejectCouponCodes = discountCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = discountCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = discountCouponInfo[i].isSelected,//是否选中
                                                costAmount = discountCouponInfo[i].costAmount,
                                                discountCouponNeedInfo = {};

                                            if (undefined != isSelected) {
                                                discountCouponNeedInfo.isSelected = isSelected;
                                            } else {
                                                discountCouponNeedInfo.isSelected = false;
                                            }
                                            discountCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            discountCouponNeedInfo.paymentInfoList = paymentInfoList;
                                            discountCouponNeedInfo.costAmount = costAmount;
                                            discountCouponNeedInfoArr.push(discountCouponNeedInfo);
                                        });
                                        $.each(discountCouponNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(discountCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == discountCouponNeedInfoArr[i].isSelected) {
                                                $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#discountCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#discountCoupons .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.discountCouponInfo.isSelected) {
                                            $("#discountCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.discountCouponInfo.selectedCouponValue) {
                                                $("#discountCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.discountCouponInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#discountCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#discountCoupons .desc").css("color", "#4a4a4a").html(data.data.discountCouponInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.redPacketInfo) {//红包展示
                                        var redPacketInfo = data.data.redPacketInfo.couponDisplayList;
                                        $.each(redPacketInfo, function (i) {
                                            var rejectCouponCodes = redPacketInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = redPacketInfo[i].paymentInfoList,//支付信息
                                                isSelected = redPacketInfo[i].isSelected,//是否选中
                                                costAmount = redPacketInfo[i].costAmount,
                                                redPacketNeedInfo = {};

                                            if (undefined != isSelected) {
                                                redPacketNeedInfo.isSelected = isSelected;
                                            } else {
                                                redPacketNeedInfo.isSelected = false;
                                            }
                                            redPacketNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            redPacketNeedInfo.paymentInfoList = paymentInfoList;
                                            redPacketNeedInfo.costAmount = costAmount;
                                            redPacketNeedInfoArr.push(redPacketNeedInfo);
                                        });
                                        $.each(redPacketNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(redPacketNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == redPacketNeedInfoArr[i].isSelected) {
                                                $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#redPackets  .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#redPackets  .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.redPacketInfo.isSelected) {
                                            $("#redPackets .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.redPacketInfo.selectedCouponValue) {
                                                $("#redPackets .desc").css("color", "#e2574c").html('- &yen; ' + data.data.redPacketInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#redPackets .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#redPackets .desc").css("color", "#4a4a4a").html(data.data.redPacketInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.cashPointsInfo) {
                                        $(".pointsToCash").removeClass("hide");
                                        var cashPointsInfo = data.data.cashPointsInfo
                                        $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                                        $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash ? data.data.cashPointsInfo.amountByPointsToCash : 0);
                                        cashPointsPayments = cashPointsInfo.paymentInfoList;
                                        if (cashPointsPayments && $(".pointsSwitch").hasClass("on")) {
                                            subAmount = subAmount - (cashPointsInfo.amountByPointsToCash ? cashPointsInfo.amountByPointsToCash : 0);
                                            $(".submit span").html("&yen;" + subAmount / 100);
                                        }
                                    }
                                    assetsNeedInfo.cardNeedInfoArr = cardNeedInfoArr;
                                    assetsNeedInfo.cashCouponNeedInfoArr = cashCouponNeedInfoArr;
                                    assetsNeedInfo.roomCouponNeedInfoArr = roomCouponNeedInfoArr;
                                    assetsNeedInfo.discountCouponNeedInfoArr = discountCouponNeedInfoArr;
                                    assetsNeedInfo.redPacketNeedInfoArr = redPacketNeedInfoArr;

                                }
                            });
                        } else if (undefined != totaljiheXPayment && 0 != totaljiheXPayment.length) {
                            $.ajax({//请求资产接口
                                type: "post",
                                async: false,
                                url: '/pay/h5/payable/booking',
                                data: { data: JSON.stringify({ productId: productId, amount: amount, paymentInfoList: totaljiheXPayment }) },
                                success: function (data) {
                                    cardNeedInfoArr = [];
                                    cashCouponNeedInfoArr = [];
                                    roomCouponNeedInfoArr = [];
                                    discountCouponNeedInfoArr = [];
                                    redPacketNeedInfoArr = [];
                                    if (data.data.paymentInfoList) {
                                        totaljiheXPayment = data.data.paymentInfoList;
                                        var amountArr = [];
                                        for (var p = 0; p < totaljiheXPayment.length; p++) {
                                            amountArr.push(parseInt(totaljiheXPayment[p].amount));
                                        }
                                        subAmount = (amount - amountArr.reduce(function (x, y) {
                                            return x + y
                                        }));
                                        //       $(".submit span").html("&yen;" + subAmount / 100);
                                    } else {
                                        subAmount = amount;
                                    }
                                    $(".submit span").html("&yen;" + subAmount / 100);

                                    if (undefined != data.data.membershipCardInfo) {//会员卡展示
                                        $("#memberCards").show();
                                        var cardInfo = data.data.membershipCardInfo.couponDisplayList;
                                        $.each(cardInfo, function (i) {
                                            var rejectCouponCodes = cardInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = cardInfo[i].paymentInfoList,//支付信息
                                                isSelected = cardInfo[i].isSelected,//是否选中
                                                costAmount = cardInfo[i].costAmount,
                                                cardNeedInfo = {};
                                            if (undefined != isSelected) {
                                                cardNeedInfo.isSelected = isSelected;
                                            } else {
                                                cardNeedInfo.isSelected = false;
                                            }
                                            // cardNeedInfo.couponCode = couponCode;
                                            cardNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            cardNeedInfo.paymentInfoList = paymentInfoList;
                                            cardNeedInfo.costAmount = costAmount;
                                            cardNeedInfoArr.push(cardNeedInfo);
                                        });
                                        $.each(cardNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cardNeedInfoArr[i].costAmount) / 100 + '</span></p>';

                                            if (true == cardNeedInfoArr[i].isSelected) {
                                                $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#memberCards .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#memberCards .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.membershipCardInfo.isSelected) {
                                            $("#memberCards .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.membershipCardInfo.selectedCouponValue) {
                                                $("#memberCards .desc").css("color", "#e2574c").html('- &yen; ' + data.data.membershipCardInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#memberCards .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#memberCards .desc").css("color", "#4a4a4a").html(data.data.membershipCardInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.cashCouponInfo) {//消费金展示
                                        var cashCouponInfo = data.data.cashCouponInfo.couponDisplayList;
                                        $.each(cashCouponInfo, function (i) {
                                            var rejectCouponCodes = cashCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = cashCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = cashCouponInfo[i].isSelected,//是否选中
                                                costAmount = cashCouponInfo[i].costAmount,
                                                cashCouponNeedInfo = {};

                                            if (undefined != isSelected) {
                                                cashCouponNeedInfo.isSelected = isSelected;
                                            } else {
                                                cashCouponNeedInfo.isSelected = false;
                                            }
                                            cashCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            cashCouponNeedInfo.paymentInfoList = paymentInfoList;
                                            cashCouponNeedInfo.costAmount = costAmount;
                                            cashCouponNeedInfoArr.push(cashCouponNeedInfo);
                                        });
                                        $.each(cashCouponNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cashCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == cashCouponNeedInfoArr[i].isSelected) {
                                                $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#cashCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#cashCoupons .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.cashCouponInfo.isSelected) {
                                            $("#cashCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.cashCouponInfo.selectedCouponValue) {
                                                $("#cashCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.cashCouponInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#cashCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#cashCoupons .desc").css("color", "#4a4a4a").html(data.data.cashCouponInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.roomCouponInfo) {//房券展示
                                        var roomCouponInfo = data.data.roomCouponInfo.couponDisplayList;
                                        $.each(roomCouponInfo, function (i) {
                                            var rejectCouponCodes = roomCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = roomCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = roomCouponInfo[i].isSelected,//是否选中
                                                costAmount = roomCouponInfo[i].costAmount,
                                                roomCouponNeedInfo = {};

                                            if (undefined != isSelected) {
                                                roomCouponNeedInfo.isSelected = isSelected;
                                            } else {
                                                roomCouponNeedInfo.isSelected = false;
                                            }
                                            roomCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            roomCouponNeedInfo.paymentInfoList = paymentInfoList;
                                            roomCouponNeedInfo.costAmount = costAmount;
                                            roomCouponNeedInfoArr.push(roomCouponNeedInfo);
                                        });
                                        $.each(roomCouponNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(roomCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == roomCouponNeedInfoArr[i].isSelected) {
                                                $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#roomCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#roomCoupons .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.roomCouponInfo.isSelected) {
                                            $("#roomCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.roomCouponInfo.selectedCouponValue) {
                                                $("#roomCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.roomCouponInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#roomCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#roomCoupons .desc").css("color", "#4a4a4a").html(data.data.roomCouponInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.discountCouponInfo) {//折扣券展示
                                        var discountCouponInfo = data.data.discountCouponInfo.couponDisplayList;
                                        $.each(discountCouponInfo, function (i) {
                                            var rejectCouponCodes = discountCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = discountCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = discountCouponInfo[i].isSelected,//是否选中
                                                costAmount = discountCouponInfo[i].costAmount,
                                                discountCouponNeedInfo = {};

                                            if (undefined != isSelected) {
                                                discountCouponNeedInfo.isSelected = isSelected;
                                            } else {
                                                discountCouponNeedInfo.isSelected = false;
                                            }
                                            discountCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            discountCouponNeedInfo.paymentInfoList = paymentInfoList;
                                            discountCouponNeedInfo.costAmount = costAmount;
                                            discountCouponNeedInfoArr.push(discountCouponNeedInfo);
                                        });
                                        $.each(discountCouponNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(discountCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == discountCouponNeedInfoArr[i].isSelected) {
                                                $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#discountCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#discountCoupons .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.discountCouponInfo.isSelected) {
                                            $("#discountCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.discountCouponInfo.selectedCouponValue) {
                                                $("#discountCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.discountCouponInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#discountCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#discountCoupons .desc").css("color", "#4a4a4a").html(data.data.discountCouponInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.redPacketInfo) {//红包展示
                                        var redPacketInfo = data.data.redPacketInfo.couponDisplayList;
                                        $.each(redPacketInfo, function (i) {
                                            var rejectCouponCodes = redPacketInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = redPacketInfo[i].paymentInfoList,//支付信息
                                                isSelected = redPacketInfo[i].isSelected,//是否选中
                                                costAmount = redPacketInfo[i].costAmount,
                                                redPacketNeedInfo = {};

                                            if (undefined != isSelected) {
                                                redPacketNeedInfo.isSelected = isSelected;
                                            } else {
                                                redPacketNeedInfo.isSelected = false;
                                            }
                                            redPacketNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            redPacketNeedInfo.paymentInfoList = paymentInfoList;
                                            redPacketNeedInfo.costAmount = costAmount;
                                            redPacketNeedInfoArr.push(redPacketNeedInfo);
                                        });
                                        $.each(redPacketNeedInfoArr, function (i) {
                                            var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(redPacketNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                            if (true == redPacketNeedInfoArr[i].isSelected) {
                                                $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                                $("#redPackets  .subOptions li").eq(i).find(".deduction").html(deduction);
                                            } else {
                                                $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                                $("#redPackets  .subOptions li").eq(i).find(".deduction").html("");
                                            }
                                        })
                                        if (true == data.data.redPacketInfo.isSelected) {
                                            $("#redPackets .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            if (data.data.redPacketInfo.selectedCouponValue) {
                                                $("#redPackets .desc").css("color", "#e2574c").html('- &yen; ' + data.data.redPacketInfo.selectedCouponValue / 100);
                                            }
                                        } else {
                                            $("#redPackets .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $("#redPackets .desc").css("color", "#4a4a4a").html(data.data.redPacketInfo.availableCouponPieces + '张可用');
                                        }
                                    }
                                    if (undefined != data.data.jiheXCouponInfo) {//交换资产展示
                                        jiheXNeedInfoArr = [];
                                        var jiheXCouponInfo = data.data.jiheXCouponInfo.couponDisplayList;
                                        $.each(jiheXCouponInfo, function (i) {
                                            var couponName = jiheXCouponInfo[i].couponBaseInfo.couponName,//券名
                                                couponCode = jiheXCouponInfo[i].couponCode,//券码
                                                rejectCouponCodes = jiheXCouponInfo[i].rejectCouponCodes,//互斥的券
                                                paymentInfoList = jiheXCouponInfo[i].paymentInfoList,//支付信息
                                                isSelected = jiheXCouponInfo[i].isSelected,//是否选中
                                                costAmount = jiheXCouponInfo[i].costAmount,//支付金额
                                                paidFaceValue = jiheXCouponInfo[i].paidFaceValue//抵扣金额
                                            allPayments = data.data.paymentInfoList,
                                                jiheXNeedInfo = {};
                                            if (undefined != isSelected) {
                                                jiheXNeedInfo.isSelected = isSelected;
                                            } else {
                                                jiheXNeedInfo.isSelected = false;
                                            }
                                            jiheXNeedInfo.couponCode = couponCode;
                                            jiheXNeedInfo.costAmount = costAmount;
                                            jiheXNeedInfo.paidFaceValue = paidFaceValue;
                                            jiheXNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                            jiheXNeedInfo.paymentInfoList = paymentInfoList;
                                            // jiheXCouponCodeArr.push(couponCode);
                                            // jiheXRejectCodeArr.push(rejectCouponCodes);
                                            jiheXNeedInfoArr.push(jiheXNeedInfo);
                                        });
                                    }
                                    console.log(jiheXNeedInfoArr);
                                    $.each(jiheXNeedInfoArr, function (i) {
                                        var exchDeduction =
                                            '<p>本次支付&nbsp;<span>&yen;' + parseInt(jiheXNeedInfoArr[i].paidFaceValue) / 100 + '</span>&nbsp;&nbsp;抵扣&nbsp;<span>&yen;&nbsp;' + parseInt(jiheXNeedInfoArr[i].costAmount) / 100 + '</span></p>';

                                        if (true == jiheXNeedInfoArr[i].isSelected) {
                                            $(".exchOptions li").eq(i).find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                            $(".exchOptions li").eq(i).find(".exchDeduction").addClass("inline").html(exchDeduction);
                                            //console.log(jiheXNeedInfoArr[i].paymentInfoList);
                                            //selectedPayment.push(jiheXNeedInfoArr[i].paymentInfoList[0]);
                                        } else {
                                            $(".exchOptions li").eq(i).find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                            $(".exchOptions li").eq(i).find(".exchDeduction").removeClass("inline").html("");
                                        }
                                    })
                                    if (undefined != data.data.cashPointsInfo) {
                                        $(".pointsToCash").removeClass("hide");
                                        var cashPointsInfo = data.data.cashPointsInfo
                                        $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                                        $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash ? data.data.cashPointsInfo.amountByPointsToCash : 0);
                                        cashPointsPayments = cashPointsInfo.paymentInfoList;
                                        if (cashPointsPayments && $(".pointsSwitch").hasClass("on")) {
                                            subAmount = subAmount - (cashPointsInfo.amountByPointsToCash ? cashPointsInfo.amountByPointsToCash : 0);
                                            $(".submit span").html("&yen;" + subAmount / 100);
                                        }
                                    }
                                    assetsNeedInfo.cardNeedInfoArr = cardNeedInfoArr;
                                    assetsNeedInfo.cashCouponNeedInfoArr = cashCouponNeedInfoArr;
                                    assetsNeedInfo.roomCouponNeedInfoArr = roomCouponNeedInfoArr;
                                    assetsNeedInfo.discountCouponNeedInfoArr = discountCouponNeedInfoArr;
                                    assetsNeedInfo.redPacketNeedInfoArr = redPacketNeedInfoArr;

                                }
                            });
                        }
                        else {
                            $.ajax({//请求资产接口
                                type: "post",
                                async: false,
                                url: '/pay/h5/payable/booking',
                                data: { data: JSON.stringify({ productId: productId, amount: amount }) },
                                success: function (data) {
                                    subAmount = amount;
                                    $(".submit span").html("&yen;" + subAmount / 100);
                                    if (undefined != data.data.cashPointsInfo) {
                                        var cashPointsInfo = data.data.cashPointsInfo;
                                        $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                                        $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash ? data.data.cashPointsInfo.amountByPointsToCash : 0);
                                        cashPointsPayments = cashPointsInfo.paymentInfoList;
                                        if (cashPointsPayments && $(".pointsSwitch").hasClass("on")) {
                                            subAmount = subAmount - (cashPointsInfo.amountByPointsToCash ? cashPointsInfo.amountByPointsToCash : 0);
                                            $(".submit span").html("&yen;" + subAmount / 100);
                                        }
                                    }
                                }
                            });
                        }

                    }
                });
                /*--------------资产选择部分----------*/
                $(".subOptions li").click(function () {
                    //alert($(this).index());
                    totaljiheXPayment = [];
                    var thisIndex = $(this).index();
                    //var amount = parseInt($(".enterAmount input").val()) * 100;
                    var chooseType = $(this).parents(".option").attr("id");
                    if ("memberCards" == chooseType) {
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment) {
                            //先排除与所选券互斥的券
                            if (undefined != assetsNeedInfo.cardNeedInfoArr[thisIndex].rejectCouponCodes) {
                                var assetsPaymentInfo = removeArray(totalAssetsPayment, assetsNeedInfo.cardNeedInfoArr[thisIndex].rejectCouponCodes);
                            } else {
                                var assetsPaymentInfo = totalAssetsPayment;
                            }
                            console.log(assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList);
                            if (undefined != assetsPaymentInfo && 0 != assetsPaymentInfo) {
                                for (var s in assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList) {
                                    for (var x in assetsPaymentInfo) {
                                        if (assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList[s].couponCode == assetsPaymentInfo[x].couponCode) {
                                            removeArrayEle(assetsPaymentInfo, assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList);
                                        } else {
                                            assetsPaymentInfo.push(assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList[s]);
                                        }
                                    }
                                }
                            } else {
                                assetsPaymentInfo = assetsPaymentInfo.concat(assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList);
                            }
                            console.log(assetsPaymentInfo);
                        } else {
                            var assetsPaymentInfo = assetsNeedInfo.cardNeedInfoArr[thisIndex].paymentInfoList;
                        }
                    } else if ("cashCoupons" == chooseType) {
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment) {
                            //先排除与所选券互斥的券
                            if (undefined != assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].rejectCouponCodes) {
                                var assetsPaymentInfo = removeArray(totalAssetsPayment, assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].rejectCouponCodes);
                            } else {
                                var assetsPaymentInfo = totalAssetsPayment;
                            }
                            console.log(assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList);
                            if (undefined != assetsPaymentInfo && 0 != assetsPaymentInfo) {
                                for (var s in assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList) {
                                    for (var x in assetsPaymentInfo) {
                                        if (assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList[s].couponCode == assetsPaymentInfo[x].couponCode) {
                                            removeArrayEle(assetsPaymentInfo, assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList);
                                        } else {
                                            assetsPaymentInfo.push(assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList[s]);
                                        }
                                    }
                                }
                            } else {
                                assetsPaymentInfo = assetsPaymentInfo.concat(assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList);
                            }
                            console.log(assetsPaymentInfo);
                        } else {
                            var assetsPaymentInfo = assetsNeedInfo.cashCouponNeedInfoArr[thisIndex].paymentInfoList;
                        }
                    } else if ("roomCoupons" == chooseType) {
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment) {
                            //先排除与所选券互斥的券
                            if (undefined != assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].rejectCouponCodes) {
                                var assetsPaymentInfo = removeArray(totalAssetsPayment, assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].rejectCouponCodes);
                            } else {
                                var assetsPaymentInfo = totalAssetsPayment;
                            }
                            console.log(assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList);
                            if (undefined != assetsPaymentInfo && 0 != assetsPaymentInfo) {
                                for (var s in assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList) {
                                    for (var x in assetsPaymentInfo) {
                                        if (assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList[s].couponCode == assetsPaymentInfo[x].couponCode) {
                                            removeArrayEle(assetsPaymentInfo, assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList);
                                        } else {
                                            assetsPaymentInfo.push(assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList[s]);
                                        }
                                    }
                                }
                            } else {
                                assetsPaymentInfo = assetsPaymentInfo.concat(assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList);
                            }
                            console.log(assetsPaymentInfo);
                        } else {
                            var assetsPaymentInfo = assetsNeedInfo.roomCouponNeedInfoArr[thisIndex].paymentInfoList;
                        }
                    } else if ("discountCoupons" == chooseType) {
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment) {
                            //先排除与所选券互斥的券
                            if (undefined != assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].rejectCouponCodes) {
                                var assetsPaymentInfo = removeArray(totalAssetsPayment, assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].rejectCouponCodes);
                            } else {
                                var assetsPaymentInfo = totalAssetsPayment;
                            }
                            console.log(assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList);
                            if (undefined != assetsPaymentInfo && 0 != assetsPaymentInfo) {
                                for (var s in assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList) {
                                    for (var x in assetsPaymentInfo) {
                                        if (assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList[s].couponCode == assetsPaymentInfo[x].couponCode) {
                                            removeArrayEle(assetsPaymentInfo, assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList);
                                        } else {
                                            assetsPaymentInfo.push(assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList[s]);
                                        }
                                    }
                                }
                            } else {
                                assetsPaymentInfo = assetsPaymentInfo.concat(assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList);
                            }
                            console.log(assetsPaymentInfo);
                        } else {
                            var assetsPaymentInfo = assetsNeedInfo.discountCouponNeedInfoArr[thisIndex].paymentInfoList;
                        }
                    } else if ("redPackets" == chooseType) {
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment) {
                            //先排除与所选券互斥的券
                            if (undefined != assetsNeedInfo.redPacketNeedInfoArr[thisIndex].rejectCouponCodes) {
                                var assetsPaymentInfo = removeArray(totalAssetsPayment, assetsNeedInfo.redPacketNeedInfoArr[thisIndex].rejectCouponCodes);
                            } else {
                                var assetsPaymentInfo = totalAssetsPayment;
                            }
                            console.log(assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList);
                            if (undefined != assetsPaymentInfo && 0 != assetsPaymentInfo) {
                                for (var s in assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList) {
                                    for (var x in assetsPaymentInfo) {
                                        if (assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList[s].couponCode == assetsPaymentInfo[x].couponCode) {
                                            removeArrayEle(assetsPaymentInfo, assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList);
                                        } else {
                                            assetsPaymentInfo.push(assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList[s]);
                                        }
                                    }
                                }
                            } else {
                                assetsPaymentInfo = assetsPaymentInfo.concat(assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList);
                            }
                            console.log(assetsPaymentInfo);
                        } else {
                            var assetsPaymentInfo = assetsNeedInfo.redPacketNeedInfoArr[thisIndex].paymentInfoList;
                        }
                    }
                    var assetsData = { productId: productId, amount: amount, paymentInfoList: assetsPaymentInfo };
                    $.ajax({//请求资产接口
                        type: "post",
                        async: false,
                        url: '/pay/h5/payable/booking',
                        data: { data: JSON.stringify(assetsData) },
                        success: function (data) {
                            cardNeedInfoArr = [];
                            cashCouponNeedInfoArr = [];
                            roomCouponNeedInfoArr = [];
                            discountCouponNeedInfoArr = [];
                            redPacketNeedInfoArr = [];
                            if (data.data.paymentInfoList) {
                                totalAssetsPayment = data.data.paymentInfoList;
                                var amountArr = [];
                                for (var p = 0; p < totalAssetsPayment.length; p++) {
                                    amountArr.push(parseInt(totalAssetsPayment[p].amount));
                                }
                                subAmount = (amount - amountArr.reduce(function (x, y) {
                                    return x + y
                                }));
                                //       $(".submit span").html("&yen;" + subAmount / 100);
                            } else {
                                subAmount = amount;
                            }
                            $(".submit span").html("&yen;" + subAmount / 100);

                            if (undefined != data.data.membershipCardInfo) {//会员卡展示
                                $("#memberCards").show();
                                var cardInfo = data.data.membershipCardInfo.couponDisplayList;
                                $.each(cardInfo, function (i) {
                                    var rejectCouponCodes = cardInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = cardInfo[i].paymentInfoList,//支付信息
                                        isSelected = cardInfo[i].isSelected,//是否选中
                                        costAmount = cardInfo[i].costAmount,
                                        cardNeedInfo = {};
                                    if (undefined != isSelected) {
                                        cardNeedInfo.isSelected = isSelected;
                                    } else {
                                        cardNeedInfo.isSelected = false;
                                    }
                                    // cardNeedInfo.couponCode = couponCode;
                                    cardNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    cardNeedInfo.paymentInfoList = paymentInfoList;
                                    cardNeedInfo.costAmount = costAmount;
                                    cardNeedInfoArr.push(cardNeedInfo);
                                });
                                $.each(cardNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cardNeedInfoArr[i].costAmount) / 100 + '</span></p>';

                                    if (true == cardNeedInfoArr[i].isSelected) {
                                        $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#memberCards .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#memberCards .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.membershipCardInfo.isSelected) {
                                    $("#memberCards .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.membershipCardInfo.selectedCouponValue) {
                                        $("#memberCards .desc").css("color", "#e2574c").html('- &yen; ' + data.data.membershipCardInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#memberCards .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#memberCards .desc").css("color", "#4a4a4a").html(data.data.membershipCardInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.cashCouponInfo) {//消费金展示
                                var cashCouponInfo = data.data.cashCouponInfo.couponDisplayList;
                                $.each(cashCouponInfo, function (i) {
                                    var rejectCouponCodes = cashCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = cashCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = cashCouponInfo[i].isSelected,//是否选中
                                        costAmount = cashCouponInfo[i].costAmount,
                                        cashCouponNeedInfo = {};

                                    if (undefined != isSelected) {
                                        cashCouponNeedInfo.isSelected = isSelected;
                                    } else {
                                        cashCouponNeedInfo.isSelected = false;
                                    }
                                    cashCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    cashCouponNeedInfo.paymentInfoList = paymentInfoList;
                                    cashCouponNeedInfo.costAmount = costAmount;
                                    cashCouponNeedInfoArr.push(cashCouponNeedInfo);
                                });
                                $.each(cashCouponNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cashCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == cashCouponNeedInfoArr[i].isSelected) {
                                        $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#cashCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#cashCoupons .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.cashCouponInfo.isSelected) {
                                    $("#cashCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.cashCouponInfo.selectedCouponValue) {
                                        $("#cashCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.cashCouponInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#cashCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#cashCoupons .desc").css("color", "#4a4a4a").html(data.data.cashCouponInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.roomCouponInfo) {//房券展示
                                var roomCouponInfo = data.data.roomCouponInfo.couponDisplayList;
                                $.each(roomCouponInfo, function (i) {
                                    var rejectCouponCodes = roomCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = roomCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = roomCouponInfo[i].isSelected,//是否选中
                                        costAmount = roomCouponInfo[i].costAmount,
                                        roomCouponNeedInfo = {};

                                    if (undefined != isSelected) {
                                        roomCouponNeedInfo.isSelected = isSelected;
                                    } else {
                                        roomCouponNeedInfo.isSelected = false;
                                    }
                                    roomCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    roomCouponNeedInfo.paymentInfoList = paymentInfoList;
                                    roomCouponNeedInfo.costAmount = costAmount;
                                    roomCouponNeedInfoArr.push(roomCouponNeedInfo);
                                });
                                $.each(roomCouponNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(roomCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == roomCouponNeedInfoArr[i].isSelected) {
                                        $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#roomCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#roomCoupons .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.roomCouponInfo.isSelected) {
                                    $("#roomCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.roomCouponInfo.selectedCouponValue) {
                                        $("#roomCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.roomCouponInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#roomCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#roomCoupons .desc").css("color", "#4a4a4a").html(data.data.roomCouponInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.discountCouponInfo) {//折扣券展示
                                var discountCouponInfo = data.data.discountCouponInfo.couponDisplayList;
                                $.each(discountCouponInfo, function (i) {
                                    var rejectCouponCodes = discountCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = discountCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = discountCouponInfo[i].isSelected,//是否选中
                                        costAmount = discountCouponInfo[i].costAmount,
                                        discountCouponNeedInfo = {};

                                    if (undefined != isSelected) {
                                        discountCouponNeedInfo.isSelected = isSelected;
                                    } else {
                                        discountCouponNeedInfo.isSelected = false;
                                    }
                                    discountCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    discountCouponNeedInfo.paymentInfoList = paymentInfoList;
                                    discountCouponNeedInfo.costAmount = costAmount;
                                    discountCouponNeedInfoArr.push(discountCouponNeedInfo);
                                });
                                $.each(discountCouponNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(discountCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == discountCouponNeedInfoArr[i].isSelected) {
                                        $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#discountCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#discountCoupons .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.discountCouponInfo.isSelected) {
                                    $("#discountCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.discountCouponInfo.selectedCouponValue) {
                                        $("#discountCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.discountCouponInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#discountCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#discountCoupons .desc").css("color", "#4a4a4a").html(data.data.discountCouponInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.redPacketInfo) {//红包展示
                                var redPacketInfo = data.data.redPacketInfo.couponDisplayList;
                                $.each(redPacketInfo, function (i) {
                                    var rejectCouponCodes = redPacketInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = redPacketInfo[i].paymentInfoList,//支付信息
                                        isSelected = redPacketInfo[i].isSelected,//是否选中
                                        costAmount = redPacketInfo[i].costAmount,
                                        redPacketNeedInfo = {};

                                    if (undefined != isSelected) {
                                        redPacketNeedInfo.isSelected = isSelected;
                                    } else {
                                        redPacketNeedInfo.isSelected = false;
                                    }
                                    redPacketNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    redPacketNeedInfo.paymentInfoList = paymentInfoList;
                                    redPacketNeedInfo.costAmount = costAmount;
                                    redPacketNeedInfoArr.push(redPacketNeedInfo);
                                });
                                $.each(redPacketNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(redPacketNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == redPacketNeedInfoArr[i].isSelected) {
                                        $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#redPackets  .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#redPackets  .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.redPacketInfo.isSelected) {
                                    $("#redPackets .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.redPacketInfo.selectedCouponValue) {
                                        $("#redPackets .desc").css("color", "#e2574c").html('- &yen; ' + data.data.redPacketInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#redPackets .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#redPackets .desc").css("color", "#4a4a4a").html(data.data.redPacketInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.jiheXCouponInfo) {
                                if (undefined == data.data.jiheXCouponInfo.selectedCouponValue) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $(".exchOption").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $(".exchOptions li").find(".exchDeduction").removeClass("inline").html("");
                                } else {

                                }
                            }

                            if (undefined != data.data.cashPointsInfo) {
                                $(".pointsToCash").removeClass("hide");
                                var cashPointsInfo = data.data.cashPointsInfo
                                $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                                $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash ? data.data.cashPointsInfo.amountByPointsToCash : 0);
                                cashPointsPayments = cashPointsInfo.paymentInfoList;
                                if (cashPointsPayments && $(".pointsSwitch").hasClass("on")) {
                                    subAmount = subAmount - (cashPointsInfo.amountByPointsToCash ? cashPointsInfo.amountByPointsToCash : 0);
                                    $(".submit span").html("&yen;" + subAmount / 100);
                                }
                            }
                            assetsNeedInfo.cardNeedInfoArr = cardNeedInfoArr;
                            assetsNeedInfo.cashCouponNeedInfoArr = cashCouponNeedInfoArr;
                            assetsNeedInfo.roomCouponNeedInfoArr = roomCouponNeedInfoArr;
                            assetsNeedInfo.discountCouponNeedInfoArr = discountCouponNeedInfoArr;
                            assetsNeedInfo.redPacketNeedInfoArr = redPacketNeedInfoArr;

                        }
                    });
                })
                /*--------------资产取消选择--------------------*/
                $(".brief .iconfont").click(function () {
                    var chooseType = $(this).parents(".option").attr("id");
                    if ($(this).hasClass("icon-selected")) {
                        var briefPaymentInfoList = [];
                        $.each(assetsNeedInfo.cardNeedInfoArr, function (i) {
                            if (true == assetsNeedInfo.cardNeedInfoArr[i].isSelected) {
                                for (var c = 0; c < assetsNeedInfo.cardNeedInfoArr[i].paymentInfoList.length; c++) {
                                    briefPaymentInfoList.push(assetsNeedInfo.cardNeedInfoArr[i].paymentInfoList[c]);
                                }
                            }
                        });
                        $.each(assetsNeedInfo.cashCouponNeedInfoArr, function (i) {
                            if (true == assetsNeedInfo.cashCouponNeedInfoArr[i].isSelected) {
                                briefPaymentInfoList.push(assetsNeedInfo.cashCouponNeedInfoArr[i].paymentInfoList[0]);
                            }
                        });
                        $.each(assetsNeedInfo.roomCouponNeedInfoArr, function (i) {
                            if (true == assetsNeedInfo.roomCouponNeedInfoArr[i].isSelected) {
                                briefPaymentInfoList.push(assetsNeedInfo.roomCouponNeedInfoArr[i].paymentInfoList[0]);
                            }
                        });
                        $.each(assetsNeedInfo.discountCouponNeedInfoArr, function (i) {
                            if (true == assetsNeedInfo.discountCouponNeedInfoArr[i].isSelected) {
                                briefPaymentInfoList.push(assetsNeedInfo.discountCouponNeedInfoArr[i].paymentInfoList[0]);
                            }
                        });
                        $.each(assetsNeedInfo.redPacketNeedInfoArr, function (i) {
                            if (true == assetsNeedInfo.redPacketNeedInfoArr[i].isSelected) {
                                briefPaymentInfoList.push(assetsNeedInfo.redPacketNeedInfoArr[i].paymentInfoList[0]);
                            }
                        });
                        if ("memberCards" == chooseType) {
                            var cardCancel = [];
                            $.each(assetsNeedInfo.cardNeedInfoArr, function (i) {
                                if (true == assetsNeedInfo.cardNeedInfoArr[i].isSelected) {
                                    for (var c = 0; c < assetsNeedInfo.cardNeedInfoArr[i].paymentInfoList.length; c++) {
                                        cardCancel.push(assetsNeedInfo.cardNeedInfoArr[i].paymentInfoList[c]);
                                    }
                                }
                            });
                            briefPaymentInfoList = removeArrayEle(briefPaymentInfoList, cardCancel);
                        } else if ("cashCoupons" == chooseType) {
                            var cashCouponCancel = [];
                            $.each(assetsNeedInfo.cashCouponNeedInfoArr, function (i) {
                                if (true == assetsNeedInfo.cashCouponNeedInfoArr[i].isSelected) {
                                    cashCouponCancel.push(assetsNeedInfo.cashCouponNeedInfoArr[i].paymentInfoList[0]);
                                }
                            });
                            briefPaymentInfoList = removeArrayEle(briefPaymentInfoList, cashCouponCancel);
                        } else if ("roomCoupons" == chooseType) {
                            var roomCouponCancel = [];
                            $.each(assetsNeedInfo.roomCouponNeedInfoArr, function (i) {
                                if (true == assetsNeedInfo.roomCouponNeedInfoArr[i].isSelected) {
                                    roomCouponCancel.push(assetsNeedInfo.roomCouponNeedInfoArr[i].paymentInfoList[0]);
                                }
                            });
                            briefPaymentInfoList = removeArrayEle(briefPaymentInfoList, roomCouponCancel);
                        } else if ("discountCoupons" == chooseType) {
                            var discountCouponCancel = [];
                            $.each(assetsNeedInfo.discountCouponNeedInfoArr, function (i) {
                                if (true == assetsNeedInfo.discountCouponNeedInfoArr[i].isSelected) {
                                    discountCouponCancel.push(assetsNeedInfo.discountCouponNeedInfoArr[i].paymentInfoList[0]);
                                }
                            });
                            briefPaymentInfoList = removeArrayEle(briefPaymentInfoList, discountCouponCancel);
                        } else if ("redPackets" == chooseType) {
                            var redPacketCancel = [];
                            $.each(assetsNeedInfo.redPacketNeedInfoArr, function (i) {
                                if (true == assetsNeedInfo.redPacketNeedInfoArr[i].isSelected) {
                                    redPacketCancel.push(assetsNeedInfo.redPacketNeedInfoArr[i].paymentInfoList[0]);
                                }
                            });
                            briefPaymentInfoList = removeArrayEle(briefPaymentInfoList, redPacketCancel);
                        }
                    }
                    var cancelData = { productId: productId, amount: amount, paymentInfoList: briefPaymentInfoList };
                    $.ajax({//请求资产接口
                        type: "post",
                        async: false,
                        url: '/pay/h5/payable/booking',
                        data: { data: JSON.stringify(cancelData) },
                        success: function (data) {
                            cardNeedInfoArr = [];
                            cashCouponNeedInfoArr = [];
                            roomCouponNeedInfoArr = [];
                            discountCouponNeedInfoArr = [];
                            redPacketNeedInfoArr = [];
                            if (data.data.paymentInfoList) {
                                totalAssetsPayment = data.data.paymentInfoList;
                                var amountArr = [];
                                for (var p = 0; p < totalAssetsPayment.length; p++) {
                                    amountArr.push(parseInt(totalAssetsPayment[p].amount));
                                }
                                subAmount = (amount - amountArr.reduce(function (x, y) {
                                    return x + y
                                }));
                                //       $(".submit span").html("&yen;" + subAmount / 100);
                            } else {
                                subAmount = amount;
                            }
                            $(".submit span").html("&yen;" + subAmount / 100);

                            if (undefined != data.data.membershipCardInfo) {//会员卡展示
                                $("#memberCards").show();
                                var cardInfo = data.data.membershipCardInfo.couponDisplayList;
                                $.each(cardInfo, function (i) {
                                    var rejectCouponCodes = cardInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = cardInfo[i].paymentInfoList,//支付信息
                                        isSelected = cardInfo[i].isSelected,//是否选中
                                        costAmount = cardInfo[i].costAmount,
                                        cardNeedInfo = {};
                                    if (undefined != isSelected) {
                                        cardNeedInfo.isSelected = isSelected;
                                    } else {
                                        cardNeedInfo.isSelected = false;
                                    }
                                    // cardNeedInfo.couponCode = couponCode;
                                    cardNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    cardNeedInfo.paymentInfoList = paymentInfoList;
                                    cardNeedInfo.costAmount = costAmount;
                                    cardNeedInfoArr.push(cardNeedInfo);
                                });
                                $.each(cardNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cardNeedInfoArr[i].costAmount) / 100 + '</span></p>';

                                    if (true == cardNeedInfoArr[i].isSelected) {
                                        $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#memberCards .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#memberCards .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#memberCards .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.membershipCardInfo.isSelected) {
                                    $("#memberCards .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.membershipCardInfo.selectedCouponValue) {
                                        $("#memberCards .desc").css("color", "#e2574c").html('- &yen; ' + data.data.membershipCardInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#memberCards .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#memberCards .desc").css("color", "#4a4a4a").html(data.data.membershipCardInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.cashCouponInfo) {//消费金展示
                                var cashCouponInfo = data.data.cashCouponInfo.couponDisplayList;
                                $.each(cashCouponInfo, function (i) {
                                    var rejectCouponCodes = cashCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = cashCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = cashCouponInfo[i].isSelected,//是否选中
                                        costAmount = cashCouponInfo[i].costAmount,
                                        cashCouponNeedInfo = {};

                                    if (undefined != isSelected) {
                                        cashCouponNeedInfo.isSelected = isSelected;
                                    } else {
                                        cashCouponNeedInfo.isSelected = false;
                                    }
                                    cashCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    cashCouponNeedInfo.paymentInfoList = paymentInfoList;
                                    cashCouponNeedInfo.costAmount = costAmount;
                                    cashCouponNeedInfoArr.push(cashCouponNeedInfo);
                                });
                                $.each(cashCouponNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(cashCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == cashCouponNeedInfoArr[i].isSelected) {
                                        $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#cashCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#cashCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#cashCoupons .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.cashCouponInfo.isSelected) {
                                    $("#cashCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.cashCouponInfo.selectedCouponValue) {
                                        $("#cashCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.cashCouponInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#cashCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#cashCoupons .desc").css("color", "#4a4a4a").html(data.data.cashCouponInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.roomCouponInfo) {//房券展示
                                var roomCouponInfo = data.data.roomCouponInfo.couponDisplayList;
                                $.each(roomCouponInfo, function (i) {
                                    var rejectCouponCodes = roomCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = roomCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = roomCouponInfo[i].isSelected,//是否选中
                                        costAmount = roomCouponInfo[i].costAmount,
                                        roomCouponNeedInfo = {};

                                    if (undefined != isSelected) {
                                        roomCouponNeedInfo.isSelected = isSelected;
                                    } else {
                                        roomCouponNeedInfo.isSelected = false;
                                    }
                                    roomCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    roomCouponNeedInfo.paymentInfoList = paymentInfoList;
                                    roomCouponNeedInfo.costAmount = costAmount;
                                    roomCouponNeedInfoArr.push(roomCouponNeedInfo);
                                });
                                $.each(roomCouponNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(roomCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == roomCouponNeedInfoArr[i].isSelected) {
                                        $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#roomCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#roomCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#roomCoupons .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.roomCouponInfo.isSelected) {
                                    $("#roomCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.roomCouponInfo.selectedCouponValue) {
                                        $("#roomCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.roomCouponInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#roomCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#roomCoupons .desc").css("color", "#4a4a4a").html(data.data.roomCouponInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.discountCouponInfo) {//折扣券展示
                                var discountCouponInfo = data.data.discountCouponInfo.couponDisplayList;
                                $.each(discountCouponInfo, function (i) {
                                    var rejectCouponCodes = discountCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = discountCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = discountCouponInfo[i].isSelected,//是否选中
                                        costAmount = discountCouponInfo[i].costAmount,
                                        discountCouponNeedInfo = {};

                                    if (undefined != isSelected) {
                                        discountCouponNeedInfo.isSelected = isSelected;
                                    } else {
                                        discountCouponNeedInfo.isSelected = false;
                                    }
                                    discountCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    discountCouponNeedInfo.paymentInfoList = paymentInfoList;
                                    discountCouponNeedInfo.costAmount = costAmount;
                                    discountCouponNeedInfoArr.push(discountCouponNeedInfo);
                                });
                                $.each(discountCouponNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(discountCouponNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == discountCouponNeedInfoArr[i].isSelected) {
                                        $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#discountCoupons .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#discountCoupons .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#discountCoupons .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.discountCouponInfo.isSelected) {
                                    $("#discountCoupons .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.discountCouponInfo.selectedCouponValue) {
                                        $("#discountCoupons .desc").css("color", "#e2574c").html('- &yen; ' + data.data.discountCouponInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#discountCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#discountCoupons .desc").css("color", "#4a4a4a").html(data.data.discountCouponInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.redPacketInfo) {//红包展示
                                var redPacketInfo = data.data.redPacketInfo.couponDisplayList;
                                $.each(redPacketInfo, function (i) {
                                    var rejectCouponCodes = redPacketInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = redPacketInfo[i].paymentInfoList,//支付信息
                                        isSelected = redPacketInfo[i].isSelected,//是否选中
                                        costAmount = redPacketInfo[i].costAmount,
                                        redPacketNeedInfo = {};

                                    if (undefined != isSelected) {
                                        redPacketNeedInfo.isSelected = isSelected;
                                    } else {
                                        redPacketNeedInfo.isSelected = false;
                                    }
                                    redPacketNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    redPacketNeedInfo.paymentInfoList = paymentInfoList;
                                    redPacketNeedInfo.costAmount = costAmount;
                                    redPacketNeedInfoArr.push(redPacketNeedInfo);
                                });
                                $.each(redPacketNeedInfoArr, function (i) {
                                    var deduction = '<p>扣减&nbsp;<span>&yen;&nbsp;' + parseInt(redPacketNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                    if (true == redPacketNeedInfoArr[i].isSelected) {
                                        $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subunselect").addClass("icon-subselected");
                                        $("#redPackets  .subOptions li").eq(i).find(".deduction").html(deduction);
                                    } else {
                                        $("#redPackets .subOptions li").eq(i).find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                        $("#redPackets  .subOptions li").eq(i).find(".deduction").html("");
                                    }
                                })
                                if (true == data.data.redPacketInfo.isSelected) {
                                    $("#redPackets .brief").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    if (data.data.redPacketInfo.selectedCouponValue) {
                                        $("#redPackets .desc").css("color", "#e2574c").html('- &yen; ' + data.data.redPacketInfo.selectedCouponValue / 100);
                                    }
                                } else {
                                    $("#redPackets .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#redPackets .desc").css("color", "#4a4a4a").html(data.data.redPacketInfo.availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.jiheXCouponInfo) {
                                if (undefined == data.data.jiheXCouponInfo.selectedCouponValue) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $(".exchOption").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $(".exchOptions li").find(".exchDeduction").removeClass("inline").html("");
                                } else {

                                }
                            }

                            if (undefined != data.data.cashPointsInfo) {
                                $(".pointsToCash").removeClass("hide");
                                var cashPointsInfo = data.data.cashPointsInfo
                                $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                                $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash ? data.data.cashPointsInfo.amountByPointsToCash : 0);
                                cashPointsPayments = cashPointsInfo.paymentInfoList;
                                if (cashPointsPayments && $(".pointsSwitch").hasClass("on")) {
                                    subAmount = subAmount - (cashPointsInfo.amountByPointsToCash ? cashPointsInfo.amountByPointsToCash : 0);
                                    $(".submit span").html("&yen;" + subAmount / 100);
                                }
                            }
                            assetsNeedInfo.cardNeedInfoArr = cardNeedInfoArr;
                            assetsNeedInfo.cashCouponNeedInfoArr = cashCouponNeedInfoArr;
                            assetsNeedInfo.roomCouponNeedInfoArr = roomCouponNeedInfoArr;
                            assetsNeedInfo.discountCouponNeedInfoArr = discountCouponNeedInfoArr;
                            assetsNeedInfo.redPacketNeedInfoArr = redPacketNeedInfoArr;

                        }
                    });
                });
                /*--------------交换资产部分---------*/
                $(".exchOptions li").click(function () {
                    totalAssetsPayment = [];
                    console.log($(this).index());
                    var currentIndex = $(this).index();
                    //var amount = parseInt($(".enterAmount input").val()) * 100;
                    if (undefined != totaljiheXPayment && 0 != totaljiheXPayment.length) {
                        console.log(totaljiheXPayment);
                        console.log(jiheXNeedInfoArr[currentIndex].rejectCouponCodes);
                        //先排除与所选券互斥的券
                        if (undefined != jiheXNeedInfoArr[currentIndex].rejectCouponCodes) {
                            var needPaymentInfo = removeArrayEle(totaljiheXPayment, jiheXNeedInfoArr[currentIndex].rejectCouponCodes);
                        } else {
                            var needPaymentInfo = totaljiheXPayment;
                        }
                        // var selectedPaymentInfo;
                        console.log(jiheXNeedInfoArr[currentIndex].paymentInfoList);
                        var arr3 = [];
                        for (var s in jiheXNeedInfoArr[currentIndex].paymentInfoList) {
                            for (var x in needPaymentInfo) {
                                if (jiheXNeedInfoArr[currentIndex].paymentInfoList[s].couponCode == needPaymentInfo[x].couponCode) {
                                    removeArrayEle(needPaymentInfo, jiheXNeedInfoArr[currentIndex].paymentInfoList);
                                } else {
                                    needPaymentInfo.push(jiheXNeedInfoArr[currentIndex].paymentInfoList[s]);
                                }
                            }
                        }
                        console.log(needPaymentInfo);         //removeArrayEle(needPaymentInfo, jiheXNeedInfoArr[currentIndex].paymentInfoList);
                        //needPaymentInfo.push.apply(needPaymentInfo,jiheXNeedInfoArr[currentIndex].paymentInfoList);
                    } else {
                        var needPaymentInfo = jiheXNeedInfoArr[currentIndex].paymentInfoList;
                    }
                    var selectedData = { productId: productId, amount: amount, paymentInfoList: needPaymentInfo };
                    $.ajax({//请求资产接口
                        type: "post",
                        async: false,
                        url: '/pay/h5/payable/booking',
                        data: { data: JSON.stringify(selectedData) },
                        success: function (data) {
                            jiheXNeedInfoArr = [];
                            if (data.data.paymentInfoList) {
                                totaljiheXPayment = data.data.paymentInfoList;
                                var amountArr = [];
                                for (var p = 0; p < totaljiheXPayment.length; p++) {
                                    amountArr.push(parseInt(totaljiheXPayment[p].amount));
                                }
                                subAmount = (amount - amountArr.reduce(function (x, y) {
                                    return x + y
                                }));
                                //       $(".submit span").html("&yen;" + subAmount / 100);
                            } else {
                                subAmount = amount;
                            }
                            $(".submit span").html("&yen;" + subAmount / 100);
                            if (undefined != data.data.membershipCardInfo) {//会员卡
                                if (undefined == data.data.membershipCardInfo.isSelected) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $("#memberCards .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#memberCards .subOptions li").find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                    $("#memberCards .subOptions li").find(".deduction").html("");
                                    var availableCouponPieces = data.data.membershipCardInfo.availableCouponPieces;
                                    $("#memberCards .desc").css("color", "#4a4a4a").html(availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.cashCouponInfo) {//消费金
                                if (undefined == data.data.cashCouponInfo.isSelected) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $("#cashCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#cashCoupons .subOptions li").find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                    $("#cashCoupons .subOptions li").find(".deduction").html("");
                                    var availableCouponPieces = data.data.cashCouponInfo.availableCouponPieces;
                                    $("#cashCoupons .desc").css("color", "#4a4a4a").html(availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.roomCouponInfo) {//房券
                                if (undefined == data.data.roomCouponInfo.isSelected) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $("#roomCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#roomCoupons .subOptions li").find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                    $("#roomCoupons .subOptions li").find(".deduction").html("");
                                    var availableCouponPieces = data.data.roomCouponInfo.availableCouponPieces;
                                    $("#roomCoupons .desc").css("color", "#4a4a4a").html(availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.discountCouponInfo) {//折扣券
                                if (undefined == data.data.discountCouponInfo.isSelected) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $("#discountCoupons .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#discountCoupons .subOptions li").find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                    $("#discountCoupons .subOptions li").find(".deduction").html("");
                                    var availableCouponPieces = data.data.discountCouponInfo.availableCouponPieces;
                                    $("#discountCoupons .desc").css("color", "#4a4a4a").html(availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.redPacketInfo) {//红包
                                if (undefined == data.data.redPacketInfo.isSelected) {
                                    // $(".exchOption").find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $("#redPackets .brief").find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $("#redPackets .subOptions li").find(".iconfont").removeClass("icon-subselected").addClass("icon-subunselect");
                                    $("#redPackets .subOptions li").find(".deduction").html("");
                                    var availableCouponPieces = data.data.redPacketInfo.availableCouponPieces;
                                    $("#redPackets .desc").css("color", "#4a4a4a").html(availableCouponPieces + '张可用');
                                }
                            }
                            if (undefined != data.data.jiheXCouponInfo) {//交换资产展示
                                var jiheXCouponInfo = data.data.jiheXCouponInfo.couponDisplayList;
                                $.each(jiheXCouponInfo, function (i) {
                                    var couponName = jiheXCouponInfo[i].couponBaseInfo.couponName,//券名
                                        couponCode = jiheXCouponInfo[i].couponCode,//券码
                                        rejectCouponCodes = jiheXCouponInfo[i].rejectCouponCodes,//互斥的券
                                        paymentInfoList = jiheXCouponInfo[i].paymentInfoList,//支付信息
                                        isSelected = jiheXCouponInfo[i].isSelected,//是否选中
                                        costAmount = jiheXCouponInfo[i].costAmount,//支付金额
                                        paidFaceValue = jiheXCouponInfo[i].paidFaceValue//抵扣金额
                                    allPayments = data.data.paymentInfoList,
                                        jiheXNeedInfo = {};
                                    if (undefined != isSelected) {
                                        jiheXNeedInfo.isSelected = isSelected;
                                    } else {
                                        jiheXNeedInfo.isSelected = false;
                                    }
                                    jiheXNeedInfo.couponCode = couponCode;
                                    jiheXNeedInfo.costAmount = costAmount;
                                    jiheXNeedInfo.paidFaceValue = paidFaceValue;
                                    jiheXNeedInfo.rejectCouponCodes = rejectCouponCodes;
                                    jiheXNeedInfo.paymentInfoList = paymentInfoList;
                                    // jiheXCouponCodeArr.push(couponCode);
                                    // jiheXRejectCodeArr.push(rejectCouponCodes);
                                    jiheXNeedInfoArr.push(jiheXNeedInfo);
                                });
                            }
                            console.log(jiheXNeedInfoArr);
                            $.each(jiheXNeedInfoArr, function (i) {
                                if ("1" == jiheXNeedInfoArr[i].paymentInfoList[0].payType) {
                                    var exchDeduction =
                                        '<p>本次支付&nbsp;<span>1张</span>&nbsp;&nbsp;抵扣&nbsp;<span>&yen;&nbsp;' + parseInt(jiheXNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                } else {
                                    var exchDeduction =
                                        '<p>本次支付&nbsp;<span>&yen;' + parseInt(jiheXNeedInfoArr[i].paidFaceValue) / 100 + '</span>&nbsp;&nbsp;抵扣&nbsp;<span>&yen;&nbsp;' + parseInt(jiheXNeedInfoArr[i].costAmount) / 100 + '</span></p>';
                                }
                                if (true == jiheXNeedInfoArr[i].isSelected) {
                                    $(".exchOptions li").eq(i).find(".iconfont").removeClass("icon-unselected").addClass("icon-selected");
                                    $(".exchOptions li").eq(i).find(".exchDeduction").addClass("inline").html(exchDeduction);
                                    //console.log(jiheXNeedInfoArr[i].paymentInfoList);
                                    //selectedPayment.push(jiheXNeedInfoArr[i].paymentInfoList[0]);
                                } else {
                                    $(".exchOptions li").eq(i).find(".iconfont").removeClass("icon-selected").addClass("icon-unselected");
                                    $(".exchOptions li").eq(i).find(".exchDeduction").removeClass("inline").html("");
                                }
                            })
                            if (undefined != data.data.cashPointsInfo) {
                                var cashPointsInfo = data.data.cashPointsInfo
                                $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                                $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash ? data.data.cashPointsInfo.amountByPointsToCash : 0);
                                cashPointsPayments = cashPointsInfo.paymentInfoList;
                                if (cashPointsPayments && $(".pointsSwitch").hasClass("on")) {
                                    subAmount = subAmount - (cashPointsInfo.amountByPointsToCash ? cashPointsInfo.amountByPointsToCash : 0);
                                    $(".submit span").html("&yen;" + subAmount / 100);
                                }
                            }
                        }
                    });
                });
                /*--------------积分抵现部分--------*/
                $(".pointsSwitch").click(function () {
                    if ($(this).hasClass("on")) {
                        $(".submit span").html("&yen;" + (parseInt($(".submit span").html().slice(1) * 100) + (parseInt($(".pointsSwitch").attr("value")))) / 100);
                        $(this).removeClass("on");
                    } else {
                        $(".submit span").html("&yen;" + (parseInt($(".submit span").html().slice(1) * 100) - (parseInt($(".pointsSwitch").attr("value")))) / 100);
                        if (0 != parseInt($(".pointsSwitch").attr("value"))) {
                            $(this).addClass("on");
                        }
                    }
                    // $(".submit span").html("&yen;" + subAmount / 100);
                });
                $(".submit").click(function () {
                    console.log(cashPointsPayments);
                    if ($(".pointsSwitch").hasClass("on")) {
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment.length) {
                            var subPayments = totalAssetsPayment.concat(cashPointsPayments).concat([{ "amount": parseInt($(".submit span").html().slice(1) * 100), "paytype": 0 }]);
                        } else if (undefined != totaljiheXPayment && 0 != totaljiheXPayment.length) {
                            var subPayments = totaljiheXPayment.concat(cashPointsPayments).concat([{ "amount": parseInt($(".submit span").html().slice(1) * 100), "paytype": 0 }]);
                        } else {
                            var subPayments = [{ "amount": parseInt($(".submit span").html().slice(1) * 100), "paytype": 0 }].concat(cashPointsPayments);
                        }
                    } else {
                        var subPayments = [{ "amount": amount, "paytype": 0 }];
                        if (undefined != totalAssetsPayment && 0 != totalAssetsPayment.length) {
                            subPayments = totalAssetsPayment.concat([{ "amount": parseInt($(".submit span").html().slice(1) * 100), "paytype": 0 }]);
                        }
                        if (undefined != totaljiheXPayment && 0 != totaljiheXPayment.length) {
                            subPayments = totaljiheXPayment.concat([{ "amount": parseInt($(".submit span").html().slice(1) * 100), "paytype": 0 }]);
                        }
                    }
                    var submitData = { productId: productId, "amount": amount, "payments": subPayments };
                    $.post('/order/h5/createandsubmit', { data: JSON.stringify(submitData) }, function (orderData) {
                        if (orderData.sc == 0) {
                            window.location.href = "/html/h5/order/payment.html?orderid=" + orderData.data.orderid;
                        } else {
                            var errorMsg = orderData.ErrorMsg;
                            if (errorMsg.indexOf("必须参数") != -1) {
                                errorMsg = "缺少信息";
                            }
                            errorPrompt(chinese(errorMsg), 2000);
                        }
                    });
                })
            } else {
                $(".joinMember").height(window.innerHeight - $(".enterAmount").height() - $(".submit").height() - 72);
                $(".assetsWrap").css("display", "none");
                $(".joinMember").removeClass("hide");
                $.ajax({//请求详情
                    type: "post",
                    async: false,
                    url: '/content/h5/merchant/detail',
                    data: { data: JSON.stringify({ id: id }) },
                    success: function (memberData) {
                        var jiheBusinessMember = memberData.data.jiheBusinessMember;
                        if ("1" == jiheBusinessMember) {
                            $(".joinContent p").eq(0).removeClass("hide");
                        } else if ("2" == jiheBusinessMember) {
                            $(".joinContent p").eq(1).removeClass("hide");
                        }
                        $(".joinContent button").click(
                            function () {
                                window.location.href = "/user/h5/mbcenter?member_hotelid=" + id;
                            }
                        )
                    }
                });
                var amount;
                $(".enterAmount input").on('focus', function () {//监听输入框内容的变化
                    setTimeout(function () {
                        $(".enterAmount input").blur();
                    }, 2000);
                })
                $(".enterAmount input").on('blur', function () {//监听输入框内容的变化
                    amount =  $(".enterAmount input").val();
                    $(".submit span").html("&yen;" + amount);
                })
                $(".submit").click(function () {
                    var submitData = { productId: productId, amount: parseInt(amount* 100) , payments: [{ "amount": parseInt(amount * 100), paytype: 0 }] };
                    $.post('/order/h5/createandsubmit', { data: JSON.stringify(submitData) }, function (orderData) {
                        if (orderData.sc == 0) {
                            window.location.href = "/html/h5/order/payment.html?orderid=" + orderData.data.orderid;
                        } else {
                            var errorMsg = orderData.ErrorMsg;
                            if (errorMsg.indexOf("必须参数") != -1) {
                                errorMsg = "缺少信息";
                            }
                            errorPrompt(chinese(errorMsg), 2000);
                        }
                    });
                })
            }
        }
    });
});
//加载初始资产信息
function initialInfo(paymentData) {
    $.ajax({//请求资产接口
        type: "post",
        async: false,
        url: '/pay/h5/payable/booking',
        data: { data: JSON.stringify(paymentData) },
        success: function (data) {
            if (undefined == data.data.membershipCardInfo
                && undefined == data.data.cashCouponInfo
                && undefined == roomCouponInfo
                && undefined == data.data.discountCouponInfo
                && undefined == data.data.redPacketInfo) {
                $(".assets").hide();
            }
            if (undefined != data.data.membershipCardInfo) {//会员卡展示
                $("#memberCards").show();
                var availableCouponPieces = data.data.membershipCardInfo.availableCouponPieces;
                $("#memberCards .desc").html(availableCouponPieces + '张可用');
                var cardInfo = data.data.membershipCardInfo.couponDisplayList;
                $.each(cardInfo, function (i) {
                    var couponName = cardInfo[i].couponBaseInfo.couponName,//卡名称
                        effectiveTime = parseInt(cardInfo[i].effectiveTime),//生效日期
                        expireTime = parseInt(cardInfo[i].expireTime),//失效日期
                        subCouponList = cardInfo[i].subCouponList,//卡信息
                        discount,//折扣
                        remain,//余额
                        rejectCouponCodes = cardInfo[i].rejectCouponCodes,//互斥的券
                        paymentInfoList = cardInfo[i].paymentInfoList,//支付信息
                        isSelected = cardInfo[i].isSelected,//是否选中
                        cardNeedInfo = {};
                    $.each(subCouponList, function (j) {
                        var couponType = subCouponList[j].couponBaseInfo.couponType;//类型
                        if ("2" === couponType) {//消费金
                            remain = parseInt(subCouponList[j].remain) / 100;
                        } else if ("5" === couponType) {//折扣券
                            discount = parseInt(subCouponList[j].faceValue) / 10;
                        }
                    });
                    var card = '<li>' +
                        '<dl>' +
                        '<dt>' + couponName + '<span>' + discount + '折</span></dt>' +
                        '<dd>有效期：<span>' + getDate(effectiveTime) + '</span>-<span>' + getDate(expireTime) + '</span></dd>' +
                        '<dd>余额：&nbsp;&nbsp;<span>&yen;&nbsp;' + remain + '</span></dd>' +
                        '<span class="iconfont icon-subunselect"></span>' +
                        '</dl>' +
                        '<div class="deduction">' +
                        '</div>' +
                        '</li>';
                    $("#memberCards .subOptions").append(card);
                    if (undefined == discount) {
                        $("#memberCards .subOptions li").eq(i).find("dt span").hide();
                    }
                    if (undefined != isSelected) {
                        cardNeedInfo.isSelected = isSelected;
                    } else {
                        cardNeedInfo.isSelected = false;
                    }
                    // cardNeedInfo.couponCode = couponCode;
                    cardNeedInfo.rejectCouponCodes = rejectCouponCodes;
                    cardNeedInfo.paymentInfoList = paymentInfoList;
                    cardNeedInfoArr.push(cardNeedInfo);
                });
            }
            if (undefined != data.data.cashCouponInfo) {//消费金展示
                $("#cashCoupons").show();
                var availableCouponPieces = data.data.cashCouponInfo.availableCouponPieces;
                $("#cashCoupons .desc").html(availableCouponPieces + '张可用');
                var cashCouponInfo = data.data.cashCouponInfo.couponDisplayList;
                $.each(cashCouponInfo, function (i) {
                    var couponName = cashCouponInfo[i].couponBaseInfo.couponName,//券名
                        remain = parseInt(cashCouponInfo[i].remain) / 100,//余额
                        rejectCouponCodes = cashCouponInfo[i].rejectCouponCodes,//互斥的券
                        paymentInfoList = cashCouponInfo[i].paymentInfoList,//支付信息
                        isSelected = cashCouponInfo[i].isSelected,//是否选中
                        cashCouponNeedInfo = {};

                    var cashCoupon = '<li>' +
                        '<dl>' +
                        '<dt>' + couponName + '</dt>' +
                        '<dd>余额：&nbsp;&nbsp;<span>&yen;&nbsp;' + remain + '</span></dd>' +
                        '<span class="subBtn iconfont icon-subunselect"></span>' +
                        '</dl>' +
                        '<div class="deduction">' +
                        '</div>' +
                        '</li>';
                    $("#cashCoupons .subOptions").append(cashCoupon);
                    if (undefined != isSelected) {
                        cashCouponNeedInfo.isSelected = isSelected;
                    } else {
                        cashCouponNeedInfo.isSelected = false;
                    }
                    cashCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                    cashCouponNeedInfo.paymentInfoList = paymentInfoList;
                    cashCouponNeedInfoArr.push(cashCouponNeedInfo);
                });
            }
            if (undefined != data.data.roomCouponInfo) {//房券展示
                $("#roomCoupons").show();
                var availableCouponPieces = data.data.roomCouponInfo.availableCouponPieces;
                $("#roomCoupons .desc").html(availableCouponPieces + '张可用');
                var roomCouponInfo = data.data.roomCouponInfo.couponDisplayList;
                $.each(roomCouponInfo, function (i) {
                    var couponName = roomCouponInfo[i].couponBaseInfo.couponName,//券名
                        effectiveTime = parseInt(roomCouponInfo[i].effectiveTime),//生效日期
                        expireTime = parseInt(roomCouponInfo[i].expireTime),//失效日期
                        applyNights = roomCouponInfo[i].couponBaseInfo.applyNights,//晚数
                        rejectCouponCodes = roomCouponInfo[i].rejectCouponCodes,//互斥的券
                        paymentInfoList = roomCouponInfo[i].paymentInfoList,//支付信息
                        isSelected = roomCouponInfo[i].isSelected,//是否选中
                        roomCouponNeedInfo = {};

                    var roomCoupon = '<li>' +
                        '<dl>' +
                        '<dt>' + couponName + '</dt>' +
                        '<dd>有效期：<span>' + getDate(effectiveTime) + '</span>-<span>' + getDate(expireTime) + '</span></dd>' +
                        '<dd>晚数：&nbsp;&nbsp;<span>' + applyNights + '&nbsp;晚</span></dd>' +
                        '<span class="subBtn iconfont icon-subunselect"></span>' +
                        '</dl>' +
                        '<div class="deduction">' +
                        '</div>' +
                        '</li>';
                    $("#roomCoupons .subOptions").append(roomCoupon);
                    if (undefined != isSelected) {
                        roomCouponNeedInfo.isSelected = isSelected;
                    } else {
                        roomCouponNeedInfo.isSelected = false;
                    }
                    roomCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                    roomCouponNeedInfo.paymentInfoList = paymentInfoList;
                    roomCouponNeedInfoArr.push(roomCouponNeedInfo);
                });
            }
            if (undefined != data.data.discountCouponInfo) {//折扣券展示
                $("#discountCoupons").show();
                var availableCouponPieces = data.data.discountCouponInfo.availableCouponPieces;
                $("#discountCoupons .desc").html(availableCouponPieces + '张可用');
                var discountCouponInfo = data.data.discountCouponInfo.couponDisplayList;
                $.each(discountCouponInfo, function (i) {
                    var couponName = discountCouponInfo[i].couponBaseInfo.couponName,//券名
                        effectiveTime = parseInt(discountCouponInfo[i].effectiveTime),//生效日期
                        expireTime = parseInt(discountCouponInfo[i].expireTime),//失效日期
                        faceValue = parseInt(discountCouponInfo[i].faceValue) / 10,//晚数
                        rejectCouponCodes = discountCouponInfo[i].rejectCouponCodes,//互斥的券
                        paymentInfoList = discountCouponInfo[i].paymentInfoList,//支付信息
                        isSelected = discountCouponInfo[i].isSelected,//是否选中
                        discountCouponNeedInfo = {};

                    var discountCoupon = '<li>' +
                        '<dl>' +
                        '<dt>' + couponName + '</dt>' +
                        '<dd>有效期：<span>' + getDate(effectiveTime) + '</span>-<span>' + getDate(expireTime) + '</span></dd>' +
                        '<dd>折扣：&nbsp;&nbsp;<span>' + faceValue + '&nbsp;折</span></dd>' +
                        '<span class="subBtn iconfont icon-subunselect"></span>' +
                        '</dl>' +
                        '<div class="deduction">' +
                        '</div>' +
                        '</li>';
                    $("#discountCoupons .subOptions").append(discountCoupon);
                    if (undefined != isSelected) {
                        discountCouponNeedInfo.isSelected = isSelected;
                    } else {
                        discountCouponNeedInfo.isSelected = false;
                    }
                    discountCouponNeedInfo.rejectCouponCodes = rejectCouponCodes;
                    discountCouponNeedInfo.paymentInfoList = paymentInfoList;
                    discountCouponNeedInfoArr.push(discountCouponNeedInfo);
                });
            }
            if (undefined != data.data.redPacketInfo) {//红包展示
                $("#redPackets").show();
                var availableCouponPieces = data.data.redPacketInfo.availableCouponPieces;
                $("#redPackets .desc").html(availableCouponPieces + '张可用');
                var redPacketInfo = data.data.redPacketInfo.couponDisplayList;
                $.each(redPacketInfo, function (i) {
                    var couponName = redPacketInfo[i].couponBaseInfo.couponName,//券名
                        effectiveTime = parseInt(redPacketInfo[i].effectiveTime),//生效日期
                        expireTime = parseInt(redPacketInfo[i].expireTime),//失效日期
                        faceValue = parseInt(redPacketInfo[i].couponBaseInfo.faceValue) / 100,//金额
                        rejectCouponCodes = redPacketInfo[i].rejectCouponCodes,//互斥的券
                        paymentInfoList = redPacketInfo[i].paymentInfoList,//支付信息
                        isSelected = redPacketInfo[i].isSelected,//是否选中
                        redPacketNeedInfo = {};

                    var redPacket = '<li>' +
                        '<dl>' +
                        '<dt>' + couponName + '</dt>' +
                        '<dd>有效期：<span>' + getDate(effectiveTime) + '</span>-<span>' + getDate(expireTime) + '</span></dd>' +
                        '<dd>金额：&nbsp;&nbsp;<span>' + faceValue + '&nbsp;元</span></dd>' +
                        '<span class="subBtn iconfont icon-subunselect"></span>' +
                        '</dl>' +
                        '<div class="deduction">' +
                        '</div>' +
                        '</li>';
                    $("#redPackets .subOptions").append(redPacket);
                    if (undefined != isSelected) {
                        redPacketNeedInfo.isSelected = isSelected;
                    } else {
                        redPacketNeedInfo.isSelected = false;
                    }
                    redPacketNeedInfo.rejectCouponCodes = rejectCouponCodes;
                    redPacketNeedInfo.paymentInfoList = paymentInfoList;
                    redPacketNeedInfoArr.push(redPacketNeedInfo);
                });
            }
            if (undefined != data.data.jiheXCouponInfo) {//交换资产展示
                $(".exchangeAssets").removeClass("hide");
                $(".exchangeAssets .option").show();
                var jiheXCouponInfo = data.data.jiheXCouponInfo.couponDisplayList;
                $.each(jiheXCouponInfo, function (i) {
                    var couponName = jiheXCouponInfo[i].couponBaseInfo.couponName,//券名
                        effectiveTime = parseInt(jiheXCouponInfo[i].effectiveTime),//生效日期
                        expireTime = parseInt(jiheXCouponInfo[i].expireTime);//失效日期
                    remain = parseInt(jiheXCouponInfo[i].remain) / 100,//余额
                        couponType = jiheXCouponInfo[i].couponBaseInfo.couponType,//券类型
                        couponCode = jiheXCouponInfo[i].couponCode,//券码
                        rejectCouponCodes = jiheXCouponInfo[i].rejectCouponCodes,//互斥的券
                        paymentInfoList = jiheXCouponInfo[i].paymentInfoList,//支付信息
                        isSelected = jiheXCouponInfo[i].isSelected,//是否选中
                        jiheXNeedInfo = {};
                    var exchOption = '<li class="exchOption">' +
                        '<span class="iconfont icon-unselected"></span>' +
                        '<dl>' +
                        '<dt class="couponName">' + couponName + '</dt>' +
                        '<dd class="availableTime">有效期：<span>' + getDate(effectiveTime) + '</span>-<span>' + getDate(expireTime) + '</span></dd>' +
                        '</dl>' +
                        '<div class="exchDeduction">' +
                        '</div>' +
                        '</li>';
                    $(".exchOptions").append(exchOption);
                    if ("1" === couponType) {//房券  
                        $(".exchOption").eq(i).find("dl").append('<dd>晚数：' + jiheXCouponInfo[i].couponBaseInfo.applyNights + '</dd>');
                    } else if ("2" === couponType) {//消费金
                        if (undefined == jiheXCouponInfo[i].masterCouponCode) {
                            $(".exchOption").eq(i).find(".availableTime").remove();
                        }
                        $(".exchOption").eq(i).find("dl").append('<dd>余额：&nbsp;&nbsp;<span>&yen;&nbsp;' + remain + '</span></dd>');
                    }
                    if (undefined != isSelected) {
                        jiheXNeedInfo.isSelected = isSelected;
                    } else {
                        jiheXNeedInfo.isSelected = false;
                    }
                    jiheXNeedInfo.couponCode = couponCode;
                    jiheXNeedInfo.rejectCouponCodes = rejectCouponCodes;
                    jiheXNeedInfo.paymentInfoList = paymentInfoList;
                    // jiheXCouponCodeArr.push(couponCode);
                    // jiheXRejectCodeArr.push(rejectCouponCodes);
                    jiheXNeedInfoArr.push(jiheXNeedInfo);
                });
            }
            if (undefined != data.data.cashPointsInfo) {
                $(".pointsToCash").removeClass("hide");
                var cashPointsInfo = data.data.cashPointsInfo
                $(".pointsToCashDesc").html(cashPointsInfo.pointsToCashDesc);
                $(".pointsSwitch").attr("value", data.data.cashPointsInfo.amountByPointsToCash);
            }
            assetsNeedInfo.cardNeedInfoArr = cardNeedInfoArr;
            assetsNeedInfo.cashCouponNeedInfoArr = cashCouponNeedInfoArr;
            assetsNeedInfo.roomCouponNeedInfoArr = roomCouponNeedInfoArr;
            assetsNeedInfo.discountCouponNeedInfoArr = discountCouponNeedInfoArr;
            assetsNeedInfo.redPacketNeedInfoArr = redPacketNeedInfoArr;
            $(".option:visible:last").css("border-color", "transparent");
            $(".exchOption:last").css("border-color", "transparent");
        }
    });
}
window.onload = function () {
    $(".enterAmount input").val("");
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
function getDate(time) {//将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}
function removeArray(a, b) {
    //把数组a中a.couponCode 和数组b相同的a的元素移除
    for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
            if (a[j].couponCode == b[i]) {
                a.splice(j, 1);
                j = j - 1;
            }
        }
    }
    return a;
}
function removeArrayEle(a, b) {
    //把数组a中a.couponCode 和数组b.couponCode相同的a的元素移除
    for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
            if (a[j].couponCode == b[i].couponCode) {
                a.splice(j, 1);
                j = j - 1;
            }
        }
    }
    return a;
}
function errorPrompt(promptMessage, time) {
    $("body").append('<div class="errorPrompt"></div>');
    $(".errorPrompt").html(promptMessage);
    setTimeout(function () {
        $(".errorPrompt").remove();
    }, time);
}
function chinese(str) {
    var ss = str.replace(/[^\u4e00-\u9fa5]/gi, "");
    return ss;
}