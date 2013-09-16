/**
 *
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright Copyright (c) 2012, NHN Technology Services inc.
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Image = PhotoEditor.Image || {};
PhotoEditor.Image.Collection = function (options) {
    $.extend(this, options ||{});
    this.init();
};

PhotoEditor.Image.Collection.prototype = {
    init : function(){
        this._images = [];
        this._attachEvent();
    },
    _attachEvent : function(){
        $(document).on("file.change", $.proxy(this._createImage, this));
    },
    _createImage : function(event, files){
        var fileCount = files.length;
        for (var fi = 0; fi < fileCount; fi += 1) {
            var file = files[fi];
            var reader = new FileReader();
            reader.onloadend = $.proxy(this._onloadendImage, this, fi);
            reader.readAsDataURL(file);
        }
    },
    _onloadendImage : function(index, progressEvent){
        var img = new PhotoEditor.Image({ "key" : index, "fileSrc" : progressEvent.target.result, "callback" : $.proxy(this._completeCreateImage, this)});
    },
    _completeCreateImage : function(image){
        this._addImage(image);
        $(document).trigger("image.created", [image]);
    },
    _addImage : function(image){
        this._images.push(image);
    }
};