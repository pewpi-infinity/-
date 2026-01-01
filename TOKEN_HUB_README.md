# 💰 Token Economy Hub (Dash Repo -)

Central command for all token operations, commerce, and inter-website communication.

## 🎯 Machine Identity: TOKEN_HUB

The dash repository (`-`) serves as the central token economy hub with complete website wiring system for the Infinity ecosystem.

## 🚀 Features

### 💰 Andy Lian Coin (ALC)
- **Purpose**: Proof of active users and transactions
- **Symbol**: 💰ALC
- **Minting**: Based on user contributions (content creation, feature building, helping others, task completion)
- **Spending**: Premium features, art commissions, priority processing, theme unlocking

### 🧲 Hydrogen Bonding Network
- **Type**: Weak hydrogen bonds (weak individually, strong collectively)
- **Physics**: Magnetic capacitance with distributed storage
- **Connections**: Hub-and-spoke architecture connecting all repositories
- **Resistance**: Minimal for fast transfers

### 🔄 Domino Cascade System
- **Automation**: Fully robotic, no human intervention required
- **Cascades**: Commerce flow, token flow, content flow, activity flow
- **Steps**: 8-step automated propagation for each transaction
- **Reliability**: Based on proven hydrogen bonding physics

### 📋 Multi-Location Documentation
- **Locations**: 8 simultaneous backup locations
- **Immutability**: All actions encoded and protected
- **Redundancy**: Distributed across network for maximum reliability

## 📁 Directory Structure

```
-/ (dash repo)
├── .infinity/                    # Core configuration
│   ├── andy-lian-coin.json      # ALC token configuration
│   ├── website-wiring.json      # Network wiring configuration
│   ├── hydrogen-physics.json    # Physics model (internal)
│   └── domino-system.json       # Cascade system configuration
├── token-hub/                    # Token operations
│   ├── alc-minting.js           # Token minting system
│   ├── alc-distribution.js      # Token distribution & rewards
│   ├── transaction-router.js    # Transaction routing
│   └── website-connector.js     # Website connection manager
├── wiring/                       # Hydrogen bonding system
│   ├── hydrogen-bonds.js        # Bond creation & management
│   ├── capacitance-network.js   # Distributed storage
│   ├── domino-cascade.js        # Automated propagation
│   └── robotic-automation.js    # Full automation system
├── documentation/                # Multi-location backup
│   ├── multi-location-writer.js # Simultaneous writes
│   └── backup-system.js         # Redundancy & recovery
└── dashboard/                    # Visualization interfaces
    ├── hub-interface.html       # Main terminal dashboard
    └── wiring-visualizer.html   # Network visualization
```

## 🔗 Connected Repositories

The Token Hub connects to:
- **banksy**: Art token transactions
- **token-mint**: New token creation
- **pricing-engine**: Dynamic price updates
- **facet-commerce**: Purchase transactions
- **index-designer**: Catalog updates
- **mongoose**: Pattern learning
- **ALL_REPOS**: Broadcast propagation

## 🎮 Usage

### Opening the Dashboard

1. **Hub Interface** (Main Command Center):
   ```bash
   open dashboard/hub-interface.html
   ```
   Features:
   - Real-time statistics
   - Connection monitoring
   - Activity log
   - Control panel with mint, cascade, health check, balance, backup functions

2. **Wiring Visualizer** (Network Visualization):
   ```bash
   open dashboard/wiring-visualizer.html
   ```
   Features:
   - Live hydrogen bond visualization
   - Particle transmission animation
   - Interactive controls
   - Bond strength indicators

### Using the Token System

#### Minting Tokens (JavaScript)
```javascript
const ALCMinting = require('./token-hub/alc-minting.js');
const minting = new ALCMinting();

// Mint tokens for user contribution
const result = minting.mint('user123', 'content_creation', {
  title: 'Amazing Research Article',
  substance: 'high'
});

console.log(result);
// { success: true, transaction: {...}, newBalance: 10, totalSupply: 10 }
```

#### Distributing Tokens
```javascript
const ALCDistribution = require('./token-hub/alc-distribution.js');
const distribution = new ALCDistribution(minting);

// Distribute tokens to user
const result = distribution.distribute('user123', 50, 'Feature completion bonus');

// Spend tokens
const spendResult = distribution.spend('user123', 'premium_features', 100);
```

