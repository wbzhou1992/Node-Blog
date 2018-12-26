const model = require('../model');
let Blog = model.Blog;
let User = model.User;
let Comment = model.Comment;

module.exports = {
    'GET /':async(ctx,next)=>{
        var pageCount,
            blogsTotal,
            blogsCount,
            pageprev,
            pagenext,
            hiddenprev='',
            hiddennext='',
            queryString = ctx.request.query,
            pageSize = 10,
            currentPage;
        blogsTotal = await Blog.findAll({
            order: 'createdAt DESC'
        });
        blogsCount = blogsTotal.length;
        console.log("blogsCount",blogsCount);
        if(queryString.page){
            currentPage = parseInt(queryString.page);
        }else{
            currentPage=1;
        }
        
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

        var email = ctx.cookies.get("user");
        console.log("currentPage",currentPage);
        //当前第一页，只有一页
        //prev和next都隐藏
        //当前第二页，只有2页
        //prev显示，next隐藏
        //当前最后一页
        //prev显示，next隐藏
        console.log("pageCount",pageCount);

        if(pageCount==1){
            pageprev='';
            pagenext='';
            hiddenprev="hiddenprev";
            hiddennext="hiddennext";
        }else{
            pageprev=currentPage-1;
            pagenext=currentPage+1;
            if(pageCount==currentPage){
                hiddennext="hiddennext";
            }
            if(currentPage==1){
                hiddenprev="hiddenprev";
                pagenext=2;
            }
        }
        if(email){
            var user = await User.findOne({
                where:{
                    email: email
                }
            });
            ctx.render('blogs.html',{
                user:user,
                blogs:blogs,
                pageprev:pageprev,
                pagenext:pagenext,
                hiddenprev:hiddenprev,
                hiddennext:hiddennext
            })
        }else{
            ctx.render('blogs.html',{
                blogs:blogs,
                pageprev:pageprev,
                pagenext:pagenext,
                hiddenprev:hiddenprev,
                hiddennext:hiddennext
                
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
        // var blogs = await Blog.findAll({
        //     order:'createdAt DESC',
        // });
        // console.log("len",blogs.length);
        ctx.redirect('/');
        
    },
    'GET /blog/:id':async(ctx,next)=>{
        var id = ctx.params.id;
        var email = ctx.cookies.get("user");
        if(id){
            var blog = await Blog.findOne({
                where:{
                    id:id
                }
            });
            var user = await User.findOne({
                where:{
                    email: email,
                }
            });
            var comments = await Comment.findAll({
                where:{
                    blog_id: id,
                }
            });
            ctx.render('blog.html',{
                blog:blog,
                user:user,
                comments:comments
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