from typing import Dict, Any

DOMAINS = {
    "Survival & Daily": {
        "communicative_goal": "Successfully convey basic needs and understand simple responses.",
        "information_gap": "You need something but don't know where it is or how to get it."
    },
    "Business & Office": {
        "communicative_goal": "Negotiate or request action politely while maintaining professional harmony.",
        "information_gap": "You need a colleague or client to agree to a proposal or provide sensitive information."
    },
    "Social & Nuance": {
        "communicative_goal": "Build rapport and express subtle emotions or opinions.",
        "information_gap": "You want to understand someone's true feelings (honne) behind their polite facade (tatemae)."
    },
    "Subculture & Media": {
        "communicative_goal": "Engage in enthusiastic discussion about shared interests using informal slang.",
        "information_gap": "You are trying to find out details about a niche topic or share an opinion about it."
    }
}

def generate_scenario(domain: str) -> Dict[str, str]:
    """
    Generate the communicative goal and information gap for a specific domain.
    """
    scenario = DOMAINS.get(domain, {
        "communicative_goal": "Convey your message clearly.",
        "information_gap": "You need to acquire or provide information."
    })
    return {
        "domain": domain,
        "communicative_goal": scenario["communicative_goal"],
        "information_gap": scenario["information_gap"]
    }
