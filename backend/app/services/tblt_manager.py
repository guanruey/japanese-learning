from typing import List, Dict, Any
from backend.app.services.calibration_engine import calibrate

class TBLTManager:
    STAGES = ["Pre-task", "Task-cycle", "Post-task"]
    ERROR_CODES = {
        "PH": "Phonetics / Pitch Accent",
        "GR": "Grammar Structure",
        "KH": "Kanji Homograph confusion",
        "PL": "Politeness Level mismatch",
        "CL": "Classifier error",
        "VB": "Vocabulary gap"
    }

    def __init__(self, initial_cefr_level: str = "A1"):
        self.current_stage_index = 0
        self.calibrated_cefr_level = initial_cefr_level
        self.scaffolding_mode = False

    def get_current_stage(self) -> str:
        return self.STAGES[self.current_stage_index]

    def transition_to_next_stage(self) -> str:
        if self.current_stage_index < len(self.STAGES) - 1:
            self.current_stage_index += 1
        return self.get_current_stage()

    def reset(self):
        self.current_stage_index = 0
        self.scaffolding_mode = False

    def classify_error(self, code: str) -> str:
        if code in self.ERROR_CODES:
            return self.ERROR_CODES[code]
        return "Unknown Error"

    def process_feedback(self, feedback_codes: List[str]) -> Dict[str, Any]:
        """
        Process a list of feedback codes and return structured feedback with SLA badges.
        """
        structured_feedback = {}
        for code in feedback_codes:
            if code in self.ERROR_CODES:
                theory = ""
                explanation = ""
                if code in ["PH", "KH"]:
                    theory = "Contrastive Linguistics (L1 Interference)"
                    explanation = "根據對比語言學，母語為中文的學習者容易將中文語音或漢字意義直接套用於日文，導致發音或理解錯誤。"
                elif code == "GR":
                    theory = "Input Hypothesis (i+1)"
                    explanation = "透過調整句法難度，讓學習者接觸略高於現有水平 (i+1) 的句型，促成語言習得。"
                elif code == "PL":
                    theory = "Sociopragmatic Competence"
                    explanation = "根據社會語用學研究，不同情境需要適當的敬語 (Politeness) 標記以降低溝通阻力。"
                elif code == "VB":
                    theory = "Noticing Hypothesis"
                    explanation = "透過明確指出詞彙缺漏，幫助學習者『注意到』(Notice) 自身語言和目標語的差距。"
                else:
                    theory = "Cognitive Load Theory"
                    explanation = "降低學習時的額外認知負荷，專注於核心任務。"

                structured_feedback[code] = {
                    "feedback": self.ERROR_CODES[code],
                    "sla_badge": {
                        "theory": theory,
                        "explanation": explanation
                    }
                }
        return structured_feedback
        
    def evaluate_performance(self, metrics: Dict[str, any]):
        """
        Updates calibrated_cefr_level and scaffolding_mode based on task metrics.
        """
        new_level, scaffolding = calibrate(self.calibrated_cefr_level, metrics)
        self.calibrated_cefr_level = new_level
        self.scaffolding_mode = scaffolding

