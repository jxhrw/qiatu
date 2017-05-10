$(document).ready(function(){
    //商户信息
    if(GetParams().member_hotelid && GetParams().member_hotelid!=''){
        $.ajax({
            type:'POST',
            url:'/content/inter/merchant/detail',
            data:{data:JSON.stringify({id:GetParams().member_hotelid})},
            dataType: 'json',
            async: false,
            success: function (res) {
                if(res.sc=="0"){
                    //jiheBusinessMember 0-非会员商户，1-1.0商户，2-2.0商户
                    if(res.data.jiheBusinessMember=="2"){
                        $("#merchant").html(res.data.groupName);
                        $("#hotelName").html(res.data.groupName);
                        $("#hotelImg").attr("src",res.data.brandIcon);
                        document.title=res.data.groupName;
                    }else {
                        $(".prompting").hide();
                        document.title="几何生活";
                    }
                }else {
                    document.title="几何生活";
                }
            }
        });
    }else {
        document.title="几何生活";
    }
});