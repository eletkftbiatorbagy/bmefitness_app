var SzinkronStart=false;

function Szinkron()
{
	if (SzinkronStart) { return; }
	SzinkronStart=true;
	callback = function(response) { GetRemoteDirs('AJAX_LOGIN2',response); } ;
	var url = AJAX_URL +'get_server_dir.php';
	ajax_hivas(url,'', 'callback' ,'AJAX_LOGIN2',0); 
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