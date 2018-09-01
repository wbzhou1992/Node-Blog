const db = require('../db')
module.exports =db.defineModel('users',{
    email:db.STRING(50),
    passwd:db.STRING(50),
    admin:{
        type:db.BOOLEAN,
        allowNull:true
    },

    name:db.STRING(50),
    image:{
        type:db.STRING(500),
        allowNull:true

    }
})