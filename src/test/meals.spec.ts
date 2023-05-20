import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import { server } from '../../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'


describe('Meals routes', () => {
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

    it('must be possible to delete a meal', async () => {
        const createUserRespose = await request(server.server)
            .post('/users')
            .send({
                name: "Arthur"
            })

        await request(server.server)
            .post('/meals')
            .send({
                name: "Refeição Teste",
                description: "Negocio aqi",
                time: "15:35",
                date: "27/05/2023",
                isInDiet: false
            })

        const cookies = createUserRespose.get('Set-Cookie')

        const findMeal = await request(server.server)
            .get('/meal')

        await request(server.server)
            .delete(`/meals/${findMeal.body.id}`)
            .set('Cookie', cookies)
            .expect(201)
    })

    it('It should be possible to list all meals of a user', async () => {
        const createUserRespose = await request(server.server)
            .post('/users')
            .send({
                name: "Arthur"
            })

        const cookies = createUserRespose.get('Set-Cookie')

        await request(server.server)
            .post('/meals')
            .send({
                name: "Maça",
                description: "Refeição saudável",
                time: "15:35",
                date: "27/05/2023",
                isInDiet: true
            })
            .set('Cookie', cookies)

        const findMeal = await request(server.server)
            .get('/meals')
            .set('Cookie', cookies)
            .expect(200)
        console.log(findMeal.body.meals)

        expect(findMeal.body.meals).toEqual([
            expect.objectContaining({
                name: "Maça",
                description: "Refeição saudável",
                time: "15:35",
                date: "27/05/2023",
                isInDiet: 1,
            })
        ])
    })

})