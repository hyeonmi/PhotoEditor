/**
 * 이미지 객체를 담고 있는 배열
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.File = function(){
};
PhotoEditor.File.prototype = {
    FILE_MAX_COUNT : 6,
    FILE_MAX_SIZE_MB : 500,
    ERROR_TYPE_OVER_MAX_SIZE : "size_error",
    ERROR_TYPE_NOT_IMAGE : "type_error",

    validFiles: function (files) {
        var fileErrorType = this._checkFileError(files);
        if (fileErrorType === this.ERROR_TYPE_NOT_IMAGE) {
            alert("이미지 파일만 선택 가능합니다.");
            return false;
        }

        if(fileErrorType === this.ERROR_TYPE_OVER_MAX_SIZE){
            alert("용량이 " + this.FILE_MAX_SIZE_MB + "MB 미만인 파일만 선택 가능합니다.");
            return false;
        }

//        if (files.length > this.FILE_MAX_COUNT) {
//            alert("이미지는 " + this.FILE_MAX_COUNT + "개까지 선택 가능합니다.");
//            return false;
//        }
        return true;
    },
    _checkFileError : function(files){
        var fileCount = files.length,
            fileErrorType = "";
        for(var fi=0; fi < fileCount; fi += 1){
            if(files[fi].type.match(/image.*/) === null){
                fileErrorType = this.ERROR_TYPE_NOT_IMAGE;
            }
            if(files[fi].size > 1048576 * this.FILE_MAX_SIZE_MB){
                fileErrorType = this.ERROR_TYPE_OVER_MAX_SIZE;
            }
        }
        return fileErrorType;
    }

};
