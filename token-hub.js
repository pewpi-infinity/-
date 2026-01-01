/**
 * Token Hub - Main Integration Module
 * Central command for all token operations, commerce, and inter-website communication
 * Machine Identity: TOKEN_HUB
 */

// Load core modules
const ALCMinting = require('./token-hub/alc-minting.js');
const ALCDistribution = require('./token-hub/alc-distribution.js');
const TransactionRouter = require('./token-hub/transaction-router.js');
const WebsiteConnector = require('./token-hub/website-connector.js');

const HydrogenBonds = require('./wiring/hydrogen-bonds.js');
const CapacitanceNetwork = require('./wiring/capacitance-network.js');
const DominoCascade = require('./wiring/domino-cascade.js');
const RoboticAutomation = require('./wiring/robotic-automation.js');

const MultiLocationWriter = require('./documentation/multi-location-writer.js');
const BackupSystem = require('./documentation/backup-system.js');

/**
 * Token Hub class
 * Coordinates all token economy operations
 */
class TokenHub {
  constructor() {
    this.machineIdentity = 'TOKEN_HUB';
    this.version = '1.0.0';
    this.status = 'initializing';
    
    // Initialize components
    this.initializeComponents();
    
    this.status = 'operational';
    console.log(`[${this.machineIdentity}] Token Hub initialized - Status: ${this.status}`);
  }

  /**
   * Initialize all hub components
   */
  initializeComponents() {
    console.log(`[${this.machineIdentity}] Initializing components...`);

    // Token system
    this.minting = new ALCMinting();
    this.distribution = new ALCDistribution(this.minting);
    console.log(`[${this.machineIdentity}] ✓ Token system initialized`);

    // Network infrastructure
    this.bonds = new HydrogenBonds();
    this.network = new CapacitanceNetwork(this.bonds);
    console.log(`[${this.machineIdentity}] ✓ Hydrogen bonding network initialized`);

    // Routing and connections
    this.router = new TransactionRouter();
    this.connector = new WebsiteConnector(this.router);
    console.log(`[${this.machineIdentity}] ✓ Website connections established`);

    // Automation
    this.cascade = new DominoCascade(this.router, this.connector);
    this.automation = new RoboticAutomation(this.cascade, this.bonds, this.network);
    console.log(`[${this.machineIdentity}] ✓ Domino cascade system armed`);

    // Documentation
    this.writer = new MultiLocationWriter();
    this.backup = new BackupSystem(this.writer);
    console.log(`[${this.machineIdentity}] ✓ Multi-location documentation active`);

    // Register network nodes
    this.registerNetworkNodes();

    // Start automation
    this.automation.start();
    console.log(`[${this.machineIdentity}] ✓ Robotic automation enabled`);
  }

  /**
   * Register all network nodes as capacitors
   */
  registerNetworkNodes() {
    const nodes = [
      { id: 'dash_hub', capacitance: 5000 },
      { id: 'banksy', capacitance: 2000 },
      { id: 'token-mint', capacitance: 3000 },
      { id: 'pricing-engine', capacitance: 2500 },
      { id: 'facet-commerce', capacitance: 3000 },
      { id: 'index-designer', capacitance: 2000 },
      { id: 'mongoose', capacitance: 1500 }
    ];

    nodes.forEach(node => {
      this.network.registerNode(node.id, node.capacitance);
    });

    console.log(`[${this.machineIdentity}] Registered ${nodes.length} network nodes`);
  }

