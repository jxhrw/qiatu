/**
 * Created by Eccentric on 2017/3/15.
 */
//外设
//设置初始化label样式，并label函数
  var actImgs='226543',joinfansQrcode,allCoupon,productId,couponList=[],isJihe;
   getUrl();
$.ajax({
  url:' /content/bms/merchant/detail',
  type:'get',
  success:function(resp){
    console.log(resp);
    isJihe=resp.data.isJihe;
    if(resp.sc=='0'){
      if(resp.data.isJihe=='1'){
        $('#needFollow2').css('display','block');
       var data=resp.data.weixinList;
       for(v in data){
         var option=$('<option>'+data[v].publicName+'</option>');
         option.attr('value',data[v].weixinid);
         $('#joinfans_weixinid').append(option);
       }
     }else{
       $('#needFollow1').css('display', 'block');
      //  $('#follow').css('display', 'none');
     }
    }
  }
})
if("undefined" == typeof(actType)) {
    var data = {
        "actId":actId
    };
    $.ajax({
        url:'/activity/bms/info',
        type:'post',
        data:{data:JSON.stringify(data)},
        success:function (resp){
            console.log(resp.sc);
            if(resp.sc=='0'){
              var data=resp.data;
                actType=data.actBaseinfo.actType;
                if(actType=='2'){
                    $('#condition').css('display','none');
                }
                if(actType=='3'){
                    $('#prize').css('display','block');
                }
                evaluate(data);
            }
            else{
                alert("系统内部错误")
            }
        }
    })
}
else{

    if(actType=='2'){
        $('#condition').css('display','none');
    }
    if(actType=='3'){
        $('#prize').css('display','block');
    }

    //活动奖品
    $('#firstLabel').removeAttr('class', 'checked') && $('#firstLabel').attr('class', 'checked');
    $('input[name=prizeWay]').removeAttr('checked') && $('#' + $('#firstLabel').attr('name')).attr('checked', 'checked');
//console.log($('label.checked').children('input[type=radio]').attr('value'));
    $('#awards label').click(function () {
        var radioId = $(this).attr('name');
        // console.log($('label.awardsLabel').html());
        $('#awards label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=prizeWay]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=prizeWay]').attr('value'));
        /**
         * 判断显示的样式
         */
        if ($('#awards label.checked').children('input[name=prizeWay]').attr('value') == '0') {
            $("#autoAwards").css('display', 'block');
            $("#manAwards").css('display', 'none');
        }
        else {
            $("#autoAwards").css('display', 'none');
            $("#manAwards").css('display', 'block');
        }

    });
//开奖时间
    $('#awardsTimeFirstLabel').removeAttr('class', 'checked') && $('#awardsTimeFirstLabel').attr('class', 'checked');
    $('input[name=awardWay]').removeAttr('checked') && $('#' + $('#awardsTimeFirstLabel').attr('name')).attr('checked', 'checked');
    $('#awardsTime label').click(function () {
        var radioId = $(this).attr('name');

        $('#awardsTime label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=awardWay]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=awardWay]').attr('value'));
        /**
         * 判断显示的样式
         */
        if ($('#awardsTime label.checked').children('input[name=awardWay]').attr('value') == '0') {
            $("#autoLottery").css('display', 'block');
            $("#manLottery").css('display', 'none');
        }
        else {
            $("#autoLottery").css('display', 'none');
            $("#manLottery").css('display', 'block');
        }

    });

//参与资格
    $('#partIn').removeAttr('class', 'checked') && $('#partIn').attr('class', 'checked');
    $('input[name=allowUser]').removeAttr('checked') && $('#' + $('#partIn').attr('name')).attr('checked', 'checked');
    $('#canPartIn label').click(function () {
        var radioId = $(this).attr('name');

        $('#canPartIn label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=allowUser]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=allowUser]').attr('value'));
    });

//需要关注
    $('#followFirst').removeAttr('class', 'checked') && $('#followFirst').attr('class', 'checked');
    $('input[name=switchJoinfans]').removeAttr('checked') && $('#' + $('#followFirst').attr('name')).attr('checked', 'checked');
    $('#follow label').click(function () {
        var radioId = $(this).attr('name');

        $('#follow label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=switchJoinfans]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=switchJoinfans]').attr('value'));

        /**
         * 判断显示的样式
         */
        if ($('#follow label.checked').children('input[name=switchJoinfans]').attr('value') == '1') {
            $('#needFollow').css('display', 'block');
        }
        else {
            $('#needFollow').css('display', 'none');
        }

    });

