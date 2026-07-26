import pytest
import math
from app.services.fsrs_engine import (
    retrievability,
    initial_stability,
    update_stability,
    update_difficulty,
    next_interval,
    FSRSEngine
)

def test_retrievability_decay():
    S = 1.0 # 1 day stability
    assert math.isclose(retrievability(0, S), 1.0)
    assert math.isclose(retrievability(1, S), 0.7254, rel_tol=1e-3)
    assert math.isclose(retrievability(S, S), math.pow(1 + 0.9, -0.5))

def test_stability_update():
    S = 2.0
    D = 5.0
    R = 0.9
    
    # Rating 1
    s_new_1 = update_stability(S, D, R, 1)
    assert s_new_1 == initial_stability(D)

    # Rating 2
    s_new_2 = update_stability(S, D, R, 2)
    assert math.isclose(s_new_2, S * 0.8)

    # Rating 3
    s_new_3 = update_stability(S, D, R, 3)
    expected_3 = S * math.exp(0.1 * (11 - D)) * R * 2.5
    assert math.isclose(s_new_3, expected_3)

    # Rating 4
    s_new_4 = update_stability(S, D, R, 4)
    expected_4 = S * math.exp(0.1 * (11 - D)) * R * 2.5 * 1.3
    assert math.isclose(s_new_4, expected_4)

def test_difficulty_update():
    D = 5.0
    assert update_difficulty(D, 1) == 6.6
    assert update_difficulty(D, 2) == 5.8
    assert update_difficulty(D, 3) == 5.0
    assert update_difficulty(D, 4) == 4.2
    
    # Bounds check
    assert update_difficulty(1.0, 4) == 1.0
    assert update_difficulty(10.0, 1) == 10.0

def test_engine_process_review():
    engine = FSRSEngine(target_r=0.9)
    new_s, new_d, next_ivl = engine.process_review(S=1.0, D=5.0, t_days=1.0, rating=3)
    assert new_s > 1.0
    assert new_d == 5.0
    assert next_ivl > 0.0
