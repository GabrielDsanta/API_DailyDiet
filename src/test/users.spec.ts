import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import { server } from '../../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Users routes', () => {
    beforeAll(async () => {
        await server.ready()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback')
        execSync('npm run knex migrate:latest')
    })

    afterAll(async () => {
        await server.close()
    })

    it('user can review their data', async () => {
        const createUserRespose = await request(server.server)
            .post('/meals')
            .send({
                name: "Refeição Teste",
                description: "Negocio aqi",
                time: "15:35",
                date: "27/05/2023",
                isInDiet: false
            })

        const cookies = createUserRespose.get('Set-Cookie')

        const userReview = await request(server.server)
            .get('/users')
            .set('Cookie', cookies)
            .expect(200)

        expect(userReview.body).toEqual({
            inDiet: 0,
            outDiet: 1,
            total: 1,
            bestSequence: 0
        }
        )
    })

    it('user can create a new user', async () => {
        await request(server.server)
            .post('/users')
            .send({
                name: "Gabriel"
            })
            .expect(201)
    })

})
