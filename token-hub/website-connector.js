/**
 * Website Connector
 * Manages hydrogen bonding connections between websites
 */

class WebsiteConnector {
  constructor(router) {
    this.router = router;
    this.connections = new Map();
    this.connectionHealth = new Map();
    this.initializeConnections();
  }

  /**
   * Initialize all website connections
   */
  initializeConnections() {
    const websites = [
      { name: 'banksy', type: 'art_tokens', bondStrength: 'medium' },
      { name: 'token-mint', type: 'new_token_creation', bondStrength: 'strong' },
      { name: 'pricing-engine', type: 'price_updates', bondStrength: 'strong' },
      { name: 'facet-commerce', type: 'purchase_transactions', bondStrength: 'strong' },
      { name: 'index-designer', type: 'catalog_updates', bondStrength: 'medium' }
    ];

    for (const website of websites) {
      this.connect(website.name, website.type, website.bondStrength);
    }

    console.log('[Connector] Initialized connections:', this.connections.size);
  }

  /**
   * Connect to a website via hydrogen bonding
   * @param {string} name - Website name
   * @param {string} type - Connection type
   * @param {string} bondStrength - Bond strength
   * @returns {object} Connection result
   */
  connect(name, type, bondStrength = 'medium') {
    const timestamp = new Date().toISOString();
    
    const connection = {
      name,
      type,
      bondStrength,
      status: 'connected',
      connectedAt: timestamp,
      lastActivity: timestamp,
      dataFlow: 'bidirectional',
      protocol: 'hydrogen_bonding'
    };

    this.connections.set(name, connection);
    this.connectionHealth.set(name, {
      healthy: true,
      lastCheck: timestamp,
      uptime: 100
    });

    console.log(`[Connector] Connected to ${name}`);
    
    return {
      success: true,
      connection,
      timestamp
    };
  }

  /**
   * Disconnect from a website
   * @param {string} name - Website name
   * @returns {object} Disconnection result
   */
  disconnect(name) {
    const connection = this.connections.get(name);
    
    if (!connection) {
      return {
        success: false,
        error: `Connection not found: ${name}`
      };
    }

    connection.status = 'disconnected';
    connection.disconnectedAt = new Date().toISOString();
    
    this.connections.set(name, connection);
    
    console.log(`[Connector] Disconnected from ${name}`);
    
    return {
      success: true,
      name,
      timestamp: connection.disconnectedAt
    };
  }

  /**
   * Send data through connection
   * @param {string} name - Website name
   * @param {object} data - Data to send
   * @returns {Promise<object>} Send result
   */
  async send(name, data) {
    const connection = this.connections.get(name);
    
    if (!connection) {
      return {
        success: false,
        error: `Connection not found: ${name}`
      };
    }

    if (connection.status !== 'connected') {
      return {
        success: false,
        error: `Connection not active: ${name}`
      };
    }

    // Update last activity
    connection.lastActivity = new Date().toISOString();
    this.connections.set(name, connection);

    // Route through the router
    const result = await this.router.route(name, data);
    
    return result;
  }

  /**
   * Broadcast data to all connections
   * @param {object} data - Data to broadcast
   * @returns {Promise<object>} Broadcast results
   */
  async broadcast(data) {
    const activeConnections = Array.from(this.connections.values())
      .filter(c => c.status === 'connected');

    console.log(`[Connector] Broadcasting to ${activeConnections.length} connections`);
    
    return await this.router.broadcast(data);
  }

  /**
   * Check health of a connection
   * @param {string} name - Website name
   * @returns {object} Health status
   */
  checkHealth(name) {
    const connection = this.connections.get(name);
    const health = this.connectionHealth.get(name);
    
    if (!connection || !health) {
      return {
        healthy: false,
        error: `Connection not found: ${name}`
      };
    }

    // Update health check timestamp
    health.lastCheck = new Date().toISOString();
    
    // Check if connection is active
    const isActive = connection.status === 'connected';
    
    // Check last activity time
    const lastActivityTime = new Date(connection.lastActivity).getTime();
    const currentTime = Date.now();
    const timeSinceActivity = currentTime - lastActivityTime;
    const isRecent = timeSinceActivity < 300000; // 5 minutes

    health.healthy = isActive && isRecent;
    this.connectionHealth.set(name, health);

    return {
      name,
      healthy: health.healthy,
      status: connection.status,
      bondStrength: connection.bondStrength,
      lastActivity: connection.lastActivity,
      timeSinceActivity,
      uptime: health.uptime
    };
  }

  /**
   * Get all connections
   * @returns {array} List of all connections
   */
  getAllConnections() {
    return Array.from(this.connections.values());
  }

  /**
   * Get active connections
   * @returns {array} List of active connections
   */
  getActiveConnections() {
    return Array.from(this.connections.values())
      .filter(c => c.status === 'connected');
  }

  /**
   * Get connection statistics
   * @returns {object} Connection statistics
   */
  getStatistics() {
    const allConnections = Array.from(this.connections.values());
    const activeConnections = allConnections.filter(c => c.status === 'connected');
    const healthyConnections = Array.from(this.connectionHealth.values())
      .filter(h => h.healthy);

    return {
      totalConnections: allConnections.length,
      activeConnections: activeConnections.length,
      healthyConnections: healthyConnections.length,
      disconnectedConnections: allConnections.length - activeConnections.length,
      healthPercentage: (healthyConnections.length / allConnections.length) * 100 || 0
    };
  }

  /**
   * Strengthen bond with a website
   * @param {string} name - Website name
   * @returns {object} Result
   */
  strengthenBond(name) {
    const connection = this.connections.get(name);
    
    if (!connection) {
      return {
        success: false,
        error: `Connection not found: ${name}`
      };
    }

    const strengths = ['weak', 'medium', 'strong'];
    const currentIndex = strengths.indexOf(connection.bondStrength);
    
    if (currentIndex < strengths.length - 1) {
      connection.bondStrength = strengths[currentIndex + 1];
      this.connections.set(name, connection);
      
      return {
        success: true,
        name,
        newBondStrength: connection.bondStrength
      };
    }

    return {
      success: false,
      error: 'Already at maximum bond strength'
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebsiteConnector;
}
