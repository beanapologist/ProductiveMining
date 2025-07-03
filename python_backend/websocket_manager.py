"""
WebSocket Manager - Python Implementation
Handles real-time communication for the productive mining platform
"""

import logging
import json
import time
from typing import List, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class WebSocketManager:
    """
    Manages WebSocket connections for real-time updates
    """
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        logger.info("🔌 WEBSOCKET: Manager initialized")
    
    async def connect(self, websocket: WebSocket):
        """Accept a WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"🔌 WEBSOCKET: New connection (total: {len(self.active_connections)})")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"🔌 WEBSOCKET: Connection closed (total: {len(self.active_connections)})")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket"""
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"❌ WEBSOCKET: Error sending personal message: {e}")
            self.disconnect(websocket)
    
    async def broadcast(self, data: Dict[str, Any]):
        """Broadcast a message to all connected WebSockets"""
        if not self.active_connections:
            return
        
        message = json.dumps(data)
        disconnected = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"❌ WEBSOCKET: Error broadcasting to connection: {e}")
                disconnected.append(connection)
        
        # Remove disconnected clients
        for connection in disconnected:
            self.disconnect(connection)
        
        if disconnected:
            logger.info(f"📡 WEBSOCKET: Broadcast sent to {len(self.active_connections)} connections")
    
    async def broadcast_mining_update(self, operation_id: int, progress: float, status: str):
        """Broadcast mining operation update"""
        await self.broadcast({
            'type': 'mining_update',
            'operationId': operation_id,
            'progress': progress,
            'status': status,
            'timestamp': str(int(time.time() * 1000))
        })
    
    async def broadcast_discovery(self, discovery: Dict[str, Any]):
        """Broadcast new mathematical discovery"""
        await self.broadcast({
            'type': 'new_discovery',
            'discovery': discovery,
            'timestamp': str(int(time.time() * 1000))
        })
    
    async def broadcast_block(self, block: Dict[str, Any]):
        """Broadcast new block creation"""
        await self.broadcast({
            'type': 'new_block',
            'block': block,
            'timestamp': str(int(time.time() * 1000))
        })