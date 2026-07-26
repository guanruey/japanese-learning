from app.services.cefr_converter import convert_to_cefr
from app.services.calibration_engine import calibrate

def test_cefr_converter():
    assert convert_to_cefr("JLPT", "N4") == "A2"
    assert convert_to_cefr("JLPT", "N1") == "C1"
    assert convert_to_cefr("TOEIC", "800") == "B2"
    assert convert_to_cefr("HSK", "3") == "A2"
    assert convert_to_cefr("HSK", "6") == "C1"

def test_calibration_step_up():
    metrics = {
        'grammar_errors': 0,
        'vocab_gaps': 0,
        'response_latency_sec': 1.5,
        'stalls': False
    }
    
    new_level, scaffolding = calibrate("A2", metrics)
    assert new_level == "B1"
    assert scaffolding is False
    
    # Should not exceed C2
    new_level, scaffolding = calibrate("C2", metrics)
    assert new_level == "C2"
    assert scaffolding is False

def test_calibration_step_down():
    metrics = {
        'grammar_errors': 2,
        'vocab_gaps': 1,
        'response_latency_sec': 3.5,
        'stalls': False
    }
    
    # 3 errors -> step down
    new_level, scaffolding = calibrate("B1", metrics)
    assert new_level == "A2"
    assert scaffolding is True
    
    # stall -> step down
    metrics2 = {
        'grammar_errors': 0,
        'vocab_gaps': 0,
        'response_latency_sec': 1.5,
        'stalls': True
    }
    new_level, scaffolding = calibrate("A2", metrics2)
    assert new_level == "A1"
    assert scaffolding is True
    
    # should not drop below A1
    new_level, scaffolding = calibrate("A1", metrics2)
    assert new_level == "A1"
    assert scaffolding is True
    
def test_calibration_no_change():
    metrics = {
        'grammar_errors': 1,
        'vocab_gaps': 0,
        'response_latency_sec': 2.5,
        'stalls': False
    }
    new_level, scaffolding = calibrate("A2", metrics)
    assert new_level == "A2"
    assert scaffolding is False
