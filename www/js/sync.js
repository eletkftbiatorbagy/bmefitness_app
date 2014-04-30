var SzinkronStart=false;

function fail(error) {
	var desc={};
	desc[FileError.NOT_FOUND_ERR]="File not found";
	desc[FileError.SECURITY_ERR]="Security error";
	desc[FileError.ABORT_ERR]="Abort error";
	desc[FileError.NOT_READABLE_ERR]="File not readable";
	desc[FileError.ENCODING_ERR]="File encoding error";
	desc[FileError.NO_MODIFICATION_ALLOWED_ERR]="No file modification allowed";
	desc[FileError.INVALID_STATE_ERR]="Invalid state";
	desc[FileError.SYNTAX_ERR]="Syntax error";
	desc[FileError.INVALID_MODIFICATION_ERR]="Invalid modification error";
	desc[FileError.QUOTA_EXCEEDED_ERR]="Quota exceeded";
	desc[FileError.TYPE_MISMATCH_ERR]="Type mismatch";
	desc[FileError.PATH_EXISTS_ERR]="Path exists";
	description = desc[error.code] || "Ismeretlen hiba";
    console.log("File ERROR : " + error.code+": "+description+" / " + error.message);
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
	// // window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	// // 	window.requestFileSystem(window.PERSISTENT, 0, function (fs) { StartScanning_OLD(fs); } , fail);
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	
	if (window.device)
	{
		window.requestFileSystem(PERSISTENT,1024*1024, function(fs) { Keres(fs,'')} , function hiba1(e){fail(e);} );
	}
	else
	{
		navigator.webkitPersistentStorage.requestQuota( 1024*1024, function(grantedBytes) {gotFS(grantedBytes);}, 
			function hiba2(e){fail(e);}
		);
	}	
}

function gotFS(grantedBytes) {  console.log(grantedBytes);
		 							 window.requestFileSystem(PERSISTENT, grantedBytes, function(fs) { Keres(fs,'')} , function hiba1(e){fail(e);} );
		 					 }




var szinkronizalni = [];

function Keres(fs, konyvtar)
{
	console.log("getfile:");
	fs.root.getFile('valami1.txt', {create:true}, function(){console.log('Sikeres fájl létrehozás!');}, function hiba3(e){fail(e);});
	
	// fs.root.getDirectory(konyvtar, { create: false },
// 		function(directory) { 
// 			var dirReader = directory.createReader();
// 			var readEntries = function()
// 			{
// 				dirReader.readEntries (function(results) 
// 					 {
// 					  if (!results.length) 
// 					  {		
// 						SzinkronStart(szinkronizalni);
// 					  } 
// 					  else 
// 					  {						
// 						for (var F in results)
// 						{
// 							console.log(F.name);
// 							// if (F.isDirectory) 
// // 							{
// // 								if (RemoteDirs.indexOf(F.name)==-1)
// // 								{
// // 									console.log('Könyvtárt törölni : '+F.name);
// // 								}
// // 								else
// // 								{
// // 									console.log('Könyvtár rendben '+F.name);
// // 								}
// // 							}
// // 							else  // fájl
// // 							{
// // 								var parentDir = F.getParent.name;
// // 								if (RemoteDirs[parentDir].indexOf(F.name)==-1)
// // 								{
// // 									console.log('Fájlt törölni : '+F.name);
// // 								}
// // 								else
// // 								{
// // 									console.log('Fájl rendben '+F.name);
// // 								}
// //							}
// 						}
// 						readEntries();
// 					  }
// 					}, fail);
// 				};
// 			readEntries();
// 		
// 		},fail);
}


function SzinkronStart()
{
	
}


function StartScanning_OLD(fs) 
{
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