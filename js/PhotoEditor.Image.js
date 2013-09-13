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
PhotoEditor.Image = function (e, callback) {
    this.init(e, callback);
};

PhotoEditor.Image.prototype = {
    init : function(e, callback){
        this._callback = callback;
        this._image = new Image();
        this._attachEvent();
        this._image.src = e.target.src;
    },
    _attachEvent : function(){
        $(this._image).on("load", $.proxy(this._loadedImage, this));
    },
    _loadedImage : function(){
        if(this._callback !==  null){
            this._callback();
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