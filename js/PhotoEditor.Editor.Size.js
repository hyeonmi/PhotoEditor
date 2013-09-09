var PhotoEditor = PhotoEditor || {};
PhotoEditor.Size = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Size.prototype = {
    init : function(){
    console.log("size object init");
        this._setElement();
        this._attachEvent();
    },
    _setElement: function () {
        this._Canvas = this.Canvas;
        this._resizeSel = $("#_resize_slt");
        this._resizeAllBtn = $("#_resize_all_btn");
        this._refreshBtn = $("#_refresh_btn");
        this._undoneBtn = $("#_undone_btn");
        this._resotreBtn = $("#_restore_btn");
        this._rotateRightBtn = $("#_rotate_right_btn");
        this._rotateLeftBtn = $("#_rotate_left_btn");
        this._cropBtn = $("#_crop_btn");
        this._flipHrz = $("#_flip_hrz");
        this._flipVtc = $("#_flip_vtc");
    },
    _attachEvent: function () {
        this._resizeSel.on("change", $.proxy(this._setResize, this));
        this._rotateRightBtn.on("click", $.proxy(this._setClockRotate, this));
        this._rotateLeftBtn.on("click", $.proxy(this._setUnClockRotate, this));
    },
    _setResize : function(){
        var width = this._resizeSel.children(":selected").text();
        if(isNaN(width)===false){
            this._Canvas.setCanvasWidth(width);
        }
    },
    _setClockRotate : function(){
        this._Canvas.setRotate(1);
    },
    _setUnClockRotate : function(){
        this._Canvas.setRotate(-1);
    }
};