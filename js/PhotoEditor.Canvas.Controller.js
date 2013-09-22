/**
 *
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Canvas = PhotoEditor.Canvas || {};
PhotoEditor.Canvas.Controller = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Canvas.Controller.prototype = {
    init: function () {
        this._Canvas = new PhotoEditor.Canvas();
        this._Effect = new PhotoEditor.Effect();
        this._File = new PhotoEditor.File();
        this._Thumbnail = new PhotoEditor.Thumbnail();
        this._File.setFileUploadCallback($.proxy(this._Thumbnail.createImage, this._Thumbnail));
        this._Crop = new PhotoEditor.Edit.Crop();

        this._setElement();
        this._attachEvnet();


    },
    _setElement: function () {
        this._resizeSel = $("#_resize_slt");
        this._undoneBtn = $("#_undone_btn");
        this._resotreBtn = $("#_restore_btn");
        this._rotateRightBtn = $("#_rotate_right_btn");
        this._rotateLeftBtn = $("#_rotate_left_btn");
        this._flipVtc = $("#_flip_vtc");
        this._flipHrz = $("#_flip_hrz");

        this._cropBtn = $("#_crop_btn");
        this._isDrag = false;
        this._isCrop = false;

    },
    _attachEvnet: function () {

        this._resizeSel.on("change", $.proxy(this._onChangeResizeSel, this));
        this._rotateRightBtn.on("click", $.proxy(this._onClickClockRotateBtn, this));
        this._rotateLeftBtn.on("click", $.proxy(this._onClickUnClockRotateBtn, this));
        this._flipHrz.on("click", $.proxy(this._onClickFlipHrzBtn, this));
        this._flipVtc.on("click", $.proxy(this._onClickFlipVtcBtn, this));

        this._cropBtn.on("click", $.proxy(this._onClickCropBtn, this));
        this._Canvas.getCanvasElement().on("mousedown", $.proxy(this._onMouseDownCanvas, this));
        $(window).on("mousemove", $.proxy(this._onMouseMoveCanvas, this));
        $(window).on("mouseup", $.proxy(this._onMouseUpCanvas, this));

        $("#_grayscale").on("click", $.proxy(this._onClickFilters, this, "GrayScale"));
        $("#_brightness").on("click", $.proxy(this._onClickFilters, this, "Brightness"));
        $("#_brown").on("click", $.proxy(this._onClickFilters, this, "Brown"));
        $("#_sepia").on("click", $.proxy(this._onClickFilters, this, "Sepia"));
        $("#_noise").on("click", $.proxy(this._onClickFilters, this, "Noise"));
        $("#_negative").on("click", $.proxy(this._onClickFilters, this, "Negative"));
        $("#_blur").on("click", $.proxy(this._onClickFilters, this, "Blur"));
        $("#_emboss").on("click", $.proxy(this._onClickFilters, this, "Emboss"));
        $("#_sharpen").on("click", $.proxy(this._onClickFilters, this, "Sharpen"));

        $(".btn_save").on("click", $.proxy(this._onClickSave, this));

        $(".thumb ul li").on("click", "img",$.proxy(this._onClickThumbnail, this));
    },
    _onClickCropBtn: function () {
        this._Crop.setCrop(true);
    },
    _onMouseDownCanvas: function (event) {
        var canvasBox = this._Canvas.getCanvas().getBoundingClientRect();
        this._canvasMinX = canvasBox.left;
        this._canvasMinY = canvasBox.top;
        this._canvasMaxX = this._Canvas.getCanvasWidth() + this._canvasMinX;
        this._canvasMaxY = this._Canvas.getCanvasHeight() + this._canvasMinY;

        this._Crop.startCrop(event);
    },
    _onMouseMoveCanvas: function (event) {
        if(this._Crop.isNotCrop()){
            return false;
        }
        if (this._Crop.isNotDrag()) {
            return false;
        }

        if(event.clientX >= this._canvasMaxX){
            event.clientX = this._canvasMaxX;
        }else if(event.clientX <= this._canvasMinX){
            event.clientX = this._canvasMinX;
        }

        if(event.clientY >= this._canvasMaxY){
            event.clientY = this._canvasMaxY;
        }else if(event.clientY <= this._canvasMinY){
            event.clientY = this._canvasMinY;
        }


        this._Crop.cropping(event);
    },
    _onMouseUpCanvas: function (event) {
        if(this._Crop.isNotCrop()){
            return false;
        }

        var canvasBox = this._Canvas.getCanvas().getBoundingClientRect(),
            rubberbandRect = this._Crop.getRubberbandRect(),
            canvas = this._Canvas,
            context = canvas.getContext();
//        var maxWidthPosition = canvasBox.left + this._Canvas.getCanvasWidth(),
//            maxHeightPostion = canvasBox.height + this._Canvas.getCanvasHeight();
//        var maxRectWidthPostion = rubberbandRect.left + rubberbandRect.width,
//            maxRectHeightPostion = rubberbandRect.top + rubberbandRect.height;
//        var minWidth = Math.min(maxRectWidthPostion, maxWidthPosition),
//            minHeight = Math.min(maxRectHeightPostion, maxHeightPostion);
//        var resultWidth = Math.abs(rubberbandRect.left - minWidth),
//            resultHeight = Math.abs(rubberbandRect.top - minHeight);
        var resultWidth = rubberbandRect.width,
            resultHeight = rubberbandRect.height;
        canvas.save();
        canvas.setCanvasWidth(resultWidth);
        canvas.setCanvasHeight(resultHeight);
        context.drawImage(this._CanvasImage.getImage(),
            rubberbandRect.left - canvasBox.left,
            rubberbandRect.top - canvasBox.top,
            resultWidth,
            resultHeight,
            0, 0,
            resultWidth,
            resultHeight);
        this.saveCanvasImage(resultWidth, resultHeight);
        canvas.restore();

        this._Crop.stopCrop(event);
    },
    /**
     * 썸네일 클릭시 호출되는 이벤트
     * @param event
     * @private
     */
    _onClickThumbnail : function(event){
        var thumbnail = $(event.currentTarget);
        this.createCanvasImageBy(thumbnail);
    },
    /**
     * 편집한 이미지 다운받기
     * @private
     */
    _onClickSave : function(){
        var strDownloadMime = "image/octet-stream";
        var strMime = "image/jpeg";
        var strData = this._Canvas.getCanvas().toDataURL("image/jpeg");
        document.location.href = strData.replace(strMime, strDownloadMime);
    },
    /**
     * 효과탭의 필터 미리 보기 클릭시 호출되는 이벤트
     * @param filterName
     * @private
     */
    _onClickFilters: function (filterName) {
        this._putFilterImage(filterName);
    },
    /**
     * 해당 필터를 편집하고 있는 캔버스에 적용 시킨다
     * @param filter
     * @private
     */
    _putFilterImage: function (filter) {
        var canvas = this._Canvas;
        var context = canvas.getContext();
        var imageData = context.getImageData(0, 0, canvas.getCanvasWidth(), canvas.getCanvasHeight());
        var filterName = PhotoEditor.Filters[filter];
        var filteredImageData = filterName.call(PhotoEditor.Filters, imageData);
        context.putImageData(filteredImageData, 0, 0);
        this.saveCanvasImage();
    },

    /** 가로 크기 변경 */
    _onChangeResizeSel: function () {
        var width = this._resizeSel.children(":selected").text();
        if (isNaN(width)) {
            return false;
        }
        var Canvas = this._Canvas,
            Context = Canvas.getContext(),
            CanvasImage = this._CanvasImage;
        var imgWidth = CanvasImage.getWidth(),
            imgHeight = CanvasImage.getHeight();
        var parseWidth = parseInt(width, 10),
            parseHeight = (imgHeight * parseWidth) / imgWidth;

        Canvas.setCanvasWidth(parseWidth);
        Canvas.setCanvasHeight(parseHeight);
        Context.drawImage(CanvasImage.getImage(), 0, 0, parseWidth, parseHeight);
        this.saveCanvasImage();
    },
    /**
     * 썸네일 클릭시 호출되는 이벤트
     * @param event
     * @param thumbnail
     */
    createCanvasImageBy: function (thumbnail) {
        this._CanvasImage = new PhotoEditor.Image({
            "fileSrc": thumbnail[0].src,
            "callback": $.proxy(this._loadedImage, this)
        });
    },
    _loadedImage: function () {
        this._Canvas.drawImage(this._CanvasImage);
        this.saveCanvasImage();
        this._Effect.onLoadFilter(this._CanvasImage);
    },
    /** rotate */
    _onClickClockRotateBtn: function () {
        var changeArea = PhotoEditor.Canvas.Rotate(this._Canvas, this._CanvasImage, 90);
        this.saveCanvasImage(changeArea.changeWidth, changeArea.changeHeight);
    },

    _onClickUnClockRotateBtn: function () {
        var changeArea = PhotoEditor.Canvas.Rotate(this._Canvas, this._CanvasImage, -90);
        this.saveCanvasImage(changeArea.changeWidth, changeArea.changeHeight);

    },
    /** flip */
    _onClickFlipHrzBtn: function () {
        PhotoEditor.Canvas.Flip(this._Canvas, this._CanvasImage, "Horizon");
        this.saveCanvasImage();
    },
    _onClickFlipVtcBtn: function () {
        PhotoEditor.Canvas.Flip(this._Canvas, this._CanvasImage, "Verticalty");
        this.saveCanvasImage();
    },
    /**
     * 현재 캔버스의 이미지를 저장한다
     * @param {number} changeWidth
     * @param {number} changeHeight
     */
    saveCanvasImage: function (changeWidth, changeHeight) {
        var imageData = this._Canvas.getCanvas().toDataURL();
        this._CanvasImage.setCallback(null);
        this._CanvasImage.setImageSrc(imageData);

        if (isNaN(changeWidth) === false) {
            this._CanvasImage.setWidth(changeWidth);
        }
        if (isNaN(changeHeight) === false) {
            this._CanvasImage.setHeight(changeHeight);
        }
    }
};