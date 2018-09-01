const db = require('../db');
module.exports = db.defineModel('blogs',{
    user_id:db.STRING(50),
    user_name:db.STRING(50),
    user_image:db.STRING(200),
    name:db.STRING(50),
    summary:db.STRING(200),
    content:db.TEXT
})