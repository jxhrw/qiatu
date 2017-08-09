$(document).ready(function () {
    var jumpurl=getRequest().jumpurl;
    console.log(jumpurl);
    if(jumpurl){
        $(".jumpingPrice").hide();
        $(".jumpingContent").html("正在跳转至<span>第三方网站</span>");
        $(".jumpingNotice").css("text-align","center").html("预订成功后将由第三方网站为您提供相应的售后服务");
        if(/MicroMessenger/i.test(navigator.userAgent)){
            setTimeout(function() {
                window.location.href=decodeURIComponent(jumpurl);
            }, 2000)
        }else{
            if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
                setTimeout(function() {
                    var stepData = {"act": "toWebView", "h5url": jumpurl};
                    var url = "http://www.jihelife.com?data=" + JSON.stringify(stepData);
                    iosBridgeObjc(url);
                }, 2000)
            }
        }
    }else{
        var urlall = "/leapp/promotion.detail";
        var param = '{"id":"' + id + '"}';
        allUrl="/leapp/promotion.step";
        allData='{"id":"'+id+'"}';
        if(isiOS==true){
            $.post( urlall,{data:param},function(result){
                console.debug(result);

                var sc=result.sc;
                var title=result.data.promotion.title;
                var price=result.data.promotion.promotionPrice;
                var priceUnit=result.data.promotion.priceUnit;
                var day=result.data.promotion.countDay;
                var originName=result.data.promotion.originName;

                var object={sc:sc,title:title,price:price,priceUnit:priceUnit,day:day,originName:originName}
                jumpingHtml(object);

            })

            $.post(allUrl,{data:allData},function(result){
                console.debug(result);
                href=result.data.stepInfo.reserveWayValue;
                setTimeout(function() {
                    window.location.href=href;
                }, 2000)


            })
        }

        else {
            var person = new Person();

            person.requestCommit(urlall, param)

            console.debug(person.getRequestData());

            var sc=person.getRequestData().sc;
            var title=person.getRequestData().data.promotion.title;
            var price=person.getRequestData().data.promotion.promotionPrice;
            var day=person.getRequestData().data.promotion.countDay;
            var originName=person.getRequestData().data.promotion.originName;
            var priceUnit=person.getRequestData().data.promotion.piecesUnit;

            var object={sc:sc,title:title,price:price,priceUnit:priceUnit,day:day,originName:originName}
            jumpingHtml(object);

            person.requestCommit(allUrl, allData)

            console.debug(person.getRequestData());

            href=person.getRequestData().data.stepInfo.reserveWayValue;
            setTimeout(function() {
                window.location.href=href;
            }, 2000)
        }
    }
})
//获取url的参数
function getRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function jumpingHtml(object){
    $(".jumpingTitle").html(object.title);
    $(".jumpingPrice span").html(object.price);
    $(".jumpingPrice strong").html(object.priceUnit);
    if(object.day==1){
        $(".jumpingPrice em").html();
    }
    else{
        $(".jumpingPrice em").html(object.day);
    }
    $(".jumpingContent span").html(object.originName);

    $(".jumpingNotice span").html(object.originName);
}
// IOS桥接调用
function iosBridgeObjc(url) {
    var iframe;
    iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
}