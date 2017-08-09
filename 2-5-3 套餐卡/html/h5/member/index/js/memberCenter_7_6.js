var memberStatus;
$(document).ready(function() {
    $(".mask").click(function () {
        $(".modal,.receiveBox").hide();
    });
    $(".close").click(function () {
        $(".modal,.receiveBox").hide();
    });
    $(".booking").click(function () {//民宿预订
        window.location.href= "../product/list/list1.html";
    });
    $(".marketing").click(function () {//消费金市场
        window.location.href= "../market/store.html";
    });
    $(".cashAccount").click(function () {//现金账户
        window.location.href= "account/cashAccount.html";
    });
    $(".shareAssets").click(function () {//众享计划
        $.post("/order/h5/getbankurl",function(res){
            if(res.sc=="0"){
                window.location.href=res.data.jumpurl;
            }
        });
    });
    $(".myCoupon").click(function () {//我的礼券
        window.location.href="giftcard/memberships.html";
    });
    $(".orderList").click(function () {//我的订单
        window.location.href="../order/myOrderList.html?member_hotelid=";
    });
    $(".exchange").click(function () {//积分兑换
        window.location.href="../member/exchange.html?member_hotelid=";
    });
    $(".integralMall").click(function () {//积分商城
        window.location.href="../product/list/integralMall.html?tags=%E7%A7%AF%E5%88%86%E5%95%86%E5%9F%8E&assetType=3&priceType=1";
    });
    $(".earnPoints").click(function () {//赚取积分
        window.location.href="other/earnPointsNoteWei.html";
    });
    $(".trends").click(function () {//积分动态
        window.location.href="other/consumingRecords.html?member_hotelid=";
    });
    $(".vip").click(function () {//会员礼遇
        window.location.href="other/memberVIP.html?member_hotelid=";
    });
    $(".myInfo").click(function () {//个人信息
        window.location.href="personinfo/myInfo.html?member_hotelid=";
    });
    $(".faq").click(function () {//常见问题
        window.location.href="other/FAQ.html?member_hotelid=";
    });

  /*  $(".items a").each(
        function (index) {
            var background='url(./images/'+index+'.jpg) no-repeat center top/60%';
            $(this).css("background",background);
        }
    );*/
    ifLogin();
    $.post('/member/h5/info', function(data) {
        console.log(data);
        if(data.sc==0){
            var grade=data.data.memberGrade;
            // var url='../images/'+data.data.
           // $(".information").css("background","url(url)");
            var backGroundImg=data.data.equityInfo.backGroundImg.split(".png")[0]+"2.png";
            var backGround='url("http://7xio74.com1.z0.glb.clouddn.com/cardImg/'+backGroundImg+'") no-repeat center top/100% 100%';
            $(".information").css("background",backGround);
            $(".points span").html(data.data.points);
            $(".annual span").html(data.data.nightsCurYear);
            $(".grade span").html(data.data.memberGradeDesc);
            $(".upGrade").html(data.data.upgradeCondition);
            if(grade==2){
                $(".info_left").css("color","#fff");
                $(".info_right li").css("color","#909091");
                $(".info_right li span").css("color","#fff");
                $(".tradesBtn").css("background","#454955");
                //$(".upGrade").css("display","none");
            }else if(grade==1){
                $(".info_left").css("color","#4a4a4a");
                $(".info_right li").css("color","#919296");
                $(".info_right li span").css("color","#4a4a4a");
                $(".tradesBtn").css("background","#454955");
                //$(".upGrade").css("background","#4a4a4a");
            }else{
                $(".info_left").css("color","#000");
                $(".info_right li span").css("color","#000");
                //$(".upGrade").css("background","#BB8E4B");
            }

            if(data.data.jiheTime){
                if(data.data.jiheTime.couponCode){
                    $(".timeJH a").attr("href",'./giftcard/cardOrCoupons.html?couponCode=' + data.data.jiheTime.couponCode);
                }
                if(data.data.jiheTime.rechargeUrl){
                    $(".timeJH a").attr("href",data.data.jiheTime.rechargeUrl);
                }
            }
            $.post('/user/h5/info', function(userData) {
                console.log(userData);
                if(userData.sc==0){
                    var ua = window.navigator.userAgent.toLowerCase();
                    if(userData.data.subcribeJiheStatus!=1 && ua.match(/MicroMessenger/i) == "micromessenger"){
                        $(".modal").show();
                    }else {
                        $(".modal").hide();
                    }
                    $(".avatar").prop("src",userData.data.headimgurl);//头像
                    $(".userName").html(userData.data.realname);//用户名
                    $(".memberCode").html(userData.data.memberCode);//会员号
                    var couponDate={mobile:userData.data.mobileAccount.accountName};
                    $.post('/coupon/h5/member/undelivered',{data:JSON.stringify(couponDate)},function(res){
                        if(res.sc==0){
                            var liHtml="";
                            $("#cusName").html(data.data.realname);
                            $(".recExplain").html(res.desc);
                            for(var i=0;undefined!=res.assetsList && i<res.assetsList.length;i++){
                                liHtml+='<li>'+res.assetsList[i].assetsName+'</li>';
                            }
                            if(undefined!=res.assetsList && 0<res.assetsList.length){
                                $(".rights").html(liHtml);
                                $(".goReceive").attr("href","personinfo/memRights.html?name="+data.data.realname);
                                $(".modal").hide();
                                $(".receiveBox").show();
                            }
                        }
                    });
                }else{
                    window.location.href="/user/h5/mbcenter";
                }
            });
        }
    });

});

//获取url的参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]);
    return null;
}
//判断是否登录
function ifLogin(){
    /*$.ajax({
        url:"/user/h5/info",
        type : 'post',
        async:false,
        success : function(data){
            console.log(data);
            memberStatus=data.sc;
            if(memberStatus==0){
                memberFlag=data.data.memberFlag;
                console.log(memberFlag);
            }
            console.log(memberStatus);
        }
    });*/
}
