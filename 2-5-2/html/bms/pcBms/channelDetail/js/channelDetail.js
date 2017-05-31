$(document).ready(function() {
	var data1={"yearMonth":id}
     $.post('/member/bms/points/coopreport/channel',{data: JSON.stringify(data1)}, function(data) {
        console.log(data)
        if(data.sc==0){
           for (var i = 0; i < data.data.length; i++) {
           	$(".bmsEnquiryBottom").append('<ul><li>'+data.data[i].hotelChannel+'</li><li>'+data.data[i].developMembers+'</li><li>'+data.data[i].coopIncome/100+'</li></ul>')
           };
        }
        
     })
});