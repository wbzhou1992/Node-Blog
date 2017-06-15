const model = require('../model');
const APIError = require('../rest').APIError;
let Blog = model.Blog;
module.exports = {

    'GET /api/blogs': async(ctx, next) => {
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
    'GET /api/blogs/:id': async(ctx, next) => {
        var blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
        for (let b of blog) {
            ctx.rest(b);
        }
    },
    'PUT /api/blogs/:id': async(ctx, next) => {
        var blog,
            requestBody = ctx.request.body,
            name = requestBody.name,
            summary = requestBody.summary,
            content = requestBody.content;
        blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
        for (let b of blog) {
            b.name = name;
            b.summary = summary;
            b.content = content;
            await b.save();
            ctx.rest(b);
        }
    },
    'POST /api/blogs': async(ctx, next) => {
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
    'POST /api/blogs/:id': async(ctx, next) => {
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
    'DELETE /api/blogs/:id/delete': async(ctx, next) => {
        var blog = await Blog.findAll({
            where: {
                id: ctx.params.id
            }
        });
        for (var b of blog) {
            await b.destroy({
                force: true
            });
            ctx.rest(b);
        }

    }
}