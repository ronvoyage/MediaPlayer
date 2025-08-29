// Accessibility Testing Utility
// Provides automated accessibility testing with proper timeouts

export interface AccessibilityTestConfig {
  timeout: number;
  rules: string[];
  level: 'A' | 'AA' | 'AAA';
  includeWarnings: boolean;
}

export interface AccessibilityViolation {
  rule: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  element: string;
  help: string;
  helpUrl?: string;
}

export interface AccessibilityTestResult {
  passed: boolean;
  violations: AccessibilityViolation[];
  warnings: AccessibilityViolation[];
  score: number;
  duration: number;
  timestamp: string;
}

export class AccessibilityTester {
  private config: AccessibilityTestConfig;

  constructor(config: Partial<AccessibilityTestConfig> = {}) {
    this.config = {
      timeout: 10000, // 10 second default timeout
      rules: ['color-contrast', 'button-name', 'image-alt', 'label', 'heading-order'],
      level: 'AA',
      includeWarnings: true,
      ...config
    };
  }

  /**
   * Test accessibility of a component or page
   * @param selector CSS selector for the element to test
   * @param testName Name for the test
   * @param timeout Optional timeout override
   */
  async testAccessibility(
    selector: string, 
    testName: string, 
    timeout?: number
  ): Promise<AccessibilityTestResult> {
    const testTimeout = timeout || this.config.timeout;
    const start = Date.now();
    
    try {
      console.log(`Running accessibility test: ${testName}`);
      
      // Wait for element to be available
      await this.waitForElement(selector, testTimeout);
      
      // Simulate accessibility testing (in real implementation, this would use axe-core or similar)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock accessibility violations
      const violations = this.generateMockViolations();
      const warnings = this.config.includeWarnings ? this.generateMockWarnings() : [];
      
      const duration = Date.now() - start;
      const passed = violations.length === 0;
      const score = this.calculateAccessibilityScore(violations, warnings);
      
      const result: AccessibilityTestResult = {
        passed,
        violations,
        warnings,
        score,
        duration,
        timestamp: new Date().toISOString()
      };
      
      console.log(`✓ ${testName}: ${passed ? 'Passed' : 'Failed'} (Score: ${score}%, ${duration}ms)`);
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - start;
      
      console.error(`✗ ${testName}: ${error}`);
      
      return {
        passed: false,
        violations: [{
          rule: 'test-execution',
          impact: 'critical',
          description: `Test execution failed: ${error}`,
          element: selector,
          help: 'Check test setup and element availability'
        }],
        warnings: [],
        score: 0,
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Run accessibility tests for multiple components
   * @param testCases Array of test cases
   */
  async runAccessibilityTests(
    testCases: Array<{
      name: string;
      selector: string;
      description: string;
      level?: 'A' | 'AA' | 'AAA';
    }>
  ): Promise<Array<{
    name: string;
    result: AccessibilityTestResult;
  }>> {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.testAccessibility(
          testCase.selector, 
          testCase.name,
          undefined, // Use default timeout
          testCase.level
        );
        
        results.push({
          name: testCase.name,
          result
        });
        
      } catch (error) {
        console.error(`Accessibility test failed for ${testCase.name}: ${error}`);
        
        results.push({
          name: testCase.name,
          result: {
            passed: false,
            violations: [{
              rule: 'test-execution',
              impact: 'critical',
              description: `Test execution failed: ${error}`,
              element: testCase.selector,
              help: 'Check test setup and element availability'
            }],
            warnings: [],
            score: 0,
            duration: 0,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
    
    return results;
  }

  /**
   * Generate accessibility report
   * @param results Test results
   */
  generateAccessibilityReport(
    results: Array<{
      name: string;
      result: AccessibilityTestResult;
    }>
  ): string {
    const total = results.length;
    const passed = results.filter(r => r.result.passed).length;
    const failed = total - passed;
    const totalViolations = results.reduce((sum, r) => sum + r.result.violations.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.result.warnings.length, 0);
    const averageScore = results.reduce((sum, r) => sum + r.result.score, 0) / total;
    const totalDuration = results.reduce((sum, r) => sum + r.result.duration, 0);
    
    const report = `
Accessibility Test Report
=========================
Total Tests: ${total}
Passed: ${passed}
Failed: ${failed}
Success Rate: ${((passed / total) * 100).toFixed(1)}%
Average Score: ${averageScore.toFixed(1)}%
Total Violations: ${totalViolations}
Total Warnings: ${totalWarnings}
Total Duration: ${totalDuration}ms
Average Duration: ${(totalDuration / total).toFixed(1)}ms

${failed > 0 ? 'Failed Tests:' : 'All tests passed!'}
${results.filter(r => !r.result.passed).map(r => `- ${r.name}: Score ${r.result.score}% (${r.result.violations.length} violations)`).join('\n')}

${totalViolations > 0 ? 'Critical Violations:' : 'No critical violations found'}
${results.flatMap(r => r.result.violations.filter(v => v.impact === 'critical')).map(v => `- ${v.rule}: ${v.description}`).join('\n')}

${totalWarnings > 0 ? 'Warnings:' : 'No warnings'}
${results.flatMap(r => r.result.warnings).map(w => `- ${w.rule}: ${w.description}`).join('\n')}
    `.trim();
    
    return report;
  }

  /**
   * Wait for an element to be available with timeout
   * @param selector CSS selector
   * @param timeout Timeout in milliseconds
   */
  private async waitForElement(selector: string, timeout: number): Promise<void> {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      // Simulate element check (in real implementation, this would check DOM)
      const elementExists = Math.random() > 0.2; // 80% chance element exists
      
      if (elementExists) {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Element ${selector} not found within ${timeout}ms`);
  }

  /**
   * Generate mock accessibility violations for testing
   */
  private generateMockViolations(): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];
    
    // Simulate some common violations
    if (Math.random() > 0.7) {
      violations.push({
        rule: 'color-contrast',
        impact: 'serious',
        description: 'Elements must meet minimum color contrast ratio requirements',
        element: '.button-primary',
        help: 'Ensure sufficient color contrast between text and background',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/color-contrast'
      });
    }
    
    if (Math.random() > 0.8) {
      violations.push({
        rule: 'button-name',
        impact: 'critical',
        description: 'Buttons must have accessible names',
        element: 'button[aria-label=""]',
        help: 'Provide accessible names for buttons using aria-label, aria-labelledby, or text content',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/button-name'
      });
    }
    
    return violations;
  }

  /**
   * Generate mock accessibility warnings for testing
   */
  private generateMockWarnings(): AccessibilityViolation[] {
    const warnings: AccessibilityViolation[] = [];
    
    if (Math.random() > 0.6) {
      warnings.push({
        rule: 'heading-order',
        impact: 'moderate',
        description: 'Heading levels should only increase by one',
        element: 'h1, h3',
        help: 'Ensure heading levels follow a logical sequence',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/heading-order'
      });
    }
    
    return warnings;
  }

  /**
   * Calculate accessibility score based on violations and warnings
   * @param violations Array of violations
   * @param warnings Array of warnings
   */
  private calculateAccessibilityScore(
    violations: AccessibilityViolation[], 
    warnings: AccessibilityViolation[]
  ): number {
    let score = 100;
    
    // Deduct points for violations
    violations.forEach(violation => {
      switch (violation.impact) {
        case 'critical':
          score -= 25;
          break;
        case 'serious':
          score -= 15;
          break;
        case 'moderate':
          score -= 10;
          break;
        case 'minor':
          score -= 5;
          break;
      }
    });
    
    // Deduct points for warnings (smaller penalty)
    warnings.forEach(warning => {
      switch (warning.impact) {
        case 'critical':
          score -= 10;
          break;
        case 'serious':
          score -= 7;
          break;
        case 'moderate':
          score -= 5;
          break;
        case 'minor':
          score -= 2;
          break;
      }
    });
    
    return Math.max(0, score);
  }
}

// Export default configuration
export const defaultAccessibilityConfig: AccessibilityTestConfig = {
  timeout: 10000,
  rules: ['color-contrast', 'button-name', 'image-alt', 'label', 'heading-order'],
  level: 'AA',
  includeWarnings: true
};

// Export singleton instance
export const accessibilityTester = new AccessibilityTester(defaultAccessibilityConfig);
