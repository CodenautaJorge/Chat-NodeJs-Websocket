module.exports = (io) =>{

    let nickNames = [];

    io.on('connection', socket =>{
        console.log('Nuevo usuario conectado');

        //Al recibir un mensaje recojemos los datos
        socket.on('enviar mensaje', (datos) =>{
            //console.log(datos);
            //Lo enviamos a todos los usuarios (clientes)
            io.sockets.emit('nuevo mensaje', {
                msg: datos,
                nick: socket.nickname
            });
        });


        socket.on('nuevo usuario', (datos, callback) => {

            //Nos devuelve el indice si el dato existe, es decir, si ya existe el nombre de usuario:
            if(nickNames.indexOf(datos) != -1){
                callback(false);
            }else{
                //Si no existe le respondemos al cliente con true y agregamos el nuevo usuario:
                callback(true);
                socket.nickname = datos;
                nickNames.push(socket.nickname);
                //Enviamos al cliente el array de usuarios:
                actualizarUsuarios();
            }
        });

        socket.on('disconnect', datos =>{
            //Si un usuario se desconecta lo eliminamos del array
            if(!socket.nickname){
                return;
            }else{
                //buscamos su posición en el array y lo eliminamos con splice()
                nickNames.splice(nickNames.indexOf(socket.nickname), 1);

                //Enviamos al cliente el array de usuarios actualizado:
                actualizarUsuarios();
            }
        });

        function actualizarUsuarios(){
            io.sockets.emit('usernames', nickNames);
        }

    });
}