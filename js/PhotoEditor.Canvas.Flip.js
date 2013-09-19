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
PhotoEditor.Canvas.Flip = function(Canvas, Image, direction){
        var canvas = Canvas;
        var context = canvas.getContext();
        var photoWidth = Image.getWidth(),
            photoHeight = Image.getHeight();
        canvas.save();
        if(direction === "Verticalty"){
            context.translate(photoWidth, 0);
            context.scale(-1, 1);
        }else if(direction === "Horizon"){
            context.translate(0, photoHeight);
            context.scale(1, -1);
        }

        context.drawImage(Image.getImage(), 0, 0, photoWidth, photoHeight, 0, 0, photoWidth, photoHeight);
        //this.saveCanvasImage();
        canvas.restore();
}