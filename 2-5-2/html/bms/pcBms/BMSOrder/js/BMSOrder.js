
  //  初始化定义搜索条件
   var searchData={};
 //初始化请求初始表格
    //  jiHeAnimate.load();
   $.ajax({
     url:'/order/bmsh5/list',
     data:{data:'{"pageno":1,"pagecnt":5}'},
     type:'post',
     success:function(resp) {
        // jiHeAnimate.stopLoad();
       createTable(resp.data);
       if(resp.data.length>0){
       $('.tcdPageCode').createPage({
          pageCount:resp.pageinfo.pageAmount,
          current:1,
          backFn:function(p) {
            jiHeAnimate.load();
            var data={pageno:p,pagecnt:5};
            $.ajax({
              url:'/order/bmsh5/list',
              type:'post',
              data:{data:JSON.stringify(data)},
              success:function(resp){
                jiHeAnimate.stopLoad();
                 createTable(resp.data);
              }
            })
          }
       })
     }
     }
   });
   //建立表格函数
    function createTable(content) {
      $('.ifHaveTableContent').empty();
      if(content.length>0){
        $('.ifNoTableContent').css('display', 'none');
      }
      else{
        $('.ifNoTableContent').css('display', 'table-row');
      }
      for(v in content){
        var tr=$('<tr></tr>');
        var td1=$('<td class="first">'+content[v].orderid+'</td>');
        //orderType转换
        var orderType;
        switch (content[v].ordertype) {
          case '2':
            orderType='订房订单';
            break;
          case '6':
             orderType='店内支付';
             break;
        }
        var td2=$('<td>'+orderType+'</td>');
        var td3=$('<td>'+content[v].customerName+'</td>');
        var td4=$('<td>'+content[v].bookerMobile+'</td>');
        var td5=$('<td>'+parseInt(content[v].amount)/100+'</td>');
        if(orderType=='订房订单'){
            var td6=$('<td></td>');
            var checkin=getLocalTime(content[v].checkin).split(' ')[0];
            var checkout=getLocalTime(content[v].checkout).split(' ')[0];
            td6.append(checkin);
            td6.append('-');
            td6.append(checkout);


        }
        else if(orderType=='店内支付'){
          var td6=$('<td>'+getLocalTime(content[v].createtime)+'</td>');
        }
        //订单状态type转化
       var status;
       switch (content[v].status) {
         case '5':
           status='待确认'
           break;
         case '8':
           status='已确认';
           break;
          case '9':
            status='已取消';
            break;
            case '12':
              status='订单完成';
              break;
       }
        var td7=$('<td>'+status+'</td>');
        if(status=='待确认'){
          var span1=$('<a class="clickSpan" href="">确认</a>');
          span1.click(function(e) {
              e.preventDefault();
            var data={orderid:$(this).parent().siblings(".first").text()};
            jiHeAnimate.load();
            $.ajax({
              url:'/order/bmsh5/info',
              type:'post',
              data:{data:JSON.stringify(data)},
              success:function (resp) {
                jiHeAnimate.stopLoad();
                handleData(resp);
                modalService.open({
                  width:'360',
                  height:'430',
                  content:'see',
                  title:'订单详情',
                  close:function() {
                    $('.seeRefuse1').css({'display':'none','margin-top':'0'});
                    $('.seeRefuse2').css({'display':'none','margin-top':'0'});
                    $('.seeRefuse3').css({'display':'none','margin-top':'0'});
                    $('.seeRefuse').text('拒单');
                  }
                })
              }
            })
          });
        var td8=$('<td></td>');
        td8.append(span1);
      }else{
        var span1=$('<a class="clickSpan" href="">查看</a>');
        var td8=$('<td></td>');
        td8.append(span1);
        span1.click(function(e) {
            e.preventDefault();
          var data={orderid:$(this).parent().siblings(".first").text()};
          jiHeAnimate.load();
          $.ajax({
            url:'/order/bmsh5/info',
            type:'post',
            data:{data:JSON.stringify(data)},
            success:function (resp) {
              jiHeAnimate.stopLoad();
              handleData(resp);
              modalService.open({
                width:'360',
                height:'430',
                content:'see',
                title:'订单详情'
              })
            }
          })
        });
      }
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      tr.append(td5);
      tr.append(td6);
      tr.append(td7);
      tr.append(td8);
      $('.ifHaveTableContent').append(tr);

      }
    }
   //获取search参数，重置整个表格
    function getData(){
      var data={};
      //获取时间种类的参数
      if($('#startDate').val()||$('#endDate').val()){
      data.datefield=$('#chooseTime').val();
    }
      if($('#startDate').val()){
      data.startDate=timestap($('#startDate').val());
    }
      if($('#endDate').val()){
      data.endDate=timestap($('#endDate').val());
    }
    if($('#customerName').val()){
      data.customername=$('#customerName').val();
    }
      if($('#customerMobile').val()){
      data.customermobile=$('#customerMobile').val();
    }
    if($('#status').val()){
      data.status=$('#status').val();
    }
    if($('#orderType').val()){
      data.ordertype=$('#orderType').val();
    }
      searchData=data;
      return data;
    }
    /**
     * 模板数据处理
     * [handleData description]
     * @param  {[type]} resp [description]
     * @return {[type]}      [description]
     */
    function handleData(resp){
      var status='';
      switch (resp.data.status) {
        case '5':
          status='待确认';
          break;
        case '8':
           status='已确认';
           break;
        case '9':
           status='已取消';
           break;
        case '12':
           status='已入住';
          break;
      }
      $('.seeStatus').text(status);
       $('.seeOrderName').text(resp.data.ordername);
       $('.seeQuantity').text(resp.data.quantity);
       $('.seeCustomerName').text(resp.data.customerName);
       $('.seeCustomerMobile').text(resp.data.customerMobile);
      $('.seeOrderid').text(resp.data.orderid);
      if(resp.data.ordertype=='6'){
        $('.seeCheckIn').css('display', 'none');
        $('.seeCheckOut').css('display','none');
      }else{
        $('.seeCheckIn').css('display', 'block');
        $('.seeCheckOut').css('display','block');
        $('.seeCheckInTime').text(getLocalTime(resp.data.checkin));
        $('.seeCheckOutTime').text(getLocalTime(resp.data.checkout));
      };
      $('.seePaidTime').text(getLocalTime(resp.data.paidTime));
      $('.seeAmount').text('￥'+parseInt(resp.data.amount)/100);
      $('.seeRightContent').empty();
      var settle=resp.data.settlePayments;
      for(v in settle){
        var payType=''
        switch (settle[v].payType) {
          case '0':
            payType='现金抵现'
            break;
           case '1':
            payType='房券抵现';
            break;
            case '2':
              payType='消费金抵现';
              break;
            case '3':
                payType='积分兑房抵现';
                break;
            case '4':
                payType='积分抵现';
                break;
            case '5':
              payType='折扣抵现';
              break;
            case '6':
              payType='积分抵积分';
              break;
            case '7':
              payType='红包抵现';
              break;
            default:
              payType='';
               break;
        }
        var p=$('<p class="seeDetail"></p>');
        var span=$('<span></span>');
        if(payType!=''){
        span.text('-￥'+parseInt(settle[v].amount)/100+'('+payType+')');
        p.append(span);
        $('.seeRightContent').append(p);
      }
      }

      if("undefined" == typeof(resp.data.bookOperator)){

      }else{
        $('.seeBookOperator').text(resp.data.bookOperator);
      }
      if("undefined" == typeof(resp.data.bookResult)){

      }else{
        var bookResult='';
        switch (resp.data.bookResult) {
          case '0':
            bookResult='无房拒绝';
            break;
          case '1':
             bookResult='预定成功';
             break;
          case '2':
              bookResult='价格错误原因拒绝';
              break;
          default:
               bookResult='其他原因拒绝';
               break;
        }
        $('.seeBookResult').text(bookResult);
      }
      //判断按钮出现的类型
      if(resp.data.status=='5'){
        $('.seeRefuse').css('display', 'block');
        $('.seeConfirm').css('display','block');
        $('.seeClose').css('display', 'none');
      }
      else{
        $('.seeRefuse').css('display', 'none');
        $('.seeConfirm').css('display','none');
        $('.seeClose').css('display', 'block');
      }
    }

   //搜索点击事件
   $('#search').click(function(e) {
      var data=getData();
    $.extend(true,data,{
      pageno:1,
      pagecnt:5
    });
     console.log(data);
     jiHeAnimate.load();
      $.ajax({
        url:'/order/bmsh5/list',
        type:'post',
        data:{data:JSON.stringify(data)},
        success:function(resp) {
          jiHeAnimate.stopLoad();
          createTable(resp.data);

          $('.tcdPageCode').empty();
          if(resp.data.length>0){
          $('.tcdPageCode').createPage({
             pageCount:resp.pageinfo.pageAmount,
             current:1,
             backFn:function(p) {
               var data={pageno:p,pagecnt:5};
               $.extend(true,data, searchData);
               jiHeAnimate.load();
               $.ajax({
                 url:'/order/bmsh5/list',
                 type:'post',
                 data:{data:JSON.stringify(data)},
                 success:function(resp){
                   jiHeAnimate.stopLoad();
                    createTable(resp.data);
                 }
               })
             }
          })
        }
        }

      })
   })
   //商户接单拒单事件
    function operateOrder(result) {
      var orderid=$('.seeOrderid:first').text();
      var data={orderid:orderid,bookresult:result};
      $.ajax({
        url:'/order/bmsh5/bookresult',
        data:{data:JSON.stringify(data)},
        type:'post',
        success:function(resp) {
          if(resp.sc='0'){
            // modalService.close();
            window.location.reload();
          }
        }
      })
    }
    //弹出选择框
    function refuseAnimate(){
      if($('.seeRefuse1').css('display')=='none'){
        $('.seeRefuse1').css('display', 'block');
        $('.seeRefuse2').css('display', 'block');
        $('.seeRefuse3').css('display', 'block');
        $('.seeRefuse1').animate({'margin-top':'-100px'}, 100);
        setTimeout(function() {
            $('.seeRefuse2').animate({'margin-top':'-60px'}, 100);
        },100);
        setTimeout(function() {
            $('.seeRefuse3').animate({'margin-top':'-20px'}, 100);
        },200);

        $('.seeRefuse').text('取消');
      }
      else{
        $('.seeRefuse3').animate({'margin-top':'0'}, 100,function() {
          $('.seeRefuse3').css('display','none');
        });
        setTimeout(function() {
            $('.seeRefuse2').animate({'margin-top':'0'}, 100,function() {
              $('.seeRefuse2').css('display','none');
            });
        },100);
        setTimeout(function() {
            $('.seeRefuse1').animate({'margin-top':'0'}, 100,function() {
                $('.seeRefuse1').css('display','none');
            });
        },200);
          $('.seeRefuse').text('拒单');
      }

    }




       //时间转换时间戳
   function timestap(a) {
       var str = a; // 日期字符串
       //str = str.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
       var date = new Date(str); // 构造一个日期型数据，值为传入的字符串
       var time = date.getTime();
       //时间戳转秒级时间戳
       // time=time+'';
       // time=time.substring(0,time.length-3);
       return time;
   }
   function getLocalTime(nS) {
    //  var t=new Date(parseInt(nS)).toLocaleString();
      var t=new Date(parseInt(nS)).toLocaleString().replace(/\//g, ".").replace(/日/g, " ");
       console.log(t);
      if(t.indexOf('上午')!=-1){
        arrayT=t.split('上午');
        return arrayT[0]+' '+arrayT[1];
      }else{
        console.log(t);
        arrayT=t.split('下午');
        console.log(arrayT[1]);
        time=arrayT[1].split(':');
        time[0]=parseInt(time[0])+12;
        arrayT[1]=time[0]+':'+time[1]+':'+time[2];
        return arrayT[0]+' '+arrayT[1];
      }
   }
