"""
Database Manager - Python Implementation
PostgreSQL database layer using SQLAlchemy and asyncpg
"""

import logging
import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import asyncio

import asyncpg
from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime, Float, Text, JSON, Boolean
from sqlalchemy.sql import select, insert, update, delete, desc, func

from models import *

logger = logging.getLogger(__name__)

class DatabaseManager:
    """
    Database manager for productive mining blockchain
    Handles all PostgreSQL operations using async patterns
    """
    
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL")
        if not self.database_url:
            raise ValueError("DATABASE_URL environment variable is required")
        
        self.database = Database(self.database_url)
        self.metadata = MetaData()
        
        # Define database tables
        self._define_tables()
        
        logger.info("🗄️ DATABASE: Manager initialized")
    
    def _define_tables(self):
        """Define database table schemas"""
        
        # Blocks table
        self.blocks_table = Table(
            'blocks', self.metadata,
            Column('id', Integer, primary_key=True),
            Column('index', Integer, nullable=False),
            Column('timestamp', DateTime, default=datetime.utcnow),
            Column('previous_hash', String(64), nullable=False),
            Column('merkle_root', String(64), nullable=False),
            Column('block_hash', String(64), nullable=False),
            Column('difficulty', Integer, nullable=False),
            Column('nonce', Integer, nullable=False),
            Column('total_scientific_value', Float, nullable=False),
            Column('miner_id', String(255), nullable=False),
            Column('energy_consumed', Float, nullable=False),
            Column('knowledge_created', Integer, nullable=False)
        )
        
        # Mathematical work table
        self.mathematical_work_table = Table(
            'mathematical_work', self.metadata,
            Column('id', Integer, primary_key=True),
            Column('work_type', String(50), nullable=False),
            Column('difficulty', Integer, nullable=False),
            Column('result', JSON, nullable=False),
            Column('verification_data', JSON, nullable=False),
            Column('computational_cost', Float, nullable=False),
            Column('energy_efficiency', Float, nullable=False),
            Column('scientific_value', Float, nullable=False),
            Column('timestamp', DateTime, default=datetime.utcnow),
            Column('worker_id', String(255), nullable=False),
            Column('signature', String(64), nullable=False)
        )
        
        # Mining operations table
        self.mining_operations_table = Table(
            'mining_operations', self.metadata,
            Column('id', Integer, primary_key=True),
            Column('operation_type', String(50), nullable=False),
            Column('miner_id', String(255), nullable=False),
            Column('start_time', DateTime, default=datetime.utcnow),
            Column('estimated_completion', DateTime, nullable=False),
            Column('progress', Float, default=0.0),
            Column('current_result', JSON, nullable=False),
            Column('difficulty', Integer, nullable=False),
            Column('status', String(20), default='active')
        )
        
        # Network metrics table
        self.network_metrics_table = Table(
            'network_metrics', self.metadata,
            Column('id', Integer, primary_key=True),
            Column('timestamp', DateTime, default=datetime.utcnow),
            Column('active_miners', Integer, nullable=False),
            Column('blocks_per_hour', Float, nullable=False),
            Column('energy_efficiency', Float, nullable=False),
            Column('scientific_value_generated', Float, nullable=False),
            Column('average_block_time', Float, nullable=False),
            Column('network_hashrate', Float, nullable=False),
            Column('total_knowledge_created', Integer, nullable=False)
        )
    
    async def initialize(self):
        """Initialize database connection and create tables"""
        try:
            await self.database.connect()
            
            # Create tables using asyncpg directly
            async with self.database.transaction():
                await self._create_tables()
            
            logger.info("✅ DATABASE: Connected and tables created")
            
        except Exception as e:
            logger.error(f"❌ DATABASE: Initialization failed: {e}")
            raise
    
    async def _create_tables(self):
        """Create database tables if they don't exist"""
        
        # Create blocks table
        await self.database.execute("""
            CREATE TABLE IF NOT EXISTS blocks (
                id SERIAL PRIMARY KEY,
                index INTEGER NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                previous_hash VARCHAR(64) NOT NULL,
                merkle_root VARCHAR(64) NOT NULL,
                block_hash VARCHAR(64) NOT NULL,
                difficulty INTEGER NOT NULL,
                nonce INTEGER NOT NULL,
                total_scientific_value FLOAT NOT NULL,
                miner_id VARCHAR(255) NOT NULL,
                energy_consumed FLOAT NOT NULL,
                knowledge_created INTEGER NOT NULL
            )
        """)
        
        # Create mathematical work table
        await self.database.execute("""
            CREATE TABLE IF NOT EXISTS mathematical_work (
                id SERIAL PRIMARY KEY,
                work_type VARCHAR(50) NOT NULL,
                difficulty INTEGER NOT NULL,
                result JSONB NOT NULL,
                verification_data JSONB NOT NULL,
                computational_cost FLOAT NOT NULL,
                energy_efficiency FLOAT NOT NULL,
                scientific_value FLOAT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                worker_id VARCHAR(255) NOT NULL,
                signature VARCHAR(64) NOT NULL
            )
        """)
        
        # Create mining operations table
        await self.database.execute("""
            CREATE TABLE IF NOT EXISTS mining_operations (
                id SERIAL PRIMARY KEY,
                operation_type VARCHAR(50) NOT NULL,
                miner_id VARCHAR(255) NOT NULL,
                start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estimated_completion TIMESTAMP NOT NULL,
                progress FLOAT DEFAULT 0.0,
                current_result JSONB NOT NULL,
                difficulty INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'active'
            )
        """)
        
        # Create network metrics table
        await self.database.execute("""
            CREATE TABLE IF NOT EXISTS network_metrics (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                active_miners INTEGER NOT NULL,
                blocks_per_hour FLOAT NOT NULL,
                energy_efficiency FLOAT NOT NULL,
                scientific_value_generated FLOAT NOT NULL,
                average_block_time FLOAT NOT NULL,
                network_hashrate FLOAT NOT NULL,
                total_knowledge_created INTEGER NOT NULL
            )
        """)
        
        logger.info("📊 DATABASE: Tables created successfully")
    
    # ===== BLOCK OPERATIONS =====
    
    async def create_block(
        self, 
        index: int,
        previous_hash: str,
        merkle_root: str,
        difficulty: int,
        total_scientific_value: float,
        miner_id: str,
        energy_consumed: float,
        knowledge_created: int
    ) -> Dict[str, Any]:
        """Create a new block"""
        
        import hashlib
        nonce = hash(f"{index}{previous_hash}{merkle_root}") % 1000000
        block_hash = hashlib.sha256(f"{index}{previous_hash}{merkle_root}{nonce}".encode()).hexdigest()
        
        query = """
            INSERT INTO blocks (
                index, previous_hash, merkle_root, block_hash, difficulty, 
                nonce, total_scientific_value, miner_id, energy_consumed, knowledge_created
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        """
        
        result = await self.database.fetch_one(
            query, index, previous_hash, merkle_root, block_hash, difficulty,
            nonce, total_scientific_value, miner_id, energy_consumed, knowledge_created
        )
        
        logger.info(f"🔗 BLOCK CREATED: Block #{index} with {knowledge_created} discoveries")
        return dict(result)
    
    async def get_blocks(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get blockchain blocks"""
        query = "SELECT * FROM blocks ORDER BY index DESC LIMIT $1"
        results = await self.database.fetch_all(query, limit)
        return [dict(row) for row in results]
    
    async def get_block(self, block_id: int) -> Optional[Dict[str, Any]]:
        """Get specific block"""
        query = "SELECT * FROM blocks WHERE id = $1"
        result = await self.database.fetch_one(query, block_id)
        return dict(result) if result else None
    
    async def get_latest_block(self) -> Optional[Dict[str, Any]]:
        """Get the latest block"""
        query = "SELECT * FROM blocks ORDER BY index DESC LIMIT 1"
        result = await self.database.fetch_one(query)
        return dict(result) if result else None
    
    # ===== MATHEMATICAL WORK OPERATIONS =====
    
    async def create_mathematical_work(
        self,
        work_type: str,
        difficulty: int,
        result: Dict[str, Any],
        verification_data: Dict[str, Any],
        computational_cost: float,
        energy_efficiency: float,
        scientific_value: float,
        worker_id: str,
        signature: str
    ) -> Dict[str, Any]:
        """Create mathematical work record"""
        
        query = """
            INSERT INTO mathematical_work (
                work_type, difficulty, result, verification_data, computational_cost,
                energy_efficiency, scientific_value, worker_id, signature
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        """
        
        result_record = await self.database.fetch_one(
            query, work_type, difficulty, json.dumps(result), json.dumps(verification_data),
            computational_cost, energy_efficiency, scientific_value, worker_id, signature
        )
        
        logger.info(f"🔬 DISCOVERY: {work_type} worth ${scientific_value:.2f}")
        return dict(result_record)
    
    async def get_mathematical_work(self, limit: int = 1000) -> List[Dict[str, Any]]:
        """Get mathematical discoveries"""
        query = "SELECT * FROM mathematical_work ORDER BY timestamp DESC LIMIT $1"
        results = await self.database.fetch_all(query, limit)
        return [dict(row) for row in results]
    
    async def get_mathematical_work_by_id(self, discovery_id: int) -> Optional[Dict[str, Any]]:
        """Get specific mathematical discovery"""
        query = "SELECT * FROM mathematical_work WHERE id = $1"
        result = await self.database.fetch_one(query, discovery_id)
        return dict(result) if result else None
    
    # ===== MINING OPERATIONS =====
    
    async def create_mining_operation(
        self,
        operation_type: str,
        miner_id: str,
        estimated_completion: datetime,
        difficulty: int,
        current_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create mining operation"""
        
        query = """
            INSERT INTO mining_operations (
                operation_type, miner_id, estimated_completion, difficulty, current_result
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        """
        
        result = await self.database.fetch_one(
            query, operation_type, miner_id, estimated_completion, difficulty, json.dumps(current_result)
        )
        
        return dict(result)
    
    async def get_active_mining_operations(self) -> List[Dict[str, Any]]:
        """Get active mining operations"""
        query = "SELECT * FROM mining_operations WHERE status = 'active' ORDER BY start_time DESC"
        results = await self.database.fetch_all(query)
        return [dict(row) for row in results]
    
    async def update_mining_operation(self, operation_id: int, progress: float, current_result: Dict[str, Any]):
        """Update mining operation progress"""
        query = """
            UPDATE mining_operations 
            SET progress = $1, current_result = $2 
            WHERE id = $3
        """
        await self.database.execute(query, progress, json.dumps(current_result), operation_id)
    
    async def complete_mining_operation(self, operation_id: int):
        """Mark mining operation as completed"""
        query = "UPDATE mining_operations SET status = 'completed' WHERE id = $1"
        await self.database.execute(query, operation_id)
    
    # ===== NETWORK METRICS =====
    
    async def create_network_metrics(
        self,
        active_miners: int,
        blocks_per_hour: float,
        energy_efficiency: float,
        scientific_value_generated: float,
        average_block_time: float,
        network_hashrate: float,
        total_knowledge_created: int
    ) -> Dict[str, Any]:
        """Create network metrics record"""
        
        query = """
            INSERT INTO network_metrics (
                active_miners, blocks_per_hour, energy_efficiency, scientific_value_generated,
                average_block_time, network_hashrate, total_knowledge_created
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        """
        
        result = await self.database.fetch_one(
            query, active_miners, blocks_per_hour, energy_efficiency, scientific_value_generated,
            average_block_time, network_hashrate, total_knowledge_created
        )
        
        return dict(result)
    
    async def get_latest_metrics(self) -> Optional[Dict[str, Any]]:
        """Get latest network metrics"""
        query = "SELECT * FROM network_metrics ORDER BY timestamp DESC LIMIT 1"
        result = await self.database.fetch_one(query)
        return dict(result) if result else None
    
    # ===== UTILITY OPERATIONS =====
    
    async def clear_all_data(self):
        """Clear all blockchain data for restart"""
        try:
            await self.database.execute("DELETE FROM network_metrics")
            await self.database.execute("DELETE FROM mining_operations")
            await self.database.execute("DELETE FROM mathematical_work")
            await self.database.execute("DELETE FROM blocks")
            
            logger.info("🧹 DATABASE: All data cleared for blockchain restart")
            
        except Exception as e:
            logger.error(f"❌ DATABASE: Error clearing data: {e}")
            raise
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            block_count = await self.database.fetch_val("SELECT COUNT(*) FROM blocks")
            discovery_count = await self.database.fetch_val("SELECT COUNT(*) FROM mathematical_work")
            operation_count = await self.database.fetch_val("SELECT COUNT(*) FROM mining_operations")
            
            total_scientific_value = await self.database.fetch_val(
                "SELECT COALESCE(SUM(scientific_value), 0) FROM mathematical_work"
            )
            
            return {
                'total_blocks': block_count or 0,
                'total_discoveries': discovery_count or 0,
                'total_operations': operation_count or 0,
                'total_scientific_value': float(total_scientific_value or 0),
                'last_updated': datetime.now()
            }
            
        except Exception as e:
            logger.error(f"❌ DATABASE: Error getting statistics: {e}")
            return {
                'total_blocks': 0,
                'total_discoveries': 0,
                'total_operations': 0,
                'total_scientific_value': 0.0,
                'last_updated': datetime.now()
            }
    
    async def cleanup(self):
        """Cleanup database connections"""
        try:
            await self.database.disconnect()
            logger.info("🔌 DATABASE: Disconnected")
        except Exception as e:
            logger.error(f"❌ DATABASE: Cleanup error: {e}")