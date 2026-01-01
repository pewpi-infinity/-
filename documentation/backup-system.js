/**
 * Backup System
 * Provides redundancy and recovery for all token operations
 */

class BackupSystem {
  constructor(writer) {
    this.writer = writer;
    this.backups = new Map();
    this.backupSchedule = [];
    this.recoveryLog = [];
    this.autoBackupEnabled = true;
  }

  /**
   * Create backup of current state
   * @param {string} backupType - Type of backup
   * @param {object} data - Data to backup
   * @returns {Promise<object>} Backup result
   */
  async createBackup(backupType, data) {
    const timestamp = new Date().toISOString();
    const backupId = this.generateBackupId();

    const backup = {
      id: backupId,
      type: backupType,
      timestamp,
      data,
      status: 'creating'
    };

    console.log(`[BackupSystem] Creating ${backupType} backup: ${backupId}`);

    try {
      // Write to all locations
      const writeResult = await this.writer.writeToAll(`backup_${backupType}`, {
        backupId,
        type: backupType,
        data,
        timestamp
      });

      backup.status = writeResult.success ? 'completed' : 'partial';
      backup.writeResult = writeResult;
      backup.successCount = writeResult.successCount;
      backup.failureCount = writeResult.failureCount;

      // Store backup reference
      this.backups.set(backupId, backup);

      return {
        success: writeResult.success,
        backup,
        backupId,
        timestamp
      };

    } catch (error) {
      backup.status = 'failed';
      backup.error = error.message;

      return {
        success: false,
        backupId,
        error: error.message,
        timestamp
      };
    }
  }

  /**
   * Restore from backup
   * @param {string} backupId - Backup ID to restore
   * @returns {object} Restore result
   */
  restore(backupId) {
    const backup = this.backups.get(backupId);
    
    if (!backup) {
      return {
        success: false,
        error: `Backup not found: ${backupId}`
      };
    }

    if (backup.status !== 'completed') {
      return {
        success: false,
        error: `Backup not complete: ${backup.status}`
      };
    }

    const timestamp = new Date().toISOString();

    // Log recovery
    this.recoveryLog.push({
      backupId,
      timestamp,
      backupType: backup.type,
      backupTimestamp: backup.timestamp
    });

    console.log(`[BackupSystem] Restored from backup: ${backupId}`);

    return {
      success: true,
      backupId,
      backupType: backup.type,
      backupTimestamp: backup.timestamp,
      restoredData: backup.data,
      timestamp
    };
  }

  /**
   * Schedule automatic backup
   * @param {string} backupType - Type of backup
   * @param {string} frequency - Backup frequency (hourly/daily/weekly)
   * @param {function} dataProvider - Function that provides data to backup
   * @returns {object} Schedule result
   */
  scheduleBackup(backupType, frequency, dataProvider) {
    const scheduleId = this.generateScheduleId();
    const timestamp = new Date().toISOString();

    const schedule = {
      id: scheduleId,
      backupType,
      frequency,
      dataProvider,
      enabled: true,
      createdAt: timestamp,
      lastBackup: null,
      nextBackup: this.calculateNextBackup(frequency),
      backupCount: 0
    };

    this.backupSchedule.push(schedule);

    console.log(`[BackupSystem] Scheduled ${frequency} backup: ${backupType}`);

    return {
      success: true,
      scheduleId,
      backupType,
      frequency,
      nextBackup: schedule.nextBackup
    };
  }

