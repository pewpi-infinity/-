/**
 * Capacitance Network
 * Distributed storage system based on capacitor model
 */

class CapacitanceNetwork {
  constructor(hydrogenBonds) {
    this.hydrogenBonds = hydrogenBonds;
    this.nodes = new Map();
    this.chargeHistory = [];
    this.dischargeHistory = [];
    this.totalNetworkCapacitance = 0;
  }

  /**
   * Register a node as a capacitor
   * @param {string} nodeId - Node identifier
   * @param {number} capacitance - Initial capacitance value
   * @returns {object} Registration result
   */
  registerNode(nodeId, capacitance = 1000) {
    const timestamp = new Date().toISOString();
    
    const node = {
      id: nodeId,
      capacitance,
      currentCharge: 0,
      maxCharge: capacitance * 10,
      voltage: 0,
      status: 'active',
      registeredAt: timestamp,
      lastActivity: timestamp,
      chargeCount: 0,
      dischargeCount: 0
    };

    this.nodes.set(nodeId, node);
    this.totalNetworkCapacitance += capacitance;

    console.log(`[CapacitanceNetwork] Registered node: ${nodeId}`);
    
    return {
      success: true,
      node,
      timestamp
    };
  }

  /**
   * Charge a node (store tokens/data)
   * @param {string} nodeId - Node identifier
   * @param {number} amount - Charge amount
   * @returns {object} Charging result
   */
  charge(nodeId, amount) {
    const node = this.nodes.get(nodeId);
    
    if (!node) {
      return {
        success: false,
        error: `Node not found: ${nodeId}`
      };
    }

    const timestamp = new Date().toISOString();
    const newCharge = node.currentCharge + amount;

    // Check capacity
    if (newCharge > node.maxCharge) {
      return {
        success: false,
        error: 'Node capacity exceeded',
        currentCharge: node.currentCharge,
        maxCharge: node.maxCharge,
        attemptedCharge: amount
      };
    }

    // Update node
    node.currentCharge = newCharge;
    node.voltage = this.calculateVoltage(node);
    node.lastActivity = timestamp;
    node.chargeCount++;
    
    this.nodes.set(nodeId, node);

    // Record in history
    this.chargeHistory.push({
      nodeId,
      amount,
      newCharge,
      timestamp
    });

    return {
      success: true,
      nodeId,
      chargedAmount: amount,
      currentCharge: node.currentCharge,
      voltage: node.voltage,
      capacityUsed: (node.currentCharge / node.maxCharge) * 100,
      timestamp
    };
  }

  /**
   * Discharge a node (transfer tokens/data)
   * @param {string} nodeId - Node identifier
   * @param {number} amount - Discharge amount
   * @returns {object} Discharging result
   */
  discharge(nodeId, amount) {
    const node = this.nodes.get(nodeId);
    
    if (!node) {
      return {
        success: false,
        error: `Node not found: ${nodeId}`
      };
    }

    const timestamp = new Date().toISOString();

    // Check available charge
    if (node.currentCharge < amount) {
      return {
        success: false,
        error: 'Insufficient charge',
        currentCharge: node.currentCharge,
        requested: amount
      };
    }

    // Update node
    node.currentCharge -= amount;
    node.voltage = this.calculateVoltage(node);
    node.lastActivity = timestamp;
    node.dischargeCount++;
    
    this.nodes.set(nodeId, node);

    // Record in history
    this.dischargeHistory.push({
      nodeId,
      amount,
      newCharge: node.currentCharge,
      timestamp
    });

    return {
      success: true,
      nodeId,
      dischargedAmount: amount,
      currentCharge: node.currentCharge,
      voltage: node.voltage,
      timestamp
    };
  }

