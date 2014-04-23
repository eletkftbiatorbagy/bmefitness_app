function Sync()
{
	
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
	
	
}

function onFileSystemSuccess(fileSystem) {
        console.log("FileSystem : "+fileSystem.name);
        console.log("Root name : "+fileSystem.root.name);
        fileSystem.root.getDirectory("db/", {create: false, exclusive: false}, getDirSuccess, fail);
    }


function Get_Dir(dirEntry)
{
	var directoryReader = dirEntry.createReader();
	directoryReader.readEntries(success,fail);
	
}

function success(entries) {
    var i;
    for (i=0; i<entries.length; i++) {
        console.log(entries[i].name);
    }
}


function fail(error) {
    console.log("Error: " + error.code+" / " + error.description);
}