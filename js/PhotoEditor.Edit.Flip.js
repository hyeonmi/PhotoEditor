/**
 * 좌우, 상하 반전
 * @names nts.PhotoEditor
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 19.
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Edit = PhotoEditor.Edit || {};
PhotoEditor.Edit.Flip = function(Canvas, Image, direction){
        var canvas = Canvas;
        var context = canvas.getContext();
        var photoWidth = Image.getWidth(),
            photoHeight = Image.getHeight();
        //이전의 상태값을 저장
        canvas.save();
        if(direction === "Verticalty"){
            context.translate(photoWidth, 0);
            context.scale(-1, 1);
        }else if(direction === "Horizon"){
            context.translate(0, photoHeight);
            context.scale(1, -1);
        }

        context.drawImage(Image.getImage(),  0, 0);
        canvas.restore();
}