  /**
   * Transfer charge between nodes
   * @param {string} sourceId - Source node
   * @param {string} targetId - Target node
   * @param {number} amount - Transfer amount
   * @returns {Promise<object>} Transfer result
   */
  async transfer(sourceId, targetId, amount) {
    // Discharge from source
    const dischargeResult = this.discharge(sourceId, amount);
    
    if (!dischargeResult.success) {
      return dischargeResult;
    }

    // Check if hydrogen bond exists
    const bonds = this.hydrogenBonds.getBondsByNode(sourceId);
    const targetBond = bonds.find(b => 
      (b.source === sourceId && b.target === targetId) ||
      (b.target === sourceId && b.source === targetId)
    );

    if (!targetBond) {
      // Rollback discharge
      this.charge(sourceId, amount);
      return {
        success: false,
        error: 'No hydrogen bond exists between nodes'
      };
    }

    // Transmit through bond
    await this.hydrogenBonds.transmit(targetBond.id, { amount });

    // Charge target
    const chargeResult = this.charge(targetId, amount);
    
    if (!chargeResult.success) {
      // Rollback discharge
      this.charge(sourceId, amount);
      return {
        success: false,
        error: 'Target node capacity exceeded',
        details: chargeResult
      };
    }

    return {
      success: true,
      sourceId,
      targetId,
      amount,
      bondId: targetBond.id,
      sourceCharge: this.nodes.get(sourceId).currentCharge,
      targetCharge: this.nodes.get(targetId).currentCharge,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate voltage from charge and capacitance
   * V = Q / C
   * @param {object} node - Node object
   * @returns {number} Voltage
   */
  calculateVoltage(node) {
    if (node.capacitance === 0) return 0;
    return node.currentCharge / node.capacitance;
  }

  /**
   * Balance network load across nodes
   * @returns {object} Balancing result
   */
  balanceNetwork() {
    const activeNodes = Array.from(this.nodes.values())
      .filter(n => n.status === 'active');

    if (activeNodes.length === 0) {
      return {
        success: false,
        error: 'No active nodes'
      };
    }

    // Calculate average charge
    const totalCharge = activeNodes.reduce((sum, n) => sum + n.currentCharge, 0);
    const averageCharge = totalCharge / activeNodes.length;

    let transferCount = 0;
    const transfers = [];

    // Balance charges
    for (const node of activeNodes) {
      const difference = node.currentCharge - averageCharge;
      
      if (Math.abs(difference) > averageCharge * 0.1) {
        // Significant imbalance
        node.currentCharge = averageCharge;
        node.voltage = this.calculateVoltage(node);
        this.nodes.set(node.id, node);
        transferCount++;
        
        transfers.push({
          nodeId: node.id,
          oldCharge: node.currentCharge,
          newCharge: averageCharge,
          difference
        });
      }
    }

    console.log(`[CapacitanceNetwork] Balanced ${transferCount} nodes`);

    return {
      success: true,
      transferCount,
      averageCharge,
      transfers,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get network statistics
   * @returns {object} Network statistics
   */
  getStatistics() {
    const activeNodes = Array.from(this.nodes.values())
      .filter(n => n.status === 'active');

    const totalCharge = activeNodes.reduce((sum, n) => sum + n.currentCharge, 0);
    const averageCharge = totalCharge / activeNodes.length || 0;
    const totalMaxCharge = activeNodes.reduce((sum, n) => sum + n.maxCharge, 0);

    return {
      totalNodes: this.nodes.size,
      activeNodes: activeNodes.length,
      totalCapacitance: this.totalNetworkCapacitance,
      totalCharge,
      averageCharge: Math.round(averageCharge * 100) / 100,
      totalMaxCharge,
      utilizationPercent: (totalCharge / totalMaxCharge) * 100 || 0,
      totalChargeEvents: this.chargeHistory.length,
      totalDischargeEvents: this.dischargeHistory.length
    };
  }

  /**
   * Get node status
   * @param {string} nodeId - Node identifier
   * @returns {object} Node status
   */
  getNodeStatus(nodeId) {
    const node = this.nodes.get(nodeId);
    
    if (!node) {
      return {
        found: false,
        error: `Node not found: ${nodeId}`
      };
    }

    const utilization = (node.currentCharge / node.maxCharge) * 100;
    const efficiency = node.chargeCount / (node.chargeCount + node.dischargeCount) || 0;

    return {
      found: true,
      ...node,
      utilization,
      efficiency,
      available: node.maxCharge - node.currentCharge
    };
  }

  /**
   * Get all nodes
   * @returns {array} List of all nodes
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CapacitanceNetwork;
}
