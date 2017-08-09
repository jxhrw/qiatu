$(document).ready(function(){
    var ajaxUrlAll={
        "memberList":"/member/bms/project/list"  //会员列表
    };
    var listData={"pageno":1,"pagecnt":6};

    listFunc(listData);
    function listFunc(data){
        ajaxPost(ajaxUrlAll.memberList,data,memberListFunc,"")
    }
    function memberListFunc(res){
        var tableHtml='';
        if(res.data && res.data.length>=1){
            $.each(res.data,function(i){
                var memberName=res.data[i].memberName?res.data[i].memberName:"";
                var mobile=res.data[i].mobile?res.data[i].mobile:"";
                var province=res.data[i].province?res.data[i].province:"";
                var city=res.data[i].city?res.data[i].city:"";
                var memberType=res.data[i].memberType?res.data[i].memberType:"";//会员类型：1.付费 2.免费 3.股东
                var memberText;
                var registerTime=res.data[i].registerTime?formatStrDate(res.data[i].registerTime,"-"):"";
                var ownerChannel=res.data[i].ownerChannel?res.data[i].ownerChannel:"";
                var idnumber=res.data[i].idnumber?res.data[i].idnumber:"";
                var birthday="";
                var sex="";
                switch (parseInt(memberType)){
                    case 1:
                        memberText="付费";
                        break;
                    case 3:
                        memberText="股东";
                        break;
                    default:
                        memberText="免费";
                }
                switch (idnumber.length){
                    case 15:
                        birthday=idnumber.substring(8,10)+"-"+idnumber.substring(10,12);
                        sex=res.data[i].sex?res.data[i].sex:((idnumber.substring(14,15)%2=="1")?"男":"女");
                        break;
                    case 18:
                        birthday=idnumber.substring(10,12)+"-"+idnumber.substring(12,14);
                        sex=res.data[i].sex?res.data[i].sex:((idnumber.substring(16,17)%2=="1")?"男":"女");
                        break;
                    default:
                        sex=res.data[i].sex?res.data[i].sex:"";
                }
                tableHtml+='<tr>' +
                    '<td>'+ memberName +'</td>' +
                    '<td>'+ mobile +'</td>' +
                    '<td>'+ province +'</td>' +
                    '<td>'+ city +'</td>' +
                    '<td>'+ memberText +'</td>' +
                    '<td>'+ registerTime +'</td>' +
                    '<td>'+ ownerChannel +'</td>' +
                    '<td>'+ idnumber +'</td>' +
                    '<td>'+ birthday +'</td>'+
                    '<td>'+ sex +'</td>'+
                    '</tr>'
            });
        }else {
            tableHtml='<tr><td class="noMessage" colspan="10">暂无信息</td></tr>';
        }

        $("#management tbody").html(tableHtml);
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
