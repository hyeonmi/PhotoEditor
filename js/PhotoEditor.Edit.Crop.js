/**
 * 크롭 이벤트
 * @names nts.PhotoEditor
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 21.
 * @copyright Copyright (c) 2012, NHN Technology Services inc.
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Edit = PhotoEditor.Edit || {};
PhotoEditor.Edit.Crop = function(){
    this.init();
};
PhotoEditor.Edit.Crop.prototype = {
    init : function(){
        this._setElement();
        this._initRubberband();
    },
    _setElement : function(){
        this._isDrag = false;
        this._isCrop = false;
        this._rubberband = $("#rubberband");
        this._wrapper = $(".wrap");
        this._MouseDownPosition = { x : 0, y : 0};
    },
    setCrop : function(flag){
        this._isCrop = flag;
    },
    _getCrop : function(){
        return this._isCrop;
    },
    setDrag : function(flag){
        this._isDrag = flag;
    },
    _getDrag : function(){
        return this._isDrag;
    },
    isNotCrop : function(){
        return !this._getCrop();
    },
    isNotDrag : function(){
        return !this._getDrag();
    },
    _initRubberband: function () {
        this._rubberbandRect = { top: 0, left: 0, width: 0, height: 0};
    },
    getRubberbandRect : function(){
        return this._rubberbandRect;
    },
    _setRubberbandPosition: function (x, y) {
            this._rubberbandRect.left = x;
            this._rubberbandRect.top = y;

    },
    _setRubberbandSize: function (x, y) {
            this._rubberbandRect.width = Math.abs(x - this._MouseDownPosition.x);
            this._rubberbandRect.height = Math.abs(y - this._MouseDownPosition.y);
    },
    _setMouseDownPosition: function (x, y) {
        this._MouseDownPosition.x = x;
        this._MouseDownPosition.y = y;
    },
    startCrop: function (event) {
        this._setRubberbandPosition(event.clientX, event.clientY);
        this._setMouseDownPosition(event.clientX, event.clientY);
        event.preventDefault();
        this._moveRubberband();
        this._showRubberband();
        this.setDrag(true);
        this._wrapper.css("cursor", "crosshair");
    },
    considerPosition: function (event) {
        var positionX = event.clientX < this._MouseDownPosition.x ? event.clientX : this._MouseDownPosition.x,
            positionY = event.clientY < this._MouseDownPosition.y ? event.clientY : this._MouseDownPosition.y;
        return {positionX: positionX, positionY: positionY};
    },
    cropping: function (event) {
        event.preventDefault();

        var startPostion = this.considerPosition(event);
        this._setRubberbandPosition(startPostion.positionX, startPostion.positionY);
        this._setRubberbandSize(event.clientX, event.clientY);
        this._moveRubberband();
        this._resizeRubberband();
    },
    stopCrop: function (event) {
        event.preventDefault();

        this._hideRubberband();
        this._initRubberband();
        this._resizeRubberband();
        this.setDrag(false);
        this.setCrop(false);
        this._wrapper.css("cursor", "auto");

    },
    _moveRubberband: function () {
        var scrollTop = $(document).scrollTop();
        this._rubberband.css({
            top: this._rubberbandRect.top + scrollTop,
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
    }
};