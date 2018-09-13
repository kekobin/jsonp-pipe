;(function() {
    var formatParams = function(data) {//格式化参数
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        return arr.join('&');
    }
    var jsonpPipe = function(options) {
        options = options || {};
        if (!options.url) return;

        //创建 script 标签并加入到页面中
        var url = options.url;
        //缓存时回调名应该唯一
        var urlCut = url.slice(url.length-20,url.length).replace(/[=|&\/\\\?]/g,'');//去掉截取后的url里面的特殊字符
        var callbackName = options.cache ? ('jsonp_' + urlCut) : ('jsonp_' + Math.random()).replace(".", "");
        var oBody = document.getElementsByTagName('body')[0];
        var params = "";

        options.callback = options.callback || 'callback';

        if(options.data){
            options.data[options.callback] = callbackName;
            params += formatParams(options.data);
        }else{
            params+=options.callback+"="+callbackName;
        }
        var scriptTag = document.createElement('script');
        oBody.appendChild(scriptTag);

        //创建jsonp回调函数
        window[callbackName] = function (json) {
            oBody.removeChild(scriptTag);
            clearTimeout(scriptTag.timer);
            window[callbackName] = null;
            options.success && options.success(json);
        };

        //发送请求
        var symbol = options.url.indexOf('?') > 0 ? '&' : '?';
        scriptTag.src = options.url + symbol + params;

        //超时处理
        if (options.time) {
            scriptTag.timer = setTimeout(function () {
                window[callbackName] = null;
                oBody.removeChild(scriptTag);
                options.fail && options.fail({ msg: "timeout" });
            }, options.time);
        }
    };

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = jsonpPipe;
    } else if(typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return jsonpPipe; });
    } else {
        this.jsonpPipe = jsonpPipe;
    }
}).call(function() {
    return this || (typeof window != 'undefined' ? window : global);//作用域
}());

