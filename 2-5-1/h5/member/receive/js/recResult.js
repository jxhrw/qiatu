$(document).ready(function(){
    externalorder();
});


function externalorder(){
    //参数：mobile,verifycode
    var data={mobile:GetParams().tel,verifycode:GetParams().code};
    $.post("/coupon/h5/externalorder/list",{data:JSON.stringify(data)},function(res){
        if(res.sc==0){
            var hasCard="";
            for(var i=0;undefined!=res.data && i<res.data.length;i++){
                for(var j=0;undefined!=res.data[i].productList && j<res.data[i].productList.length;j++){
                    if(undefined!=res.data[i].productList[j].receiver){
                        hasCard+=' <div class="hasCard"><p class="hasCardTitle">'+ res.data[i].productList[j].productName +'</p><p class="hasCardTxt">已绑定至：'+ res.data[i].productList[j].receiver +'</p></div>';
                    }
                }
            }
            $(".checkBox").html(hasCard);
        }
        else{
            $("#prompt").show().html("请重试");
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000);
        }
    });
}