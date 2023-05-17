import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string;
            name: string;
            created_at: string;
            session_id?: string;
        },
        meats: {
            id: string;
            name: string;
            date: string;
            isInDiet: boolean;
            created_at: string;
            time: string;
            session_id?: string;
            description: string;
        },
    }
}