//需要分享朋友圈
    $('#conditionFirst').removeAttr('class', 'checked') && $('#conditionFirst').attr('class', 'checked');
    $('input[name=switchShare]').removeAttr('checked') && $('#' + $('#conditionFirst').attr('name')).attr('checked', 'checked');
    $('#condition label').click(function () {
        var radioId = $(this).attr('name');

        $('#condition label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=switchShare]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=switchShare]').attr('value'));

    });

//联盟活动中心
    $('#actCenterFirst').removeAttr('class', 'checked') && $('#actCenterFirst').attr('class', 'checked');
    $('input[name=actCenter]').removeAttr('checked') && $('#' + $('#actCenterFirst').attr('name')).attr('checked', 'checked');

}

$('button').click(function (e) {
    e.preventDefault();
})


//form修改等操作集合处理
$('input').on({
    'change': function () {
        console.log('change');
        // console.log($(this).val());
        //判定是否警告
        if (!$(this).val()) {
            if($(this).attr('name')!='actDes'&&$(this).attr('name')!='shareDestUrl') {
                if ($(this).siblings(".warn").length) {
                    $(this).siblings(".warn").css("display", 'block');
                    $(this).css('border', 'solid 1px #d00219');
                }
            }
        }
        else {
            $(this).siblings(".warn").css("display", 'none');
            $(this).css('border', 'solid 1px #cecece')
        }


        //时间插件特殊处理
        if($(this).attr('class')) {
            var timeClass = $(this).attr('class').split(" ");
            for (v in timeClass) {
                if (timeClass[v] == 'startTime' || timeClass[v] == 'endTime') {
                    judegTime($(this));
                }
            }
        }

        //左边预览
       if($(this).attr('name')=='actTitle'){
           $('#leftTopActName').text($(this).val()).css('color','black');
       }
        if($(this).attr('name')=='shareTitle'){
           $('#leftBottomContentActTitle').text($(this).val());
        }
        if($(this).attr('name')=='shareDesc'){
            $('#leftBottomContent p').text($(this).val());
        }
        if($(this).attr('name')=='actImgs'){
            console.log($(this).val());
            act_img_val=$(this).val();
            //console.log($(this).parent().html());
            if (!checkImgType($(this))) {
                    $(this).parent().parent().siblings(".warn").css({"display" :'block','color':'#b1b1b1'});
                    $(this).css('border', 'solid 1px #d00219');
                if(actImgs) {
                    $('#actPhoto').attr('src', 'http://7xio74.com2.z0.glb.clouddn.com/' + actImgs);
                    $('#leftTopImg img').attr('src', 'http://7xio74.com2.z0.glb.clouddn.com/' + actImgs);
                    $('#leftBottomContentImg').attr('src', 'http://7xio74.com2.z0.glb.clouddn.com/' + actImgs);
                }else{
                    $('#actPhoto').attr('src','images/vacancy.jpg');
                    $('#leftTopImg img').attr('src', 'images/actNone.jpg');
                    $('#leftBottomContentImg').attr('src', 'images/vacancy.jpg');
                }
            }
            else {
                $(this).parent().parent().siblings(".warn").css("display", 'none');
                $(this).css('border', 'solid 1px #cecece');
                 var windowURL = window.URL || window.webkitURL;
                var dataURL = windowURL.createObjectURL($(this)[0].files[0]);
                // console.log(($(this)[0].files[0].size)*0.00000095367431640625*1024);
                 $('#actPhoto').attr('src',dataURL);
                 $('#leftTopImg img').attr('src',dataURL);
                 $('#leftBottomContentImg').attr('src',dataURL);

                $.ajaxFileUpload({
                    url : '/omsapi/upload/newimgfile.json',
                    fileElementId : 'actImgs',// 上传控件的id
                    dataType :"JSON",
                    data : {fileID:'actImgs'},
                    success:function (data,status) {
                        var length1=data.indexOf("{");
                        var length2=data.indexOf("}");
                        data=JSON.parse(data.substring(length1,length2+1));
                        actImgs=data.data;
                    }
                });
            }
        }


        if($(this).attr('name')=='joinfansQrcode'){
            if (!$(this).val()) {
                    $(this).parent().siblings(".warn").css("display", 'block');
                    $(this).css('border', 'solid 1px #d00219');
                if(joinfansQrcode){
                    $('#followPhoto').attr('src','http://7xio74.com2.z0.glb.clouddn.com/'+joinfansQrcode);
                }
                else{
                    $('#followPhoto').attr('src','images/vacancy.jpg');
                }
        }
            else {
                $(this).parent().siblings(".warn").css("display", 'none');
                $(this).css('border', 'solid 1px #cecece');
                var windowURL = window.URL || window.webkitURL;
                var dataURL = windowURL.createObjectURL($(this)[0].files[0]);
                $('#followPhoto').attr('src',dataURL);
                $.ajaxFileUpload({
                    url : '/omsapi/upload/newimgfile.json',
                    fileElementId : 'joinfansQrcode',// 上传控件的id
                    dataType :"JSON",
                    data : {fileID:'joinfansQrcode'},
                    success:function (data,status) {
                        var length1=data.indexOf("{");
                        var length2=data.indexOf("}");
                        data=JSON.parse(data.substring(length1,length2+1));
                        joinfansQrcode=data.data;
                    }
                })


            }

        }
    },
    'blur':function () {
        console.log('blur');
        //判定是否警告
        if (!$(this).val()) {
            console.log($(this).attr('name')!='actDes');
            if ($(this).attr('name') != 'actDes'&&$(this).attr('name')!='shareDestUrl') {
                console.log(1);
                if ($(this).siblings(".warn").length) {
                    $(this).css('border', 'solid 1px #d00219').siblings(".warn").css("display", 'block');
                }
            }
            else{
                console.log(2);
                $(this).css('border', 'solid 1px #cecece');
            }
        }
        else {
            $(this).css('border', 'solid 1px #cecece').siblings(".warn").css("display", 'none');
        }


        //时间插件特殊处理
        if($(this).attr('class')) {
            var timeClass = $(this).attr('class').split(" ");
            for (v in timeClass) {
                if (timeClass[v] == 'startTime' || timeClass[v] == 'endTime') {
                    judegTime($(this));
                }
            }
        }


    }


});

