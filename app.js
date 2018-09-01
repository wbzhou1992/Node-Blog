const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const templating = require('./templating');
const rest = require('./rest');
const setcookie = require('./cookie')

const app = new Koa();
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(bodyParser());
app.use(templating('views', {
    noCache: true,
    watch: true
}));
//app.use(setcookie.setcookie());
app.use(rest.restify());

app.use(controller());
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');