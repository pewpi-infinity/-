/**
 * Andy Lian Coin (ALC) Distribution System
 * Handles token distribution, rewards, and spending
 */

class ALCDistribution {
  constructor(mintingSystem) {
    this.mintingSystem = mintingSystem;
    this.distributionQueue = [];
    this.spendingHistory = [];
    this.userBalances = new Map();
  }

  /**
   * Distribute tokens to user
   * @param {string} userId - User identifier
   * @param {number} amount - Amount to distribute
   * @param {string} reason - Distribution reason
   * @returns {object} Distribution result
   */
  distribute(userId, amount, reason) {
    const timestamp = new Date().toISOString();
    
    const distribution = {
      id: this.generateDistributionId(),
      timestamp,
      userId,
      amount,
      reason,
      status: 'completed'
    };

    // Update user balance
    const currentBalance = this.userBalances.get(userId) || 0;
    this.userBalances.set(userId, currentBalance + amount);

    // Add to queue
    this.distributionQueue.push(distribution);

    return {
      success: true,
      distribution,
      newBalance: this.userBalances.get(userId)
    };
  }

  /**
   * Process spending request
   * @param {string} userId - User identifier
   * @param {string} spendingType - Type of spending
   * @param {number} amount - Amount to spend
   * @returns {object} Spending result
   */
  spend(userId, spendingType, amount) {
    const timestamp = new Date().toISOString();
    const currentBalance = this.userBalances.get(userId) || 0;

    // Check balance
    if (currentBalance < amount) {
      return {
        success: false,
        error: 'Insufficient balance',
        currentBalance,
        required: amount
      };
    }

    // Process spending
    const spending = {
      id: this.generateSpendingId(),
      timestamp,
      userId,
      spendingType,
      amount,
      status: 'completed'
    };

    // Update balance
    this.userBalances.set(userId, currentBalance - amount);
    
    // Record spending
    this.spendingHistory.push(spending);

    return {
      success: true,
      spending,
      newBalance: this.userBalances.get(userId),
      service: spendingType
    };
  }

  /**
   * Get user balance
   * @param {string} userId - User identifier
   * @returns {number} User balance
   */
  getBalance(userId) {
    return this.userBalances.get(userId) || 0;
  }

  /**
   * Transfer tokens between users
   * @param {string} fromUserId - Sender user ID
   * @param {string} toUserId - Recipient user ID
   * @param {number} amount - Amount to transfer
   * @returns {object} Transfer result
   */
  transfer(fromUserId, toUserId, amount) {
    const timestamp = new Date().toISOString();
    const senderBalance = this.userBalances.get(fromUserId) || 0;

    // Validate transfer
    if (senderBalance < amount) {
      return {
        success: false,
        error: 'Insufficient balance'
      };
    }

    // Process transfer
    this.userBalances.set(fromUserId, senderBalance - amount);
    const recipientBalance = this.userBalances.get(toUserId) || 0;
    this.userBalances.set(toUserId, recipientBalance + amount);

    const transfer = {
      id: this.generateTransferId(),
      timestamp,
      fromUserId,
      toUserId,
      amount,
      status: 'completed'
    };

    return {
      success: true,
      transfer,
      senderBalance: this.userBalances.get(fromUserId),
      recipientBalance: this.userBalances.get(toUserId)
    };
  }

  /**
   * Get distribution statistics
   * @returns {object} Distribution statistics
   */
  getStatistics() {
    const totalDistributed = this.distributionQueue.reduce(
      (sum, d) => sum + d.amount, 
      0
    );
    
    const totalSpent = this.spendingHistory.reduce(
      (sum, s) => sum + s.amount, 
      0
    );

    const totalBalance = Array.from(this.userBalances.values()).reduce(
      (sum, balance) => sum + balance, 
      0
    );

    return {
      totalDistributed,
      totalSpent,
      totalBalance,
      activeUsers: this.userBalances.size,
      distributionCount: this.distributionQueue.length,
      spendingCount: this.spendingHistory.length
    };
  }

  /**
   * Get top holders
   * @param {number} limit - Number of top holders to return
   * @returns {array} Top holders list
   */
  getTopHolders(limit = 10) {
    const holders = Array.from(this.userBalances.entries())
      .map(([userId, balance]) => ({ userId, balance }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit);

    return holders;
  }

  /**
   * Process reward distribution for activity
   * @param {string} userId - User identifier
   * @param {string} activityType - Type of activity
   * @returns {object} Reward result
   */
  rewardActivity(userId, activityType) {
    // Get reward amount from minting system config
    const config = this.mintingSystem.config;
    const rewardAmount = config.minting_rules[activityType]?.reward || 0;

    if (rewardAmount === 0) {
      return {
        success: false,
        error: 'Invalid activity type'
      };
    }

    return this.distribute(userId, rewardAmount, `Reward for ${activityType}`);
  }

  /**
   * Generate distribution ID
   * @returns {string} Distribution ID
   */
  generateDistributionId() {
    return `DIST-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate spending ID
   * @returns {string} Spending ID
   */
  generateSpendingId() {
    return `SPEND-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate transfer ID
   * @returns {string} Transfer ID
   */
  generateTransferId() {
    return `XFER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ALCDistribution;
}
