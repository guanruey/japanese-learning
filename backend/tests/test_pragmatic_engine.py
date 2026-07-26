from backend.app.services.pragmatic_engine import generate_scenario

def test_generate_scenario():
    scenario = generate_scenario("Survival & Daily")
    assert scenario["domain"] == "Survival & Daily"
    assert "communicative_goal" in scenario
    assert "information_gap" in scenario

    unknown = generate_scenario("Unknown Domain")
    assert unknown["communicative_goal"] == "Convey your message clearly."
