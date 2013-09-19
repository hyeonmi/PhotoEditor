/**
 * 설명을 작성하세요
 * @names nts.PhotoEditor
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 19.
 * @copyright Copyright (c) 2012, NHN Technology Services inc.
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Effect = function(canvas){
    this._Canvas = canvas;
    this.init();
};
PhotoEditor.Effect.prototype = {
    WIDTH : 60,
    HEIGHT : 60,
    init : function(){
        this._setElement();
        this._attachEvent();
    },
    _setElement : function(){
        this._originCanvas = document.getElementById("_origin");
        this._originContext = this._originCanvas.getContext("2d");
        this._grayCanvas = document.getElementById("_grayscale");
        this._grayContext = this._grayCanvas.getContext("2d");
        this._brightnessCanvas = document.getElementById("_brightness");
        this._brightnessContext = this._brightnessCanvas.getContext("2d");
        this._brownCanvas = document.getElementById("_brown");
        this._brownContext = this._brownCanvas.getContext("2d");
        this._sepiaCanvas = document.getElementById("_sepia");
        this._sepiaContext = this._sepiaCanvas.getContext("2d");
        this._noiseCanvas = document.getElementById("_noise");
        this._noiseContext = this._noiseCanvas.getContext("2d");
        this._negativeCanvas = document.getElementById("_negative");
        this._negativeContext = this._negativeCanvas.getContext("2d");
        this._blurCanvas = document.getElementById("_blur");
        this._blurContext = this._blurCanvas.getContext("2d");

        this._embossCanvas = document.getElementById("_emboss");
        this._embossContext = this._embossCanvas.getContext("2d");
        this._sharpenCanvas = document.getElementById("_sharpen");
        this._sharpenContext = this._sharpenCanvas.getContext("2d");
    },
    _attachEvent : function(){
        $("#_grayscale").on("click", $.proxy(this._onClickFilters, this ,"GrayScale"));
        $("#_brightness").on("click", $.proxy(this._onClickFilters, this, "Brightness"));
        $("#_brown").on("click", $.proxy(this._onClickFilters, this, "Brown"));
        $("#_sepia").on("click", $.proxy(this._onClickFilters, this, "Sepia"));
        $("#_noise").on("click", $.proxy(this._onClickFilters, this, "Noise"));
        $("#_negative").on("click", $.proxy(this._onClickFilters, this, "Negative"));
        $("#_blur").on("click", $.proxy(this._onClickFilters, this, "Blur"));
        $("#_emboss").on("click", $.proxy(this._onClickFilters, this, "Emboss"));
        $("#_sharpen").on("click", $.proxy(this._onClickFilters, this, "Sharpen"));

    },
    _onClickFilters : function(filterName){
        this._putFilterImage(filterName);
    },
    onLoadFilter: function (canvasImage) {
        this._originContext.drawImage(canvasImage.getImage(),
            0, 0, canvasImage.getWidth(), canvasImage.getHeight(),
            0, 0, this.WIDTH, this.HEIGHT);
        var originImageData = this._originContext.getImageData(0, 0, this.WIDTH, this.HEIGHT);

        var grayImageData = PhotoEditor.Filters.GrayScale(originImageData);
        this._putImageData(this._grayContext, grayImageData);

        var brightnessImageData = PhotoEditor.Filters.Brightness(originImageData);
        this._putImageData(this._brightnessContext, brightnessImageData);

        var brownImageData = PhotoEditor.Filters.Brown(originImageData);
        this._putImageData(this._brownContext, brownImageData);

        var sepiaImageData = PhotoEditor.Filters.Sepia(originImageData);
        this._putImageData(this._sepiaContext, sepiaImageData);

        var noiseImageData = PhotoEditor.Filters.Noise(originImageData);
        this._putImageData(this._noiseContext, noiseImageData);

        var negativeImageData = PhotoEditor.Filters.Negative(originImageData);
        this._putImageData(this._negativeContext, negativeImageData);

        var blurImageData = PhotoEditor.Filters.Blur(originImageData);
        this._putImageData(this._blurContext, blurImageData);

        var embossImageData = PhotoEditor.Filters.Emboss(originImageData);
        this._putImageData(this._embossContext, embossImageData);

        var sharpenImageData = PhotoEditor.Filters.Sharpen(originImageData);
        this._putImageData(this._sharpenContext, sharpenImageData);

    },
    _putImageData : function(context, imagedata){
        context.putImageData(imagedata, 0,0,0,0, this.WIDTH, this.HEIGHT);
    },
    _onClickGrayscale: function () {
        this._putFilterImage("GrayScale");
    },
    _onClickBlur : function(){
        this._putFilterImage("Blur");
    },
    _putFilterImage : function(filter){
        var canvas = this._Canvas;
        var context = canvas.getContext();
        var imageData = context.getImageData(0,0,canvas.getCanvasWidth(), canvas.getCanvasHeight());
        var filterName = PhotoEditor.Filters[filter];
        var filteredImageData = filterName.call(PhotoEditor.Filters,imageData);
        context.putImageData(filteredImageData, 0,0);
    }

};