/**
 *
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright Copyright (c) 2012, NHN Technology Services inc.
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Canvas = PhotoEditor.Canvas || {};
PhotoEditor.Canvas.Controller = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Canvas.Controller.prototype = {
    init : function(){
        this._Canvas = new PhotoEditor.Canvas();

        this._setElement();
        this._attachEvnet();
    },
    _setElement : function(){
        this._resizeSel = $("#_resize_slt");
        this._resizeAllBtn = $("#_resize_all_btn");
        this._refreshBtn = $("#_refresh_btn");
        this._undoneBtn = $("#_undone_btn");
        this._resotreBtn = $("#_restore_btn");
        this._rotateRightBtn = $("#_rotate_right_btn");
        this._rotateLeftBtn = $("#_rotate_left_btn");
        this._cropBtn = $("#_crop_btn");
        this._flipVtc = $("#_flip_vtc");
        this._flipHrz = $("#_flip_hrz");
        this._dragging = false;
    },
    _attachEvnet : function(){
        $(document).on("canvas.drawthumbnail", $.proxy(this.setThumnail, this));
        this._resizeSel.on("change", $.proxy(this._onChangeResizeSel, this));
        this._rotateRightBtn.on("click", $.proxy(this._onClickClockRotateBtn, this));
        this._rotateLeftBtn.on("click", $.proxy(this._onClickUnClockRotateBtn, this));
        this._flipHrz.on("click", $.proxy(this._onClickFlipHrzBtn, this));
        this._flipVtc.on("click", $.proxy(this._onClickFlipVtcBtn, this));
        this._Canvas.getCanvasElement().on("mousedown", $.proxy(this._onMouseDownCanvas, this));
        this._Canvas.getCanvasElement().on("mousemove", $.proxy(this._onDrag, this));
        this._Canvas.getCanvasElement().on("mouseup", $.proxy(this._onMouseUpCanvas, this));
    },
    _onMouseDownCanvas : function(event){
        var location = this._windowToCanvas(this._Canvas.getCanvas(), event.clientX, event.clientY);
        event.preventDefault();
        this._rubberbandStart(location.x, location.y);
        this._dragging = true;
    },
    _rubberbandStart : function(x,y){
        console.log(x, y);
    },
    _onMouseUpCanvas : function(){

    },
    _onDrag : function(){

    },
    _windowToCanvas : function(canvas, x, y){
        var canvasRectangle = canvas.getBoundingClientRect();
        return { x : x - canvasRectangle.left , y : y - canvasRectangle.top}
    },
    _onChangeResizeSel : function(){
        var width = this._resizeSel.children(":selected").text();
        if(isNaN(width)===false){
            this.setResize(width);
        }
    },
    _onClickClockRotateBtn : function(){
        this.setRotateClock();
    },
    _onClickUnClockRotateBtn : function(){
        this.setRotatedUnClock();
    },
    _onClickFlipHrzBtn : function(){
        this.setFlipHorizon();
    },
    _onClickFlipVtcBtn : function(){
        this.setFlipVerticalty();
    },
    /**
     * 썸네일 클릭시 호출되는 이벤트
     * @param event
     * @param thumbnail
     */
    setThumnail : function(event, thumbnail){
        this._canvasImage = new PhotoEditor.Image({ "fileSrc" : thumbnail[0].src, "callback" : $.proxy(this._loadedImage, this)});
    },
    _loadedImage: function () {
        this._Canvas.drawImage(this._canvasImage);
    },
    /** size 조절 관련*/
    setResize: function (width) {
        this._Canvas.getCanvasElement().css("width", width);
    },

    /** rotate 관련 메소드 */
    setRotateClock: function () {
        this._drawRotated(90);
    },
    setRotatedUnClock: function () {
        this._drawRotated(-90);
    },
    saveCanvasImage : function(changeWidth, changeHeight){
        var imageData = this._Canvas.getCanvas().toDataURL();
        this._canvasImage.setCallback(null);
        this._canvasImage.setImageSrc(imageData);

        if(isNaN(changeWidth) === false){
            this._canvasImage.setWidth(changeWidth);
        }
        if(isNaN(changeHeight) === false){
            this._canvasImage.setHeight(changeHeight);
        }
    },
    _drawRotated: function (degrees) {
        var canvas = this._Canvas,
            context = canvas.getContext();
        var photoWidth = this._canvasImage.getWidth(),
            photoHeight = this._canvasImage.getHeight(),
            changeWidth = photoHeight,
            changeHeight = photoWidth,
            changeX = 0,
            changeY = 0,
            angleInRaians = degrees * Math.PI / 180;

        if (degrees === 90) {
            changeY = photoHeight * (-1);
        } else if (degrees === -90) {
            changeX = photoWidth * (-1);
        }
        //canvas width, height을 변경했을 경우 상태값은 저장되지 않아야함
        canvas.setCanvasWidth(changeWidth);
        canvas.setCanvasHeight(changeHeight);
        canvas.save();
        context.rotate(angleInRaians);
        context.drawImage(this._canvasImage.getImage(), changeX, changeY, photoWidth, photoHeight);
        //마지막 상태를 저장
        this.saveCanvasImage(changeWidth, changeHeight);
        canvas.restore();
    },
    /** 반전 효과 */
    setFlipVerticalty: function () {
        var canvas = this._Canvas;
        var context = canvas.getContext();
        var photoWidth = this._canvasImage.getWidth(),
            photoHeight = this._canvasImage.getHeight();
        canvas.save();
        context.translate(photoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(this._canvasImage.getImage(), 0,0, photoWidth, photoHeight,0,0, photoWidth, photoHeight);
        this.saveCanvasImage();
        canvas.restore();
    },
    setFlipHorizon: function () {
        var canvas = this._Canvas;
        var context = canvas.getContext();
        var photoWidth = this._canvasImage.getWidth(),
            photoHeight = this._canvasImage.getHeight();
        canvas.save();
        context.translate(0, photoHeight);
        context.scale(1, -1);
        context.drawImage(this._canvasImage.getImage(), 0,0, photoWidth, photoHeight);
        this.saveCanvasImage();
        canvas.restore();
    }
};