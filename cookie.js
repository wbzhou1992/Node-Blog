const model = require('./model');
let User = model.User;
module.exports = {
    setcookie: () => {
        return async (ctx, next) => {
            ctx.request.__user__ = null;
            cookieStr = ctx.cookie.get("user");
            if(cookieStr){
                var users = await Blog.findAll({
                    email: cookieStr,
                })
                for(var user of users){
                    ctx.request.__user__ = user;
                }
            } else {
                await next();
            }
        };
    }
};
