/**
 * 설명을 작성하세요
 * @names nts.PhotoEditor
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 19.
 * @copyright Copyright (c) 2012, NHN Technology Services inc.
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Canvas = PhotoEditor.Canvas || {};
PhotoEditor.Canvas.Rotate = function(Canvas, Image, degrees){
    var canvas = Canvas,
        context = canvas.getContext();
    var photoWidth = Image.getWidth(),
        photoHeight = Image.getHeight(),
        changeWidth = photoHeight,
        changeHeight = photoWidth,
        changeX = 0,
        changeY = 0,
        angleInRadians = degrees * Math.PI / 180;

    if (degrees === 90) {
        changeY = photoHeight * (-1);
    } else if (degrees === -90) {
        changeX = photoWidth * (-1);
    }
    //canvas width, height을 변경했을 경우 상태값은 저장되지 않아야함
    canvas.setCanvasWidth(changeWidth);
    canvas.setCanvasHeight(changeHeight);
    canvas.save();
    context.rotate(angleInRadians);
    context.drawImage(Image.getImage(), changeX, changeY, photoWidth, photoHeight);
    canvas.restore();
    return {changeWidth : changeWidth,  changeHeight : changeHeight};
};