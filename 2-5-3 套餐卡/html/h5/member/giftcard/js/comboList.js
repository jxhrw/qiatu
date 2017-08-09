var usageStatus;
$(document).ready(function(){
    var getParams=GetParams();
    var couponName = decodeURIComponent(getParams.name);
    var couponCode = getParams.code;
    var comboListData={couponCode:getParams.code};
    document.title = couponName;

    ajaxPost(ajaxUrlAll.comboInfo,comboListData,comboListFun);

    function comboListFun(res){
        if(res.data && res.data.subCouponList){
            usageStatus = res.data.usageStatus;
            if(res.data.usageStatus=="0" && res.data.couponBaseInfo && res.data.couponBaseInfo.gitTag=="1"){
                $(".defaultHide").show();
                $(".fixedPos").click(function(){
                    window.location.href = "comboGive.html?couponCodes="+couponCode;
                });
            }
            for (var i in res.data.subCouponList){
                var cardHtml='';
                var couponHtml='';
                if(res.data.subCouponList[i].couponType=="3" || res.data.subCouponList[i].couponType=="9"){
                    cardHtml=cardSingleFun(res.data.subCouponList[i]);
                    $("#comboCards").append(cardHtml);
                    colonPositionFunc($("#days").html());
                }
                else {
                    couponHtml=couponSingleFun(res.data.subCouponList[i]);
                    $("#comboCards").append(couponHtml);
                    colonPositionFunc($("#days").html());
                }
            }
        }
        if(!res.data.subCouponList || res.data.subCouponList.length<1){
            $(".content").html(hasBackground_min("无可用资产","50%")).find("p").css("color","#000");
        }
    }

    $("body").on("click",".cardsList li a",function(){
        var href = $(this).attr("href");
        if(usageStatus == "0"){
            comboActivate(couponName,href,couponCode);
            return false;
        }
    });
});
