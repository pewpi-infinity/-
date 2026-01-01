/**
 * Token Hub Examples
 * Demonstrates how to use the Token Economy Hub system
 */

const TokenHub = require('./token-hub.js');

console.log('💰 TOKEN HUB EXAMPLES\n');
console.log('='.repeat(60));

// Initialize the Token Hub
const hub = new TokenHub();

console.log('\n📋 EXAMPLE 1: User Contribution & Token Minting');
console.log('-'.repeat(60));

async function example1() {
  // User creates valuable content
  const result = await hub.processContribution('user_alice', 'content_creation', {
    title: 'Research on Quantum Computing',
    type: 'article',
    length: 5000
  });

  console.log('✓ Contribution processed:');
  console.log(`  User: ${result.userId}`);
  console.log(`  Type: ${result.contributionType}`);
  console.log(`  Tokens Earned: ${result.tokensEarned} ALC`);
  console.log(`  New Balance: ${result.newBalance} ALC`);
  console.log(`  Cascade ID: ${result.cascadeId}`);
}

console.log('\n📋 EXAMPLE 2: Feature Building Reward');
console.log('-'.repeat(60));

async function example2() {
  // User builds a new feature
  const result = await hub.processContribution('user_bob', 'feature_building', {
    feature: 'Dark mode toggle',
    repository: 'banksy',
    complexity: 'medium'
  });

  console.log('✓ Feature contribution processed:');
  console.log(`  User: ${result.userId}`);
  console.log(`  Tokens Earned: ${result.tokensEarned} ALC (50 for feature building)`);
  console.log(`  New Balance: ${result.newBalance} ALC`);
}

console.log('\n📋 EXAMPLE 3: Purchase Transaction');
console.log('-'.repeat(60));

async function example3() {
  // First, give user some tokens
  await hub.processContribution('user_charlie', 'task_completion', {
    task: 'Review PRs'
  });
  await hub.processContribution('user_charlie', 'task_completion', {
    task: 'Fix bugs'
  });
  await hub.processContribution('user_charlie', 'task_completion', {
    task: 'Write docs'
  });

  // Now user can purchase premium features
  const purchaseResult = await hub.processPurchase('user_charlie', 'premium_theme', 100);

  console.log('✓ Purchase processed:');
  console.log(`  Buyer: ${purchaseResult.buyerId}`);
  console.log(`  Item: ${purchaseResult.itemId}`);
  console.log(`  Cost: ${purchaseResult.cost} ALC`);
  console.log(`  New Balance: ${purchaseResult.newBalance} ALC`);
  console.log(`  Cascade triggered: ${purchaseResult.cascadeId}`);
  console.log('\n  8-Step Domino Cascade:');
  console.log('    1. ✓ Commerce collected tokens');
  console.log('    2. ✓ Hub recorded transaction');
  console.log('    3. ✓ Mint created receipt token');
  console.log('    4. ✓ Pricing adjusted value');
  console.log('    5. ✓ Index updated catalog');
  console.log('    6. ✓ Mongoose learned pattern');
  console.log('    7. ✓ Documentation backed up');
  console.log('    8. ✓ Loop continues automatically');
}

console.log('\n📋 EXAMPLE 4: Token Transfer Between Users');
console.log('-'.repeat(60));

async function example4() {
  // Transfer tokens from one user to another
  const transferResult = hub.distribution.transfer('user_alice', 'user_bob', 25);

  console.log('✓ Token transfer:');
  console.log(`  From: user_alice`);
  console.log(`  To: user_bob`);
  console.log(`  Amount: 25 ALC`);
  console.log(`  Sender Balance: ${transferResult.senderBalance} ALC`);
  console.log(`  Recipient Balance: ${transferResult.recipientBalance} ALC`);
}

console.log('\n📋 EXAMPLE 5: Network Broadcasting');
console.log('-'.repeat(60));

async function example5() {
  // Broadcast price update to all repositories
  const broadcastResult = await hub.broadcast({
    type: 'price_update',
    token: 'ALC',
    newPrice: 0.015,
    previousPrice: 0.01
  });

  console.log('✓ Message broadcasted:');
  console.log(`  Targets: ${broadcastResult.totalTargets}`);
  console.log(`  Successful: ${broadcastResult.successCount}`);
  console.log(`  Failed: ${broadcastResult.failureCount}`);
}

console.log('\n📋 EXAMPLE 6: System Health Check');
console.log('-'.repeat(60));

