import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const schema = fs.readFileSync('./database/schema.sql', 'utf-8');

pool.query(schema)
    .then(() => {
        console.log('Tables created successfully!');
        pool.end();
    })
    .catch((err) => {
        console.error('Error creating tables:', err);
        pool.end();
    });
