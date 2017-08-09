$(document).ready(function(){
    var ajaxUrlAll={
        "projectList":"/coupon/bms/membership/projectList",//会员计划列表
        "delProject":"/coupon/bms/membership/delProject"  //删除会员计划 参数memberProjectId
    };
    var this_status;
    var this_memberProjectId;
    var this_name;
    var listData={"pageno":1,"pagecnt":5};
    $("#memberPg").on("click","tbody tr",function(){
        if($(".gou",this).attr("value")=="0"){
            this_name=$(this).find(".projectName").html();
            this_status=$(this).attr("value").split(",")[0];
            this_memberProjectId=$(this).attr("value").split(",")[1];
            $(this).siblings().find(".gou").attr("value","0").css("background",'url("../plug-in/public/images/gou-uncheck.png")');
            $(".gou",this).attr("value","1").css("background",'url("../plug-in/public/images/gou-check.png")');
            if(this_status=="1"){
                $("#delete").removeClass("unavailable");
            }else {
                $("#delete").addClass("unavailable");
            }
            $("#edit,#summery,#holder").removeClass("unavailable");
        }else {
            $(".gou",this).attr("value","0").css("background",'url("../plug-in/public/images/gou-uncheck.png")');
            $("#edit,#summery,#holder,#delete").addClass("unavailable");
        }
    });

    //新建
    $("#newPlan").click(function(){
        window.location.href="createCard.html";
    });
    //编辑、查看
    $("#edit").click(function(){

    });
    //删除
    $("#delete").click(function(){
        ajaxPost(ajaxUrlAll.delProject,data,deleteFunc,"");
    });
    function deleteFunc(res){
        listFunc(listData);
    }
    //报表
    $("#summery").click(function(){
        window.location.href="memberPgReport.html?memberProjectId="+this_memberProjectId+"&projectName="+this_name;
    });
    //持有人
    $("#holder").click(function(){
        window.location.href="holder.html?memberProjectId="+this_memberProjectId+"&projectName="+this_name;
    });

    listFunc(listData);
    //请求列表
    function listFunc(data){
        ajaxPost(ajaxUrlAll.projectList,data,projectListFunc,"");
    }
    //列表
    function projectListFunc(res){
        var tableHtml='';
        if(res.data && res.data.length>=1){
            $.each(res.data,function(i){
                var projectType=(res.data[i].projectType=="3")?"免费":"付费";
                var status=(res.data[i].status=="1")?"发布中":"已删除";
                tableHtml+='<tr value="'+res.data[i].status+','+res.data[i].projectId+'">' +
                    '<td><span class="gou" value="0"></span></td>' +
                    '<td class="projectName">'+res.data[i].projectName+'</td>' +
                    '<td>'+projectType+'</td>' +
                    '<td>'+status+'</td>' +
                    '<td>'+formatStrDate(res.data[i].createTime,"-")+'</td>' +
                    '</tr>'
            });
        }else {
            tableHtml='<tr><td class="noMessage" colspan="5">暂无信息</td></tr>';
        }
        $("#memberPg tbody").html(tableHtml);
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





































