/**
 * Andy Lian Coin (ALC) Minting System
 * Handles token creation based on user contributions
 */

class ALCMinting {
  constructor(config) {
    this.config = config || this.loadConfig();
    this.totalSupply = 0;
    this.mintingHistory = [];
  }

  loadConfig() {
    // In a real implementation, this would load from andy-lian-coin.json
    return {
      name: "Andy Lian Coin",
      symbol: "💰ALC",
      decimals: 2,
      minting_rules: {
        content_creation: { reward: 10 },
        feature_building: { reward: 50 },
        helping_others: { reward: 5 },
        task_completion: { reward: 20 }
      }
    };
  }

  /**
   * Mint new ALC tokens based on contribution type
   * @param {string} userId - User identifier
   * @param {string} contributionType - Type of contribution
   * @param {object} metadata - Additional contribution metadata
   * @returns {object} Minting result with transaction details
   */
  mint(userId, contributionType, metadata = {}) {
    const timestamp = new Date().toISOString();
    
    // Validate contribution type
    if (!this.config.minting_rules[contributionType]) {
      throw new Error(`Invalid contribution type: ${contributionType}`);
    }

    // Get reward amount
    const rewardAmount = this.config.minting_rules[contributionType].reward;
    
    // Create transaction
    const transaction = {
      txId: this.generateTransactionId(),
      timestamp,
      userId,
      contributionType,
      amount: rewardAmount,
      metadata,
      status: 'confirmed'
    };

    // Update total supply
    this.totalSupply += rewardAmount;
    
    // Record in history
    this.mintingHistory.push(transaction);

    // Trigger cascade effect
    this.triggerCascade(transaction);

    return {
      success: true,
      transaction,
      newBalance: this.getUserBalance(userId),
      totalSupply: this.totalSupply
    };
  }

  /**
   * Batch mint tokens for multiple contributions
   * @param {array} contributions - Array of contribution objects
   * @returns {object} Batch minting results
   */
  batchMint(contributions) {
    const results = [];
    let totalMinted = 0;

    for (const contribution of contributions) {
      try {
        const result = this.mint(
          contribution.userId,
          contribution.type,
          contribution.metadata
        );
        results.push(result);
        totalMinted += result.transaction.amount;
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          contribution
        });
      }
    }

    return {
      success: true,
      totalMinted,
      results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get user's token balance
   * @param {string} userId - User identifier
   * @returns {number} User's token balance
   */
  getUserBalance(userId) {
    return this.mintingHistory
      .filter(tx => tx.userId === userId)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Get minting statistics
   * @returns {object} Minting statistics
   */
  getStatistics() {
    const contributionTypes = {};
    
    for (const tx of this.mintingHistory) {
      if (!contributionTypes[tx.contributionType]) {
        contributionTypes[tx.contributionType] = {
          count: 0,
          totalAmount: 0
        };
      }
      contributionTypes[tx.contributionType].count++;
      contributionTypes[tx.contributionType].totalAmount += tx.amount;
    }

    return {
      totalSupply: this.totalSupply,
      totalTransactions: this.mintingHistory.length,
      contributionTypes,
      averageReward: this.totalSupply / this.mintingHistory.length || 0
    };
  }

  /**
   * Generate unique transaction ID
   * @returns {string} Transaction ID
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `ALC-${timestamp}-${random}`;
  }

  /**
   * Trigger domino cascade effect
   * @param {object} transaction - Transaction details
   */
  triggerCascade(transaction) {
    // This would integrate with the domino system
    console.log(`[ALC] Triggering cascade for transaction: ${transaction.txId}`);
    // In real implementation: emit event for cascade system
  }

  /**
   * Validate minting request
   * @param {string} userId - User identifier
   * @param {string} contributionType - Contribution type
   * @returns {boolean} Validation result
   */
  validateMintingRequest(userId, contributionType) {
    if (!userId || typeof userId !== 'string') {
      return false;
    }
    
    if (!this.config.minting_rules[contributionType]) {
      return false;
    }

    return true;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ALCMinting;
}
