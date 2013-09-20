/**
 * 썸네일 관련 이벤트 모음
 * @class
 * @name PhotoEditor.
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 16
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Thumbnail = function (options) {
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Thumbnail.prototype = {
    init: function () {
        this._setElement();
        this._attachEvent();
        this.index = 0;
    },
    _setElement: function () {
        this.waThumbnail = $(".thumb ul li");
    },
    _attachEvent: function () {
        this.waThumbnail.on("click", "img",$.proxy(this._onClickThumbnail, this));
        $(document).on("image.created", $.proxy(this._setFileToThumbnail, this));
    },
    _setFileToThumbnail: function (event, images) {
        for(var fi = 0; fi < this.waThumbnail.length; fi +=1){
            var thumnail = $(this.waThumbnail[fi]);
            if(thumnail.find("img").length === 0){
                thumnail.append(images);
                return true;
            }
        }
    },
    _onClickThumbnail : function(event){
        var thumbnail = $(event.currentTarget);
        $(document).trigger("canvas.drawthumbnail", [thumbnail]);
    }
};