/**
 * 효과 탭의 필터 적용 화면 미리보기
 * @names nts.PhotoEditor
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 19.
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Effect = function(){
    this.init();
};
PhotoEditor.Effect.prototype = {
    WIDTH : 60,
    HEIGHT : 60,
    init : function(){
        this._setElement();
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
        this._dawnCanvas = document.getElementById("_dawn");
        this._dawnContext = this._dawnCanvas.getContext("2d");
        this._negativeCanvas = document.getElementById("_negative");
        this._negativeContext = this._negativeCanvas.getContext("2d");
        this._blurCanvas = document.getElementById("_blur");
        this._blurContext = this._blurCanvas.getContext("2d");
        this._embossCanvas = document.getElementById("_emboss");
        this._embossContext = this._embossCanvas.getContext("2d");
        this._sharpenCanvas = document.getElementById("_sharpen");
        this._sharpenContext = this._sharpenCanvas.getContext("2d");
        this._laplacianCanvas = document.getElementById("_laplacian");
        this._laplacianContext= this._laplacianCanvas.getContext("2d");
        this.pinkCanvas = document.getElementById("_pink");
        this.pinkContext = this.pinkCanvas.getContext("2d");

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

        var negativeImageData = PhotoEditor.Filters.Negative(originImageData);
        this._putImageData(this._negativeContext, negativeImageData);

        var blurImageData = PhotoEditor.Filters.Blur(originImageData);
        this._putImageData(this._blurContext, blurImageData);

        var embossImageData = PhotoEditor.Filters.Emboss(originImageData);
        this._putImageData(this._embossContext, embossImageData);

        var sharpenImageData = PhotoEditor.Filters.Sharpen(originImageData);
        this._putImageData(this._sharpenContext, sharpenImageData);

        var labplacianImageData = PhotoEditor.Filters.Laplacian(originImageData);
        this._putImageData(this._laplacianContext, labplacianImageData);

        var dawnImageData = PhotoEditor.Filters.Dawn(originImageData);
        this._putImageData(this._dawnContext, dawnImageData);

        var unShartpImageData = PhotoEditor.Filters.Pink(originImageData);
        this._putImageData(this.pinkContext, unShartpImageData);

    },
    _putImageData : function(contextTarget, drawImagedata){
        contextTarget.putImageData(drawImagedata, 0,0,0,0, this.WIDTH, this.HEIGHT);
    }
};