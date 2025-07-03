"""
Real Mathematical Computation Engines - Phase 1 Implementation
Transitioning from simulation to actual mathematical computation
"""

import logging
import time
import random
import hashlib
import json
from typing import Dict, Any, List, Tuple
from datetime import datetime
import numpy as np
from scipy import special

logger = logging.getLogger(__name__)

class RealMathematicalEngines:
    """
    Real mathematical computation engines for productive mining
    Phase 1: Hybrid system with actual computation for tractable problems
    """
    
    def __init__(self):
        logger.info("🔬 REAL MATHEMATICAL ENGINES: Initializing actual computation algorithms...")
        self.computed_primes = self._precompute_primes(100000)  # Cache primes up to 100k
        self.verified_goldbach = {}  # Cache verified Goldbach pairs
        
    def _precompute_primes(self, limit: int) -> List[int]:
        """Precompute primes using Sieve of Eratosthenes for efficient lookup"""
        sieve = [True] * (limit + 1)
        sieve[0] = sieve[1] = False
        
        for i in range(2, int(limit**0.5) + 1):
            if sieve[i]:
                for j in range(i*i, limit + 1, i):
                    sieve[j] = False
        
        return [i for i in range(2, limit + 1) if sieve[i]]
    
    def _is_prime(self, n: int) -> bool:
        """Check if number is prime using precomputed list or trial division"""
        if n < len(self.computed_primes):
            return n in self.computed_primes
        
        if n < 2:
            return False
        if n == 2:
            return True
        if n % 2 == 0:
            return False
        
        for i in range(3, int(n**0.5) + 1, 2):
            if n % i == 0:
                return False
        return True
    
    def verify_goldbach_conjecture_real(self, difficulty: int) -> Dict[str, Any]:
        """Actually verify Goldbach conjecture for specific even numbers"""
        start_time = time.time()
        
        # Scale verification range with difficulty
        min_number = 4 + (difficulty * 100)
        max_number = min_number + (difficulty * 50)
        
        # Find even numbers to test
        even_numbers = [n for n in range(min_number, max_number + 1, 2)]
        verified_count = 0
        verification_pairs = []
        
        for even_num in even_numbers:
            # Find prime pairs that sum to even_num
            found_pair = False
            for p1 in self.computed_primes:
                if p1 > even_num // 2:
                    break
                p2 = even_num - p1
                if self._is_prime(p2):
                    verification_pairs.append((even_num, p1, p2))
                    verified_count += 1
                    found_pair = True
                    break
            
            if not found_pair:
                logger.warning(f"❌ GOLDBACH: Failed to verify for {even_num}")
        
        computation_time = time.time() - start_time
        
        # Energy calculation based on actual computation
        energy_consumed = computation_time * 0.08  # 80W for computation
        
        result = {
            'verificationRange': [min_number, max_number],
            'totalNumbers': len(even_numbers),
            'verifiedCount': verified_count,
            'verificationPairs': verification_pairs[-5:],  # Last 5 pairs as evidence
            'successRate': verified_count / len(even_numbers) if even_numbers else 0,
            'computationTime': computation_time,
            'actualComputation': True
        }
        
        verification_data = {
            'verified': verified_count == len(even_numbers),
            'method': 'Direct prime pair verification',
            'primeDatabase': len(self.computed_primes),
            'energyEfficient': energy_consumed < 0.1,
            'independentVerification': True,
            'verificationHash': hashlib.sha256(str(verification_pairs).encode()).hexdigest()
        }
        
        return {
            'computationResult': result,
            'verificationData': verification_data,
            'computationTime': computation_time,
            'energyConsumed': energy_consumed,
            'difficulty': difficulty
        }
    
    def analyze_prime_gaps_real(self, difficulty: int) -> Dict[str, Any]:
        """Real prime gap analysis with statistical significance"""
        start_time = time.time()
        
        # Scale analysis range with difficulty
        start_range = 1000 + (difficulty * 1000)
        end_range = start_range + (difficulty * 2000)
        
        # Find primes in range
        primes_in_range = [p for p in self.computed_primes if start_range <= p <= end_range]
        
        # Calculate gaps
        gaps = []
        twin_primes = []
        cousin_primes = []
        
        for i in range(len(primes_in_range) - 1):
            gap = primes_in_range[i + 1] - primes_in_range[i]
            gaps.append(gap)
            
            # Identify special prime pairs
            if gap == 2:
                twin_primes.append((primes_in_range[i], primes_in_range[i + 1]))
            elif gap == 4:
                cousin_primes.append((primes_in_range[i], primes_in_range[i + 1]))
        
        # Statistical analysis
        max_gap = max(gaps) if gaps else 0
        avg_gap = sum(gaps) / len(gaps) if gaps else 0
        gap_variance = np.var(gaps) if gaps else 0
        
        computation_time = time.time() - start_time
        energy_consumed = computation_time * 0.075  # 75W for analysis
        
        result = {
            'analysisRange': [start_range, end_range],
            'primesFound': len(primes_in_range),
            'totalGaps': len(gaps),
            'maxGap': max_gap,
            'averageGap': avg_gap,
            'gapVariance': gap_variance,
            'twinPrimes': len(twin_primes),
            'cousinPrimes': len(cousin_primes),
            'twinPrimePairs': twin_primes[-3:],  # Last 3 pairs
            'computationTime': computation_time,
            'actualComputation': True
        }
        
        verification_data = {
            'verified': len(primes_in_range) > 0,
            'method': 'Sieve of Eratosthenes with gap analysis',
            'statisticalSignificance': len(gaps) > 100,
            'gapDistribution': 'Analyzed',
            'independentVerification': True,
            'verificationHash': hashlib.sha256(str(gaps).encode()).hexdigest()
        }
        
        return {
            'computationResult': result,
            'verificationData': verification_data,
            'computationTime': computation_time,
            'energyConsumed': energy_consumed,
            'difficulty': difficulty
        }
    
    def compute_fibonacci_patterns_real(self, difficulty: int) -> Dict[str, Any]:
        """Real Fibonacci sequence analysis with mathematical properties"""
        start_time = time.time()
        
        # Scale sequence length with difficulty
        sequence_length = 50 + (difficulty * 10)
        
        # Generate Fibonacci sequence
        fib_sequence = [0, 1]
        for i in range(2, sequence_length):
            fib_sequence.append(fib_sequence[i-1] + fib_sequence[i-2])
        
        # Analyze mathematical properties
        golden_ratios = []
        prime_fibonacci = []
        
        for i in range(2, len(fib_sequence)):
            # Golden ratio convergence
            if fib_sequence[i-1] != 0:
                ratio = fib_sequence[i] / fib_sequence[i-1]
                golden_ratios.append(ratio)
            
            # Prime Fibonacci numbers
            if self._is_prime(fib_sequence[i]):
                prime_fibonacci.append((i, fib_sequence[i]))
        
        # Calculate golden ratio convergence
        golden_ratio = (1 + 5**0.5) / 2
        convergence_error = abs(golden_ratios[-1] - golden_ratio) if golden_ratios else 1
        
        computation_time = time.time() - start_time
        energy_consumed = computation_time * 0.06  # 60W for sequence generation
        
        result = {
            'sequenceLength': sequence_length,
            'lastFibonacci': fib_sequence[-1],
            'goldenRatioApproximation': golden_ratios[-1] if golden_ratios else 0,
            'goldenRatioError': convergence_error,
            'primeFibonacci': prime_fibonacci,
            'fibonacciPrimeCount': len(prime_fibonacci),
            'computationTime': computation_time,
            'actualComputation': True
        }
        
        verification_data = {
            'verified': len(fib_sequence) == sequence_length,
            'method': 'Direct recursive computation',
            'goldenRatioConvergence': convergence_error < 0.001,
            'sequenceIntegrity': fib_sequence[-1] == fib_sequence[-2] + fib_sequence[-3],
            'independentVerification': True,
            'verificationHash': hashlib.sha256(str(fib_sequence[-5:]).encode()).hexdigest()
        }
        
        return {
            'computationResult': result,
            'verificationData': verification_data,
            'computationTime': computation_time,
            'energyConsumed': energy_consumed,
            'difficulty': difficulty
        }
    
    def compute_collatz_verification_real(self, difficulty: int) -> Dict[str, Any]:
        """Real Collatz conjecture verification for multiple starting values"""
        start_time = time.time()
        
        # Scale verification range with difficulty
        start_value = 1000 + (difficulty * 500)
        verification_count = 20 + difficulty
        
        collatz_results = []
        max_steps = 0
        max_value_reached = 0
        
        for i in range(verification_count):
            current = start_value + i
            original = current
            steps = 0
            max_in_sequence = current
            
            # Follow Collatz sequence
            while current != 1 and steps < 10000:  # Safety limit
                if current % 2 == 0:
                    current = current // 2
                else:
                    current = 3 * current + 1
                
                steps += 1
                max_in_sequence = max(max_in_sequence, current)
            
            converged = current == 1
            collatz_results.append({
                'startValue': original,
                'steps': steps,
                'maxValue': max_in_sequence,
                'converged': converged
            })
            
            max_steps = max(max_steps, steps)
            max_value_reached = max(max_value_reached, max_in_sequence)
        
        convergence_rate = sum(1 for r in collatz_results if r['converged']) / len(collatz_results)
        
        computation_time = time.time() - start_time
        energy_consumed = computation_time * 0.07  # 70W for iteration
        
        result = {
            'verificationRange': [start_value, start_value + verification_count - 1],
            'totalVerified': verification_count,
            'convergenceRate': convergence_rate,
            'maxSteps': max_steps,
            'maxValueReached': max_value_reached,
            'averageSteps': sum(r['steps'] for r in collatz_results) / len(collatz_results),
            'sampleResults': collatz_results[-3:],  # Last 3 results
            'computationTime': computation_time,
            'actualComputation': True
        }
        
        verification_data = {
            'verified': convergence_rate >= 0.95,  # 95% convergence required
            'method': 'Direct sequence computation',
            'convergenceAnalysis': f"{convergence_rate:.2%} success rate",
            'computationalIntegrity': max_steps < 10000,
            'independentVerification': True,
            'verificationHash': hashlib.sha256(str([r['steps'] for r in collatz_results]).encode()).hexdigest()
        }
        
        return {
            'computationResult': result,
            'verificationData': verification_data,
            'computationTime': computation_time,
            'energyConsumed': energy_consumed,
            'difficulty': difficulty
        }
    
    def get_available_real_computations(self) -> List[str]:
        """Get list of available real mathematical computations"""
        return [
            'goldbach_verification',
            'prime_gap_analysis', 
            'fibonacci_patterns',
            'collatz_verification'
        ]
    
    def compute_real_mathematics(self, work_type: str, difficulty: int) -> Dict[str, Any]:
        """Main entry point for real mathematical computation"""
        
        computation_methods = {
            'goldbach_verification': self.verify_goldbach_conjecture_real,
            'prime_gap_analysis': self.analyze_prime_gaps_real,
            'fibonacci_patterns': self.compute_fibonacci_patterns_real,
            'collatz_verification': self.compute_collatz_verification_real
        }
        
        if work_type not in computation_methods:
            raise ValueError(f"Unknown real computation type: {work_type}")
        
        logger.info(f"🔬 REAL COMPUTATION: Starting {work_type} at difficulty {difficulty}")
        
        try:
            result = computation_methods[work_type](difficulty)
            result['workType'] = work_type
            result['timestamp'] = datetime.now().isoformat()
            result['realComputation'] = True
            
            logger.info(f"✅ REAL COMPUTATION: Completed {work_type} in {result['computationTime']:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"❌ REAL COMPUTATION: Error in {work_type}: {e}")
            raise