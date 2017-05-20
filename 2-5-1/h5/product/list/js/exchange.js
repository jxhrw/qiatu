var couponCode = getRequest().couponCode,//拿到券code
    button = getRequest().button;//拿到列表类型的信息，0-订房，1-换宿，2-换商品
$(document).ready(function () {
    var leaveFlag=sessionStorage.getItem("leave");//存储离开页面的状态
    if(leaveFlag==1){//检测到离开过页面则重新加载页面，并将状态归零
        sessionStorage.setItem("leave","0");
        window.location.reload();
    }
    var assetType = getRequest().assetType,//拿到assetType的类型，0-所有资产，1-免房券，2-消费金，3-积分
        couponId = getRequest().couponId,//拿到券id
        hotelIds = getRequest().hotelIds,//拿到券对应的商户id，可以是一个或多个，将字符串转为数组的形式
        pagecnt,//声明一页包含的商品个数
        pageno;//声明页码数
    var c = 1;
    console.log(hotelIds);
    var reqData;
    if (button == "1") {//换宿
        $('title').html('换宿列表');
        $(".navBar").show();
        if (hotelIds == -2) {
            reqData = {
                "assetType": assetType,
                "couponId": couponId,
                "scopes": [
                    { "hotelTypes": [1], "include": 1 },
                    { "include": 1, "objectType": [1] },
                    { "tags": ["几何商户"], "include": 0 },
                    { "exchFlag": 1, "include": 1 }
                ],
                "sorts": [{ "field": "pointsvalue", "rule": "DESC" }],//‘desc’降序排列
                "pagecnt": 5,
                "pageno": 1
            }
        }else{
            reqData = {
                "assetType": assetType,
                "couponId": couponId,
                "scopes": [
                    { "hotelTypes": [1], "include": 1 },
                    { "include": 1, "objectType": [1] },
                    { "hotelIds": hotelIds.split(','), "include": 0 },
                    { "exchFlag": 1, "include": 1 }
                ],
                "sorts": [{ "field": "pointsvalue", "rule": "DESC" }],//‘desc’降序排列
                "pagecnt": 5,
                "pageno": 1
            }
        }
        console.log(reqData)
        getList(reqData, 5, 1);
        $(".search").on("click",function () {
            $(".history").show(); 
            $(".history ul").html(""); 
            $(function(){
                var str=localStorage.historyItems2;
                if(str==undefined){
                    $(".history").hide();
                }else{
                    var strs= new Array();
                    var s='';
                    strs=str.split("|");
                    console.log(strs);
                    for(var i=0;i<strs.length;i++){
                        s= "<li><a>"+strs[i]+"</a></li>";
                        $(".history ul").append(s);
                    }
                }
            });
        })
        $(".search").on("blur",function () {
            $(".history ul li").click(function () {  
                    $(".blankPage").remove();
                    c=1;
                    $(".items").html("");
                    reqData.keyWord=$(this).find('a').html();
                    console.log(reqData)
                    getList(reqData, 5, 1);
                    $(".history").hide(); 
            })
        })
        $(".search").on('search',function () {//监听搜索内容
            $(this).blur();
            $(".history").hide().find('ul').html("");
            var search=$(this).val();
            if(search!=""){
                setHistoryItems(search);
                $(".blankPage").remove();
                c=1;
                $(".items").html("");
                reqData.keyWord=search;
                console.log(reqData)
                getList(reqData, 5, 1);
            }
        });
        $(".navBar span").on("click", function () {
            window.location.href='/user/h5/qrcode';
        });
        $(".icon-delete").click(function () {
            clearHistory();
            $(".history").hide();
        });
    } else if (button == "2") {//换商品
        $('title').html('换商品列表');
        $(".screen").show();
        var sortKind=[];
        var manualSort={"field":"manual", "rule":"DESC"},
            sellAmountSort={"field":"sellamount", "rule":"DESC"},
            updateTimeSort={"field":"updatetime", "rule":"DESC"},
            priceSort={"field":"pointsprice", "rule":"DESC"};
                        reqData = {
            "assetType": assetType,
            "couponId": couponId,
            "scopes": [
                { "include": 1, "objectType": [30, 40] },
                { "include": 0, "priceType": 0 },
                { "exchFlag": 1, "include": 1 }
            ],
            "sorts": [{"field":"manual", "rule":"DESC"}],//‘desc’降序排列
            "pagecnt": 5,
            "pageno": 1
            }
            console.log(reqData)
            getList(reqData, 5, 1);
        $(".screen td").click(function(){
                c=1;
                $(".items").html("");
                sortKind=[];
                reqData.sorts=sortKind;
               // pageNum_this=1;
                $(".up_down").attr("src","images/up_down.png");
                $(this).addClass("redFont").siblings("td").removeClass("redFont");
                if($(this).attr("class").indexOf("price")!=-1){
                    if("ASC"==priceSort.rule){
                        priceSort.rule="DESC";
                        $(".up_down").attr("src","images/down_ud.png");
                    }else {
                        priceSort.rule="ASC";
                        $(".up_down").attr("src","images/up_ud.png");
                    }
                    sortKind.push(priceSort);
                }else {
                    priceSort.rule="DESC";
                    $(".up_down").attr("src","images/up_down.png");
                    if($(this).attr("class").indexOf("manual")!=-1){
                        sortKind.push(manualSort);
                    }
                    if($(this).attr("class").indexOf("sell")!=-1){
                        sortKind.push(sellAmountSort);
                    }
                    if($(this).attr("class").indexOf("update")!=-1){
                        sortKind.push(updateTimeSort);
                    }
                }
            console.log(reqData)
            getList(reqData, 5, 1);
        });
    } else if (button == "0") {//订房
        $('title').html('订房列表');
        $('.items').css('margin-top',0);
        if (hotelIds == -1) {
            console.log(hotelIds);
            reqData = {
                "scopes": [
                    { "hotelTypes": [1], "include": 1 },
                    { "include": 1, "objectType": [1] },
                ],
                "pagecnt": 5,
                "pageno": 1
            }
        } else if (hotelIds == -2) {
            reqData = {
                "scopes": [
                    { "hotelTypes": [1], "include": 1 },
                    { "include": 1, "objectType": [1] },
                    { "tags": ["几何商户"], "include": 1 }
                ],
                "pagecnt": 5,
                "pageno": 1
            }
        } else {
            reqData = {
                "scopes": [
                    { "hotelTypes": [1], "include": 1 },
                    { "include": 1, "objectType": [1] },
                    { "hotelIds": hotelIds.split(','), "include": 1 }
                ],
                "pagecnt": 5,
                "pageno": 1
            }
        }
        console.log(reqData)
        getList(reqData, 5, 1);
    } else {//积分兑房
        $('title').html('积分兑房');
        reqData = {
            "assetType": assetType,
            "scopes": [
                { "hotelTypes": [1], "include": 1 },
                { "include": 1, "priceType": 1 },
                { "include": 1, "objectType": [1] },
                { "tags": ["几何商户"], "include": 1 }
            ],
            "pagecnt": 5,
            "pageno": 1
        }
        console.log(reqData)
        getList(reqData, 5, 1);
    }
    $(window).scroll(function () {//滚动加载
        $(".search").blur();
        $(".history").hide();
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if ($(".scrollBot").html() == "已经加载完") {
            return;
        } else {
            if (scrollTop + windowHeight == scrollHeight) {
                c++;
                getList(reqData, 5, c);
            }
        }
    });
    $("#navSearch").click(function () {//跳转至找民宿页面对相关订房/换宿/换商品进行搜索
        window.location.href = '/h5/findMinsu.html?button=' + button;
    })
});
//获取搜索列表的方法
function getList(reqData, pagecnt, pageno) {
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
        data: { data: JSON.stringify(reqData) },
        success: function (response) {
            console.log(response);
            if (response.sc == 0) {
                getData = response.data;
                if ($(".items").html() == ""&&getData.length == 0) {
                    var imgSrc = "http://7xio74.com1.z0.glb.clouddn.com/enchangeList/exchangeList_none.png";
                    if (button == 1) {//换宿
                        var todo = '进行换宿',
                            toWhere = '民宿预订',
                            method = '使用现金支付吧',
                            link = "/html/member/weixinMinSu/list.html";
                    } else if (button == 2) {//换商品
                        var todo = '兑换商品',
                            toWhere = '积分商城',
                            method = '购买吧',
                            link = "/html/market/integralMall.html?tags=%E7%A7%AF%E5%88%86%E5%95%86%E5%9F%8E";
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
                            showCyType = getData.result[i].productBaseInfo.productPrice.showCyType,//类型
                            showCyCode = getData.result[i].productBaseInfo.productPrice.showCyCode,//符号
                            showCyUnit = getData.result[i].productBaseInfo.productPrice.showCyUnit;//单位
                        if (couponCode != undefined) {
                            h5url = getData.result[i].productBaseInfo.h5url + '&couponCode=' + couponCode;
                            wxDetailLink = getData.result[i].productBaseInfo.wxDetailLink + '&couponCode=' + couponCode;
                        } else {
                            h5url = getData.result[i].productBaseInfo.h5url;
                            wxDetailLink = getData.result[i].productBaseInfo.wxDetailLink;
                        }
                        if (showCyType == 0 || showCyType == 5) {
                            showTotalPrice = getData.result[i].productBaseInfo.productPrice.showTotalPrice / 100;//价格
                        } else {
                            showTotalPrice = getData.result[i].productBaseInfo.productPrice.showTotalPrice;//其他
                        }
                        var item;
                        if (showCyType == 0) {//0-现金
                            item = '<div class="item">' +
                                '<img src="' + imgUrl + '">' +
                                '<div class="itemInfo">' +
                                '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                '<p class="bnbDesc ellips"></p>' +
                                '<p class="bnbPrice">' + showCyCode + showTotalPrice + '起</p>' +
                                '</div>' +
                                '</div>'
                        } else {
                            if (button == 2) {
                                item = '<div class="item">' +
                                    '<img src="' + imgUrl + '">' +
                                    '<div class="itemInfo">' +
                                    '<h4 class="bnbName ellips">' + productName + '</h4>' +
                                    '<p class="bnbDesc ellips">' + showCyCode + '</p>' +
                                    '<p class="bnbPrice">' + showTotalPrice + showCyUnit + '</p>' +
                                    '</div>' +
                                    '</div>'
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
                        if (/jihe/i.test(navigator.userAgent)) {//app跳详情页
                            $(".item").eq(i + 5 * (pageno - 1)).attr("title", h5url);
                        } else {//h5跳详情页
                            $(".item").eq(i + 5 * (pageno - 1)).attr("title", h5url.replace(/h5\/bnbDetail/, "html/h5/product/detail/bnbShare"));
                        }
                    });
                    console.log(getData.result.length);
                    if (pageno == getData.pageInfo.pageAmount) {
                        $(".scrollBot").html("已经加载完");
                    } else {
                        $(".scrollBot").html("加载更多");
                    }
                    $(".item").on("click", function () {
                        sessionStorage.setItem("leave","1");
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
//存值方法,新的值添加在首位
function setHistoryItems(keyword) {
    keyword = keyword.trim();
    var  historyItems2  = localStorage.historyItems2;
    if (historyItems2 === undefined) {
        localStorage.historyItems2 = keyword;
    } else {
        historyItems2 = keyword + '|' + historyItems2.split('|').filter(function(e){return e!=keyword}).join('|');
        localStorage.historyItems2 = historyItems2.split("|").slice(0,3).join('|');//限制存储历史的个数，留出足够存储空间
    }
}
//清除值
function clearHistory() {
    localStorage.removeItem('historyItems2');
}
window.onload=function(){
    $(".search").val("");
}
