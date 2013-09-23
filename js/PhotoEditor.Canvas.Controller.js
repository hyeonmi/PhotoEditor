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
        this._createInstance();
        this._setElement();
        this._attachEvnet();
    },
    _createInstance: function () {
        this._Canvas = new PhotoEditor.Canvas();
        this._Effect = new PhotoEditor.Effect();
        this._File = new PhotoEditor.File();
        this._Thumbnail = new PhotoEditor.Thumbnail();
        this._Crop = new PhotoEditor.Edit.Crop();
    },
    _setElement: function () {
        this._welAddFileBtn = $("#add_photo");
        this._welFileUpload = $("#file_upload");

        this._allDelete = $(".btn_delete");
        this._resizeSel = $("#_resize_slt");
        this._undoneBtn = $("#_undone_btn");
        this._resotreBtn = $("#_restore_btn");
        this._rotateRightBtn = $("#_rotate_right_btn");
        this._rotateLeftBtn = $("#_rotate_left_btn");
        this._flipVtc = $("#_flip_vtc");
        this._flipHrz = $("#_flip_hrz");
        this._cropBtn = $("#_crop_btn");
        this._imageWidth = $("#_photo_width");
        this._imageHeight = $("#_photo_height");
        this._isDrag = false;
        this._isCrop = false;
        this._CanvasImage = null;
    },
    _attachEvnet: function () {
        this._welAddFileBtn.on("click", $.proxy(this._onClickAddFileBtn, this));
        this._welFileUpload.on("change", $.proxy(this._onChangeFileUpload, this));

        /** Thumbnail */
        $(".thumb ul li").on("click", "img",$.proxy(this._onClickThumbnail, this));
        /** Edit Button */
        this._resizeSel.on("change", $.proxy(this._onChangeResizeSel, this));
        this._rotateRightBtn.on("click", $.proxy(this._onClickClockRotateBtn, this));
        this._rotateLeftBtn.on("click", $.proxy(this._onClickUnClockRotateBtn, this));
        this._flipHrz.on("click", $.proxy(this._onClickFlipHrzBtn, this));
        this._flipVtc.on("click", $.proxy(this._onClickFlipVtcBtn, this));
        this._cropBtn.on("click", $.proxy(this._onClickCropBtn, this));
        /** Crop event */
        this._Canvas.getCanvasElement().on("mousedown", $.proxy(this._onMouseDownCanvas, this));
        $(window).on("mousemove", $.proxy(this._onMouseMoveCanvas, this));
        $(document).on("mouseup", $.proxy(this._onMouseUpCanvas, this));
        /** Filter Canvas */
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
        this._allDelete.on("click", $.proxy(this._onClickAllDelete, this));
    },
    /** Crop */
    _onClickCropBtn: function () {
        if(this._Crop.isNotCrop()){
            this._Crop.setCrop(true);
        }else{
            this._Crop.setCrop(false);
        }
    },
    _onMouseDownCanvas: function (event) {
        if(this._Crop.isNotCrop()){
            return false;
        }
        this._setCanvasMinMax();
        this._Crop.startCrop(event);
    },
    _setCanvasMinMax: function () {
        var canvasBox = this._Canvas.getCanvas().getBoundingClientRect();
        this._canvasMinX = canvasBox.left;
        this._canvasMinY = canvasBox.top;
        this._canvasMaxX = this._Canvas.getCanvasWidth() + this._canvasMinX;
        this._canvasMaxY = this._Canvas.getCanvasHeight() + this._canvasMinY;
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
        var sourceWidth = rubberbandRect.width,
            sourceHeight = rubberbandRect.height,
            sourceX = rubberbandRect.left - canvasBox.left,
            sourceY = rubberbandRect.top - canvasBox.top;

        if(sourceWidth < 10 || sourceHeight < 10){
            return false;
        }

        canvas.save();
        canvas.setCanvasWidth(sourceWidth);
        canvas.setCanvasHeight(sourceHeight);
        context.drawImage(this._CanvasImage.getImage(),
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, sourceWidth, sourceHeight);
        this._saveCanvasImage();
        this._setChangeCanvasImageSize(sourceWidth, sourceHeight);
        canvas.restore();

        this._Crop.stopCrop(event);
        this._Crop.setCrop(false);
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
        this._saveCanvasImage();
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
            parseHeight = Math.floor((imgHeight * parseWidth) / imgWidth);

        Canvas.setCanvasWidth(parseWidth);
        Canvas.setCanvasHeight(parseHeight);
        Context.drawImage(CanvasImage.getImage(), 0, 0, parseWidth, parseHeight);
        this._saveCanvasImage();
        this._setChangeCanvasImageSize(parseWidth, parseHeight);
    },

    /**
     * image download
     * @private
     */
    _onClickSave : function(){
        if(this._CanvasImage === null){
            alert("사진을 선택해주세요.");
            return false;
        }

        var strDownloadMime = "image/octet-stream";
        var strMime = "image/jpeg";
        var strData = this._Canvas.getCanvas().toDataURL("image/jpeg",1.0);
        document.location.href = strData.replace(strMime, strDownloadMime);
    },
    /**
     * thumbnail all delete
     * @private
     */
    _onClickAllDelete : function(){
        if(this._Thumbnail.isEmptyThumbnail()){
            alert("삭제할 사진이 없습니다.");
            return false;
        }
        this._Thumbnail.deleteImages();
        this._Canvas.clear();
        this._CanvasImage = null;
    },
    /** file upload*/
    _onClickAddFileBtn : function(){
        if(this._Thumbnail.isNotAddThumbnail()){
            alert("더 이상 사진을 추가할 수 없습니다.");
            return false;
        }
        this._welFileUpload.trigger("click");
    },
    _onChangeFileUpload : function(event){
        var files = event.target.files;
        if(this._File.validFiles(files)){
            this._Thumbnail.createImage(files);
        }
    },
    /**
     * 썸네일 클릭시 캔버스 이미지 객체를 만든다
     * @param thumbnail
     */
    createCanvasImageBy: function (thumbnail) {
        this._CanvasImage = new PhotoEditor.Image({
            "fileSrc": thumbnail[0].src,
            "callback": $.proxy(this._loadImage, this)
        });
        this._setChangeCanvasImageSize(this._CanvasImage.getWidth(), this._CanvasImage.getHeight());
    },
    /**
     * 캔버스의 이미지가 로드됐을때 호출된다
     * @private
     */
    _loadImage: function () {
        this._Canvas.drawImage(this._CanvasImage);
        this._saveCanvasImage();
        this._Effect.onLoadFilter(this._CanvasImage);
    },
    /** rotate */
    _onClickClockRotateBtn: function () {
        var changeArea = PhotoEditor.Edit.Rotate(this._Canvas, this._CanvasImage, 90);
        this._saveCanvasImage();
        this._setChangeCanvasImageSize(changeArea.changeWidth, changeArea.changeHeight);
    },

    _onClickUnClockRotateBtn: function () {
        var changeArea = PhotoEditor.Edit.Rotate(this._Canvas, this._CanvasImage, -90);
        this._saveCanvasImage();
        this._setChangeCanvasImageSize(changeArea.changeWidth, changeArea.changeHeight);
    },
    /** flip */
    _onClickFlipHrzBtn: function () {
        PhotoEditor.Edit.Flip(this._Canvas, this._CanvasImage, "Horizon");
        this._saveCanvasImage();
    },
    _onClickFlipVtcBtn: function () {
        PhotoEditor.Edit.Flip(this._Canvas, this._CanvasImage, "Verticalty");
        this._saveCanvasImage();
    },
    /**
     * 현재 캔버스의 이미지를 저장한다
     * @param {number} changeWidth
     * @param {number} changeHeight
     */
    _saveCanvasImage: function () {
        var imageData = this._Canvas.getCanvas().toDataURL();
        this._CanvasImage.setCallback(null);
        this._CanvasImage.setImageSrc(imageData);
    },
    /**
     * 현재 캔버스에 넓이와 높이를 적용시킨다
     * @param {number} changeWidth
     * @param {number} changeHeight
     * @private
     */
    _setChangeCanvasImageSize : function(changeWidth, changeHeight){
        if (isNaN(changeWidth) === false) {
            this._CanvasImage.setWidth(changeWidth);
        }
        if (isNaN(changeHeight) === false) {
            this._CanvasImage.setHeight(changeHeight);
        }
        this._imageWidth.text(changeWidth);
        this._imageHeight.text(changeHeight);
    }
};