from typing import Dict, Any, Tuple

CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

def step_up(level: str) -> str:
    try:
        idx = CEFR_LEVELS.index(level)
        return CEFR_LEVELS[min(idx + 1, len(CEFR_LEVELS) - 1)]
    except ValueError:
        return 'A1'

def step_down(level: str) -> str:
    try:
        idx = CEFR_LEVELS.index(level)
        return CEFR_LEVELS[max(idx - 1, 0)]
    except ValueError:
        return 'A1'

def calibrate(current_level: str, metrics: Dict[str, Any]) -> Tuple[str, bool]:
    """
    Calibrate CEFR level based on TBLT task cycle metrics.
    Returns a tuple of (new_cefr_level, scaffolding_mode).
    """
    gr_errors = metrics.get('grammar_errors', 0)
    vb_errors = metrics.get('vocab_gaps', 0)
    latency = metrics.get('response_latency_sec', 0.0)
    stalls = metrics.get('stalls', False)
    
    total_errors = gr_errors + vb_errors
    
    if total_errors >= 3 or stalls:
        return step_down(current_level), True
        
    if gr_errors == 0 and vb_errors == 0 and latency < 2.0:
        return step_up(current_level), False
        
    return current_level, False
