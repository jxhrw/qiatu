var aa=0
$(document).ready(function() {
    var minTimestamp= Date.parse(new Date())-30*24*60*60*1000;
    var min=formatStrDate(new Date(minTimestamp))
    $("#J_DepDate").val(min)
    $("#J_EndDate").val(formatStrDate(new Date()))
    $(".recordWrapRight span").eq(0).click(function(event) {
        $(".mask").css('display', 'block').attr('id', 'ruZhu');
        $(".mask1").removeAttr('id');
        $(".alertRight").css('display', 'none');
        $(".mask .alert").css('width', '40%');
        $(".alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
        $(".alertLeft .dl1 dd input").siblings('span').css('display', 'none');
    });
    $(".recordWrapRight span").eq(1).click(function(event) {
        $(".mask").css('display', 'block').attr('id', 'liZhu');
        $(".mask1").removeAttr('id');
        $(".alertRight").css('display', 'none');
        $(".mask .alert").css('width', '40%');
        $(".alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
        $(".alertLeft .dl1 dd input").siblings('span').css('display', 'none');
    });
    $(".recordWrapRight span").eq(2).click(function(event) {
        $(".mask1").css('display', 'block').attr('id', 'feiruZhu');
        $(".mask").removeAttr('id');
        $(".alertRight").css('display', 'none');
        $(".mask1 .alert").css('width', '40%');
        $(".alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
        $(".alertLeft .dl1 dd input").siblings('span').css('display', 'none');
    });

    $(".recordWrap").css('width', $(window).width()-40);
    $(".recordTable").css('width', $(window).width()-40)
    $(".mask1").css('height', $(window).height());
    $(".mask2").css('height', $(window).height());
    $(".mask3").css('height', $(window).height());
    $(".mask4").css('height', $(window).height());
    $(".mask").css('height', $(window).height());
    // $(".recordWrap").css('height', $(window).height()-90);
    $(".maskClose").click(function(event) {
        $(this).parent().parent().parent().css('display', 'none');
        $(" #J_DepDate1").val("");
        $(" #J_EndDate1").val("");
        $(".amount").val("");
        $(".roomNights").val("");
        $(".alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
        $(".errTip1").css('display', 'none');
    });
    $(".mask2Btn").children('span').eq(1).click(function(event) {
        $(this).parent().parent().parent().css('display', 'none');
    });


    $(".roomNights").blur(function (event) {
        if($(this).val()==""){
            $(this).css('border', '1px solid #fe4f40');
            $(".errTip4").css('display', 'block');
            // $(".mask dl").css('height', '60px');
        }
        else{
            $(this).css('border', '1px solid #bfbfbf');
            $(".errTip4").css('display', 'none');
            // $(".mask dl").css('height', '44px');
        }

    })
    $(".amount").blur(function (event) {
        if($(this).val()==""){
            $(this).css('border', '1px solid #fe4f40');
            $(".errTip5").css('display', 'block');
            // $(".mask dl").css('height', '60px');
        }
        else{
            $(this).css('border', '1px solid #bfbfbf');
            $(".errTip5").css('display', 'none');
            // $(".mask dl").css('height', '44px');
        }

    })

    //失去焦点
    $(".alertLeft .dl1 dd input").blur(function (event) {
        if (!$(this).val().match(/^[1][3,4,5,7,8][0-9]{9}$/)) {
            $(this).val("").css('border', '1px solid #fe4f40');
            $(this).siblings('span').html("请输入正确的手机号").css('display', 'block');
            return;
        }
        else{
            $(this).css('border', '1px solid #bfbfbf');
            var data={"accountname":$(this).val()}
            // console.log(JSON.stringify(data))
            $.post('/user/bmsh5/infobyaccount', {data: JSON.stringify(data)}, function(data) {
                // console.log(data)
                if(data.sc=="0"){
                    $(".errTip1").css('display', 'none');
                    $(".alertRight .memberName dd").html(data.data.realname);
                    $(".alertRight .memberClass dd").html(data.data.memberInfo.memberGradeDesc+"会员");
                    if(data.data.memberInfo.equityInfo.memberGrade=="0"){
                        $(".memberEq dd").html('1.'+data.data.memberInfo.equityInfo.welcomeGiftDesc+'<br/>2、积分返利')
                    }
                    else if(data.data.memberInfo.equityInfo.memberGrade=="1"){
                        $(".memberEq dd").html('1.'+data.data.memberInfo.equityInfo.welcomeGiftDesc+'<br/>2、订房-优先候补 <br/>3、住二赠一（以积分形式赠送，一权益年一次）')
                    }
                    else if(data.data.memberInfo.equityInfo.memberGrade=="2"){
                        $(".memberEq dd").html('1.'+data.data.memberInfo.equityInfo.welcomeGiftDesc+'<br/>2、订房-优先候补 <br/>3、升房-房型任选<br/> 4、住一赠一（以积分形式赠送，一权益年一次） ')
                    }
                    // click(uid)
                    $(".memberEqUid").html(data.data.uid);
                    // $(".alertRight .memberEq dd").html(data.data.memberInfo.equtyInfo)
                    if($(".mask").attr("id")=="ruZhu"){

                        $(".alertRight").css('display', 'block');
                        $(".errTip1").css('display', 'none');
                        $(".alert").css('width', '60%');
                        var data1={"userid":$(".memberEqUid").html()}
                        $.post('/member/bms/points/roomreward/check', {data: JSON.stringify(data1)}, function(result) {
                            // console.log(result)
                            if(result.sc=="0"){
                                if(result.data==""){


                                }
                                else{
                                    // alert("aaa")
                                    // $("#ruZhu .alertLeft dl").eq(0).children('dd').children('input').css('border', '1px solid #fe4f40');
                                    $("#ruZhu .errTip1").html(result.data).css('display', 'block');
                                }



                            }
                        })
                    }
                    else if($(".mask").attr("id")=="liZhu"){
                        $("#liZhu .alertRight").css('display', 'block');
                        $("#liZhu .alert").css('width', '60%');
                        var data1={"userid":$(".memberEqUid").html()}
                        $.post('/member/bms/points/roomreward/check', {data: JSON.stringify(data1)}, function(result) {
                            // console.log(result)
                            if(result.sc=="0"){
                                if(result.data==""){


                                }
                                else{
                                    // $("#liZhu .alertLeft dl").eq(0).children('dd').children('input').css('border', '1px solid #fe4f40');
                                    $("#liZhu .errTip1").html(result.data).css('display', 'block');
                                }



                            }
                        })
                    }
                    else if($(".mask1").attr("id")=="feiruZhu"){

                        $("#feiruZhu .alertRight").css('display', 'block');
                        $("#feiruZhu .alert").css('width', '60%');
                        $("#feiruZhu .errTip1").css('display', 'none');
                    }

                }
                else if(data.sc=="USER-1014"){
                    $(".alertLeft dl").eq(0).children('dd').children('input').css('border', '1px solid #fe4f40');
                    $(".errTip1").html("该用户不是会员").css('display', 'block');
                    $(".memberEqUid").html("");
                    $(".alertRight").css('display', 'none');
                    $(".alert").css('width', '50%');
                    $

                }
                else if(data.sc=="-99999"){
                    $(".alertLeft dl").eq(0).children('dd').children('input').css('border', '1px solid #fe4f40');
                    $(".errTip1").html("系统繁忙").css('display', 'block');
                    $(".memberEqUid").html("")
                    $(".alertRight").css('display', 'none');
                    $(".alert").css('width', '50%');
                }
                else{
                    $(".alertLeft dl").eq(0).children('dd').children('input').css('border', '1px solid #fe4f40');
                    $(".errTip1").html(data.errorMsg).css('display', 'block');
                    $(".memberEqUid").html("")
                    $(".alertRight").css('display', 'none');
                    $(".alert").css('width', '50%');

                }
            })

        }
    });



    $("#xiugaimimaBtn1").click(function(event) {

        if($(" #J_DepDate1").val()!=""&&$("#J_EndDate1").val()!=""&&$(".amount").val()!=""){
            var timestamp1 = Date.parse(new Date($(" #J_DepDate1").val()));
            var timestamp2 = Date.parse(new Date($(" #J_EndDate1").val()));
            if(timestamp1<timestamp2){
                if($(".memberEqUid").html()!=""){

                    var data1;
                    // console.log(JSON.stringify(data1))
                    var al=$("#xiugaimimaBtn1").parent(".alert").parent(".mask").attr('id')
                    if(al=="ruZhu"){
                        var data1={"userid":$(".memberEqUid").html(),"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".amount").val()*100),"roomName":$(".roomNights").val(),"roomNights":1}
                    }
                    else{
                        var data1={"userid":$(".memberEqUid").html(),"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".amount").val()*100),"roomName":$(".roomNights").val(),"roomNights":1,"isCommit":1}
                    }
                    $.post('/member/bms/points/roomreward/add', {data: JSON.stringify(data1)}, function(result) {
                        // console.log(result)
                        if(result.sc=="0"){
                            $(".mask").css('display', 'none');

                            searchXun()
                            $(" #J_DepDate1").val("");
                            $(" #J_EndDate1").val("");
                            $(".amount").val("");
                            $(".roomNights").val("");
                            $(".alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
                            $(".errTip1").css('display', 'none');

                        }
                        // else if(result.sc=="BASE-1002"){
                        //   alert("该用户还不是会员，请先邀请用户成为几何会员")
                        // }
                        else{
                            alert(result.msg)
                        }
                    })
                }
                else{
                    alert("该用户还不是会员，请先邀请用户成为几何会员")
                }
            }
            else{
                alert("入住时间和离店时间填写不正确")
            }
        }
        else{
            alert("请填写完信息")
        }


    })

    $("#xiugaimimaBtn2").click(function(event) {
        if($("#feiruZhu #J_DepDate1").val()!=""&&$("#feiruZhu .amount").val()!=""){
            // alert("aa")
            if($(".memberEqUid").html()!=""){
                var timestamp1 = Date.parse(new Date($("#feiruZhu #J_DepDate1").val()));
                var data1={"userid":$(".memberEqUid").html(),"checkin":timestamp1,"amount":parseInt($("#feiruZhu .amount").val()*100),"isCommit":1}
                // console.log(JSON.stringify(data1))
                $.post('/member/bms/points/cashreward/add', {data: JSON.stringify(data1)}, function(result) {
                    // console.log(result)
                    if(result.sc=="0"){
                        $(".mask1").css('display', 'none');

                        searchXun()
                        $("#feiruZhu #J_DepDate1").val("");
                        $("#feiruZhu .amount").val("");
                        $("#feiruZhu .alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
                        // $(".errTip1").css('display', 'none');
                    }
                    // else if(result.sc=="BASE-1002"){
                    //   alert("该用户还不是会员，请先邀请用户成为几何会员")
                    // }
                    else{
                        alert(result.msg)
                    }
                })
            }
            else{
                alert("该用户还不是会员，请先邀请用户成为几何会员")
            }
        }
        else{
            alert("请填写完信息")
        }


    });







    //时间失去焦点







    $(".searchIcon").click(function(event) {
        $(this).attr("disabled", true);

        searchXun()


        setTimeout(function() {

            $(".searchIcon").removeAttr("disabled");
        }, 1000)

    })


    //直接进去搜索
    searchXun2()

    $(".hovertable tr span").live('click', function(event) {
        if($(this).index()==1){
            // alert("b")
            $(".mask2").css('display', 'block');
            // $(this).parent("td").parent('tr').attr('id', '0');
            var e=$(this).parent("td").parent('tr').index();
            $(".none3").html(e)


        }
        else if($(this).index()==0){
            // alert("a")
            var e=$(this).parent("td").parent('tr').index();
            $(".mask3").css('display', 'block');
            $(".mask3 .alertRight").css('display', 'none');
            $(".mask3 .alertLeft #J_DepDate2").val($(".hovertable tr").eq(e).children('td').eq(4).html())
            $(".mask3 .alertLeft #J_EndDate2").val($(".hovertable tr").eq(e).children('td').eq(5).html())
            $(".mask3 .alertLeft .roomNights").val($(".hovertable tr").eq(e).children('td').eq(7).html())
            $(".mask3 .alertLeft .amount").val($(".hovertable tr").eq(e).children('td').eq(6).html())
            $(".mask3 .alertLeft .dl1 dd").html($(".hovertable tr").eq(e).children('td').eq(3).html()).css('color', '#000');
            // alert($(".hovertable tr").eq(e).children('.pointstype').html())
            $(".none").html($(".hovertable tr").eq(e).children('.pointstype').html())
            //  $(".none1").html($(".hovertable tr").eq(e).children('.uid').html())
            //   $(".none2").html($(".hovertable tr").eq(e).children('.delId').html())
            $(".none3").html(e)
            if($(".hovertable tr").eq(e).children('.pointstype').html()==11){
                $(".mask3 .alertLeft dl").eq(2).show();
                $(".mask3 .alertLeft dl").eq(4).show();


            }
            else if($(".hovertable tr").eq(e).children('.pointstype').html()==12){
                $(".mask3 .alertLeft dl").eq(2).hide();
                $(".mask3 .alertLeft dl").eq(4).hide();
                $(".mask3 .alertLeft #J_DepDate2").val($(".hovertable tr").eq(e).children('td').eq(4).html())
                $(".mask3 .alertLeft .amount").val($(".hovertable tr").eq(e).children('td').eq(6).html())

            }

        }
        else if($(this).index()==2){
            // alert("c")
            $(".mask4").css('display', 'block');
            var e=$(this).parent("td").parent('tr').index();
            $(".recordIfr").attr('src', '/html/bms/record.html?member_hotelid='+$(".hovertable tr").eq(e).children('.delId').html());
        }
    });

    /*$(".mask2Btn").children('span').eq(0).click(function(event) {
     // alert("bb")
     var data={"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html()}
     // console.log($(".hovertable tr").eq(e).children('.delId').html())
     $.post('/member/bms/points/reward/del', {data: JSON.stringify(data)}, function(result) {

     if(result.sc==0){
     $(".mask2").css('display', 'none');
     $(".hovertable tr").eq($(".none3").html()).css('display', 'none');
     }
     else{
     // alert(result.msg)
     location.reload()
     }
     })

     });*/
    $(".mask2 .handwriting .submitBox span").click(function(){
        var reason=$(this).parent().siblings("textarea").val();
        if(reason){
            if(reason!="删除消费记录的原因是？"){
                var data={"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html(),"remark":reason};
                $.post('/member/bms/points/reward/del', {data: JSON.stringify(data)}, function(result) {
                    if(result.sc==0){
                        $(".mask2").css('display', 'none');
                        $(".hovertable tr").eq($(".none3").html()).css('display', 'none');
                    }
                    else{
                        location.reload()
                    }
                })
            }
        }else {
            $(".mask2Textarea").val("删除消费记录的原因是？").css("color","red");
        }
    });

    $(".mask2 .mask2Box span").click(function () {
        var reason=$(this).html();
        var data={"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html(),"remark":reason};
        $.post('/member/bms/points/reward/del', {data: JSON.stringify(data)}, function(result) {
            if(result.sc==0){
                $(".mask2").css('display', 'none');
                $(".hovertable tr").eq($(".none3").html()).css('display', 'none');
            }
            else{
                location.reload()
            }
        })
    });

    $(".mask2Textarea").focus(function(){
        if($(this).val()=="删除消费记录的原因是？"){
            $(this).val("").css("color","#000");
        }
    });


    $(".mask3 .xiugaimimaBtn").click(function(event) {
        // alert($(".none").html())
        if($(".hovertable tr").eq($(".none3").html()).children('.pointstype').html()==11){
            var timestamp1 =Date.parse(new Date($(".mask3 #J_DepDate2").val()));
            var timestamp2 = Date.parse(new Date($(".mask3 #J_EndDate2").val()));
            var data={"userid":$(".hovertable tr").eq($(".none3").html()).children('.uid').html(),"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html(),"pointstype":$(".hovertable tr").eq($(".none3").html()).children('.pointstype').html(),"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".mask3 .amount").val()*100),"roomName":$(".mask3 .roomNights").val(),"roomNights":1}
            // console.log(data)
            if($(".mask3 #J_DepDate2").val()!=""&&$(".mask3 .amount").val()!=""&&$(".mask3 #J_EndDate2").val()!=""){
                $.post('/member/bms/points/reward/edit', {data: JSON.stringify(data)}, function(result) {
                    // console.log(result)
                    if(result.sc==0){
                        $(".mask3 #J_DepDate2").val("");
                        $(".mask3 .amount").val("");
                        $(".mask3 .roomNights").val("");
                        $(".mask3 #J_EndDate2").val("");
                        $(".mask3").css('display', 'none');
                        // searchXun()
                        var checkin=formatStrDate( new Date(parseInt(result.data.checkin)))
                        var checkout=formatStrDate( new Date(parseInt(result.data.checkout)))
                        $(".hovertable tr").eq($(".none3").html()).children('td').eq(4).html(checkin);
                        $(".hovertable tr").eq($(".none3").html()).children('td').eq(5).html(checkout);
                        $(".hovertable tr").eq($(".none3").html()).children('td').eq(7).html(result.data.roomName);
                        $(".hovertable tr").eq($(".none3").html()).children('td').eq(6).html(result.data.amount/100);
                    }
                    else{
                        alert(result.msg)
                    }
                })
            }
            else{
                alert("请填写完信息")
            }

            // })
        }
        else if($(".hovertable tr").eq($(".none3").html()).children('.pointstype').html()==12){
            // alert($(".hovertable tr").eq($(".none3").html()).children('.pointstype').html()+"haha")
            var timestamp1 = Date.parse(new Date($(".mask3 #J_DepDate2").val()));
            var data={"userid":$(".hovertable tr").eq($(".none3").html()).children('.uid').html(),"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html(),"pointstype":$(".hovertable tr").eq($(".none3").html()).children('.pointstype').html(),"checkin":timestamp1,"amount":parseInt($(".mask3 .amount").val()*100)}
            // console.log(data)
            if($(".mask3 #J_DepDate2").val()!=""&&$(".mask3 .amount").val()!=""){
                $.post('/member/bms/points/reward/edit', {data: JSON.stringify(data)}, function(result) {
                    console.log(result)
                    if(result.sc==0){
                        // alert("add a")
                        $(".mask3 #J_DepDate2").val("");
                        $(".mask3 .amount").val("");
                        $(".mask3").css('display', 'none');
                        var checkin=formatStrDate( new Date(parseInt(result.data.checkin)))
                        $(".hovertable tr").eq($(".none3").html()).children('td').eq(4).html(checkin);
                        $(".hovertable tr").eq($(".none3").html()).children('td').eq(7).html(result.data.amount/100);


                    }
                    else{
                        alert(result.msg)
                    }

                })
            }
            else{
                alert("请填写完信息")
            }

            // })
        }

    })
//分页
//sousuo
    $("#pageDir i").live('click', function(event) {
        var ee=$("#pageDir input").val()
        $("."+ee).attr('id', 'current1').siblings('span').removeAttr('id');
        if(ee>1&&ee<$("#pageDir strong").html()){
            $(".pageNext").removeAttr('id')
            $(".pageBefore").removeAttr('id')
            fenye1(ee)
        }
        else if($("#pageDir strong").html()==ee){
            $(".pageNext").attr('id', 'current')
            fenye1(ee)

        }
        else if(ee==1){
            $(".pageBefore").attr('id', 'current')
            fenye1(ee)
        }
        else{
            $("#pageDir input").val(ee)
            return;
        }


    });
//下一个 上一页
    $("#pageDir .pageBefore").live('click', function(event) {
        var ee=$("#pageDir input").val()-1
        $("."+ee).attr('id', 'current1').siblings('span').removeAttr('id');
        if(ee>1){

            fenye1(ee)
            $("#pageDir input").val(ee)
            $(".pageNext").removeAttr('id')
        }
        else if(ee==1){
            fenye1(ee)
            $("#pageDir input").val(ee)
            $(".pageBefore").attr('id', 'current')
            $(".pageNext").removeAttr('id')
        }
        else if(ee==0){
            return;
        }



    });
    $("#pageDir .pageNext").live('click', function(event) {
        // var d=5;
        var ee=parseInt($("#pageDir input").val())+1
        $("."+ee).attr('id', 'current1').siblings('span').removeAttr('id');
        $(".pageBefore").removeAttr('id')
        if(ee<$("#pageDir strong").html()){

            fenye1(ee)
            $("#pageDir input").val(ee)
        }
        else if(ee==$("#pageDir strong").html()){

            fenye1(ee)
            $("#pageDir input").val(ee)
            $(".pageNext").attr('id', 'current')


        }
        else{
            $(".pageNext").attr('id', 'current')
            fenye($("#pageDir strong").html())
            return;
        }




    });

// $(".hovertable tr span").live('click', function(event) {
    $("#pageDir span").live('click', function(event) {
        var ee=$(this).attr("class")

        $(this).attr('id', 'current1').siblings('span').removeAttr('id');
        $("#pageDir input").val(ee)
        if(ee>1){
            $(".pageBefore").removeAttr('id')
        }
        else{
            $(".pageBefore").attr('id', 'current')
        }
        if($("#pageDir strong").html()==ee){
            $(".pageNext").attr('id', 'current')

        }

        else{
            $(".pageNext").removeAttr('id')

        }
        fenye1(ee)



    });

//submit
    $(".hovertable td strong").live('click', function(event) {
        var e=$(this).parent("td").parent("tr").index()
        var date=Date.parse(new Date())
        var date1=Date.parse(new Date($(".hovertable tr").eq(e).children('.checkout').html()))
        // alert(date+","+date1)
        if(date>=date1){
            //if($(".hovertable tr").eq(e))
            var data2={"id":$(".hovertable tr").eq(e).children('.delId').html()}
            // console.log(JSON.stringify(data2))
            $.post('/member/bms/points/reward/commit', {data: JSON.stringify(data2)}, function(res) {
                // console.log(res)
                if(res.sc==0){
                    alert("提交成功")
                    $(".hovertable tr").eq(e).children('td').children('strong').remove();
                }
                else{
                    alert("系统繁忙")
                }

            })
        }
        else{
            alert("该消费记录还没到离店时间")
        }

    });


});
// formatStrDate( new Date(parseInt(nS)))
function formatNum(num){//补0
    return num.toString().replace(/^(\d)$/, "0$1");
}
function formatStrDate(vArg){//格式化日期
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
            break;
    }
}
var d=0;
var dc=0
function fenye(zongCount){

    d++;

    if(zongCount==0){
        $(".recordTable").hide()
    }
    else if(zongCount==1){
        // $(".pageNext").attr('id', 'current')
        $(".recordTable").show()
        $("#pageDir").append(' <div id="'+d+'"><span class="1">1</span>共<strong>'+zongCount+ '</strong>页 到第<input type="number" value="1">页 <i>确定</i></div>')

    }
    else{
        $(".recordTable").show()
        $(".pageNext").removeAttr('id')
        $("#pageDir").append(' <div id="'+d+'"><em class="pageBefore 0" id="current" ><</em><em class="pageNext">></em>共<strong>'+zongCount+ '</strong>页到第<input type="number" value="1">页 <i>确定</i></div>')
        for (var i = 0; i < zongCount; i++) {
            // dc++
            var ccc=i+1
            if(ccc <zongCount){
                // var dd=i
                // alert(dd);
                $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
            }
            else if(ccc ==zongCount){
                // var dd=dc-1
                // alert(dd);
                $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
                // $("#pageDir .add").hide();
            }
        };


    }

    for (var i = 1; i <d; i++) {
        var cc=i
        $('#'+cc).remove();
    };



}

function fenye1(ee){
    aa++;
    var a=aa-1
    var searchTimestamp1= Date.parse(new Date($(".recordWrapLeft #J_DepDate").val()));
    var searchTimestamp2 = Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()));
    if(searchTimestamp1==searchTimestamp2){
        var searchTimestamp2=Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*24
    }
    // }
    var data={"starttime":searchTimestamp1,"endtime":searchTimestamp2,"pageno":ee}
    $.post('/member/bms/points/reward/list', {data: JSON.stringify(data)}, function(result) {
        // console.log(result)
        if(result.sc=="0"){
            $("#pageDir strong").html(result.data.totalPages)

            for (var i = 0; i<result.data.result.length; i++) {
                var otaName;
                if(result.data.result[i].otaName==undefined){
                    otaName="";
                }
                else{
                    otaName=result.data.result[i].otaName;
                }
                var roomName;
                if(result.data.result[i].roomName==undefined){
                    roomName="";
                }
                else{
                    roomName=result.data.result[i].roomName;
                }
                //var checkin=getLocalTime(result.data.result[i].checkin);
                var checkin=formatStrDate( new Date(parseInt(result.data.result[i].checkin)))
                /*alert(checkin)*/
                var checkout=formatStrDate( new Date(parseInt(result.data.result[i].checkout)))
                $('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>住宿<br/><em><!--自动抓取--></em><em><!--几何直订--></em><em>手工录入</em></td><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].memberGradeDesc+'</td><td>'+result.data.result[i].mobile+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td>'+result.data.result[i].amount/100+'</td><td class="roomnights">'+roomName+'</td><td>'+otaName+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.result[i].id+'</td><td class="pointstype" style="display:none">'+result.data.result[i].pointsType+'</td><td class="uid" style="display:none">'+result.data.result[i].uid+'</td></tr>')
                //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                if(result.data.result[i].recordSource==1){
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(1).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(2).hide();
                }
                else if(result.data.result[i].recordSource==2){
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(0).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(2).hide();
                }
                else{
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(0).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(1).hide();
                }



                if(result.data.result[i].status!=0){
                    $('.'+aa).eq(i).children('td').children('strong').css('display', 'none');
                    if(result.data.result[i].status==1){
                        $('.'+aa).eq(i).children('td').children('span').hover(function() {
                            $(this).css({
                                'text-decoration': 'underline',
                                'color': '#d13f4c',
                                'cursor': 'pointer'
                            });
                        }, function() {
                            $(this).css({
                                'text-decoration': 'none',
                                'color': '#333'
                            });
                        });
                    }
                    else{
                        $('.'+aa).eq(i).children('td').children('span').eq(0).css('display', 'none');
                        $('.'+aa).eq(i).children('td').children('span').eq(1).css('display', 'none');
                    }
                }
                else{
                    $('.'+aa).eq(i).children('td').children('span').hover(function() {
                        $(this).css({
                            'text-decoration': 'underline',
                            'color': '#d13f4c',
                            'cursor': 'pointer'
                        });
                    }, function() {
                        $(this).css({
                            'text-decoration': 'none',
                            'color': '#333'
                        });
                    });
                }
                //pointsType 11住宿消费 12非住宿消费 13积分加速（统一处理，立即生效）14订单取消  15推荐奖励 16积分赠送（统一处理，立即生效） 21兑换房间 22兑换非住宿消费 23积分过期 99其他
                if(result.data.result[i].pointsType==12){
                    $('.'+aa).eq(i).children('.roomnights').html("");
                    $('.'+aa).eq(i).children('.checkout').html("");
                    $('.'+aa).eq(i).children('td').eq(0).html("非住宿").css('background-color', '#e4e6e3');
                }
                if(result.data.result[i].isFirstConsume==0){
                    $('.'+aa).eq(i).children('td').eq(1).css({
                        "background": 'none'
                    });
                }
                else{
                    $('.'+aa).eq(i).children('td').eq(1).css({
                        "background": 'url(/html/bms/image/fristIcon.png) left top no-repeat',
                        "-webkit-background-size": '40px',
                        "background-size": '40px'
                    });
                    $('.'+aa).eq(i).children('td').eq(1).hover(function() {
                        $(this).css('cursor', 'pointer');
                        $(this).append('<i style="color:#333;">商户新加入会员在入住与离店期间注册且为首次住宿消费，由积分中心向用户支付最多1000的奖励积分，商户无需支出。</i>');
                    }, function() {
                        $(this).children('i').remove();
                    });
                }
            };

        }
    })

    if(aa>a){
        // alert($(".hovertable tr").eq(1).attr('class'))

        /*alert($(".hovertable tr").eq(1).attr('class'));*/
        for (var i = 0; i <$('.'+a).length; i++) {
            $('.hovertable .'+a).remove();
        };
        // $("#pageDir ."+a).;
        //$('.'+a).css('display', 'none !important');


    }
}
function searchXun(){
    aa++;
    var a=aa-1
    var searchTimestamp1= Date.parse(new Date($(".recordWrapLeft #J_DepDate").val()));
    var searchTimestamp2 = Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()));
    if(searchTimestamp1==searchTimestamp2){
        var searchTimestamp2=Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*24
    }
    var data={"starttime":searchTimestamp1,"endtime":searchTimestamp2}
    $.post('/member/bms/points/reward/list', {data: JSON.stringify(data)}, function(result) {
        console.log(result)
        if(result.sc=="0"){

            // $("#pageDir strong").html(result.data.totalPages)
            fenye(result.data.totalPages)
            for (var i = 0; i<result.data.result.length; i++) {
                var otaName;
                if(result.data.result[i].otaName==undefined){
                    otaName="";
                }
                else{
                    otaName=result.data.result[i].otaName;
                }
                var roomName;
                if(result.data.result[i].roomName==undefined){
                    roomName="";
                }
                else{
                    roomName=result.data.result[i].roomName;
                }

                //var checkin=getLocalTime(result.data.result[i].checkin);
                var checkin=formatStrDate( new Date(parseInt(result.data.result[i].checkin)))
                /*alert(checkin)*/
                var checkout=formatStrDate( new Date(parseInt(result.data.result[i].checkout)))
                // $('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>住宿<em>自动抓取</em><em>手工录入</em></td><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].memberGradeDesc+'</td><td>'+result.data.result[i].mobile+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td class="roomnights">'+result.data.result[i].roomnights+'</td><td>'+result.data.result[i].amount/100+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.result[i].id+'</td><td class="pointstype" style="display:none">'+result.data.result[i].pointsType+'</td><td class="uid" style="display:none">'+result.data.result[i].uid+'</td></tr>')
                //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                $('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>住宿<br/><em><!--自动抓取--></em><em><!--几何直订--></em><em>手工录入</em></td><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].memberGradeDesc+'</td><td>'+result.data.result[i].mobile+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td>'+result.data.result[i].amount/100+'</td><td class="roomnights">'+roomName+'</td><td>'+otaName+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.result[i].id+'</td><td class="pointstype" style="display:none">'+result.data.result[i].pointsType+'</td><td class="uid" style="display:none">'+result.data.result[i].uid+'</td></tr>')
                //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                if(result.data.result[i].recordSource==1){
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(1).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(2).hide();
                }
                else if(result.data.result[i].recordSource==2){
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(0).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(2).hide();
                }
                else{
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(0).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(1).hide();
                }
                if(result.data.result[i].status!=0){
                    $('.'+aa).eq(i).children('td').children('strong').css('display', 'none');
                    if(result.data.result[i].status==1){
                        $('.'+aa).eq(i).children('td').children('span').hover(function() {
                            $(this).css({
                                'text-decoration': 'underline',
                                'color': '#d13f4c',
                                'cursor': 'pointer'
                            });
                        }, function() {
                            $(this).css({
                                'text-decoration': 'none',
                                'color': '#333'

                            });
                        });
                    }
                    else{
                        $('.'+aa).eq(i).children('td').children('span').eq(0).css('display', 'none');
                        $('.'+aa).eq(i).children('td').children('span').eq(1).css('display', 'none');
                    }
                }
                else{
                    $('.'+aa).eq(i).children('td').children('span').hover(function() {
                        $(this).css({
                            'text-decoration': 'underline',
                            'color': '#d13f4c',
                            'cursor': 'pointer'
                        });
                    }, function() {
                        $(this).css({
                            'text-decoration': 'none',
                            'color': '#333'
                        });
                    });
                }
                //pointsType 11住宿消费 12非住宿消费 13积分加速（统一处理，立即生效）14订单取消  15推荐奖励 16积分赠送（统一处理，立即生效） 21兑换房间 22兑换非住宿消费 23积分过期 99其他
                if(result.data.result[i].pointsType==12){
                    $('.'+aa).eq(i).children('.roomnights').html("");
                    $('.'+aa).eq(i).children('.checkout').html("");
                    $('.'+aa).eq(i).children('td').eq(0).html("非住宿").css('background-color', '#e4e6e3');
                }
                if(result.data.result[i].isFirstConsume==0){
                    $('.'+aa).eq(i).children('td').eq(1).css({
                        "background": 'none'
                    });
                }
                else{
                    $('.'+aa).eq(i).children('td').eq(1).css({
                        "background": 'url(/html/bms/image/fristIcon.png) left top no-repeat',
                        "-webkit-background-size": '40px',
                        "background-size": '40px'
                    });
                    $('.'+aa).eq(i).children('td').eq(1).hover(function() {
                        $(this).css('cursor', 'pointer');
                        $(this).append('<i style="color:#333;">商户新加入会员在入住与离店期间注册且为首次住宿消费，由积分中心向用户支付最多1000的奖励积分，商户无需支出。</i>');
                    }, function() {
                        $(this).children('i').remove();
                    });
                }
            };

        }

        if(aa>a){
            for (var i = 0; i <$('.'+a).length; i++) {
                // alert("a")
                $('.hovertable  .'+a).remove();
                // $('.'+a).hide();
            };
            // $("#pageDir ."+a).show();


        }
    })
}








function searchXun2(){
    aa++;
    var a=aa-1
    var searchTimestamp1= Date.parse(new Date($(".recordWrapLeft #J_DepDate").val()));
    var searchTimestamp2 = Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()));
    // if(searchTimestamp1==searchTimestamp2){
    //    var searchTimestamp2=Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*24
    // }
    // console.log(searchTimestamp2)
    var data={"starttime":searchTimestamp1,"endtime":searchTimestamp2}
    $.post('/member/bms/points/reward/list', {data: JSON.stringify(data)}, function(result) {
        console.log(result)
        if(result.sc=="0"){

            // $("#pageDir strong").html(result.data.totalPages)
            fenye(result.data.totalPages)
            for (var i = 0; i<result.data.result.length; i++) {
                var otaName;
                if(result.data.result[i].otaName==undefined){
                    otaName="";
                }
                else{
                    otaName=result.data.result[i].otaName;
                }
                var roomName;
                if(result.data.result[i].roomName==undefined){
                    roomName="";
                }
                else{
                    roomName=result.data.result[i].roomName;
                }
                //var checkin=getLocalTime(result.data.result[i].checkin);
                var checkin=formatStrDate( new Date(parseInt(result.data.result[i].checkin)))
                /*alert(checkin)*/
                var checkout=formatStrDate( new Date(parseInt(result.data.result[i].checkout)))
                // $('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>住宿<em>自动抓取</em><em>手工录入</em></td><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].memberGradeDesc+'</td><td>'+result.data.result[i].mobile+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td class="roomnights">'+result.data.result[i].roomnights+'</td><td>'+result.data.result[i].amount/100+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.result[i].id+'</td><td class="pointstype" style="display:none">'+result.data.result[i].pointsType+'</td><td class="uid" style="display:none">'+result.data.result[i].uid+'</td></tr>')
                //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                $('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>住宿<br/><em><!--自动抓取--></em><em><!--几何直订--></em><em>手工录入</em></td><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].memberGradeDesc+'</td><td>'+result.data.result[i].mobile+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td>'+result.data.result[i].amount/100+'</td><td class="roomnights">'+roomName+'</td><td>'+otaName+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.result[i].id+'</td><td class="pointstype" style="display:none">'+result.data.result[i].pointsType+'</td><td class="uid" style="display:none">'+result.data.result[i].uid+'</td></tr>')
                //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                if(result.data.result[i].recordSource==1){
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(1).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(2).hide();
                }
                else if(result.data.result[i].recordSource==2){
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(0).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(2).hide();
                }
                else{
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(0).hide();
                    $('.'+aa).eq(i).children('td').eq(0).children("em").eq(1).hide();
                }
                if(result.data.result[i].status!=0){
                    $('.'+aa).eq(i).children('td').children('strong').css('display', 'none');
                    if(result.data.result[i].status==1){
                        $('.'+aa).eq(i).children('td').children('span').hover(function() {
                            $(this).css({
                                'text-decoration': 'underline',
                                'color': '#d13f4c',
                                'cursor': 'pointer'
                            });
                        }, function() {
                            $(this).css({
                                'text-decoration': 'none',
                                'color': '#333'

                            });
                        });
                    }
                    else{
                        $('.'+aa).eq(i).children('td').children('span').eq(0).css('display', 'none');
                        $('.'+aa).eq(i).children('td').children('span').eq(1).css('display', 'none');
                    }
                }
                else{
                    $('.'+aa).eq(i).children('td').children('span').hover(function() {
                        $(this).css({
                            'text-decoration': 'underline',
                            'color': '#d13f4c',
                            'cursor': 'pointer'
                        });
                    }, function() {
                        $(this).css({
                            'text-decoration': 'none',
                            'color': '#333'
                        });
                    });
                }
                //pointsType 11住宿消费 12非住宿消费 13积分加速（统一处理，立即生效）14订单取消  15推荐奖励 16积分赠送（统一处理，立即生效） 21兑换房间 22兑换非住宿消费 23积分过期 99其他
                if(result.data.result[i].pointsType==12){
                    $('.'+aa).eq(i).children('.roomnights').html("");
                    $('.'+aa).eq(i).children('.checkout').html("");
                    $('.'+aa).eq(i).children('td').eq(0).html("非住宿").css('background-color', '#e4e6e3');
                }
                if(result.data.result[i].isFirstConsume==0){
                    $('.'+aa).eq(i).children('td').eq(1).css({
                        "background": 'none'
                    });
                }
                else{
                    $('.'+aa).eq(i).children('td').eq(1).css({
                        "background": 'url(/html/bms/image/fristIcon.png) left top no-repeat',
                        "-webkit-background-size": '40px',
                        "background-size": '40px'
                    });
                    $('.'+aa).eq(i).children('td').eq(1).hover(function() {
                        $(this).css('cursor', 'pointer');
                        $(this).append('<i style="color:#333;">商户新加入会员在入住与离店期间注册且为首次住宿消费，由积分中心向用户支付最多1000的奖励积分，商户无需支出。</i>');
                    }, function() {
                        $(this).children('i').remove();
                    });
                }
            };

        }

        if(aa>a){
            for (var i = 0; i <$('.'+a).length; i++) {
                // alert("a")
                $('.hovertable  .'+a).remove();
                // $('.'+a).hide();
            };
            // $("#pageDir ."+a).show();


        }
    })
}


