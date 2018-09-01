const model = require('../model');
const APIError = require('../rest').APIError;
let Blog = model.Blog;
let User = model.User;
let Comment = model.Comment;

module.exports = {
    'GET /api/blogs': async (ctx, next) => {
        var pageCount,
            blogsTotal,
            blogsCount,
            queryString = ctx.request.query,
            pageSize = parseInt(queryString.pageSize),
            currentPage = parseInt(queryString.currentPage);
        blogsTotal = await Blog.findAll({
            order: 'createdAt DESC'
        });
        blogsCount = blogsTotal.length;
        if (blogsCount > pageSize) {
            pageCount = Math.ceil(blogsCount / pageSize);
        } else {
            pageCount = 1;
        }
        var blogs = await Blog.findAll({
            order: 'createdAt DESC',
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        });
        var result = {
            pageCount: pageCount,
            blogs: blogs
        }
        ctx.rest(result);
    },
    'POST /api/users': async (ctx, next) => {
        var r = ctx.request.body;
        console.log("注册进入：", r)
        if (!r.name || !r.name.trim()) {
            throw new APIError('name:name_error', 'name is illegal.');
        }
        if (!r.email || !r.email.trim()) {
            throw new APIError('email:email_error', 'email is illegal.');
        }
        if (!r.passwd || !r.passwd.trim()) {
            throw new APIError('passwd :passwd_error', 'passwd is illegal.');
        }
        var users = await User.findOne({
            where: {
                email: r.email.trim()
            }
        })
        if (users) {
            throw new APIError('register :register_failed', 'email is already in use.');
        }
        var user = await User.create({
            name: r.name.trim(),
            email: r.email.trim(),
            passwd: r.passwd.trim(),
        })

        await user.save();
        ctx.cookies.set('user', user.email);
        console.log("user cookie:", user)
        ctx.rest(user);
    },
    'POST /api/authenticate': async (ctx, next) => {
        var r = ctx.request.body;
        console.log("登录进入", r)
        if (!r.email || !r.email.trim()) {
            throw new APIError('email:email_error', 'email is illegal.');
        }
        if (!r.passwd || !r.passwd.trim()) {
            throw new APIError('passwd :passwd_error', 'passwd is illegal.');
        }
        var user = await User.findOne({
            where: {
                email: r.email.trim(),
                passwd: r.passwd
            }
        })
        if (user) {
            ctx.cookies.set('user', user.email);
            console.log("user cookie:", user)
            ctx.rest(user);
        }
    },
    //更新获取
    'GET /api/blogs/:id': async (ctx, next) => {
        var blog = await Blog.findOne({
            where: {
                id: ctx.params.id
            }
        });
        ctx.rest(blog);

    },
    //更新保存
    'PUT /api/blogs/:id': async (ctx, next) => {
        var blog,
            requestBody = ctx.request.body,
            name = requestBody.name,
            summary = requestBody.summary,
            content = requestBody.content;
        blog = await Blog.findOne({
            where: {
                id: ctx.params.id
            }
        });
       
        blog.name = name;
        blog.summary = summary;
        blog.content = content;
        await blog.save();
        ctx.rest(blog);
        
    },
    //新建blog
    'POST /api/blogs': async (ctx, next) => {
        var r = ctx.request.body;
        var u;
        var email = ctx.cookies.get("user");
        console.log("email",email)
        if (email) {
            u = await User.findOne({
                email: email,
            })
          
        }
        var blogs = await Blog.create({
            user_id: u.id,
            user_name: u.name,
            user_image: u.image,
            name: r.name.trim(),
            summary: r.summary.trim(),
            content: r.content.trim()
        })
        await blogs.save();
        ctx.rest(blogs);
    },
    
    'DELETE /api/blogs/:id/delete': async (ctx, next) => {
        var blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
      
        await blog.destroy({
            force: true
        });
        ctx.rest(blog);
        

    }
}