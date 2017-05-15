//const products= require('../products');
const model = require('../model');
const APIError = require('../rest').APIError;
let User = model.User,
    Blog = model.Blog,
    Comment = model.Comment;
// function parseQueryString(string){
//     var stringArr = string.split('&');
//     var stringObj = {};
//     for(var string of stringArr){
//         var i 
//     }
    
// }
module.exports = {

    'GET /api/blogs': async (ctx, next) => {
        var pageSize = parseInt(ctx.request.query.pageSize);
        var currentPage = parseInt(ctx.request.query.currentPage);
        var pageCount;
        console.log(currentPage);
        var blogsTotal = await Blog.findAll({
            order: 'createdAt DESC'
        });
        console.log(blogsTotal.length)
        if(blogsTotal.length>pageSize){
            pageCount = Math.ceil(blogsTotal.length/pageSize);
        }else{
            pageCount = 1;
        }
        console.log(pageCount);
        var blogs = await Blog.findAll({
            order: 'createdAt DESC',
            offset:(currentPage-1)*pageSize,
            limit:pageSize
        });
        for (let b of blogs) {
            console.log(`find ${b.name}`);
        }
        ctx.rest(blogs);
    },
    'GET /api/blogs/:id': async (ctx, next) => {
        var blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
        for (let b of blog) {
            ctx.rest(b);
        }
    },
    'PUT /api/blogs/:id': async (ctx, next) => {
        var name = ctx.request.body.name;
        var summary = ctx.request.body.summary;
        var content = ctx.request.body.content;
        var blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
        for (let b of blog) {
            b.name = name;
            b.summary = summary;
            b.content = content;
            await b.save();
            console.log(`find the ${b.name}`);
            ctx.rest(b);
        }
    },
    'POST /api/blogs': async (ctx, next) => {
        var r = ctx.request.body;
        console.log(r.name);
        var blogs = await Blog.create({
            name: r.name.trim(),
            summary: r.summary.trim(),
            content: r.content.trim()
        })
        await blogs.save();
        ctx.rest(blogs);
    },
    'POST /api/blogs/:id': async (ctx, next) => {
        var id = ctx.params.id;
        var blog = await Blog.findAll({
            id: id
        });
        blog.name = name.trim();
        blog.summary = summary.trim();
        blog.content = content.trim();
        await blog.save();
        ctx.rest(blog);
    },
    'DELETE /api/blogs/:id/delete': async (ctx, next) => {
       var blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
        for(var b of blog){
            await b.destroy({ force: true });
            console.log(`Delete the ${b.name}`);
            ctx.rest(b);
        }

    }
}