import io from 'socket.io-client'
import feathers from '@feathersjs/client'
import socketio from '@feathersjs/socketio-client'
import { apiServer } from 'constants/map'
// Socket.io is exposed as the `io` global.
export const socket = io(`http://localhost:3000`)
// @feathersjs/client is exposed as the `feathers` global.

const client = feathers()
client.configure(socketio(socket))

// const client = feathers()            
//                .configure(feathers.socketio(socket))
//                 //incase we later have to do authentication
//                .configure(
//                     feathers.authentication({
//                         storage:window.localStorage
//                     })
//                )

export default client