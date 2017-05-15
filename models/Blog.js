const db = require('../db');
module.exports = db.defineModel('blogs',{
    name:db.STRING(50),
    summary:db.STRING(200),
    content:db.TEXT
})