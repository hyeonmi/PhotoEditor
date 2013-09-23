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
        this.index = 0;
        this._images = [];
    },
    _setElement: function () {
        this.waThumbnail = $(".thumb ul li");
        this._progress = document.getElementById("progress");
        this._progressArea = $(".progress_area");
    },
    createImage : function(files){
        var fileCount = files.length;
        for (var fi = 0; fi < fileCount; fi += 1) {
            var file = files[fi];
            var reader = new FileReader();
            reader.onloadstart = $.proxy(this._onloadstartImage, this);
            reader.onload = $.proxy(this._onloadImage, this, fi);
            reader.onerror = $.proxy(this._onerrorImage, this);
            if(fi === fileCount - 1){
                reader.onloadend = $.proxy(this._onloadendLastImage, this);
            }else{
                reader.onloadend = $.proxy(this._onloadendImage, this);
            }
            reader.readAsDataURL(file);


        }
    },
    _callbackCreateImage : function(image){
        this._addImage(image);
        this._setFileToThumbnail(image);
    },
    _onloadstartImage : function(progressEvent){
        this._showProgress();
        if(progressEvent.lengthComputable){
            this._progress.max += progressEvent.total;
        }
    },
    _onloadImage : function(index, progressEvent){
        var img = new PhotoEditor.Image({"key" : index,
                                         "fileSrc" : progressEvent.target.result,
                                         "callback" : $.proxy(this._callbackCreateImage, this)});

    },
    _onerrorImage : function(event){
        console.log(event.target.error);
    },
    _onloadendImage:function(progressEvent){
        console.log(progressEvent.target.readyState);
        if(progressEvent.target.readyState === FileReader.DONE){
            this._progress.value += progressEvent.loaded;
        }
    },
    _onloadendLastImage : function(progressEvent){
        if(progressEvent.lengthComputable){
            this._progress.value += progressEvent.loaded;
        }

        setTimeout($.proxy(this._hideProgress, this), 2000);
    },
    deleteImages : function(){
        this.waThumbnail.find("img").remove();
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
    },
    _showProgress : function(){
        this._progressArea.show();
    },
    _hideProgress : function(){
        this._progressArea.hide();
    }
};