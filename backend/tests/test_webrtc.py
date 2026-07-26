import pytest
from fastapi.testclient import TestClient
from app.main import app
import json
import time

client = TestClient(app)

def test_websocket_audio():
    with client.websocket_connect("/api/ws/audio") as websocket:
        # Test basic audio chunk with memory loop trigger
        message = {
            "type": "audio_chunk",
            "audio_data": "mock_incoming_audio",
            "transcript": "I love eating apple"
        }
        
        start_time = time.time()
        websocket.send_text(json.dumps(message))
        
        response_data = websocket.receive_text()
        end_time = time.time()
        
        response = json.loads(response_data)
        
        assert response["type"] == "audio_response"
        assert response["transcript"] == "I love eating apple"
        assert response["audio_data"] == "mock_base64_audio_data"
        
        # Ensure latency is < 400ms (0.4s)
        assert (end_time - start_time) < 0.4
        
        # Test ping
        websocket.send_text(json.dumps({"type": "ping"}))
        ping_response = json.loads(websocket.receive_text())
        assert ping_response["type"] == "pong"
