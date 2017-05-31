$(document).ready(function() {
	$("body").css('height', $(window).height());
	$(".btn").click(function(event) {
		if($(".radio input").attr("class")=="current"){
			var businessAccount=$(".businessAccount").val();
			var businessPassword=$(".businessPassword").val();
			if(businessAccount!=""&&businessPassword!=""){
				var data={"keepLogin":1,"businessAccount":businessAccount,"businessPassword":businessPassword}
				// console.log(JSON.stringify(data))
				$.post('/bms/h5/business/login.json', {data: JSON.stringify(data)}, function(data) {
        		    // console.log(data)
        		    if(data.sc=="0"){
        		        window.location="/html/bms/index.html"
        		    }
        		    else if(data.sc=="BMS-2003"){
        		    	$(".tip").html("请重新登录").css('display', 'block');
        		    	setTimeout(function() {
               				$(".tip").css('display', 'none');
            			},2000)
        		    }
        		    else{
        		    	$(".tip").css('display', 'block');
        		    	setTimeout(function() {
               				$(".tip").css('display', 'none');
            			},2000)
        		    }
        		}) 

				
			}
			else{
				$(".tip").html("账号或密码不能为空，请输入账号或密码").css('display', 'block');
				setTimeout(function() {
               		$(".tip").css('display', 'none');
            	},1000)
			}
			
		}
		else{
			var businessAccount=$(".businessAccount").val();
			var businessPassword=$(".businessPassword").val();
			if(businessAccount!=""&&businessPassword!=""){
				var data={"keepLogin":0,"businessAccount":businessAccount,"businessPassword":businessPassword}
				// console.log(JSON.stringify(data))
				$.post('/bms/h5/business/login.json', {data: JSON.stringify(data)}, function(data) {
        		    // console.log(data)
        		    if(data.sc=="0"){
        		        window.location="/html/bms/index.html"
        		    }
        		    else if(data.sc=="BMS-2003"){
        		    	$(".tip").html("请重新登录").css('display', 'block');
        		    	setTimeout(function() {
               				$(".tip").css('display', 'none');
            			},2000)
        		    }
        		    else{
        		    	$(".tip").css('display', 'block');
        		    	setTimeout(function() {
               				$(".tip").css('display', 'none');
            			},2000)
        		    }
        		}) 

				
			}
			else{
				$(".tip").html("账号或密码不能为空，请输入账号或密码").css('display', 'block');
				setTimeout(function() {
               		$(".tip").css('display', 'none');
            	},1000)
			}
		}
	});
	// var data={"keepLogin":1,"businessAccount":"abc","businessPassword":"123"}
	// $.post('/bms/h5/business/login.json', {data: JSON.stringify(data)}, function(data) {
 //            console.log(data)
 //            if(data.sc=="0"){
                
 //            }
 //        }) 

	$('#test').find('input[type=checkbox]').bind('click', function(){
		$(".radio input").toggleClass('current');
		
	});
});