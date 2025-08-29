import type { LogEntry } from '../types/logging';

export interface LogAnalysisResult {
  totalLogs: number;
  errorRate: number;
  performanceMetrics: PerformanceMetric[];
  componentBreakdown: ComponentBreakdown[];
  timeDistribution: TimeDistribution[];
  errorPatterns: ErrorPattern[];
  recommendations: string[];
}

export interface PerformanceMetric {
  operation: string;
  average: number;
  min: number;
  max: number;
  samples: number;
  trend: 'improving' | 'stable' | 'degrading';
}

export interface ComponentBreakdown {
  component: string;
  count: number;
  percentage: number;
  errorCount: number;
  errorRate: number;
}

export interface TimeDistribution {
  hour: number;
  count: number;
  errorCount: number;
}

export interface ErrorPattern {
  pattern: string;
  count: number;
  examples: string[];
  severity: 'low' | 'medium' | 'high';
}

export class LogAnalyzer {
  private logs: LogEntry[];

  constructor(logs: LogEntry[]) {
    this.logs = logs;
  }

  analyze(): LogAnalysisResult {
    const totalLogs = this.logs.length;
    const errorRate = this.calculateErrorRate();
    const performanceMetrics = this.analyzePerformance();
    const componentBreakdown = this.analyzeComponentBreakdown();
    const timeDistribution = this.analyzeTimeDistribution();
    const errorPatterns = this.analyzeErrorPatterns();
    const recommendations = this.generateRecommendations();

    return {
      totalLogs,
      errorRate,
      performanceMetrics,
      componentBreakdown,
      timeDistribution,
      errorPatterns,
      recommendations
    };
  }

  private calculateErrorRate(): number {
    const errorLogs = this.logs.filter(log => log.level === 'error' || log.level === 'fatal');
    return this.logs.length > 0 ? (errorLogs.length / this.logs.length) * 100 : 0;
  }

  private analyzePerformance(): PerformanceMetric[] {
    const performanceLogs = this.logs.filter(log => log.duration !== undefined);
    const operationGroups = new Map<string, number[]>();

    performanceLogs.forEach(log => {
      if (log.duration && log.component) {
        const key = `${log.component}:${log.action || 'unknown'}`;
        if (!operationGroups.has(key)) {
          operationGroups.set(key, []);
        }
        operationGroups.get(key)!.push(log.duration);
      }
    });

    return Array.from(operationGroups.entries()).map(([operation, durations]) => {
      const sorted = durations.sort((a, b) => a - b);
      const average = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const trend = this.calculateTrend(durations);

      return {
        operation,
        average: Math.round(average * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        samples: durations.length,
        trend
      };
    });
  }

  private calculateTrend(durations: number[]): 'improving' | 'stable' | 'degrading' {
    if (durations.length < 10) return 'stable';

    const firstHalf = durations.slice(0, Math.floor(durations.length / 2));
    const secondHalf = durations.slice(Math.floor(durations.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change < -10) return 'improving';
    if (change > 10) return 'degrading';
    return 'stable';
  }

  private analyzeComponentBreakdown(): ComponentBreakdown[] {
    const componentGroups = new Map<string, { count: number; errors: number }>();

    this.logs.forEach(log => {
      const component = log.component || 'Unknown';
      if (!componentGroups.has(component)) {
        componentGroups.set(component, { count: 0, errors: 0 });
      }

      const group = componentGroups.get(component)!;
      group.count++;

      if (log.level === 'error' || log.level === 'fatal') {
        group.errors++;
      }
    });

    const total = this.logs.length;
    return Array.from(componentGroups.entries())
      .map(([component, { count, errors }]) => ({
        component,
        count,
        percentage: Math.round((count / total) * 100 * 100) / 100,
        errorCount: errors,
        errorRate: Math.round((errors / count) * 100 * 100) / 100
      }))
      .sort((a, b) => b.count - a.count);
  }

  private analyzeTimeDistribution(): TimeDistribution[] {
    const hourlyGroups = new Map<number, { count: number; errors: number }>();

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyGroups.set(i, { count: 0, errors: 0 });
    }

    this.logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const group = hourlyGroups.get(hour)!;
      group.count++;

      if (log.level === 'error' || log.level === 'fatal') {
        group.errors++;
      }
    });

