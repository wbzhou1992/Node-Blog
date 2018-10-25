
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

function addUploadFile(router) {
	//文件上传
	const multer = require('koa-multer');
	//配置
	var storage = multer.diskStorage({
		//文件保存路径
		destination:function (req,file,cb) {
			cb(null,'./static/public/uploads/img/')
		},
		filename:function (req,file,cb){
			var fileFormat = (file.originalname).split(".");
			cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
		}
	})
	var upload = multer({storage:storage});
	//upload.single('file')这里面的file是上传空间的name<input type="file" name="file"/>  
	router.post('/upload',upload.any(),async (ctx,next) => {
        // ctx.response.body ="<h1>上传成功！</h1>";
        console.log(ctx.req.files[0].path);
		ctx.body = {
                "errno":0, 
	    		"data":[
                    "/"+ctx.req.files[0].path
                ]
	  	} 
	})
	console.log(`register URL mapping: POST /upload`);
}
module.exports = function(dir){
    let router = require('koa-router')(),
        controller_dir = dir||'controllers';
    addControllers(router,controller_dir);
    addUploadFile(router);
    return router.routes();
};