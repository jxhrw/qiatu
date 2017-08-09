$(document).ready(function() {
//手机号
 //获取焦点
$(".resetPhone1").focus(function (event) {
	if ($(".resetPhone").val() == "请输入手机号码") {
    	$(".resetPhone").val("");
        $(this).val("").css({"color": "#000","font-size":"1.2rem"});
        $("#resetPhoneBtn").removeAttr("disabled"); 
    }
});
 //失去焦点
$(".resetPhone1").blur(function (event) {
    if ($(this).val() == "") {
          //alert("aab1")
       $(".resetPhone").val("请输入手机号码").css({"color":"#d0d0d0","font-size":"1rem"});
       $(this).val("").css({"color": "#000","font-size":"1.2rem"});
       $("#resetPhoneBtn").attr("disabled", true);
   		return;
	}
    if (!$(".resetPhone1").val().match(/^[1][3,4,5,7,8][0-9]{9}$/)) {
        $(".resetPhone").val("请输入手机号码").css({"color":"#d0d0d0","font-size":"1rem"});
        $(this).val("").css({"color": "#000","font-size":"1.2rem"});
        $("#resetPhoneBtn").attr("disabled", true);
        return; 
    }
});
if($(".resetPhone1").val()==""){
    $("#resetPhoneBtn").attr("disabled", true);
}
//获取焦点
$(".resetPhoneNum1").focus(function (event) {
    if ($(".resetPhoneNum").val() == "请输入短信验证码") {
        $(".resetPhoneNum").val("");
        $(this).val("").css({"color": "#000","font-size":"1.2rem"});
    }
});
  //失去焦点
$(".resetPhoneNum1").blur(function (event) {
    if ($(this).val() == "") {
         // alert("aab1")
       $(".resetPhoneNum").val("请输入短信验证码").css({"color":"#d0d0d0","font-size":"1rem"});
       $(this).val("").css({"color": "#000","font-size":"1.2rem"});
        return;
    }

});
//倒计时
var wait=59;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");  
        o.value="发送验证码";
        wait = 59;
        $("#resetPhoneBtn").css({"background-color":"#d13f4c"})
        // document.getElementById("submitBtn").setAttribute("disabled", true);
        $("#submitBtn").attr("disabled", true);
    } else {
        o.setAttribute("disabled", true);
        o.value=wait+"s";
        wait--;
        $("#resetPhoneBtn").css({"background-color":"#c8cacc"})
        $("#submitBtn").removeAttr("disabled");
        setTimeout(function() {
            time(o)
        },1000)
    }
} 
//获取验证码
$("#resetPhoneBtn").click(function(event) {
    if($(".resetPhone1").val()==""){
        return;
    }
    else{
        // alert($(".phone1").val())
     var data={"accountname":$(".resetPhone1").val(),"verifycodetype":"1"}
     console.log(JSON.stringify(data));
    $.post('/user/h5/getverifycode', {data: JSON.stringify(data)}, function(data) {
        console.log(data)
        if(data.sc=="0"){
            time(document.getElementById("resetPhoneBtn"));
            $(".tip").css('display', 'block');
            setTimeout(function() {
               $(".tip").css('display', 'none');
            },2000)
        }
    })   
    }
    
});
//提交手机和验证码
$("#submitBtn").click(function(event) {
    var data={"accountname":$(".resetPhone1").val(),"verifycode":$(".resetPhoneNum1").val()}
    console.log(data)
   $.post(' /user/h5/modifymobile', {data: JSON.stringify(data)}, function(data) {
        console.log(data)
        if(data.sc=="-99999"){
            alert("系统繁忙")
        }
        else if(data.sc=="-1"){
            alert("系统繁忙")
        }
        else if (data.sc=="0") {
            
                window.location="myInfo.html?member_hotelid="
        }
        else{
            alert(data.ErrorMsg)
        }
    })   
});


});