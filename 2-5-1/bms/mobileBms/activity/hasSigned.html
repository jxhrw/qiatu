<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" name="viewport" id="viewport" />
    <meta name="format-detection" content="telephone=no">
    <meta http-equiv="cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <script src="http://7xio74.com2.z0.glb.qiniucdn.com/rem.js"></script>
    <link rel="stylesheet" type="text/css" href="http://7xio74.com1.z0.glb.clouddn.com/css/base.css?h7">
    <link rel="stylesheet" type="text/css" href="/html/mobileBms/activity/css/hasSigned.css">
    <script src="http://7xio74.com1.z0.glb.clouddn.com/jquery-2.1.4.min.js"></script>
    <script src="/html/member/js/general.js"></script>
    <script src="/html/mobileBms/activity/js/hasSigned.js"></script>
    <title>${actTitle}</title>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" ></script>
    <script type="text/javascript">
        $(document).ready(function() {

        });
        data = {'h5url':window.location.href};
        $.post("/weixin/h5/getjssignature",{data: JSON.stringify(data)},function(resp, status) {
            console.log(resp);
            if("0" == resp.sc){
                wx.config({
                    debug: false,
                    appId: resp.data.appid,
                    timestamp: resp.data.timestamp,
                    nonceStr: resp.data.noncestr,
                    signature: resp.data.signature,
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
                });
            }
        });

        wx.ready(function(){
            wx.onMenuShareAppMessage({
                title: '${shareTitle}',
                desc: '${shareDesc}',
                link: '${shareUrl}',
                imgUrl: '${shareImg}',
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                trigger: function (res) {

                },
                success: function (res) {
                    var share={type:0};
                    $.post('/act/h5/'+${actId}+'/user/sharecallback',{data:JSON.stringify(share)},function(rsl){
                        window.location.href = rsl.nexturl;
                    });
                },
                cancel: function (res) {

                },
                fail: function (res) {

                }
            });
            wx.onMenuShareTimeline({
                title: '${shareTitle}',
                link: '${shareUrl}',
                imgUrl: '${shareImg}',
                trigger: function (res) {

                },
                success: function (res) {
                    var share={type:1};
                    $.post('/act/h5/'+${actId}+'/user/sharecallback',{data:JSON.stringify(share)},function(rsl){
                        window.location.href = rsl.nexturl;
                    });
                },
                cancel: function (res) {

                },
                fail: function (res) {

                }
            });

        });

        wx.error(function(res){

        });
    </script>
</head>
<body>
<div class="screenBox">
    <div class="screen">
        <div class="shareArrow"></div>
        <div class="signSusTips">
            <img src="http://7xio74.com1.z0.glb.clouddn.com/success.png" alt="">
            <p class="signTitle1">您已提交报名信息 <br>最后一步： 「分享到朋友圈」</p>
            <p class="signTitle2">点击右上角，选择「分享到朋友圈」即报名成功获得抽奖码</p>
        </div>
        <img class="shareImg" src="http://7xio74.com1.z0.glb.clouddn.com/friends.png" alt="">
        <div class="twoLine"></div>
    </div>
    <img class="jiHe" src="http://7xio74.com1.z0.glb.clouddn.com/JiHe.png" alt="">
</div>

<!--统计代码-->
<div style="display:none">
    <script src="http://s11.cnzz.com/z_stat.php?id=1253954519&web_id=1253954519" language="JavaScript"></script>
</div>
</body>
</html>