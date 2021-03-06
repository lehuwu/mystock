
var redirect_url="/stock/mystock/0";

function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

function request_login(){
    redirect_url = parseURL(document.location.href).path;
    $.cookie("redirect_url",redirect_url,{path: '/' });
    document.location.href = '/login';
}

//格式化营收数据
function formatRevenceVal(num){
   return toThousands(Math.floor(num/1000000));
}

//解析url地址
function parseURL(url) {
   var a =  document.createElement('a');
   a.href = url;
   return {
       source: url,
       protocol: a.protocol.replace(':',''),
       host: a.hostname,
       port: a.port,
       query: a.search,
       params: (function(){
           var ret = {},
               seg = a.search.replace(/^\?/,'').split('&'),
               len = seg.length, i = 0, s;
           for (;i<len;i++) {
               if (!seg[i]) { continue; }
               s = seg[i].split('=');
               ret[s[0]] = s[1];
           }
           return ret;
       })(),
       file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
       hash: a.hash.replace('#',''),
       path: a.pathname.replace(/^([^\/])/,'/$1'),
       relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
       segments: a.pathname.replace(/^\//,'').split('/')
   };
}


function addMyStock(code,cnname,stype){
    bootbox.confirm("确认添加该股票吗？", function(result){
     /* your callback code */
      if(result==true){
            var aj = $.ajax( {
          url:$SCRIPT_ROOT + '/stock/add',
          data:{
                   code : code,
                   cname : cnname,
                   stype : stype
          },
          type:'post',
          cache:false,
          dataType:'json',
          success:function(data) {
              if(data.msg =="true" ){
                  //bootbox.alert('添加成功');
                  toastr.info('添加成功');
                  setTimeout("window.location.reload();",1500);
              }else{
                  //bootbox.alert(data.msg);
                  toastr.error(data.msg);
              }
           }
          });
      }
     })
}


// 选为备选股
function unselStock(code,el) {
    var aj = $.ajax( {
    url:$SCRIPT_ROOT + '/stock/remove',
    data:{
             code : code
    },
    type:'post',
    cache:false,
    dataType:'json',
    success:function(data) {
        if(data.msg =="true" ){
            if(typeof(list_table) != "undefined")
            list_table.row($(el).parents('tr')).remove().draw( false );
            else{
            toastr.info('操作成功');
            setTimeout("window.location.reload();",1500);
            }

            //window.location.reload();
        }else{
            toastr.error(data.msg);
            //console.warn("server result is:"+data.msg);
        }
     }
    });
  };

//选为自选股
function selStock(code,el) {
    var aj = $.ajax( {
    url:$SCRIPT_ROOT + '/stock/rollback',
    data:{
             code : code
    },
    type:'post',
    cache:false,
    dataType:'json',
    success:function(data) {
        if(data.msg =="true" ){
            if(typeof(list_table) != "undefined")
            list_table.row($(el).parents('tr')).remove().draw(false);
            else{
            toastr.info('操作成功');
            setTimeout("window.location.reload();",1500);
            }
            //window.location.reload();
        }else{
            //console.warn("server result is:"+data.msg);
            toastr.error(data.msg);
        }
     }
    });
  };


// 取消关注，从备选股清除
function delStock(code,el) {
    bootbox.confirm("确认从所有股池中删除该股票吗？", function(result){
     /* your callback code */
      if(result==true){
            var aj = $.ajax( {
            url:$SCRIPT_ROOT + '/stock/del',
            data:{
                     code : code
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data) {
                if(data.msg =="true" ){
                if(typeof(list_table) != "undefined")
                    list_table.row($(el).parents('tr')).remove().draw(false);
                else{
                    toastr.info('操作成功');
                    setTimeout("window.location.reload();",1500);
                    }
                    //window.location.reload();
                }else{
                     toastr.error(data.msg);
                    //console.warn("server result is:"+data.msg);
                }
             }
            });
        }
      })
}




function onCommentEdit(id,pid){
      var c = $("#"+id+"").html().replace(/\<br\>/g,'\n');
      var content_em = $("div#comment textarea[name='content']");
      content_em.val(c);
      $("div#comment #comment-id").val(pid);
}

function updateData(code){
    var aj = $.ajax( {
    url:$SCRIPT_ROOT + '/setting/update/',
    data:{
             code : code
    },
    type:'post',
    cache:false,
    dataType:'json',
    success:function(result){
         if(result.msg == true){
             alert('数据更新成功');
         }else{
            console.error(result.msg);
         }
        }
    });

};