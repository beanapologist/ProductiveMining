#!/usr/bin/env python3
"""
Productive Mining Blockchain Platform - Python Backend
Revolutionary blockchain that replaces wasteful proof-of-work with productive mathematical computation
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from database import DatabaseManager
from models import *
from scientific_valuation import ScientificValuationEngine
from mathematical_engines import MathematicalEngines
from mining_operations import MiningOperationManager
from adaptive_security import AdaptiveSecurityEngine
from recursive_enhancement import RecursiveEnhancementEngine
from websocket_manager import WebSocketManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global managers
db_manager: DatabaseManager = None
ws_manager: WebSocketManager = None
mining_manager: MiningOperationManager = None
valuation_engine: ScientificValuationEngine = None
math_engines: MathematicalEngines = None
adaptive_security: AdaptiveSecurityEngine = None
recursive_enhancement: RecursiveEnhancementEngine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup resources"""
    global db_manager, ws_manager, mining_manager, valuation_engine, math_engines
    global adaptive_security, recursive_enhancement
    
    # Initialize components
    logger.info("🐍 PYTHON BACKEND: Initializing productive mining platform...")
    
    db_manager = DatabaseManager()
    await db_manager.initialize()
    
    ws_manager = WebSocketManager()
    valuation_engine = ScientificValuationEngine()
    math_engines = MathematicalEngines()
    mining_manager = MiningOperationManager(db_manager, ws_manager, valuation_engine, math_engines)
    adaptive_security = AdaptiveSecurityEngine()
    recursive_enhancement = RecursiveEnhancementEngine()
    
    # Start background tasks
    logger.info("🔬 ENGINES: Starting quantum enhancement and adaptive security...")
    asyncio.create_task(recursive_enhancement.start_enhancement_cycle())
    asyncio.create_task(adaptive_security.start_security_cycle())
    asyncio.create_task(mining_manager.start_autonomous_mining())
    
    logger.info("✅ PYTHON BACKEND: Productive mining platform initialized")
    
    yield
    
    # Cleanup
    logger.info("🛑 PYTHON BACKEND: Shutting down...")
    await db_manager.cleanup()

# Initialize FastAPI app
app = FastAPI(
    title="Productive Mining Blockchain",
    description="Revolutionary blockchain platform using mathematical computation instead of wasteful proof-of-work",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== BLOCKCHAIN ENDPOINTS =====

@app.get("/api/blocks")
async def get_blocks(limit: int = 100):
    """Get blockchain blocks"""
    try:
        blocks = await db_manager.get_blocks(limit)
        return blocks
    except Exception as e:
        logger.error(f"Error fetching blocks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blocks")

@app.get("/api/blocks/{block_id}")
async def get_block(block_id: int):
    """Get specific block"""
    try:
        block = await db_manager.get_block(block_id)
        if not block:
            raise HTTPException(status_code=404, detail="Block not found")
        return block
    except Exception as e:
        logger.error(f"Error fetching block {block_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch block")

@app.get("/api/discoveries")
async def get_discoveries(limit: int = 1000):
    """Get mathematical discoveries"""
    try:
        discoveries = await db_manager.get_mathematical_work(limit)
        return discoveries
    except Exception as e:
        logger.error(f"Error fetching discoveries: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch discoveries")

@app.get("/api/discoveries/{discovery_id}")
async def get_discovery(discovery_id: int):
    """Get specific mathematical discovery"""
    try:
        discovery = await db_manager.get_mathematical_work_by_id(discovery_id)
        if not discovery:
            raise HTTPException(status_code=404, detail="Discovery not found")
        return discovery
    except Exception as e:
        logger.error(f"Error fetching discovery {discovery_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch discovery")

# ===== MINING OPERATIONS =====

@app.get("/api/mining/operations")
async def get_mining_operations():
    """Get active mining operations"""
    try:
        operations = await db_manager.get_active_mining_operations()
        return operations
    except Exception as e:
        logger.error(f"Error fetching mining operations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch mining operations")

@app.post("/api/mining/start-real")
async def start_mining_operation(request: MiningRequest):
    """Start a new mining operation"""
    try:
        operation = await mining_manager.start_mining_operation(
            work_type=request.workType,
            difficulty=request.difficulty
        )
        return operation
    except Exception as e:
        logger.error(f"Error starting mining operation: {e}")
        raise HTTPException(status_code=500, detail="Failed to start mining operation")

# ===== NETWORK METRICS =====

@app.get("/api/metrics")
async def get_network_metrics():
    """Get network performance metrics"""
    try:
        metrics = await mining_manager.get_network_metrics()
        return metrics
    except Exception as e:
        logger.error(f"Error fetching metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch metrics")

# ===== SCIENTIFIC VALUATION =====

@app.get("/api/scientific-valuation/test")
async def test_scientific_valuation():
    """Test scientific valuation engine with sample calculations"""
    try:
        work_types = [
            'riemann_zero', 'prime_pattern', 'yang_mills', 'navier_stokes',
            'goldbach_verification', 'birch_swinnerton_dyer', 'elliptic_curve_crypto',
            'lattice_crypto', 'poincare_conjecture'
        ]
        
        sample_valuations = []
        for work_type in work_types:
            valuation = valuation_engine.calculate_scientific_value(
                work_type=work_type,
                difficulty=30,
                computation_time=0.5,
                energy_consumed=0.08
            )
            sample_valuations.append({
                'workType': work_type,
                'baseValue': valuation['base_value'],
                'computationalCost': valuation['computational_cost'],
                'researchImpact': valuation['research_impact'],
                'totalValue': valuation['total_value'],
                'methodology': valuation['methodology']
            })
        
        return {
            'sampleValuations': sample_valuations,
            'valuationExplanation': {
                'baseValues': "Research grant equivalents ($1.2K-$3.5K) - realistic scientific valuations",
                'computationalCosts': "Small cloud computing + energy costs (0.05-0.15 kWh)",
                'researchImpact': "Based on theoretical and practical significance with realistic multipliers",
                'maxSingleDiscovery': "$3.5K (realistic maximum)",
                'minSingleDiscovery': "$1.2K (realistic minimum)"
            }
        }
    except Exception as e:
        logger.error(f"Error in scientific valuation test: {e}")
        raise HTTPException(status_code=500, detail="Failed to test scientific valuation")

# ===== WEBSOCKET ENDPOINTS =====

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            # Echo back for now
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5001,
        reload=True,
        log_level="info"
    )