//判断上传图片大小
/*
 * 判断图片类型
 *
 * @param ths
 *          type="file"的javascript对象
 * @return true-符合要求,false-不符合
 */
function checkImgType(ths){
    if (ths.val() == "") {
        alert("请上传图片");
        return false;
    }
        else {
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ths.val())) {
            alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
            ths.val("");
            return false;
        }

        else
        {
             var size=(ths[0].files[0].size)*0.00000095367431640625*1024;
             if(size>900){
                 alert('图片大小不超过900K');
                 return false;
             }


        }
    }
    return true;
}

function judegTime(t) {
    var _this=t;
    setTimeout(function () {
        if (! _this.val()) {
            $("."+_this.attr('id')).css("display", 'inline');
            _this.css('border', 'solid 1px #d00219');
        }
        else {
            $("."+_this.attr('id')).css("display", 'none');
            _this.css('border', 'solid 1px #cecece')
        }
    },300);
}


/**
 * 获取参数
 * @returns {*}
 */

function getParams() {
    var data={};
     if(actType=='3'){
         if($('#price').val()>0){
             data.price=parseInt($('#price').val())*100;
         }
         else{
             return '活动参与金额不能小于0;'
         }
     }
    data.actBaseinfo={};
    if(productId){
        data.actBaseinfo.productId=productId;
    }
    //actType
    if("undefined" == typeof(actId)){

    }else{
        data.actBaseinfo.actId=actId;
    }
    data.actBaseinfo.actType=actType;
    //判定活动标题是否存在
    if(!$("input[name=actTitle]").val()){
        return "活动名称不存在";
    }
    else{
        data.actBaseinfo.actTitle=$("input[name=actTitle]").val();
    }
    //分享地址是否存在，现不判断
    // if(!$("input[name=shareUrl]").val()){
    //     return "分享地址不存在";
    // }
    // else{
        data.actBaseinfo.shareDestUrl=$("input[name=shareDestUrl]").val();
    // }
    //分享标题是否存在
    if(!$("input[name=shareTitle]").val()){
        return "分享标题不存在";
    }
    else{
        data.actBaseinfo.shareTitle=$("input[name=shareTitle]").val();
    }
    //分享描述是否存在
    if(!$("input[name=shareDesc]").val()){
        return "分享描述不存在";
    }
    else{
        data.actBaseinfo.shareDesc=$("input[name=shareDesc]").val();
    }
    //添加活动说明
    data.actBaseinfo.actDesc=$("#actDesc").val();

    //活动奖品
    data.actBaseinfo.prizeWay=$('label.checked').children('input[name=prizeWay]').attr('value');
    if($('label.checked').children('input[name=prizeWay]').attr('value')==0){
      //线上发奖操作
        data.actPrizeList=[];
        data.actPrizeList[0]={};
        if($('#autoAwardsNumber').val()>0){
            data.actPrizeList[0].totalAmount=$('#autoAwardsNumber').val();
        }else{
            return "请确认奖品份数";
        }
        if(couponList&&couponList.length>0){
            data.actPrizeList[0].actPrizeObjects=[];
            for(v in couponList){
               for(t in allCoupon){
                   if(couponList[v].couponId==allCoupon[t].couponId){
                       data.actPrizeList[0].actPrizeObjects[v]={};
                       data.actPrizeList[0].actPrizeObjects[v].objType=allCoupon[t].couponType;
                       data.actPrizeList[0].actPrizeObjects[v].objName=allCoupon[t].couponName;
                       data.actPrizeList[0].actPrizeObjects[v].couponId=allCoupon[t].couponId;
                       data.actPrizeList[0].actPrizeObjects[v].objAmount=couponList[v].number;
                       data.actPrizeList[0].actPrizeObjects[v].effectiveTime=allCoupon[t].effectiveTime;
                       data.actPrizeList[0].actPrizeObjects[v].expiredTime=allCoupon[t].expireTime;
                       data.actPrizeList[0].actPrizeObjects[v].objFaceValue=allCoupon[t].faceValue;
                       data.actPrizeList[0].actPrizeObjects[v].effectiveTime=allCoupon[t].effectiveTime;
                       if(allCoupon[t].picUrl){
                           data.actPrizeList[0].actPrizeObjects[v].objImg=getImgNum(allCoupon[t].picUrl);
                       }
                       // data.actPrizeList[0].actPrizeObjects[v].objImg=getImgNum(allCoupon[t].picUrl);
                   }
               }
            }
        }
        else{
            return '请确认线上发奖奖券;'
        }
    }
    else{
        //线下发奖操作
        data.actPrizeList=[];
        data.actPrizeList[0]={};
        data.actPrizeList[0].actPrizeObjects=[];
        data.actPrizeList[0].actPrizeObjects[0]={};
      if($("#prizeName").val()){
         data.actPrizeList[0].actPrizeObjects[0].objName=$("#prizeName").val();
          data.actPrizeList[0].actPrizeObjects[0].objAmount=1;
      }
        else{
          return "请输入线下发奖奖品名称";
      }
        if($("#totalAmount").val()>0){
            data.actPrizeList[0].totalAmount=$("#totalAmount").val();
        }
        else{
            return "请确认奖品份数";
        }
        if($("#contactWay").val()){
            data.actBaseinfo.contactWay=$("#contactWay").val();
        }
        else{
            return "请确认领奖联系电话";
        }
    }

    //活动开始与结束时间
    if(!$("input[name=actBeginTime]").val()){
        return "活动开始时间不存在";
    }
    else{
        data.actBaseinfo.actBeginTime=timestap($("input[name=actBeginTime]").val());
    }
    if(!$("input[name=actEndTime]").val()){
        return "活动结束时间不存在";
    }
    else{
        data.actBaseinfo.actEndTime=timestap($("input[name=actEndTime]").val());
    }
    if(parseInt(timestap($("input[name=actEndTime]").val()))<parseInt(timestap($("input[name=actBeginTime]").val()))){
        return "活动结束时间不能早于开始时间";
    }

    //开奖时间
    data.actBaseinfo.pubType=$('label.checked').children('input[name=awardWay]').attr('value');
    if($('label.checked').children('input[name=awardWay]').attr('value')=='0'){
           //自动开奖，时间由系统指定
    }
    else{
        //指定时间开奖
        if(!$("input[name=actPubTime]").val()){
            return "未指定时间开奖";
        }
        else{
            data.actBaseinfo.actPubTime=timestap($("input[name=actPubTime]").val());
        }
    }

    //参与资格
    data.actBaseinfo.allowUser=$('label.checked').children('input[name=allowUser]').attr('value');

    //拿抽奖码条件
    data.actBaseinfo.switchShare=$('label.checked').children('input[name=switchShare]').attr('value');

    //是否需要关注
    data.actBaseinfo.switchJoinfans=$('label.checked').children('input[name=switchJoinfans]').attr('value');
    //是否存在活动图片
        if(actImgs) {
            data.actBaseinfo.actImgs = actImgs;
        }else{
            return "活动图片不存在或上传失败";
        }
    //是否存在二维码
    data.actBaseinfo.switchJoinfans=$('label.checked').children('input[name=switchJoinfans]').attr('value');
    if($('label.checked').children('input[name=switchJoinfans]').attr('value')=='1'&&isJihe!='1'){
             //需要二维码
             if(joinfansQrcode) {
                 data.actBaseinfo.joinfansQrcode = joinfansQrcode;
             }else{
                 return "二维码上传失败或不存在";
             }
         }


    else{
         //不需要二维码
     }
      if(isJihe=='1'&&$('label.checked').children('input[name=switchJoinfans]').attr('value')=='1'){
      data.actBaseinfo.joinfansWeixinid=$('#joinfans_weixinid').val();
    }

    return data;

}


