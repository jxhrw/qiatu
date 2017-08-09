$(document).ready(function(){
    var ajaxUrlAll={
        "orderInfo":"/order/bmsh5/info",//订单详情
        "couponRecords":"/pay/bms/coupon/cfRecords",//核销记录
        "excelRecords":"/pay/bms/coupon/excel/cfRecords",//下载核销记录
        "checkoffCancel":"/pay/bms/coupon/checkoff/cancel",//撤销核销
        "a":"",//券信息
        "checkoffAdd":"/pay/bms/coupon/checkoff/add",//核销券
        "b":""//修改订单号
    };
    var start = {
        elem: '#startDate',
        format: 'YYYY/MM/DD', //max: '2099-06-16 23:59:59'
        start:laydate.now(0, 'YYYY/MM/DD'),
        istime: false,
        istoday: false,
        isclear: true,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#endDate',
        format: 'YYYY/MM/DD', //max: '2099-06-16 23:59:59',
        start:laydate.now(0, 'YYYY/MM/DD'),
        istime: false,
        istoday: false,
        isclear: true,
        choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    var this_orderid;
    var this_writeOffCode;
    var listData={"pageno":1,"pagecnt":5};

    laydate.skin('dahong');
    laydate(start);
    laydate(end);

    listFunc(listData);

    $("#showOrderId,#offOrderId").val("若需关联第三方平台订单号，请输入").css("color","#aaa").focus(function(){
        if($(this).val().indexOf("第三方")>-1){
            $(this).val("").css("color","#000");
        }
    }).blur(function(){
        if($(this).val()==""){
            $(this).val("若需关联第三方平台订单号，请输入").css("color","#aaa");
        }
    });


    //关闭弹窗
    $(".closeBtn,#closeBtn,#cancelBtn,#closeOrder").click(function(){
        $(".popups").hide();
        $(".popups input").val("");
        $("#showOrderId,#offOrderId").val("若需关联第三方平台订单号，请输入").css("color","#aaa");
    });

    //确认撤回
    $("#withdrawBtn").click(function(){
        var cancelData={"orderid":this_orderid};
        ajaxPost(ajaxUrlAll.checkoffCancel,cancelData,cancelFunc,cancelErrorFunc);
    });

    //搜索
    $("#search").click(function(){
        var couponName=$("#couponName").val();
        var couponType=$("#couponType").val();
        var manual=$("#manual").val();
        var startDate=Date.parse($("#startDate").val()+" 00:00:00");
        var endDate=Date.parse($("#endDate").val()+" 23:59:59");
        var operator=$("#operator").val();
        var couponOwner=$("#couponOwner").val();
        var phoneOwner=$("#phoneOwner").val();
        if(couponName && "undefined"!=couponName && ""!=couponName){
            listData.couponName=couponName;
        }else {
            delete listData.couponName;
        }
        if(couponType && "undefined"!=couponType && ""!=couponType){
            listData.couponType=couponType;
        }else {
            delete listData.couponType;
        }
        if(manual && "undefined"!=manual && ""!=manual){
            listData.manualCheckoff=manual;
        }else {
            delete listData.manualCheckoff;
        }
        if(startDate && "undefined"!=startDate && ""!=startDate){
            listData.startTime=startDate;
        }else {
            delete listData.startTime;
        }
        if(endDate && "undefined"!=endDate && ""!=endDate){
            listData.endTime=endDate;
        }else {
            delete listData.endTime;
        }
        if(operator && "undefined"!=operator && ""!=operator){
            listData.checkoffOperator=operator;
        }else {
            delete listData.checkoffOperator;
        }
        if(couponOwner && "undefined"!=couponOwner && ""!=couponOwner){
            listData.userName=couponOwner;
        }else {
            delete listData.userName;
        }
        if(phoneOwner && "undefined"!=phoneOwner && ""!=phoneOwner){
            listData.mobile=phoneOwner;
        }else {
            delete listData.mobile;
        }
        listData.pageno=1;
        listFunc(listData);
    });

    //下载
    $("#load").click(function(){
        var loadData=JSON.stringify(listData);
        loadData=JSON.parse(loadData);
        delete loadData.pageno;
        delete loadData.pagecnt;
        window.location.href=ajaxUrlAll.excelRecords+'?data='+encodeURIComponent(JSON.stringify(loadData));
    });

    //核销礼券--弹出输入码
    $("#writeOff").click(function(){
        $("#writeOffCode").show();
        $("#codeInput input:first-child").focus();
    });
    $("#codeInput input").keyup(function(){
        if($(this).val()!=""){
            $(this).next("input").focus();
        }else{
            var k=0;
            var $nextAllInput = $(this).nextAll("input");
            $nextAllInput.each(function(){
                if($(this).val()!=""){
                    k++;
                }
            });
            if(k==0){
                $(this).prev("input").focus();
            }
        }
    });

    //核销礼券--下一步
    $("#codeNext").click(function(){
        var thisCode="";
        $("#codeInput input").each(function(){
            thisCode+=$(this).val();
        });
        console.log(thisCode);
        $("#codeDetailBox").show();
    });

    //核销礼券--确认核销
    $("#checkSure").click(function(){
        $("#writeOffCode").show();
    });

    $("#listTable").on("click",".orderId",function(){//订单
        if($(this).attr("class").indexOf("diffColor")==-1){
            var data={"orderid":$(this).html()};
            jiHeAnimate.load();
            ajaxPost(ajaxUrlAll.orderInfo,data,orderDetailFunc,orderErrorFunc);
        }
    }).on("click",".back",function(){//撤回按钮
        this_orderid=$(this).parents("tr").find(".orderId").attr("value");
        $("#withdrawBox").show();
    }).on("click",".change",function(){//修改订单号
        this_orderid=$(this).parents("tr").find(".orderId").attr("value");
        $("#changeOrderId").show();
    });


    //核销商户存在情况
    if(GetParams().is=="1"){
        $("#groupMch").css("display","inline-block");
        $(".groupMchTd").show();
        $(".noMessage").attr("colspan","10");
    }

    //订单详情
    function orderDetailFunc(res){
        var status='';
        var memberGrade='';
        jiHeAnimate.stopLoad();
        switch (res.data.status) {
            case '5':
                status='等待确认';
                break;
            case '8':
                status='已确认';
                break;
            case '9':
                status='已取消';
                break;
            case '12':
                status='交易完成';
                break;
        }
        switch (res.data.memberGrade) {
            case '0':
                memberGrade='金卡会员';
                break;
            case '1':
                memberGrade='白金卡会员';
                break;
            case '2':
                memberGrade='黑卡会员';
                break;
            default:
                memberGrade='';
                break;
        }
        $('.seeStatus').html(status);
        $('.seeOrderName').html(res.data.ordername);
        $('.seeQuantity').html(res.data.quantity);
        $('.seeCustomerName').html(res.data.customerName+"（"+memberGrade+"）");
        $('.seeCustomerMobile').html(res.data.customerMobile);
        $('.seeOrderid').html(res.data.orderid);
        if(res.data.ordertype=='6'){
            $('.roomOrder').hide();
        }else{
            $('.roomOrder').show();
            $('.seeCheckInTime').html(formatStrDate(res.data.checkin,"-"));
            $('.seeCheckOutTime').html(formatStrDate(res.data.checkout,"-"));
        }
        $('.seePaidTime').html(formatStrDate(res.data.paidTime,"-"));
        $('.seeAmount').html('￥'+parseInt(res.data.amount)/100);
        $('.seeRightContent').empty();
        var settle=res.data.settlePayments;
        for(v in settle){
            var payType='';
            switch (settle[v].payType) {
                case '0':
                    payType='现金预付';
                    break;
                case '1':
                    payType=settle[v].couponAlias+'【房券】';
                    break;
                case '2':
                    payType=settle[v].couponAlias+'【消费金】';
                    break;
                case '3':
                    payType='积分兑房抵现';
                    break;
                case '4':
                    payType='联盟积分';
                    break;
                case '5':
                    payType=settle[v].couponAlias+'【折扣】';
                    break;
                case '6':
                    payType='积分抵积分';
                    break;
                case '7':
                    payType='红包抵现';
                    break;
                default:
                    payType=settle[v].couponAlias+'【红包】';
                    break;
            }
            var p=$('<p class="seeDetail"></p>');
            var span=$('<span></span>');
            if(payType!=''){
                span.html('-￥'+parseInt(settle[v].amount)/100+' ('+payType+')');
                p.append(span);
                $('.seeRightContent').append(p);
            }
        }
        /*if("undefined" != typeof(res.data.bookOperator)){
         $('.seeBookOperator').html(res.data.bookOperator);
         }*/
        if("9" == res.data.status){
            var bookResult='';
            if(res.data.bookResult){
                switch (res.data.bookResult) {
                    case '0':
                        bookResult='无房拒绝';
                        break;
                    case '1':
                        bookResult='';
                        break;
                    case '2':
                        bookResult='价格错误原因拒绝';
                        break;
                    default:
                        bookResult='其他原因拒绝';
                        break;
                }
            }else if(res.data.closereson){
                bookResult=res.data.closereson;
            }
            $('.seeBookResult').html(bookResult);
        }else {
            $('.seeBookResult').html("");
        }
        $("#orderDetailBox").show();
    }
    function orderErrorFunc(res){
        jiHeAnimate.stopLoad();
        alert(res.ErrorMsg);
    }

    //撤销成功
    function cancelFunc(res){
        $("#withdrawBox").hide();
        listFunc(listData);
        setTimeout(function(){
            alert("已撤销");
        });
    }
    //撤销失败
    function cancelErrorFunc(res){
        alert(res.ErrorMsg);
    }

    //列表
    function listFunc(data,times){
        jiHeAnimate.load();
        $.post(ajaxUrlAll.couponRecords,{data:JSON.stringify(data)},function(res){
            jiHeAnimate.stopLoad();
            if(res.sc=="0"){
                couponRecordsFunc(res);
                //if(times=="first"){

                //}
                $('#tcdPageCode').createPage({
                    pageCount:parseInt(res.pageinfo?res.pageinfo.pageAmount:1),
                    current:parseInt(res.pageinfo?res.pageinfo.pageNo:1),
                    backFn:function(p) {
                        listData.pageno=p;
                        listFunc(listData);
                    }
                });
            }
        });
    }
    function couponRecordsFunc(res){
        var tableHtml='';
        if(res.data && res.data.length>=1){
            $.each(res.data,function(i){
                //couponType 1房券，2消费金，3会员卡,5 折扣,7红包
                var couponType='';
                var manualCheckoff='';
                var quantityUnits='';
                var faceValue=1;
                var change;
                var orderIdClass="";
                switch(parseInt(res.data[i].couponType)){
                    case 1:
                        couponType="房券";
                        faceValue=res.data[i].faceValue;
                        quantityUnits="张";
                        break;
                    case 2:
                        couponType="消费金";
                        faceValue=res.data[i].faceValue/100;
                        quantityUnits="元";
                        break;
                    case 3:
                        couponType="会员卡";
                        faceValue=res.data[i].faceValue/100;
                        quantityUnits="元";
                        break;
                    case 5:
                        couponType="折扣券";
                        faceValue=res.data[i].faceValue;
                        quantityUnits="次";
                        break;
                    case 7:
                        couponType="红包";
                        faceValue=res.data[i].faceValue;
                        quantityUnits="张";
                        break;
                    default:
                        couponType="礼券";
                        quantityUnits="";
                }
                switch(parseInt(res.data[i].manualCheckoff)){
                    case 1:
                        manualCheckoff="线下";
                        change='<span class="change">修改</span>';
                        orderIdClass="orderId diffColor";
                        break;
                    default:
                        manualCheckoff="线上";
                        change="";
                        orderIdClass="orderId";
                }
                var nowTime=Date.parse(new Date());
                var createTime=parseInt(res.data[i].createTime);
                var expireTime=parseInt(res.data[i].expireTime);
                var mobile=res.data[i].mobile?res.data[i].mobile:'';
                var checkoffOperator=res.data[i].checkoffOperator?res.data[i].checkoffOperator:"";
                var orderId=res.data[i].orderId?res.data[i].orderId:"";
                var back=((nowTime-createTime)/(24*60*60*1000)<30 && nowTime<expireTime)?'<span class="back">撤销</span>':'';

                tableHtml+='<tr>'
                    +'<td class="firstTd">'+res.data[i].couponName+'</td>'
                    +'<td>'+couponType+'</td>'
                    +'<td>'+ faceValue/(-1) +quantityUnits+'</td>'
                    +'<td>'+res.data[i].userName+'</td>'
                    +'<td>'+mobile+'</td>'
                    +'<td>'+formatStrDate(res.data[i].createTime,"/")+" "+secondIsNon(timeFormatSecond(res.data[i].createTime,":"))+'</td>'
                    +'<td>'+res.data[i].checkoffHotelCname+'</td>'
                    +'<td>'+manualCheckoff+'</td>'
                    +'<td>'+checkoffOperator+'</td>'
                    +'<td class="clickAble"><span class="'+ orderIdClass +'" value="'+ orderId +'">'+orderId+'</span></td>'
                    +'<td class="lastTd">'+ change + back +'</td>'
                    +'</tr>';
            });
        }
        else{
            tableHtml='<tr><td class="noMessage" colspan="11">暂无信息</td></tr>';
        }
        $("#listTable tbody").html(tableHtml);
    }
});