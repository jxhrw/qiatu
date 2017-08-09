/*Created by qianyun Yang on 2016/12/16*/
$(document).ready(function () {
    var header = $(".total").height();//头部高度
    var footer=$("footer").height();//尾部高度
    var clientHeight = $(document).height()- header-footer;//计算评论区域的高度
    var clientWidth = window.innerWidth;//
    $(".wrap").css({"height": clientHeight, "width": clientWidth});//设置评论区域的尺寸
    if(sessionStorage){
        $(".wrap").css({"height": sessionStorage.getItem("height"), "width": clientWidth});//设置评论区域的尺寸
        console.log(sessionStorage.getItem("height"));
    }
    var data,
        getUrl=getRequest(window.location.search);//获取url中"?"符后的字串
    var productId=getUrl.productId,hotelId=getUrl.hotelId,
        title=getUrl.title;
    console.log(getUrl);
    $(".submit h3").html(title);
    var memberStatus;
    var memberFlag;
    $.ajax({
        url:"/user/h5/info",
        type : 'post',
        async:false,
        success : function(data){
            memberStatus=data.sc;
            if(data.sc==0){
                memberFlag=data.data.memberFlag;
            }
        }
    });
    console.log(memberStatus);
    console.log(memberFlag);
    if(productId){
        data={"productId":productId,"pagecnt":"10","pageno":1}
    }
    if(hotelId){
        data={"hotelId":hotelId,"pagecnt":"10","pageno":1}
    }
    getComments(memberStatus,memberFlag,data);
    var c= 1,paramPage;
    $(".wrap").scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(this)[0].scrollHeight;
       // var scrollTop = $(this).scrollTop();
      //  var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if ($(".scrollBot").html() == "－ 加载完毕 －") {
            return;
        } else {
            if (scrollTop + windowHeight == scrollHeight) {
                $(".scrollBot").html('<span></span>正在加载');
                c++;
                if(productId){//如果是产品id,则传递参数productId
                    paramPage={"productId":productId,"pagecnt":"10","pageno":c};
                }
                if(hotelId){//如果是酒店id,则传递参数hotelId
                    paramPage={"hotelId":hotelId,"pagecnt":"10","pageno":c};
                }
                getComments(memberStatus,memberFlag,paramPage);
            }
        }
    });
    $(".editTo").on("click", function () {//点击发表评论区域，显示文本编辑弹窗
        $(".subBtn").attr("title","");
        if(memberStatus==-1){
            authority();
        }else if(memberStatus==0){
            if(memberFlag==1){
                $(".submit")/*.show()*/.css("display","block").addClass("opened");
                $(".edit").prop("placeholder","键入你的评论");
                ifBack();
            }else {
                popup();
                $(".see").click(function () {
                    cancelPop();
                });
                $(".mask").click(function () {
                    cancelPop();
                })
            }
        }
    });
    $(".edit").bind('input propertychange',function () {//监听文本域内容的变化
        if($(this).val().length==0){
            $(".subBtn").prop("disabled","disabled").css("background","#ccc");
        }
        if($(this).val().length!=0){
            $(".subBtn").prop("disabled","").css("background","#000");
        }
        if($(this).val().length>349){//限制文本域字数在350字以内
            $(this).val($(this).val().substr(0,349));
        }
    });
    $(".subBtn").on("click", function () {
        var getId=$(this).attr("title"),
            cmData;
        if(getId!=""){
            var commentId=getNum(getId)[0];
            console.log(commentId);
            cmData={"commentId":commentId,"commentContent":$(".edit").val()};
            $.ajax({
                type: 'POST',
                async:false,
                url: '/user/h5/comment/add',
                data: {data:JSON.stringify(cmData)},
                dataType: 'json',
                success : function(add){
                    console.log(add);
                    $(".re").html("");
                    $(".cre").html(" ");
                    var replyList=add.data.replyList;
                    if(replyList){
                        console.log(replyList.length);
                        for(var j=0;j<replyList.length;j++){
                            var rNickname=replyList[j].nickname,
                                rTnickname=replyList[j].toNickname,
                                rContent=replyList[j].content,
                                rCommentId=replyList[j].id,
                                rFlag=replyList[j].selfFlag;
                            var reply='<div class="reply"><div class="info info2"><span>'+rNickname+'</span>回复<span>'+rTnickname+'</span></div> <p >'+rContent+'</p></div></div></div>';
                            if(/reply/i.test(getId)) {
                                $(".re").append(reply).find(".reply").eq(j).attr("id", "replyId" + rCommentId + "flag" + rFlag);
                            }else{
                                $(".cre").append(reply).find(".reply").eq(j).attr("id", "replyId" + rCommentId + "flag" + rFlag);
                            }
                        }
                    }
                    $(".replies").removeClass("re");
                    $(".replies").removeClass("cre");
                    $(".reply").on("click", function (e) {
                        //event.stopPropagation();
                        if (e && e.stopPropagation) {//非IE浏览器
                            e.stopPropagation();
                        }
                        else {//IE浏览器
                            window.event.cancelBubble = true;
                        }
                    });
                    $(".reply").click("on", function () {
                        $(".edit").val("");
                        $(".subBtn").prop("disabled","disabled").css("background","#ccc");
                        if(getNum($(this).attr("id"))[1]==0){
                            $(this).parents(".replies").addClass("re");
                            $(".submit")/*.show()*/.css("display","block").addClass("opened");
                            $(".edit").prop("placeholder","回复@"+$(this)/*.prev()*/.find("span").html());
                            $(".subBtn").prop("title",$(this).attr("id"));
                            ifBack();
                        }else {
                            $(".mask")/*.show()*/.css("display","block");
                            $(".menu")/*.show()*/.css("display","block");
                            $(".delete").prop("title",$(this).attr("id"));
                        }
                    });
                }
            });
            $(".submit").hide();
            $(".edit").val("");
        }else {
            cmData={"productId":productId,"commentContent":$(".edit").val()};
            $.ajax({
                type: 'POST',
                async:false,
                url: '/user/h5/comment/add',
                data: {data:JSON.stringify(cmData)},
                dataType: 'json',
                success : function(data){
                    console.log(data);
                    if(data.sc==0){
                        sessionStorage.setItem("height",$(".wrap").height());
                        window.location.reload();
                    }
                }
            });
        }
        $(this).attr("title","");
    });
    $(".delete").on("click", function () {
        var commentId=getNum($(this).attr("title"))[0];
        var delData={"commentId":commentId};
        var amount=$(".total span").html()-1;
        $.ajax({
            type: 'POST',
            async:false,
            url: '/user/h5/comment/del',
            data: {data:JSON.stringify(delData)},
            dataType: 'json',
            success : function(data){
                console.log(data);
                if(data.data){
                    $("#replyId"+commentId+"flag1")/*.parent()*/.remove();
                }else{
                    $("#"+commentId).remove();
                    $(".total span").html(amount);
                }
            }
        });
        $(".mask").hide();
        $(".menu").hide();
    });
    $(".cancel").on("click", function () {//点击关闭按钮，关闭文本编辑弹窗
        $(".mask").hide();
        $(".menu").hide();
    });
    $(".mask").on("click", function () {
        $(this).hide();
        $(".menu").hide();
    });
});

