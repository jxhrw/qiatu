var scrollHeight;
$(document).ready(function(){
    var pageNum_this=1;//页码
    var pagecnt=10;//每页个数
    var getPriceType=GetParams().priceType;
    var pageCount=0;//总页数
    var priceType;
    var ajaxData=[];
    if('0'==getPriceType){
        priceType=getPriceType;
    }else {
        priceType=1;
    }
    var object={
        url:pageNum_this,
        data:pagecnt,
        pagecnt:pagecnt,
        classId:".saleList",
        lengthClassId:".single",
        leaveState:"storeLeave",
        pageNum:"storePage",
        originalHtml:"storeHtml",
        originalScrollTop:"storeScrollTop",
        originalRequestRata:"storeAjaxData",
        originalAjaxData:ajaxData
    }

    scrollHeight=listPageReturn(object,storeInformation,callback);

    function callback(originalRata,pageNum,pagecnt){
        var data=sessionStorage.getItem(originalRata);
        var res=JSON.parse(data);
        ajaxData=res;
        pageNum_this = sessionStorage.getItem(pageNum);
        pageCount=Math.ceil(res[0].pageinfo.recordAmount/pagecnt);
        conRightAclick();
        $('.background').append("<p class='prompt' style='margin-bottom: 0.8rem;display: none;'>  <p>");
    }

    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
            if(pageNum_this>=pageCount){
                $(".prompt").show().html("没有更多了呢");
            }
            if("没有更多了呢"!=$(".prompt").html()){
                pageNum_this++;
                storeInformation(pageNum_this,pagecnt);
            }
        }
    });


    function storeInformation(page,pagecnt){
        var url='/trade/h5/selling/list';
        var data={"pageno":page, "pagecnt":pagecnt};
        if('0'==getPriceType){
            data.priceType=priceType;
        }
        if(undefined!=GetParams().assetType){
            data.assetType=GetParams().assetType;
        }
        if(undefined!=GetParams().priceType){
            data.priceType=GetParams().priceType;
        }
        $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
            console.log(res);
            if(res.sc=="0"){
                var liHtml="";
                ajaxData.push(res);
                pageCount=Math.ceil(res.pageinfo.recordAmount/pagecnt);
                if(page=="1" && res.data.length==0){
                    $('.background').html(hasBackground('暂无消费金转让信息','30%'));
                }
                for(var i=0;i<res.data.length;i++){
                    var picUrl,name,dealDiscount,expireTime,couponId,dealDiscountHtml;
                    couponId=res.data[i].couponId;
                    if(undefined==res.data[i].couponBaseInfo){
                        picUrl='';
                        name='&nbsp;';
                        expireTime='';
                    }else {
                        picUrl=res.data[i].couponBaseInfo.picUrl;
                        name=res.data[i].couponBaseInfo.couponName;
                        expireTime=res.data[i].couponBaseInfo.expireTime;
                    }
                    if(priceType==1){
                        if(undefined==res.data[i].dealPointsPrice){
                            dealDiscount='暂无';
                        }else {
                            dealDiscount=res.data[i].dealPointsPrice/10 + "积分/1消费金";
                        }
                        dealDiscountHtml='最低转让价 <span>'+ dealDiscount +'</span>';
                    }else {
                        if(undefined==res.data[i].dealDiscount){
                            dealDiscount='暂无';
                        }else {
                            dealDiscount=res.data[i].dealDiscount + "%";
                        }
                        dealDiscountHtml='最低转让折扣 <span>'+ dealDiscount +'</span>';
                    }
                    liHtml+='<li class="single">'
                        +'<img src="'+ picUrl +'" alt="">'
                        +'<div class="singleCon clearfix">'
                        +'<div class="conLeft fl">'
                        +'<p class="conTitle">'+ name +'</p>'
                        +'<p class="conLastDis">'+ dealDiscountHtml +'</p>'
                        +'<p class="conDeadline"><span>'+newFormatStrDate(new Date(parseInt(expireTime)),'/')+'</span>到期</p>'
                        +'</div>'
                        +'<div class="conRight fr">'
                        +'<a id="'+ couponId +'">去购买</a>'/*couponid?res.data[i].couponId*/
                        +'</div>'
                        +'</div>'
                        +'</li>';
                }
                $(".saleList").append(liHtml);
                conRightAclick();
                if($('.background').html().indexOf("没有更多了呢")==-1 && res.data.length<pagecnt && undefined==$(".prompt").html()){
                    $('.background').append("<p class='prompt' style='margin-bottom: 0.8rem;'>没有更多了呢<p>");
                }
            }
            else if(res.sc=="TRADE-1003"){
                if($('.saleList li').length==0){
                    $('.background').html(hasBackground('暂无消费金转让信息','30%'));
                }
            }
            else {
                if($('.background').html().indexOf("没有更多了呢")==-1){
                    $('.background').append("<p class='prompt' style='margin-bottom: 0.8rem;'>没有更多了呢<p>");
                }
            }
        })
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

    function conRightAclick(){
        $(".conRight a").on("click",function(){
            var ua = window.navigator.userAgent.toLowerCase();
            var memberUrl='/member/h5/info';
            var couponId=$(this).attr("id");
            //请求是否会员
            var dataN={};
            var payMethod;
            if(priceType==0){
                payMethod="cash";
            }else {
                payMethod="point";
            }
            $.post(h5orClient(memberUrl),{data:JSON.stringify(dataN)},function(data) {
                console.log(data);
                if (data.sc == "0") {
                    object.originalAjaxData=ajaxData;
                    listPageSetItem(object);
                    location.href = "/html/h5/order/buyConsumption.html?payMethod="+payMethod+"&couponId="+couponId;
                }
                else if (data.sc == "-1" || data.sc=="POINT-1002") {
                    if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                        var data1 = '{"act":"toLogin"}';
                        var url = "http://www.jihelife.com?data=" + data1;
                        iosBridgeObjc(url);
                    }
                    else {
                        var urlLocation = "http://"+window.location.host+"/html/order/buyConsumption.html?payMethod="+payMethod+"&couponId="+couponId;
                        //location.href = "/user/h5/qrcode?regsucc_tourl=" + urlLocation;
                        location.href = "/user/h5/auth?h5url=" + encodeURIComponent(urlLocation);
                    }
                }
            });
        });
    }
});

window.onload=function(){
    //针对ios不滚动的问题
    if(scrollHeight && scrollHeight>0){
        $(window).scrollTop(scrollHeight);
    }
}