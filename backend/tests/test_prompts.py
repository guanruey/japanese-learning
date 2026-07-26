import pytest
from app.services.prompt_builder import User, TBLTTask, build_system_prompt
from app.services.tblt_manager import TBLTManager

def test_prompt_builder_zh_ja():
    user = User(base_language="ZH", target_language="JA", cefr_level="A2", recent_errors=["Pitch Accent"], fsrs_alerts=[])
    task = TBLTTask(stage="Pre-task")
    prompt = build_system_prompt(user, task)
    
    assert "You are a Japanese tutor for a native Chinese speaker." in prompt
    assert "(1) pitch accent on key vocabulary" in prompt
    assert "Current TBLT Stage: Pre-task" in prompt
    assert "User CEFR Level: A2" in prompt
    assert "Recent Error Patterns: Pitch Accent" in prompt

def test_prompt_builder_ja_zh():
    user = User(base_language="JA", target_language="ZH", cefr_level="B1", recent_errors=["SOV word order"], fsrs_alerts=["classifier missing"])
    task = TBLTTask(stage="Task-cycle")
    prompt = build_system_prompt(user, task)
    
    assert "You are a Mandarin Chinese tutor for a native Japanese speaker." in prompt
    assert "correcting SOV→SVO word order errors" in prompt
    assert "teaching tone contours" in prompt
    assert "Current TBLT Stage: Task-cycle" in prompt
    assert "Vocabulary Stability Alerts: classifier missing" in prompt

def test_prompt_builder_en_ja():
    user = User(base_language="EN", target_language="JA", cefr_level="A1", recent_errors=[], fsrs_alerts=[])
    task = TBLTTask(stage="Post-task")
    prompt = build_system_prompt(user, task)
    
    assert "You are a JA tutor for a native English speaker." in prompt
    assert "Explicitly contrast English SVO with Japanese SOV" in prompt
    assert "Current TBLT Stage: Post-task" in prompt
    assert "Recent Error Patterns: None" in prompt

def test_tblt_state_machine():
    manager = TBLTManager()
    assert manager.get_current_stage() == "Pre-task"
    assert manager.transition_to_next_stage() == "Task-cycle"
    assert manager.transition_to_next_stage() == "Post-task"
    # Should stay at Post-task if transition called again
    assert manager.transition_to_next_stage() == "Post-task"
    manager.reset()
    assert manager.get_current_stage() == "Pre-task"

def test_tblt_error_classification():
    manager = TBLTManager()
    assert manager.classify_error("PH") == "Phonetics / Pitch Accent"
    assert manager.classify_error("GR") == "Grammar Structure"
    assert manager.classify_error("INVALID") == "Unknown Error"

def test_tblt_process_feedback():
    manager = TBLTManager()
    feedback = manager.process_feedback(["PH", "KH", "VB", "INVALID"])
    assert "PH" in feedback
    assert "KH" in feedback
    assert "VB" in feedback
    assert "INVALID" not in feedback
    assert feedback["PH"] == "Phonetics / Pitch Accent"
