var isTokenValid = (token) => {

    //Վավերացնել token֊ը համաձայն ալգորթիմի
    return true;
};

/** փոփոխականներ */
let connectedUsers = 0;

module.exports = (server) => {

    const io = require('socket.io')(server);


    // middleware , որ «հաստատում է» միացումը և վերամիացումը
    io.use((socket, next) => {

        //ստանում է token֊ը socket֊ի query֊ներից
        let token = socket.handshake.query.token;

        console.log("validation token");
        if (true || isTokenValid(token)) {
            return next();
        }
        return next(new Error('authentication error'));
    });

    //միացվել է
    io.on('connection', function (socket) {
        let addedUser = false;

        // երբ client֊ը «տարածում է» (emits) 'new message', աշխատում է ֆունկցիան
        socket.on('new message', function (data) {

            console.log("new message from " + socket.username + ": " + data);

            // մենք տեղեկացնում ենք մնացած user-ներին, որ նոր հաղորդագրություն կա
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data
            });
        });

        //երբ client֊ը «տարածում է» (emits) 'add user', աշխատում է ֆունկցիան
        socket.on('add user', function (username) {

            if (addedUser) return;

            console.log("new user: " + username);

            // մենք պահում ենք username֊ը socket֊ի «հիշողության» մեջ հերթական client֊ի

            socket.username = username;
            ++connectedUsers;
            addedUser = true;
            socket.emit('login', {
                connectedUsers: connectedUsers
            });

            // բոլոր client-ներին բացի ընթացիկին, ասում ենք, որ նոր user է միացել chat֊ին
            socket.broadcast.emit('user joined', {
                username: socket.username,
                connectedUsers: connectedUsers
            });
        });


        //երբ client֊ը «տարածում է» (emits) 'typing', աշխատում է ֆունկցիան
        socket.on('typing', function () {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });


        //երբ client֊ը «տարածում է» (emits) 'stop typing', աշխատում է ֆունկցիան
        socket.on('stop typing', function () {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            });
        });

        //երբ client֊ը անջատվեծ չաթից, աշխատում է ֆունկցիան
        socket.on('disconnect', function () {
            if (addedUser) {
                --connectedUsers;

                console.log("left chat user " + socket.username);

                // բոլոր client-ներին բացի ընթացիկին, ասում ենք, որ X user֊ը լքեց chat֊ը
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    connectedUsers: connectedUsers
                });
            }
        });
    });
};