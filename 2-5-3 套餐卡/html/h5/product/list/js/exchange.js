$(document).ready(function () {
    var leaveFlag = sessionStorage.getItem("leave"); //存储离开页面的状态
    if (leaveFlag == 1) { //检测到离开过页面则重新加载页面，并将状态归零
        sessionStorage.setItem("leave", "0");
        window.location.reload();
    }

    var reqParams = GetParams();
    var button = reqParams.button; //点击的按钮，0-订房，1-换宿，2-换商品
    var couponCode = reqParams.couponCode; //选择的券code

    if (button == "1") { //换宿
        if (reqParams.assetType == 4) {
            $('title').html('订房列表');
            $(".navBar").after('<p class="notice">无Time卡价格，点击选择入住日期在7-15天后，即可查看<span class="close"></span></p>');
            $(".items").css("margin-top","0");
        } else {
            $('title').html('换宿列表');
            $(".navBar").after('<p class="notice">无交换价格，点击选择入住日期在7-15天后，即可查看<span class="close"></span></p>');
            $(".items").css("margin-top","0");
        }
        $(".navBar").show();
    } else if (button == "2") { //换商品
        $('title').html('换商品列表');
        $(".screen").show();
    } else if (button == "0") { //订房
        $('title').html('订房列表');
        $('.items').css('margin-top', 0);
    } else { //积分兑房
        $('title').html('积分兑房');
        $(".items").css("margin-top", "0");
    };
    $(".close").on("click",function(){
    $(".notice").hide();
    $(".items").css({"margin-top":"4rem"});
 })
    //参数兼容处理
    if (null != reqParams.hotelIds && undefined != reqParams.hotelIds && "" != reqParams.hotelIds) {
        if ("-2" == reqParams.hotelIds) {
            if ("0" == button) { //包含不用处理 
                reqParams.ts = "1";
                reqParams.ots = "1";
            } else if ("1" == button) { //需要修改成排除
                reqParams.ts = "-1";
                reqParams.ots = "1";
                reqParams.sfs = "pointsvalue desc";
            } else if ("2" == button) { //需要修改成排除
                reqParams.ts = "-1";
                reqParams.ots = "-1";
                reqParams.sfs = "pointsvalue desc";
            }
        } else {
            if ("0" == button) { //包含不用处理 
                reqParams.hids = reqParams.hotelIds;
                reqParams.ots = "1";
            } else if ("1" == button) { //需要修改成排除
                reqParams.hids = ("-" + reqParams.hotelIds).replace(/[,]/g, ",-");
                reqParams.ots = "1";
                reqParams.sfs = "pointsvalue desc";
            } else if ("2" == button) { //需要修改成排除
                reqParams.hids = ("-" + reqParams.hotelIds).replace(/[,]/g, ",-");
                reqParams.ots = "-1";
                reqParams.sfs = "pointsvalue desc";
            }
        }
    }

    var dataPost = {
        "pagecnt": "5",
        "pageno": "1"
    };
    dataPost.keyWords = withOrWithout(reqParams.keyWords);
    dataPost.exchFlag = withOrWithout(reqParams.ef);
    dataPost.ltporatio = withOrWithout(reqParams.lto);
    dataPost.checkin = withOrWithout(reqParams.ckn);
    dataPost.assetType = withOrWithout(reqParams.assetType);
    dataPost.priceType = withOrWithout(reqParams.priceType);
    dataPost.couponId = withOrWithout(reqParams.couponId);

    dataPost.tags = withOrWithoutList(reqParams.tags);
    dataPost.productIds = withOrWithoutList(reqParams.ids);
    dataPost.hotelIds = withOrWithoutList(reqParams.hids);
    dataPost.objectTypes = withOrWithoutList(reqParams.ots);
    dataPost.hotelTypes = withOrWithoutList(reqParams.hts);
    dataPost.coopTypes = withOrWithoutList(reqParams.ts);
    dataPost.cities = withOrWithoutList(reqParams.cities);
    dataPost.sortFields = withOrWithoutList(reqParams.sfs);

    console.log(dataPost);

    var c = 1;
    getList(dataPost, 5, 1, button, couponCode);
    $(".form").on("click", function () {
        $(".history").show();
        $(".history ul").html("");
        $(function () {
            var str = localStorage.historyItems2;
            if (str == undefined) {
                $(".history").hide();
            } else {
                var strs = new Array();
                var s = '';
                strs = str.split("|");
                console.log(strs);
                for (var i = 0; i < strs.length; i++) {
                    s = "<li><a>" + strs[i] + "</a></li>";
                    $(".history ul").append(s);
                }
            }
        });
        $(".history ul li").on("click", function () {
            $(".blankPage").remove();
            c = 1;
            $(".items").html("");
            dataPost.keyWord = $(this).find('a').html();
            console.log(dataPost)
            getList(dataPost, 5, 1, button, couponCode);
            $(".history").hide();
            $(".search").val("");
        })

    });
    $(".search").on('search', function () { //监听搜索内容
        var search = $(this).val();
        if (search != "") {
            setHistoryItems(search);
            $(".blankPage").remove();
            c = 1;
            $(".items").html("");
            dataPost.keyWord = search;
            console.log(dataPost)
            getList(dataPost, 5, 1, button, couponCode);
            $(this).val("");
            $(".history").hide().find('ul').html("");
        }
    });

    $(".items").on("touchstart", function () {
        $(".history").hide();
    })
    // $(".search").on("blur", function () {
    //     $(".history ul li").on("click", function () {
    //         $(".blankPage").remove();
    //         c = 1;
    //         $(".items").html("");
    //         dataPost.keyWord = $(this).find('a').html();
    //         console.log(dataPost)
    //         getList(dataPost, 5, 1, button, couponCode);
    //         $(".history").hide();
    //     })
    // });
    $(".navBar span").on("click", function () {
        if (/jihe/i.test(navigator.userAgent)) { //app跳详情页
            var toMbc = "http://www.jihelife.com?data=" + JSON.stringify({
                "act": "toMemberCenter"
            });
            iosBridgeObjc(toMbc);
        } else {
            window.location.href = '/user/h5/mbcenter';
        }
    });
    $(".icon-delete").click(function () {
        clearHistory();
        $(".history").hide();
    });
    $(window).scroll(function () { //滚动加载
        //$(".search").blur();
        //$(".history").hide();
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if ($(".scrollBot").html() == "已经加载完") {
            return;
        } else {
            if (scrollTop + windowHeight == scrollHeight) {
                c++;
                getList(dataPost, 5, c, button, couponCode);
            }
        }
    });

    $(".screen td").click(function () {
        c = 1;
        $(".items").html("");
        $(".up_down").attr("src", "images/up_down.png");
        $(this).addClass("redFont").siblings("td").removeClass("redFont");
        if ($(this).attr("class").indexOf("price") != -1) {
            if ($.inArray("pointsprice asc", dataPost.sortFields) >= 0) {
                dataPost.sortFields = ["pointsprice desc"];
                $(".up_down").attr("src", "/html/market/images/down_ud.png");
            } else {
                dataPost.sortFields = ["pointsprice asc"];
                $(".up_down").attr("src", "/html/market/images/up_ud.png");
            }
        } else {
            $(".up_down").attr("src", "/html/market/images/up_down.png");
            if ($(this).attr("class").indexOf("manual") != -1) {
                dataPost.sortFields = ["manual desc"];
            }
            if ($(this).attr("class").indexOf("sell") != -1) {
                dataPost.sortFields = ["sellamount desc"];
            }
            if ($(this).attr("class").indexOf("update") != -1) {
                dataPost.sortFields = ["updatetime desc"];
            }
        }

        console.log(dataPost)
        getList(dataPost, 5, 1, button, couponCode);
    });
});
//获取搜索列表的方法
function getList(reqData, pagecnt, pageno, button, couponCode) {
    //reqData(a,b);
    if (pagecnt != undefined && pageno != undefined) {
        reqData.pagecnt = pagecnt;
        reqData.pageno = pageno;
    } else {
        reqData.pagecnt = null;
        reqData.pageno = null;
    }
    //console.log(reqData);
    var reqUrl;
    if (/jihe/i.test(navigator.userAgent)) {
        reqUrl = '/search/client/query'
    } else {
        reqUrl = '/search/h5/query'
    }
    $.ajax({
        type: "post",
        url: reqUrl,
        data: {
            data: JSON.stringify(reqData)
        },
        success: function (response) {
            console.log(response);
            if (response.sc == 0) {
                getData = response.data;
                if ($(".items").html() == "" && getData.result.length == 0) {
                    var imgSrc = "http://7xio74.com1.z0.glb.clouddn.com/enchangeList/exchangeList_none.png";
                    if (button == 1) { //换宿
                        var todo = '进行换宿',
                            toWhere = '民宿预订',
                            method = '使用现金支付吧',
                            link = "list1.html";
                    } else if (button == 2) { //换商品
                        var todo = '兑换商品',
                            toWhere = '积分商城',
                            method = '购买吧',
                            link = "integralMall.html?tags=%E7%A7%AF%E5%88%86%E5%95%86%E5%9F%8E";
                    }
                    var empty = '<div class="blankPage">' +
                        '<img src="' + imgSrc + '">' +
                        '<p class="tips">' +
                        '当前资产不足，无法' + todo + '<br/>请通过' +
                        '<span>"' + toWhere + '"</span><span>' + method + '</span>' +
                        '</p>' +
                        '<a href="' + link + '">' + toWhere + '</button>' +
                        '</div>';
                    $("body").append(empty);
                    $(".scrollBot").hide().html("已经加载完");
                } else {
                    $.each(getData.result, function (i) {
                        var h5url,
                            wxDetailLink,
                            productName = getData.result[i].productBaseInfo.productName,
                            imgUrl = getData.result[i].productBaseInfo.imgList[0] + "?imageView2/1/w/312/h/200",
                            showCyType = getData.result[i].productBaseInfo.productPrice.showCyType, //类型
                            showCyCode = getData.result[i].productBaseInfo.productPrice.showCyCode, //符号
                            showCyUnit = getData.result[i].productBaseInfo.productPrice.showCyUnit, //单位
                            showMaxPieces = getData.result[i].productBaseInfo.productPrice.showMaxPieces, //最大张数
                            // priceType = getData.result[i].productBaseInfo.productPrice.priceType, //价格类型
                            totalPrice = getData.result[i].productBaseInfo.productPrice.totalPrice / 100; //价格
                        if (couponCode != undefined) {
                            h5url = getData.result[i].productBaseInfo.h5url + '&couponCode=' + couponCode;
                            wxDetailLink = getData.result[i].productBaseInfo.wxDetailLink + '&couponCode=' + couponCode;
                        } else {
                            h5url = getData.result[i].productBaseInfo.h5url;
                            wxDetailLink = getData.result[i].productBaseInfo.wxDetailLink;
                        }
                        if (showCyType == 0 || showCyType == 5 || showCyType == 6) {
                            showTotalPrice = getData.result[i].productBaseInfo.productPrice.showTotalPrice / 100; //价格
                        } else {
                            showTotalPrice = getData.result[i].productBaseInfo.productPrice.showTotalPrice; //其他
                        }
                        // totalPrice = priceType == 0 ? (totalPrice / 100) : totalPrice;
                        var item;
                        if (showCyType == 0) { //0-现金
                            item = '<div class="item">' +
                                '<img src="' + imgUrl + '">' +
                                '<div class="itemInfo">' +
                                '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                '<p class="bnbDesc ellips"></p>' +
                                '<p class="bnbPrice">' + showCyCode + showTotalPrice + '起</p>' +
                                '</div>' +
                                '</div>'
                        } else if (showCyType == 6) { //6-time卡价
                            item = '<div class="item">' +
                                '<img src="' + imgUrl + '">' +
                                '<div class="itemInfo">' +
                                '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                '<p class="bnbDesc ellips">' + showCyCode + '</p>' +
                                '<p class="bnbPrice">' + showTotalPrice + showCyUnit + '起' + '&nbsp;&nbsp;&nbsp;<del style="color:#b3b3b3;">' + totalPrice + '元起</del>' + '</p>' +
                                '</div>' +
                                '</div>'
                        } else {
                            if (button == 2) {
                                if (showCyType == 4) {
                                    item = '<div class="item">' +
                                        '<img src="' + imgUrl + '">' +
                                        '<div class="itemInfo">' +
                                        '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                        '<p class="bnbDesc ellips">' + showCyCode + '</p>' +
                                        '<p class="bnbPrice">' + showMaxPieces + '件/' + showTotalPrice + showCyUnit + '</p>' +
                                        '</div>' +
                                        '</div>'
                                } else {
                                    item = '<div class="item">' +
                                        '<img src="' + imgUrl + '">' +
                                        '<div class="itemInfo">' +
                                        '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                        '<p class="bnbDesc ellips">' + showCyCode + '</p>' +
                                        '<p class="bnbPrice">' + showTotalPrice + showCyUnit + '</p>' +
                                        '</div>' +
                                        '</div>'
                                }
                            } else {
                                item = '<div class="item">' +
                                    '<img src="' + imgUrl + '">' +
                                    '<div class="itemInfo">' +
                                    '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                    '<p class="bnbDesc ellips">' + showCyCode + '</p>' +
                                    '<p class="bnbPrice">' + showTotalPrice + showCyUnit + '起</p>' +
                                    '</div>' +
                                    '</div>'
                            }
                        }

                        $(".items").append(item);
                        if (/jihe/i.test(navigator.userAgent)) { //app跳详情页
                            $(".item").eq(i + 5 * (pageno - 1)).attr("title", h5url);
                        } else { //h5跳详情页
                            $(".item").eq(i + 5 * (pageno - 1)).attr("title", wxDetailLink);
                        }
                    });
                    console.log(getData.result.length);
                    if (pageno == getData.pageInfo.pageAmount) {
                        $(".scrollBot").html("已经加载完");
                    } else {
                        $(".scrollBot").html("加载更多");
                    }
                    $(".item").on("click", function () {
                        sessionStorage.setItem("leave", "1");
                        window.location.href = $(this).attr("title");
                    })
                }
            } else {
                // if (button == 1) {
                //     $("body").append('<p class="blankPage">当前资产不足，无法进行换宿。请通过<a href="/html/member/weixinMinSu/list.html">“民宿预订”</a>使用现金支付吧</p>')
                // } else if (button == 2) {
                //     $("body").append('<p class="blankPage">当前资产不足，无法兑换商品。请通过<a href="/html/market/integralMall.html?tags=%E7%A7%AF%E5%88%86%E5%95%86%E5%9F%8E">“积分商城”</a>购买吧</p>')
                // }
            }
        }
    });
}

//存值方法,新的值添加在首位
function setHistoryItems(keyword) {
    keyword = keyword.trim();
    var historyItems2 = localStorage.historyItems2;
    if (historyItems2 === undefined) {
        localStorage.historyItems2 = keyword;
    } else {
        historyItems2 = keyword + '|' + historyItems2.split('|').filter(function (e) {
            return e != keyword
        }).join('|');
        localStorage.historyItems2 = historyItems2.split("|").slice(0, 3).join('|'); //限制存储历史的个数，留出足够存储空间
    }
}
//清除值
function clearHistory() {
    localStorage.removeItem('historyItems2');
}
window.onload = function () {
    $(".search").val("");
}

function isEmptyObject(obj) { //判断是否为空对象
    for (var key in obj) {
        return false;
    }
    return true;
}

function withOrWithout($parameter) {
    if ($parameter && 'undefined' != $parameter) {
        return $parameter;
    }
}

function withOrWithoutList($parameter) {
    if ($parameter && 'undefined' != $parameter) {
        return $parameter.split(",");
    }
}
//ios桥接
function iosBridgeObjc(url) {
    var iframe;
    iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
}