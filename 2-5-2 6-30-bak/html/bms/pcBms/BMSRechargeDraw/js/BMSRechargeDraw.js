var totalPageNum;
var accountType1=sessionStorage.getItem("accountType1");
var accountType2=sessionStorage.getItem("accountType2");
$(document).ready(function() {
    var startTime;//搜索开始时间，时间戳
    var endTime;//搜索结束时间，时间戳

    $(".recordWrap").css('width', $(window).width()-40);
    $(".recordTable").css('width', $(window).width()-40);
    $(".mask").css('height', $(window).height());

    //直接进去全部搜索
    var data={"accountId":GetParams().accountId,"pageno":1,"pagecnt":"6"};
    search(data,data.pageno);


    //查询按钮
    $(".searchIcon").click(function(){
        //搜索每次的第一页
        data.pageno=1;

        //时间部分
        var index=$("#timeChoose em.on").index();
        console.log(index);

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
            delete data.transferType;
        }else {
            data.transferType=type;
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

    //充值提现记录删除，数据请求
    $(".hovertable .delete").live("click",function(){
        var id=parseInt($(this).attr("id"));
        var data2={"id":id};
        $.ajax({
            url:'/accounting/bms/transfer/del',
            type:'post',
            data:{data:JSON.stringify(data2)},
            dataType:'json',
            success:function(res) {
                $(".hovertable .delete#"+id).parents("tr").remove();
            }
        });
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
});


//搜索
function search(data,pageNum){
    $.ajax({
        url:'/accounting/bms/transfer/list',
        data:{data:JSON.stringify(data)},
        type:'post',
        dataType:'json',
        success:function(res){
            console.log(res);
            if(res.sc=="0"){
                totalPageNum=res.data.totalPages*1;
                var transferInfoList=res.data.result;
                var tbodyHtml="<tr><th>申请时间</th><th>充值/提现银行帐号|流水号</th><th>账户类型</th><th>充值金额(元)</th><th>提现金额(元)</th><th>申请人</th><th>状态</th><th>处理完成时间</th><th>备注</th><th>操作</th></tr>";
                for(var i=0;undefined!=transferInfoList && i<transferInfoList.length;i++){
                    var serialNumber,applicant,status,remark,operation,confirmTime,accountTType;//流水号,申请人,转账状态：0-商户申请，1-确认，2-拒绝申请 ,备注 ,状态描述,完成时间,账户类型
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
                $(".hovertable").html(tbodyHtml);

                //页数,
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




