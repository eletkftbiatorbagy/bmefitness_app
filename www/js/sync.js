function Sync()
{
	
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
	
	
}

function onFileSystemSuccess(fileSystem) {
        console.log("FileSystem : "+fileSystem.name);
        console.log("Root name : "+fileSystem.root.name);
        fileSystem.root.getDirectory("db/", {create: false, exclusive: false}, getDirSuccess, fail);
    }


function getDirSuccess(dirEntry)
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