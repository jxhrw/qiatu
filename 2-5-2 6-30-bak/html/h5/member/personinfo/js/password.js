$(document).ready(function(){
    document.title="设置交易密码";
    var type=GetParams().type;//类型，1-设置，2-忘记，3-修改，4-校验
    var psWord1,psWord2,psWord3;  //修改密码最多填3次
    sessionStorage.setItem("tradeToken","");
    var mark=0;//记号，0不在输入状态 1输入状态

    if(type==1 || type==2){
        $(".button").attr("id","set").html("下一步");
    }
    if(type==3){
        $("#titlePassword").html("请输入原密码");
        $(".button").attr("id","change").html("确 &nbsp;&nbsp; 认");
    }

    if(mark==0){
        inputFocus("#inputPassword");
        digitalInputMethod("#inputPassword",".keyboard","6","table","password",".button");
        mark=1;
    }else if($(this).index()==0){
        $("#digital").remove();
        $(this).css({"border-color":"#9b9b9b"});
        mark=0;
    }


    $("#inputPassword td").click(function(){
        if(mark==0){
            inputFocus("#inputPassword");
            digitalInputMethod("#inputPassword",".keyboard","6","table","password",".button");
            mark=1;
        }else if($(this).index()==0){
            $("#digital").remove();
            $(this).css({"border-color":"#9b9b9b"});
            mark=0;
        }
    });

    $(".null").height($(window).height()).click(function(){
        mark=0;
        $("#digital").remove();
        $("#inputPassword td").css({"border-color":"#9b9b9b"}).each(function(){
            if($(this).html()!="") {
                $(this).css({"border-color": "#000"});
            }
        });
    });

    //确认设置

    //设置/忘记密码第一步（下一步）
    setPassword();

    //修改密码第一次
    $("#change").on('click',function(){
        if($(this).attr("id")=="change"){
            psWord3=getPassword("#inputPassword","table","password");
            var data={'tradepasswd':psWord3};
            var url='/user/h5/checktradepasswd';
            $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
                if(res.sc==0){
                    $("#titlePassword").html("请设置交易密码");
                    $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
                    $(".button").addClass("no").attr("id","set").html("下 一 步");
                    setPassword();
                }else {
                    $("#prompt").html("密码不正确").show();
                    setTimeout(function(){
                        $("#prompt").hide();
                    },2000);
                }
            });
        }
    });





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


    //不通用
    //输完后自动执行的函数
    function passwordOver(_class2){
        $(_class2).removeClass("no").click();
    }


    function setPassword(){
        $("#set").on('click',function(){
            if($(this).attr("id")=="set"){
                psWord1=getPassword("#inputPassword","table","password");
                $("#titlePassword").html("请确认交易密码");
                $(this).html("确 &nbsp;&nbsp; 认");
                $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
                $(".button").addClass("no").attr("id","sure").on('click',function(){
                    if($(this).attr("id")=="sure"){
                        psWord2=getPassword("#inputPassword","table","password");
                        if(psWord1!=psWord2){
                            $("#prompt").html("两次输入密码不一致").show();
                            setTimeout(function(){
                                $("#prompt").hide();
                            },2000);
                        }else{
                            var url;
                            if(type==1 || type==2){
                                var data={'tradepasswd':psWord2,'verifycode':GetParams().verifycode};
                                url='/user/h5/settradepasswd';
                                $.post(h5orClient(url),{data:JSON.stringify(data)},function(res){
                                    console.log(res);
                                    if(res.sc==0){
                                        sessionStorage.setItem("tradeToken",res.data.tradeToken);
                                        window.history.go(-1);
                                    }
                                })
                            }
                            if(type==3){
                                var data3={'tradepasswd':psWord2,'oldtradepasswd':psWord3};
                                url='/user/h5/modifytradepasswd';
                                $.post(h5orClient(url),{data:JSON.stringify(data3)},function(res){
                                    console.log(res);
                                    if(res.sc==0){
                                        window.history.go(-1);
                                    }
                                })
                            }
                        }
                    }
                });
            }
            //console.log();

        });
    }

});