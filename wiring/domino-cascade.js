/**
 * Domino Cascade System
 * Implements automated domino effect for transaction propagation
 */

class DominoCascade {
  constructor(router, connector) {
    this.router = router;
    this.connector = connector;
    this.cascades = new Map();
    this.activeChains = [];
    this.completedChains = [];
    this.loadCascadeDefinitions();
  }

  /**
   * Load cascade definitions from configuration
   */
  loadCascadeDefinitions() {
    // In real implementation, load from .infinity/domino-system.json
    this.cascades.set('commerce_flow', {
      description: 'Purchase transaction cascade',
      steps: [
        { order: 1, action: 'commerce_collect_tokens', target: 'facet-commerce', timeout_ms: 5000 },
        { order: 2, action: 'hub_record_transaction', target: 'dash_hub', timeout_ms: 3000 },
        { order: 3, action: 'mint_receipt_token', target: 'token-mint', timeout_ms: 5000 },
        { order: 4, action: 'pricing_adjust_value', target: 'pricing-engine', timeout_ms: 3000 },
        { order: 5, action: 'index_update_catalog', target: 'index-designer', timeout_ms: 4000 },
        { order: 6, action: 'mongoose_learn_pattern', target: 'mongoose', timeout_ms: 2000 },
        { order: 7, action: 'documentation_backup', target: 'documentation', timeout_ms: 3000 },
        { order: 8, action: 'loop_continue', target: 'system', timeout_ms: 1000 }
      ],
      on_error: 'continue_with_next',
      retry_failed: true
    });

    this.cascades.set('token_flow', {
      description: 'Token creation cascade',
      steps: [
        { order: 1, action: 'validate_token', target: 'token-mint', timeout_ms: 2000 },
        { order: 2, action: 'record_in_hub', target: 'dash_hub', timeout_ms: 2000 },
        { order: 3, action: 'update_pricing', target: 'pricing-engine', timeout_ms: 2000 },
        { order: 4, action: 'notify_network', target: 'ALL_REPOS', timeout_ms: 5000 }
      ],
      on_error: 'rollback',
      retry_failed: true
    });

    console.log('[DominoCascade] Loaded cascade definitions:', this.cascades.size);
  }

  /**
   * Trigger a cascade
   * @param {string} cascadeName - Name of the cascade
   * @param {object} triggerData - Data that triggered the cascade
   * @returns {Promise<object>} Cascade result
   */
  async trigger(cascadeName, triggerData) {
    const cascade = this.cascades.get(cascadeName);
    
    if (!cascade) {
      return {
        success: false,
        error: `Cascade not found: ${cascadeName}`
      };
    }

    const chainId = this.generateChainId();
    const timestamp = new Date().toISOString();

    const chain = {
      id: chainId,
      cascadeName,
      status: 'running',
      startTime: timestamp,
      triggerData,
      steps: [],
      currentStep: 0,
      totalSteps: cascade.steps.length
    };

    this.activeChains.push(chain);

    console.log(`[DominoCascade] Starting cascade: ${cascadeName} (${chainId})`);

    try {
      // Execute steps in order
      for (const step of cascade.steps) {
        const stepResult = await this.executeStep(step, chain, triggerData);
        chain.steps.push(stepResult);
        chain.currentStep++;

        if (!stepResult.success && cascade.on_error === 'rollback') {
          // Rollback on error
          await this.rollback(chain);
          chain.status = 'rolled_back';
          break;
        }

        if (!stepResult.success && !cascade.retry_failed) {
          // Stop on error without retry
          chain.status = 'failed';
          break;
        }

        if (!stepResult.success && cascade.retry_failed) {
          // Retry failed step
          const retryResult = await this.retryStep(step, chain, triggerData);
          if (!retryResult.success) {
            chain.status = 'failed';
            break;
          }
        }
      }

      if (chain.status === 'running') {
        chain.status = 'completed';
      }

      chain.endTime = new Date().toISOString();
      chain.duration = new Date(chain.endTime) - new Date(chain.startTime);

      // Move to completed
      this.activeChains = this.activeChains.filter(c => c.id !== chainId);
      this.completedChains.push(chain);

      console.log(`[DominoCascade] Cascade ${chain.status}: ${cascadeName} (${chain.duration}ms)`);

      return {
        success: chain.status === 'completed',
        chain,
        timestamp: chain.endTime
      };

    } catch (error) {
      chain.status = 'error';
      chain.error = error.message;
      chain.endTime = new Date().toISOString();

      return {
        success: false,
        error: error.message,
        chain
      };
    }
  }

