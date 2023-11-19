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
    data.forEach(function (i) {
        $("#boxContent").append("<div class='user'>" + i + "</div>")
    });
})

socket.on("server-send-message", function (data) {
    var isMine = (data.un === $("#currentUser").text());
    var messageClass = isMine ? "mine" : "other-user";
    $("#listMessages").append("<div class='ms " + messageClass + "'>" + "<span>" + data.un + ":</span>" + data.nd + "</div>");
    scrollDown();
})

socket.on("dang-go-chu", function (data) {
    $("#thongbao").html("<img width = '20px' src = 'load.gif'>" + data);
})

socket.on("khong-go-chu", function (data) {
    $("#thongbao").html("");
})

socket.on("server-send-rooms", function (data) {
    $("#dsroom").html("");
    data.map(function (r) {
        $("#dsroom").append("<h5 class='room'>" + r + "</h5>")
    })
})

socket.on("server-send-room-socket", function (data) {
    $("#roomHientai").html(data);
})

socket.on("server-chat", function (data) {
    $("#right-room").append("<div >" + data + "</div>")
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

    $("#btnTaoRoom").click(function () {
        socket.emit("tao-room", $("#txtRoom").val())
    })

    $("#btnChat").click(function () {
        socket.emit("user-chat", $("#txtMessage2").val())
    })

    $(document).on("click", ".room", function() {
        var tenPhong = $(this).text();
        socket.emit("change-chat", tenPhong);
    });
})
