"use server"

import Database from './classes/Database';

export async function getDatabase() {
    return new Database({
        connectionString: process.env.DATABASE_URL
    })
}