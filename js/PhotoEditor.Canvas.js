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
        this._canvasEl = $("#canvas");
        this._canvas = document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
        this._photo = new Image();
        this._photoWidth = 0;
        this._photoHeight = 0;
        this._callback =  null;

    },
    setDefault: function () {
        this.setCanvasWidth(this.canvasDefaultWidth);
        this.setCanvasHeight(this.canvasDefaultHeight);
        this._clear();
        this.savingDegrees = 0;
    },
    getCanvas: function () {
        return this._canvas;
    },
    getContext: function () {
        return this._context;
    },
    setSelectedImage: function (e) {
        this._selectedImage = e;
    },
    getSelectedImage: function () {
        return this._selectedImage;
    },
    _attachEvnet : function(){
        $(this._photo).on("load", $.proxy(this._loadedImage, this, this._callback));
    },

    setImage: function () {
        var e = this.getSelectedImage();
        var imgURI = e.target.src;
        this._photo.src = imgURI;
    },
    drawImage: function (image, imageWidth, imageHeight) {
        this.setCanvasWidth(imageWidth);
        this.setCanvasHeight(imageHeight);
        //this._clear();
        this._context.drawImage(image, 0, 0,imageWidth, imageHeight, 0, 0, this.canvasWidth, this.canvasHeight);
    }, 
    _loadedImage: function (callback) {
        if(this._photoHeight === 0 && this._photoWidth === 0){
            var percent = this._getPercent();
            this._photoWidth = this._photo.width * percent;
            this._photoHeight = this._photo.height * percent;
        }


        this._clear();
        this.setCanvasWidth(this._photoWidth);
        this.setCanvasHeight(this._photoHeight);
        this.drawImage();
        if(callback !== null){
            callback();
        }

    },
    _getPercent: function () {
        var percent = 1;
        var photoWidth = this._photo.width,
            photoHeight = this._photo.height;
        if (photoWidth >= photoHeight) {
            percent = Math.min(this.canvasDefaultWidth, photoWidth) / Math.max(this.canvasDefaultWidth, photoWidth);
        } else {
            percent = Math.min(this.canvasDefaultHeight, photoHeight) / Math.max(this.canvasDefaultHeight, photoHeight);
        }
        return percent;
    },
    _clear: function () {
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
    /** size 조절 관련*/
    setResize: function (width) {
        this._canvasEl.css("width", width);
    },

    /** rotate 관련 메소드 */
    setRotateClock: function () {
        this.savingDegrees += 90;
        this._drawRotated(this.savingDegrees);
    },
    setRotatedUnClock: function () {
        this.savingDegrees -= 90;
        this._drawRotated(this.savingDegrees);
    },
    _drawRotated: function (degrees) {
        var photoWidth = this._photoWidth,
            photoHeight = this._photoHeight,
            changeWidth = photoWidth,
            changeHeight = photoHeight,
            changeX = 0,
            changeY = 0,
            loof = (degrees / 90) % 4,
            angleInRaians = degrees * Math.PI / 180;

        if (loof === 1 || loof === -3) {
            changeWidth = photoHeight;
            changeHeight = photoWidth;
            changeY = photoHeight * (-1);
        } else if (loof === 2 || loof === -2) {
            changeWidth = photoWidth;
            changeHeight = photoHeight;
            changeX = photoWidth * (-1);
            changeY = photoHeight * (-1);
        } else if (loof === 3 || loof === -1) {
            changeWidth = photoHeight;
            changeHeight = photoWidth;
            changeX = photoWidth * (-1);
        }

        this.save();
        this.setCanvasWidth(changeWidth);
        this.setCanvasHeight(changeHeight);
        this._context.rotate(angleInRaians);
        this._context.drawImage(this._photo, changeX, changeY, photoWidth, photoHeight);
        this.restore();
            },
    /** 반전 효과 */
        //TODO photo load된 후에
    setFlipVerticalty: function () {
        var canvasData = this._canvas.toDataURL();
        this._photo.src = canvasData;
        this._context.translate(this._canvas.width, 0);
        this._context.scale(-1, 1);
        this.drawImage();
    },
    setFlipHorizon: function () {
        var canvasData = this._canvas.toDataURL();
        this._photo.src = canvasData;
        this._context.translate(0, this._canvas.height);
        this._context.scale(1, -1);
        this.drawImage();
    }
};
