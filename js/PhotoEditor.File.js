
var PhotoEditor = PhotoEditor || {};
PhotoEditor.File = function(options){
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.File.prototype = {
    FILE_MAX_COUNT : 6,
    FILE_MAX_SIZE_MB : 5,
    ERROR_TYPE_OVER_MAX_SIZE : "size_error",
    ERROR_TYPE_NOT_IMAGE : "type_error",
    init : function(){
        this._setElement();
        this._attachEvent();
    },
    _setElement : function(){
        this._welFileUpload = $("#file_upload");
        this._welAddFileBtn = $("#add_photo");
    },
    _attachEvent : function(){
        this._welAddFileBtn.on("click", $.proxy(this._openFileUpload, this));
        this._welFileUpload.on("change", $.proxy(this._selectedFiles, this));
    },
    _openFileUpload : function(){
        this._welFileUpload.trigger("click");
    },
    _selectedFiles : function(e){
        var files = e.target.files;

        if(this._validFiles(files)){
            $(document).trigger("file.change", [files]);
        }
    },
    _validFiles: function (files) {
        var sFileError = this._getFileErr(files);
        if (sFileError === this.ERROR_TYPE_NOT_IMAGE) {
            alert("이미지 파일만 선택 가능합니다.");
            return false;
        }

        if(sFileError === this.ERROR_TYPE_OVER_MAX_SIZE){
            alert("용량이 " + this.FILE_MAX_SIZE_MB + "MB 미만인 파일만 선택 가능합니다.");
            return false;
        }

        if (files.length > this.FILE_MAX_COUNT) {
            alert("이미지는 " + this.FILE_MAX_COUNT + "개까지 선택 가능합니다.");
            return false;
        }
        return true;
    },
    _getFileErr : function(files){
        var fileCount = files.length,
            sNotUseFile = "";
        for(var fi=0; fi < fileCount; fi += 1){
            if(files[fi].type.match(/image.*/) === null){
                sNotUseFile = this.ERROR_TYPE_NOT_IMAGE;
            }
            if(files[fi].size > 1048576 * this.FILE_MAX_SIZE_MB){
                sNotUseFile = this.ERROR_TYPE_OVER_MAX_SIZE;
            }
        }
        return sNotUseFile;
    }

};
