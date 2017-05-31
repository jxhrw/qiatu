var stauts=GetParams().stauts;

function getScrollTop(){
　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
　　if(document.body){
　　　　bodyScrollTop = document.body.scrollTop;
　　}
　　if(document.documentElement){
　　　　documentScrollTop = document.documentElement.scrollTop;
　　}
　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
　　return scrollTop;
}
function getScrollHeight(){
　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
　　if(document.body){
　　　　bodyScrollHeight = document.body.scrollHeight;
　　}
　　if(document.documentElement){
　　　　documentScrollHeight = document.documentElement.scrollHeight;
　　}
　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
　　return scrollHeight;
}
function getWindowHeight(){
　　var windowHeight = 0;
　　if(document.compatMode == "CSS1Compat"){
　　　　windowHeight = document.documentElement.clientHeight;
　　}else{
　　　　windowHeight = document.body.clientHeight;
　　}
　　return windowHeight;
}
var b=1;
window.onscroll = function(){
	KISSY.use('node',function(S,Node){
    	if(Node.one(".moreTip").html()=="已经加载完了"){
         // alert("message")
        return;
    }
    else{
 	 

　　  if(getScrollTop() + getWindowHeight() == getScrollHeight()){
// 　　　　alert("已经到最底部了！!");

b++;
    	
    	var searchTimestamp1=new Date().getTime()-30*1000*60*60*24;
		var searchTimestamp2=new Date().getTime();
		var dataSearch,url;
		if(stauts=="0"){
			dataSearch={"status":"0","pagecnt":"10","pageno":b};
		}
		else {
			dataSearch={"pagecnt":"10","pageno":b};
		}
		KISSY.use('io,node',function(S,io,Node){
	    	io({
	    	type:'post',
	        url:'/member/bms/points/reward/list',
	        data:{
	        	data:JSON.stringify(dataSearch)
	        },
	        success:function(data){
	           if(data.sc==0){
                // alert("aa")
	           		console.log(data)
	        		for (var i = 0; i < data.data.result.length ; i++) {
	        			var checkout=formatStrDate(new Date(parseInt(data.data.result[i].checkout)))
	        			var nameTitle0;
        			var nameClass;
        			var nameClass2;
        			var nameTitle1;
        			var nameTitle2;
        			if(data.data.result[i].recordSource==1){
        				var nameTitle1="";//自动抓取
            		}
					else if(data.data.result[i].recordSource==2){
						var nameTitle1="";//几何直订
					}
            		else{
            			var nameTitle1="|手工录入"
                    }
                    //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                    
                    if(data.data.result[i].checkout>searchTimestamp2&&data.data.result[i].pointsType==11){
                        
                        // if(data.data.result[i].pointsType==11){
                            var nameTitle2="正在入住"
                            var nameClass2="ruzhuBtn"
                        // }
        				

                    }
                    else if(data.data.result[i].status==0){
        				var nameTitle2="等待提交"
        				var nameClass2="sumBtn"
                    }
                    else if (data.data.result[i].status==1) {
        				var nameTitle2="等待系统确认"
        				var nameClass2="no"
                    }
                    else if (data.data.result[i].status==2) {
        				var nameTitle2="已确认"
        				var nameClass2="no"
                    }
                    else if (data.data.result[i].status==5) {
	        			var nameTitle2="即将自动提交"
	        			var nameClass2="sumBtn"
	                }
	                if(data.data.result[i].pointsType==11){
	                	var nameTitle0="住宿"
	                	var nameClass="currentruzhu"
	                }
	                else{
	                	var nameTitle0="非住宿"
	                	var nameClass="queren"
	                }
                    var ai=i+10*(b-1)
	        			// Node.one("#wrapwrap").append('<ul class="cardWrap"><a href="/html/mobileBms/detail.html?id='+data.data.result[i].id+'"></a><li>会员姓名：<span>'+data.data.result[i].realName+'</span></li><li>离店/消费日期：<span>'+checkout+'</span><strong>￥'+data.data.result[i].amount/100+'</strong><i class="iconfont">&#xe61a;</i></li><li><span class="'+nameClass1+'">'+nameTitle1+'</span><span class="'+nameClass2+'">'+nameTitle2+'</span></li></ul>')
	        			Node.one("#wrapwrap").append('<ul class="cardWrap" id="'+ai+'"><a href="/html/bms/mobileBms/detail.html?id='+data.data.result[i].id+'"></a><li>会员姓名：<span>'+data.data.result[i].realName+'</span></li><li>离店/消费日期：<span>'+checkout+'</span></li><li>消费金额：<span>'+data.data.result[i].currency+data.data.result[i].amount/100+'</span></li><li><span class="'+nameClass+'">'+nameTitle0+nameTitle1+'|'+nameTitle2+'</span></li><span class="sumbiBtn '+nameClass2+'" name="'+nameClass2+'">离店确认</span></ul>')
	        		

	   



	        		};
	 
					var $=Node.all;       
        		$(".sumbiBtn").on("click", function(event){
                    // if($(this).parent().index()>=10){
                      var s=$(this).parent().index()-(b-1)*10;  
                    

            		
            		$(this).attr("id","remove")
        			 // alert($(this).parent().index())
        			var ss=Node.one(this).attr("name")

        				if(ss=="sumBtn"&&$(this).parent().index()>=10){
        					var dataSubmit={"id":data.data.result[s].id}
        				// /member/bms/points/reward/commit
        					KISSY.use('io,node',function(S,io,Node){
    						io({
    							type:'post',
        						url:'/member/bms/points/reward/commit',
       							data:{
            						data:JSON.stringify(dataSubmit)
        						},
        						success:function(data){
            						console.log(data)
            						if(data.sc==0){
            							$("#remove").remove();
                                        if(data.data.pointsType==11){
											if(data.data.status==1){
												if(data.data.recordSource==1){
													$('#'+s+' .currentruzhu').html("住宿|等待系统确认");//住宿|自动抓取|等待系统确认
												}
												else if(data.data.recordSource==2){

													$('#'+s+' .currentruzhu').html("住宿|等待系统确认");//住宿|几何直订|等待系统确认
												}
												else{
													// alert(s)
													$('#'+s+' .currentruzhu').html("住宿|手工录入|等待系统确认")
												}
											}
											else if(data.data.status==2){
												if(data.data.recordSource==1){
													$('#'+s+' .currentruzhu').html("住宿|已确认");//住宿|自动抓取|已确认
												}
												else if(data.data.recordSource==2){

													$('#'+s+' .currentruzhu').html("住宿|已确认");//住宿|几何直订|已确认
												}
												else{
													$('#'+s+' .currentruzhu').html("住宿|手工录入|已确认")
												}
												// var nameTitle2="已确认"
											}
											else if(data.data.status==5){
												if(data.data.recordSource==1){
													$('#'+s+' .currentruzhu').html("住宿|即将自动提交");//住宿|自动抓取|即将自动提交
												}
												else if(data.data.recordSource==2){

													$('#'+s+' .currentruzhu').html("住宿|即将自动提交");//住宿|几何直订|即将自动提交
												}
												else{
													$('#'+s+' .currentruzhu').html("住宿|手工录入|即将自动提交")
												}
												// var nameTitle2="即将自动提交"
											}
                                        }
            						}
            						else{
            							Node.one('.tip').html("系统繁忙").css('display', 'block');
            							setTimeout(function() {
                                    		Node.one(".tip").css('display', 'none')
                                		},2000)
            						}
        						}
    						});
							});
        				}
        				else{
        					// alert("aa")
        					return;
        				}

         		});
	        		if(data.data.result.length<10){
	        			Node.one(".moreTip").html("已经加载完了")
	        		}
	        		else{
        				Node.one(".moreTip").html("下拉加载更多…")
        			}
	           		
	           }
	          else{
	          	
	            
	           }
	        }
	    	});
		});
   

　　   }
    }
	});
	

};

