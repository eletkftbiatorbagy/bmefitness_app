var SyncStarted=false;

function Sync()
{
	if (SyncStarted) { return; }
	SyncStarted=true;
	
	callback = function(response) { GetRemoteDirs('AJAX_LOGIN',response); } ;
	console.log("ajax jön: "+AJAX_URL);
	ajax_hivas(AJAX_URL +'get_server_dir.php','', 'callback' ,'AJAX_LOGIN'); 
}

var RemoteDirs;

function GetRemoteDirs(DOMelement,response)
{
	if (!response) { return; }
	console.log("ajax response : "+response);
	RemoteDirs = JSON.parse(response);
	FreeCallback(DOMelement);
	
	window.requestFileSystem(window.PERSISTENT, 0, StartScanning, fail);
}

function StartScanning(fs) 
{
        console.log("FileSystem OK");
        fs.root.getDirectory('db', {create: true}, null, fail);
       	var dirReader = fs.root.createReader();
  		var entries = [];
  		
  		var readEntries = function() 
  		{		
			 dirReader.readEntries (function(results) 
			 {
			  if (!results.length) 
			  {		
				listResults(entries.sort());
			  } 
			  else 
			  {						
				entries = entries.concat(toArray(results));
				readEntries();
			  }
			}, fail);
		};
		
		readEntries();
}


function listResults(entries) {
	console.log("listResults : " + JSON.stringify(entries));
  	entries.forEach(function(entry, i) {
   if (entry.isDirectory) { console.log("[" + entry.name + "]"); } else {console.log(entry.name);}
    
  });
}

function toArray(list) {
	console.log("list = "+list);
  return Array.prototype.slice.call(list || [], 0);
}


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


	   