/**
 *
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 13
 * @copyright Copyright (c) 2012, NHN Technology Services inc.
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Image = function (options) {
    $.extend(this, options ||{});
    this.init();
};

PhotoEditor.Image.prototype = {
    init : function(){
        this._callback = this.callback;
        this._key = this.key;
        this._image = new Image();
        this._attachEvent();
        this._image.src = this.file.target.result;
    },
    _attachEvent : function(){
        $(this._image).on("load", $.proxy(this._loadedImage, this));
    },
    _loadedImage : function(){
        if(this._callback !==  null){
            this._callback(this._image);
        }
    },
    setImage: function (e) {
        this._image = e;
    },
    getImage: function () {
        return this._image;
    },
    setCallback : function(callback){
        this._callback = callback;
    }
};