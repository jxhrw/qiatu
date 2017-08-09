$(document).ready(function(){
    var getParams = GetParams();
    var group_name = decodeURIComponent(getParams.group_name);
    var brandIcon = decodeURIComponent(getParams.brandIcon);
    var mbmatch;
    if(uaType()!="weixin"){
        $("#wxAttribute").hide();
    }
    if(group_name=="几何"){
        $(".prompting").hide();
    }else {
        document.title = group_name;
        $("#hotelName").html(group_name);
        $("#hotelImg").attr("src",brandIcon);

    }
    $("#memberCenter").click(function(){
        if(getParams.member_hotelid){
            window.location.href='/user/h5/mbcenter?member_hotelid='+getParams.member_hotelid;
        }else {
            window.location.href='/user/h5/mbcenter';
        }
    });
});