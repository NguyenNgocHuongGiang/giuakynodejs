var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views")

var server = require("http").Server(app)
var io = require("socket.io")(server);
server.listen(3000);

var mangUsers = []

io.on("connection", function (socket) {
    console.log("Co nguoi vua ket noi " + socket.id);

    socket.on("client-send-username", function (data) {
        if(mangUsers.indexOf(data)>=0){
            socket.emit("server-send-dk-fail");
        }else{
            mangUsers.push(data);
            socket.username = data;
            socket.emit("server-send-dk-success", data);
            io.sockets.emit("server-send-ds-users", mangUsers);
        }
    })

    socket.on("logout", function () {
       mangUsers.splice(
        mangUsers.indexOf(socket.username), 1
       )
       socket.broadcast.emit("server-send-ds-users",mangUsers)
    })

    socket.on("user-send-message", function (data) {
        io.sockets.emit("server-send-message", {un:socket.username, nd:data})
     })

     socket.on("dang-go", function () {
        var s = socket.username + " dang go chu";
        socket.broadcast.emit("dang-go-chu",s)
     })

     socket.on("khong-go", function () {
        socket.broadcast.emit("khong-go-chu")
     })
})

app.get("/", (req, res) => {
    res.render("home")
})
