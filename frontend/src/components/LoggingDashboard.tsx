import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Refresh,
  Clear,
  Download,
  Warning,
  Error,
  Info,
  BugReport
} from '@mui/icons-material';
import { logger } from '../services/logger';

interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  component?: string;
  action?: string;
  message: string;
  metadata?: any;
  error?: any;
}

interface LoggingDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoggingDashboard({ isOpen, onClose }: LoggingDashboardProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [componentFilter, setComponentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [performanceMetrics, setPerformanceMetrics] = useState<Map<string, number[]>>(new Map());
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      // Capture console logs
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;

      console.log = (...args) => {
        originalLog.apply(console, args);
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[')) {
          const logEntry = parseConsoleLog(args[0], args[1]);
          if (logEntry) {
            addLog(logEntry);
          }
        }
      };

      console.warn = (...args) => {
        originalWarn.apply(console, args);
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[')) {
          const logEntry = parseConsoleLog(args[0], args[1]);
          if (logEntry) {
            addLog(logEntry);
          }
        }
      };

      console.error = (...args) => {
        originalError.apply(console, args);
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[')) {
          const logEntry = parseConsoleLog(args[0], args[1]);
          if (logEntry) {
            addLog(logEntry);
          }
        }
      };

      // Update performance metrics and error count
      const interval = setInterval(() => {
        setPerformanceMetrics(logger.getPerformanceMetrics());
        setErrorCount(logger.getErrorCount());
      }, 1000);

      return () => {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [logs, levelFilter, componentFilter, searchTerm]);

  const parseConsoleLog = (logString: string, logData: any): LogEntry | null => {
    try {
      if (logData && typeof logData === 'object') {
        return {
          timestamp: logData.timestamp || new Date().toISOString(),
          level: logData.level || 'info',
          component: logData.component,
          action: logData.action,
          message: logData.message,
          metadata: logData.metadata,
          error: logData.error
        };
      }
    } catch (error) {
      // Fallback parsing
      const levelMatch = logString.match(/\[(DEBUG|INFO|WARN|ERROR|FATAL)\]/);
      if (levelMatch) {
        return {
          timestamp: new Date().toISOString(),
          level: levelMatch[1].toLowerCase() as any,
          message: logString.replace(/\[(DEBUG|INFO|WARN|ERROR|FATAL)\]\s*/, ''),
          component: 'Unknown'
        };
      }
    }
    return null;
  };

  const addLog = (logEntry: LogEntry) => {
    setLogs(prev => [logEntry, ...prev.slice(0, 999)]); // Keep last 1000 logs
  };

  const applyFilters = () => {
    let filtered = logs;

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (componentFilter !== 'all') {
      filtered = filtered.filter(log => log.component === componentFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.component?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const clearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      debug: 'default',
      info: 'primary',
      warn: 'warning',
      error: 'error',
      fatal: 'error'
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'fatal':
        return <Error />;
      case 'warn':
        return <Warning />;
      case 'info':
        return <Info />;
      case 'debug':
        return <BugReport />;
      default:
        return <Info />;
    }
  };

  const components = Array.from(new Set(logs.map(log => log.component).filter(Boolean)));

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '80vw',
        height: '100vh',
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        zIndex: 1300,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Logging Dashboard</Typography>
        <Box>
          <Button startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button startIcon={<Clear />} onClick={clearLogs} color="warning">
            Clear
          </Button>
          <Button startIcon={<Download />} onClick={exportLogs} color="primary">
            Export
          </Button>
          <IconButton onClick={onClose}>
            <ExpandMore />
          </IconButton>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Logs</Typography>
                <Typography variant="h4">{logs.length}</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Error Count</Typography>
                <Typography variant="h4" color="error">{errorCount}</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Performance Metrics</Typography>
                <Typography variant="h4">{performanceMetrics.size}</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Filtered Logs</Typography>
                <Typography variant="h4">{filteredLogs.length}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Level</InputLabel>
              <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="debug">Debug</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warn">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="fatal">Fatal</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Component</InputLabel>
              <Select value={componentFilter} onChange={(e) => setComponentFilter(e.target.value)}>
                <MenuItem value="all">All Components</MenuItem>
                {components.map(comp => (
                  <MenuItem key={comp} value={comp}>{comp}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '2 1 400px', minWidth: '300px' }}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in message, component, or action..."
            />
          </Box>
        </Box>
      </Box>

      {/* Logs Table */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TableContainer component={Paper} sx={{ height: '100%' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Chip
                      icon={getLevelIcon(log.level)}
                      label={log.level.toUpperCase()}
                      color={getLevelColor(log.level) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.component || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.action || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(index)}
                    >
                      {expandedRows.has(index) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Performance Metrics */}
      {performanceMetrics.size > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Array.from(performanceMetrics.entries()).map(([operation, metrics]) => {
              const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
              const min = Math.min(...metrics);
              const max = Math.max(...metrics);
              
              return (
                <Card key={operation} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>{operation}</Typography>
                    <Typography variant="body2">Avg: {avg.toFixed(2)}ms</Typography>
                    <Typography variant="body2">Min: {min.toFixed(2)}ms</Typography>
                    <Typography variant="body2">Max: {max.toFixed(2)}ms</Typography>
                    <Typography variant="body2">Samples: {metrics.length}</Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
