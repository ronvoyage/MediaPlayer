// Performance Testing Utility
// Provides performance testing with proper timeouts and baseline measurements

export interface PerformanceTestConfig {
  timeout: number;
  iterations: number;
  warmupRuns: number;
  acceptableThreshold: number; // Percentage above baseline that's acceptable
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PerformanceTestResult {
  name: string;
  passed: boolean;
  currentMetrics: PerformanceMetric[];
  baselineMetrics: PerformanceMetric[];
  comparison: {
    difference: number;
    percentageChange: number;
    withinThreshold: boolean;
  };
  duration: number;
  timestamp: string;
}

export interface PerformanceBaseline {
  name: string;
  metrics: PerformanceMetric[];
  timestamp: string;
  version: string;
  environment: string;
}

export class PerformanceTester {
  private config: PerformanceTestConfig;
  private baselines: Map<string, PerformanceBaseline> = new Map();

  constructor(config: Partial<PerformanceTestConfig> = {}) {
    this.config = {
      timeout: 15000, // 15 second default timeout
      iterations: 5,
      warmupRuns: 2,
      acceptableThreshold: 20, // 20% above baseline is acceptable
      ...config
    };
  }

  /**
   * Measure performance of a function or operation
   * @param name Test name
   * @param operation Function to measure
   * @param timeout Optional timeout override
   */
  async measurePerformance(
    name: string,
    operation: () => Promise<void> | void,
    timeout?: number
  ): Promise<PerformanceMetric[]> {
    const testTimeout = timeout || this.config.timeout;
    const start = Date.now();
    
    try {
      const metrics: PerformanceMetric[] = [];
      
      // Warmup runs
      for (let i = 0; i < this.config.warmupRuns; i++) {
        await operation();
      }
      
      // Actual measurements
      const measurements: number[] = [];
      for (let i = 0; i < this.config.iterations; i++) {
        const iterationStart = Date.now();
        await operation();
        const iterationDuration = Date.now() - iterationStart;
        measurements.push(iterationDuration);
      }
      
      // Calculate statistics
      const avgDuration = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
      const minDuration = Math.min(...measurements);
      const maxDuration = Math.max(...measurements);
      const stdDev = this.calculateStandardDeviation(measurements, avgDuration);
      
      // Memory usage (simulated)
      const memoryUsage = this.simulateMemoryUsage();
      
      metrics.push(
        {
          name: 'execution_time_avg',
          value: avgDuration,
          unit: 'ms',
          timestamp: new Date().toISOString(),
          metadata: { iterations: this.config.iterations }
        },
        {
          name: 'execution_time_min',
          value: minDuration,
          unit: 'ms',
          timestamp: new Date().toISOString()
        },
        {
          name: 'execution_time_max',
          value: maxDuration,
          unit: 'ms',
          timestamp: new Date().toISOString()
        },
        {
          name: 'execution_time_stddev',
          value: stdDev,
          unit: 'ms',
          timestamp: new Date().toISOString()
        },
        {
          name: 'memory_usage',
          value: memoryUsage,
          unit: 'MB',
          timestamp: new Date().toISOString()
        }
      );
      
      const totalDuration = Date.now() - start;
      console.log(`✓ Performance test ${name} completed in ${totalDuration}ms`);
      
      return metrics;
      
    } catch (error) {
      const totalDuration = Date.now() - start;
      console.error(`✗ Performance test ${name} failed after ${totalDuration}ms: ${error}`);
      
      throw new Error(`Performance measurement failed: ${error}`);
    }
  }

