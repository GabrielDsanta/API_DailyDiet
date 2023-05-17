import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";

export async function meatsRoutes(server: FastifyInstance) {
    server.post('/', async (request, reply) => {
        const createMealBodySchema = z.object({
            name: z.string(),
            date: z.string(),
            isInDiet: z.boolean(),
            time: z.string(),
            description: z.string(),
        })

        const { name, date, description, isInDiet, time } = createMealBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            reply.status(401).send({
                error: 'Unauthorized to acess.'
            })
        }
    })
}