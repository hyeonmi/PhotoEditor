/**
 *
 * @names {PROJECT_NAME}
 * @namespace {FILE_NAME}
 * @author Hyeon Mi Kim
 * @version 0.0.1
 * @since 13. 8. 1. 오후 1:56
 * @copyright Copyright Hyeon Mi Kim
 */
PhotoEditor.Namespace("PhotoEditor.Editor");
PhotoEditor.Editor.Effect = function(options){
    $.extend(this, options || {});
    this.init();
};
PhotoEditor.Editor.Effect.prototype = {
    init : function(){
        console.log("PhotoEditor.Editor.Effect");
    }
};
