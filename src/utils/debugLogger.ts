// Debug logger utility to capture and expose logs
class DebugLogger {
  private static instance: DebugLogger;
  private logs: Array<{timestamp: number; message: string; data?: any}> = [];
  private maxLogs = 1000; // Keep last 1000 logs

  private constructor() {}

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  log(message: string, data?: any) {
    this.logs.push({
      timestamp: Date.now(),
      message,
      data
    });

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also output to console for development
    console.log(message, data);
  }

  getLogs(limit?: number): Array<{timestamp: number; message: string; data?: any}> {
    if (limit) {
      return this.logs.slice(-limit);
    }
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const debugLogger = DebugLogger.getInstance();
