import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { meatsRoutes } from './routes/meats'

export const server = fastify()

server.register(cookie)

server.register(usersRoutes, {
    prefix: 'users',
})

server.register(meatsRoutes, {
    prefix: 'meals',
})