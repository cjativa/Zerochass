import knex from 'knex';
import Config from '../utils/config';

const KnexConfiguration = {
    development: {
        client: 'pg',
        connection: {
            host: Config.dbHost,
            user: Config.dbUser,
            password: Config.dbPassword,
            database: Config.dbName,
            port: 5432
        },
        migrations: {
            directory: __dirname + '/db/pg/migrations'
        },
        seeds: {
            directory: __dirname + '/db/pg/seeds/development'
        }
    },
    production: {
        client: 'pg',
        connection: {
            host: Config.dbHost,
            user: Config.dbUser,
            password: Config.dbPassword,
            database: Config.dbName,
            ssl: true
        },
        migrations: {
            directory: __dirname + '/db/pg/migrations'
        },
        seeds: {
            directory: __dirname + '/db/pg/seeds/production'
        }
    }
}

export const Knex = knex(KnexConfiguration[Config.environment]);