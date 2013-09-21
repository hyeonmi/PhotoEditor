/**
 * 설명을 작성하세요
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
        this._rubberbandRect.top = y;
        this._rubberbandRect.left = x;
    },
    _setRubberbandArea: function (x, y) {
        this._rubberbandRect.height = Math.abs(this._rubberbandRect.top - y);
        this._rubberbandRect.width = Math.abs(this._rubberbandRect.left - x);
    },
    startCrop: function (event) {
        this._setRubberbandPosition(event.clientX, event.clientY);
        this._MouseDownPosition.x = event.clientX;
        this._MouseDownPosition.y = event.clientY;

        event.preventDefault();
        this._moveRubberband();
        this._showRubberband();
        this.setDrag(true);

    },
    cropping: function (event) {
        event.preventDefault();

        this._setRubberbandArea(event.clientX, event.clientY);
        var positionX = event.clientX < this._MouseDownPosition.x ? event.clientX : this._MouseDownPosition.x,
            positionY = event.clientY < this._MouseDownPosition.y ? event.clientY : this._MouseDownPosition.y;
        this._setRubberbandPosition(positionX,positionY);

        this._rubberbandRect.width = Math.abs(event.clientX - this._MouseDownPosition.x);
        this._rubberbandRect.height = Math.abs(event.clientY - this._MouseDownPosition.y);

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
    }
};