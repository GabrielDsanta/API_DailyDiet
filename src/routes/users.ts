import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from 'zod'
import crypto from 'node:crypto'
import cookie from '@fastify/cookie'


export async function usersRoutes(server: FastifyInstance) {
    
    server.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
        })

        const { name } = createUserBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = crypto.randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })
        }

        await knex('users').insert({
            id: crypto.randomUUID(),
            name,
            session_id: sessionId
        })

        return reply.status(201).send()
    }
    )

    server.get('/', async (request, reply) => {
        let total = 0
        let inDiet = 0
        let outDiet = 0
        let bestSequence = 0

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            return reply.status(401).send({
                error: "Unauthorized to acess."
            })
        }

        const meals = await knex('meats').where({
            session_id: sessionId
        })

        meals.map((item, index) => {
            if(item.isInDiet === 1){
                inDiet++
            }

            if(item.isInDiet === 0){
                outDiet++
            }

            if(item.isInDiet === 1 && meals[index + 1].isInDiet === 1){
                bestSequence++
            }

            total++
        })

        if(bestSequence > 0){
            bestSequence++
        }

        return { inDiet, outDiet, total, bestSequence }
    }
    )
}