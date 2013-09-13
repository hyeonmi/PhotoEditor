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
        this.waThumbnail = $(".thumb ul li").find("img");
    },
    _attachEvent: function () {
        this.waThumbnail.on("click", $.proxy(this._onClickThumnail, this));
        $(document).on("file.change", $.proxy(this.setFileToThumbnail, this));
    },
    /**
     *
     * @param we
     * @param {Array<file>}files
     */
    setFileToThumbnail: function (we, files) {
        var fileCount = files.length;
        for (var fi = 0; fi < fileCount; fi += 1) {
            var file = files[fi];
            var reader = new FileReader();
            reader.onloadend = $.proxy(this._setThumbnail, this, fi);
            reader.readAsDataURL(file);
        }
    },
    _setThumbnail: function (index, we) {
        var elImg = this.waThumbnail[index];
        $(elImg).prop("src", we.target.result);
    },
    _onClickThumnail: function (e) {
        var Image = new PhotoEditor.Image(e , $.proxy(this.completeLoadImage, this));
    },
    completeLoadImage : function(){
        console.log("ondraw");
    }
};