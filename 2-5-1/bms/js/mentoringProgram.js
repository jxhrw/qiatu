$(document).ready(function() {
    $(".mask4").css('height', $(window).height());
	$.post('/member/bms/points/coopreport/thismonth', function(data) {
		console.log(data)
        if(data.sc==0){
            $(".mentoringProgramTimeWrap span").eq(1).html(data.data.endTime);
            $(".mentoringProgramTimeWrap span").eq(0).html(data.data.startTime); 
            var developMembers;
            var cooperationIncome;
            var cooperationCost;
            var payment;
            if(data.data.hotelData.developMembers==undefined&&data.data.hotelData.coopIncome==undefined&&data.data.hotelData.coopCost==undefined&&data.data.hotelData.payment==undefined){
                var developMembers=0;
                var cooperationIncome=0;
                var cooperationCost=0;
                var payment=0;
            }
            else{
                var developMembers=data.data.hotelData.developMembers;
                var cooperationIncome=data.data.hotelData.coopIncome/100;
                var cooperationCost=data.data.hotelData.coopCost/100;
                var payment=data.data.hotelData.payment/100;
            }
            $("#mentoringProgram1 .hovertable").append('<tr><td>'+developMembers+'</td><td>'+cooperationIncome+'</td><td>'+cooperationCost+'</td><td>'+payment+'</td></tr>')
            
            if(data.data.channelData.length==0){
                $("#mentoringProgram2").hide();
            }
            else{
                $("#mentoringProgram2").show();
                for (var i = 0; i <data.data.channelData.length; i++) {
                    $("#mentoringProgram2 .hovertable").append('<tr><td>'+data.data.channelData[i].hotelChannel+'</td><td>'+data.data.channelData[i].developMembers+'</td><td>'+data.data.channelData[i].coopIncome/100+'</td></tr>')
                }; 
            }

            


            
        }
	})
    var data1={"pageNo":1,"pageCnt":20}
    $.post('/member/bms/points/coopreport/hotel', {data: JSON.stringify(data1)}, function(data) {
        console.log(data)
        if(data.sc==0){
            if(data.data.length==0){
                $("#mentoringProgram3").hide();
                $(".mentoringProgramTitle").hide();
            }
            else{
                for (var i = 0; i <data.data.length; i++) {

                   $("#mentoringProgram3 .hovertable").append('<tr><td>'+data.data[i].month+'</td><td>'+data.data[i].developMembers+'</td><td>'+data.data[i].coopIncome/100+'</td><td>'+data.data[i].coopCost/100+'</td><td>'+data.data[i].payment/100+'</td><td>待核算 </td><td><strong>渠道明细</strong></td></tr>')
                    if(data.data[i].status!=0){
                        $("#mentoringProgram3 .hovertable tr").eq(i+1).children('td').eq(5).html("核算中")
                    }
                    
                };
            }
        }
    })

$("#mentoringProgram3 .hovertable tr td strong").live('click', function(event) {
    var aa=$(this).parent("td").parent("tr").index();
    $(".mask4").css('display', 'block');
    $(".recordIfr").attr('src', '/html/bms/channelDetail.html?member_hotelid='+$("#mentoringProgram3 .hovertable tr").eq(aa).children('td').eq(0).html());
    // var data1={"yearMonth":$("#mentoringProgram3 .hovertable tr").eq(aa).children('td').eq(1).html()}
    //  $.post('/member/bms/points/coopreport/channel',{data: JSON.stringify(data1)}, function(data) {
    //     console.log(data)
    //     if(data.sc==0){
    //        $(".mask4").css('display', 'block');
    //     }
        
    //  })
});
$(".maskClose").click(function(event) {
    $(this).parent().parent().parent().css('display', 'none');
});

});
 // function formatNum(num){//补0
 //        return num.toString().replace(/^(\d)$/, "0$1");
 //    }
 //    function formatStrDate(vArg){//格式化日期
 //        switch(typeof vArg) {
 //            case "string":
 //                vArg = vArg.split(/-|\//g);
 //                return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
 //                break;
 //            case "object":
 //                return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
 //                break;
 //    }
 //  }
 //   function formatStrDate1(vArg){//格式化日期
 //        switch(typeof vArg) {
 //            case "string":
 //                vArg = vArg.split(/-|\//g);
 //                return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
 //                break;
 //            case "object":
 //                return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1);
 //                break;
 //    }
 //  }