/**
 * 保存事件
 */
$("#save").click(function () {
    var data=getParams();
    console.log(data);
    if(typeof(data)=="string"){
        jiHeAlert.open(data);
    }
    else{
        $.ajax({
            type:'post',
            url:'/activity/bms/update',
            data:{data:JSON.stringify(data)},
            success:function (resp) {
                if(resp.sc=='0'){
                  if("undefined" == typeof(actId)){
                    jiHeAlert.open('活动创建成功');
                  }else{
                    jiHeAlert.open('活动更新成功');
                  }
                    setTimeout(function () {
                        window.location.href='../BMSListActive/BMSListActive.html';
                    },1500)
                }
                else{
                    alert(resp.ErrorMsg);
                }
            }
        })
    }
})

//时间转换时间戳
function timestap(a) {
    var str = a; // 日期字符串
    //str = str.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
    var date = new Date(str); // 构造一个日期型数据，值为传入的字符串
    var time = date.getTime();
    //时间戳转秒级时间戳
    // time=time+'';
    // time=time.substring(0,time.length-3);
    return time;
}
//时间戳转化时间
function timestapToTime(nS) {
    // console.log(new Date(parseInt(nS)).toLocaleString());
    var time1=new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    var time2=time1.split(" ");
    var time3=time2[0].split('/');
    var time4=time2[1].split('午');
    // console.log(time4);
    var time5=time4[1].split(':');
    var ytd='',time='';
    for(v in time3){
        if(ytd==''){
            ytd=time3[v];
        }
        else{
            if(parseInt(time3[v])<10){
                time3[v]='0'+time3[v];
            }
            ytd=ytd+'/'+time3[v];
        }
    }
      if(time4[0]=='下'){
          time5[0]=parseInt(time5[0])+12;
          time=time5[0]+":"+time5[1];
      }
    else{
          if(time5[0]<10){
              time5[0]='0'+time5[0];
          }
          time=time5[0]+":"+time5[1];
      }
      timeT=time.split(':');
    if(timeT[0]=='12'){
        // time='00:00';
        time='00:'+timeT[1];
    }
    else if(timeT[0]=='24'){
        // time='12:00';
        time='12:'+timeT[1];
    }


   return ytd+" "+time;

}
//获取商户奖券信息
$.ajax({
    url:"/coupon/bms/baseinfos",
    type:'post',
    data:{},
    success:function (resp) {
        var data=resp.data;
        allCoupon=resp.data;
        var a=0,b=0;
        for(v in data){
            if(data[v].couponType=='1'){
                if(a==0){
                    $('.roomVouchers').text('');
                    a++;
                }
                var div=$('<div class="checkbox"></div>');
                var label=$('<label></label>');
                var input=$('<input type="checkbox" name="roomVouchers"/>');
                input.attr('value',data[v].couponId+'|'+data[v].couponName);
                label.append(input);
                label.append(data[v].couponName);
                div.append(label);
                $('.roomVouchers').append(div);

            }
            else if(data[v].couponType=='5'){
                if(b==0){
                    $('.coupon').text('');
                    b++;
                }
                var div=$('<div class="checkbox"></div>')
                var label=$('<label></label>');
                var input=$('<input type="checkbox" name="roomVouchers"/>');
                input.attr('value',data[v].couponId+'|'+data[v].couponName);
                label.append(input);
                label.append(data[v].couponName);
                div.append(label);
                $('.coupon').append(div);
            }
        }



    }
})

