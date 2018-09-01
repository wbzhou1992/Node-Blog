const model = require('../model');
let Blog = model.Blog;
let User = model.User;
let Comment = model.Comment;

module.exports = {
    'GET /':async(ctx,next)=>{
        var blogs = await Blog.findAll({
            order:'createdAt DESC',
        });
        console.log("len",blogs.length);
        // var pageSize = blogs.length;
        // var currentPage = ctx.req.query;
        // var user = await User.findOne({
        //     where:{
        //         email: ctx.request.body.email.trim(),
        //     }
        // })
        // if(!user){
        //     throw new APIError('login :login_failed', 'Email not exist.');
        // }
        // ctx.cookies.set("user",user)
        //ctx.rest(user);
        var email = ctx.cookies.get("user");
        console.log("email",email)

        if(email){
            var user = await User.findOne({
                where:{
                    email: email,
                }
            });
            ctx.render('blogs.html',{
                user:user,
                blogs:blogs
            })
        }else{
            ctx.render('blogs.html',{
                blogs
            });
        }
    },
    'GET /register':async(ctx,next)=>{
        ctx.render('register.html');
    },
    'GET /signin':async(ctx,next)=>{
        ctx.render('signin.html');
    },
    'GET /signout':async(ctx,next)=>{
        ctx.cookies.set('user', '',{
            expires:new Date(-1)
        });
        var blogs = await Blog.findAll({
            order:'createdAt DESC',
        });
        console.log("len",blogs.length);
        // var pageSize = blogs.length;
        // var currentPage = ctx.req.query;
        // var user = await User.findOne({
        //     where:{
        //         email: ctx.request.body.email.trim(),
        //     }
        // })
        // if(!user){
        //     throw new APIError('login :login_failed', 'Email not exist.');
        // }
        // ctx.cookies.set("user",user)
        //ctx.rest(user);
        var email = ctx.cookies.get("user");
        console.log("email",email)

        if(email){
            var user = await User.findOne({
                where:{
                    email: email,
                }
            });
            ctx.render('blogs.html',{
                user:user,
                blogs:blogs
            })
        }else{
            ctx.render('blogs.html',{
                blogs
            });
        }
    },
    'GET /blog/:id':async(ctx,next)=>{
        var id = ctx.params.id;
        console.log(id)
        if(id){
            var blog = await Blog.findOne({
                where:{
                    id:id
                }
            });
            var user = await User.findOne({
                where:{
                    id:blog.user_id
                }
            })
            ctx.render('blog.html',{
                blog:blog,
                user:user
            });
        }
    },
    'GET /manage/blogs':async(ctx,next)=>{
        var email = ctx.cookies.get("user");
        console.log("email",email)
        if(email){
            var user = await User.findOne({
                where:{
                    email: email,
                }
            });
            console.log("user",user.dataValues)
            ctx.render('manage_blogs.html',{
                user:user
            });
        }else{
            ctx.render('manage_blogs.html');
        }
        
    },
    'GET /manage/blogs/create':async(ctx,next)=>{
        var email = ctx.cookies.get("user");
        console.log("email",email)

        if(email){
            var user = await User.findOne({
                where:{
                    email: email,
                }
            });
            console.log("user",user.dataValues)
            ctx.render('manage_blog_edit.html',{
                user:user
            });
        }else{
            ctx.render('manage_blog_edit.html');
        }
        
    },
    'GET /manage/blogs/edit':async(ctx,next)=>{
        var id = ctx.query.id;
        console.log(id);
        var email = ctx.cookies.get("user");
        console.log("email",email)
        if(id){
            var blog = await Blog.findOne({
                where:{
                    id:id
                }
            });
            var user = await User.findOne({
                where:{
                    id:blog.user_id
                }
            })
            ctx.render('manage_blog_edit.html',{
                blog:blog,
                user:user
            });
        }
        
    }
}