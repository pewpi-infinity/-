/**
 * Hydrogen Bonds System
 * Implements weak hydrogen bonding for website-to-website connections
 */

class HydrogenBonds {
  constructor() {
    this.bonds = new Map();
    this.bondStrengths = {
      weak: 1,
      medium: 5,
      strong: 10
    };
    this.activeBonds = 0;
    this.totalCapacitance = 0;
  }

  /**
   * Create a hydrogen bond between two nodes
   * @param {string} source - Source node
   * @param {string} target - Target node
   * @param {string} strength - Bond strength (weak/medium/strong)
   * @returns {object} Bond creation result
   */
  createBond(source, target, strength = 'weak') {
    const bondId = this.generateBondId(source, target);
    const timestamp = new Date().toISOString();
    
    const bond = {
      id: bondId,
      source,
      target,
      strength,
      strengthValue: this.bondStrengths[strength],
      type: 'hydrogen',
      status: 'active',
      createdAt: timestamp,
      lastActivity: timestamp,
      transmissionCount: 0,
      capacitance: this.calculateCapacitance(strength),
      resistance: this.calculateResistance(strength)
    };

    this.bonds.set(bondId, bond);
    this.activeBonds++;
    this.totalCapacitance += bond.capacitance;

    console.log(`[HydrogenBonds] Created ${strength} bond: ${source} ⟷ ${target}`);
    
    return {
      success: true,
      bond,
      timestamp
    };
  }

  /**
   * Break a hydrogen bond
   * @param {string} bondId - Bond identifier
   * @returns {object} Bond breaking result
   */
  breakBond(bondId) {
    const bond = this.bonds.get(bondId);
    
    if (!bond) {
      return {
        success: false,
        error: `Bond not found: ${bondId}`
      };
    }

    bond.status = 'broken';
    bond.brokenAt = new Date().toISOString();
    
    this.activeBonds--;
    this.totalCapacitance -= bond.capacitance;
    
    this.bonds.set(bondId, bond);
    
    console.log(`[HydrogenBonds] Broken bond: ${bondId}`);
    
    return {
      success: true,
      bondId,
      timestamp: bond.brokenAt
    };
  }