    return Array.from(hourlyGroups.entries()).map(([hour, { count, errors }]) => ({
      hour,
      count,
      errorCount: errors
    }));
  }

  private analyzeErrorPatterns(): ErrorPattern[] {
    const errorLogs = this.logs.filter(log => log.level === 'error' || log.level === 'fatal');
    const patterns = new Map<string, { count: number; examples: string[] }>();

    errorLogs.forEach(log => {
      // Create a pattern based on error message structure
      let pattern = log.message;
      
      // Replace specific values with placeholders
      pattern = pattern.replace(/\d+/g, '{number}');
      pattern = pattern.replace(/"[^"]*"/g, '{string}');
      pattern = pattern.replace(/[a-f0-9]{8,}/gi, '{id}');
      
      if (!patterns.has(pattern)) {
        patterns.set(pattern, { count: 0, examples: [] });
      }

      const patternGroup = patterns.get(pattern)!;
      patternGroup.count++;
      
      if (patternGroup.examples.length < 3) {
        patternGroup.examples.push(log.message);
      }
    });

    return Array.from(patterns.entries())
      .map(([pattern, { count, examples }]) => ({
        pattern,
        count,
        examples,
        severity: this.calculateSeverity(count, pattern)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 patterns
  }

  private calculateSeverity(count: number, pattern: string): 'low' | 'medium' | 'high' {
    const totalErrors = this.logs.filter(log => log.level === 'error' || log.level === 'fatal').length;
    const percentage = (count / totalErrors) * 100;

    if (percentage > 20) return 'high';
    if (percentage > 5) return 'medium';
    return 'low';
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const analysis = this.analyze();

    // Error rate recommendations
    if (analysis.errorRate > 10) {
      recommendations.push('High error rate detected. Review error patterns and implement better error handling.');
    } else if (analysis.errorRate > 5) {
      recommendations.push('Moderate error rate. Consider implementing error monitoring and alerting.');
    }

    // Performance recommendations
    const degradingOperations = analysis.performanceMetrics.filter(m => m.trend === 'degrading');
    if (degradingOperations.length > 0) {
      recommendations.push(`${degradingOperations.length} operations showing performance degradation. Investigate recent changes.`);
    }

    // Component recommendations
    const highErrorComponents = analysis.componentBreakdown.filter(c => c.errorRate > 20);
    if (highErrorComponents.length > 0) {
      recommendations.push(`Components with high error rates: ${highErrorComponents.map(c => c.component).join(', ')}`);
    }

    // Time-based recommendations
    const peakHours = analysis.timeDistribution
      .filter(t => t.count > analysis.totalLogs / 24 * 2) // 2x average
      .map(t => t.hour);
    
    if (peakHours.length > 0) {
      recommendations.push(`Peak activity detected during hours: ${peakHours.join(', ')}. Consider load balancing.`);
    }

    // General recommendations
    if (analysis.totalLogs > 10000) {
      recommendations.push('Large log volume detected. Consider implementing log aggregation and retention policies.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Logs appear healthy. Continue monitoring for any changes.');
    }

    return recommendations;
  }

  // Search and filter methods
  search(query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(lowerQuery) ||
      log.component?.toLowerCase().includes(lowerQuery) ||
      log.action?.toLowerCase().includes(lowerQuery) ||
      (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(lowerQuery))
    );
  }

  filterByLevel(level: string): LogEntry[] {
    if (level === 'all') return this.logs;
    return this.logs.filter(log => log.level === level);
  }

  filterByComponent(component: string): LogEntry[] {
    if (component === 'all') return this.logs;
    return this.logs.filter(log => log.component === component);
  }

  filterByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }

  filterByErrorType(errorType: string): LogEntry[] {
    return this.logs.filter(log => 
      (log.level === 'error' || log.level === 'fatal') &&
      log.message.toLowerCase().includes(errorType.toLowerCase())
    );
  }

  // Export methods
  exportToCSV(): string {
    const headers = ['Timestamp', 'Level', 'Component', 'Action', 'Message', 'Duration', 'Metadata'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.component || '',
      log.action || '',
      log.message,
      log.duration || '',
      log.metadata ? JSON.stringify(log.metadata) : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  exportToJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Summary methods
  getSummary(): {
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
    debugCount: number;
    fatalCount: number;
    averageDuration: number;
  } {
    const errorCount = this.logs.filter(log => log.level === 'error').length;
    const warningCount = this.logs.filter(log => log.level === 'warn').length;
    const infoCount = this.logs.filter(log => log.level === 'info').length;
    const debugCount = this.logs.filter(log => log.level === 'debug').length;
    const fatalCount = this.logs.filter(log => log.level === 'fatal').length;

    const durationLogs = this.logs.filter(log => log.duration !== undefined);
    const averageDuration = durationLogs.length > 0 
      ? durationLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / durationLogs.length
      : 0;

    return {
      totalLogs: this.logs.length,
      errorCount,
      warningCount,
      infoCount,
      debugCount,
      fatalCount,
      averageDuration: Math.round(averageDuration * 100) / 100
    };
  }
}
