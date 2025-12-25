const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient();

const setupDatabase = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    // Initialize Prisma
    await prisma.$connect();
    console.log('Prisma connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  pool,
  prisma,
  setupDatabase
};
