$(document).ready(function(){
    var data={};
    $.post("/member/h5/info",{data:JSON.stringify(data)},function(resInfo){
        if(resInfo.sc==0){
            $(".personName").html(resInfo.data.realname);
            if(undefined==resInfo.data.idNumber){
                $(".cardID,.remind,.btnBox").show();
                $(".btnBox button").click(function(){
                    var numID=$(".cardID").val();
                    //var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{8}$)|()|(^\d{17}(\d|X|x)$)/;
                    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{8}$)|(^[a-zA-Z]\d{9}$)|(^\d{17}(\d|X|x)$)/;
                    if(reg.test(numID) === false){
                        $("#prompt").show().html("身份证号码有误");
                        setTimeout(function(){
                            $("#prompt").hide().html("");
                        },2000)
                    }else {
                        var dataID={"IDNumber":numID};
                        $.post("/member/h5/IDauth",{data:JSON.stringify(dataID)},function(res){
                            if(res.sc==0){
                                $(".cardID,.remind,.btnBox").hide();
                                $(".changeInfo,.phoneBtn").show();
                                $(".personID").html(howMachBit(numID,4));
                            }
                            else {
                                $("#prompt").show().html("请稍后再试");
                                setTimeout(function(){
                                    $("#prompt").hide().html("");
                                },2000)
                            }
                        });
                    }
                });
            }
            else {
                $(".changeInfo,.phoneBtn").show();
                $(".personID").html(howMachBit(resInfo.data.idNumber,4));
            }
        }
    });
});


function howMachBit(codeNum,num){
    var code=codeNum.toString().toUpperCase();
    var much=parseInt(num);
    return "**************"+code.substr(code.length-much,code.length);
}