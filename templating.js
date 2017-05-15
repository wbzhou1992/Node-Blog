const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}
function datefilter(t){
    if (typeof (t) === 'string') {
        t = parseInt(t);
    }
    if (isNaN(t)) {
        return '';
    }
    var d = new Date(t);
    return d.getFullYear()+'-'+(d.getMonth()+1 <10 ? '0':'')+(d.getMonth()+1)+'-'+(d.getDate() <10 ? '0':'')+d.getDate()+' '+(d.getHours() < 10 ? '0' :'')+d.getHours()+':'+(d.getMinutes() < 10 ? '0' :'')+d.getMinutes()+':'+(d.getSeconds() < 10 ? '0' :'')+d.getSeconds()
}
function datetimeFilter(d) {
    if (typeof (d) === 'string') {
        d = parseInt(d);
    }
    if (isNaN(d)) {
        return '';
    }
    var now = Date.now(),
        s = '1分钟前',
        t = now - d,
        today = new Date(now);
    if (t > 604800000) {
        var that = new Date(d);
        var y = that.getFullYear(),
            m = that.getMonth() + 1,
            d = that.getDate(),
            hh = that.getHours(),
            mm = that.getMinutes();
        s = y === today.getFullYear() ? '' : y + '年';
        s = s + m + '月' + d + '日' + hh + ':' + (mm < 10 ? '0' : '') + mm;
    }
    else if (t >= 86400000) {
        s = Math.floor(t / 86400000) + '天前';
    }
    else if (t >= 3600000) {
        s = Math.floor(t / 3600000) + '小时前';
    }
    else if (t >= 60000) {
        s = Math.floor(t / 60000) + '分钟前';
    }
    return s;
}
function templating(path, opts) {
    var env = createEnv(path, {
        watch: true,
        filters: {
            date_filter: datefilter,
            datetime_filter:datetimeFilter

        }
    });
    return async (ctx, next) => {
        ctx.render = function (view, model) {
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            ctx.response.type = 'text/html';
        };
        await next();
    };
}
module.exports = templating;
