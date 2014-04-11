function ajax_hivas(url,params,callback,DOM,DELETE_msec=1000)
{
				url = AJAX_URL + url + "?random="+Math.random() + "&callback="+callback;
				var script = document.createElement('script');
				script.setAttribute("id",DOM);
				script.setAttribute('src', url);
				document.getElementsByTagName('head')[0].appendChild(script);
				setTimeout( function() { FreeCallback(DOM); }  ,DELETE_msec);  
}

function FreeCallback(DOM)
{
	var CALLBACK_item = document.getElementById(DOM);
	if (CALLBACK_item) { CALLBACK_item.parentNode.removeChild(CALLBACK_item); }
}