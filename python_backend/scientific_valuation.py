"""
Scientific Valuation Engine - Python Implementation
Calculates realistic scientific value for mathematical discoveries ($1.2K-$3.5K range)
"""

import logging
from typing import Dict, Any
import math

logger = logging.getLogger(__name__)

class ScientificValuationEngine:
    """
    Engine for calculating realistic scientific valuations based on:
    - Research grant equivalents ($1.2K-$3.5K target range)
    - Computational complexity and cost
    - Theoretical and practical significance
    """
    
    def __init__(self):
        # Base research values (significantly reduced for realism)
        self.base_research_values = {
            'riemann_zero': 800,      # Riemann Hypothesis research
            'prime_pattern': 600,     # Prime number theory
            'yang_mills': 1200,       # Quantum field theory (highest base)
            'navier_stokes': 900,     # Fluid dynamics research
            'goldbach_verification': 500,  # Number theory verification
            'birch_swinnerton_dyer': 700,  # Elliptic curve research
            'elliptic_curve_crypto': 800,  # Cryptography research
            'lattice_crypto': 750,    # Post-quantum cryptography
            'poincare_conjecture': 1000   # Topology research
        }
        
        # Research impact factors (reduced by 75% for realism)
        self.research_impact_factors = {
            'yang_mills': 300,        # High theoretical impact
            'riemann_zero': 200,      # Famous conjecture
            'poincare_conjecture': 250,  # Topology breakthrough
            'prime_pattern': 150,     # Number theory advancement
            'navier_stokes': 180,     # Engineering applications
            'goldbach_verification': 100,  # Mathematical verification
            'birch_swinnerton_dyer': 160,   # Advanced mathematics
            'elliptic_curve_crypto': 170,   # Cryptographic security
            'lattice_crypto': 140     # Post-quantum security
        }
        
        # Maximum difficulty scaling (capped at 1.5x for realism)
        self.max_difficulty_multiplier = 1.5
        
        logger.info("🔬 SCIENTIFIC VALUATION: Engine initialized with realistic values")
    
    def calculate_scientific_value(
        self, 
        work_type: str, 
        difficulty: int, 
        computation_time: float, 
        energy_consumed: float
    ) -> Dict[str, Any]:
        """
        Calculate realistic scientific value for mathematical work
        
        Args:
            work_type: Type of mathematical work
            difficulty: Mining difficulty (1-1000)
            computation_time: Time spent computing (seconds)
            energy_consumed: Energy consumed (kWh)
            
        Returns:
            Dictionary with valuation breakdown
        """
        try:
            # Get base values
            base_value = self.base_research_values.get(work_type, 600)
            research_impact = self.research_impact_factors.get(work_type, 150)
            
            # Calculate computational cost (very small values)
            computational_cost = self._calculate_computational_cost(
                computation_time, energy_consumed
            )
            
            # Calculate difficulty scaling (max 1.5x multiplier)
            difficulty_multiplier = min(
                1.0 + (difficulty / 1000) * 0.5,  # Max 1.5x at difficulty 1000
                self.max_difficulty_multiplier
            )
            
            # Calculate total value with realistic scaling
            total_value = (
                base_value + 
                (research_impact * difficulty_multiplier) + 
                computational_cost
            )
            
            # Ensure value stays within realistic bounds ($1.2K-$3.5K)
            total_value = max(1200, min(total_value, 3500))
            
            result = {
                'base_value': round(base_value, 2),
                'computational_cost': round(computational_cost, 2),
                'research_impact': round(research_impact * difficulty_multiplier, 2),
                'total_value': round(total_value, 2),
                'methodology': f"Research grant equivalent for {work_type} at difficulty {difficulty}",
                'difficulty_multiplier': round(difficulty_multiplier, 3),
                'value_bounds': {'min': 1200, 'max': 3500}
            }
            
            logger.debug(f"💰 VALUATION: {work_type} = ${total_value:.2f} (base: ${base_value}, impact: {research_impact * difficulty_multiplier:.2f})")
            
            return result
            
        except Exception as e:
            logger.error(f"Error calculating scientific value: {e}")
            # Return minimum realistic value on error
            return {
                'base_value': 1200,
                'computational_cost': 50,
                'research_impact': 150,
                'total_value': 1200,
                'methodology': f"Fallback valuation for {work_type}",
                'error': str(e)
            }
    
    def _calculate_computational_cost(self, computation_time: float, energy_consumed: float) -> float:
        """Calculate computational cost in dollars"""
        # Cloud computing cost: ~$0.10/hour + energy cost
        computation_cost = (computation_time / 3600) * 0.10  # Convert seconds to hours
        energy_cost = energy_consumed * 0.15  # $0.15 per kWh
        
        total_cost = computation_cost + energy_cost
        return min(total_cost * 100, 200)  # Scale up slightly, cap at $200
    
    def get_work_type_info(self, work_type: str) -> Dict[str, Any]:
        """Get information about a specific work type"""
        return {
            'work_type': work_type,
            'base_value': self.base_research_values.get(work_type, 600),
            'research_impact': self.research_impact_factors.get(work_type, 150),
            'description': self._get_work_type_description(work_type)
        }
    
    def _get_work_type_description(self, work_type: str) -> str:
        """Get human-readable description of work type"""
        descriptions = {
            'riemann_zero': "Computing zeros of the Riemann zeta function",
            'prime_pattern': "Discovering patterns in prime number distributions",
            'yang_mills': "Validating Yang-Mills field equations",
            'navier_stokes': "Solving fluid dynamics problems",
            'goldbach_verification': "Verifying Goldbach conjecture instances",
            'birch_swinnerton_dyer': "Computing elliptic curve L-functions",
            'elliptic_curve_crypto': "Advancing elliptic curve cryptography",
            'lattice_crypto': "Developing lattice-based cryptographic schemes",
            'poincare_conjecture': "Topology and geometric analysis"
        }
        return descriptions.get(work_type, f"Mathematical research in {work_type}")
    
    def validate_scientific_value(self, scientific_value: float) -> bool:
        """Validate that a scientific value is within realistic bounds"""
        return 1200 <= scientific_value <= 3500
    
    def get_valuation_statistics(self) -> Dict[str, Any]:
        """Get statistics about the valuation system"""
        return {
            'value_range': {'min': 1200, 'max': 3500},
            'base_values': self.base_research_values,
            'research_impacts': self.research_impact_factors,
            'max_difficulty_multiplier': self.max_difficulty_multiplier,
            'methodology': "Research grant equivalents with realistic computational costs"
        }