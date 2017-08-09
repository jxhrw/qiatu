$(document).ready(function(){
    var ajaxUrlAll={
        "holderInfo":"/pay/bms/coupon/holderInfo"  //会员计划持有人 参数 memberProjectId
    };
    var getParams=GetParams();
    var listData={"pageno":1,"pagecnt":5,"memberProjectId":getParams.memberProjectId};
    $(".thisPgTitle").html(decodeURIComponent(getParams.projectName)+"持有人");
    listFunc(listData);
    function listFunc(data){
        ajaxPost(ajaxUrlAll.holderInfo,data,holderInfoFunc,"")
    }
    function holderInfoFunc(res){
        var tableHtml='';
        if(res.data && res.data.length>=1){
            $.each(res.data,function(i){
                var username=res.data[i].username?res.data[i].username:"";
                var mobile=res.data[i].mobile?res.data[i].mobile:"";
                var couponName=res.data[i].couponName?res.data[i].couponName:"";
                var discount=res.data[i].discount?(res.data[i].discount/10+'折'):"";
                var recharge=res.data[i].recharge?res.data[i].recharge:0;
                var present=res.data[i].present?res.data[i].present:0;
                var remain=res.data[i].remain?res.data[i].remain:0;
                var checkoffAmount=res.data[i].checkoffAmount?res.data[i].checkoffAmount:0;
                var userType=res.data[i].userType?((res.data[i].userType=="1")?"原始持有人":"受让人"):"";
                tableHtml+='<tr>' +
                    '<td>'+ username +'</td>' +
                    '<td>'+ mobile +'</td>' +
                    '<td>'+ couponName +'</td>' +
                    '<td>'+ discount +'</td>' +
                    '<td>'+ recharge/100 +'</td>' +
                    '<td>'+ present/100 +'</td>' +
                    '<td>'+ remain/100 +'</td>' +
                    '<td>'+ checkoffAmount/100 +'</td>' +
                    '<td>'+ userType +'</td>'+
                    '</tr>'
            });
        }else {
            tableHtml='<tr><td class="noMessage" colspan="9">暂无信息</td></tr>';
        }

        $("#holder tbody").html(tableHtml);
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