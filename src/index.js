const express = require('express');
const path = require('path');
const app = express();

/*

app.listen(3000, () =>{
    console.log('Servidor en el puerto 3000);
})

Debido a que utilizamos socketio en la aplicación, para que funcione es necesario asociarlo
a un servidor. Por ello requerimos el módulo http de nodejs y hacemos que socketio se conecte
al servidor y dispongamos de conexión a tiempo real.
*/
const server = require('http').Server(app);
const socketio = require('socket.io')(server);

app.set('port', process.env.PORT || 3000);

//Ejecutamos la función de sockets.js
require('./sockets')(socketio);

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Lanzamos el servidor
server.listen(app.get('port'), () =>{
    console.log("Servidor en el puerto ", app.get('port'));
});
