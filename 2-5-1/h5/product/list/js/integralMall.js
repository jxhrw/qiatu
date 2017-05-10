var scrollHeight;
$(document).ready(function(){
    var pageNum_this=1;//页码
    var pagecnt=10;//每页个数
    var tags=GetParams().tags;
    var ajaxData=[];
    var pageCount;
    var sortKind=[];
    var manualSort={"field":"manual", "rule":"DESC"},
        sellAmountSort={"field":"sellamount", "rule":"DESC"},
        updateTimeSort={"field":"updatetime", "rule":"DESC"},
        priceSort={"field":"pointsprice", "rule":"DESC"};
    var object={
        url:pageNum_this,
        data:tags,
        pagecnt:pagecnt,
        classId:".listUl",
        lengthClassId:".listLi",
        leaveState:"integralMallLeave",
        pageNum:"integralMallPage",
        originalHtml:"integralMallHtml",
        originalScrollTop:"integralMallScrollTop",
        originalRequestRata:"integralMallAjaxData",
        originalAjaxData:ajaxData
    };

    scrollHeight=listPageReturn(object,integralMallList,callback);

    function callback(originalRata,pageNum,pagecnt){
        var data=sessionStorage.getItem(originalRata);
        var res=JSON.parse(data);
        ajaxData=res;
        pageNum_this = sessionStorage.getItem(pageNum);
        pageCount=Math.ceil(res[0].data.totalCount/pagecnt);
        $(".listLi").click(function(){
            object.originalAjaxData=ajaxData;
            listPageSetItem(object);
            window.location.href=$(this).attr("value");
        });
    }

    $(".screen td").click(function(){
        sortKind=[];
        pageNum_this=1;
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
        integralMallList(pageNum_this,tags,sortKind);
    });

    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
            pageNum_this++;
            if(pageNum_this>pageCount){
                $(".loadMore").html("已经加载完了");
            }
            if('已经加载完了'!=$(".loadMore").html()){
                integralMallList(pageNum_this,tags,sortKind);
            }
        }
    });

    // IOS桥接调用
    function iosBridgeObjc(url) {
        var iframe;
        iframe = document.createElement("iframe");
        iframe.setAttribute("src", url);
        iframe.setAttribute("style", "display:none;");
        document.body.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
    }

    function integralMallList(pageNum,tags,sorts){
        var url="/search/h5search";
        var string2=decodeURIComponent(tags);
        var search = string2.split(",");
        var data={"pagecnt":pagecnt,"pageno":pageNum,"tags":search,"sorts":sorts};
        if(undefined!=GetParams().assetType){
            data.assetType=GetParams().assetType;
        }
        if(undefined!=GetParams().priceType){
            data.priceType=GetParams().priceType;
        }
        $.post(url, {data:JSON.stringify(data)}, function(res) {
            if(res.sc==0){
                ajaxData.push(res);
                pageCount=Math.ceil(res.data.totalCount/pagecnt);
                var listHtml="";
                for(var i=0;undefined!=res.data.searchList && i<res.data.searchList.length;i++){
                    var goTo;
                    var priceNum;
                    var priceKind;
                    var briefDesc=res.data.searchList[i].object.briefDesc?res.data.searchList[i].object.briefDesc:"";
                    var ua = window.navigator.userAgent.toLowerCase();
                    if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                        goTo=res.data.searchList[i].h5url;
                    }else{
                        goTo=res.data.searchList[i].object.wxDetailLink;
                    }
                    if(1==res.data.searchList[i].object.productPrice.priceType){
                        priceNum=res.data.searchList[i].object.productPrice.totalPointPrice;
                        priceKind='<span class="listNum">'+ priceNum +'</span> 积分';
                    }else if(0==res.data.searchList[i].object.productPrice.priceType){
                        priceNum=res.data.searchList[i].object.productPrice.totalPrice;
                        priceKind='￥ <span class="listNum">'+ priceNum/100 +'</span>';
                    }
                    listHtml+='<li class="listLi clearfix" value="'+ goTo +'">'
                        +'<img class="fl" src="'+ res.data.searchList[i].imageLink+ '?imageView2/1/w/750/h/480' +'" alt="">'
                        +'<div class="listDiv fl">'
                        +'<p class="listTitle">'+ res.data.searchList[i].title +'</p>'
                        +'<p class="listCon">'+briefDesc+'</p>'
                        +'<p class="listPrice">'+ priceKind +'</p>'
                        +'</div>'
                        +'</li>';
                }
                if(pageNum==1){
                    $(".listUl").html(listHtml);
                }else {
                    $(".listUl").append(listHtml);
                }
                if($(".listUl .listLi").length==0){
                    $(".listUl").html(hasBackground("暂时没有商品","30%"));
                }
                else if($(".listUl .listLi").length==res.data.totalCount){
                    $(".loadMore").html("已经加载完了");
                }
                else{
                    $(".loadMore").html("加载更多");
                }

                $(".listLi").click(function(){
                    object.originalAjaxData=ajaxData;
                    listPageSetItem(object);
                    window.location.href=$(this).attr("value");
                });
            }else {
                $(".loadMore").html("请稍后再试");
            }
        });
    }

});

window.onload=function(){
    //针对ios不滚动的问题
    if(scrollHeight && scrollHeight>0){
        $(window).scrollTop(scrollHeight);
    }
}
