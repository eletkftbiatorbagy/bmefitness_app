function ajax_hivas(url,params,callback,DOM,DELETE_msec=1000)
{
				if (network_status=='nincs') { return; }
				url =  url + "?random="+Math.random() + params + "&callback="+callback;
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


function network_status() {
			if (!window.device)  { return "PC"; }
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = '???';
            states[Connection.ETHERNET] = 'Vezetékes';
            states[Connection.WIFI]     = 'WiFi';
            states[Connection.CELL_2G]  = 'Mobil';
            states[Connection.CELL_3G]  = 'Mobil';
            states[Connection.CELL_4G]  = 'Mobil';
            states[Connection.CELL]     = 'Mobil';
            states[Connection.NONE]     = 'nincs';
            return states[networkState];
} 