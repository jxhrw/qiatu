$(document).ready(function(){
    var windowHeight=$(window).height();
    var drawCash;//提现金额
    var rechargeCash;//充值金额
    var cashSettled,//现金已结算金额.新总收入
        cashUnSettled,//现金待结算金额
        cashBalance,//现金余额
        creditLimit,//信用额度
        cashSettlementAmount,//新已结算
        integralSettled,//积分已结算金额.新总收入
        integralUnSettled,//积分待结算金额
        integralBalance,//积分余额
        integralSettlementAmount,//新已结算
        transferInfoList,//转账信息列表
        accountId,
        jiheAccount,
        accountType1,//类别
        accountType2,
        bankList;//银行卡信息

    $(".mask").height(windowHeight);

    //结算状态: 0-待结算；1-结算  -1 - 所有状态
    //账户类型：1-现金账户；2-联盟积分中心现金账户；3-几何积分中心现金账户，4-券账户；5-积分账户
    //现金结算收支明细
    $("#cashRecords").click(function(){
        window.location.href='/html/bms/pcBms/BMSPayBalance/BMSPayBalance.html?accountId='+accountId+'&accountType='+accountType1+'&status=1';
    });
    //现金结算待结算记录
    $("#cashUnRecords").click(function(){
        window.location.href='/html/bms/pcBms/BMSPayBalance/BMSPayBalance.html?accountId='+accountId+'&accountType='+accountType1+'&status=0';
    });
    //积分中心结算收支明细
    $("#integralRecords").click(function(){
        window.location.href='/html/bms/pcBms/BMSPayBalance/BMSPayBalance.html?accountId='+accountId+'&accountType='+accountType2+'&status=1';
    });
    //积分中心结算待结算记录
    $("#integralUnRecords").click(function(){
        window.location.href='/html/bms/pcBms/BMSPayBalance/BMSPayBalance.html?accountId='+accountId+'&accountType='+accountType2+'&status=0';
    });


    //充值提现记录,页面a链接
    $(".rechargeCash .aBtn,#cashRechargew,#integralRechargew").click(function(){
        window.location.href='/html/bms/pcBms/BMSRechargeDraw/BMSRechargeDraw.html?accountId='+accountId;
    });

    var timeNow=new Date();
    timeNow=parseInt(timeNow.getFullYear());
    if(timeNow>=2016){
        var optionHtml='<option value="" selected="selected">年度结算</option>';
        for(var i=2016;i<timeNow;i++){
            optionHtml+='<option value="'+i+'">'+i+'年度</option>';
        }
        $(".theYear").html(optionHtml);
        //年度收支明细
        $("#cashYear").click(function(){
            if(undefined!=$(this).val() && ""!=$(this).val()){
                window.location.href='/html/bms/pcBms/BMSPayBalance/BMSPayBalance.html?accountId='+accountId+'&accountType='+accountType1+'&status=-1'+'&years='+$(this).val();
            }
        });
        $("#integralYear").click(function(){
            if(undefined!=$(this).val() && ""!=$(this).val()){
                window.location.href='/html/bms/pcBms/BMSPayBalance/BMSPayBalance.html?accountId='+accountId+'&accountType='+accountType2+'&status=-1'+'&years='+$(this).val();
            }
        });
    }else {
        $(".theYear").hide();
    }

    request();
    
    //数据请求
    function request(noList){
        var data1={"accountTypes":[1,2],"needTransferInfo":1};
        $.ajax({
            url:'/accounting/bms/account/info',
            type:'post',
            data:{data:JSON.stringify(data1)},
            dataType:'json',
            success:function(res) {
                console.log(res);
                if(res.sc==0){
                    accountId=res.data.accountId;
                    transferInfoList=res.data.transferInfoList;
                    if(undefined!=res.data.settlementList[0]){
                        cashSettled=res.data.settlementList[0].settledAmount/100;
                        cashUnSettled=res.data.settlementList[0].willSettledAmount/100;
                        cashBalance=res.data.settlementList[0].availableAmount/100;
                        accountType1=res.data.settlementList[0].accountType;
                        cashSettlementAmount=res.data.settlementList[0].transSettlementAmount/100;
                        sessionStorage.setItem("accountType1",accountType1);
                        $("#cashSettled").html(cashSettled);
                        $("#cashUnSettled").html(cashUnSettled);
                        $("#cashBalance").html(cashBalance);
                        $("#cashHasAmount").html(cashSettlementAmount);
                        //$("#deadLine").html(formatStrDate(new Date(parseInt(res.data.settlementList[0].deadLine))));
                    }else {
                        $("#cashBox").hide();
                    }

                    if(undefined!=res.data.settlementList[1]){
                        integralSettled=res.data.settlementList[1].settledAmount/100;
                        integralUnSettled=res.data.settlementList[1].willSettledAmount/100;
                        integralBalance=res.data.settlementList[1].availableAmount/100;
                        integralSettlementAmount=res.data.settlementList[1].transSettlementAmount/100;
                        accountType2=res.data.settlementList[1].accountType;
                        sessionStorage.setItem("accountType2",accountType2);
                        if(undefined!=res.data.settlementList[1].creditLimit){
                            creditLimit=res.data.settlementList[1].creditLimit/100;
                        }else {
                            creditLimit=0;
                        }
                        $(".creditLimit em").html(creditLimit);
                        $("#integralSettled").html(integralSettled);
                        $("#integralUnSettled").html(integralUnSettled);
                        $("#integralBalance").html(integralBalance);
                        $("#integralHasAmount").html(integralSettlementAmount);
                        //$("#integralDeadLine").html(formatStrDate(new Date(parseInt(res.data.settlementList[1].deadLine))));
                    }else {
                        $("#integralBox").hide();
                    }

                    if(noList!=0){
                        var tbodyHtml="<tr><th>申请时间</th><th>充值/提现银行帐号|流水号</th><th>账户类型</th><th>充值金额(元)</th><th>提现金额(元)</th><th>申请人</th><th>状态</th><th>处理完成时间</th><th>备注</th><th>操作</th></tr>";
                        for(var i=0;undefined!=transferInfoList && i<transferInfoList.length;i++){
                            var serialNumber,applicant,status,remark,operation,confirmTime,accountTType;//流水号,申请人,转账状态：0-商户申请，1-确认，2-拒绝申请 ,备注 ,状态描述,完成时间
                            if(undefined!=transferInfoList[i].serialNumber){
                                serialNumber='<br/>' + transferInfoList[i].serialNumber;
                            }else{
                                serialNumber='';
                            }
                            if(undefined!=transferInfoList[i].applicant){
                                applicant=transferInfoList[i].applicant;
                            }else{
                                applicant='';
                            }
                            if("0"==transferInfoList[i].status){
                                status='商户申请';
                                operation='删除';
                            }else if("1"==transferInfoList[i].status){
                                status='确认';
                                operation='';
                            }else if("2"==transferInfoList[i].status){
                                status='拒绝申请';
                                operation='';
                            }
                            if(undefined!=transferInfoList[i].remark){
                                remark=transferInfoList[i].remark;
                            }else{
                                remark='';
                            }
                            if(undefined!=transferInfoList[i].confirmTime){
                                confirmTime=formatStrDateNoYear(new Date(parseInt(transferInfoList[i].confirmTime)))
                            }else{
                                confirmTime='';
                            }
                            if(accountType1==transferInfoList[i].applyAccountType){
                                accountTType='现金账户';
                            }else  if(accountType2==transferInfoList[i].applyAccountType){
                                accountTType='积分账户';
                            }
                            if("GET"==transferInfoList[i].transferType){
                                tbodyHtml=tbodyHtml + '<tr>'
                                    + '<td>'+ formatStrDateNoYear(new Date(parseInt(transferInfoList[i].createTime))) +'</td>'
                                    + '<td>'+ transferInfoList[i].inBank + '|' + transferInfoList[i].inBankAccountNumber + serialNumber +'</td>'
                                    + '<td>'+ accountTType +'</td>'
                                    + '<td>'+ '' +'</td>'
                                    + '<td>'+ transferInfoList[i].amount/100 +'</td>'
                                    + '<td>'+ applicant +'</td>'
                                    + '<td>'+ status +'</td>'
                                    + '<td>'+ confirmTime +'</td>'
                                    + '<td>'+ remark +'</td>'
                                    + '<td><span style="cursor: pointer" class="delete" id="'+ transferInfoList[i].id +'">'+operation+'</span></td>'
                                    +'</tr>';
                            }
                            else if("PUT"==transferInfoList[i].transferType){
                                tbodyHtml=tbodyHtml + '<tr>'
                                    + '<td>'+ formatStrDateNoYear(new Date(parseInt(transferInfoList[i].createTime))) +'</td>'
                                    + '<td>'+ transferInfoList[i].outBank + '|' + transferInfoList[i].outBankAccountNumber + serialNumber +'</td>'
                                    + '<td>'+ accountTType +'</td>'
                                    + '<td>'+ transferInfoList[i].amount/100 +'</td>'
                                    + '<td>'+ '' +'</td>'
                                    + '<td>'+ applicant +'</td>'
                                    + '<td>'+ status +'</td>'
                                    + '<td>'+ confirmTime +'</td>'
                                    + '<td>'+ remark +'</td>'
                                    + '<td><span style="cursor: pointer" class="delete" id="'+ transferInfoList[i].id +'">'+operation+'</span></td>'
                                    +'</tr>';
                            }
                        }
                        $(".rechargeCash tbody").html(tbodyHtml);
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
        });
    }

    //充值提现记录删除，数据请求
    $(".rechargeCash tbody .delete").live("click",function(){
        var id=parseInt($(this).attr("id"));
        var data2={"id":id};
        $.ajax({
            url:'/accounting/bms/transfer/del',
            type:'post',
            data:{data:JSON.stringify(data2)},
            dataType:'json',
            success:function(res) {
                $(".rechargeCash tbody .delete#"+id).parents("tr").remove();
                request(0);
            }
        });
    });

    //关闭按钮
    $(".maskClose").click(function(){
        $(".mask").hide();
    });

    //现金结算提现弹窗，数据请求
    $("#cashWithdrawals").click(function(){
        var data1={"accountTypes":[1,2],"needTransferInfo":1,"needBankInfo":1};
        //$(".submitBtn").removeClass("useful");
        $.ajax({
            url:'/accounting/bms/account/info',
            type:'post',
            data:{data:JSON.stringify(data1)},
            dataType:'json',
            success:function(res) {
                console.log(res);
                if(res.sc==0){
                    bankList=res.data.bankList;//银行卡信息
                    $("#canWithdraw").html(res.data.settlementList[0].availableAmount/100);
                    if(res.data.settlementList[0].availableAmount<=0){
                        $("#withdrawalsBox .submitBtn").removeClass("useful");
                    }
                    else {
                        $("#withdrawalsBox .submitBtn").addClass("useful");
                    }
                    //$("#withdrawalsBox .submitBtn").addClass("useful");
                    submitBtn(accountType1,bankList);
                }
                $("#withdrawalsBox").show();
            }
        });
    });

    //积分结算提现弹窗，数据请求
    $("#integralWithdrawals").click(function(){
        var data1={"accountTypes":[1,2],"needTransferInfo":1,"needBankInfo":1};
        //$(".submitBtn").removeClass("useful");
        $.ajax({
            url:'/accounting/bms/account/info',
            type:'post',
            data:{data:JSON.stringify(data1)},
            dataType:'json',
            success:function(res) {
                if(res.sc==0){
                    bankList=res.data.bankList;//银行卡信息
                    $("#canWithdraw").html(res.data.settlementList[1].availableAmount/100);
                    if(res.data.settlementList[1].availableAmount<=0){
                        $("#withdrawalsBox .submitBtn").removeClass("useful");
                    }
                    else {
                        $("#withdrawalsBox .submitBtn").addClass("useful");
                    }
                    //$("#withdrawalsBox .submitBtn").addClass("useful");
                    submitBtn(accountType2,bankList);
                }
                $("#withdrawalsBox").show();
            }
        });
    });


    //确认提现，数据上传接口
    function submitBtn(iscash,bankList){
        var bankListP="";
        if(undefined!=bankList && bankList.length>0){
            for(var i=0;i<bankList.length;i++){
                bankListP=bankListP+'<p id="'+ bankList[i].id +'">'+bankList[i].bankName +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ bankList[i].bankAccountName + bankList[i].bankAccountNumber +'</p>';
            }
            $("#withdrawalsBox .cards").html(bankListP);
            //选择提现银行卡
            $("#withdrawalsBox .cards p").click(function(){
                if($(this).hasClass("on")){
                    $(this).removeClass("on");
                } else {
                    $("#withdrawalsBox .cards p").removeClass("on");
                    $(this).addClass("on");
                }
            });
            $(".submitBtn").unbind('click').click(function(){
                if($(".submitBtn").hasClass("useful")){
                    var money=$("#canWithdraw").html()/1;
                    var draw=$("#drawCash").val()/1;
                    var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                    var r = reg.test(draw);
                    if(draw>0 && draw<=money && r && $("#withdrawalsBox .cards p.on").index()!="-1"){
                        //alert(r);
                        var inBankInfo;
                        var time=Date.parse(new Date());
                        for(var i=0;i<bankList.length;i++){
                            if($("#withdrawalsBox .cards p.on").attr("id")==bankList[i].id){
                                inBankInfo={"id":bankList[i].id,"accountId":bankList[i].accountId,"bankAccountName": bankList[i].bankAccountName,"bankAccountNumber":bankList[i].bankAccountNumber,"bankName":bankList[i].bankName};
                            }
                        }
                        var data2={"accountId":accountId,"accountType": iscash ,"transferType":"GET","inBankInfo":inBankInfo,"amount":Math.round(draw*100),"transferTime":time};
                        $.ajax({
                            url:'/accounting/bms/transfer/add',
                            type:'post',
                            data:{data:JSON.stringify(data2)},
                            dataType:'json',
                            success:function(res) {
                                console.log(res);
                                if(res.sc==0){
                                    request();
                                    $("#withdrawalsBox").hide();
                                    $("#withdrawalsSuccessBox").show();
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
                    else if($("#withdrawalsBox .cards p.on").index()=="-1"){
                        alert("请选择提现银行卡");
                    }
                    else {
                        alert("请输入正确金额");
                        $("#drawCash").focus().val("");
                    }
                }
            });
        }
    }

    //信用额度说明
    $(".creditDescription").click(function(){
        $("#creditDescription").show();
    });

    //充值弹窗,数据请求
    $("#integralRecharge").click(function(){
        var data1={"accountTypes":[1,2],"needTransferInfo":1,"needBankInfo":1};
        var data3={"accountId":accountType2,"status":1};
        $.ajax({
            url:'/accounting/bms/account/info',
            type:'post',
            data:{data:JSON.stringify(data1)},
            dataType:'json',
            success:function(res) {
                console.log(res);
                if(res.sc==0){
                    $("#canRecharge,#balanceVoucher").html(res.data.settlementList[1].availableAmount/100);
                    $("#nameVoucher").html(res.data.accountName);
                    bankList=res.data.bankList;//银行卡信息
                    if(undefined!=bankList && bankList.length>0){
                        var allAccountLi="";
                        for(var i=0;i<bankList.length;i++){
                            allAccountLi=allAccountLi+'<li>'+ bankList[i].bankAccountNumber +'</li>'
                        }
                        $(".allAccount").html(allAccountLi);
                        //上传凭证弹层选择已有账号
                        $(".allAccount li").unbind('click').click(function(){
                            var account=$(this).html();
                            $("#numAccount").val(account);
                            for(var i=0;i<bankList.length;i++){
                                if(account==bankList[i].bankAccountNumber){
                                    $("#nameAccount").val(bankList[i].bankAccountName);
                                    $("#bankAccount").val(bankList[i].bankName);
                                    $(".allAccount").attr("id",bankList[i].id);
                                }
                            }
                            $(".allAccount").hide();
                        });
                    }
                }
                $("#rechargeBox").show();
            }
        });
        $.ajax({
            url:'/accounting/bms/bank/list',
            type:'post',
            data:{data:JSON.stringify(data3)},
            dataType:'json',
            success:function(res) {
                console.log(res);
                if(res.sc==0){
                    if(undefined!=res.data){
                        jiheAccount=res.data[0];
                        $(".jiheBankAccountName").html(jiheAccount.bankAccountName);
                        $(".jiheBankName").html(jiheAccount.bankName);
                        $(".jiheBankAccountNumber").html(jiheAccount.bankAccountNumber);
                    }
                }
            }
        });
    });

    //充值弹窗确认充值
    $(".submitRecharge").click(function(){
        rechargeCash=$("#rechargeCash").val()*1;
        var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
        var r = reg.test(rechargeCash);
        if(r){
            $("#rechargeBox").hide();
            $("#voucherBox").show();
            $("#rechargeVoucher").html(rechargeCash);
            $(".sureVoucher span").html(rechargeCash);
        }else {
            alert("请输入正确金额");
            $("#rechargeCash").focus().val("");
        }
    });

    //上传凭证按钮
    $(".uploadVoucher").click(function(){
        $("#voucherBox").hide();
        $("#voucherSureBox").show();
        $("#moneyAccount").html(rechargeCash);
        $("#payTime").val(formatStrDate(new Date()));
    });

    //上传转账凭证信息
    $("#numAccount").focus(function(){
        if(!$(this).val()) {
            $(".allAccount").show();
            $("#nameAccount,#bankAccount").val("");
        }
        $(this).keyup(function(){
            if(!$(this).val()){
                $(".allAccount").show();
                $("#nameAccount,#bankAccount").val("");
            }else {
                $(".allAccount").hide();
            }
        });
    }).blur(function(){
        setTimeout(function(){
            $(".allAccount").hide();
        },300);
    });

    //上传凭证最后确认提交,数据上传接口
    $(".uploadSureVoucher").click(function(){
        var numAccount=$("#numAccount").val();
        var nameAccount=$("#nameAccount").val();
        var bankAccount=$("#bankAccount").val();
        if(numAccount==""){
            alert("请填写账号");
            return;
        }
        if(nameAccount==""){
            alert("请填写户名");
            return;
        }
        if(bankAccount==""){
            alert("请填写开户行");
            return;
        }
        var serialNumber=$("#serialNumber").val();
        var outBankInfo;
        if(numAccount.indexOf("*")>-1){ //存在*号
            outBankInfo= {"accountId":accountId,"id":$(".allAccount").attr("id"),"serialNumber":serialNumber};
        }else {
            outBankInfo= {"accountId":accountId,"bankAccountName": nameAccount,"bankAccountNumber":numAccount,"bankName":bankAccount,"serialNumber":serialNumber};
        }
        var inBankInfo={"id":jiheAccount.id,"accountId":jiheAccount.accountId,"bankAccountName": jiheAccount.bankAccountName,"bankAccountNumber":jiheAccount.bankAccountNumber,"bankName":jiheAccount.bankName};
        var amount=$("#moneyAccount").html();
        var time=Date.parse(new Date());
        var data2= {"accountId":accountId,"accountType": accountType2 ,"transferType":"PUT","inBankInfo":inBankInfo,"outBankInfo":outBankInfo,"amount":Math.round(amount*100),"transferTime":time};
        $.ajax({
            url: '/accounting/bms/transfer/add',
            type: 'post',
            data: {data: JSON.stringify(data2)},
            dataType: 'json',
            success: function (res) {
                console.log(res);
                if (res.sc == 0) {
                    request();
                    $("#voucherSureBox").hide();
                    $("#voucherSuccessBox").show();
                }
                else {
                    console.log(res.sc);
                }
            }
        });
    });


});


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
            return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
            break;
    }
}
function formatStrDateNoYear(vArg){//格式化日期
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