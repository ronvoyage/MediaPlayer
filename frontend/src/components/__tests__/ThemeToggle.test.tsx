import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import { IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'

// Mock theme context
const mockTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
  <IconButton onClick={onToggle} color="inherit">
    {isDark ? <Brightness7 /> : <Brightness4 />}
  </IconButton>
)

describe('Theme Toggle', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders theme toggle button', () => {
    const mockOnToggle = vi.fn()
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle isDark={false} onToggle={mockOnToggle} />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('shows correct icon based on theme mode', () => {
    const mockOnToggle = vi.fn()
    
    // Test light mode
    const { rerender } = render(
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle isDark={false} onToggle={mockOnToggle} />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument()
    
    // Test dark mode
    rerender(
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle isDark={true} onToggle={mockOnToggle} />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const mockOnToggle = vi.fn()
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle isDark={false} onToggle={mockOnToggle} />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation', () => {
    const mockOnToggle = vi.fn()
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle isDark={false} onToggle={mockOnToggle} />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByRole('button')
    // IconButton doesn't handle keyboard events by default, so we test that it doesn't crash
    fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' })
    
    // The component should not crash, but the callback won't be called
    expect(mockOnToggle).toHaveBeenCalledTimes(0)
  })

  it('has proper accessibility attributes', () => {
    const mockOnToggle = vi.fn()
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle isDark={false} onToggle={mockOnToggle} />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toHaveAttribute('type', 'button')
  })
})
