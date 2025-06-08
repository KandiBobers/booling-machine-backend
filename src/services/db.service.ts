// src/services/db.service.ts
import pool from '../config/database';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

class DatabaseService {
    async runMigrations() {
        try {
            const client = await pool.connect();
            const migrationFiles = fs.readdirSync(path.join(__dirname, '../../src/migrations'))
                .sort()
                .filter(file => file.endsWith('.sql'));

            for (const file of migrationFiles) {
                const sql = fs.readFileSync(path.join(__dirname, '../../src/migrations', file), 'utf8');
                await client.query(sql);
                logger.info(`Applied migration: ${file}`);
            }

            client.release();
            logger.info('Database migrations completed');
        } catch (error) {
            logger.error('Migration failed', error);
            process.exit(1);
        }
    }
}

export default new DatabaseService();