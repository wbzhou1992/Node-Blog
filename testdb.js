const model = require('./model');
var now = Date.now();
let User = model.User;

(async () => {
    var user = await User.create({ 
        id:'d-'+now,
        email:'wbzhou1988@163.com',
        password:'123',
        admin:true,
        name:'wbzhou',
        image:'1222222'
    });
})();
(async () => {
    var users = await User.findAll({
        where: {
            name: 'wbzhou'
        }
    });
    console.log(`find ${users.length} users:`);
    for (let p of users) {
        console.log(JSON.stringify(p));
    }
})();