var cropBtn = $("#crop_btn");
var saveBtn = $(".btn_save");
var savedImg = $(".thumb ul li :first").find("img");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


var crop = function(){
    var cropPhoto = context.getImageData(250, 50, 300, 150);
//    _canvas.width = cropPhoto.width;
//    _canvas.height = cropPhoto.height;

    context.putImageData(cropPhoto, 0,0);
    context.scale(2, 2);

}
var save = function(){

    var data = canvas.toDataURL();

    console.log(data);
    savedImg.prop("src", data);
}
var eventPhotoLoaded = function(){
    context.drawImage(photo, 0,0);
}

var photo = new Image();
photo.addEventListener('load', eventPhotoLoaded, false);
photo.src="img/img.jpg";


cropBtn.on("click", crop);
saveBtn.on("click", save);