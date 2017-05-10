
// KISSY.ready(function(S){
    if(title=="无此参数"){
        KISSY.use('node',function(S,Node){
            Node.one('#btn').html('登录');
        });
        KISSY.use('node',function(S,Node){
            Node.one('#btn').on('click',function(e){
                var businessAccount=Node.one(".businessAccount").val()
                var businessPassword=Node.one(".businessPassword").val()
                if(businessAccount!=""&&businessPassword!=""){
                var url="/bms/h5/business/login.json"
                var dataLogin={"businessAccount":businessAccount,"businessPassword":businessPassword}
                KISSY.use('io,node',function(S,io,Node){
                     io({
                        type: 'post',
                        url:url,
                        data:{
                            data:JSON.stringify(dataLogin)
                        },
                        success:function(result){
                    
                            console.log(JSON.stringify(dataLogin))


                            if(result.sc=="0"){
                                window.location="/html/bms/mobileBms/index.html"
                            }
                            else if(result.sc=="BMS-2003"){
                                Node.one(".tip").html("请重新登录").css('display', 'block');
                                setTimeout(function() {
                                    Node.one(".tip").css('display', 'none');
                                },2000)
                            }
                            else{
                                Node.one(".tip").html("账号或密码不正确，请重新输入").css('display', 'block');
                                setTimeout(function() {
                                    Node.one(".tip").css('display', 'none');
                                },2000)
                            }
                        }
                    });
                }); 
                }
            });
        });
   
    }
    else{
        KISSY.use('node',function(S,Node){
            Node.one('#btn').html('绑定');
        });
        KISSY.use('node',function(S,Node){
            Node.one('#btn').on('click',function(e){
                var businessAccount=Node.one(".businessAccount").val()
                var businessPassword=Node.one(".businessPassword").val()
                if(businessAccount!=""&&businessPassword!=""){
                    var url="/user/bmsh5/bindhotel";
                    var h5Url=GetParams().h5url;
                    var dataLogin;
                    if(!h5Url){
                        dataLogin={"businessAccount":businessAccount,"businessPassword":businessPassword};
                    }else {
                        dataLogin={"businessAccount":businessAccount,"businessPassword":businessPassword,"h5url":decodeURIComponent(h5Url)};
                    }
                KISSY.use('io,node',function(S,io,Node){
                     io({
                        type: 'post',
                        url:url,
                        data:{
                            data:JSON.stringify(dataLogin)
                        },
                        success:function(result){
                    
                            console.log(result)

                            if(result.sc=="0"){
                                window.location=result.data.jumpurl
                            }
                            else if(result.sc=="BMS-2003"){
                                Node.one(".tip").html("请重新登录").css('display', 'block');
                                setTimeout(function() {
                                    Node.one(".tip").css('display', 'none');
                                },2000)
                            }
                            else if(result.sc=="-1"){
                                Node.one(".tip").html("请重新登录").css('display', 'block');
                                setTimeout(function() {
                                    Node.one(".tip").css('display', 'none');
                                },2000)
                            }
                            else if(result.sc=="USERBMS-1000"){
                                Node.one(".tip").html("您已绑定成功，请返回后重新进入").css('display', 'block');
                                setTimeout(function() {
                                    Node.one(".tip").css('display', 'none');
                                },4000)
                            }
                            else{
                                Node.one(".tip").html("账号或密码不正确，请重新输入").css('display', 'block');
                                setTimeout(function() {
                                    Node.one(".tip").css('display', 'none');
                                },2000)
                            }
                        }
                    });
                }); 
                }
            });
        });
    }
// });

//获取url的参数
function GetParams() {
    var queryString = window.location.search; //获取url中"?"符后的字串
    var params = {};
    if (queryString.indexOf("?") != -1) {
        queryString = queryString.substr(1);
        paramArray = queryString.split("&");
        for(var i = 0; i < paramArray.length; i ++) {
            kv = paramArray[i].split("=");
            params[kv[0]] = kv[1]
        }
    }
    return params;
}