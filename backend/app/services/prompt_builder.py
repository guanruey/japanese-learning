from typing import List

class User:
    def __init__(self, base_language: str, target_language: str, calibrated_cefr_level: str, recent_errors: List[str], fsrs_alerts: List[str]):
        self.base_language = base_language
        self.target_language = target_language
        self.calibrated_cefr_level = calibrated_cefr_level
        self.recent_errors = recent_errors
        self.fsrs_alerts = fsrs_alerts

class TBLTTask:
    def __init__(self, stage: str, domain: str = None, communicative_goal: str = None, information_gap: str = None, pre_task_vocab: List[str] = None):
        self.stage = stage
        self.domain = domain
        self.communicative_goal = communicative_goal
        self.information_gap = information_gap
        self.pre_task_vocab = pre_task_vocab or []

def get_pair_rule(base_language: str, target_language: str) -> str:
    if base_language == "ZH" and target_language == "JA":
        return """You are an enthusiastic, gamified Japanese tutor for a native Chinese speaker! 🎮
✨ Great try! Proactively flag: (1) pitch accent on key vocabulary, (2) Kanji that look Chinese but mean something different, (3) politeness level mismatches.
Keep the tone highly encouraging, warm, and fun! Use Chinese explanations where needed.
When the user makes a pitch accent error, gently and playfully correct with HL/LH notation, like unlocking a new skill!"""
    elif base_language == "JA" and target_language == "ZH":
        return """You are a highly encouraging, gamified Mandarin Chinese tutor for a native Japanese speaker! 🌟
Focus on: (1) correcting SOV→SVO word order errors, (2) teaching tone contours with fun audio descriptions.
Always show pinyin alongside characters. Praise effort explicitly like giving them combo points! 💯"""
    elif base_language == "EN" and target_language in ["ZH", "JA"]:
        return f"""You are a fun and gamified {target_language} tutor for a native English speaker! 🚀
Apply step-by-step scaffolding for every new grammar point as if leveling up. Celebrate tonal progress enthusiastically! 🎉"""
    else:
        return f"You are an upbeat, gamified {target_language} tutor for a native {base_language} speaker! 🎯"

def get_cefr_constraints(level: str) -> str:
    if level in ["A1", "A2"]:
        return "- Use only N5/N4 equivalent grammar (JA) or basic SVO (EN).\n- Speak slowly and clearly.\n- DO NOT use complex idioms or business honorifics. Keep it light and fun! ✨"
    elif level in ["B1", "B2"]:
        return "- Use N3/N2 equivalent grammar.\n- Speak at a natural conversational pace.\n- Introduce colloquialisms and standard politeness (丁寧語/謙譲語), framing them as cool native tips! 💡"
    elif level in ["C1", "C2", "C1/C2"]:
        return "- Use native-level phrasing, complex idioms, and advanced nuances.\n- Speak at fast, native tempo.\n- Enforce strict business and high-context cultural honorifics if requested by the scenario, framing it as the ultimate boss challenge! 🏆"
    return ""

def build_system_prompt(user: User, task: TBLTTask, scaffolding_mode: bool = False) -> str:
    system_prompt_template = get_pair_rule(user.base_language, user.target_language)
    cefr_constraints = get_cefr_constraints(user.calibrated_cefr_level)
    scaffolding_text = "\n[SCAFFOLDING MODE: Active - speak slower, use base language for complex terms.]" if scaffolding_mode else ""
    
    pragmatic_text = ""
    if task.domain:
        pragmatic_text += f"\nPragmatic Domain: {task.domain}"
    if task.communicative_goal:
        pragmatic_text += f"\nCommunicative Goal: {task.communicative_goal}"
    if task.information_gap:
        pragmatic_text += f"\nInformation Gap: {task.information_gap}"
    if task.pre_task_vocab:
        pragmatic_text += f"\nPre-Task Scaffolding Vocab: {', '.join(task.pre_task_vocab)}"

    return f"""{system_prompt_template}
Current TBLT Stage: {task.stage}{pragmatic_text}
User Calibrated CEFR Level: {user.calibrated_cefr_level}{scaffolding_text}
CEFR Constraints:
{cefr_constraints}
Recent Error Patterns: {", ".join(user.recent_errors) if user.recent_errors else "None"}
Vocabulary Stability Alerts: {", ".join(user.fsrs_alerts) if user.fsrs_alerts else "None"}"""
