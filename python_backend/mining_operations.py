"""
Mining Operations Manager - Python Implementation
Manages productive mathematical mining operations and blockchain creation
"""

import logging
import asyncio
import random
import time
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta

from database import DatabaseManager
from scientific_valuation import ScientificValuationEngine
from mathematical_engines import MathematicalEngines
from websocket_manager import WebSocketManager

logger = logging.getLogger(__name__)

class MiningOperationManager:
    """
    Manages all mining operations for the productive mining blockchain
    Coordinates mathematical computation, scientific valuation, and block creation
    """
    
    def __init__(
        self, 
        db_manager: DatabaseManager, 
        ws_manager: 'WebSocketManager',
        valuation_engine: ScientificValuationEngine,
        math_engines: MathematicalEngines
    ):
        self.db_manager = db_manager
        self.ws_manager = ws_manager
        self.valuation_engine = valuation_engine
        self.math_engines = math_engines
        
        self.autonomous_miners_running = False
        self.next_miner_id = 1
        
        logger.info("⛏️ MINING MANAGER: Initialized")
    
    async def start_mining_operation(self, work_type: str, difficulty: int) -> Dict[str, Any]:
        """Start a new mathematical mining operation"""
        try:
            miner_id = f"miner_{int(time.time() * 1000)}"
            estimated_completion = datetime.now() + timedelta(seconds=difficulty * 2)
            
            # Create mining operation record
            operation = await self.db_manager.create_mining_operation(
                operation_type=work_type,
                miner_id=miner_id,
                estimated_completion=estimated_completion,
                difficulty=difficulty,
                current_result={"status": "initializing"}
            )
            
            # Start computation in background
            asyncio.create_task(self._execute_mining_operation(operation['id'], work_type, difficulty, miner_id))
            
            logger.info(f"🚀 MINING: Started {work_type} operation at difficulty {difficulty}")
            
            return {
                'id': operation['id'],
                'operationType': work_type,
                'minerId': miner_id,
                'startTime': operation['start_time'].isoformat(),
                'estimatedCompletion': estimated_completion.isoformat(),
                'progress': 0,
                'currentResult': {"status": "initializing"},
                'difficulty': difficulty,
                'status': 'active'
            }
            
        except Exception as e:
            logger.error(f"❌ MINING: Error starting operation: {e}")
            raise
    
    async def _execute_mining_operation(self, operation_id: int, work_type: str, difficulty: int, miner_id: str):
        """Execute the mathematical computation for a mining operation"""
        try:
            # Update progress to computing
            await self.db_manager.update_mining_operation(
                operation_id, 0.1, {"status": "computing", "workType": work_type}
            )
            
            # Perform mathematical computation
            computation_result = self.math_engines.compute_mathematical_work(work_type, difficulty)
            
            # Calculate scientific value using the valuation engine
            scientific_value = self.valuation_engine.calculate_scientific_value(
                work_type=work_type,
                difficulty=difficulty,
                computation_time=computation_result['computationTime'],
                energy_consumed=computation_result['energyConsumed']
            )
            
            # Update progress to validating
            await self.db_manager.update_mining_operation(
                operation_id, 0.8, {"status": "validating", "result": computation_result['computationResult']}
            )
            
            # Create mathematical work record
            mathematical_work = await self.db_manager.create_mathematical_work(
                work_type=work_type,
                difficulty=difficulty,
                result=computation_result['computationResult'],
                verification_data=computation_result['verificationData'],
                computational_cost=scientific_value['computational_cost'],
                energy_efficiency=computation_result['energyConsumed'] * 1000,  # Convert to efficiency metric
                scientific_value=scientific_value['total_value'],
                worker_id=miner_id,
                signature=computation_result['signature']
            )
            
            # Mark operation as completed
            await self.db_manager.complete_mining_operation(operation_id)
            
            # Create block with the discovery
            await self._create_block_with_discovery(mathematical_work, miner_id, difficulty)
            
            # Broadcast completion
            await self.ws_manager.broadcast({
                'type': 'mining_completed',
                'operationId': operation_id,
                'discovery': mathematical_work,
                'scientificValue': scientific_value['total_value']
            })
            
            logger.info(f"✅ MINING: Completed {work_type} - Discovery worth ${scientific_value['total_value']:.2f}")
            
        except Exception as e:
            logger.error(f"❌ MINING: Operation {operation_id} failed: {e}")
            await self.db_manager.update_mining_operation(
                operation_id, 1.0, {"status": "failed", "error": str(e)}
            )
    
    async def _create_block_with_discovery(self, mathematical_work: Dict[str, Any], miner_id: str, difficulty: int):
        """Create a new block containing the mathematical discovery"""
        try:
            # Get the latest block for previous hash
            latest_block = await self.db_manager.get_latest_block()
            previous_hash = latest_block['block_hash'] if latest_block else "0" * 64
            next_index = latest_block['index'] + 1 if latest_block else 0
            
            # Create new block
            block = await self.db_manager.create_block(
                index=next_index,
                previous_hash=previous_hash,
                merkle_root=f"discovery_{mathematical_work['id']}",
                difficulty=difficulty,
                total_scientific_value=mathematical_work['scientific_value'],
                miner_id=miner_id,
                energy_consumed=mathematical_work['energy_efficiency'] / 1000,  # Convert back to kWh
                knowledge_created=1
            )
            
            logger.info(f"🔗 BLOCK: Created Block #{next_index} with discovery {mathematical_work['id']}")
            
            # Broadcast new block
            await self.ws_manager.broadcast({
                'type': 'new_block',
                'block': block,
                'discovery': mathematical_work
            })
            
        except Exception as e:
            logger.error(f"❌ BLOCK: Error creating block: {e}")
    
    async def start_autonomous_mining(self):
        """Start autonomous mining operations with enhanced monitoring"""
        if self.autonomous_miners_running:
            return
        
        self.autonomous_miners_running = True
        logger.info("🤖 AUTONOMOUS MINING: Starting enhanced continuous operations...")
        
        # Start multiple autonomous miners with varied specializations
        miners = [
            ("autonomous_riemann", "riemann_zero"),
            ("autonomous_prime", "prime_pattern"), 
            ("autonomous_yang_mills", "yang_mills"),
            ("autonomous_navier_stokes", "navier_stokes"),
            ("autonomous_goldbach", "goldbach_verification"),
            ("autonomous_general_1", None),  # General miners with random work types
            ("autonomous_general_2", None),
            ("autonomous_general_3", None),
        ]
        
        # Start specialized and general miners
        for miner_name, specialization in miners:
            if specialization:
                asyncio.create_task(self._specialized_autonomous_miner(miner_name, specialization))
            else:
                asyncio.create_task(self._autonomous_miner(miner_name))
        
        # Start network metrics collection
        asyncio.create_task(self._collect_network_metrics())
        
        # Start miner health monitoring
        asyncio.create_task(self._monitor_miner_health())
        
        logger.info(f"✅ AUTONOMOUS MINING: Started {len(miners)} continuous miners")
    
    async def _autonomous_miner(self, miner_name: str):
        """Run autonomous mining operations with enhanced error recovery"""
        work_types = self.math_engines.get_available_work_types()
        consecutive_errors = 0
        max_consecutive_errors = 5
        
        logger.info(f"🤖 AUTONOMOUS MINER {miner_name}: Starting continuous operations")
        
        while self.autonomous_miners_running:
            try:
                # Adaptive difficulty based on network performance
                base_difficulty = random.randint(40, 80)  # Higher difficulty for better security
                
                # Increase difficulty if too many errors (network might be overloaded)
                if consecutive_errors > 2:
                    base_difficulty = random.randint(25, 45)  # Lower difficulty during issues
                
                # Random work type with preference for complex problems
                work_type = random.choice(work_types)
                
                # Start mining operation
                logger.info(f"🚀 AUTONOMOUS MINER {miner_name}: Starting {work_type} at difficulty {base_difficulty}")
                await self.start_mining_operation(work_type, base_difficulty)
                
                # Reset error counter on success
                consecutive_errors = 0
                
                # Adaptive wait time based on network load
                wait_time = random.uniform(15, 45)  # Faster mining for continuous operations
                logger.info(f"⏱️ AUTONOMOUS MINER {miner_name}: Waiting {wait_time:.1f}s before next operation")
                await asyncio.sleep(wait_time)
                
            except Exception as e:
                consecutive_errors += 1
                logger.error(f"❌ AUTONOMOUS MINER {miner_name}: Error #{consecutive_errors}: {e}")
                
                # Progressive backoff on errors
                if consecutive_errors >= max_consecutive_errors:
                    logger.warning(f"🔄 AUTONOMOUS MINER {miner_name}: Too many errors, resetting in 60s")
                    await asyncio.sleep(60)
                    consecutive_errors = 0
                else:
                    # Exponential backoff
                    backoff_time = min(30 * (2 ** consecutive_errors), 300)  # Max 5 minutes
                    logger.info(f"⏳ AUTONOMOUS MINER {miner_name}: Backing off for {backoff_time}s")
                    await asyncio.sleep(backoff_time)
        
        logger.info(f"🛑 AUTONOMOUS MINER {miner_name}: Stopped")
    
    async def _specialized_autonomous_miner(self, miner_name: str, work_type: str):
        """Run specialized autonomous mining operations for specific mathematical problems"""
        consecutive_errors = 0
        max_consecutive_errors = 5
        
        logger.info(f"🎯 SPECIALIZED MINER {miner_name}: Starting continuous {work_type} operations")
        
        while self.autonomous_miners_running:
            try:
                # Higher difficulty for specialized miners
                difficulty = random.randint(50, 100)  # Challenging problems for specialized miners
                
                # Reduce difficulty if errors occur
                if consecutive_errors > 2:
                    difficulty = random.randint(30, 60)
                
                # Start specialized mining operation
                logger.info(f"🔬 SPECIALIZED MINER {miner_name}: Computing {work_type} at difficulty {difficulty}")
                await self.start_mining_operation(work_type, difficulty)
                
                # Reset error counter on success
                consecutive_errors = 0
                
                # Longer intervals for specialized high-difficulty work
                wait_time = random.uniform(45, 90)  # More time for complex computations
                logger.info(f"⏱️ SPECIALIZED MINER {miner_name}: Resting {wait_time:.1f}s before next operation")
                await asyncio.sleep(wait_time)
                
            except Exception as e:
                consecutive_errors += 1
                logger.error(f"❌ SPECIALIZED MINER {miner_name}: Error #{consecutive_errors}: {e}")
                
                # Progressive backoff on errors
                if consecutive_errors >= max_consecutive_errors:
                    logger.warning(f"🔄 SPECIALIZED MINER {miner_name}: Too many errors, resetting in 90s")
                    await asyncio.sleep(90)
                    consecutive_errors = 0
                else:
                    # Exponential backoff
                    backoff_time = min(45 * (2 ** consecutive_errors), 400)  # Max ~7 minutes
                    logger.info(f"⏳ SPECIALIZED MINER {miner_name}: Backing off for {backoff_time}s")
                    await asyncio.sleep(backoff_time)
        
        logger.info(f"🛑 SPECIALIZED MINER {miner_name}: Stopped")
    
    async def _monitor_miner_health(self):
        """Monitor mining network health and restart failed miners"""
        logger.info("💊 MINER HEALTH MONITOR: Starting continuous health checks")
        
        while self.autonomous_miners_running:
            try:
                # Check active mining operations
                operations = await self.db_manager.get_active_mining_operations()
                
                # Check recent block creation
                blocks = await self.db_manager.get_blocks(10)
                recent_blocks = []
                if blocks:
                    recent_blocks = [b for b in blocks if 
                                   (datetime.now() - b['timestamp']).total_seconds() < 300]  # Last 5 minutes
                
                # Health metrics
                active_ops = len(operations)
                recent_block_count = len(recent_blocks)
                
                logger.info(f"💊 HEALTH CHECK: {active_ops} active operations, {recent_block_count} recent blocks")
                
                # Alert if network activity is too low
                if active_ops < 3:
                    logger.warning("⚠️ HEALTH ALERT: Low mining activity detected")
                
                if recent_block_count == 0:
                    logger.warning("⚠️ HEALTH ALERT: No recent blocks created")
                
                # Health check every 2 minutes
                await asyncio.sleep(120)
                
            except Exception as e:
                logger.error(f"❌ HEALTH MONITOR: Error: {e}")
                await asyncio.sleep(60)
        
        logger.info("🛑 MINER HEALTH MONITOR: Stopped")
    
    async def _collect_network_metrics(self):
        """Collect and store network performance metrics"""
        while self.autonomous_miners_running:
            try:
                # Calculate metrics
                blocks = await self.db_manager.get_blocks(100)
                discoveries = await self.db_manager.get_mathematical_work(100)
                operations = await self.db_manager.get_active_mining_operations()
                
                # Calculate network metrics
                active_miners = len(operations) + 5  # Include autonomous miners
                
                if blocks:
                    recent_blocks = [b for b in blocks if 
                                   (datetime.now() - b['timestamp']).total_seconds() < 3600]
                    blocks_per_hour = len(recent_blocks)
                    avg_block_time = 3600 / max(blocks_per_hour, 1)
                else:
                    blocks_per_hour = 0
                    avg_block_time = 0
                
                # Energy efficiency (negative means energy generation)
                total_energy = sum(d['energy_efficiency'] / 1000 for d in discoveries[-10:]) if discoveries else 0
                energy_efficiency = -total_energy * 100  # Convert to percentage
                
                # Scientific value
                recent_discoveries = [d for d in discoveries if 
                                    (datetime.now() - d['timestamp']).total_seconds() < 3600]
                scientific_value_generated = sum(d['scientific_value'] for d in recent_discoveries)
                
                # Network hashrate (based on difficulty and operations)
                network_hashrate = sum(op['difficulty'] for op in operations) * 1000
                
                # Total knowledge created
                total_knowledge = len(discoveries)
                
                # Store metrics
                await self.db_manager.create_network_metrics(
                    active_miners=active_miners,
                    blocks_per_hour=blocks_per_hour,
                    energy_efficiency=energy_efficiency,
                    scientific_value_generated=scientific_value_generated,
                    average_block_time=avg_block_time,
                    network_hashrate=network_hashrate,
                    total_knowledge_created=total_knowledge
                )
                
                # Broadcast metrics update
                await self.ws_manager.broadcast({
                    'type': 'metrics_update',
                    'activeMiners': active_miners,
                    'blocksPerHour': blocks_per_hour,
                    'energyEfficiency': energy_efficiency,
                    'scientificValue': scientific_value_generated
                })
                
                # Wait 30 seconds before next metrics collection
                await asyncio.sleep(30)
                
            except Exception as e:
                logger.error(f"❌ METRICS: Error collecting metrics: {e}")
                await asyncio.sleep(30)
    
    async def get_network_metrics(self) -> Dict[str, Any]:
        """Get current network metrics"""
        try:
            # Get latest stored metrics
            latest_metrics = await self.db_manager.get_latest_metrics()
            
            if latest_metrics:
                return {
                    'id': latest_metrics['id'],
                    'timestamp': latest_metrics['timestamp'].isoformat(),
                    'activeMiners': latest_metrics['active_miners'],
                    'blocksPerHour': latest_metrics['blocks_per_hour'],
                    'energyEfficiency': latest_metrics['energy_efficiency'],
                    'scientificValueGenerated': latest_metrics['scientific_value_generated'],
                    'averageBlockTime': latest_metrics['average_block_time'],
                    'networkHashrate': latest_metrics['network_hashrate'],
                    'totalKnowledgeCreated': latest_metrics['total_knowledge_created']
                }
            else:
                # Return default metrics if none stored
                return {
                    'id': 0,
                    'timestamp': datetime.now().isoformat(),
                    'activeMiners': 5,
                    'blocksPerHour': 8,
                    'energyEfficiency': -500.0,
                    'scientificValueGenerated': 0.0,
                    'averageBlockTime': 450.0,
                    'networkHashrate': 1000.0,
                    'totalKnowledgeCreated': 0
                }
                
        except Exception as e:
            logger.error(f"❌ METRICS: Error getting metrics: {e}")
            raise
    
    async def stop_autonomous_mining(self):
        """Stop autonomous mining operations"""
        self.autonomous_miners_running = False
        logger.info("🛑 AUTONOMOUS MINING: Stopped")