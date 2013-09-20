/**
 * 캔버스
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Canvas = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Canvas.prototype = {
    canvasDefaultWidth: 680,
    canvasDefaultHeight: 510,
    init: function () {
        this._setElement();
    },
    _setElement: function () {
        this._canvasElement = $("#canvas");
        this._canvas = document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
    },
    getCanvasElement : function(){
        return this._canvasElement;
    },
    getCanvas: function () {
        return this._canvas;
    },
    getContext: function () {
        return this._context;
    },
    drawImage: function (Image) {
        var photo = Image.getImage();
        var photoWidth = Image.getWidth(),
            photoHeight = Image.getHeight();
        var percent = this._getPercent(photoWidth, photoHeight),
            scaledPhotoWidth = photoWidth * percent,
            scaledPhotoHeight = photoHeight * percent;

        this.setCanvasWidth(scaledPhotoWidth);
        this.setCanvasHeight(scaledPhotoHeight);
        Image.setWidth(scaledPhotoWidth);
        Image.setHeight(scaledPhotoHeight);
        this._context.drawImage(photo, 0, 0, photoWidth, photoHeight, 0,0, scaledPhotoWidth, scaledPhotoHeight);
    },
    _getPercent: function (photoWidth, photoHeight) {
        var percent = 1;
        //canvas보다 이미지 사이즈가 작을 경우 100%
        if(this.canvasDefaultWidth >= photoWidth && this.canvasDefaultHeight >= photoHeight){
            return percent;
        }
        if (photoWidth >= photoHeight) {
            percent = Math.min(this.canvasDefaultWidth, photoWidth) / Math.max(this.canvasDefaultWidth, photoWidth);
        } else {
            percent = Math.min(this.canvasDefaultHeight, photoHeight) / Math.max(this.canvasDefaultHeight, photoHeight);
        }
        return percent;
    },
    clear: function () {
        this._context.fillStyle = "#ffffff";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    },
    save: function () {
        this._context.save();
    },
    restore: function () {
        return this._context.restore();
    },
    setCanvasWidth: function (width) {
        this._canvas.width = width;
    },
    setCanvasHeight: function (height) {
        this._canvas.height = height;
    },
    getCanvasWidth : function(){
        return this._canvas.width;
    },
    getCanvasHeight : function(){
        return this._canvas.height;
    }
};
