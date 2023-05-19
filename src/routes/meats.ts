import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import crypto from "node:crypto"

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
            sessionId = crypto.randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })
        }

        await knex('meats').insert({
            id: crypto.randomUUID(),
            name,
            date,
            description,
            isInDiet,
            time,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })

    server.put('/:mealId', async (request, reply) => {
        const createMealBodySchema = z.object({
            name: z.string(),
            date: z.string(),
            isInDiet: z.boolean(),
            time: z.string(),
            description: z.string(),
        })

        const createMealParamsSchema = z.object({
            mealId: z.string(),
        })

        const { name, date, description, isInDiet, time } = createMealBodySchema.parse(request.body)
        const { mealId } = createMealParamsSchema.parse(request.params)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            reply.status(401).send({
                error: 'Unauthorized to acess.'
            })
        }

        await knex('meats').select('*').where({
            session_id: sessionId,
            id: mealId
        }).update({
            name,
            date,
            description,
            isInDiet,
            time
        })

        return reply.status(201).send()
    })

    server.delete('/:mealId', async (request, reply) => {
        const createMealParamsSchema = z.object({
            mealId: z.string(),
        })

        const { mealId } = createMealParamsSchema.parse(request.params)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            reply.status(401).send({
                error: 'Unauthorized to acess.'
            })
        }

        await knex('meats').select('*').where({
            session_id: sessionId,
            id: mealId
        }).delete()

        return reply.status(201).send()
    })

    server.get('/', async (request, reply) => {
        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            reply.status(401).send({
                error: 'Unauthorized to acess.'
            })
        }

        const meals = await knex('meats').select('*').where({
            session_id: sessionId
        })

        return { meals }
    })

    server.get('/:mealId', async (request, reply) => {
        const createMealParamsSchema = z.object({
            mealId: z.string(),
        })

        const { mealId } = createMealParamsSchema.parse(request.params)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            reply.status(401).send({
                error: 'Unauthorized to acess.'
            })
        }

        const meal = await knex('meats').select('*').where({
            session_id: sessionId,
            id: mealId
        })

        return { meal }
    })
}