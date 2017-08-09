//��ҳ���
/**
2014-08-05 ch
**/
(function($){
	var ms = {
		init:function(obj,args){
			return (function(){
				ms.fillHtml(obj,args);
				ms.bindEvent(obj,args);
			})();
		},
		//���html
		fillHtml:function(obj,args){
			return (function(){
				obj.empty();
				//创建上一页
				if(args.current > 1){
					obj.append('<a href="javascript:;" class="prevPage"><</a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<span class="disabled"><</span>');
				}
				//创建具体页码
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
				}
				if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				var start = args.current -2,end = args.current+2;
				if((start > 1 && args.current < 4)||args.current == 1){
					end++;
				}
				if(args.current > args.pageCount-4 && args.current >= args.pageCount){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageCount && start >= 1){
						if(start != args.current){
							obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
						}else{
							obj.append('<span class="current">'+ start +'</span>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
				}
				//创建下一页
				if(args.current < args.pageCount){
					obj.append('<a href="javascript:;" class="nextPage">></a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<span class="disabled">></span>');
				}
				//创建总页数显示
				obj.append('<span class="tcdPageRight" style="margin-left: 10px;padding-top: 5px">共'+ args.pageCount+'页</span>');

				//创建跳页
				obj.append('<span class="tcdPageRight" style="margin-left: 25px">到第</span>');
				obj.append('<input type="text" class="tcdPageInput"/>');
				obj.append('<span class="tcdPageRight">页</span>');
				obj.append('<button class="tcdPageButton">确定</button>')
			})();
		},
		//���¼�
		bindEvent:function(obj,args){
			obj.off("click");
			return (function(){
				obj.on("click","a.tcdNumber",function(){
					var current = parseInt($(this).text());
					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current);
					}
				});
				//��һҳ
				obj.on("click","a.prevPage",function(){
					var current = parseInt(obj.children("span.current").text());
					ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current-1);
					}
				});
				//��һҳ
				obj.on("click","a.nextPage",function(){
					var current = parseInt(obj.children("span.current").text());
					ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current+1);
					}
				});

				//
				obj.on("click",'button.tcdPageButton',function () {
					// console.log($('input.tcdPageInput').val());
					var current=parseInt(obj.children('input.tcdPageInput').val());

					if(!current){
						console.log("hyk");
					}
					else{
						console.log(current);	
						ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
						if(typeof(args.backFn)=="function"){
							args.backFn(current);
						}
					}
				})
			})();
		}
	}
	$.fn.createPage = function(options){
		var args = $.extend({
			pageCount :10,
			current : 1
			// backFn : function(){}
		},options);
		ms.init(this,args);
	}
})(jQuery);