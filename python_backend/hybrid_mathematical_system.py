"""
Hybrid Mathematical System - Combining Simulation and Real Computation
Phase 1 Implementation: Progressive transition to real mathematical computation
"""

import logging
import random
from typing import Dict, Any, Optional
from datetime import datetime
from .mathematical_engines import MathematicalEngines
from .real_mathematical_engines import RealMathematicalEngines
from .scientific_valuation import ScientificValuationEngine

logger = logging.getLogger(__name__)

class HybridMathematicalSystem:
    """
    Hybrid system that intelligently routes between simulated and real computation
    Based on work type difficulty and computational tractability
    """
    
    def __init__(self):
        self.simulation_engine = MathematicalEngines()
        self.real_engine = RealMathematicalEngines()
        self.valuation_engine = ScientificValuationEngine()
        
        # Define which computations can be done realistically
        self.real_computation_types = {
            'goldbach_verification': True,
            'prime_gap_analysis': True, 
            'fibonacci_patterns': True,
            'collatz_verification': True
        }
        
        # Tractability thresholds for real computation
        self.tractability_thresholds = {
            'goldbach_verification': 200,    # Up to difficulty 200
            'prime_gap_analysis': 150,       # Up to difficulty 150  
            'fibonacci_patterns': 300,       # Up to difficulty 300
            'collatz_verification': 100      # Up to difficulty 100
        }
        
        logger.info("🔀 HYBRID SYSTEM: Initialized with real + simulated computation")
    
    def determine_computation_mode(self, work_type: str, difficulty: int) -> str:
        """
        Determine whether to use real computation or simulation
        Based on tractability and current capabilities
        """
        
        # Check if we have real implementation
        if work_type not in self.real_computation_types:
            return 'simulation'
        
        # Check difficulty threshold
        threshold = self.tractability_thresholds.get(work_type, 0)
        if difficulty > threshold:
            return 'simulation'
        
        # For lower difficulties, use real computation
        return 'real'
    
    def compute_mathematical_work(self, work_type: str, difficulty: int) -> Dict[str, Any]:
        """
        Main computation router - chooses between real and simulated computation
        """
        
        computation_mode = self.determine_computation_mode(work_type, difficulty)
        
        logger.info(f"🧮 HYBRID COMPUTATION: {work_type} (difficulty {difficulty}) -> {computation_mode}")
        
        try:
            if computation_mode == 'real':
                # Use real mathematical computation
                result = self.real_engine.compute_real_mathematics(work_type, difficulty)
                result['computationMode'] = 'real'
                result['verified'] = True
                
                # Apply scientific valuation to real results
                scientific_value = self.valuation_engine.calculate_scientific_value(
                    work_type, 
                    difficulty,
                    result.get('computationTime', 1.0),
                    result.get('energyConsumed', 0.1)
                )
                result['scientificValue'] = scientific_value
                
            else:
                # Fall back to simulation for intractable problems
                result = self.simulation_engine.compute_mathematical_work(work_type, difficulty)
                result['computationMode'] = 'simulation'
                result['verified'] = False  # Mark as simulated
                
                # Apply scientific valuation to simulated results
                scientific_value = self.valuation_engine.calculate_scientific_value(
                    work_type,
                    difficulty, 
                    result.get('computationTime', 1.0),
                    result.get('energyConsumed', 0.1)
                )
                result['scientificValue'] = scientific_value
            
            # Add hybrid system metadata
            result['hybridSystem'] = {
                'version': '1.0',
                'computationMode': computation_mode,
                'realComputationAvailable': work_type in self.real_computation_types,
                'tractabilityThreshold': self.tractability_thresholds.get(work_type, 0),
                'timestamp': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"❌ HYBRID COMPUTATION: Error in {work_type}: {e}")
            # Fallback to simulation on any error
            result = self.simulation_engine.compute_mathematical_work(work_type, difficulty)
            result['computationMode'] = 'simulation_fallback'
            result['error'] = str(e)
            return result
    
    def get_system_capabilities(self) -> Dict[str, Any]:
        """
        Return current system capabilities and statistics
        """
        
        real_types = list(self.real_computation_types.keys())
        simulated_types = self.simulation_engine.get_available_work_types()
        
        return {
            'realComputationTypes': real_types,
            'simulatedComputationTypes': simulated_types,
            'tractabilityThresholds': self.tractability_thresholds,
            'totalWorkTypes': len(set(real_types + simulated_types)),
            'realComputationRatio': len(real_types) / len(simulated_types),
            'hybridSystemVersion': '1.0',
            'capabilities': {
                'realMathematics': True,
                'simulatedComputation': True,
                'scientificValuation': True,
                'adaptiveTractability': True
            }
        }
    
    def verify_mathematical_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify mathematical results using independent computation
        Implements peer verification for blockchain consensus
        """
        
        work_type = result.get('workType')
        difficulty = result.get('difficulty')
        original_mode = result.get('computationMode')
        
        if not work_type or not difficulty:
            return {'verified': False, 'reason': 'Missing work type or difficulty'}
        
        try:
            # Re-compute using same or different method
            verification_result = self.compute_mathematical_work(work_type, difficulty)
            
            # Compare results based on computation mode
            if original_mode == 'real' and verification_result.get('computationMode') == 'real':
                # Both real computations - compare actual results
                verification_score = self._compare_real_results(result, verification_result)
            else:
                # At least one simulation - use statistical comparison
                verification_score = self._compare_statistical_results(result, verification_result)
            
            return {
                'verified': verification_score > 0.85,  # 85% similarity threshold
                'verificationScore': verification_score,
                'verificationMode': verification_result.get('computationMode'),
                'originalMode': original_mode,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ VERIFICATION: Error verifying {work_type}: {e}")
            return {'verified': False, 'reason': f'Verification error: {e}'}
    
    def _compare_real_results(self, result1: Dict[str, Any], result2: Dict[str, Any]) -> float:
        """Compare two real mathematical computation results"""
        
        # For real computations, results should be identical or very close
        work_type = result1.get('workType')
        
        if work_type == 'goldbach_verification':
            # Compare verification success rates
            rate1 = result1.get('computationResult', {}).get('successRate', 0)
            rate2 = result2.get('computationResult', {}).get('successRate', 0)
            return 1.0 - abs(rate1 - rate2)
            
        elif work_type == 'prime_gap_analysis':
            # Compare statistical properties
            avg1 = result1.get('computationResult', {}).get('averageGap', 0)
            avg2 = result2.get('computationResult', {}).get('averageGap', 0)
            if max(avg1, avg2) > 0:
                return 1.0 - abs(avg1 - avg2) / max(avg1, avg2)
            return 1.0
            
        elif work_type == 'fibonacci_patterns':
            # Compare golden ratio approximation
            ratio1 = result1.get('computationResult', {}).get('goldenRatioApproximation', 0)
            ratio2 = result2.get('computationResult', {}).get('goldenRatioApproximation', 0)
            if max(ratio1, ratio2) > 0:
                return 1.0 - abs(ratio1 - ratio2) / max(ratio1, ratio2)
            return 1.0
            
        elif work_type == 'collatz_verification':
            # Compare convergence rates
            conv1 = result1.get('computationResult', {}).get('convergenceRate', 0)
            conv2 = result2.get('computationResult', {}).get('convergenceRate', 0)
            return 1.0 - abs(conv1 - conv2)
        
        return 0.5  # Default moderate similarity
    
    def _compare_statistical_results(self, result1: Dict[str, Any], result2: Dict[str, Any]) -> float:
        """Compare results with statistical methods for simulated computations"""
        
        # For simulated results, compare general properties
        time1 = result1.get('computationTime', 1.0)
        time2 = result2.get('computationTime', 1.0)
        
        energy1 = result1.get('energyConsumed', 0.1)
        energy2 = result2.get('energyConsumed', 0.1)
        
        # Time similarity (should be within reasonable range)
        time_similarity = 1.0 - min(abs(time1 - time2) / max(time1, time2), 1.0)
        
        # Energy similarity  
        energy_similarity = 1.0 - min(abs(energy1 - energy2) / max(energy1, energy2), 1.0)
        
        # Average similarity score
        return (time_similarity + energy_similarity) / 2
    
    def get_available_work_types(self) -> list:
        """Get all available work types from both engines"""
        real_types = list(self.real_computation_types.keys())
        simulated_types = self.simulation_engine.get_available_work_types()
        
        # Combine and deduplicate
        all_types = list(set(real_types + simulated_types))
        return sorted(all_types)