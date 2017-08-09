$(document).ready(function() {
  var minTimestamp= Date.parse(new Date())-30*24*60*60*1000;
var min=formatStrDate(new Date(minTimestamp))
	$("#J_DepDate").val(min)
    $("#J_EndDate").val(formatStrDate(new Date()))
    var searchTimestamp1= Date.parse(new Date($(".recordWrapLeft #J_DepDate").val()))-1000*60*60*24*30+1000*60*60*4;
    var searchTimestamp2=Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*28
    var data={"starttime":searchTimestamp1,"endtime":searchTimestamp2}
    $.post('/member/bms/points/consume/list', {data: JSON.stringify(data)}, function(data) {
    	console.log(data)
    	fenye(data.data.totalPages)
      if(data.data.result.length==0){
        $(".bmsEnquiryBottom").hide()
      }
      else{
        $(".bmsEnquiryBottom").show()
    	for (var i = 0; i < data.data.result.length; i++) {
    		var createTime=formatStrDate1( new Date(parseInt(data.data.result[i].createTime)))
    		$('.hovertable').append('<tr class="hovertableContent 0"><td>'+data.data.result[i].realName+'</td><td>'+data.data.result[i].amount/100+'</td><td>'+createTime+'</td></tr>')
    		
    		if(data.data.result[i].isFirstConsume==0){
                   $('.0').eq(i).children('td').eq(0).css({
                        "background": 'none'
                    });
                }
                else{
                     $('.0').eq(i).children('td').eq(0).css({
                         "background": 'url(/html/bms/image/fristIcon.png) left top no-repeat',
                         "-webkit-background-size": '40px',
                         "background-size": '40px'
                     });
            }
    	};
      }
    })

$(".searchIcon").click(function(event) {

           searchXun('/member/bms/points/consume/list',1)


	});

// $("#pageDir span").live('click', function(event) {
//   var ee=$(this).attr("class")

//   $(this).attr('id', 'current1').siblings('span').removeAttr('id');
//   $("#pageDir input").val(ee)
//   if(ee>1){
//     $(".pageBefore").removeAttr('id')
//   }
//     else{
//         $(".pageBefore").attr('id', 'current')
//     }
//     if($("#pageDir strong").html()==ee){
//         $(".pageNext").attr('id', 'current')
        
//     }
    
//   else{
//     $(".pageNext").removeAttr('id')
       
//   }
//     fenye1(ee)
  
  
    
// });





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
    searchXun1(ee)
	
	
		
});
//分页
//sousuo
$("#pageDir i").live('click', function(event) {
	var ee=$("#pageDir input").val()
	$("."+ee).attr('id', 'current1').siblings('span').removeAttr('id');
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
	if(ee>$("#pageDir strong").html()){
		$("#pageDir input").val(ee)
		return;
	}
	else{
		searchXun1(ee)
	}
	// if(ee>5){
	// 	$("#pageDir span").removeAttr('id');
	// }
	
});
//下一个 上一页
	$("#pageDir .pageBefore").live('click', function(event) {
		var ee=$("#pageDir input").val()-1
		$("."+ee).attr('id', 'current1').siblings('span').removeAttr('id');
		if(ee>1){

			searchXun1(ee)
			$("#pageDir input").val(ee)
			$(".pageNext").removeAttr('id')
		}
		else if(ee==1){
			searchXun1(ee)
			$("#pageDir input").val(ee)
			$(".pageBefore").attr('id', 'current')
            $(".pageNext").removeAttr('id')
		}
        else if(ee==0){
            return;
        }


		
	});
	$("#pageDir .pageNext").live('click', function(event) {
	
		var ee=parseInt($("#pageDir input").val())+1
		$("."+ee).attr('id', 'current1').siblings('span').removeAttr('id');
		$(".pageBefore").removeAttr('id')
		if(ee<$("#pageDir strong").html()){
		
			searchXun1(ee)
			$("#pageDir input").val(ee)
		}
		else if(ee==$("#pageDir strong").html()){
        
			searchXun1(ee)
			$("#pageDir input").val(ee)
			$(".pageNext").attr('id', 'current')

			
		}
        else{
            $(".pageNext").attr('id', 'current')
            fenye($("#pageDir strong").html())
            return;
        }
     

		
	});

});



 var d=0;
