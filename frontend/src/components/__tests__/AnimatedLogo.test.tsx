import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import { AnimatedLogo } from '../AnimatedLogo'

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
  },
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
  }),
  AnimatePresence: ({ children }: any) => children,
}))

describe('AnimatedLogo', () => {
  it('renders without crashing', () => {
    render(<AnimatedLogo showText={true} />)
    expect(screen.getByText('MediaPlayer')).toBeInTheDocument()
  })

  it('displays the logo text', () => {
    render(<AnimatedLogo showText={true} />)
    const logoText = screen.getByText('MediaPlayer')
    expect(logoText).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<AnimatedLogo showText={true} />)
    // The accessibility attributes are on the Box wrapper, not the text container
    const logoWrapper = screen.getByRole('button')
    expect(logoWrapper).toHaveAttribute('role', 'button')
    expect(logoWrapper).toHaveAttribute('tabIndex', '0')
  })

  it('handles click events', () => {
    render(<AnimatedLogo showText={true} />)
    const logo = screen.getByRole('button')
    fireEvent.click(logo)
    expect(logo).toBeInTheDocument()
  })

  it('handles keyboard events', () => {
    render(<AnimatedLogo showText={true} />)
    const logo = screen.getByRole('button')
    fireEvent.keyDown(logo, { key: 'Enter' })
    expect(logo).toBeInTheDocument()
  })

  it('renders SVG elements', () => {
    render(<AnimatedLogo showText={true} />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom size prop', () => {
    const customSize = 100
    render(<AnimatedLogo size={customSize} showText={true} />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('width', customSize.toString())
    expect(svg).toHaveAttribute('height', customSize.toString())
  })
})
