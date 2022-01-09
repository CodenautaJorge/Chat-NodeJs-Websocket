$(function(){
    const socket = io();
    var nick = '';

    //Obtenemos los elementos del DOM
    
    const messageForm = $('#messages-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    const nickForm = $('#nick-form');
    const nickError = $('#nick-error');
    const nickName = $('#nick-name');

    const userNames = $('#usernames');

    //Eventos

    messageForm.submit( e =>{
        //Evitamos que se recargue la pantalla:
        e.preventDefault();
        //Enviamos el evento que debe recibir el servidor:
        socket.emit('enviar mensaje', messageBox.val());
        //Limpiamos el input
        messageBox.val('');
    });

    //Obtenemos respuesta del servidor:
    socket.on('nuevo mensaje', function(datos){
        let color = '#f5f4f4';
        if(nick == datos.nick){
            color = '#9ff4c5';
        }
        
        chat.append(`
        <div class="msg-area mb-2" style="background-color:${color}">
            <p class="msg"><b>${datos.nick} :</b> ${datos.msg}</p>
        </div>
        `);

    });


    nickForm.submit( e =>{
        e.preventDefault();
        console.log('Enviando...');
        socket.emit('nuevo usuario', nickName.val(), datos =>{
            if(datos){
                nick = nickName.val();
                $('#nick-wrap').hide();
                $('#content-wrap').show();
            }else{
                nickError.html(`
                <div class="alert alert-danger">
                El usuario ya existe
                </div>
                `); 
            }
            nickName.val('');
        });

    });

    //Obtenemos el array de usuarios de sockets.js
    socket.on('usernames', datos =>{
        let html = '';
        let color = '#000';
        let salir = '';
        console.log(nick);
        for(let i = 0; i < datos.length; i++){
            if(nick == datos[i]){
                color = '#027f43';
                salir = `<a class="enlace-salir" href="/"><i class="fas fa-sign-out-alt salir"></i></a>`;
            }else{
                color = '#000';
                salir = '';
            }
            html += `<p style="color:${color}"><i class="fas fa-user"></i> ${datos[i]} ${salir}</p>`;
        }

        userNames.html(html);
    });

});