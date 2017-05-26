var jsTime=0;//倒计时

//提出短信验证框
function setButton(phone,name){
    $("#setButton,.checkForget").click(function(){
        $("#digital").remove();
        $(".checkPsword").hide();
        $(".popupT,.setPsword").hide();
        timee();
        $("#owner").html(name);
        $("#phoneNum").html(phone.substr(0,3)+"****"+phone.substr(7,4));
        $(".popupT,.textPs").show();
        if($(this).attr("id")=="setButton"){
            goHttp=0;
        }else {
            goHttp=1;
        }
    });
}

//设置、忘记密码
function setForget(){
    $("#sure").click(function(){
        var verifycode=$(".SMSVer input").val();
        var url="/user/h5/checkverifycode";
        var data={verifycode:verifycode};
        $.post(h5orClient(url),{data:JSON.stringify(data)},function(resu){
            console.log(resu);
            var type;//类型，1-设置，2-忘记，3-修改，4-校验
            if(goHttp==0){
                type=1;
            }else if(goHttp==1){
                type=2;
            }
            if(resu.sc=="0"){
                window.location.href="/html/member/password.html?type="+type+"&verifycode="+verifycode;
            }else {
                $("#prompt").html("验证码错误").show();
                setTimeout(function(){
                    $("#prompt").hide();
                },2000);
            }
        });
    });
}

//倒计时
function timee(){
    if(jsTime==0){
        var data={'verifycodetype':2};
        $("#again").addClass("no");
        var url='/user/h5/getverifycode';
        $.post(h5orClient(url),{data:JSON.stringify(data)},function(resu){
            console.log(resu);
        });
        jsTime=60;
        var timeCon=setInterval(function(){
            jsTime--;
            $("#again").html(jsTime+"S");
            if(jsTime==0){
                $("#again").html("重新发送").removeClass("no");
                clearInterval(timeCon);
            }
        },1000)
    }
}

//有输入/待输入的地方有黑色边框
function inputFocus(id){
    $(id).find("td").css({"border-color":"#9b9b9b"});
    for(var i=0;i<$(id).find("td").length;i++){
        if($(id).find("td").eq(i).html()==""){
            $(id).find("td").eq(i).css({"border-color":"#000"});
            return;
        }else{
            $(id).find("td").eq(i).css({"border-color":"#000"});
        }
    }
}

//id输入的位置，class键盘放入的位置,num规定输入的个数，method输入位置的类型-table型是分隔的形式，password数字可见/不可见，class2确认按钮是否可点
function digitalInputMethod(id,_class,num,method,password,_class2){
    var table='<table id="digital" cellpadding="0" cellspacing="0" width="100%">'
        +'<tr>'
        +'<td>1</td><td>2</td><td>3</td>'
        +'</tr>'
        +'<tr>'
        +'<td>4</td><td>5</td><td>6</td>'
        +'</tr>'
        +'<tr>'
        +'<td>7</td><td>8</td><td>9</td>'
        +'</tr>'
        +'<tr>'
        +'<td style="background-color: #d2d5db;"></td><td>0</td><td id="delete"><em></em></td>'
        +'</tr>'
        +'</table>';
    $(_class).html(table);
    $("#delete").css({"background":"#d2d5db"}).find("em").css({"background":"url(/html/member/images/delete.jpg) no-repeat center/contain","display":"inline-block","width":"1.53rem","height":"1.13rem"});
    $("#digital").css({"text-align":"center","font-size":"1.4rem","table-layout":"fixed"}).find("td").css({"border-right":"1px solid #8c8c8c","border-bottom":"1px solid #8c8c8c","padding":"1rem 0","cursor":"pointer","-moz-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","-khtml-user-select":"none","user-select":"none"});
    $("#digital tr td:last-child").css({"border-right":"0"});
    $("#digital tr:last-child td").css({"border-bottom":"0"});
    $("#digital td").on('touchstart',function(){
        var thisId=$(this).attr("id");
        if("delete"!=thisId){
            inputMethod(this,id,num,method,password,_class2)
        }
        else {
            //删除
            if("table"==method){
                $(_class2).addClass("no");
                for(var j=$(id).find("td").length-1;j>=0;j--){
                    if($(id).find("td").eq(j).html()){
                        $(id).find("td").eq(j).html("").removeAttr("value");
                        inputFocus("#inputPassword");
                        return;
                    }
                }
            }
            else {
                var html=$(id).html();
                var valueNum=!$(id).attr("value")?"":$(id).attr("value");
                if(html.length<=1){
                    $(id).html("").removeAttr("value");
                }
                else {
                    html=html.substr(0,html.length-1);
                    valueNum=valueNum.substr(0,valueNum.length-1);
                    $(id).html(html).attr("value",valueNum);
                }
            }
        }
        inputFocus("#inputPassword");
    });
}

function inputMethod(_this,id,num,method,password,_class2){
    var i=$(_this).html();
    var point="<div class='star'>*</div>";
    if(""!=i){
        if("table"==method){
            for(var j=0;j<$(id).find("td").length && j<num;j++){
                if(!$(id).find("td").eq(j).html()){
                    if("password"==password){
                        $(id).find("td").eq(j).html(point).attr("value",i);
                    }else {
                        $(id).find("td").eq(j).html(i);
                    }
                    if(j==(num-1)){
                        passwordOver(_class2);
                    }
                    return;
                }
            }
        }
        else {
            var html=$(id).html();
            var valueNum=!$(id).attr("value")?"":$(id).attr("value");
            if(html.length<num || num==undefined){
                if("password"==password){
                    $(id).html(html+point).attr("value",valueNum+i);
                }else {
                    $(id).html(html+i);
                }
                if((html+i).length==num){
                    passwordOver(_class2);
                }
            }
        }
    }
}

//获得密码，id--id,method--table/div,password--password(类型是不可见)/''(可见)
function getPassword(id,method,password){
    var pass="";
    if("table"==method){
        if("password"==password){
            $(id).find("td").each(function(){
                pass+=!$(this).attr("value")?"":$(this).attr("value");
            });
        }else {
            $(id).find("td").each(function(){
                pass+=$(this).html();
            });
        }
    }else {
        if("password"==password){
            pass=!$(id).attr("value")?"":$(id).attr("value");
        }else {
            pass=$(id).html();
        }
    }
    return pass;
}

//输完后自动执行的函数
function passwordOver(_class2){
    $(_class2).removeClass("no");
}