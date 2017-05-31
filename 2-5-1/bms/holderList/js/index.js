/**
 * Created by Eccentric on 2017/3/31.
 */


var pageNo=1,pageCnt,userType='';
jiHeSelect.addSelect('selectTd',
[{key:"全部持有人",value:''},{key:"原始持有人",value:"原始持有人"},{key:'受让人',value:'受让人'},
{key:'换宿池',value:"换宿池"}],
function(p) {
  userType=p;
  //接收请求参数
             $.ajax({
               url: '/coupon/bms/stat/holderInfo',
               type: 'post',
               data:{
                 data:JSON.stringify({couponId:getUrl(),pageNo:1,pageCnt:5,userType:userType})
               }
             })
             .success(function(resp) {
               if(resp.sc=='0'){
                 //执行对table进行排列
                 forTable(resp.data);
                 //清空分页器
                 $('.tcdPageCode').empty();
                 //重建分页器
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
                           data:JSON.stringify({couponId:getUrl(),pageNo:p,pageCnt:5,userType:userType})
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
              data:JSON.stringify({couponId:getUrl(),pageNo:p,pageCnt:5,userType:userType})
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

//创建下载
 function createDownload(){
   var iframe=document.createElement('iframe');
       iframe.src='/coupon/bms/excel/holderInfo?data='+encodeURIComponent(getParams());
       iframe.style.display='none';
       document.body.appendChild(iframe);
 }

 //点击下载事件
 $('.downloadExcel').click(function(){
     createDownload();
 })
