function Sync()
{
	
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
	
	
}

function onFileSystemSuccess(fileSystem) {
        console.log("FileSystem : "+fileSystem.name);
        console.log("Root name : "+fileSystem.root.name);
        console.log(fileSystem.root.fullPath + "db/");
       	//window.resolveLocalFileSystemURI(fileSystem.root.fullPath + "db/", getDirSuccess, fail);
        fileSystem.root.getDirectory("/db/", {create: false, exclusive: false}, getDirSuccess, fail);
    }


function getDirSuccess(dirEntry)
{
	//console.log("dirEntry : "+dirEntry.name);
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

    console.log("File ERROR : " + error.code+" / " + desc[error.code]);
}



    
function DirectoryReader(localURL) {
    this.localURL = localURL || null;
    this.hasReadEntries = false;
}

DirectoryReader.prototype.readEntries = function(successCallback, errorCallback) 
{
	if (this.hasReadEntries) 
		{
        	successCallback([]);
        	return;
    	}
    var reader = this;
    var win = typeof successCallback !== 'function' ? null : function(result) {
        var retVal = [];
        for (var i=0; i<result.length; i++) {
            var entry = null;
            if (result[i].isDirectory) {
                entry = new (require('./DirectoryEntry'))();
            }
            else if (result[i].isFile) {
                entry = new (require('./FileEntry'))();
            }
            entry.isDirectory = result[i].isDirectory;
            entry.isFile = result[i].isFile;
            entry.name = result[i].name;
            entry.fullPath = result[i].fullPath;
            entry.filesystem = new (require('./FileSystem'))(result[i].filesystemName);
            entry.nativeURL = result[i].nativeURL;
            retVal.push(entry);
        }
        reader.hasReadEntries = true;
        successCallback(retVal);
    };
    
	var fail = typeof errorCallback !== 'function' ? null : function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "readEntries", [this.localURL]);
};
	   