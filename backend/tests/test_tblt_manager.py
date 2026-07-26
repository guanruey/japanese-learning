from backend.app.services.tblt_manager import TBLTManager

def test_process_feedback_with_sla_badge():
    manager = TBLTManager()
    feedback = manager.process_feedback(["PH", "GR"])
    
    assert "PH" in feedback
    assert "sla_badge" in feedback["PH"]
    assert feedback["PH"]["sla_badge"]["theory"] == "Contrastive Linguistics (L1 Interference)"
    
    assert "GR" in feedback
    assert "sla_badge" in feedback["GR"]
    assert feedback["GR"]["sla_badge"]["theory"] == "Input Hypothesis (i+1)"
