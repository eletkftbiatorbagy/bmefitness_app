var SzinkronStart=false;

function fail(error) {
	console.log("File ERROR : "+error.name+" / " + error.message);
}

function Szinkron()
{
	if (SzinkronStart) { return; }
	SzinkronStart=true;
	callback = function(response) { GetRemoteDirs('AJAX_SZINKRON',response); } ;
	var url = AJAX_URL +'get_server_dir.php';
	ajax_hivas(url,'', 'callback' ,'AJAX_SZINKRON',0); 
}

var RemoteDirs;

function GetRemoteDirs(DOMelement,response)
{
	if (!response) { return; }
	RemoteDirs = eval(response);
	FreeCallback(DOMelement);
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	
	navigator.webkitPersistentStorage.requestQuota( 1024*1024, function(grantedBytes) {gotFS(grantedBytes);}, 
			function hiba2(e){fail(e);}
		);
	
	
}

function gotFS(grantedBytes) {  console.log(grantedBytes);
		 							 window.requestFileSystem(PERSISTENT, grantedBytes, function(fs) { Keres(fs,'db')} , function hiba1(e){fail(e);} );
		 					 }

var szinkronizalni = [];

function Keres(fs, konyvtar)
{
	console.log("getfile:");
	fs.root.getDirectory(konyvtar,{ create: true }, function(){console.log('Sikeres könyvtár létrehozás!');}, function hiba3(e){fail(e);});
	fs.root.getFile(konyvtar+'/valami1.txt', {create:true}, function(){console.log('Sikeres fájl létrehozás!');}, function hiba4(e){fail(e);});
	navigator.webkitPersistentStorage.queryUsageAndQuota( 
		function(used, remaining) {
		  console.log("Used quota: " + used + ", remaining quota: " + remaining);
		}, function(e) {
		  console.log('Error', e); 
		} );
	fs.root.getDirectory(konyvtar, { create: false },
		function(directory) { 
			var dirReader = directory.createReader();
			var readEntries = function()
			{
				dirReader.readEntries (function(results) 
					 {
					  if (!results.length) 
					  {		
						SzinkronStart(szinkronizalni);
					  } 
					  else 
					  {						
						for (var F in results)
						{
							console.log(F.name);
							// if (F.isDirectory) 
// 							{
// 								if (RemoteDirs.indexOf(F.name)==-1)
// 								{
// 									console.log('Könyvtárt törölni : '+F.name);
// 								}
// 								else
// 								{
// 									console.log('Könyvtár rendben '+F.name);
// 								}
// 							}
// 							else  // fájl
// 							{
// 								var parentDir = F.getParent.name;
// 								if (RemoteDirs[parentDir].indexOf(F.name)==-1)
// 								{
// 									console.log('Fájlt törölni : '+F.name);
// 								}
// 								else
// 								{
// 									console.log('Fájl rendben '+F.name);
// 								}
//							}
						}
						readEntries();
					  }
					}, fail);
				};
			readEntries();
		
		},fail);
}


function SzinkronStart(files)
{
	
}


function StartScanning_OLD(fs) 
{
		console.log('start scanning...');
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
  	entries.forEach(function(entry, i) {
   if (entry.isDirectory) { console.log("[" + entry.name + "]"); } else {console.log(entry.name+"  "+entry.size);}
    
  });
}

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
} 