function example6() {
  const health = hub.healthCheck();

  console.log('✓ Health check results:');
  console.log(`  Overall Status: ${health.overall.toUpperCase()}`);
  console.log(`  Timestamp: ${health.timestamp}`);
  console.log('  Component Status:');
  Object.entries(health.components).forEach(([component, status]) => {
    console.log(`    ${component}: ${status ? '✓ OK' : '✗ FAILED'}`);
  });
  if (health.issues.length > 0) {
    console.log('  Issues Found:');
    health.issues.forEach(issue => console.log(`    - ${issue}`));
  } else {
    console.log('  Issues: None');
  }
}

console.log('\n📋 EXAMPLE 7: System Statistics');
console.log('-'.repeat(60));

function example7() {
  const stats = hub.getHubStatistics();

  console.log('✓ Token Economy Statistics:');
  console.log(`  Total ALC Supply: ${stats.tokens.totalSupply}`);
  console.log(`  Total Transactions: ${stats.tokens.totalTransactions}`);
  console.log(`  Active Users: ${stats.distribution.activeUsers}`);
  console.log(`  Total Distributed: ${stats.distribution.totalDistributed} ALC`);
  console.log(`  Total Spent: ${stats.distribution.totalSpent} ALC`);
  console.log('');
  console.log('✓ Network Statistics:');
  console.log(`  Active Bonds: ${stats.network.bonds.activeBonds}`);
  console.log(`  Collective Bond Strength: ${stats.network.bonds.collectiveStrength}`);
  console.log(`  Network Capacitance: ${stats.network.capacitance.totalCapacitance} ALC`);
  console.log(`  Network Utilization: ${stats.network.capacitance.utilizationPercent.toFixed(2)}%`);
  console.log('');
  console.log('✓ Automation Statistics:');
  console.log(`  Completed Cascades: ${stats.automation.cascade.completedCascades}`);
  console.log(`  Success Rate: ${(stats.automation.cascade.successRate * 100).toFixed(1)}%`);
  console.log(`  Automation Enabled: ${stats.automation.robotic.enabled ? 'YES' : 'NO'}`);
}

console.log('\n📋 EXAMPLE 8: System Backup');
console.log('-'.repeat(60));

async function example8() {
  const backupResult = await hub.createSystemBackup();

  console.log('✓ System backup created:');
  console.log(`  Backup ID: ${backupResult.backupId}`);
  console.log(`  Type: ${backupResult.backup.type}`);
  console.log(`  Success: ${backupResult.success ? 'YES' : 'NO'}`);
  console.log(`  Locations Written: ${backupResult.backup.successCount}/8`);
  console.log(`  Timestamp: ${backupResult.timestamp}`);
}

console.log('\n📋 EXAMPLE 9: Multiple Contributions Batch');
console.log('-'.repeat(60));

async function example9() {
  const contributions = [
    { userId: 'user_dave', type: 'helping_others', metadata: { helped: 'user_eve' } },
    { userId: 'user_eve', type: 'content_creation', metadata: { title: 'Tutorial' } },
    { userId: 'user_frank', type: 'task_completion', metadata: { task: 'Testing' } }
  ];

  console.log('✓ Batch processing contributions:');
  
  for (const contrib of contributions) {
    const result = await hub.processContribution(contrib.userId, contrib.type, contrib.metadata);
    console.log(`  ${contrib.userId}: +${result.tokensEarned} ALC (Balance: ${result.newBalance})`);
  }
}

console.log('\n📋 EXAMPLE 10: Top Token Holders');
console.log('-'.repeat(60));

function example10() {
  const topHolders = hub.distribution.getTopHolders(5);

  console.log('✓ Top 5 Token Holders:');
  topHolders.forEach((holder, index) => {
    console.log(`  ${index + 1}. ${holder.userId}: ${holder.balance} ALC`);
  });
}

// Run all examples
async function runAllExamples() {
  try {
    await example1();
    await example2();
    await example3();
    await example4();
    await example5();
    example6();
    example7();
    await example8();
    await example9();
    example10();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All examples completed successfully!');
    console.log('='.repeat(60));
    console.log('\nFinal System Status:');
    
    const finalStats = hub.getHubStatistics();
    console.log(`  💰 Total ALC Supply: ${finalStats.tokens.totalSupply}`);
    console.log(`  🔗 Active Connections: ${finalStats.network.connections.activeConnections}`);
    console.log(`  ⚡ Total Transactions: ${finalStats.tokens.totalTransactions}`);
    console.log(`  🔄 Completed Cascades: ${finalStats.automation.cascade.completedCascades}`);
    console.log(`  📊 Success Rate: ${(finalStats.automation.cascade.successRate * 100).toFixed(1)}%`);
    console.log(`  🤖 Automation: ${finalStats.automation.robotic.enabled ? 'ACTIVE' : 'INACTIVE'}`);
    
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  runAllExamples,
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  example8,
  example9,
  example10
};