  /**
   * Transmit data through hydrogen bond
   * @param {string} bondId - Bond identifier
   * @param {object} data - Data to transmit
   * @returns {Promise<object>} Transmission result
   */
  async transmit(bondId, data) {
    const bond = this.bonds.get(bondId);
    
    if (!bond) {
      return {
        success: false,
        error: `Bond not found: ${bondId}`
      };
    }

    if (bond.status !== 'active') {
      return {
        success: false,
        error: `Bond not active: ${bondId}`
      };
    }

    // Simulate transmission with resistance
    const transmissionTime = this.calculateTransmissionTime(bond);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update bond activity
        bond.lastActivity = new Date().toISOString();
        bond.transmissionCount++;
        this.bonds.set(bondId, bond);

        resolve({
          success: true,
          bondId,
          source: bond.source,
          target: bond.target,
          transmissionTime,
          bondStrength: bond.strength,
          timestamp: new Date().toISOString()
        });
      }, transmissionTime);
    });
  }

  /**
   * Calculate bond capacitance
   * @param {string} strength - Bond strength
   * @returns {number} Capacitance value
   */
  calculateCapacitance(strength) {
    const baseCapacitance = 100;
    return baseCapacitance * this.bondStrengths[strength];
  }

  /**
   * Calculate bond resistance
   * @param {string} strength - Bond strength
   * @returns {number} Resistance value (lower is better)
   */
  calculateResistance(strength) {
    const baseResistance = 10;
    return baseResistance / this.bondStrengths[strength];
  }

  /**
   * Calculate transmission time based on resistance
   * @param {object} bond - Bond object
   * @returns {number} Transmission time in milliseconds
   */
  calculateTransmissionTime(bond) {
    // Faster transmission with lower resistance
    return Math.round(bond.resistance * 10);
  }

  /**
   * Get collective bond strength
   * @returns {number} Total collective strength
   */
  getCollectiveStrength() {
    let totalStrength = 0;
    
    for (const bond of this.bonds.values()) {
      if (bond.status === 'active') {
        totalStrength += bond.strengthValue;
      }
    }

    return totalStrength;
  }

  /**
   * Get bonds by node
   * @param {string} node - Node name
   * @returns {array} Bonds connected to the node
   */
  getBondsByNode(node) {
    const nodeBonds = [];
    
    for (const bond of this.bonds.values()) {
      if (bond.source === node || bond.target === node) {
        nodeBonds.push(bond);
      }
    }

    return nodeBonds;
  }

  /**
   * Get active bonds
   * @returns {array} List of active bonds
   */
  getActiveBonds() {
    return Array.from(this.bonds.values())
      .filter(b => b.status === 'active');
  }

  /**
   * Get bond statistics
   * @returns {object} Bond statistics
   */
  getStatistics() {
    const activeBonds = this.getActiveBonds();
    const totalTransmissions = Array.from(this.bonds.values())
      .reduce((sum, bond) => sum + bond.transmissionCount, 0);

    const averageResistance = activeBonds.reduce(
      (sum, bond) => sum + bond.resistance, 
      0
    ) / (activeBonds.length || 1);

    return {
      totalBonds: this.bonds.size,
      activeBonds: activeBonds.length,
      collectiveStrength: this.getCollectiveStrength(),
      totalCapacitance: this.totalCapacitance,
      averageResistance: Math.round(averageResistance * 100) / 100,
      totalTransmissions,
      bondTypes: {
        weak: activeBonds.filter(b => b.strength === 'weak').length,
        medium: activeBonds.filter(b => b.strength === 'medium').length,
        strong: activeBonds.filter(b => b.strength === 'strong').length
      }
    };
  }

  /**
   * Strengthen a bond
   * @param {string} bondId - Bond identifier
   * @returns {object} Strengthening result
   */
  strengthenBond(bondId) {
    const bond = this.bonds.get(bondId);
    
    if (!bond) {
      return {
        success: false,
        error: `Bond not found: ${bondId}`
      };
    }

    const strengths = ['weak', 'medium', 'strong'];
    const currentIndex = strengths.indexOf(bond.strength);
    
    if (currentIndex < strengths.length - 1) {
      const oldCapacitance = bond.capacitance;
      bond.strength = strengths[currentIndex + 1];
      bond.strengthValue = this.bondStrengths[bond.strength];
      bond.capacitance = this.calculateCapacitance(bond.strength);
      bond.resistance = this.calculateResistance(bond.strength);
      
      this.totalCapacitance += (bond.capacitance - oldCapacitance);
      this.bonds.set(bondId, bond);
      
      return {
        success: true,
        bondId,
        newStrength: bond.strength,
        newCapacitance: bond.capacitance,
        newResistance: bond.resistance
      };
    }

    return {
      success: false,
      error: 'Already at maximum strength'
    };
  }

  /**
   * Generate unique bond ID
   * @param {string} source - Source node
   * @param {string} target - Target node
   * @returns {string} Bond ID
   */
  generateBondId(source, target) {
    return `BOND-${source}-${target}-${Date.now()}`;
  }

  /**
   * Repair broken bonds (simulate self-healing)
   * @returns {object} Repair result
   */
  repairBonds() {
    let repairedCount = 0;
    
    for (const bond of this.bonds.values()) {
      if (bond.status === 'broken') {
        bond.status = 'active';
        bond.repairedAt = new Date().toISOString();
        this.bonds.set(bond.id, bond);
        this.activeBonds++;
        this.totalCapacitance += bond.capacitance;
        repairedCount++;
      }
    }

    console.log(`[HydrogenBonds] Repaired ${repairedCount} bonds`);
    
    return {
      success: true,
      repairedCount,
      timestamp: new Date().toISOString()
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HydrogenBonds;
}
