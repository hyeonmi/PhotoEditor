var PhotoEditor = PhotoEditor || {};
PhotoEditor.Canvas = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Canvas.prototype = {
    init: function () {
        this._setElement();
    },
    _setElement: function () {
        this._canvas = document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
        this._photo = new Image();
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
        var percent = this._getPercent(),
            photoWidth = this._photo.width * percent,
            photoHeight = this._photo.height * percent;
        this._clear();
        this.setCanvasWidth(photoWidth);
        this.setCanvasHeight(photoHeight);

        this._context.drawImage(this._photo, 0, 0, photoWidth, photoHeight);

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
        //this._canvas.setAttribute("style", "width:" + width +"px");
        this._canvas.width = width;
    },
    setCanvasHeight : function(height){
        //this._canvas.setAttribute("style", "height:" + height +"px");
        this._canvas.height = height
    },
    setRotate : function(){
        this._repeat = this._repeat || 1;

        var angle = (this._repeat * 90) * Math.PI / 180,
            canvasWidth = this._canvas.width,
            canvasHeight = this._canvas.height;
        this.save();
        this.setCanvasWidth(canvasHeight);
        this.setCanvasHeight(canvasWidth);
        if(this._repeat === 1){
            this._context.translate(canvasHeight, 0);
            this._context.rotate(angle);
            this._context.drawImage(this._photo, 0, 0, canvasWidth, canvasHeight);

        }else if(this._repeat === 2){
            this._context.translate(canvasHeight, canvasWidth);
            this._context.rotate(angle);
            this._context.drawImage(this._photo, 0, 0, canvasHeight, canvasWidth);
        }


        this._repeat += 1;

        this.restore();

    }
};
