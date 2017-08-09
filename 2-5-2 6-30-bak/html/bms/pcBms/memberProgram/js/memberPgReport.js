$(document).ready(function(){
    var ajaxUrlAll={
        "summeryInfo":"/pay/bms/coupon/summeryInfo"  //会员计划报表接口 参数  memberProjectId
    };
    var getParams=GetParams();
    var listData={"pageno":1,"pagecnt":5,"memberProjectId":getParams.memberProjectId};
    $(".thisPgTitle").html(decodeURIComponent(getParams.projectName)+"报表");
    listFunc(listData);
    function listFunc(data){
        ajaxPost(ajaxUrlAll.summeryInfo,data,summeryInfoFunc,"")
    }
    function summeryInfoFunc(res){
        var tableHtml='';
        if(res.data && res.data.length>=1){
            $.each(res.data,function(i){
                var couponName=res.data[i].couponName?res.data[i].couponName:"";
                var publishCount=res.data[i].publishCount?res.data[i].publishCount:0;
                var circulatingCount=res.data[i].circulatingCount?res.data[i].circulatingCount:0;
                var overdueCount=res.data[i].overdueCount?res.data[i].overdueCount:0;
                var rechargeAmount=res.data[i].rechargeAmount?res.data[i].rechargeAmount:0;
                var presentAmount=res.data[i].presentAmount?res.data[i].presentAmount:0;
                var checkoffAmount=res.data[i].checkoffAmount?res.data[i].checkoffAmount:0;
                var circulatingAmount=res.data[i].circulatingAmount?res.data[i].circulatingAmount:0;
                tableHtml+='<tr>' +
                    '<td>'+couponName+'</td>' +
                    '<td>'+publishCount+'</td>' +
                    '<td>'+circulatingCount+'</td>' +
                    '<td>'+overdueCount+'</td>' +
                    '<td>'+rechargeAmount/100+'</td>' +
                    '<td>'+presentAmount/100+'</td>' +
                    '<td>'+checkoffAmount/100+'</td>' +
                    '<td>'+circulatingAmount/100+'</td>' +
                    '</tr>'
            });
        }else {
            tableHtml='<tr><td class="noMessage" colspan="8">暂无信息</td></tr>';
        }
        $("#memberPgReport tbody").html(tableHtml);
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