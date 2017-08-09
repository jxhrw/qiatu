var scrollHeight;
$(document).ready(function() {
    var data={/*"ordertype":6,*/"pageno":1,"pagecnt":"8"};
    if(GetParams().hotelid && GetParams().hotelid!="undefined"){
        data.hotelid=GetParams().hotelid;
    }
    var b=1;
    if(sessionStorage.getItem("leaveOrderList")==1){//检测到离开过页面则重新加载页面，并将状态归零
        b=sessionStorage.getItem("pageOrderList");
        var html=sessionStorage.getItem("htmlOrderList");
        scrollHeight=sessionStorage.getItem("scrollTopOrderList");
        $(".contentWrap").html(html);
        $(window).scrollTop(scrollHeight);
        sessionStorage.setItem("leaveOrderList","0");
        sessionStorage.setItem("pageOrderList",1);
        sessionStorage.setItem("htmlOrderList",'');
        sessionStorage.setItem("scrollTopOrderList",0);
        //window.history.go(0);
    }
    else{
        orderList(data);
    }

    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if($(".load").html()=="已经加载完"){
            return;
        }
        else{
            if(scrollTop + windowHeight == scrollHeight) {
                b++;
                //var data={/*"ordertype":6,*/"pageno":b,"pagecnt":"8"};
                data.pageno=b;
                orderList(data);
            }
        }
    });

    //发起订单列表请求
    function orderList(lsDate){
        $.post('/order/h5/list', {data: JSON.stringify(lsDate)},  function(data) {
            console.log(data);
            if(data.sc==0){
                for (var i = 0; i < data.data.length; i++) {
                    var showCyAmount=data.data[i].showCyAmount?data.data[i].showCyAmount:0;
                    var showCyCode=data.data[i].showCyCode?data.data[i].showCyCode:"";
                    var showCyType=data.data[i].showCyType?data.data[i].showCyType:0;
                    var showCyUnit=data.data[i].showCyUnit?data.data[i].showCyUnit:"";
                    if(showCyType=="0"||showCyType=="5" || showCyType=="6"){
                        showCyAmount=showCyAmount/100;
                    }
                    if(showCyType=="4"||showCyType=="5"){
                        showCyCode="礼券";
                    }
                    if(data.data[i].ordertype==2){//订房订单
                        $(".contentWrap").append(' <div class="card"><a class="tiao" href="/html/h5/order/orderDetailN.html?orderid='+data.data[i].orderid+'&hotelid='+data.data[i].hotelId+'"></a><ul class="cardLeft"><li><p class="nameTit">'+data.data[i].ordername+'</p></li><li>入住：'+formatStrDate(new Date(parseInt(data.data[i].checkin)))+',离店：'+formatStrDate(new Date(parseInt(data.data[i].checkout)))+', '+data.data[i].nights+'晚<span class="orderStatus orderStatus2">'+data.data[i].statedesc+'</span></li><li>预定'+data.data[i].quantity+'间</li></ul><p class="cardRight">'+showCyCode+'<span>'+showCyAmount+'</span>'+showCyUnit+'</p></div>');
                        $(".cardRight").click(function(){
                            window.location.href = $(this).parents(".card").find(".tiao").attr("href");
                        });
                    }
                    if(data.data[i].ordertype==4){//虚拟商品
                        /*console.log((new Date(parseInt(data.data[i].createtime)).getDate())*/
                        var href;
                        if(data.data[i].producttype==7){
                            href= "/html/h5/order/orderDetailN.html?orderid="
                        }else if(data.data[i].producttype==8){
                            href= "/html/h5/order/dealDetail.html?orderid="
                        }
                        $(".contentWrap").append(' <div class="card"><a class="tiao" href="'+ href +data.data[i].orderid+'&hotelid='+data.data[i].hotelId+'"></a><ul class="cardLeft dian"><li><p class="nameTit">'+data.data[i].ordername+'</p><span class="orderStatus orderStatus1">'+data.data[i].statedesc+'</span></li><li>'+formatStrYear(new Date(parseInt(data.data[i].createtime)))+'<p class="price">'+showCyCode+'<span>'+showCyAmount+'</span>'+showCyUnit+'</p></li></ul></div>');
                    }
                    if(data.data[i].ordertype==6){//店内消费
                        /*console.log((new Date(parseInt(data.data[i].createtime)).getDate())*/
                        $(".contentWrap").append(' <div class="card"><a class="tiao" href="/html/h5/order/orderDetailN.html?orderid='+data.data[i].orderid+'&hotelid='+data.data[i].hotelId+'"></a><ul class="cardLeft dian"><li><p class="nameTit">'+data.data[i].hotelCname+data.data[i].ordername+'</p><span class="orderStatus orderStatus1">'+data.data[i].statedesc+'</span></li><li>'+formatStrYear(new Date(parseInt(data.data[i].createtime)))+'<p class="price">'+showCyCode+'<span>'+showCyAmount+'</span>'+showCyUnit+'</p></li></ul></div>')
                    }
                }
                if(data.data.length<8 && data.data.length>=0){
                    $(".load").html("已经加载完")
                }
                if(data.data.length==0 && $(".card").length==0){
                    $(".load").html(hasBackground('您还没有订单','30%'));
                }
            }
        });
    }

    $(".card a").live("click",function(){
        sessionStorage.setItem("leaveOrderList","1");
        sessionStorage.setItem("pageOrderList",b);
        sessionStorage.setItem("htmlOrderList",$(".contentWrap").html());
        sessionStorage.setItem("scrollTopOrderList",$(window).scrollTop())
    });
});

window.onload=function(){
    //针对ios不滚动的问题
    if(scrollHeight && scrollHeight>0){
        $(window).scrollTop(scrollHeight);
    }
};

function formatNum(num){//补0
    return num.toString().replace(/^(\d)$/, "0$1");
}
function formatStrDate(vArg){//格式化日期
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return formatNum(vArg.getMonth() + 1) + "/" + formatNum(vArg.getDate());
            break;
    }
}

function formatStrYear(vArg){//格式化日期 年月日
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return formatNum(vArg[0]) + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return formatNum(vArg.getFullYear()) + "/" + formatNum(vArg.getMonth() + 1) + "/" + formatNum(vArg.getDate());
            break;
    }
}