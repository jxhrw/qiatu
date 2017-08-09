$(document).ready(function() {
	var data={"pagecnt":"15","pageno":"1"}
	$.post('/member/h5/points/list',{data: JSON.stringify(data)}, function(data) {
	    console.log(data)
	    if(data.sc=="0"){
			if(data.data.length==0){
				$(".load").html(hasBackground("您还没有积分动态","30%"));
				return;
			}
	    	for(a=0;a<data.data.length;a++){
	    		var data1=parseInt(data.data[a].createTime)
	    		var date = new Date(data1);
				Y = date.getFullYear() + '-';
				M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				D = date.getDate() + ' ';
				// h = date.getHours() + ':';
				// m = date.getMinutes() + ':';
				// s = date.getSeconds(); 
				var time=Y+M+D;
	    		$(".integrationSystem ul").append('<li style="height:4rem;padding:1rem 0;"><span style="line-height:3rem;min-width:6.4rem;max-width:6.4rem;text-align:center;">'+data.data[a].pointsChange+'</span><strong style="line-height:1.6rem;">'+data.data[a].pointsChangeDesc+'<br/><i>'+time+'</i></strong></li>')
	    		if(data.data[a].recordType=="2"){
	        		$(".integrationSystem ul li").eq(a).children('span').css('color', '#d13f4c');
	        	}
	    	}


	        // if(data.data[0].recordType=="0"){
	        // 	$(".integrationSystem ul li span").css('color', '#d13f4c');
	        // }
	        
	    }
	    })
	     if($(".integrationSystem ul li").length<15){
		 	$(".load").html("已经加载完");
		// 	return;
		 }
		// else{
			var b=1;
		
			 $(window).scroll(function(){
    		    var scrollTop = $(this).scrollTop();
    		    var scrollHeight = $(document).height();
    		    var windowHeight = $(this).height();
    		    if(scrollTop + windowHeight == scrollHeight) {
    		    	b++;
					 	var data1={"pagecnt":"15","pageno":b}
					 	$.post('/member/h5/points/list',{data: JSON.stringify(data1)}, function(data) {
						    console.log(data)
						    if(data.sc=="0"){
						    	if(data.data.length<15 && $("ul li").length>0){
						    		$(".load").html("已经加载完");
						    		return;
						    	}else{
						    	for(a=0;a<data.data.length;a++){
						    		var data1=parseInt(data.data[a].createTime)
						    		var date = new Date(data1);
									Y = date.getFullYear() + '-';
									M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
									D = date.getDate() + ' ';
									// h = date.getHours() + ':';
									// m = date.getMinutes() + ':';
									// s = date.getSeconds(); 
									var time=Y+M+D;
						    		$(".integrationSystem ul").append('<li style="height:4rem;padding:1rem 0;"><span style="line-height:3rem;min-width:6.4rem;max-width:6.4rem;text-align:center;">'+data.data[a].pointsChange+'</span><strong style="line-height:1.6rem;">'+data.data[a].pointsChangeDesc+'<br/><i>'+time+'</i></strong></li>')
						    		if(data.data[a].recordType=="2"){
						        		$(".integrationSystem ul li").eq(15*(b-1)+a).children('span').css('color', '#d13f4c');
						        	}
						    	}
					
					}
						        // if(data.data[0].recordType=="0"){
						        // 	$(".integrationSystem ul li span").css('color', '#d13f4c');
						        // }
						        
						    }
						})
	
    		    	// }
    		    	
    		    }
    		})
		// }




	$.post('/member/h5/info', function(data) {
		console.log(data)
		if(data.sc=="0"){
			$(".consumingRecords span").html("积分余额："+data.data.points);
			$(".consumingRecords strong").html("积分有效期："+newFormatStrDate(new Date(parseInt(data.data.pointsExpiredTime)),"."));
			/*if(data.data.memberGrade==0){
				// alert(person.getRequestData().data.upgradeCondition)
				$(".consumingRecords strong").html(data.data.upgradeCondition);
			}
			else if(data.data.memberGrade==1){
				$(".consumingRecords strong").html(data.data.upgradeCondition+"<br/>"+data.data.keepgradeCondition);
			}
			else if(data.data.memberGrade==2){
				$(".consumingRecords strong").html(data.data.keepgradeCondition);
			}*/
		}
	})
});