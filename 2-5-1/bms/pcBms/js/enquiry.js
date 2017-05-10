var userid;
$(document).ready(function() {
	$(".mask1").css('height', $(window).height());
	$(".mask2").css('height', $(window).height());
	$(".mask3").css('height', $(window).height());
	$(".mask4").css('height', $(window).height());
	$(".mask10").css('height', $(window).height());
	$(".mask11").css('height', $(window).height());
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
			userid=data.data.uid;
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
								$(this).append('<i>商户新加入会员在本商户的首次住宿消费，由积分中心向用户奖励最多不超过1000的积分，商户无需承担积分成本。</i>');
							}, function() {

								$(this).children('i').remove();
							});
						}
					};

				}
			})
			var offData={/*couponType:2,*/userid:data.data.uid};
			$.post("/coupon/bms/member/list",{data:JSON.stringify(offData)},function(offres){
				if(offres.sc==0){
					var tableHtml="";
					var thHtml="";
					if(offres.data.length>0){
						for(var i=0;i<offres.data.length;i++){
							var remain=offres.data[i].remain;//可用余额
							var freeze=offres.data[i].freeze;//冻结余额
							var remainHtml="<td></td>";
							var freezeHtml="<td></td>";
							var couponName=offres.data[i].couponBaseInfo.couponName;//券名称
							var effectiveTime=parseInt(offres.data[i].couponBaseInfo.effectiveTime);//生效时间
							var expireTime=parseInt(offres.data[i].couponBaseInfo.expireTime);//失效时间
							var statusTime='';//状态
							var deductBtn='';//扣减按钮
							var recordBtn='';//记录按钮
							if(i==0){
								thHtml="券资产： &nbsp;";

							}else {
								thHtml="";
							}
							if(Date.parse(new Date())<effectiveTime){
								statusTime='未生效';
							}else if(Date.parse(new Date())>expireTime){
								statusTime='已过期';
							}else {
								statusTime='('+ newFormatStrDate(new Date(effectiveTime),".") + ' - ' + newFormatStrDate(new Date(expireTime),".") +')';
							}
							if(offres.data[i].couponBaseInfo.hotelCheckoff==1){
								deductBtn='<span class="actBtn deduct">扣减额度</span>';
							}
							recordBtn='<span class="actBtn writeOffRecord">变动记录</span>';
							if(undefined!=remain && remain/1>=0){
								remainHtml='<td style="min-width:160px;">可用额度：<span class="remian">'+remain/100+'</span></td>';
							}
							if(undefined!=freeze){
								freezeHtml='<td style="min-width:160px;">冻结额度：<span >'+freeze/100+'</span></td>';
							}
							tableHtml+='<tr id="'+offres.data[i].couponCode+'"><th style="width: 78px;">'+thHtml+'</th><td style="min-width: 270px;"><span class="couponName">'+couponName+'</span>'+statusTime+'</td>'+remainHtml+freezeHtml+'<td>'+deductBtn+'</td><td>'+recordBtn+'</td></tr>'
						}
					}
					else {
						tableHtml='<tr><th style="width: 78px;">券资产： &nbsp;</th><td>无</td></tr>';
					}
					$(".writeOffTable").html(tableHtml);
				}
				else {
					$("#prompt").html(chinese(offres.ErrorMsg)).show();
					setTimeout(function(){
						$("#prompt").html("").hide();
					},2000);
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
/* $(".hovertable td strong").live('click', function(event) {
 	var e=$(this).parent("td").parent("tr").index()
     	var data2={"id":$(".hovertable tr").eq(e).children('.delId').html()}
     	// console.log(JSON.stringify(data2))
     	$.post('/member/bms/points/reward/commit', {data: JSON.stringify(data2)}, function(res) {
     		console.log(res)
     		if(res.sc==0){
     			alert("提交成功")
     			$(".hovertable tr").eq(e).children('td').children('strong').remove();
     		}
     	})
 }); */
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

//消费金核销
$(document).ready(function() {
	var couponCodeThis;//最近操作的券
	var pageNum;
	var totalPages=1;//总页数
	$(".deduct").live("click",function(){
		var couponName=$(this).parents("tr").find(".couponName").html();
		couponCodeThis=$(this).parents("tr").attr("id");
		$(".mask10").show().find(".writeOffP").html(couponName);
	});
	$(".writeOffRecord").live("click",function(){
		pageNum=1;
		$(".writeOffRecordBox").html("");
		couponCodeThis=$(this).parents("tr").attr("id");
		recordPage(couponCodeThis,userid);
	});
	$(".writeOffBtn").click(function(){
		//couponCode,amout,desc(类型),remark(备注)
		var desc=$("input[name='writeType']:checked").val();
		var remark=$(".writeOffText").val();
		var amout=$(".writeOffNum").val();
		var reg=/^\d+(?:\.\d{1,2})?$/;//大于0小数，最多两位
		$(".writeOffBtn").addClass("no");
		if(amout>0 && reg.test(amout)){
			if(undefined==desc){
				$("#prompt").html(chinese("请选择核销类型")).show();
				setTimeout(function(){
					$("#prompt").html("").hide();
				},2000);
				$(".writeOffBtn").removeClass("no");
				return;
			}
			var data={couponCode:couponCodeThis,amount:Math.round(amout*100),desc:desc,remark:remark};
			$.post("/coupon/bms/checkoff/add",{data:JSON.stringify(data)},function(res){
				if(res.sc==0){
					$(".mask10").hide();
					$("#"+couponCodeThis).find(".remian").html(floatFixed2($("#"+couponCodeThis).find(".remian").html()-amout));
					$("#prompt").html("已扣减"+amout).show();
					setTimeout(function(){
						$("#prompt").html("").hide();
					},2000);
					$(".writeOffNum").val("");
					$("input[name='writeType']").attr("checked",null);
				}else if(res.sc=="-99999"){
					$("#prompt").html("请稍后再试").show();
					setTimeout(function(){
						$("#prompt").html("").hide();
					},2000);
				}else {
					$("#prompt").html(chinese(res.ErrorMsg)).show();
					setTimeout(function(){
						$("#prompt").html("").hide();
					},2000);
				}
				$(".writeOffBtn").removeClass("no");
			});
		}
		else {
			$("#prompt").html(chinese("数字格式有误")).show();
			setTimeout(function(){
				$("#prompt").html("").hide();
			},2000);
			$(".writeOffBtn").removeClass("no");
			return;
		}
	});

	/*$(".writeOffRecordBox").scroll(function(){
		var h = $(this).height();//div可视区域的高度
		var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
		var st =$(this)[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
		if(h+st>=sh){
			//上面的代码是判断滚动条滑到底部的代码
			pageNum++;
			if(pageNum<=totalPages){
				recordPage(couponCodeThis,pageNum);
			}
		}
	});*/
	function recordPage(couponCodeThis,userid){
		var data={couponCode:couponCodeThis};
		$.post("/coupon/bms/member/record",{data:JSON.stringify(data)},function(res){
			if(res.sc==0){
				var writeOffRecord="";
				if (undefined != res.data.monthRecordInfo) {
					var recordInfo = res.data.monthRecordInfo;
					for (var key in recordInfo) {
						var monthRecord="";
						for (var i = 0; i < recordInfo[key].length; i++) {
							var consumptionType;
							//0-消费金发放,1-房券兑房,2-现金券抵现,5-折扣券使用,7-红包支付,10-转换支付别人的券支付，收入券,11-消费金兑换积分,12-积分兑换消费金,13-交易转出,14-交易转入,40-消费金回收,41-房券兑房取消,42-现金券抵现取消,45-折扣券使用取消,47-红包支付取消,
							switch (recordInfo[key][i].recordType) {
								case "0":
									consumptionType = '发放';
									break;
								case "1":
								case "2":
								case "5":
								case "7":
									consumptionType = '消费';
									break;
								case "10":
									consumptionType = '转换支付';
									break;
								case "11":
									consumptionType = '兑换积分';
									break;
								case "12":
									consumptionType = '积分兑换';
									break;
								case "13":
									consumptionType = '转让';
									break;
								case "14":
									consumptionType = '购买';
									break;
								case "40":
									consumptionType = '回收';
									break;
								case "41":
								case "42":
								case "45":
								case "47":
									consumptionType = '退款';
									break;
							}
							var remian=recordInfo[key][i].remain;
							var amount=parseInt(recordInfo[key][i].amount);
							var amountHtml="";
							var createTime=recordInfo[key][i].createTime;
							var remianHtml="";
							if(undefined!=remian){
								remianHtml='<br/>余额：'+remian/100;
							}
							if(undefined!=amount){
								if(amount>0){
									amount="+"+amount/100;
								}else {
									amount=amount/100;
								}
								amountHtml='<br>'+consumptionType+ '：'+' <span class="red">'+ amount +'</span>';
							}
							/*if (recordInfo[key][i].recordType == "7" || recordInfo[key][i].recordType == "47" || recordInfo[key][i].recordType == "1" || recordInfo[key][i].recordType == "41") {
								writeOffRecord += '';
							}
							else if (recordInfo[key][i].recordType == "5" || recordInfo[key][i].recordType == "45") {
								writeOffRecord +="";
							}
							else {*/
							monthRecord+='<p class="writeOffRecordSingle">'+ newFormatStrDate((new Date(parseInt(createTime))),"-") + "&nbsp;" + timeFormatSecond((new Date(parseInt(createTime))),":") +amountHtml+remianHtml+'</p>'
							/*}*/
						}
						writeOffRecord=monthRecord+writeOffRecord;
					}
				}else {
					writeOffRecord='<p class="writeOffRecordSingle">无</p>';
				}
				$(".writeOffRecordBox").html(writeOffRecord);
				$(".mask11").show();
			}else if(res.sc=="-99999"){
				$("#prompt").html("请稍后再试").show();
				setTimeout(function(){
					$("#prompt").html("").hide();
				},2000);
			}else {
				$("#prompt").html(chinese(res.ErrorMsg)).show();
				setTimeout(function(){
					$("#prompt").html("").hide();
				},2000);
			}
		});
	}
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
function chinese(str){
	var ss=str.replace(/[^\u4e00-\u9fa5]/gi,"");
	return ss;
}