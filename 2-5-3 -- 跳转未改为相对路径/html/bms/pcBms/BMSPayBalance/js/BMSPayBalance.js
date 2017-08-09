var totalPageNum;
$(document).ready(function() {
    var startTime;//搜索开始时间,时间戳
    var endTime;//搜索结束时间,时间戳
    var accountType1=sessionStorage.getItem("accountType1");
    var accountType2=sessionStorage.getItem("accountType2");

    $(".recordWrap").css('width', $(window).width()-40);
    $(".recordTable").css('width', $(window).width()-40);
    $(".mask").css('height', $(window).height());

    //1-商户订单收支明细  订单入账	11001,11101,11102,11105,12001,12101,12102,12105  交易手续费	11002,12002  提现	11011  充值	11012  
    //2-商户与积分中心收支明细  订单入账	11318,11331,11332,11335,12318,12331,12332,12335  会员积分发放	11311,11319  积分兑房佣金	11333,12333  提现	11011  充值	11012
    if(GetParams().accountType==accountType1){
        var typeHtml='<option value="-1">全部</option>'
           + '<option value="0">订单入账</option>'
            + '<option value="1">交易手续费</option>'
            + '<option value="2">提现</option>'
            + '<option value="3">充值</option>';
        $("#type").html(typeHtml);
    }else if(GetParams().accountType==accountType2){
        var typeHtml='<option value="-1">全部</option>'
            + '<option value="0">订单入账</option>'
            + '<option value="1">会员积分发放</option>'
            + '<option value="2">积分兑房佣金</option>'
            + '<option value="3">提现</option>'
            + '<option value="4">充值</option>';
        $("#type").html(typeHtml);
    }

    //直接进去全部搜索
    //{"accountId":16224,"accountType":1,"accountItems":[11001],"orderid":"02147383987373606","status":1,"startTime":1473696000000,"endTime":1474128000000}
    var data;
    if(GetParams().status=="-1"){//-1表示所有状态
        data={"accountId":GetParams().accountId,"accountType":GetParams().accountType,"pageno":1,"pagecnt":"6"};
    }else {
        data={"accountId":GetParams().accountId,"accountType":GetParams().accountType,"pageno":1,"pagecnt":"6","status":GetParams().status};
        $("#status").val(GetParams().status);
    }

    if(undefined!=GetParams().years && ""!=GetParams().years){
        data.startTime=Date.parse(new Date(GetParams().years+"/1/1 0:0:0"));
        data.endTime=Date.parse(new Date(GetParams().years+"/12/31 23:59:59"));
        $("#J_DepDate").val(formatStrDate(new Date(parseInt(data.startTime)))).attr("disabled","disabled").css("background","#fff");
        $("#J_EndDate").val(formatStrDate(new Date(parseInt(data.endTime)))).attr("disabled","disabled").css("background","#fff");
        $("#transactionType,#settlementStatus,#timeChoose em").hide();

        var data1={"accountTypes":[1,2],"needTransferInfo":1};
        $.ajax({
            url:'/accounting/bms/account/info',
            type:'post',
            data:{data:JSON.stringify(data1)},
            dataType:'json',
            success:function(res) {
                console.log(res);
                if(res.sc==0){
                    var settledAmount=0;//总收入
                    var transSettlementAmount=0;//已结算
                    var willSettledAmount=0;//待结算
                    var settlementList=res.data.settlementList;
                    for(var i=0;undefined!=settlementList && i<settlementList.length;i++){
                        if(settlementList[i].accountType==GetParams().accountType){
                            settledAmount=settlementList[i].settledAmount;
                            transSettlementAmount=settlementList[i].transSettlementAmount;
                            willSettledAmount=settlementList[i].willSettledAmount;
                        }
                    }
                    var obj={accountId:GetParams().accountId,accountType:GetParams().accountType,startTime:data.startTime,endTime:data.endTime};
                    obj=JSON.stringify(obj);
                    obj=encodeURIComponent(obj);
                    var loadUrl='/accounting/bms/excel/detail?data='+obj;
                    $("#summary").html("总收入："+settledAmount/100+"元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+"已结算："+transSettlementAmount/100+"元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+"待结算："+willSettledAmount/100+"元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+loadUrl+"' download='"+GetParams().years+"年度结算明细' id='download'>"+GetParams().years+"年度结算明细excel下载</a>");
                }
                else {
                    console.log(res.sc);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
    }

    search(data,data.pageno);



    //查询按钮
    $(".searchIcon").click(function(){
        //搜索每次的第一页
        data.pageno=1;

        //规定时间
        if($("#J_DepDate").val()!="" && $("#J_EndDate").val()!=""){
            startTime=Date.parse(new Date($("#J_DepDate").val()+" 0:0:0"));
            endTime=Date.parse(new Date($("#J_EndDate").val()+" 23:59:59"));
            data.startTime=startTime;
            data.endTime=endTime;
        }else {
            delete data.startTime;
            delete data.endTime;
        }

        //规定交易类型
        var type=$("#type").val();
        if(undefined==type || "-1"==type){
            delete data.accountItems;
        }else{
            if(GetParams().accountType==accountType1){
                if("0"==type){
                    data.accountItems=[11001,11101,11102,11105,12001,12101,12102,12105];
                }
                if("1"==type){
                    data.accountItems=[11002,12002];
                }
                if("2"==type){
                    data.accountItems=[11011];
                }
                if("3"==type){
                    data.accountItems=[11012];
                }
            }else if(GetParams().accountType==accountType2){
                if("0"==type){
                    data.accountItems=[11318,11331,11332,11335,12318,12331,12332,12335];
                }
                if("1"==type){
                    data.accountItems=[11311,11319];
                }
                if("2"==type){
                    data.accountItems=[11333,12333];
                }
                if("3"==type){
                    data.accountItems=[11011];
                }
                if("4"==type){
                    data.accountItems=[11012];
                }
            }
        }

        //规定结算状态
        var status=$("#status").val();
        if(undefined==status || "-1"==status){
            delete data.status;
        }else {
            data.status=status;
        }

        search(data,data.pageno);
    });

    //起止时间的3个选择
    $("#timeChoose em").live('click',function(event){
        $("#timeChoose em.on").removeClass("on");
        $(this).addClass("on");
        //时间部分
        var index=$("#timeChoose em.on").attr("type");
        console.log(index);
        if(index==1){//七天
            endTime=Date.parse(new Date());
            startTime=endTime-7*24*60*60*1000;
            $("#J_DepDate").val(formatStrDate(new Date(parseInt(startTime))));
            $("#J_EndDate").val(formatStrDate(new Date(parseInt(endTime))));
        }else if(index==2){//30天
            endTime=Date.parse(new Date());
            startTime=endTime-30*24*60*60*1000;
            $("#J_DepDate").val(formatStrDate(new Date(parseInt(startTime))));
            $("#J_EndDate").val(formatStrDate(new Date(parseInt(endTime))));
        }else if(index==0){//全部
            $("#J_DepDate,#J_EndDate").val("");
        }
    });

    //自定义时间区间
    $("#J_DepDate,#J_EndDate").blur(function(){
        setTimeout(function(){
            if($("#J_DepDate").val()!="" && $("#J_EndDate").val()!=""){
                $("#timeChoose em.on").removeClass("on");
            }
        },300);
    });

//跳转到第几页
    $("#pageDir i").live('click', function(event) {
        var page=$("#pageDir input").val()*1;
        if(page<=totalPageNum){
            data.pageno=page;
            search(data,page);
        }
    });
//下一个 上一页
    $("#pageDir .pageBefore").live('click', function(event) {
        if($(this).attr("id")!="current"){
            var page=$("#pageDir span.on").html()*1-1;
            data.pageno=page;
            search(data,page);
        }
    });
    $("#pageDir .pageNext").live('click', function(event) {
        if($(this).attr("id")!="current"){
            var page=$("#pageDir span.on").html()*1+1;
            data.pageno=page;
            search(data,page);
        }
    });
    $("#pageDir span").live('click', function(event) {
        var page=$(this).html();
        data.pageno=page;
        search(data,page);
    });

    //详情
    $(".hovertable em").live('click', function(event) {
        var id=$(this).attr("id");
        var type=$(this).attr("type");
        //type 2 积分入账订单 1 除2之外
        if(type==1){
            var idData={"orderid":id};
            $.post('/order/bmsh5/info', {data: JSON.stringify(idData)},  function(res) {
                console.log(res);
                if(res.sc==0){
                    $("#orderId").html(res.data.orderid);
                    $("#orderAmount").html(res.data.amount/100);
                    $("#stateDesc").html(res.data.statedesc);
                    $("#orderName").html(res.data.ordername);
                    $("#quantity").html(res.data.quantity);
                    if(undefined!=res.data.producttype){
                        $("#productType").html(res.data.producttype);
                    }
                    var discount= 0,coupon= 0,integralToRoom= 0,integralDeduction= 0,payCash= 0,redEnvelope=0;
                    for(var i=0;undefined!=res.data.payments && i<res.data.payments.length;i++){
                        if("5"==res.data.payments[i].payType){//折扣券
                            discount+=res.data.payments[i].amount/100;
                        }
                        if("0"==res.data.payments[i].payType){//现金
                            payCash+=res.data.payments[i].amount/100;
                        }
                        if("2"==res.data.payments[i].payType){//礼券抵扣
                            coupon+=res.data.payments[i].amount/100;
                        }
                        if("3"==res.data.payments[i].payType){//积分兑房
                            integralToRoom+=res.data.payments[i].amount/100;
                        }
                        if("4"==res.data.payments[i].payType){//积分抵扣
                            integralDeduction+=res.data.payments[i].amount/100;
                        }
                        if("7"==res.data.payments[i].payType){//红包抵扣
                            redEnvelope+=res.data.payments[i].amount/100;
                        }
                    }
                    $("#discount").html(discount);
                    $("#coupon").html(coupon);
                    $("#integralToRoom").html(integralToRoom);
                    $("#integralDeduction").html(integralDeduction);
                    $("#payCash").html(payCash);
                    $("#redEnvelope").html(redEnvelope);
                    if(undefined!=res.data.paidTime){
                        $("#paidTime").html(formatStrDateSecond(new Date(parseInt(res.data.paidTime))));
                    }
                    if(undefined!=res.data.checkin){
                        $("#checkIn").html(formatStrDate(new Date(parseInt(res.data.checkin))));
                    }
                    if(undefined!=res.data.checkout){
                        $("#checkOut").html(formatStrDate(new Date(parseInt(res.data.checkout))));
                    }
                    $("#bookerName").html(res.data.bookerName);
                    $("#bookerMobile").html(res.data.bookerMobile);
                    if(undefined!=res.data.customerName){
                        $("#customerName").html(res.data.customerName);
                    }else {
                        $("#customerName").html(res.data.bookerName);
                    }
                    if(undefined!=res.data.customerMobile){
                        $("#customerMobile").html(res.data.customerMobile);
                    }else {
                        $("#customerMobile").html(res.data.bookerMobile);
                    }
                    $("#transfer").show();
                }
                else {
                    alert(res.ErrorMsg);
                }
            });
        }
        if(type==2){
            var idData2={"id":id};
            $.post('/member/bms/points/record/info', {data: JSON.stringify(idData2)},  function(res) {
                console.log(res);
                if(res.sc==0){
                    $("#hotelName").html(res.data.hotelName);
                    $("#realName").html(res.data.realName);
                    $("#mobile").html(res.data.mobile);
                    $("#recordTypeDesc").html(res.data.recordTypeDesc);
                    if(undefined!=res.data.createTime){
                        $("#createTime").html(formatStrDateSecond(new Date(parseInt(res.data.createTime))));
                    }
                    if(undefined!=res.data.checkout){
                        $("#checkIn2").html(formatStrDate(new Date(parseInt(res.data.checkin))));
                    }
                    if(undefined!=res.data.checkout){
                        $("#checkOut2").html(formatStrDate(new Date(parseInt(res.data.checkout))));
                    }
                    $("#amount").html(res.data.amount/100);
                    $("#pointAmount").html(res.data.accountingAmount/100);
                    $("#issue").show();
                }
                else {
                    alert(res.ErrorMsg);
                }
            });
        }
    });

    //关闭按钮
    $(".maskClose").click(function(){
        $(".mask").hide();
        $(".detailTable td:nth-child(2),.detailTable td:nth-child(4)").html("");
    });
});


//搜索
function search(data,pageNum){
    $.ajax({
        url:'/accounting/bms/detail/list',
        data:{data:JSON.stringify(data)},
        type:'post',
        dataType:'json',
        success:function(res){
            console.log(res);
            if(res.sc=="0"){
                totalPageNum=res.data.totalPages*1;
                var transferInfoList=res.data.result;
                var tbodyHtml="<tr><th>结算时间</th><th>交易/订单号</th><th>收入/支出（元）</th><th>余额（元）</th><th>状态</th><th>操作</th></tr>";
                for(var i=0;undefined!=transferInfoList && i<transferInfoList.length;i++){
                    var orderId,status,subBtn;//订单号,结算状态：0-待结算,1-结算,详情按钮
                    if(undefined!=transferInfoList[i].orderId){
                        orderId='<br/>' + transferInfoList[i].orderId;
                        subBtn='<em type="1" id="'+ transferInfoList[i].orderId +'">详情</em>';
                    }else{
                        orderId='';
                        subBtn='';
                    }
                    if("11311"==transferInfoList[i].accountingItem){
                        subBtn='<em type="2" id="'+ transferInfoList[i].pointsRecordId +'">详情</em>';
                    }
                    if("0"==transferInfoList[i].status){
                        status='待结算';
                    }else if("1"==transferInfoList[i].status){
                        status='结算';
                    }
                    tbodyHtml=tbodyHtml + '<tr class="hovertableContent">'
                        + '<td>'+ formatStrDate(new Date(parseInt(transferInfoList[i].accountingTime))) +'</td>'
                        + '<td>'+ transferInfoList[i].accountingDesc + orderId +'</td>'
                        + '<td>'+ transferInfoList[i].accountingAmount/100 +'</td>'
                        + '<td>'+ transferInfoList[i].amountRemain/100 +'</td>'
                        + '<td>'+ status +'</td>'
                        + '<td>'+ subBtn +'</td>'
                        + '</tr>';
                }
                $(".hovertable").html(tbodyHtml);

                //页数
                if(res.data.totalPages*1>=1){
                    var pageHtml="";
                    var html;
                    var pageLimit=5;//最多显示5页
                    if(res.data.totalPages*1>pageLimit){
                        if(pageNum>pageLimit){
                            if(res.data.totalPages%pageLimit==0 || Math.floor((pageNum-1)/pageLimit)<Math.floor((res.data.totalPages*1-1)/pageLimit)){
                                for(var i=1;i<=pageLimit ;i++){
                                    pageHtml=pageHtml+'<span>'+(Math.floor((pageNum-1)/pageLimit)*pageLimit+i)+'</span>';
                                }
                            }else {
                                for(var i=1;i<=res.data.totalPages%pageLimit;i++){
                                    pageHtml=pageHtml+'<span>'+(Math.floor((pageNum-1)/pageLimit)*pageLimit+i)+'</span>';
                                }
                            }
                            if(Math.floor((pageNum-1)/pageLimit)<Math.floor((res.data.totalPages*1-1)/pageLimit)){
                                pageHtml+="&nbsp;&nbsp;&nbsp;…&nbsp;";
                            }
                        }else {
                            for(var i=1;i<=pageLimit;i++){
                                pageHtml=pageHtml+'<span>'+i+'</span>';
                            }
                            pageHtml+="&nbsp;&nbsp;&nbsp;…&nbsp;";
                        }
                    }else {
                        for(var i=0;i<res.data.totalPages*1;i++){
                            pageHtml=pageHtml+'<span>'+(i+1)+'</span>';
                        }
                    }
                    html='<em class="pageBefore" ><</em>'+ pageHtml +'<em class="pageNext">></em> 共<strong>'+ res.data.totalPages +'</strong>页 到第<input type="number" value="1">页 <i>确定</i>';
                    //console.log(typeof(pageNum));
                    $("#pageDir").html(html).show();
                    if(pageNum==1 && pageNum==res.data.totalPages*1){
                        $(".pageBefore,.pageNext").attr('id',"current");
                    }
                    else if(pageNum==1){
                        $(".pageBefore").attr('id',"current");
                    }
                    else if(pageNum==res.data.totalPages*1){
                        $(".pageNext").attr('id',"current");
                    }
                    else {
                        $(".pageBefore,.pageNext").attr('id',"");
                    }
                    $("#pageDir span").each(function(){
                        if($(this).html()*1==pageNum){
                            $("#pageDir span.on").removeClass("on");
                            $(this).addClass("on");
                            return;
                        }
                    })
                }
                else {
                    $("#pageDir").hide();
                }
            }
            else {
                console.log(res.sc);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    })
}


function formatNum(num){//补0
    return num.toString().replace(/^(\d)$/, "0$1");
}
function formatStrDateSecond(vArg){//格式化日期0-0-0 0:0:0
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]) + "&nbsp;" + formatNum(vArg[3]) + ":" + formatNum(vArg[4]) + ":" + formatNum(vArg[5]);
            break;
        case "object":
            return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate()) + "&nbsp;" + formatNum(vArg.getHours()) + ":" + formatNum(vArg.getMinutes()) + ":" + formatNum(vArg.getSeconds());
            break;
    }
}
function formatStrDate(vArg){//格式化日期0-0-0
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
            break;
    }
}
function formatStrDateNoYear(vArg){//格式化日期0-0
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
            break;
    }
}