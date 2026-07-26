from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
from datetime import datetime

router = APIRouter()

# Mock function for FSRS update
def mock_handle_conversation_review(user_id: str, word: str):
    print(f"Memory Loop Integration: Triggered FSRS update for user {user_id}, word '{word}'")
    # In a real app, this would query FSRSCard by user_id and vocab_id, then call FSRSEngine.process_review
    pass

@router.websocket("/ws/audio")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Target vocabulary for simulation
    TARGET_VOCAB = ["apple", "りんご", "test"]

    try:
        while True:
            # Wait for audio chunks from the client
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                event_type = message.get("type")
                
                if event_type == "audio_chunk":
                    # Simulate low-latency processing (STT & TTS)
                    # Requirement: < 400ms latency.
                    await asyncio.sleep(0.1) # 100ms
                    
                    # Mock STT output
                    mock_transcript = message.get("transcript", "hello world")
                    
                    # Check for memory loop trigger (positive recognition)
                    for word in TARGET_VOCAB:
                        if word in mock_transcript.lower():
                            mock_handle_conversation_review(user_id="mock_user", word=word)
                            break
                    
                    # Mock TTS output
                    response = {
                        "type": "audio_response",
                        "transcript": mock_transcript,
                        "audio_data": "mock_base64_audio_data"
                    }
                    await websocket.send_text(json.dumps(response))
                
                elif event_type == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "Invalid JSON"}))
                
    except WebSocketDisconnect:
        print("Client disconnected")
