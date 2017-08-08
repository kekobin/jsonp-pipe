# jsonp-pipe
an implement of jsonp.

# usage

```
<script type="text/javascript" src="jsonp-pipe/index.js"></script>

or

import jsonp from 'jsonp-pipe'
```

# example

```
jsonp({
    url:url,
    callback:"callback",//可选
    data:{}, //可选
    success:function(resp){
    },
    fail:function(err){
    },
    time:time,//可选
    cache:true//可选
})
```
