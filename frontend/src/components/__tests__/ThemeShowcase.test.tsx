import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import { ThemeShowcase } from '../ThemeShowcase'

// Mock theme context
const mockTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})

const defaultProps = {
  onToggleTheme: vi.fn(),
  isDark: false,
  themeName: 'Classic',
  themeOptions: [
    { value: 'Classic', label: 'Classic' },
    { value: 'Neon', label: 'Neon' },
    { value: 'Cupertino', label: 'Cupertino' }
  ],
  onSelectTheme: vi.fn(),
}

describe('ThemeShowcase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    expect(screen.getByText('MediaPlayer Theme Showcase')).toBeInTheDocument()
  })

  it('displays all tabs correctly', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Forms')).toBeInTheDocument()
    expect(screen.getByText('Media Controls')).toBeInTheDocument()
    expect(screen.getByText('Layout')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('switches between tabs', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Components tab
    const componentsTab = screen.getByText('Components')
    fireEvent.click(componentsTab)
    
    // Should show components content
    expect(screen.getByText('Buttons')).toBeInTheDocument()
  })

  it('displays theme selection in Design tab', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Design tab
    const designTab = screen.getByText('Design')
    fireEvent.click(designTab)
    
    // Should show theme selection
    expect(screen.getByText('Theme', { selector: 'h6' })).toBeInTheDocument()
    expect(screen.getByText('Light')).toBeInTheDocument()
  })

  it('calls onToggleTheme when theme toggle is clicked', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Design tab to access theme toggle
    const designTab = screen.getByText('Design')
    fireEvent.click(designTab)
    
    // Find and click theme toggle
    const themeToggle = screen.getByRole('switch')
    fireEvent.click(themeToggle)
    
    expect(defaultProps.onToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('displays color palette in Design tab', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Design tab
    const designTab = screen.getByText('Design')
    fireEvent.click(designTab)
    
    // Should show color palette section
    expect(screen.getByText('Color Palette')).toBeInTheDocument()
  })

  it('displays typography section in Design tab', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Design tab
    const designTab = screen.getByText('Design')
    fireEvent.click(designTab)
    
    // Should show typography section
    expect(screen.getByText('Typography')).toBeInTheDocument()
  })

  it('handles theme name selection', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Design tab
    const designTab = screen.getByText('Design')
    fireEvent.click(designTab)
    
    // Find theme selector
    const themeSelector = screen.getByRole('combobox')
    expect(themeSelector).toBeInTheDocument()
  })

  it('displays responsive design elements', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <ThemeShowcase {...defaultProps} />
      </ThemeProvider>
    )
    
    // Click on Layout tab
    const layoutTab = screen.getByText('Layout')
    fireEvent.click(layoutTab)
    
    // Should show navigation content
    expect(screen.getByText('Navigation')).toBeInTheDocument()
  })
})
