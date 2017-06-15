const model = require('../model');
let Blog = model.Blog;

module.exports = {
    'GET /':async(ctx,next)=>{
        var blogs = await Blog.findAll({
            order:'createdAt DESC',
        });
        console.log(blogs.length);
        var pageSize = blogs.length;
        var currentPage = ctx.req.query;
        ctx.render('blogs.html',{
            blogs:blogs
        });
    },
    'GET /blog/:id':async(ctx,next)=>{
        var id = ctx.params.id;
        var blog = await Blog.findAll({
            where:{
                id:id
            }
        });
        
        for(let b of blog){
        ctx.render('blog.html',{
            blog:b
        });
        }
        
    },
    'GET /manage/blogs':async(ctx,next)=>{
        ctx.render('manage_blogs.html');
    },
    'GET /manage/blogs/create':async(ctx,next)=>{
        ctx.render('manage_blog_edit.html');
    },
    'GET /manage/blogs/edit':async(ctx,next)=>{
        ctx.render('manage_blog_edit.html');
    }
}