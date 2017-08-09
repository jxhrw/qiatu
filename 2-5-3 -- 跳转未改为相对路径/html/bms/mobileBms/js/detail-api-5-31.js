var dataDetail={"id":id}


KISSY.use('io,node',function(S,io,Node){

    io({
    	  type:'post',
        url:'/member/bms/points/record/info',
        data:{
            data:JSON.stringify(dataDetail)
        },
        success:function(data){
          console.log(data)
           if(data.sc==0){
              //document.title=data.data.pointsChangeDesc
              Node.one(".detailTopli1").html(data.data.realName)
              Node.one(".detailTopli2").html(data.data.memberGradeDesc)
              Node.one(".detailTopli3").html(data.data.mobile)
              var checkin=formatStrDate(new Date(parseInt(data.data.checkin)))
              var checkout=formatStrDate(new Date(parseInt(data.data.checkout)))
              var roomName
              if(data.data.roomName==undefined){
                var roomName=""
              }
              else{
                var roomName=data.data.roomName
              }
              if(data.data.status==2&&data.data.pointsType==11){
                Node.one(".seldel").remove()
                Node.one(".detailEdit").remove()
                Node.one(".detailTopli8").parent().remove()
                Node.one(".detailTopli4").html(checkin)
                Node.one(".detailTopli5").html(checkout)
                Node.one(".detailTopli6").html(data.data.currency+data.data.amount/100)
                Node.one(".detailTopli7").html(roomName)
                Node.one("button").remove()
                Node.one(".sel").remove()
                
                
              }
              else if(data.data.status==2&&data.data.pointsType==12){
                Node.one(".seldel").remove()
                Node.one(".detailEdit").remove()
                Node.one(".detailTopli4").parent().remove()
                Node.one(".detailTopli5").parent().remove()
                Node.one(".detailTopli7").parent().remove()
                Node.one(".detailTopli6").html(data.data.currency+data.data.amount/100)
                Node.one(".detailTopli8").html(checkin)
                Node.one("button").remove()
                Node.one(".sel").remove()

              }
              else if(data.data.status==1&&data.data.pointsType==12){
                Node.one(".detailTopli4").parent().remove()
                Node.one(".detailTopli5").parent().remove()
                Node.one(".detailTopli7").parent().remove()
                Node.one(".detailTopli6").parent().remove()
                Node.one(".detailTopli8").parent().remove()
                Node.one(".detailEditli2").parent().remove()
                Node.one(".detailEditli3").parent().remove()
                Node.one(".detailEditli4").parent().remove()
                Node.one(".detailEditli1").html(checkin)
                Node.one(".amoumt").val(data.data.amount/100)
              }
              else if(data.data.status==1&&data.data.pointsType==11){
                Node.one(".detailTopli4").parent().remove()
                Node.one(".detailTopli5").parent().remove()
                Node.one(".detailTopli7").parent().remove()
                Node.one(".detailTopli6").parent().remove()
                Node.one(".detailTopli8").parent().remove()
                Node.one(".detailEditli1").parent().remove()
                Node.one(".detailEditli2").html(checkin)
                Node.one(".detailEditli3").html(checkout)
                Node.one(".detailEditli4 input").val(roomName)
                Node.one(".amoumt").val(data.data.amount/100)
              }
              else if(data.data.status==0&&data.data.pointsType==11){
                Node.one(".detailTopli4").parent().remove()
                Node.one(".detailTopli5").parent().remove()
                Node.one(".detailTopli7").parent().remove()
                Node.one(".detailTopli8").parent().remove()
                Node.one(".detailTopli6").parent().remove()
                Node.one(".detailEditli1").parent().remove()
                Node.one(".detailEditli2").html(checkin)
                Node.one(".detailEditli3").html(checkout)
                Node.one(".detailEditli4 input").val(roomName)
                Node.one(".amoumt").val(data.data.amount/100)
              }
              if(data.data.pointsType==11){
                var $=Node.all;     
                $(".detailEdit li").on("click", function(event){
                  var s=$(this).index();
                  // alert(s)
                  if(s==0){
                    $("#mask").show();
                  }
                  else if(s==1){
                    $("#mask").show();
                  }


                })
                $("#xiugaiBtn").on("click", function(event){
                  var checkinTime=new Date($(".detailEditli2").html()).getTime()
                  var checkoutTime=new Date($(".detailEditli3").html()).getTime()
                  // alert($(".amoumt").val()*100)
                  var xiugaiData={"userid":data.data.uid,"id":data.data.id,"pointstype":data.data.pointsType,"checkin":checkinTime,"checkout":checkoutTime,"amount":parseInt($(".amoumt").val()*100),"roomName":$(".detailEditli4 input").val(),"roomNights":1}
                  KISSY.use('io,node',function(S,io,Node){
                    io({
                      type:'post',
                      url:'/member/bms/points/reward/edit',
                      data:{
                         data:JSON.stringify(xiugaiData)
                      },
                      success:function(res){
                        console.log(res)
                        if(res.sc==0){
                          $(".tip").html("修改成功").css('display', 'block');
                                setTimeout(function() {
                                    $(".tip").css('display', 'none');
                                },2000)
                        }
                      }
                    });
                  });


                })
              }
              else if(data.data.pointsType==12){
                var $=Node.all;       
                $(".detailEdit li").on("click", function(event){
                  var s=$(this).index();
                  // alert(s)
                  if(s==0){
                    $("#mask1").show();
                  }



                })


                $("#xiugaiBtn").on("click", function(event){
                  var checkinTime=new Date($(".detailEditli1").html()).getTime()
                  var xiugaiData={"userid":data.data.uid,"id":data.data.id,"pointstype":data.data.pointsType,"checkin":checkinTime,"amount":parseInt($(".amoumt").val()*100)}
                  KISSY.use('io,node',function(S,io,Node){
                    io({
                      type:'post',
                      url:'/member/bms/points/reward/edit',
                      data:{
                         data:JSON.stringify(xiugaiData)
                      },
                      success:function(res){
                        console.log(res)
                         if(res.sc==0){
                          $(".tip").html("修改成功").css('display', 'block');
                                setTimeout(function() {
                                    $(".tip").css('display', 'none');
                                },2000)
                        }
                      }
                    });
                  });


                })
              }

              //pointsType 11住宿消费 12非住宿消费 13积分加速（统一处理，立即生效）14订单取消  15推荐奖励 16积分赠送（统一处理，立即生效） 21兑换房间 22兑换非住宿消费 23积分过期 99其他
              // if(data.data.pointsType)
           // if(data.data.pointsType==11){

           // }
              // KISSY.use('node',function(S,Node){
              //   Node.one('#xiugaiBtn').on('click',function(e){
              //     var data={"checkin":timestamp1,"checkout":timestamp2,"amount":parseInt($(".mask3 .amount").val()*100),"roomName":$(".mask3 .roomNights").val(),"roomNights":1}
  
              //     var xiugaiData={"userid":data.data.uid,"id":data.data.id,"pointstype":data.data.pointsType,}
              //     KISSY.use('io,node',function(S,io,Node){
              //       io({
              //         type:'post',
              //         url:'/member/bms/points/reward/edit',
              //         data:{
              //           zipcode:10010
              //         },
              //         success:function(data){
              //           Node.one('#weather-con').html('<em>' + data + '</em> 摄氏度');
              //         }
              //       });
              //     });
              //   });
              // });






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
                return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
                break;
    }
  } 

