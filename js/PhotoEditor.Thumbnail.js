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
        this._thumbnails = $(".thumb ul li");
        this._progress = document.getElementById("progress");
        this._progressArea = $(".progress_area");
        this._thumbnailCount = this._thumbnails.length;
    },
    _attachEvent: function () {

    },
    createImage : function(files){
        var fileCount = files.length;
        var reader = new FileReader();
        reader.onloadstart = $.proxy(this._onloadstartImage, this);
        reader.onprogress = $.proxy(this._onprogressImage, this);
        reader.onload = $.proxy(this._onloadImage, this);
        reader.onerror = $.proxy(this._onerrorImage, this);
        reader.onloadend = $.proxy(this._onloadendImage, this);
        for (var fi = 0; fi < fileCount; fi += 1) {
            var file = files[fi];
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
    _onloadImage : function(progressEvent){
        //dataURL
        var image = new PhotoEditor.Image({
                                         "fileSrc" : progressEvent.target.result,
                                         "callback" : $.proxy(this._callbackCreateImage, this)
                                        });
    },
    _onerrorImage : function(progressEvent){
        console.log(progressEvent.target.error);
    },
    _onloadendImage : function(){
        this._hideProgress();
    },
    deleteImages : function(){
        this._thumbnails.find("img").remove();
    },
    _getThumbnailImageCount: function () {
        return this._thumbnails.find("img").length;
    },
    _getThumbnailCount: function () {
        return this._thumbnailCount;
    },
    isNotAddThumbnail : function(){
        return this._getThumbnailCount() - this._getThumbnailImageCount() <= 0;
    },
    isEmptyThumbnail : function(){
        return this._getThumbnailImageCount() <= 0;
    },
    _addImage : function(image){
        this._images.push(image);
    },
    _setFileToThumbnail: function (images) {
        for(var fi = 0; fi < this._getThumbnailCount(); fi +=1){
            var thumbnail = $(this._thumbnails[fi]);
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