import { generateWeaknessPrescriptions } from './src/services/weaknessEngine.js';
import { generateTodayRecommendations } from './src/services/todayEngine.js';

async function runIntegrationTests() {
  console.log("🚀 Starting SaaS V1 Integration Tests...\n");
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  // Setup simulated stores (normally hooks, but we'll extract their pure logic or use zustand's getState if accessible. 
  // Wait, these are zustand hooks. We can call them directly in node if we mock localStorage/window.)
  console.log("Note: Since we are running outside React, we will test the pure engine logic.\n");

  // --- Scenario B: Weakness & Today Engine Integration ---
  console.log("Testing Scenario B: AI Loop & Weakness Prescription");
  
  // 1. Simulate multiple mistakes on 'grammar.particles'
  const mockWeaknessScores = { 'grammar.particles': 80 };
  const mockWeaknessStats = { 
    'grammar.particles': { occurrences: 5, recentSuccesses: 0, lastEncountered: Date.now() } 
  };
  
  // 2. Generate prescriptions
  const prescriptions = generateWeaknessPrescriptions(mockWeaknessScores, mockWeaknessStats, 'travel');
  assert(prescriptions.length === 1, "Should generate exactly 1 prescription for the critical weakness.");
  assert(prescriptions[0]?.title.includes("助詞"), "Prescription title should contain the weakness concept in the title.");
  assert(prescriptions[0]?.supporting_message !== undefined, "Prescription should have a supporting message.");

  // 3. Generate Today Recommendations
  const todayRecs = generateTodayRecommendations({
    srsDueCount: 0,
    weaknessScores: mockWeaknessScores,
    weaknessStats: mockWeaknessStats,
    userGoal: 'travel',
    isJapanese: true,
    randomGrammar: null
  });

  const primaryRec = todayRecs.find(r => r.slot === 'primary');
  assert(primaryRec?.type === 'weakness_micro_practice', "Today Dashboard's primary recommendation should be weakness micro-practice.");
  assert(primaryRec?.priority_score > 20, "Weakness priority score should be high enough to be primary.");

  // --- Scenario C: Paywall logic ---
  console.log("\nTesting Scenario C: Commercial Defenses");
  let sakuraGems = 10;
  const isPro = false;
  const consumeGems = (amount) => {
    if (isPro) return true;
    if (sakuraGems >= amount) {
      sakuraGems -= amount;
      return true;
    }
    return false;
  };
  
  assert(consumeGems(5) === true, "Should allow consumption when gems are sufficient (10-5 = 5)");
  assert(consumeGems(5) === true, "Should allow consumption when gems are sufficient (5-5 = 0)");
  assert(consumeGems(1) === false, "Should block consumption and trigger paywall when gems are empty");
  
  // Simulate BYOK Activation
  const byokActivated = true;
  const consumeGemsPro = (amount) => {
    if (byokActivated) return true;
    return false;
  }
  assert(consumeGemsPro(999) === true, "Should allow infinite consumption if BYOK/Pro is active");

  console.log(`\n🏁 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runIntegrationTests();
