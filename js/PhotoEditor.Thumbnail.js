/**
 * 썸네일 관련 이벤트 모음
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Thumbnail = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Thumbnail.prototype = {
    init: function () {
        this._setElement();
        this._attachEvent();
        this.index = 0;
        this._images = [];
    },
    _setElement: function () {
        this._waThumbnail = $(".thumb ul li");
        this._progress = document.getElementById("progress");
        this._progressArea = $(".progress_area");
        this._thumbnailCount = this._waThumbnail.length;
    },
    _attachEvent: function () {

    },
    createImage : function(files){
        var fileCount = files.length;
        for (var fi = 0; fi < fileCount; fi += 1) {
            var file = files[fi];
            var reader = new FileReader();
            reader.onloadstart = $.proxy(this._onloadstartImage, this);
            reader.onprogress = $.proxy(this._onprogressImage, this);
            reader.onload = $.proxy(this._onloadImage, this, fi);
            reader.onerror = $.proxy(this._onerrorImage, this);
            reader.onloadend = $.proxy(this._onloadendImage, this);
            reader.readAsDataURL(file);
        }
    },
    _callbackCreateImage : function(image){
        this._addImage(image);
        this._setFileToThumbnail(image);
    },
    _onloadstartImage : function(){
         this._showProgress();
    },
    _onprogressImage : function(progressEvent){
        if(progressEvent.lengthComputable){
            this._progress.max = progressEvent.total;
            this._progress.value = progressEvent.loaded;
        }
    },
    _onloadImage : function(index, progressEvent){
        var img = new PhotoEditor.Image({"key" : index,
                                         "fileSrc" : progressEvent.target.result,
                                         "callback" : $.proxy(this._callbackCreateImage, this)});
    },
    _onerrorImage : function(progressEvent){
        console.log(progressEvent.target.error);
    },
    _onloadendImage : function(){
        this._hideProgress();
    },
    deleteImages : function(){
        this._waThumbnail.find("img").remove();
    },
    _getThumbnailImageCount: function () {
        return this._waThumbnail.find("img").length;
    },
    isAddThumbnail : function(){

        return this._thumbnailCount - this._getThumbnailImageCount() > 0;
    },
    isEmptyThumbnail : function(){
        return this._getThumbnailImageCount() <= 0;
    },
    _addImage : function(image){
        this._images.push(image);
    },
    _setFileToThumbnail: function (images) {
        for(var fi = 0; fi < this._thumbnailCount; fi +=1){
            var thumbnail = $(this._waThumbnail[fi]);
            if(thumbnail.find("img").length === 0){
                thumbnail.append(images);
                return true;
            }
        }
    },
    _showProgress : function(){
        this._progressArea.show();
    },
    _hideProgress : function(){
        this._progressArea.hide();
    }
};