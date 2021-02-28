import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {

    const defaultOptions = await getConnectionOptions();

    //this is for test or real application
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === 'test'
                ? "./src/database/database.test.sqlite"
                : defaultOptions.database,
        })
    );
};