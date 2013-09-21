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
        this.waThumbnail = $(".thumb ul li");
    },
    _attachEvent: function () {

    },
    createImage : function(files){
        var fileCount = files.length;
        for (var fi = 0; fi < fileCount; fi += 1) {
            var file = files[fi];
            var reader = new FileReader();
            reader.onloadend = $.proxy(this._onloadendImage, this, fi);
            reader.readAsDataURL(file);
        }
    },
    _onloadendImage : function(index, progressEvent){
        var img = new PhotoEditor.Image({"key" : index,
                                         "fileSrc" : progressEvent.target.result,
                                         "callback" : $.proxy(this._callbackCreateImage, this)});
    },
    _callbackCreateImage : function(image){
        this._addImage(image);
        this._setFileToThumbnail(image);
    },
    _addImage : function(image){
        this._images.push(image);
    },
    _setFileToThumbnail: function (images) {
        for(var fi = 0; fi < this.waThumbnail.length; fi +=1){
            var thumnail = $(this.waThumbnail[fi]);
            if(thumnail.find("img").length === 0){
                thumnail.append(images);
                return true;
            }
        }
    }
};