//添加奖品弹出框
$('#addAwards').click(function () {
    modalService.open({
        title:"添加奖品",
        height:"330" ,
        width:"500",
        content:"awardOut"
    })
});
//获取多选框值,并进行操作
function getCheckAdIds() {
    var adIds = [];
    $("input:checkbox[name=roomVouchers]:checked").each(function(i){
        var _this=$(this).val().split('|');
        adIds[i]={couponId:_this[0],couponName:_this[1],number:1};
    });
     console.log(adIds);
    couponList=adIds;
    setUp(adIds);
    modalService.close();


}
function a() {
    $('.awardOutTopContent1').attr('class','awardOutTopContent1 onAwardOutTop ');
    $('.awardOutTopContent2').attr('class','awardOutTopContent2');
    $('.bigRoomVouchers').css('display','block');
    $('.bigCoupon').css('display','none');
}

function b() {
    $('.awardOutTopContent2').attr('class','awardOutTopContent2 onAwardOutTop');
    $('.awardOutTopContent1').attr('class','awardOutTopContent1');
    $('.bigRoomVouchers').css('display','none');
    $('.bigCoupon').css('display','block');
}


function setUp(list) {
    $('#autoAwardsContent').empty();
    console.log('setUp');
    for(v in list){
         var div=$('<div style="margin-top: 10px"></div>');
        var span1=$('<span class="autoAwardsName">'+list[v].couponName+'</span>');
        var span2=$('<span class="reduce">-</span>');
        var span3=$('<span class="number">'+list[v].number+'</span>');
        var span4=$('<span class="plus">+</span>');
        var a=$('<a class="delete">删除</a>')
        div.append(span1);
        div.append(span2);
        div.append(span3);
        div.append(span4);
        div.append(a);
        $('#autoAwardsContent').append(div);
    }
    $('.reduce').click(function () {
        if(parseInt($(this).siblings('.number').text())>1) {
            var number = parseInt($(this).siblings('.number').text()) - 1;
            $(this).siblings('.number').text(number);
            var _thisName = $(this).siblings('.autoAwardsName').text();
            for (v in couponList) {
                if (couponList[v].couponName == _thisName) {
                    couponList[v].number = number;
                }
            }
        }

    })
    $('.plus').click(function () {
        if(parseInt($(this).siblings('.number').text())<10) {
            var number = parseInt($(this).siblings('.number').text()) + 1;
            $(this).siblings('.number').text(number);
            var _thisName = $(this).siblings('.autoAwardsName').text();
            for (v in couponList) {
                if (couponList[v].couponName == _thisName) {
                    couponList[v].number = number;
                }
            }
        }

    })
    $('.delete').click(function () {
        var _thisName=$(this).siblings('.autoAwardsName').text();
        for(v in couponList){
            if(couponList[v].couponName==_thisName){
                couponList.splice(v,1);
            }
        }
        $(this).parent().remove();
    })
}