#### Routing Transactions
```javascript
const TransactionRouter = require('./token-hub/transaction-router.js');
const router = new TransactionRouter();

// Route transaction to specific repository
const result = await router.route('token-mint', {
  type: 'mint_request',
  amount: 100,
  recipient: 'user123'
});

// Broadcast to all repositories
const broadcastResult = await router.broadcast({
  type: 'price_update',
  newPrice: 0.015
});
```

#### Creating Hydrogen Bonds
```javascript
const HydrogenBonds = require('./wiring/hydrogen-bonds.js');
const bonds = new HydrogenBonds();

// Create bond between nodes
const bond = bonds.createBond('dash_hub', 'token-mint', 'strong');

// Transmit data through bond
const transmitResult = await bonds.transmit(bond.bond.id, {
  action: 'mint',
  amount: 50
});
```

#### Triggering Domino Cascades
```javascript
const DominoCascade = require('./wiring/domino-cascade.js');
const cascade = new DominoCascade(router, connector);

// Trigger commerce flow cascade
const result = await cascade.trigger('commerce_flow', {
  purchaseId: 'PUR-123',
  amount: 500,
  buyer: 'user123'
});

// Cascade automatically propagates through all 8 steps
```

#### Multi-Location Backup
```javascript
const MultiLocationWriter = require('./documentation/multi-location-writer.js');
const writer = new MultiLocationWriter();

// Write transaction to all locations
const result = await writer.writeTransaction({
  id: 'TX-123',
  type: 'purchase',
  amount: 500,
  timestamp: new Date().toISOString()
});

// Result shows success in all 8 locations
```

## 🔐 Connection Protocol

Every transaction follows this automated flow:

1. **Commerce collects tokens** - Purchase initiated
2. **Hub records transaction** - Central recording
3. **Mint creates receipt token** - Proof of purchase
4. **Pricing adjusts value** - Dynamic pricing update
5. **Index updates catalog** - Catalog synchronized
6. **Mongoose learns pattern** - AI pattern recognition
7. **Documentation backs up** - Multi-location write
8. **Loop continues** - Ready for next transaction

All steps are **fully automated** with **no human intervention** required.

## 🎨 Theme Support

The hub interface adapts to different themes based on active repository:
- 🎸 Rock concert (trading)
- 🍄 Mario (art creation)
- 🔌 Electronics lab (circuits)
- And 8 more themes...

## 📊 Statistics & Monitoring

All systems provide comprehensive statistics:

```javascript
// Get minting statistics
const mintStats = minting.getStatistics();
// { totalSupply, totalTransactions, contributionTypes, averageReward }

// Get network statistics
const networkStats = network.getStatistics();
// { totalNodes, totalCapacitance, totalCharge, utilizationPercent }

// Get cascade statistics
const cascadeStats = cascade.getStatistics();
// { totalCascades, successfulCascades, averageDuration, successRate }

// Get backup statistics
const backupStats = backup.getStatistics();
// { totalBackups, completedBackups, successRate, totalRecoveries }
```

## 🛡️ Security & Reliability

- **Immutable Documentation**: All actions are encoded and immutable
- **Multi-Location Backup**: 8 simultaneous backup locations
- **Self-Healing Bonds**: Automatic bond repair
- **Redundancy**: Distributed network with failover
- **Encryption**: Data encoding before transmission
- **Validation**: Transaction validation at each step

## 🧪 Testing

No formal test suite yet (following minimal changes principle), but all modules include:
- Input validation
- Error handling
- Statistics tracking
- Comprehensive logging

## 🤝 Integration with Existing Assets

This hub builds on existing repository assets:
- ✅ TOKEN.md - Token documentation
- ✅ C13B0_COMMERCE.json - Commerce configuration
- ✅ c13b0_pricing.json - Pricing data
- ✅ C13B0_FEDERATION.md - Federation info
- ✅ index_value.json - Index values
- ✅ mongoose/ - Learning system

## 🎯 Future Enhancements

- Web API endpoints for external access
- Real-time WebSocket connections
- Advanced theme switching
- Machine learning integration with mongoose
- Blockchain integration for receipts
- Mobile dashboard interface

## 📝 License

Part of the Infinity ecosystem operated by Kris Watson (Pewpi Infinity).

## 🔗 Related Repositories

- **banksy**: Art token marketplace
- **token-mint**: Token creation engine
- **pricing-engine**: Dynamic pricing system
- **facet-commerce**: Commerce platform
- **index-designer**: Content cataloging
- **mongoose**: AI learning system

---

**Machine Identity**: TOKEN_HUB  
**Status**: OPERATIONAL  
**Version**: 1.0.0  
**Created**: 2026-01-01  
**Operator**: Kris Watson (pewpi-infinity)
