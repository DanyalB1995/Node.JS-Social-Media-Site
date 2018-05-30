//Show Message Modal
$(document).ready(function () {
    $('.panel-heading').click(function () {
        var id = this.id;
        $('#messages').one('hidden.bs.modal', function () {
            $('#send').val(id);
            $('#messageBox').modal('show');
        }).modal('hide');
    });
    $('#happy').click(function(){
        $( "#happy1" ).submit();
    });
    $('#meh').click(function(){
        $( "#meh1" ).submit();
    });
    $('#sad').click(function(){
        $( "#sad1" ).submit();
    });
});

//Send Group Messages
$(function () {
    var socket = io('http://localhost:8080');
    $('#sendMessage').submit(function () {
        var room = $('#send').val();
        var user = $('#us').val();
        socket.emit('chat message', $('#m').val(), room, user);
        $('#m').val('');
        return false;
    });

    $('.panel-heading').click(function () {
        var channel = this.id;
        socket.emit('join', channel, function () {
            addMessage('joined: ' + channel);
        });
    });

    $('#close').click(function () {
        var channel1 = $('#send').val();
        $("#mes").empty();
        socket.emit('leave', channel1, function () {
            addMessage('left: ' + channel1);
        });
    });

    socket.on('chat message', function (user, msg) {
        console.log("why tho");
        addMessage(user + ": " + msg);
    });

    var addMessage = function (msg) {
        $('#mes').append($('<li>').text(msg));
    };
});