var searchTimestamp1=new Date().getTime()-30*1000*60*60*24;
var searchTimestamp2=new Date().getTime();
var dataSearch;
if(stauts=="0"){
	dataSearch={"status":"0","pagecnt":"10","pageno":1};
}
else {
	/*"starttime":searchTimestamp1,"endtime":searchTimestamp2,*/
	dataSearch={"pagecnt":"10","pageno":"1"};
}
KISSY.use('io,node',function(S,io,Node){
    io({
    	type:'post',
        url:'/member/bms/points/reward/list',
        data:{
        	data:JSON.stringify(dataSearch)
        },
        success:function(data){
           if(data.sc==0){
           		console.log(data)
        		for (var i = 0; i < data.data.result.length ; i++) {
        			var checkout=formatStrDate(new Date(parseInt(data.data.result[i].checkout)))
        			var nameTitle0;
        			var nameClass;
        			var nameClass2;
        			var nameTitle1;
        			var nameTitle2;
        			if(data.data.result[i].recordSource==1){
        				var nameTitle1="";//自动抓取
            		}
					else if(data.data.result[i].recordSource==2){
						var nameTitle1="";//几何直订
					}
            		else{
            			var nameTitle1="|手工录入";
                    }
                    //status 0是待提交 1是已提交系统未确认 2是已提交系统已确认
                    if(data.data.result[i].checkout>searchTimestamp2&&data.data.result[i].pointsType==11){
        				var nameTitle2="正在入住"
        				var nameClass2="ruzhuBtn"

                    }
                    else if(data.data.result[i].status==0){
        				var nameTitle2="等待提交"
        				var nameClass2="sumBtn"
                    }
                    else if (data.data.result[i].status==1) {
        				var nameTitle2="等待系统确认"
        				var nameClass2="no"
                    }
                    else if (data.data.result[i].status==2) {
        				var nameTitle2="已确认"
        				var nameClass2="no"
                    }
                    else if (data.data.result[i].status==5) {
	        			var nameTitle2="即将自动提交"
	        			var nameClass2="sumBtn"
	                }
	                if(data.data.result[i].pointsType==11){
	                	var nameTitle0="住宿"
	                	var nameClass="currentruzhu"
	                }
	                else{
	                	var nameTitle0="非住宿"
	                	var nameClass="queren"
	                }
	                
        			// Node.one("#wrapwrap").append('<ul class="cardWrap"><a href="/html/mobileBms/detail.html?id='+data.data.result[i].id+'"></a><li>会员姓名：<span>'+data.data.result[i].realName+'</span></li><li>离店/消费日期：<span>'+checkout+'</span><strong>￥'+data.data.result[i].amount/100+'</strong><i class="iconfont">&#xe61a;</i></li><li><span class="'+nameClass1+'">'+nameTitle1+'</span><span class="'+nameClass2+'">'+nameTitle2+'</span></li></ul>')
        			Node.one("#wrapwrap").append('<ul class="cardWrap" id="'+i+'"><a href="/html/bms/mobileBms/detail.html?id='+data.data.result[i].id+'"></a><li>会员姓名：<span>'+data.data.result[i].realName+'</span></li><li>离店/消费日期：<span>'+checkout+'</span></li><li>消费金额：<span>'+data.data.result[i].currency+data.data.result[i].amount/100+'</span></li><li><span class="'+nameClass+'">'+nameTitle0+nameTitle1+'|'+nameTitle2+'</span></li><span class="sumbiBtn '+nameClass2+'" name="'+nameClass2+'">离店确认</span></ul>')
        		
        			

        		};

        		// 
        		var $=Node.all;       
        		$(".sumbiBtn").on("click", function(event){
            		var s=$(this).parent().index();
            		$(this).attr("id","remove")
        			// alert(s)
        			var ss=Node.one(this).attr("name")

        				if(ss=="sumBtn"&&s<10){
        					var dataSubmit={"id":data.data.result[s].id}
        				// /member/bms/points/reward/commit
        					KISSY.use('io,node',function(S,io,Node){
    						io({
    							type:'post',
        						url:'/member/bms/points/reward/commit',
       							data:{
            						data:JSON.stringify(dataSubmit)
        						},
        						success:function(data){
            						console.log(data)
            						if(data.sc==0){
            							$("#remove").remove();
                                        if(data.data.pointsType==11){
                                            if(data.data.status==1){
                                                if(data.data.recordSource==1){
                                                  $('#'+s+' .currentruzhu').html("住宿|等待系统确认");//自动抓取
                                                }
												else if(data.data.recordSource==2){
													$('#'+s+' .currentruzhu').html("住宿|等待系统确认");//几何直订
												}
                                                else{
                                                  $('#'+s+' .currentruzhu').html("住宿|手工录入|等待系统确认");
                                                } 
                                            }
                                            else if(data.data.status==2){
                                                if(data.data.recordSource==1){
                                                  $('#'+s+' .currentruzhu').html("住宿|已确认");//自动抓取
                                                }
												else if(data.data.recordSource==2){

													$('#'+s+' .currentruzhu').html("住宿|已确认");//几何直订
												}
                                                else{
                                                  $('#'+s+' .currentruzhu').html("住宿|手工录入|已确认")  
                                                } 
                                                // var nameTitle2="已确认"
                                            }
                                            else if(data.data.status==5){
                                                if(data.data.recordSource==1){
                                                  $('#'+s+' .currentruzhu').html("住宿|即将自动提交");//自动抓取
                                                }
												else if(data.data.recordSource==2){

													$('#'+s+' .currentruzhu').html("住宿|即将自动提交");//几何直订
												}
                                                else{
                                                  $('#'+s+' .currentruzhu').html("住宿|手工录入|即将自动提交")  
                                                } 
                                                // var nameTitle2="即将自动提交"
                                            }
                                        }
                                        

            						}
            						else{
            							Node.one('.tip').html("系统繁忙").css('display', 'block')
            							setTimeout(function() {
                                    		Node.one(".tip").css('display', 'none')
                                		},2000)
            						}
        						}
    						});
							});
        				}
        				else{
        					return;
        				}

         		});

				// });
        		if(data.data.result.length==0){
					Node.one(".moreTip").html("您还没有消费记录");
				}else {
					if(data.data.result.length<10){
						Node.one(".moreTip").html("已经加载完了")
					}
					else{
						Node.one(".moreTip").html("下拉加载更多…")
					}
				}
           		
           }
          else{
          	
            
           }
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
                return  formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
                break;
    }
  }

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