#!/usr/bin/env python3
"""
Startup script for Python-based Productive Mining Blockchain Platform
"""

import sys
import os

# Add python_backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python_backend'))

# Import and run the main application
from python_backend.main import app
import uvicorn

if __name__ == "__main__":
    print("🐍 PYTHON BLOCKCHAIN: Starting productive mining platform...")
    print("🔗 Platform: Revolutionary blockchain using mathematical computation")
    print("💰 Scientific Valuation: Realistic $1.2K-$3.5K range")
    print("🌐 Server: http://localhost:5001")
    print()
    
    uvicorn.run(
        "python_backend.main:app",
        host="0.0.0.0",
        port=5001,
        reload=True,
        log_level="info"
    )