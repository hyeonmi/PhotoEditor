var PhotoEditor = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.prototype = {
    init : function(){
        this._setElement();
        this._attachEvent();
    },
    _setElement : function(){
        this._waTabMenu = $(".tab_menu li");
        this._waTabBox = $(".box_wrap");
        this._welEffectBox = $("._effect");
        this._welToneBox = $("._tone");
        this._welTextBox = $("._text");
    },
    _attachEvent : function(){
        this._waTabMenu.on("click", $.proxy(this._onClickTabMenu, this));
    },
    _onClickTabMenu : function(we){
        var welTarget = $(we.currentTarget);
        if(welTarget.hasClass("on")===false){
            this._waTabMenu.removeClass("on");
            welTarget.addClass("on");
        }
        var id = welTarget.prop("id");
        this._displayBoxBy(id);
    },
    _displayBoxBy : function(id){
        this._waTabBox.hide();

        if(id === "_effect"){
            this._welEffectBox.show();
        }else if(id === "_tone"){
            this._welToneBox.show();
        }else if(id === "_text"){
            this._welTextBox.show();
        }
    }
};