function fenye(zongCount){

d++;

if(zongCount==0){
    $(".bmsEnquiryBottom").hide()
}
else if(zongCount==1){
    // $(".pageNext").attr('id', 'current')
    $(".bmsEnquiryBottom").show()
    $("#pageDir").append(' <div id="'+d+'"><span class="1">1</span>共<strong>'+zongCount+ '</strong>页 到第<input type="number" value="1">页 <i>确定</i></div>')
    
}
else{
     $(".bmsEnquiryBottom").show()
     $(".pageNext").removeAttr('id')
      $("#pageDir").append(' <div id="'+d+'"><em class="pageBefore 0" id="current" ><</em><em class="pageNext">></em>共<strong>'+zongCount+ '</strong>页到第<input type="number" value="1">页 <i>确定</i></div>')
      for (var i = 0; i < zongCount; i++) {
        // dc++
        var ccc=i+1
                if(ccc <zongCount){
                 
                    $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
                }
                else if(ccc ==zongCount){
                  
                   $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
     
                }
    };
   
     
}

 for (var i = $("#pageDir"); i <d; i++) {
    var cc=i
        $('#'+cc).remove(); 
    };
 
}

//     var d=0;
//     var dc=0
// function fenye(zongCount){

// d++;

// if(zongCount==0){
//     $(".recordTable").hide()
// }
// else if(zongCount==1){
//     // $(".pageNext").attr('id', 'current')
//     $(".recordTable").show()
//     $("#pageDir").append(' <div id="'+d+'"><span class="1">1</span>共<strong>'+zongCount+ '</strong>页 到第<input type="number" value="1">页 <i>确定</i></div>')
    
// }
// else{
//      $(".recordTable").show()
//      $(".pageNext").removeAttr('id')
//       $("#pageDir").append(' <div id="'+d+'"><em class="pageBefore 0" id="current" ><</em><em class="pageNext">></em>共<strong>'+zongCount+ '</strong>页到第<input type="number" value="1">页 <i>确定</i></div>')
//       for (var i = 0; i < zongCount; i++) {
//         // dc++
//         var ccc=i+1
//                 if(ccc <zongCount){
//                     // var dd=i
//                     // alert(dd);
//                     $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
//                 }
//                 else if(ccc ==zongCount){
//                     // var dd=dc-1
//                     // alert(dd);
//                    $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
//                     // $("#pageDir .add").hide();
//                 }
//     };
   
     
//   }
//   // alert($("#pageDir").children('div').length)
//    for (var i = $("#pageDir").children('div').length; i >1; i--) {
//     var cc=i
//         $('#'+cc).remove(); 
//     };
// }


//     var d=0;
//     var dc=0
// function fenye(zongCount){

// d++;

// if(zongCount==0){
//     $(".recordTable").hide()
// }
// else if(zongCount==1){
//     // $(".pageNext").attr('id', 'current')
//     $(".recordTable").show()
//     $("#pageDir").append(' <div id="'+d+'"><span class="1">1</span>共<strong>'+zongCount+ '</strong>页 到第<input type="number" value="1">页 <i>确定</i></div>')
    
