var socket = io("http://localhost:3000")

socket.on("server-send-dk-fail", function () {
    alert("Username da ton tai")
})

socket.on("server-send-dk-success", function (data) {
    $("#currentUser").html(data);
    $("#loginForm").hide(2);
    $("#chatForm").show(1);
})

socket.on("server-send-ds-users", function (data) {
    $("#boxContent").html("");
    data.forEach(function(i) {
        $("#boxContent").append("<div class='user'>" + i +"</div>")
    });
})

socket.on("server-send-message", function (data) {
    $("#listMessages").append("<div class='ms'>" + data.un + ":" + data.nd +"</div>")
    scrollDown();
})

socket.on("dang-go-chu", function (data) {
    $("#thongbao").html("<img width = '20px' src = 'load.gif'>" + data);
})

socket.on("khong-go-chu", function (data) {
    $("#thongbao").html("");
})

function scrollDown() {
    var container = $("#listMessages");
    container.scrollTop(container[0].scrollHeight);
}

$(document).ready(function () {
    $("#loginForm").show();
    $("#chatForm").hide();

    $("#btnRegister").click(function () {
        socket.emit("client-send-username", $("#txtUsername").val())
    });

    $("#btnLogout").click(function () {
        socket.emit("logout");
        $("#chatForm").hide(2);
        $("#loginForm").show(1);
    });

    $("#btnSendMessage").click(function () {
        socket.emit("user-send-message", $("#txtMessage").val())
        $("#txtMessage").val("")
    });

    $("#txtMessage").focusin(function () {
        socket.emit("dang-go")
    })

    $("#txtMessage").focusout(function () {
        socket.emit("khong-go")
    })
})
