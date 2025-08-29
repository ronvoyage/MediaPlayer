import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export function ApprovalPage() {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'approved' | 'changes'>('idle');

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 900, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Design Approval
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Review the showcase and record your decision below.
          </Typography>
          <TextField
            fullWidth
            label="Notes"
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="success" onClick={() => setStatus('approved')}>
              Approve
            </Button>
            <Button variant="outlined" color="warning" onClick={() => setStatus('changes')}>
              Request Changes
            </Button>
          </Box>
          {status !== 'idle' && (
            <Typography sx={{ mt: 2 }} color={status === 'approved' ? 'success.main' : 'warning.main'}>
              {status === 'approved' ? 'Approved' : 'Changes requested'}{notes ? `: ${notes}` : ''}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
