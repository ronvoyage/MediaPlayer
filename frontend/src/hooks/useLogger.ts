import { useCallback } from 'react';
import { logger } from '../services/logger';

export function useLogger(componentName: string) {
  const logUserAction = useCallback((action: string, metadata?: object) => {
    logger.userAction(action, componentName, metadata);
  }, [componentName]);

  const logError = useCallback((error: Error, context?: string) => {
    logger.error(`Component error in ${componentName}: ${context || 'Unknown context'}`, error, {
      component: componentName
    });
  }, [componentName]);

  const logInfo = useCallback((message: string, metadata?: object) => {
    logger.info(message, { component: componentName, metadata });
  }, [componentName]);

  const logWarning = useCallback((message: string, metadata?: object) => {
    logger.warn(message, { component: componentName, metadata });
  }, [componentName]);

  return { 
    logUserAction, 
    logError, 
    logInfo, 
    logWarning 
  };
}