//解析url取得图片数字
function getImgNum(str) {
    var index=str.lastIndexOf('/');
    if(index!=-1){
        return  str.substring(index+1,str.length);
    }
    else{
        return str;
    }
}
//解析url获取是否是创建或者是修改；
function getUrl() {
    var str=location.search;
    var str=str.substring(1,str.length);
    if(str!="") {
        var obj = str.split('=');
        if (obj[0] == 'actId') {
            actId = obj[1];
        }
        else if (obj[0] = 'actType') {
            actType = obj[1];
        }
        else {
            actType = '1';
        }
    } else{
        actType='1';
    }
}

function evaluate(data) {
    if(actType=='3'){
        $('#price').val(parseInt(data.productinfo.price));
        productId=data.productinfo.productId;
    }
    $('input[name=actTitle]').val(data.actBaseinfo.actTitle);
    $('#leftTopActName').text(data.actBaseinfo.actTitle);
    $('#leftBottomContentActTitle').text(data.actBaseinfo.shareTitle);
    $('#leftBottomContent p').text(data.actBaseinfo.shareDesc);
    $('input[name=shareDestUrl]').val(data.actBaseinfo.shareDestUrl);
    $('input[name=shareTitle]').val(data.actBaseinfo.shareTitle);
    $('input[name=shareDesc]').val(data.actBaseinfo.shareDesc);
    $('#actDesc').val(data.actBaseinfo.actDesc);
    $('input[name=actBeginTime]').val(timestapToTime(data.actBaseinfo.actBeginTime));
    $('input[name=actEndTime]').val(timestapToTime(data.actBaseinfo.actEndTime));
    $('#leftTopImg img').attr('src','http://7xio74.com2.z0.glb.clouddn.com/'+data.actBaseinfo.actImgs);
    $('#actPhoto').attr('src','http://7xio74.com2.z0.glb.clouddn.com/'+data.actBaseinfo.actImgs);
    $('#leftBottomContent img').attr('src','http://7xio74.com2.z0.glb.clouddn.com/'+data.actBaseinfo.actImgs);
    actImgs=data.actBaseinfo.actImgs;
     if(data.actBaseinfo.switchJoinfans=='1'){
         joinfansQrcode=data.actBaseinfo.joinfansQrcode;
         $('#followPhoto').attr('src','http://7xio74.com2.z0.glb.clouddn.com/'+joinfansQrcode);
     }
    //活动奖品
    $('#firstLabel').removeAttr('class', 'checked');
    $('input[name=prizeWay]').removeAttr('checked');
    $('input[name=prizeWay]').each(function () {
        console.log($(this).val());
        if($(this).val()==data.actBaseinfo.prizeWay){
            console.log(1);
            console.log($(this).parent());
            $(this).parent().attr('class','checked');
           // $('#' + $('#firstLabel').attr('name')).attr('checked', 'checked');
        }
    });
    /**
     * 判断显示的样式
     */
    if ($('#awards label.checked').children('input[name=prizeWay]').attr('value') == '0') {
        $("#autoAwards").css('display', 'block');
        $("#manAwards").css('display', 'none');
    }
    else {
        $("#autoAwards").css('display', 'none');
        $("#manAwards").css('display', 'block');
    }
    $('#awards label').click(function () {
        var radioId = $(this).attr('name');
        // console.log($('label.awardsLabel').html());
        $('#awards label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=prizeWay]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=prizeWay]').attr('value'));
        /**
         * 判断显示的样式
         */
        if ($('#awards label.checked').children('input[name=prizeWay]').attr('value') == '0') {
            $("#autoAwards").css('display', 'block');
            $("#manAwards").css('display', 'none');
        }
        else {
            $("#autoAwards").css('display', 'none');
            $("#manAwards").css('display', 'block');
        }

    });

     //根据判断的活动奖品来判定显示的内容
       if(data.actBaseinfo.prizeWay==0){
          $('#autoAwardsNumber').val(data.actPrizeList[0].totalAmount);
           $('#autoAwardsNumberFor').text(data.actPrizeList[0].totalAmount);
            var a=data.actPrizeList[0].actPrizeObjects;
           for(v in a){
               couponList[v]={};
               couponList[v].couponName=a[v].objName;
               couponList[v].couponId=a[v].couponId;
               couponList[v].number=a[v].objAmount;
           }
           setUp(couponList);

       }
    else{
             if(data.actPrizeList[0].actPrizeObjects){
                 $('#prizeName').val(data.actPrizeList[0].actPrizeObjects[0].objName);
             }
           $('#totalAmount').val(data.actPrizeList[0].totalAmount);
           $('#totalAmountFor').text(data.actPrizeList[0].totalAmount);
           $('input[name=awardsTelephone]').val(data.actBaseinfo.contactWay);
       }

    //开奖时间
    $('#awardsTimeFirstLabel').removeAttr('class', 'checked');
    $('input[name=awardWay]').removeAttr('checked');
    $('input[name=awardWay]').each(function () {
        console.log(data.actBaseinfo.awardWay);
        if($(this).val()==data.actBaseinfo.pubType){
            console.log(1);
            console.log($(this).parent());
            $(this).parent().attr('class','checked');
            // $('#' + $('#firstLabel').attr('name')).attr('checked', 'checked');
        }
    })
    $('#awardsTime label').click(function () {
        var radioId = $(this).attr('name');

        $('#awardsTime label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=awardWay]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=awardWay]').attr('value'));
        /**
         * 判断显示的样式
         */
        if ($('#awardsTime label.checked').children('input[name=awardWay]').attr('value') == '0') {
            $("#autoLottery").css('display', 'block');
            $("#manLottery").css('display', 'none');
        }
        else {
            $("#autoLottery").css('display', 'none');
            $("#manLottery").css('display', 'block');
        }

    });

    //参与资格
    $('#partIn').removeAttr('class', 'checked');
    $('input[name=allowUser]').removeAttr('checked');
    $('input[name=allowUser]').each(function () {
        if($(this).val()==data.actBaseinfo.allowUser){
            $(this).parent().attr('class','checked');
        }
    })
    $('#canPartIn label').click(function () {
        var radioId = $(this).attr('name');

        $('#canPartIn label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=allowUser]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=allowUser]').attr('value'));
    });

    //需要关注
    $('#followFirst').removeAttr('class', 'checked');
    $('input[name=switchJoinfans]').removeAttr('checked');
    $('input[name=switchJoinfans]').each(function () {
        if($(this).val()==data.actBaseinfo.switchJoinfans){
            $(this).parent().attr('class','checked');
        }
    })
    if(data.actBaseinfo.joinfansWeixinid){
      $('#joinfans_weixinid').val(data.actBaseinfo.joinfansWeixinid);
    }
    /**
     * 判断显示的样式
     */
    if ($('#follow label.checked').children('input[name=switchJoinfans]').attr('value') == '1') {
        $('#needFollow').css('display', 'block');
    }
    else {
        $('#needFollow').css('display', 'none');
    }

    $('#follow label').click(function () {
        var radioId = $(this).attr('name');

        $('#follow label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
        $('input[name=switchJoinfans]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
        console.log($('label.checked').children('input[name=switchJoinfans]').attr('value'));

        /**
         * 判断显示的样式
         */
        if ($('#follow label.checked').children('input[name=switchJoinfans]').attr('value') == '1') {
            $('#needFollow').css('display', 'block');
        }
        else {
            $('#needFollow').css('display', 'none');
        }

    });

        //需要分享朋友圈
        $('#conditionFirst').removeAttr('class', 'checked');
        $('input[name=switchShare]').removeAttr('checked');
        $('input[name=switchShare]').each(function () {
            if($(this).val()==data.actBaseinfo.switchShare){
                $(this).parent().attr('class','checked');
            }
        })
        $('#condition label').click(function () {
            var radioId = $(this).attr('name');

            $('#condition label').removeAttr('class', 'checked') && $(this).attr('class', 'checked');
            $('input[name=switchShare]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
            console.log($('label.checked').children('input[name=switchShare]').attr('value'));

        });


}

$('#saveAndCopy').click(function () {
    var data=getParams();
    console.log(data);
    if(typeof(data)=="string"){
        jiHeAlert.open(data);
    }
    else{
        $.ajax({
            type:'post',
            url:'/activity/bms/update',
            data:{data:JSON.stringify(data)},
            success:function (resp) {
                if(resp.sc=='0'){
                    var data={
                      actId:resp.data
                    };
                    $.ajax({
                        type:'post',
                        url:'/activity/bms/info',
                        data:{
                            data:JSON.stringify(data)
                        },
                        success:function (resp) {
                            if(resp.sc=='0'){
                                console.log(resp.data);
                                var data=resp.data;
                                $('.creator').text(data.actBaseinfo.creator);
                                if(data.actBaseinfo.joinfansQrcode){
                                    $('.actDescOutContent1Vacancy').attr('src', 'http://7xio74.com2.z0.glb.clouddn.com/' + data.actBaseinfo.joinfansQrcode);
                                }
                                else{
                                    $('.actDescOutContent1Vacancy').attr('src','http://test.jiheclub.com/activity/bms/qrcode?data={"actId":'+data.actBaseinfo.actId+'}');
                                }
                                $('.actDescOutContent1EndTime').text(timestapToTime(data.actBaseinfo.actEndTime));
                                $('.actDescOutContent1PubTime').text(timestapToTime(data.actBaseinfo.actPubTime));
                                   var lotteryRules= data.actBaseinfo.lotteryRules.split('。',2);
                                $('.actDescOutContent1Number').text(lotteryRules[0]);
                                if(data.actPrizeList[0].prizeName){
                                    $('.actDescOutContent1Award').text(data.actPrizeList[0].prizeName);
                                }
                                if( data.actPrizeList[0].actPrizeObjects) {
                                    $('.actDescOutContent1Award').text(' ');
                                    for (v in data.actPrizeList[0].actPrizeObjects) {
                                        $('.actDescOutContent1Award').append('<span>' + data.actPrizeList[0].actPrizeObjects[v].objName + '*' + data.actPrizeList[0].actPrizeObjects[v].objAmount + ';</span><br/>')
                                    }
                                }
                                $('.actDescOutContent1AwardTime').text(timestapToTime(data.actBaseinfo.actPubTime));
                                $('.actDescOutContent1Info').text(lotteryRules[1]);
                                modalService.open({
                                    title: '复制活动说明',
                                    width: '410',
                                    height: '580',
                                    content: 'actDescOut'
                                })


                            }else{
                                alert('获取详情失败');
                            }
                        }
                    })
                }
                else{
                    alert(resp.ErrorMsg);
                }
            }
        })
    }

});

var copyMesT=0;
//复制活动
function copyMes() {

    html2canvas($('#mry-opo'),{
        height: $("#mry-opo").outerHeight() + 20,
        onrendered: function (canvas) {

            // var image =canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
            // window.location.href=image; // it will save locally
            if(copyMesT==0){
                copyMesT=1;
                copyMes();
            }
            else{
                copyMesT=0;
                var image =canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
                window.location.href=image; // it will save locally
            }
        }

    })

}
//请求
$.ajax({
    type:'post',
    url:'/activity/bms/list/url',
    success:function (resp) {
        if(resp.sc=='0'){
            $('.hotelName').text(resp.data.hotelName);
            $('.actConfigContentUrl').text(resp.data.listLink);
        }

    }
})
function getActIn() {
    modalService.open({
        title:'配置活动入口',
        width:'600',
        height:'500',
        content:'actConfig'
    })
}

function copyUrl() {
    var actConfigContentUrl=$('.actConfigContentUrl');
    actConfigContentUrl.select();
    document.execCommand('copy');
    // alert('已成功复制1');
     jiHeAlert.open('已成功复制链接');
}

function getWeiXinArt() {
    modalService.open({
        title:'复制微信文章地址',
        width:'603',
        height:'340',
        content:'copyArtUrl'

    });
}