  /**
   * Execute scheduled backups
   * @returns {Promise<object>} Execution result
   */
  async executeScheduledBackups() {
    const now = new Date();
    const executed = [];

    for (const schedule of this.backupSchedule) {
      if (!schedule.enabled) continue;

      const nextBackupTime = new Date(schedule.nextBackup);
      
      if (now >= nextBackupTime) {
        try {
          // Get data from provider
          const data = await schedule.dataProvider();
          
          // Create backup
          const result = await this.createBackup(schedule.backupType, data);
          
          // Update schedule
          schedule.lastBackup = new Date().toISOString();
          schedule.nextBackup = this.calculateNextBackup(schedule.frequency);
          schedule.backupCount++;

          executed.push({
            scheduleId: schedule.id,
            backupType: schedule.backupType,
            success: result.success,
            backupId: result.backupId
          });

        } catch (error) {
          executed.push({
            scheduleId: schedule.id,
            backupType: schedule.backupType,
            success: false,
            error: error.message
          });
        }
      }
    }

    return {
      success: true,
      executedCount: executed.length,
      executed,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate next backup time
   * @param {string} frequency - Backup frequency
   * @returns {string} Next backup timestamp
   */
  calculateNextBackup(frequency) {
    const now = new Date();
    
    switch (frequency) {
      case 'hourly':
        now.setHours(now.getHours() + 1);
        break;
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      default:
        now.setHours(now.getHours() + 1);
    }

    return now.toISOString();
  }

  /**
   * Get backup history
   * @param {string} backupType - Optional filter by type
   * @returns {array} Backup history
   */
  getBackupHistory(backupType = null) {
    const backups = Array.from(this.backups.values());
    
    if (backupType) {
      return backups.filter(b => b.type === backupType);
    }

    return backups;
  }

  /**
   * Get recovery log
   * @param {number} limit - Number of entries to return
   * @returns {array} Recovery log
   */
  getRecoveryLog(limit = 50) {
    return this.recoveryLog.slice(-limit);
  }

  /**
   * Get backup statistics
   * @returns {object} Statistics
   */
  getStatistics() {
    const backups = Array.from(this.backups.values());
    const completed = backups.filter(b => b.status === 'completed').length;
    const failed = backups.filter(b => b.status === 'failed').length;
    const partial = backups.filter(b => b.status === 'partial').length;

    const totalSuccessRate = backups.reduce(
      (sum, b) => sum + (b.successCount || 0), 
      0
    ) / (backups.length * this.writer.locations.length) || 0;

    return {
      totalBackups: backups.length,
      completedBackups: completed,
      failedBackups: failed,
      partialBackups: partial,
      successRate: completed / backups.length || 0,
      locationSuccessRate: totalSuccessRate,
      totalRecoveries: this.recoveryLog.length,
      scheduledBackups: this.backupSchedule.length,
      autoBackupEnabled: this.autoBackupEnabled
    };
  }

  /**
   * Delete old backups
   * @param {number} daysOld - Delete backups older than this many days
   * @returns {object} Deletion result
   */
  deleteOldBackups(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedCount = 0;

    for (const [backupId, backup] of this.backups.entries()) {
      const backupDate = new Date(backup.timestamp);
      
      if (backupDate < cutoffDate) {
        this.backups.delete(backupId);
        deletedCount++;
      }
    }

    console.log(`[BackupSystem] Deleted ${deletedCount} old backups`);

    return {
      success: true,
      deletedCount,
      cutoffDate: cutoffDate.toISOString(),
      remainingBackups: this.backups.size
    };
  }

  /**
   * Generate backup ID
   * @returns {string} Backup ID
   */
  generateBackupId() {
    return `BACKUP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate schedule ID
   * @returns {string} Schedule ID
   */
  generateScheduleId() {
    return `SCHED-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Verify backup integrity
   * @param {string} backupId - Backup ID to verify
   * @returns {object} Verification result
   */
  verifyBackup(backupId) {
    const backup = this.backups.get(backupId);
    
    if (!backup) {
      return {
        verified: false,
        error: 'Backup not found'
      };
    }

    const writerVerification = this.writer.verifyWrite(backup.writeResult?.writeId);

    return {
      verified: backup.status === 'completed' && writerVerification.verified,
      backupId,
      backupType: backup.type,
      timestamp: backup.timestamp,
      locationSuccessRate: backup.successCount / this.writer.locations.length
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackupSystem;
}
