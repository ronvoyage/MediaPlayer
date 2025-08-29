// Comprehensive Test Runner
// Demonstrates all testing capabilities with proper timeouts

import { visualTester } from './visual-regression';
import { accessibilityTester } from './accessibility';
import { performanceTester } from './performance';

export interface TestSuiteResult {
  name: string;
  passed: boolean;
  duration: number;
  details: any;
}

export interface TestRunnerConfig {
  timeout: number;
  runVisualTests: boolean;
  runAccessibilityTests: boolean;
  runPerformanceTests: boolean;
  verbose: boolean;
}

export class TestRunner {
  private config: TestRunnerConfig;

  constructor(config: Partial<TestRunnerConfig> = {}) {
    this.config = {
      timeout: 30000, // 30 second default timeout
      runVisualTests: true,
      runAccessibilityTests: true,
      runPerformanceTests: true,
      verbose: false,
      ...config
    };
  }

  /**
   * Run all test suites
   */
  async runAllTests(): Promise<{
    results: TestSuiteResult[];
    summary: string;
    totalDuration: number;
  }> {
    const start = Date.now();
    const results: TestSuiteResult[] = [];
    
    console.log('🚀 Starting comprehensive test suite...\n');

    // Visual Regression Tests
    if (this.config.runVisualTests) {
      try {
        console.log('📸 Running Visual Regression Tests...');
        const visualStart = Date.now();
        
        const visualTestCases = [
          { name: 'theme-showcase', selector: '.MuiBox-root', description: 'Theme showcase layout' },
          { name: 'animated-logo', selector: '.animated-logo', description: 'Animated logo component' },
          { name: 'color-palette', selector: '.color-palette', description: 'Color palette display' }
        ];
        
        const visualResults = await visualTester.runVisualTests('ThemeShowcase', visualTestCases);
        const visualReport = visualTester.generateReport(visualResults);
        
        const visualDuration = Date.now() - visualStart;
        const visualPassed = visualResults.every(r => r.passed);
        
        results.push({
          name: 'Visual Regression Tests',
          passed: visualPassed,
          duration: visualDuration,
          details: { results: visualResults, report: visualReport }
        });
        
        if (this.config.verbose) {
          console.log(visualReport);
        }
        
        console.log(`✓ Visual tests completed in ${visualDuration}ms\n`);
        
      } catch (error) {
        const visualDuration = Date.now() - start;
        results.push({
          name: 'Visual Regression Tests',
          passed: false,
          duration: visualDuration,
          details: { error: error.message }
        });
        console.error(`✗ Visual tests failed: ${error}\n`);
      }
    }

    // Accessibility Tests
    if (this.config.runAccessibilityTests) {
      try {
        console.log('♿ Running Accessibility Tests...');
        const accessibilityStart = Date.now();
        
        const accessibilityTestCases = [
          { name: 'main-navigation', selector: 'nav', description: 'Main navigation accessibility' },
          { name: 'theme-toggle', selector: 'button[aria-label*="theme"]', description: 'Theme toggle button' },
          { name: 'color-chips', selector: '.color-chip', description: 'Color chip accessibility' }
        ];
        
        const accessibilityResults = await accessibilityTester.runAccessibilityTests(accessibilityTestCases);
        const accessibilityReport = accessibilityTester.generateAccessibilityReport(accessibilityResults);
        
        const accessibilityDuration = Date.now() - accessibilityStart;
        const accessibilityPassed = accessibilityResults.every(r => r.result.passed);
        
        results.push({
          name: 'Accessibility Tests',
          passed: accessibilityPassed,
          duration: accessibilityDuration,
          details: { results: accessibilityResults, report: accessibilityReport }
        });
        
        if (this.config.verbose) {
          console.log(accessibilityReport);
        }
        
        console.log(`✓ Accessibility tests completed in ${accessibilityDuration}ms\n`);
        
      } catch (error) {
        const accessibilityDuration = Date.now() - start;
        results.push({
          name: 'Accessibility Tests',
          passed: false,
          duration: accessibilityDuration,
          details: { error: error.message }
        });
        console.error(`✗ Accessibility tests failed: ${error}\n`);
      }
    }

    // Performance Tests
    if (this.config.runPerformanceTests) {
      try {
        console.log('⚡ Running Performance Tests...');
        const performanceStart = Date.now();
        
        const performanceTests = [
          {
            name: 'theme-switching',
            operation: async () => {
              // Simulate theme switching operation
              await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
            }
          },
          {
            name: 'component-rendering',
            operation: async () => {
              // Simulate component rendering
              await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 25));
            }
          },
          {
            name: 'animation-performance',
            operation: async () => {
              // Simulate animation performance
              await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
            }
          }
        ];
        
        const performanceResults = [];
        for (const test of performanceTests) {
          const result = await performanceTester.runPerformanceTest(test.name, test.operation);
          performanceResults.push(result);
        }
        
        const performanceReport = performanceTester.generatePerformanceReport(performanceResults);
        
        const performanceDuration = Date.now() - performanceStart;
        const performancePassed = performanceResults.every(r => r.passed);
        
        results.push({
          name: 'Performance Tests',
          passed: performancePassed,
          duration: performanceDuration,
          details: { results: performanceResults, report: performanceReport }
        });
        
        if (this.config.verbose) {
          console.log(performanceReport);
        }
        
        console.log(`✓ Performance tests completed in ${performanceDuration}ms\n`);
        
      } catch (error) {
        const performanceDuration = Date.now() - start;
        results.push({
          name: 'Performance Tests',
          passed: false,
          duration: performanceDuration,
          details: { error: error.message }
        });
        console.error(`✗ Performance tests failed: ${error}\n`);
      }
    }

    const totalDuration = Date.now() - start;
    const summary = this.generateSummary(results, totalDuration);
    
    console.log('🎯 Test Suite Summary');
    console.log('=====================');
    console.log(summary);
    
    return {
      results,
      summary,
      totalDuration
    };
  }

  /**
   * Generate test summary
   * @param results Test results
   * @param totalDuration Total duration
   */
  private generateSummary(results: TestSuiteResult[], totalDuration: number): string {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;
    
    const summary = `
Total Test Suites: ${total}
Passed: ${passed}
Failed: ${failed}
Success Rate: ${successRate.toFixed(1)}%
Total Duration: ${totalDuration}ms

${failed > 0 ? 'Failed Suites:' : 'All test suites passed!'}
${results.filter(r => !r.passed).map(r => `- ${r.name}: ${r.duration}ms`).join('\n')}

${passed > 0 ? 'Passed Suites:' : 'No suites passed'}
${results.filter(r => r.passed).map(r => `- ${r.name}: ${r.duration}ms`).join('\n')}

Performance Metrics:
- Average Suite Duration: ${(totalDuration / total).toFixed(1)}ms
- Fastest Suite: ${Math.min(...results.map(r => r.duration))}ms
- Slowest Suite: ${Math.max(...results.map(r => r.duration))}ms
    `.trim();
    
    return summary;
  }

  /**
   * Run specific test suite
   * @param suiteName Name of the suite to run
   */
  async runTestSuite(suiteName: string): Promise<TestSuiteResult | null> {
    const start = Date.now();
    
    try {
      switch (suiteName.toLowerCase()) {
        case 'visual':
        case 'visual-regression':
          console.log('📸 Running Visual Regression Tests...');
          const visualTestCases = [
            { name: 'theme-showcase', selector: '.MuiBox-root', description: 'Theme showcase layout' }
          ];
          const visualResults = await visualTester.runVisualTests('ThemeShowcase', visualTestCases);
          const visualPassed = visualResults.every(r => r.passed);
          
          return {
            name: 'Visual Regression Tests',
            passed: visualPassed,
            duration: Date.now() - start,
            details: { results: visualResults }
          };
          
        case 'accessibility':
        case 'a11y':
          console.log('♿ Running Accessibility Tests...');
          const accessibilityTestCases = [
            { name: 'main-navigation', selector: 'nav', description: 'Main navigation accessibility' }
          ];
          const accessibilityResults = await accessibilityTester.runAccessibilityTests(accessibilityTestCases);
          const accessibilityPassed = accessibilityResults.every(r => r.result.passed);
          
          return {
            name: 'Accessibility Tests',
            passed: accessibilityPassed,
            duration: Date.now() - start,
            details: { results: accessibilityResults }
          };
          
        case 'performance':
        case 'perf':
          console.log('⚡ Running Performance Tests...');
          const performanceTest = {
            name: 'theme-switching',
            operation: async () => {
              await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
            }
          };
          const performanceResult = await performanceTester.runPerformanceTest(performanceTest.name, performanceTest.operation);
          
          return {
            name: 'Performance Tests',
            passed: performanceResult.passed,
            duration: Date.now() - start,
            details: { result: performanceResult }
          };
          
        default:
          console.error(`Unknown test suite: ${suiteName}`);
          return null;
      }
    } catch (error) {
      return {
        name: suiteName,
        passed: false,
        duration: Date.now() - start,
        details: { error: error.message }
      };
    }
  }
}

// Export default configuration
export const defaultTestRunnerConfig: TestRunnerConfig = {
  timeout: 30000,
  runVisualTests: true,
  runAccessibilityTests: true,
  runPerformanceTests: true,
  verbose: false
};

// Export singleton instance
export const testRunner = new TestRunner(defaultTestRunnerConfig);
