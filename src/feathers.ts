import io from 'socket.io-client'
import feathers from '@feathersjs/client'
// Socket.io is exposed as the `io` global.
export const socket = io('http://localhost:3030')
// @feathersjs/client is exposed as the `feathers` global.
const client = feathers()            
               .configure(feathers.socketio(socket))              
                //incase we later have to do authentication
               .configure(
                    feathers.authentication({
                        storage:window.localStorage
                    })
               )

export default client