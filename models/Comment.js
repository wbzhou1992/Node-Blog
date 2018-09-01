const db = require('../db');
module.exports = db.defineModel('comments',{
    blog_id:db.STRING(50),
    user_id:db.STRING(50),
    user_name:db.STRING(50),
    user_image:db.STRING(50),
    content:db.TEXT
})