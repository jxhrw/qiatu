$(document).ready(function() {
	// alert(id)
	var data={"logKey":id}
	$.post('/member/bms/points/operatelog/record', {data: JSON.stringify(data)}, function(result) {
		console.log(result)
		if(result.sc==0){
			for (var i = 0; i < result.data.length; i++) {
				var createTime=formatStrDate1( new Date(parseInt(result.data[i].createTime))) 
				var operator;
				if(result.data[i].operator==undefined){
					var operator=""
				}
				else{
					var operator=result.data[i].operator
				}
				var originalValue;
				if(result.data[i].originalValue==undefined){
					var originalValue=""
				}
				else{
					var originalValue='为“<span>'+result.data[i].targetValue+'</span>”'
				}
				// <p>2016-02-24 20:30:30<br/><span>'+result.data[i].operator+'</span>'+result.data[i].operateDesc+'“<span>2016-02-24</span>”</p>
				$("body").append('<p>'+createTime+'<br/><span>'+operator+'</span>'+result.data[i].operateDesc+originalValue+'</p>')
			};
			
			// $(".mask2").css('display', 'none');
			// $(".hovertable tr").eq(e).css('display', 'none');
		}
	})
});
function formatNum(num){//补0
        return num.toString().replace(/^(\d)$/, "0$1");
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