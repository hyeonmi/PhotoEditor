/**
 * 이미지 객체
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 13
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Image = function (options) {
    $.extend(this, options ||{});
    this.init();
};

PhotoEditor.Image.prototype = {
    init : function(){
        this._callback = this.callback;
        this._image = new Image();
        this._attachEvent();
        this._image.src = this.fileSrc;
    },
    _attachEvent : function(){
        $(this._image).on("load", $.proxy(this._loadImage, this));
    },
    _loadImage : function(){
        if(this._callback instanceof Function){
            this._callback(this._image);
        }
        return this;
    },
    setImageSrc: function (src) {
        this._image.src = src;
    },
    getImage: function () {
        return this._image;
    },
    setCallback : function(callback){
        this._callback = callback;
    },
    getWidth : function(){
        return this._image.width;
    },
    getHeight : function(){
        return this._image.height;
    },
    setWidth : function(width){
        this._image.width = width;
    },
    setHeight : function(height){
        this._image.height = height;
    }
};