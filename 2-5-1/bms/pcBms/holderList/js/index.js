/**
 * Created by Eccentric on 2017/3/31.
 */


var pageNo=1,pageCnt,userType='';
/**
 * td点击事件出现下拉框
 * [description]
 * @return {[type]} [description]
 */
// $('#selectTd').click(function () {
//     var _this=$(this);
//     if($('#selectMenu').length){
//         $('#selectMenu').remove();
//     }else{
//         var width=$(this).css('width');
//         var X = $(this).offset().left;
//         var Y = $(this).offset().top;
//         var div=$('<div id="selectMenu"></div>');
//         div.css(
//             {
//                 'position':'absolute',
//                 'margin-left':X+1,
//                 'margin-top':Y+6,
//                 'width':width,
//                 'background-color':'white',
//                 'border':'1px solid #d8d8d8',
//                 'text-align':'center',
//                 '-webkit-box-shadow': '0 0 1px black',
//                 '-moz-box-shadow':'0 0 1px black',
//                 'box-shadow':'0 0 1px black'
//             }
//         );
//         div.append('<p>全部持有人</p><p>投资人</p><p>普通持有人</p><p>换宿池</p>');
//         div.children('p').css({
//             // 'background':'blue',
//             'padding':'20px',
//             'margin':'0',
//             // 'font-weight':'bold'
//         }).click(function () {
//           if($(this).text()!='全部持有人'){
//             userType=$(this).text();
//           }else{
//             userType='';
//           }
//             _this.text($(this).text());
//             _this.append('<img src="../setCoupons/images/icon.jpg" style="margin-left: 3px">');
//             $('#selectMenu').remove();
//             //接收请求参数
//             $.ajax({
//               url: '/coupon/bms/stat/holderInfo',
//               type: 'post',
//               data:{
//                 data:JSON.stringify({couponId:getUrl(),pageNo:pageNo,pageCnt:10,userType:userType})
//               }
//             })
//             .success(function(resp) {
//               if(resp.sc=='0'){
//                 //执行对table进行排列
//                 forTable(resp.data);
//               }else{
//                 alert(resp.ErrorMsg);
//               }
//
//             });
//
//
//         });
//         $('body').prepend(div);
//
//     }
//
// });

jiHeSelect.addSelect('selectTd',
[{key:"全部持有人",value:''},{key:"投资人",value:"投资人"},{key:'普通持有人',value:'普通持有人'},
{key:'换宿池',value:"换宿池"}],
function(p) {
  userType=p;
  //接收请求参数
             $.ajax({
               url: '/coupon/bms/stat/holderInfo',
               type: 'post',
               data:{
                 data:JSON.stringify({couponId:getUrl(),pageNo:pageNo,pageCnt:10,userType:userType})
               }
             })
             .success(function(resp) {
               if(resp.sc=='0'){
                 //执行对table进行排列
                 forTable(resp.data);
               }else{
                 alert(resp.ErrorMsg);
               }

             });
})
//解析url
function getUrl() {
  var url=location.search.split('=');
  return url[1];
}

//初始化获取couponName
  $.ajax({
    url: '/coupon/bms/baseinfo',
    type: 'post',
    data: {data: JSON.stringify({couponId:getUrl()})}
  })
  .success(function(resp) {
     $('.voucherName').text(resp.data.couponName);
  })


//接收请求参数
//初始化请求
$.ajax({
  url: '/coupon/bms/stat/holderInfo',
  type: 'post',
  data:{
    data:JSON.stringify({couponId:getUrl(),pageNo:pageNo,pageCnt:5})
  }
})
.success(function(resp) {
  if(resp.sc=='0'){
    //右上角name赋值

    //记录页码以及总页数


    //执行对table进行排列
    forTable(resp.data);
    if(resp.data.length){
    $('.tcdPageCode').createPage({
        pageCount:resp.pageinfo.pageAmount,
        current:1,
        backFn:function (p) {
          //记录页码
          pageNo=p;
          $.ajax({
            url: '/coupon/bms/stat/holderInfo',
            type: 'post',
            data:{
              data:JSON.stringify({couponId:getUrl(),pageNo:p,pageCnt:10,userType:userType})
            }
          })
          .success(function(resp) {
             if(resp.sc=='0'){
              forTable(resp.data);
             }
          })

        }
    })
  }
  }else{
    alert(resp.ErrorMsg);
  }


});
/**
 * ajax取到data后对tabel进行赋值
 * [forTable description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function forTable(data) {
   if(!data.length){
     $('.ifNoTableContent').css('display', 'table-row');
     $('.ifHaveTableContent').empty();
   }else{
     $('.ifNoTableContent').css('display', 'none');
      $('.ifHaveTableContent').empty();
     //将data内数据导入table
      for(v in data){
        var tr=$('<tr></tr>');
        var td1=$('<td>'+data[v].username+'</td>');
        tr.append(td1);
        var td2=$('<td>'+data[v].mobile+'</td>');
        tr.append(td2);
        var td3=$('<td>'+parseInt(data[v].grantAmount)/100+'</td>');
        tr.append(td3);
        var td4=$('<td>'+parseInt(data[v].remain)/100+'</td>');
        tr.append(td4);
        var td5=$('<td>'+data[v].checkoffAmount+'</td>');
        tr.append(td5);
        var td6=$('<td>'+data[v].userType+'</td>');
        tr.append(td6);
        $('.ifHaveTableContent').append(tr);
      }
   }
}
/**
 * 获取下载所需参数
 * [getParams description]
 * @return {[type]} [description]
 */
function getParams() {
  return JSON.stringify({couponId:getUrl()});
}

$('.downloadExcel').click(function(event) {
  /*下载获取后台链接地址 */
  $.ajax({
    url: '',
    type: 'post',
    data: {data:getParams()},
  })
  .success(function(resp) {
      //执行下载excel
      // createDownload();
  });

});


//创建下载
 function createDownload(url){
   var iframe=document.createElement('iframe');
       iframe.src=url;
       iframe.style.display='none';
       document.body.appendChild(iframe);
 }
