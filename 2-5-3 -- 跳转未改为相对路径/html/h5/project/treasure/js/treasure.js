/**
 * create by eccentric
 * time by 2017/5/18
 */

//设置content内容大小
var windowHeight=$(document).height();
console.log(windowHeight);
$('#content').css('height',windowHeight+'px');
//获取url里的参数id，mc；
function UrlSearch(){
 var name,value;
 var str=location.href; //取得整个地址栏
 var num=str.indexOf("?")
 str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

 var arr=str.split("&"); //各个参数放到数组里
 for(var i=0;i < arr.length;i++){
  num=arr[i].indexOf("=");
  if(num>0){
   name=arr[i].substring(0,num);
   value=arr[i].substr(num+1);
   this[name]=value;
   }
  }
}
 var request=new UrlSearch();
 if(request.id!=undefined){
   var actId=request.id;
 }
 if(request.mc!=undefined){
   var mc=request.mc;
 }
 if(request.actId!=undefined){
   var actId=request.actId;
 }
 var width=$(document).width()*0.9;
//点击寻宝
$('#open').click(function(){
  var data={actId:actId,mc:mc};
    $.ajax({
      url: '/activity/arrival/treasure/',
      type: 'get',
      data: {data: JSON.stringify(data)},
      success:function(resp){
        // 未注册
        if(resp.sc!='0'){
          $('#envelope').css('display', 'none');
          $('#getAward').css('display', 'none');
          $('#noAward1').css('display', 'none');
          $('#noAward2').css('display', 'block');
          $('#getAward2').css('display', 'none');
        }
        else{
          //获得消费金
          if(resp.data.prizeType=='4'){
            $('#faceValue').text(resp.data.faceValue+'.00');
              //判断现金margin
            $('#getAwardName').text(resp.data.prizeName);
            $('#envelope').css('display', 'none');
            $('#getAward').css('display', 'block');
            $('#noAward1').css('display', 'none');
            $('#noAward2').css('display', 'none');
            $('#getAward2').css('display', 'none');
            var p1width=$('.p1').css('width').substring(0,$('.p1').css('width').length-2);
            var marginWidth=(parseInt(width)-parseInt(p1width))/2;
            $('.p1').css('margin-left',marginWidth+'px');
          }
          else if(resp.data.prizeType=='0'){
            $('#noAward1Name').text(resp.data.prizeDesc);
            $('#envelope').css('display', 'none');
            $('#getAward').css('display', 'none');
            $('#noAward1').css('display', 'block');
            $('#noAward2').css('display', 'none');
            $('#getAward2').css('display', 'none');
          }
          else if(resp.data.prizeType=='1'){
            $('#showerGel').attr('src',resp.data.prizeImg);
            $('#getAward2Name').text(resp.data.prizeName);
            $('#envelope').css('display', 'none');
            $('#getAward').css('display', 'none');
            $('#noAward1').css('display', 'none');
            $('#noAward2').css('display', 'none');
            $('#getAward2').css('display', 'block');
          }
        }
      }
    })

});


//消费金跳转
$('#look').click(function() {
  window.location.href='http://test.jihelife.com/user/h5/mbcenter?member_hotelid=39500'
})
