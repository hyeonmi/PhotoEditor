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
        this.waThumbnail.on("click", $.proxy(this._onClickThumnail, this));
        $(document).on("image.created", $.proxy(this.setFileToThumbnail, this));
    },
    setFileToThumbnail: function (we, images) {
        for(var fi = 0; fi < this.waThumbnail.length; fi +=1){
            var thumnail = $(this.waThumbnail[fi]);
            if(thumnail.find("img") !== undefined){
                thumnail.appendTo(images);
            }
        }
    },
    _onClickThumnail: function (e) {
        var Image = new PhotoEditor.Image(e , $.proxy(this.completeLoadImage, this));
    },
    completeLoadImage : function(){
        console.log("ondraw");
    }
};