  /**
   * Process user contribution and mint tokens
   * @param {string} userId - User identifier
   * @param {string} contributionType - Type of contribution
   * @param {object} metadata - Contribution metadata
   * @returns {Promise<object>} Processing result
   */
  async processContribution(userId, contributionType, metadata = {}) {
    console.log(`[${this.machineIdentity}] Processing contribution: ${contributionType} by ${userId}`);

    try {
      // Mint tokens
      const mintResult = this.minting.mint(userId, contributionType, metadata);

      // Distribute to user
      const distResult = this.distribution.distribute(
        userId,
        mintResult.transaction.amount,
        `Reward for ${contributionType}`
      );

      // Document the transaction
      await this.writer.writeTransaction({
        type: 'contribution',
        userId,
        contributionType,
        mintResult,
        distResult,
        timestamp: new Date().toISOString()
      });

      // Trigger cascade for content flow
      const cascadeResult = await this.cascade.trigger('content_flow', {
        userId,
        contributionType,
        amount: mintResult.transaction.amount
      });

      return {
        success: true,
        userId,
        contributionType,
        tokensEarned: mintResult.transaction.amount,
        newBalance: distResult.newBalance,
        cascadeId: cascadeResult.chain?.id,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`[${this.machineIdentity}] Error processing contribution:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process purchase transaction
   * @param {string} buyerId - Buyer user ID
   * @param {string} itemId - Item identifier
   * @param {number} cost - Purchase cost in ALC
   * @returns {Promise<object>} Processing result
   */
  async processPurchase(buyerId, itemId, cost) {
    console.log(`[${this.machineIdentity}] Processing purchase: ${itemId} by ${buyerId} for ${cost} ALC`);

    try {
      // Check balance and spend tokens
      const spendResult = this.distribution.spend(buyerId, 'purchase', cost);

      if (!spendResult.success) {
        return spendResult;
      }

      // Document the transaction
      await this.writer.writeTransaction({
        type: 'purchase',
        buyerId,
        itemId,
        cost,
        spendResult,
        timestamp: new Date().toISOString()
      });

      // Trigger commerce cascade (8-step automated flow)
      const cascadeResult = await this.cascade.trigger('commerce_flow', {
        purchaseId: `PUR-${Date.now()}`,
        buyerId,
        itemId,
        cost
      });

      return {
        success: true,
        buyerId,
        itemId,
        cost,
        newBalance: spendResult.newBalance,
        cascadeId: cascadeResult.chain?.id,
        receipt: cascadeResult.chain,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`[${this.machineIdentity}] Error processing purchase:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get comprehensive hub statistics
   * @returns {object} Hub statistics
   */
  getHubStatistics() {
    return {
      machineIdentity: this.machineIdentity,
      version: this.version,
      status: this.status,
      timestamp: new Date().toISOString(),
      
      tokens: this.minting.getStatistics(),
      distribution: this.distribution.getStatistics(),
      
      network: {
        bonds: this.bonds.getStatistics(),
        capacitance: this.network.getStatistics(),
        connections: this.connector.getStatistics()
      },
      
      routing: this.router.getStatistics(),
      
      automation: {
        cascade: this.cascade.getStatistics(),
        robotic: this.automation.getStatistics()
      },
      
      documentation: {
        writer: this.writer.getStatistics(),
        backup: this.backup.getStatistics()
      }
    };
  }

  /**
   * Perform health check on all systems
   * @returns {object} Health check result
   */
  healthCheck() {
    console.log(`[${this.machineIdentity}] Running health check...`);

    const health = {
      overall: 'healthy',
      timestamp: new Date().toISOString(),
      components: {
        tokens: this.minting.totalSupply >= 0,
        network: this.bonds.activeBonds >= 0,
        routing: this.router.routes.size > 0,
        automation: this.automation.enabled,
        documentation: this.writer.locations.length === 8
      }
    };

    // Check for issues
    const issues = [];
    const stats = this.getHubStatistics();

    if (stats.network.bonds.activeBonds < 5) {
      issues.push('Low active bond count');
    }

    if (stats.automation.cascade.successRate < 0.9) {
      issues.push('Low cascade success rate');
    }

    if (stats.documentation.backup.successRate < 0.95) {
      issues.push('Low backup success rate');
    }

    health.issues = issues;
    health.overall = issues.length === 0 ? 'healthy' : 'degraded';

    console.log(`[${this.machineIdentity}] Health check complete: ${health.overall}`);
    
    return health;
  }

  /**
   * Create full system backup
   * @returns {Promise<object>} Backup result
   */
  async createSystemBackup() {
    console.log(`[${this.machineIdentity}] Creating system backup...`);

    const backupData = {
      timestamp: new Date().toISOString(),
      statistics: this.getHubStatistics(),
      health: this.healthCheck()
    };

    const result = await this.backup.createBackup('system_snapshot', backupData);
    
    console.log(`[${this.machineIdentity}] System backup completed: ${result.backupId}`);
    
    return result;
  }

  /**
   * Broadcast message to all connected repositories
   * @param {object} message - Message to broadcast
   * @returns {Promise<object>} Broadcast result
   */
  async broadcast(message) {
    console.log(`[${this.machineIdentity}] Broadcasting message to network...`);
    
    return await this.connector.broadcast({
      from: this.machineIdentity,
      timestamp: new Date().toISOString(),
      ...message
    });
  }
}

// Export the Token Hub
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TokenHub;
}

// Example usage when run directly
if (require.main === module) {
  console.log('='.repeat(60));
  console.log('💰 TOKEN HUB - CENTRAL COMMAND');
  console.log('Machine Identity: TOKEN_HUB');
  console.log('='.repeat(60));
  console.log('');

  // Initialize hub
  const hub = new TokenHub();
  
  // Show statistics
  console.log('\n📊 Initial Statistics:');
  const stats = hub.getHubStatistics();
  console.log(`  Total ALC Supply: ${stats.tokens.totalSupply}`);
  console.log(`  Active Connections: ${stats.network.connections.activeConnections}`);
  console.log(`  Hydrogen Bonds: ${stats.network.bonds.activeBonds}`);
  console.log(`  Network Capacitance: ${stats.network.capacitance.totalCapacitance} ALC`);
  console.log(`  Automation Status: ${stats.automation.robotic.enabled ? 'ENABLED' : 'DISABLED'}`);

  // Health check
  console.log('\n❤️ Health Check:');
  const health = hub.healthCheck();
  console.log(`  Overall Status: ${health.overall.toUpperCase()}`);
  console.log(`  Issues: ${health.issues.length === 0 ? 'None' : health.issues.join(', ')}`);

  console.log('\n✅ Token Hub is operational and ready for transactions');
  console.log('='.repeat(60));
}
