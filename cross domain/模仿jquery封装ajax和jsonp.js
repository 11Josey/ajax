/*封装ajax方法和jsonp方法*/
function ajax(obj){	
	var defaults = {
		type:'get',
		async:true,
		url:'#',
		data:{},//传参
		jsonp:'callback',//callback=cbName中的键
		dataType:'text',//默认是'text';
		success:function(data){
			console.log(data);
		}
	};
	for(var key in obj) {
		defaults[key] =obj[key];
	}
	if(defaults.dataType=='jsonp') {
		ajax4Jsonp(defaults);
	}else {
		ajax4Json(defaults);
	}
}
//jsonp的封装
function ajax4Jsonp(defaults){
	var param='';
	for(var attr in defaults.data) {
		param+=attr+'='+defaults.data[attr]+'&';
	}
	if(param) {
		param = param.substring(0,param.length-1);
	}
	//默认情况下回调函数的名字随机产生,用时间戳可以避免浏览器缓存
	var  cbName = 'jquery'+('11.1.1.0'+Math.random()).replace(/\D/g,'')+'_'+(new Date().getTime());
	if(defaults.jsonpCallback) {
		cbName=defaults.jsonpCallback ;
	}
	//服务端调用window[cbName]这个函数,里面的data是形参,由服务端传递过来,
	//注意这个函数一定要添加到全局环境中,不然外部无法调用
	//在这个函数内部,又调用了success函数,里面的data是实参
	window[cbName] = function (data) {
		defaults.success(data);
	}
	/*jsonp的实质,动态创建script标签,script具有跨域的能力*/
	var script = document.createElement('script');
	script.src=defaults.url +'?'+defaults.jsonp+'='+defaults.jsonpCallback+'&'+param;
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);

}
function ajax4Json(defaults) {
	//用原生ajax的方法封装,注意get和post的区别
	var xhr = null;
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}
	else {
		xhr = new ActiveXObject('MicrosoftXMLHTTP');
	}

	var param='';
	for(var attr in defaults.data) {
		param+=attr+'='+defaults.data[attr]+'&';
	}
	if(param) {
		param = param.substring(0,param.length-1);
	}
	if(defaults.type=='get') {
		defaults.url+='?'+param;	
	}
	xhr.open('get',defaults.url,defaults.async);
	var data = null;
	if(defaults.type=='post') {
		data = param;
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	}
	xhr.send(data);
	//同步请求没有回调,直接返回结果
	if(!defaults.async) {
		var data = xhr.responseText;
		if(defaults.dataType=='json') {
			return JSON.parse(data);
		}else {
			return data;
		}
	}
	xhr.onreadystatechange = function () {
		if(xhr.readyState==4) {
			if(xhr.status==200) {
				var data = xhr.responseText;
				if(defaults.dataType=='json') {
					data = JSON.parse(data);//将json转换为对象
				}
				defaults.success(data);//调用success函数
			}
		}
	}

}
