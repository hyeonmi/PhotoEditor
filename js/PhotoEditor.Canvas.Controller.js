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

        this._setElement();
        this._attachEvnet();
        this._initRubberband();

    },
    _setElement: function () {
        this._resizeSel = $("#_resize_slt");
        this._undoneBtn = $("#_undone_btn");
        this._resotreBtn = $("#_restore_btn");
        this._rotateRightBtn = $("#_rotate_right_btn");
        this._rotateLeftBtn = $("#_rotate_left_btn");
        this._cropBtn = $("#_crop_btn");
        this._flipVtc = $("#_flip_vtc");
        this._flipHrz = $("#_flip_hrz");
        this._rubberband = $("#rubberband");
        this._isDrag = false;
        this._isCrop = false;

    },
    _attachEvnet: function () {
        $(document).on("canvas.drawthumbnail", $.proxy(this.setThumbnail, this));
        this._resizeSel.on("change", $.proxy(this._onChangeResizeSel, this));
        this._rotateRightBtn.on("click", $.proxy(this._onClickClockRotateBtn, this));
        this._rotateLeftBtn.on("click", $.proxy(this._onClickUnClockRotateBtn, this));
        this._flipHrz.on("click", $.proxy(this._onClickFlipHrzBtn, this));
        this._flipVtc.on("click", $.proxy(this._onClickFlipVtcBtn, this));
        this._Canvas.getCanvasElement().on("mousedown", $.proxy(this._onMouseDownCanvas, this));
        this._Canvas.getCanvasElement().on("mousemove", $.proxy(this._onMouseMoveCanvas, this));
        $(window).on("mouseup", $.proxy(this._onMouseUpCanvas, this));
        this._cropBtn.on("click", $.proxy(this._onClickCropBtn, this));

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
    },
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
    /** crop */
    _onClickCropBtn: function () {
        this._isCrop = true;
    },
    _initRubberband: function () {
        this._rubberbandRect = { top: 0, left: 0, width: 0, height: 0};
    },
    _setRubberbandPosition: function (x, y) {
        this._rubberbandRect.top = y;
        this._rubberbandRect.left = x;
    },
    _setRubberbandArea: function (x, y) {
        this._rubberbandRect.height = Math.abs(this._rubberbandRect.top - y);
        this._rubberbandRect.width = Math.abs(this._rubberbandRect.left - x);
    },
    _onMouseDownCanvas: function (event) {
        if (this._isCrop === false) {
            return false;
        }
        this._setRubberbandPosition(event.clientX, event.clientY);
        event.preventDefault();
        this._moveRubberband();
        this._showRubberband();
        this._isDrag = true;
    },
    _onMouseMoveCanvas: function (event) {
        event.preventDefault();
        if (this._isDrag === false || this._isCrop === false) {
            return false;
        }
        this._setRubberbandArea(event.clientX, event.clientY);
        this._resizeRubberband();
    },
    _onMouseUpCanvas: function (event) {
        if (this._isCrop === false) {
            return false;
        }
        var canvasBox = this._Canvas.getCanvas().getBoundingClientRect(),
            rubberbandRect = this._rubberbandRect,
            canvas = this._Canvas,
            context = canvas.getContext();
        var resultWidth = rubberbandRect.width;
        var resultHeight = rubberbandRect.height;

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

        event.preventDefault();

        this._hideRubberband();
        this._initRubberband();
        this._resizeRubberband();
        this._isDrag = false;
        this._isCrop = false;

    },
    _moveRubberband: function () {
        this._rubberband.css({
            top: this._rubberbandRect.top,
            left: this._rubberbandRect.left
        });
    },
    _resizeRubberband: function () {
        this._rubberband.css({
            width: this._rubberbandRect.width,
            height: this._rubberbandRect.height
        });
    },
    _showRubberband: function () {
        this._rubberband.show();
    },
    _hideRubberband: function () {
        this._rubberband.hide();
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
    setThumbnail: function (event, thumbnail) {
        this._CanvasImage = new PhotoEditor.Image({ "fileSrc": thumbnail[0].src, "callback": $.proxy(this._loadedImage, this)});
    },
    _loadedImage: function () {
        this._Canvas.drawImage(this._CanvasImage);
        this.saveCanvasImage();
        this._Effect.onLoadFilter(this._CanvasImage);
    },
    /** size 조절 관련*/
    setResize: function (width) {
        this._Canvas.getCanvasElement().css("width", width);
    },
    _onClickClockRotateBtn: function () {
        this.setRotateClock();
    },

    _onClickUnClockRotateBtn: function () {
        this.setRotatedUnClock();
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
    /** rotate 관련 메소드 */
    setRotateClock: function () {
        var changeArea = PhotoEditor.Canvas.Rotate(this._Canvas, this._CanvasImage, 90);
        this.saveCanvasImage(changeArea.changeWidth, changeArea.changeHeight);
    },
    setRotatedUnClock: function () {
        var changeArea = PhotoEditor.Canvas.Rotate(this._Canvas, this._CanvasImage, -90);
        this.saveCanvasImage(changeArea.changeWidth, changeArea.changeHeight);
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