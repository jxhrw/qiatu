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
    <link rel="stylesheet" type="text/css" href="/html/mobileBms/activity/css/lotteryCode.css">
    <script src="http://7xio74.com1.z0.glb.clouddn.com/jquery-2.1.4.min.js"></script>
    <script src="/html/member/js/general.js"></script>
    <script src="/html/mobileBms/activity/js/lotteryCode.js"></script>
    <title>${activityTitle}</title>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" ></script>
    <script type="text/javascript">
        $(document).ready(function() {
            (function(){
                activity.init({actid:${actId}});
            })(jQuery);
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
                    $.post('/act/h5/'+${actId}+'/user/sharecallback',{data:JSON.stringify(share)},function(rsl){});
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
                    $.post('/act/h5/'+${actId}+'/user/sharecallback',{data:JSON.stringify(share)},function(rsl){});
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
<body style="background-color:${viewpageBackgroundColor}">
    <div class="screenBox">
        <div class="bannerBgp" style="background-image: url('${actImg}')"></div>
        <div style="height: 1rem;"></div>
        <div class="signBox">
            <p class="activityName">${actTitle}</p>
            <p class="participants">当前已有 <span id="enrollment">${usersCount}</span> 人报名参与</p>
            <div class="winningInfo">
                <#if actStatus=="5">
                    <#if isWinner=="1">
                        <p class="winState">恭喜中奖！</p>
                        <#list prizenameList as prize>
                            <p class="prizes">
                                <#list prize.luckyCodeList as luckyCode>
                                    ${luckyCode.prizeName} ×${luckyCode.number} <br/>
                                </#list>
                            </p>
                            <#if awardWay=="0">
                                <#if prize.isPrimaryOwner=="1">
                                    <#if actType==2>
                                        <p class="brought">和配对人<br>「<span>${prize.inviteenickname}</span>」<br>共享该奖品</p>
                                    </#if>
                                    <a href="http://api.jihelife.com/user/h5/qrcode?regsucc_tourl=http%3A%2F%2Fapi.jihelife.com%2Fhtml%2Fjh-giftcard%2Fbuild%2Findex.html" class="submit">查看奖品</a>
                                    <#else>
                                        <p class="brought">邀请你参加配对的<br>「<span>${prize.nickname}</span>」<br>已领取了你们共享的奖品</p>
                                </#if>
                            </#if>
                        </#list>
                        <#if awardWay=="1">
                            <a href="tel:${contactWay}" class="submit">联系商户领奖</a>
                        </#if>
                        <#else>
                            <p class="winState">很遗憾，你没有中奖</p>
                    </#if>
                    <a id="winResults" class="resultsHref">查看开奖结果 <span class="rightArrow"></span></a>
                    <#else>
                        <p class="winState">等待开奖</p>
                        <p class="winOpen">开奖时间：&nbsp;&nbsp; <span class="noSecond">${actPubtime?string("yyyy-MM-dd HH:mm")}</span></p>
                </#if>
            </div>
            <div class="activeState">
                <#if actType=="2">
                    <p class="states" id="myCodes">配对成功的抽奖码</p>
                    <#else>
                        <p class="states" id="myCodes">我的抽奖码</p>
                </#if>
                <div class="redLine"></div>
                <div class="codeBox">
                    <ul class="codeUl">
                        <#list codeList as code>
                            <li>
                                <#if actType=="2">
                                    <div class="myCode">${code.codeNum}
                                        <#if code.isLuckycode==1><span class="wined">中奖啦</span></#if>
                                        <img class="partner" src="${code.friendHeadimg}" alt="">
                                    </div>
                                    <div class="codeTime">${code.createTime?string("yyyy-MM-dd HH:mm:ss")} <span class="fr">${code.friendName}</span></div>
                                    <#else>
                                        <div class="myCode">${code.codeNum}<#if code.isLuckycode==1><span class="wined">中奖啦</span></#if></div>
                                        <div class="codeTime">${code.createTime?string("yyyy-MM-dd HH:mm:ss")} <span class="fr">${code.tips}</span></div>
                                </#if>
                            </li>
                        </#list>
                    </ul>
                    <p id="moreCode" class="moreCode">查看全部<span id="codeNum"></span>个抽奖码 <span class="rightArrow upArrow"></span></p>
                    <#if actType=="3">
                        <button class="submit submit3">查看获赠积分</button>
                        <#else>
                            <button id="shareFri" class="submit submit2">邀好友拿更多抽奖码</button>
                    </#if>
                </div>
            </div>
            <div class="activeState">
                <p class="states">报名信息</p>
                <div class="redLine"></div>
                <div class="registration">
                    <img class="myHead" src="${userIcon}" alt="">
                    <p class="nickname">${nickname}</p>
                    <p class="myPhone">${phone}</p>
                    <#if actStatus!=5>
                        <button class="changeBtn">修改手机号码</button>
                    </#if>
                </div>
            </div>
            <div class="activeState">
                <p class="states">活动说明</p>
                <div class="redLine"></div>
                <div class="description">
                    ${actRules}
                    <!--1.点击上方「邀好友拿更多抽奖码」，每成功邀请1位好友，即多奖励1个抽奖码；
                    <br>2.本活动报名截止时间03月02日12:00，即日20:00公布中奖名单，敬请关注「几何民宿」公众号。-->
                </div>
            </div>
        </div>
        <img class="jiHe" src="http://7xio74.com1.z0.glb.clouddn.com/JiHe.png" alt="">
    </div>

    <!--弹出 start-->
    <div class="screenFull" id="shareFriend">
        <div class="shadow"></div>
        <div class="shareTips">
            <div class="whiteTriangle"></div>
            <p class="question">想要更多抽奖码？</p>
            <p class="answer">点击右上角，选择「发送给好友」或「分享到朋友圈」邀请好友，好友点击文章内报名入口，并按要求完成报名，即可额外获得「一个抽奖码」，数量没有上限</p>
            <img src="http://7xio74.com1.z0.glb.clouddn.com/friends2.png" alt="" class="friendImg">
            <div class="close"></div>
        </div>
    </div>

    <div class="screenFull" id="winningList">
        <div class="shadow"></div>
        <div class="shareTips shareTips2">
            <div class="overHidden">
                <p class="activityName">${actTitle}</p>
                <div class="activeState">
                    <p class="states">开奖结果</p>
                    <div class="redLine"></div>
                    <ul class="winnerUl">

                    </ul>
                </div>
            </div>
            <div class="gradient"></div><!--渐变色-->
            <div class="close"></div>
        </div>
    </div>

    <div class="screenFull" id="modifyPhone">
        <div class="shadow"></div>
        <div class="shareTips shareTips3">
            <div class="activeState2">
                <p class="states">修改手机号码</p>
                <div class="redLine"></div>
                <div class="changeNumberBox">
                    <p class="inputNewPhone">请输入新的手机号</p>
                    <input id="newPhone" class="newPhone" type="tel" maxlength="11">
                </div>
                <button id="changeSubmit" class="submit submit2 submit4 cannotSub">确认修改</button>
            </div>
            <div class="close2"></div>
        </div>
    </div>
    <!--弹出 end-->
<!--统计代码-->
<div style="display:none">
    <script src="http://s11.cnzz.com/z_stat.php?id=1253954519&web_id=1253954519" language="JavaScript"></script>
</div>
</body>
</html>