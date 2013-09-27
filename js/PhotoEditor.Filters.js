/**
 * 사진 효과에 적용하는 필터 모음
 * @names nts.PhotoEditor
 * @namespace
 * @author heyonmi.kim@nts.com
 * @version 0.0.1
 * @since 13. 9. 19.
 * @copyright heyonmi.kim
 */
var PhotoEditor = PhotoEditor || {};
PhotoEditor.Filters = {
    getContext : function() {
        var tmpCanvas = document.createElement("canvas");
        return tmpCanvas.getContext("2d");
    },

    copyImageData : function(imageData){
        var tmpContext = this.getContext();
        var copyImageData = tmpContext.createImageData(imageData.width, imageData.height);

        for(var index=0; index < imageData.data.length; index +=4){
            copyImageData.data[index] = imageData.data[index];
            copyImageData.data[index+1] = imageData.data[index+1];
            copyImageData.data[index+2] = imageData.data[index+2];
            copyImageData.data[index+3] = imageData.data[index+3];
        }
        return copyImageData;
    },

    Convolve : function(imageData, matrix, offset) {
        var olddata = this.copyImageData(imageData);
        var oldpx = olddata.data;
        var newdata = this.getContext().createImageData(olddata);
        var newpx = newdata.data
        var len = newpx.length;
        var res = 0;
        var w = imageData.width;
        for (var i = 0; i < len; i++) {
            if ((i + 1) % 4 === 0) {
                newpx[i] = oldpx[i];
                continue;
            }
            res = 0;
            var these = [
                oldpx[i - w * 4 - 4] || oldpx[i],
                oldpx[i - w * 4]     || oldpx[i],
                oldpx[i - w * 4 + 4] || oldpx[i],
                oldpx[i - 4]         || oldpx[i],
                oldpx[i],
                oldpx[i + 4]         || oldpx[i],
                oldpx[i + w * 4 - 4] || oldpx[i],
                oldpx[i + w * 4]     || oldpx[i],
                oldpx[i + w * 4 + 4] || oldpx[i]
            ];
            for (var j = 0; j < 9; j++) {
                res += these[j] * matrix[j];
            }

            if (offset) {
                res += offset;
            }
            newpx[i] = res;
        }
        return newdata;
    },

    GrayScale : function(imageData){
        var copyImageData = this.copyImageData(imageData);
        var d = copyImageData.data;
        for (var index = 0; index < d.length-4; index += 4) {
            var average = (d[index] + d[index+1] + d[index+2])/3
            d[index] = d[index+1] = d[index+2] = average;
        }
        return copyImageData;
    },

    Brightness : function (imageData){
        var copyImageData = this.copyImageData(imageData);
        var d = copyImageData.data;
        var adjustment = 30;
        for (var j = 0; j < d.length; j += 4) {
            d[j] += adjustment;
            d[j+1] += adjustment;
            d[j+2] += adjustment;
        }
        return copyImageData;
    },

    Sepia : function (imageData){
        var copyImageData = this.copyImageData(imageData);
        var d = copyImageData.data;
        for (var index = 0; index < d.length-4; index += 4) {
            var average = (d[index] + d[index+1] + d[index+2])/3;
            d[index] =  average + 100;
            d[index+1] = average + 50;
            d[index+2] = average;
        }
        return copyImageData;
    },

    Brown : function(imageData){
        var copyImageData = this.copyImageData(imageData);
        var d = copyImageData.data;
        for (var j = 0; j < d.length-4; j += 4) {
            d[j] =  d[j] + 30;
            d[j+1] = d[j+1] + 10;
            d[j+2] = d[j+2];
        }
        return copyImageData;
    },

    Noise : function(imageData){
        var copyImageData = this.copyImageData(imageData);
        var d = copyImageData.data;
        var factor = 55;
        var rand =  (0.5 - Math.random()) * factor;
        for (var index = 0; index < d.length-4; index += 4) {
            d[index] =  d[index] + rand;
            d[index+1] = d[index+1] + rand;
            d[index+2] = d[index+2] + rand;
        }
        return copyImageData;
    },
    Negative : function(imageData){
        var copyImageData = this.copyImageData(imageData);
        var d = copyImageData.data;
        for (var index = 0; index < d.length-4; index += 4) {
            d[index] =  255 - d[index];
            d[index+1] = 255 - d[index+1];
            d[index+2] = 255 - d[index+2];
        }
        return copyImageData;
    },
    Blur : function(imageData){
        var matrix = [
            1/9, 1/9,1/9,
            1/9, 1/9,1/9,
            1/9, 1/9,1/9
        ];
        return this.Convolve(imageData, matrix, 1);
    },
    Sharpen : function(imageData){
        var matrix = [
            0, -1,  0,
            -1, 5, -1,
            0, -1,  0
        ];
        return this.Convolve(imageData, matrix,1);
    },
    Emboss : function(imageData){
        var matrix = [
            1, 1, 1,
            1, 0.8, -1,
            -1, -1, -1
        ];
        return this.Convolve(imageData, matrix,1);
    }
};