// }
// else{
//      $(".recordTable").show()
//      $(".pageNext").removeAttr('id')
//       $("#pageDir").append(' <div id="'+d+'"><em class="pageBefore 0" id="current" ><</em><em class="pageNext">></em>共<strong>'+zongCount+ '</strong>页到第<input type="number" value="1">页 <i>确定</i></div>')
//       for (var i = 0; i < zongCount; i++) {
//         // dc++
//         var ccc=i+1
//                 if(ccc <zongCount){
//                     // var dd=i
//                     // alert(dd);
//                     $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
//                 }
//                 else if(ccc ==zongCount){
//                     // var dd=dc-1
//                     // alert(dd);
//                    $(" #"+d).children('.'+i).after('<span class="'+ccc+'">'+ccc+'</span>')
//                     // $("#pageDir .add").hide();
//                 }
//     };
   
     
// }

//  for (var i = 1; i <d; i++) {
//     var cc=i
//         $('#'+cc).remove(); 
//     };

        
   
// }






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
    function formatStrDate1(vArg){//格式化日期
        switch(typeof vArg) {
            case "string":
                vArg = vArg.split(/-|\//g);
                return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
                break;
            case "object":
                return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate())+ " " +formatNum(vArg.getHours())+":"+formatNum(vArg.getMinutes())+":"+formatNum(vArg.getSeconds());
                break;
    }
  } 
  var aa=0;
  function searchXun(jieKou,ee){
	aa++;
	var a=aa-1
	var searchTimestamp1= Date.parse(new Date($(".recordWrapLeft #J_DepDate").val()))+1000*60*60*4;
    var searchTimestamp2 = Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*4;
    if(searchTimestamp1==searchTimestamp2){
       var searchTimestamp2=Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*28
    }
    var data={"starttime":searchTimestamp1,"endtime":searchTimestamp2,"pageno":ee}
     $.post(jieKou, {data: JSON.stringify(data)}, function(result) {
    	console.log(result)
    	if(result.sc=="0"){
            
            // $("#pageDir strong").html(result.data.totalPages)
            fenye(result.data.totalPages)
    		for (var i = 0; i<result.data.result.length; i++) {
    			var createTime=formatStrDate1( new Date(parseInt(result.data.result[i].createTime)))
    			$('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].amount/100+'</td><td>'+createTime+'</td></tr>')
    		
                if(result.data.result[i].isFirstConsume==0){
                   $('.'+aa).eq(i).children('td').eq(0).css({
                        "background": 'none'
                    });
                }
                else{
                     $('.'+aa).eq(i).children('td').eq(0).css({
                         "background": 'url(/html/bms/image/fristIcon.png) left top no-repeat',
                         "-webkit-background-size": '40px',
                         "background-size": '40px'
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
  function searchXun1(ee){
    aa++;
    var a=aa-1
    var searchTimestamp1= Date.parse(new Date($(".recordWrapLeft #J_DepDate").val()))+1000*60*60*4;
    var searchTimestamp2 = Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*4;
    if(searchTimestamp1==searchTimestamp2){
       var searchTimestamp2=Date.parse(new Date($(".recordWrapLeft #J_EndDate").val()))+1000*60*60*28
    }
    var data={"starttime":searchTimestamp1,"endtime":searchTimestamp2,"pageno":ee}
     $.post('/member/bms/points/consume/list', {data: JSON.stringify(data)}, function(result) {
        console.log(result)
        if(result.sc=="0"){
            
             $("#pageDir strong").html(result.data.totalPages)
            // fenye(result.data.totalPages)
            for (var i = 0; i<result.data.result.length; i++) {
                var createTime=formatStrDate1( new Date(parseInt(result.data.result[i].createTime)))
                $('.hovertable').append('<tr class="hovertableContent '+aa+'"><td>'+result.data.result[i].realName+'</td><td>'+result.data.result[i].amount/100+'</td><td>'+createTime+'</td></tr>')
            
                if(result.data.result[i].isFirstConsume==0){
                   $('.'+aa).eq(i).children('td').eq(0).css({
                        "background": 'none'
                    });
                }
                else{
                     $('.'+aa).eq(i).children('td').eq(0).css({
                         "background": 'url(/html/bms/image/fristIcon.png) left top no-repeat',
                         "-webkit-background-size": '40px',
                         "background-size": '40px'
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