var PhotoEditor = PhotoEditor || {};
PhotoEditor.Canvas = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Canvas.prototype = {
    canvasDefaultWidth : 680,
    canvasDefaultHeight : 510,
    init: function () {
        this._setElement();
    },
    _setElement: function () {
        this._canvasEl = $("#canvas");
        this._canvas = document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
        this._photo = new Image();
    },
    setDefault : function(){
        this.setCanvasWidth(this.canvasDefaultWidth);
        this.setCanvasHeight(this.canvasDefaultHeight);
        this._clear();
        this.savingDegrees = 0;
    },
    getCanvas : function(){
        return this._canvas;
    },
    getContext : function(){
        return this._context;
    },
    setSelectedImage : function(e){
        this._selectedImage = e;
    },
    getSelectedImage : function(){
        return this._selectedImage;
    },

    setImage: function () {
        var e = this.getSelectedImage();
        var imgURI = e.target.src;
        $(this._photo).on("load", $.proxy(this._loadedImage, this));
        this._photo.src = imgURI;
    },
    _loadedImage: function () {
        var percent = this._getPercent();

        this._photoWidth = this._photo.width * percent;
        this._photoHeight = this._photo.height * percent;

        this._clear();
        this.setCanvasWidth(this._photoWidth);
        this.setCanvasHeight(this._photoHeight);
        this._context.drawImage(this._photo, 0, 0, this._photoWidth, this._photoHeight);

    },
    _getPercent: function () {
        var percent = 1;
        var canvasWidth = 680,
            canvasHeight = 510,
            photoWidth = this._photo.width,
            photoHeight = this._photo.height;
        if (photoWidth >= photoHeight) {
            percent = Math.min(canvasWidth, photoWidth) / Math.max(canvasWidth, photoWidth);
        }else{
            percent = Math.min(canvasHeight, photoHeight) / Math.max(canvasHeight, photoHeight);
        }
        return percent;
    },
    _clear: function () {
        this._context.fillStyle= "#ffffff";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    },
    save : function(){
        this._context.save();
    },
    restore : function(){
        return this._context.restore();
    },
    setCanvasWidth : function(width){
        this._canvas.width = width;
    },
    setCanvasHeight : function(height){
        this._canvas.height = height;
    },
    /** size 조절 관련*/
    setResize : function(width){
        this._canvasEl.css("width", width);
    },

    /** rotate 관련 메소드 */
    setRotateClock : function(){
        this.savingDegrees += 90;
        this._drawRotated(this.savingDegrees);
    },
    setRotatedUnClock : function(){
        this.savingDegrees -= 90;
        this._drawRotated(this.savingDegrees);
    },
    _drawRotated :function(degrees){
        var photoWidth = this._photoWidth,
            photoHeight = this._photoHeight,
            changeWidth = photoWidth,
            changeHeight = photoHeight,
            changeX = 0,
            changeY = 0,
            loof = (degrees/90)%4;

        if(loof === 1 || loof === -3){
            changeWidth = photoHeight;
            changeHeight = photoWidth;
            changeY = photoHeight * (-1);
        }else if(loof === 2 || loof === -2){
            changeWidth = photoWidth;
            changeHeight = photoHeight;
            changeX = photoWidth * (-1);
            changeY = photoHeight * (-1);
        }else if(loof === 3 || loof === -1){
            changeWidth = photoHeight;
            changeHeight = photoWidth;
            changeX = photoWidth * (-1);
        }

        this._context.save();
        this.setCanvasWidth(changeWidth);
        this.setCanvasHeight(changeHeight);
        this._context.rotate(degrees * Math.PI /180);
        this._context.drawImage(this._photo, changeX, changeY, photoWidth, photoHeight);
        this._context.restore();
    },
    /** */
    setFlipVerticalty : function(){
        this._context.translate(this._photoWidth, 0);
        this._context.scale(-1, 1);
        this._context.drawImage(this._photo, 0, 0, this._photoWidth, this._photoHeight);
    },
    setFlipHorizon : function(){
        this._context.translate(0, this._photoHeight);
        this._context.scale(1, -1);
        this._context.drawImage(this._photo, 0, 0, this._photoWidth, this._photoHeight);
    }
};
