import math
from datetime import datetime, timedelta

F = 0.9
C = -0.5

def retrievability(t: float, S: float) -> float:
    if S <= 0:
        return 0.0
    return math.pow(1 + F * (t / S), C)

def next_interval(S: float, R_target: float) -> float:
    return S * (math.pow(R_target, 1 / C) - 1) / F

def initial_stability(D: float) -> float:
    return max(0.1, 4 - (D - 1) * 0.35)

def update_stability(S: float, D: float, R: float, rating: int) -> float:
    S0 = initial_stability(D)
    if rating == 1:
        return S0
    elif rating == 2:
        return S * 0.8
    elif rating == 3:
        return S * math.exp(0.1 * (11 - D)) * R * 2.5
    elif rating == 4:
        return S * math.exp(0.1 * (11 - D)) * R * 2.5 * 1.3
    return S

def update_difficulty(D: float, rating: int) -> float:
    delta = -0.8 * (rating - 3)
    return min(10.0, max(1.0, D + delta))

class FSRSEngine:
    def __init__(self, target_r: float = 0.90):
        self.target_r = target_r

    def calculate_retrievability(self, last_review: datetime, S: float) -> float:
        t = (datetime.now() - last_review).total_seconds() / 86400.0
        return retrievability(t, S)

    def process_review(self, S: float, D: float, t_days: float, rating: int):
        R = retrievability(t_days, S)
        new_S = update_stability(S, D, R, rating)
        new_D = update_difficulty(D, rating)
        next_ivl = next_interval(new_S, self.target_r)
        return new_S, new_D, next_ivl
