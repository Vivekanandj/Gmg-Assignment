-- to create user Table
CREATE TABLE IF NOT EXISTS user_table (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


-- to store session

-- Drop the existing session table exists
DROP TABLE IF EXISTS "session";

-- Recreate the session table
CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

-- Add primary key constraint
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

