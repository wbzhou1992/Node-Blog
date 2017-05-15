
const fs = require('fs');
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
function addControllers(router,dir){
    var files = fs.readdirSync(__dirname+'/controllers');
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    });
    for(var f of js_files){
        console.log(`process controller ${f}`);
        let mapping = require(__dirname+'/controllers/'+f);
        addMapping(router,mapping);
    }

}

module.exports = function(dir){
    let router = require('koa-router')(),
        controller_dir = dir||'controllers';
    addControllers(router,controller_dir);
    return router.routes();
    
};