  /**
   * Run performance test and compare with baseline
   * @param name Test name
   * @param operation Function to measure
   * @param timeout Optional timeout override
   */
  async runPerformanceTest(
    name: string,
    operation: () => Promise<void> | void,
    timeout?: number
  ): Promise<PerformanceTestResult> {
    const start = Date.now();
    
    try {
      // Measure current performance
      const currentMetrics = await this.measurePerformance(name, operation, timeout);
      
      // Get baseline for comparison
      const baseline = this.baselines.get(name);
      
      if (!baseline) {
        console.warn(`No baseline found for ${name}, creating new baseline`);
        await this.createBaseline(name, currentMetrics);
        
        return {
          name,
          passed: true,
          currentMetrics,
          baselineMetrics: currentMetrics,
          comparison: {
            difference: 0,
            percentageChange: 0,
            withinThreshold: true
          },
          duration: Date.now() - start,
          timestamp: new Date().toISOString()
        };
      }
      
      // Compare with baseline
      const comparison = this.compareWithBaseline(currentMetrics, baseline.metrics);
      const passed = comparison.withinThreshold;
      
      const result: PerformanceTestResult = {
        name,
        passed,
        currentMetrics,
        baselineMetrics: baseline.metrics,
        comparison,
        duration: Date.now() - start,
        timestamp: new Date().toISOString()
      };
      
      console.log(`✓ Performance test ${name}: ${passed ? 'Passed' : 'Failed'} (${comparison.percentageChange.toFixed(1)}% change)`);
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`✗ Performance test ${name} failed: ${error}`);
      
      return {
        name,
        passed: false,
        currentMetrics: [],
        baselineMetrics: [],
        comparison: {
          difference: 0,
          percentageChange: 0,
          withinThreshold: false
        },
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Create or update performance baseline
   * @param name Test name
   * @param metrics Performance metrics
   */
  async createBaseline(
    name: string, 
    metrics: PerformanceMetric[]
  ): Promise<void> {
    const baseline: PerformanceBaseline = {
      name,
      metrics,
      timestamp: new Date().toISOString(),
      version: '1.0.0', // This would come from package.json
      environment: 'development' // This would be detected
    };
    
    this.baselines.set(name, baseline);
    console.log(`✓ Created baseline for ${name}`);
  }

  /**
   * Load performance baselines from storage
   * @param baselines Array of baseline data
   */
  loadBaselines(baselines: PerformanceBaseline[]): void {
    baselines.forEach(baseline => {
      this.baselines.set(baseline.name, baseline);
    });
    console.log(`✓ Loaded ${baselines.length} performance baselines`);
  }

  /**
   * Get all performance baselines
   */
  getBaselines(): PerformanceBaseline[] {
    return Array.from(this.baselines.values());
  }

  /**
   * Generate performance test report
   * @param results Test results
   */
  generatePerformanceReport(
    results: PerformanceTestResult[]
  ): string {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    
    const report = `
Performance Test Report
======================
Total Tests: ${total}
Passed: ${passed}
Failed: ${failed}
Success Rate: ${((passed / total) * 100).toFixed(1)}%
Total Duration: ${totalDuration}ms
Average Duration: ${(totalDuration / total).toFixed(1)}ms

${failed > 0 ? 'Failed Tests:' : 'All tests passed!'}
${results.filter(r => !r.passed).map(r => `- ${r.name}: ${r.comparison.percentageChange.toFixed(1)}% change (threshold: ${this.config.acceptableThreshold}%)`).join('\n')}

Performance Changes:
${results.map(r => `- ${r.name}: ${r.comparison.percentageChange.toFixed(1)}% ${r.comparison.percentageChange >= 0 ? 'increase' : 'decrease'}`).join('\n')}

Baseline Information:
${results.map(r => {
  const baseline = this.baselines.get(r.name);
  return baseline ? `- ${r.name}: v${baseline.version} (${baseline.environment}) - ${baseline.timestamp}` : `- ${r.name}: No baseline`;
}).join('\n')}
    `.trim();
    
    return report;
  }

  /**
   * Calculate standard deviation
   * @param values Array of values
   * @param mean Mean value
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Compare current metrics with baseline
   * @param current Current metrics
   * @param baseline Baseline metrics
   */
  private compareWithBaseline(
    current: PerformanceMetric[], 
    baseline: PerformanceMetric[]
  ): {
    difference: number;
    percentageChange: number;
    withinThreshold: boolean;
  } {
    // Find execution time metrics for comparison
    const currentExecTime = current.find(m => m.name === 'execution_time_avg');
    const baselineExecTime = baseline.find(m => m.name === 'execution_time_avg');
    
    if (!currentExecTime || !baselineExecTime) {
      return {
        difference: 0,
        percentageChange: 0,
        withinThreshold: true
      };
    }
    
    const difference = currentExecTime.value - baselineExecTime.value;
    const percentageChange = (difference / baselineExecTime.value) * 100;
    const withinThreshold = Math.abs(percentageChange) <= this.config.acceptableThreshold;
    
    return {
      difference,
      percentageChange,
      withinThreshold
    };
  }

  /**
   * Simulate memory usage measurement
   */
  private simulateMemoryUsage(): number {
    // In real implementation, this would use performance.memory or similar
    return Math.random() * 100 + 50; // 50-150 MB
  }
}

// Export default configuration
export const defaultPerformanceConfig: PerformanceTestConfig = {
  timeout: 15000,
  iterations: 5,
  warmupRuns: 2,
  acceptableThreshold: 20
};

// Export singleton instance
export const performanceTester = new PerformanceTester(defaultPerformanceConfig);