//获取url参数
function getRequest(param) {
    var theRequest = new Object();
    if (param.indexOf("?") != -1) {
        var str = param.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
//获取参数
function getNum(a){
   return a.match(/\d+/g);
}
//是否返回上一页面
function ifBack(){
    if($(".opened").css("display")=="block"){
        pushHistory();
        window.addEventListener("popstate", function(e) {
            $(".submit").hide().removeClass("opened").addClass("closed");
        }, false);
    }
}
/*
function noBack(){
    if($(".submit").css("display")=="none"){
        window.addEventListener("popstate", function(e) {
            window.history.go(-1);
        }, false);
    }
}
*/
function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}
//弹窗的复用方法
function popup(){
    $(".popup")/*.show()*/.css("display","block");
    $(".mask")/*.show()*/.css("display","block");
    $(".login").click(function () {
        window.location.href="/user/h5/qrcode?regsucc_tourl="+encodeURIComponent(window.location.href)});
}
function cancelPop(){
    $(".popup").hide();
    $(".mask").hide();
}
//评论权限
function authority(){
    popup();
    $(".see").click(function () {
        cancelPop();
    });
    $(".mask").click(function () {
        cancelPop();
    });
}
//获取评论列表
function getComments(memberStatus,memberFlag,param){
    $.ajax({
        type: 'POST',
        url: '/user/h5/comment/list',
        data: {data:JSON.stringify(param)},
        dataType: 'json',
        success : function(scroll){
            console.log(scroll);
            if(scroll.data.length<10){
                $(".scrollBot").html("－ 加载完毕 －");
            }
            $(".total span").html(scroll.pageinfo.recordAmount);
            if(scroll.pageinfo.recordAmount==0){
                $(".wrap").html('<div class="hasNone">暂时还没有评论</div>');
            }
            $.each(scroll.data,function(i){
                var headimgurl=scroll.data[i].headimgurl,
                    commentTimeDesc=scroll.data[i].commentTimeDesc,
                    nickname=scroll.data[i].nickname,
                    content=scroll.data[i].content,
                    commentId=scroll.data[i].id,
                    flag=scroll.data[i].selfFlag;
                var replyList=scroll.data[i].replyList;
                var reply;
                var replies;
                if(replyList){
                    var replyArr=[];
                    console.log(replyList.length);
                    for(var j=0;j<replyList.length;j++){
                        var rNickname=replyList[j].nickname,
                            rTnickname=replyList[j].toNickname,
                            rContent=replyList[j].content,
                            rCommentId=replyList[j].id,
                            rFlag=replyList[j].selfFlag;
                        reply='<div class="reply" id="'+"replyId"+rCommentId+"flag"+rFlag+'"><div class="info info2"><span>'+rNickname+'</span>回复<span>'+rTnickname+'</span></div> <p>'+rContent+'</p></div>';
                        replyArr.push(reply);
                    }
                    replies=replyArr.join().replace(/,/g,'')
                }else {
                    replies="";
                }
               // console.log(replies);
                // console.log(replyArr);
                var item='<div class="item" id="'+commentId+'"><div class="info"><img src="'+headimgurl+'"/><span>'+nickname+'</span><time>'+commentTimeDesc+'</time></div><div class="content"><p class="comment" id='+"id"+commentId+"flag"+flag+'>'+content+'</p><div class="replies">'+replies+'</div></div>';
                $(".items").append(item);
                /*$(".comment")*/$(".item").on("click", function () {
                    if(memberStatus==-1){
                        authority();
                    }else if(memberStatus==0) {
                        if (memberFlag == 1) {
                            $(".edit").val("");
                            $(".subBtn").prop("disabled","disabled").css("background","#ccc");
                            if (getNum($(this).find(".comment").attr("id"))[1] == 0) {
                                $(this).find(".comment").siblings(".replies").addClass("cre");
                                $(".submit")/*.show()*/.css("display","block").addClass("opened");
                                $(".edit").prop("placeholder", "回复@" + $(this)/*.parent().prev()*/.find("span").html());
                                $(".subBtn").prop("title", $(this).find(".comment").attr("id"));
                                ifBack();
                            } else {
                                $(".mask")/*.show()*/.css("display","block");
                                $(".menu")/*.show()*/.css("display","block");
                                $(".delete").prop("title", $(this).find(".comment").attr("id"));
                            }
                        }else {
                            popup();
                            $(".see").click(function () {
                                cancelPop();
                            });
                            $(".mask").click(function () {
                                cancelPop();
                            })
                        }
                    }
                });
            });
            $(".reply").on("click", function (e) {
                //event.stopPropagation();
                if (e && e.stopPropagation) {//非IE浏览器
                    e.stopPropagation();
                }
                else {//IE浏览器
                    window.event.cancelBubble = true;
                }
            });
            $(".reply").on("click", function () {
                if(memberStatus==-1){
                    authority();
                }else if(memberStatus==0){
                    if(memberFlag==1) {
                        $(".edit").val("");
                        if (getNum($(this).attr("id"))[1] == 0) {
                            $(this).parents(".replies").addClass("re");
                            $(".submit")/*.show()*/.css("display","block").addClass("opened");
                            $(".edit").prop("placeholder", "回复@" + $(this).find("span").html());
                            $(".subBtn").prop("title", $(this).attr("id"));
                            ifBack();
                        } else {
                            $(".mask")/*.show()*/.css("display","block");
                            $(".menu")/*.show()*/.css("display","block");
                            $(".delete").prop("title", $(this).attr("id"));
                        }
                    }else {
                        popup();
                        $(".see").click(function () {
                            cancelPop();
                        });
                        $(".mask").click(function () {
                            cancelPop();
                        })
                    }
                }
            });
        }
    });
}