$(document).ready(function() {
	$.post('/member/h5/info', function(data) {
	    console.log(data)
	    if(data.sc=="0"){
	        $(".consumingRecords span").html(data.data.memberGradeDesc+"会员");
	     if(data.data.memberGrade==0){
            // alert(person.getRequestData().data.upgradeCondition)
             $(".consumingRecords strong").html(data.data.upgradeCondition)
         }
         else if(data.data.memberGrade==1){
             $(".consumingRecords strong").html(data.data.upgradeCondition+"<br/>"+data.data.keepgradeCondition)
         }
         else if(data.data.memberGrade==2){
            $(".consumingRecords strong").html(data.data.keepgradeCondition)
         }
	        // $(".consumingRecords strong").html(data.data.upgradeCondition+"<br/>"+data.data.keepgradeCondition)
	        
	    }
	})
});