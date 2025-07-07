-- Productive Mining Platform - Database Initialization
-- Create database and extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mathematical_work_timestamp ON mathematical_work(timestamp);
CREATE INDEX IF NOT EXISTS idx_mathematical_work_type ON mathematical_work(work_type);
CREATE INDEX IF NOT EXISTS idx_mathematical_work_difficulty ON mathematical_work(difficulty);
CREATE INDEX IF NOT EXISTS idx_blocks_timestamp ON blocks(timestamp);
CREATE INDEX IF NOT EXISTS idx_blocks_index ON blocks(index);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Performance optimization settings
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = all;

-- Notify initialization complete
SELECT 'Productive Mining Platform database initialized successfully' AS status;