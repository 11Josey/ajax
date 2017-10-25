/*封装ajax方法和jsonp方法*/
function ajax(obj){	
	var defaults = {
		type:'get',
		async:true,
		url:'#',
		data:{},
		jsonp:'callback',
		dataType:'text',
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
function ajax4Jsonp(defaults){
	var param='';
	for(var attr in defaults.data) {
		param+=attr+'='+defaults.data[attr]+'&';
	}
	if(param) {
		param = param.substring(0,param.length-1);
	}
	var  cbName = 'jquery'+('11.1.1.0'+Math.random()).replace(/\D/g,'')+'_'+(new Date().getTime());
	if(defaults.jsonpCallback) {
		cbName=defaults.jsonpCallback ;
	}
	//服务端调用window[cbName]这个函数,里面的data是形参,在函数内部,又调用了success函数,里面的data是实参
	window[cbName] = function (data) {
		defaults.success(data);
	}
	var script = document.createElement('script');
	script.src=defaults.url +'?'+defaults.jsonp+'='+defaults.jsonpCallback+'&'+param;
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);

}
function ajax4Json(defaults) {
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
					data = JSON.parse(data);
				}
				defaults.success(data);
			}
		}
	}

}
