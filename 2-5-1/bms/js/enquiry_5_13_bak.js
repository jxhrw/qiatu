$(document).ready(function() {
	$(".mask1").css('height', $(window).height());
	$(".mask2").css('height', $(window).height());
	$(".mask3").css('height', $(window).height());
	$(".mask4").css('height', $(window).height());
	$(".mask").css('height', $(window).height());
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
	
	// $(".mask1 .alertRight").css({
	// 	"display": 'block',
	// });
	$(".bmsEnquiryBottom").css('width', $(window).width()-60)
	var data={"accountname":id}
				// console.log(JSON.stringify(data))
		$.post('/user/bmsh5/infobyaccount', {data: JSON.stringify(data)}, function(data) {
			console.log(data)
		 if(data.sc=="0"){
		 	$(".bmsEnquiry").show()
			$(".memberEqUid").html(data.data.uid)
			$(".bmsEnquiryTopLeft li").eq(0).children('span').html(data.data.realname);
			$(".bmsEnquiryTopLeft li").eq(1).children('span').html(data.data.mobileAccount.accountName);
			if(data.data.memberInfo.memberGrade==0){
				$(".bmsEnquiryTopLeft li").eq(2).children('span').html("1、会员欢迎礼物<br/> 2、积分返利 ");
			}
			else if(data.data.memberInfo.memberGrade==1){
				$(".bmsEnquiryTopLeft li").eq(2).children('span').html("1、会员欢迎礼物 <br/>2、订房-优先候补<br/> 3、住二赠一（以积分形式赠送，一权益年一次）  ");
			}
			else if(data.data.memberInfo.memberGrade==2){
				$(".bmsEnquiryTopLeft li").eq(2).children('span').html("1、会员欢迎礼物<br/> 2、订房-优先候补 <br/>3、升房-房型任选<br/> 4、住一赠一（以积分形式赠送，一权益年一次） ");
			}
			$(".bmsEnquiryTopCenter li").eq(0).children('span').html(data.data.memberCode);
			$(".bmsEnquiryTopCenter li").eq(1).children('span').html(data.data.memberInfo.memberGradeDesc+"会员");
			$(".bmsEnquiryTopCenter li").eq(2).children('span').html(data.data.memberInfo.points);
			 var data1={"userid":data.data.uid}
     		$.post('/member/bms/points/reward/list', {data: JSON.stringify(data1)}, function(result) {
    			console.log(result)
    			if(result.sc=="0"){
    				if(result.data.result.length==0){
    					$(".bmsEnquiryBottom").css('display', 'none');
    				}

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
    					var checkin=formatStrDate( new Date(parseInt(result.data.result[i].checkin)))
    					var checkout=formatStrDate( new Date(parseInt(result.data.result[i].checkout)))
    					$('.hovertable').append('<tr class="hovertableContent"><td>住宿<br/><em>自动抓取</em><em>手工录入</em></td><td>'+data.data.realname+'</td><td>'+result.data.result[i].memberGradeDesc+'</td><td>'+data.data.mobileAccount.accountName+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td>'+result.data.result[i].amount/100+'</td><td class="roomnights">'+roomName+'</td><td>'+otaName+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.result[i].id+'</td><td class="pointstype" style="display:none">'+result.data.result[i].pointsType+'</td><td class="uid" style="display:none">'+result.data.result[i].uid+'</td></tr>')
    					if(result.data.result[i].recordSource==1){
              $('.hovertableContent').eq(i).children('td').eq(0).children("em").eq(1).hide();
            }
            else{
              $('.hovertableContent').eq(i).children('td').eq(0).children("em").eq(0).hide();
            }
    					//status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
    					if(result.data.result[i].status!=0){
    						$('.hovertable tr').eq(i+1).children('td').children('strong').css('display', 'none');
    						if(result.data.result[i].status==1){
    							$('.hovertable tr').eq(i+1).children('td').children('span').hover(function() {
    								$(this).css({
    									'text-decoration': 'underline',
    									'color': '#d13f4c'
    								});
    							}, function() {
    								$(this).css({
    									'text-decoration': 'none',
    									'color': '#333'
    								});
    							});
    						}
    						else{
    							$(".hovertable tr").eq(i+1).children('td').children('span').eq(0).css('display', 'none');
               					$(".hovertable tr").eq(i+1).children('td').children('span').eq(1).css('display', 'none');
    						}
    					}
    					else{
    						$('.hovertable tr').eq(i+1).children('td').children('span').hover(function() {
    							$(this).css({
    								'text-decoration': 'underline',
    								'color': '#d13f4c'
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
    				$('.hovertable tr').eq(i+1).children('.roomnights').html("");
    				$('.hovertable tr').eq(i+1).children('.checkout').html("");
    				$('.hovertable tr').eq(i+1).children('td').eq(0).html("非住宿").css('background-color', '#e4e6e3');
    			}
    			 if(result.data.result[i].isFirstConsume==0){
                    $(".hovertable tr").eq(i+1).children('td').eq(1).css({
                        "background": 'none'
                    });
                }
                else{
                    $(".hovertable tr").eq(i+1).children('td').eq(1).css({
                        "background": 'url(/html/bms/images/fristIcon.png) left top no-repeat',
                        "-webkit-background-size": '40px',
                        "background-size": '40px'
                    });
                     $(".hovertable tr").eq(i+1).children('td').eq(1).hover(function() {
                     	$(this).append('<i>商户新加入会员首次住宿消费，由积分中心向用户支付返利积分，商户无需支出。</i>');
                    }, function() {

                      $(this).children('i').remove();
                    });
                }
    		};

            	}
          	})
		}
		else{
			$(".bmsEnquiry").hide()
			alert(data.ErrorMsg)
		}
			
	})


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
//submit
// $(".hovertable td strong").live('click', function(event) {
// 	var e=$(this).parent("td").parent("tr").index()
    	
//     	var data2={"id":$(".hovertable tr").eq(e).children('.delId').html()}
//     	// console.log(JSON.stringify(data2))
//     	$.post('/member/bms/points/reward/commit', {data: JSON.stringify(data2)}, function(res) {
//     		console.log(res)
//     		if(res.sc==0){

//     			alert("提交成功")
//     			$(".hovertable tr").eq(e).children('td').children('strong').remove();
//     		}
    		
//     	})
// }); 
//删改
$(".hovertable tr span").live('click', function(event) {
	if($(this).index()==1){
		$(".mask2").css('display', 'block');
		// $(this).parent("td").parent('tr').attr('id', '0');
		var e=$(this).parent("td").parent('tr').index();
		$(".none3").html(e)
		
		
	}
	else if($(this).index()==0){
		var e=$(this).parent("td").parent('tr').index();
		$(".mask3").css('display', 'block');
		// alert("message")
		$(".mask3 .alertRight").css('display', 'none');
		$(".mask3 .alertLeft #J_DepDate2").val($(".hovertable tr").eq(e).children('td').eq(4).html())
		$(".mask3 .alertLeft #J_EndDate2").val($(".hovertable tr").eq(e).children('td').eq(5).html())
		$(".mask3 .alertLeft .roomNights").val($(".hovertable tr").eq(e).children('td').eq(7).html())
		$(".mask3 .alertLeft .amount").val($(".hovertable tr").eq(e).children('td').eq(6).html())
		$(".mask3 .alertLeft .dl1 dd").html($(".hovertable tr").eq(e).children('td').eq(3).html()).css('color', '#000');
		 $(".none3").html(e)
		if($(".hovertable tr").eq(e).children('.pointstype').html()==11){
			$(".mask3 .alertLeft dl").eq(2).show();
			$(".mask3 .alertLeft dl").eq(4).show();
			
		}
		else if($(".hovertable tr").eq(e).children('.pointstype').html()==12){

			$(".mask3 .alertLeft dl").eq(2).css('display', 'none');
			$(".mask3 .alertLeft dl").eq(4).css('display', 'none');
			$(".mask3 .alertLeft #J_DepDate2").val($(".hovertable tr").eq(e).children('td').eq(4).html())
		// $(".mask3 .alertLeft #J_EndDate2").val($(".hovertable tr").eq(e).children('td').eq(5).html())
		// $(".mask3 .alertLeft .roomNights").val($(".hovertable tr").eq(e).children('td').eq(6).html())
		$(".mask3 .alertLeft .amount").val($(".hovertable tr").eq(e).children('td').eq(6).html())
			
		}
		
	}
	else if($(this).index()==2){
		$(".mask4").css('display', 'block');
		var e=$(this).parent("td").parent('tr').index();
		$(".recordIfr").attr('src', '/html/bms/record.html?member_hotelid='+$(".hovertable tr").eq(e).children('.delId').html());
	}
}); 

$(".mask2Btn").children('span').eq(0).click(function(event) {

	var data={"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html()}
	// console.log($(".hovertable tr").eq($(".none3").html()).children('.delId').html())
	$.post('/member/bms/points/reward/del', {data: JSON.stringify(data)}, function(result) {
		
		if(result.sc==0){
			$(".mask2").css('display', 'none');
			$(".hovertable tr").eq($(".none3").html()).remove();
			// alert($(".hovertable tr").index())
			// if($(".hovertable tr").index()<0){
			// 	$(".bmsEnquiryBottom").css('display', 'none');
			// }
		}
	})
	
});


$(".mask3 .xiugaimimaBtn").click(function(event) {
	if($(".hovertable tr").eq($(".none3").html()).children('.pointstype').html()==11){
	var timestamp1 =Date.parse(new Date($(".mask3 #J_DepDate2").val()));
     var timestamp2 = Date.parse(new Date($(".mask3 #J_EndDate2").val()));
	var data={"userid":$(".hovertable tr").eq($(".none3").html()).children('.uid').html(),"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html(),"pointstype":$(".hovertable tr").eq($(".none3").html()).children('.pointstype').html(),"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".mask3 .amount").val()*100),"roomName":$(".mask3 .roomNights").val(),"roomNights":1}
	// console.log(data)
	if($(".mask3 #J_DepDate2").val()!=""&&$(".mask3 .amount").val()!=""&&$(".mask3 #J_EndDate2").val()!=""){
		$.post('/member/bms/points/reward/edit', {data: JSON.stringify(data)}, function(result) {
			console.log(result)
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
}
else if($(".hovertable tr").eq($(".none3").html()).children('.pointstype').html()==12){
	var timestamp1 = Date.parse(new Date($(".mask3 #J_DepDate2").val()));
				var data={"userid":$(".hovertable tr").eq($(".none3").html()).children('.uid').html(),"id":$(".hovertable tr").eq($(".none3").html()).children('.delId').html(),"pointstype":$(".hovertable tr").eq($(".none3").html()).children('.pointstype').html(),"checkin":timestamp1,"amount":parseInt($(".mask3 .amount").val()*100)}
				console.log(data)
				if($(".mask3 #J_DepDate2").val()!=""&&$(".mask3 .amount").val()!=""){
					$.post('/member/bms/points/reward/edit', {data: JSON.stringify(data)}, function(result) {
						console.log(result)
						if(result.sc==0){
						$(".mask3 #J_DepDate2").val("");
						$(".mask3 .amount").val("");
						$(".mask3").css('display', 'none');
                        var checkin=formatStrDate( new Date(parseInt(result.data.checkin)))
                           $(".hovertable tr").eq($(".none3").html()).children('td').eq(4).html(checkin);
                           $(".hovertable tr").eq($(".none3").html()).children('td').eq(6).html(result.data.amount/100);
                        // searchXun()
	
						}
						else{
							alert(result.msg)
						}
	
					})
				}
				else{
					alert("请填写完信息")
				}
}
	
})



//ruzhu
$(".bmsEnquiryTopRight li").eq(0).click(function(event) {
	$(".mask").css('display', 'block').attr('id', 'ruZhu');
	$(".mask1").removeAttr('id');
	$(".mask dl").eq(0).children('dd').html($(".bmsEnquiryTopLeft li").eq(1).children('span').html()).css('color', '#ccc');
	$(".memberName dd").html($(".bmsEnquiryTopLeft li").eq(0).children('span').html());
	$(".memberClass dd").html($(".bmsEnquiryTopCenter li").eq(1).children('span').html());
	$(".memberEq dd").html($(".bmsEnquiryTopLeft li").eq(2).children('span').html());
	$(".mask .alertRight").css('display', 'block');
	$(".mask .alert").css('width', '60%');
});
$(".bmsEnquiryTopRight li").eq(1).click(function(event) {
	$(".mask").css('display', 'block').attr('id', 'liZhu');
	$(".mask1").removeAttr('id');
	$(".mask dl").eq(0).children('dd').html($(".bmsEnquiryTopLeft li").eq(1).children('span').html()).css('color', '#ccc');
	$(".memberName dd").html($(".bmsEnquiryTopLeft li").eq(0).children('span').html());
	$(".memberClass dd").html($(".bmsEnquiryTopCenter li").eq(1).children('span').html());
	$(".memberEq dd").html($(".bmsEnquiryTopLeft li").eq(2).children('span').html());
	$(".mask .alertRight").css('display', 'block');
	$(".mask .alertRight").css('display', 'block');
	$(".mask .alert").css('width', '60%');
});
$(".bmsEnquiryTopRight li").eq(2).click(function(event) {
	$(".mask1 dl").eq(0).children('dd').html($(".bmsEnquiryTopLeft li").eq(1).children('span').html()).css('color', '#ccc');
	$(".memberName dd").html($(".bmsEnquiryTopLeft li").eq(0).children('span').html());
	$(".memberClass dd").html($(".bmsEnquiryTopCenter li").eq(1).children('span').html());
	$(".memberEq dd").html($(".bmsEnquiryTopLeft li").eq(2).children('span').html());
	$(".mask1").css('display', 'block').attr('id', 'feiruZhu');
	$(".mask").removeAttr('id');
	$(".mask1 dl").eq(0).children('dd').html(id);
	$(".mask1 .alertRight").css('display', 'block');
	$(".mask1 .alert").css('width', '60%');
});
$("#xiugaimimaBtn1").click(function(event) {
	$(".bmsEnquiryBottom").css('display', 'block');
        if($(" #J_DepDate1").val()!=""&&$("#J_EndDate1").val()!=""&&$(".amount").val()!=""){
            var timestamp1 = Date.parse(new Date($(" #J_DepDate1").val()));
            var timestamp2 = Date.parse(new Date($(" #J_EndDate1").val()));
         if(timestamp1<timestamp2){
             var data1;
             var al=$("#xiugaimimaBtn1").parent(".alert").parent(".mask").attr('id')
            if(al=="ruZhu"){
                 var data1={"userid":$(".memberEqUid").html(),"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".amount").val()*100),"roomName":$(".roomNights").val(),"roomNights":1}
            }
            else{
                 var data1={"userid":$(".memberEqUid").html(),"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".amount").val()*100),"roomName":$(".roomNights").val(),"roomNights":1,"isCommit":1}
            }
           
            // console.log(JSON.stringify(data1))

            $.post('/member/bms/points/roomreward/add', {data: JSON.stringify(data1)}, function(result) {
                console.log(result)
                if(result.sc=="0"){
                    $(".mask").css('display', 'none');
                    
                    // searchXun()
                    			 var otaName;
            if(result.data.otaName==undefined){
              otaName="";
            }
            else{
              otaName=result.data.otaName;
            }
            var roomName;
            if(result.data.roomName==undefined){
              roomName="";
            }
            else{
              roomName=result.data.roomName;
            }
                    
                    var checkin=formatStrDate( new Date(parseInt(result.data.checkin)))
                     var checkout=formatStrDate( new Date(parseInt(result.data.checkout)))
                    $(".hovertableTitle").after('<tr class="hovertableContent"><td>住宿<br/><em>自动抓取</em><em>手工录入</em></td><td>'+$(".bmsEnquiryTopLeft li").eq(0).children('span').html()+'</td><td></td><td>'+$(".bmsEnquiryTopLeft li").eq(1).children('span').html()+'</td><td>'+checkin+'</td><td class="checkout">'+checkout+'</td><td>'+result.data.amount/100+'</td><td class="roomnights">'+roomName+'</td><td>'+otaName+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.id+'</td><td class="pointstype" style="display:none">'+result.data.pointsType+'</td><td class="uid" style="display:none">'+result.data.uid+'</td></tr>')
                  
                     if(result.data.recordSource==1){
              $('.hovertableContent').children('td').eq(0).children("em").eq(1).hide();
            }
            else{
              $('.hovertableContent').children('td').eq(0).children("em").eq(0).hide();
            }

                      if(result.data.status!=0){
    						$(".hovertable tr td").eq(10).children('strong').css("display","none")
    						if(result.data.status==1){
    							$(".hovertable tr td").eq(9).children('span').hover(function() {
    								$(this).css({
    									'text-decoration': 'underline',
    									'color': '#d13f4c'
    								});
    							}, function() {
    								$(this).css({
    									'text-decoration': 'none',
    									'color': '#333'
    								});
    							});
    						}
    						else{
    							$(".hovertable tr td").eq(9).children('span').eq(0).css('display', 'none');
               					$(".hovertable tr td").eq(9).children('span').eq(1).css('display', 'none');
    						}
    					}
    					else{
    						$(".hovertable tr td").eq(9).children('span').hover(function() {
    							$(this).css({
    								'text-decoration': 'underline',
    								'color': '#d13f4c'
    							});
    						}, function() {
    							$(this).css({
    								'text-decoration': 'none',
    								'color': '#333'
    							});
    						});
    					}





                     if(result.data.memberCurGrade==0){
                     	$(".hovertable tr td").eq(2).html("金卡")
                     }
                     else if(result.data.memberCurGrade==1){
                     	$(".hovertable tr td").eq(2).html("白金卡")
                     }
                     else if(result.data.memberCurGrade==1){
                     	$(".hovertable tr td").eq(2).html("黑卡")
                     }



                     $(" #J_DepDate1").val("");
                    $(" #J_EndDate1").val("");
                    $(".amount").val("");
                    $(".roomNights").val("");
                    $(".alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
                    $(".errTip1").css('display', 'none');
                }
                else{
                   alert(result.msg) 
                }
            })
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
    	$(".bmsEnquiryBottom").css('display', 'block');
        if($("#feiruZhu #J_DepDate1").val()!=""&&$("#feiruZhu .amount").val()!=""){
            // alert("aa")
            var timestamp1 = Date.parse(new Date($("#feiruZhu #J_DepDate1").val()));
            var data1={"userid":$(".memberEqUid").html(),"checkin":timestamp1,"amount":parseInt($("#feiruZhu .amount").val()*100),"isCommit":1}
            console.log(JSON.stringify(data1))
            $.post('/member/bms/points/cashreward/add', {data: JSON.stringify(data1)}, function(result) {
                console.log(result)
                if(result.sc=="0"){
                	                    			 var otaName;
            if(result.data.otaName==undefined){
              otaName="";
            }
            else{
              otaName=result.data.otaName;
            }
            var roomName;
            if(result.data.roomName==undefined){
              roomName="";
            }
            else{
              roomName=result.data.roomName;
            }
                	var checkin=formatStrDate( new Date(parseInt(result.data.checkin)))
                    $(".hovertableTitle").after('<tr class="hovertableContent"><td>非住宿<br/><em>自动抓取</em><em>手工录入</em></td><td>'+$(".bmsEnquiryTopLeft li").eq(0).children('span').html()+'</td><td></td><td>'+$(".bmsEnquiryTopLeft li").eq(1).children('span').html()+'</td><td>'+checkin+'</td><td class="checkout"></td><td>'+result.data.amount/100+'</td><td class="roomnights">'+roomName+'</td><td>'+otaName+'</td><td><span>修改</span><span>删除</span><span>操作记录</span></td><td><strong>离店提交</strong></td><td class="delId" style="display:none">'+result.data.id+'</td><td class="pointstype" style="display:none">'+result.data.pointsType+'</td><td class="uid" style="display:none">'+result.data.uid+'</td></tr>')
                     if(result.data.recordSource==1){
              $('.hovertableContent').children('td').eq(0).children("em").eq(1).hide();
            }
            else{
              $('.hovertableContent').children('td').eq(0).children("em").eq(0).hide();
            }
                     if(result.data.memberCurGrade==0){
                     	$(".hovertable tr td").eq(2).html("金卡")
                     }
                     else if(result.data.memberCurGrade==1){
                     	$(".hovertable tr td").eq(2).html("白金卡")
                     }
                     else if(result.data.memberCurGrade==1){
                     	$(".hovertable tr td").eq(2).html("黑卡")
                     }

                     if(result.data.status!=0){
    						$(".hovertable tr td").eq(10).children('strong').css("display","none")
    						if(result.data.status==1){
    							$(".hovertable tr td").eq(9).children('span').hover(function() {
    								$(this).css({
    									'text-decoration': 'underline',
    									'color': '#d13f4c'
    								});
    							}, function() {
    								$(this).css({
    									'text-decoration': 'none',
    									'color': '#333'
    								});
    							});
    						}
    						else{
    							$(".hovertable tr td").eq(9).children('span').eq(0).css('display', 'none');
               					$(".hovertable tr td").eq(9).children('span').eq(1).css('display', 'none');
    						}
    					}
    					else{
    						$(".hovertable tr td").eq(9).children('span').hover(function() {
    							$(this).css({
    								'text-decoration': 'underline',
    								'color': '#d13f4c'
    							});
    						}, function() {
    							$(this).css({
    								'text-decoration': 'none',
    								'color': '#333'
    							});
    						});
    					}


                     $(".hovertable tr td").eq(0).css('background-color', 'rgb(228, 230, 227)');
                    $(".mask1").css('display', 'none');
                    $("#feiruZhu #J_DepDate1").val("");
                    $("#feiruZhu .amount").val("");
                    $("#feiruZhu .alertLeft .dl1 dd input").val("").css('border', '1px solid #bfbfbf');
                }
                 else{
                   alert(result.msg) 
                }
            })
        }
        else{
            alert("请填写完信息")
        }

        
    });
});
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