  /**
   * Execute a single cascade step
   * @param {object} step - Step definition
   * @param {object} chain - Chain context
   * @param {object} data - Step data
   * @returns {Promise<object>} Step result
   */
  async executeStep(step, chain, data) {
    const startTime = Date.now();
    
    console.log(`[DominoCascade] Executing step ${step.order}: ${step.action} -> ${step.target}`);

    try {
      let result;

      if (step.target === 'system') {
        // System internal action
        result = await this.executeSystemAction(step.action, data);
      } else if (step.target === 'ALL_REPOS') {
        // Broadcast to all repositories
        result = await this.connector.broadcast({
          action: step.action,
          data,
          chainId: chain.id
        });
      } else {
        // Route to specific target
        result = await this.connector.send(step.target, {
          action: step.action,
          data,
          chainId: chain.id
        });
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        step: step.order,
        action: step.action,
        target: step.target,
        duration,
        result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        step: step.order,
        action: step.action,
        target: step.target,
        duration,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Retry a failed step
   * @param {object} step - Step definition
   * @param {object} chain - Chain context
   * @param {object} data - Step data
   * @returns {Promise<object>} Retry result
   */
  async retryStep(step, chain, data) {
    console.log(`[DominoCascade] Retrying step ${step.order}: ${step.action}`);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return await this.executeStep(step, chain, data);
  }

  /**
   * Rollback a cascade chain
   * @param {object} chain - Chain to rollback
   * @returns {Promise<object>} Rollback result
   */
  async rollback(chain) {
    console.log(`[DominoCascade] Rolling back chain: ${chain.id}`);
    
    // Execute rollback steps in reverse order
    const completedSteps = chain.steps.filter(s => s.success);
    
    for (const step of completedSteps.reverse()) {
      // Execute rollback action
      console.log(`[DominoCascade] Rolling back step ${step.step}: ${step.action}`);
      // In real implementation: execute actual rollback
    }

    return {
      success: true,
      rolledBackSteps: completedSteps.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute system internal action
   * @param {string} action - Action name
   * @param {object} data - Action data
   * @returns {Promise<object>} Action result
   */
  async executeSystemAction(action, data) {
    // Simulate system action
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          action,
          timestamp: new Date().toISOString()
        });
      }, 100);
    });
  }

  /**
   * Get cascade statistics
   * @returns {object} Statistics
   */
  getStatistics() {
    const completedSuccessfully = this.completedChains.filter(
      c => c.status === 'completed'
    ).length;

    const failed = this.completedChains.filter(
      c => c.status === 'failed' || c.status === 'error'
    ).length;

    const rolledBack = this.completedChains.filter(
      c => c.status === 'rolled_back'
    ).length;

    const averageDuration = this.completedChains
      .filter(c => c.duration)
      .reduce((sum, c) => sum + c.duration, 0) / 
      (this.completedChains.length || 1);

    return {
      totalCascades: this.cascades.size,
      activeCascades: this.activeChains.length,
      completedCascades: this.completedChains.length,
      successfulCascades: completedSuccessfully,
      failedCascades: failed,
      rolledBackCascades: rolledBack,
      successRate: completedSuccessfully / this.completedChains.length || 0,
      averageDuration: Math.round(averageDuration)
    };
  }

  /**
   * Generate chain ID
   * @returns {string} Chain ID
   */
  generateChainId() {
    return `CHAIN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get active chains
   * @returns {array} Active chains
   */
  getActiveChains() {
    return [...this.activeChains];
  }

  /**
   * Get completed chains
   * @param {number} limit - Number of chains to return
   * @returns {array} Completed chains
   */
  getCompletedChains(limit = 50) {
    return this.completedChains.slice(-limit);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DominoCascade;
}
