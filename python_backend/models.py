"""
Pydantic models for the Productive Mining Blockchain Platform
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

# ===== REQUEST MODELS =====

class MiningRequest(BaseModel):
    workType: str = Field(..., description="Type of mathematical work to perform")
    difficulty: int = Field(..., ge=1, le=1000, description="Mining difficulty (1-1000)")

class BlockchainRestartRequest(BaseModel):
    confirm: bool = Field(default=True, description="Confirmation to restart blockchain")

# ===== RESPONSE MODELS =====

class Block(BaseModel):
    id: int
    index: int
    timestamp: datetime
    previous_hash: str
    merkle_root: str
    block_hash: str
    difficulty: int
    nonce: int
    total_scientific_value: float
    miner_id: str
    energy_consumed: float
    knowledge_created: int
    
class MathematicalWork(BaseModel):
    id: int
    work_type: str
    difficulty: int
    result: Dict[str, Any]
    verification_data: Dict[str, Any]
    computational_cost: float
    energy_efficiency: float
    scientific_value: float
    timestamp: datetime
    worker_id: str
    signature: str

class MiningOperation(BaseModel):
    id: int
    operation_type: str
    miner_id: str
    start_time: datetime
    estimated_completion: datetime
    progress: float
    current_result: Dict[str, Any]
    difficulty: int
    status: str

class NetworkMetrics(BaseModel):
    id: int
    timestamp: datetime
    active_miners: int
    blocks_per_hour: float
    energy_efficiency: float
    scientific_value_generated: float
    average_block_time: float
    network_hashrate: float
    total_knowledge_created: int

class ScientificValuation(BaseModel):
    work_type: str
    base_value: float
    computational_cost: float
    research_impact: float
    total_value: float
    methodology: str

class AdaptiveSecurityStatus(BaseModel):
    current_iteration: int
    last_iteration: datetime
    security_score: float
    active_protocols: int
    threat_level: str

class RecursiveEnhancementStatus(BaseModel):
    current_generation: int
    active_algorithms: int
    quantum_coherence: float
    enhancement_cycles: int
    performance_improvement: float

# ===== ENUMS =====

class WorkType(str, Enum):
    RIEMANN_ZERO = "riemann_zero"
    PRIME_PATTERN = "prime_pattern"
    YANG_MILLS = "yang_mills"
    NAVIER_STOKES = "navier_stokes"
    GOLDBACH_VERIFICATION = "goldbach_verification"
    BIRCH_SWINNERTON_DYER = "birch_swinnerton_dyer"
    ELLIPTIC_CURVE_CRYPTO = "elliptic_curve_crypto"
    LATTICE_CRYPTO = "lattice_crypto"
    POINCARE_CONJECTURE = "poincare_conjecture"

class MiningStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"
    PENDING = "pending"

class SecurityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    POST_QUANTUM = "post_quantum"

# ===== DATABASE MODELS =====

class DatabaseBlock(BaseModel):
    """Database representation of a block"""
    id: Optional[int] = None
    index: int
    timestamp: datetime
    previous_hash: str
    merkle_root: str
    block_hash: str
    difficulty: int
    nonce: int
    total_scientific_value: float
    miner_id: str
    energy_consumed: float
    knowledge_created: int

class DatabaseMathematicalWork(BaseModel):
    """Database representation of mathematical work"""
    id: Optional[int] = None
    work_type: str
    difficulty: int
    result: Dict[str, Any]
    verification_data: Dict[str, Any]
    computational_cost: float
    energy_efficiency: float
    scientific_value: float
    timestamp: datetime
    worker_id: str
    signature: str

class DatabaseMiningOperation(BaseModel):
    """Database representation of mining operation"""
    id: Optional[int] = None
    operation_type: str
    miner_id: str
    start_time: datetime
    estimated_completion: datetime
    progress: float
    current_result: Dict[str, Any]
    difficulty: int
    status: str