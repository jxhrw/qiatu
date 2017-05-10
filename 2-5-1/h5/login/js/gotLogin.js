$(document).ready(function(){
    if(uaType()!="weixin"){
        $("#wxAttribute").hide();
    }
    $("#memberCenter").click(function(){
        if(GetParams().member_hotelid){
            window.location.href='/html/h5/member/index.html?member_hotelid='+GetParams().member_hotelid;
        }else {
            window.location.href='/html/h5/member/index.html';
        }
    });
});