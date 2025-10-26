# Atomic Design Structure

This project follows the Atomic Design methodology for organizing UI components.

## Directory Structure

```
components/
├── atoms/          # Basic building blocks (16 components)
├── molecules/      # Simple combinations (18 components)
├── organisms/      # Complex combinations (24 components)
└── templates/      # Page templates
```

## Component Categories

### Atoms (Basic UI Elements)
Single-purpose, reusable UI elements that cannot be broken down further.

- `avatar` - User avatar with fallback
- `badge` - Status or category indicator
- `button` - Clickable button with variants
- `checkbox` - Checkbox input
- `input` - Text input field
- `kbd` - Keyboard key indicator
- `label` - Form label
- `progress` - Progress bar
- `radio-group` - Radio button group
- `separator` - Visual divider
- `skeleton` - Loading placeholder
- `slider` - Range slider
- `spinner` - Loading spinner
- `switch` - Toggle switch
- `textarea` - Multi-line text input
- `toggle` - Toggle button

### Molecules (Simple Combinations)
Components composed of multiple atoms working together.

- `alert` - Alert message
- `aspect-ratio` - Aspect ratio container
- `button-group` - Group of buttons
- `card` - Card with header/content/footer
- `collapsible` - Collapsible section
- `empty` - Empty state placeholder
- `field` - Form field with label
- `hover-card` - Hover-activated card
- `input-group` - Input with addons
- `input-otp` - OTP input
- `item` - List/menu item
- `popover` - Popover overlay
- `scroll-area` - Custom scrollable area
- `sonner` - Toast notifications
- `toast` - Toast message
- `toggle-group` - Group of toggles
- `tooltip` - Tooltip overlay

### Organisms (Complex Combinations)
Complex components combining multiple molecules and atoms.

- `accordion` - Expandable sections
- `alert-dialog` - Alert dialog with actions
- `breadcrumb` - Breadcrumb navigation
- `calendar` - Date picker
- `carousel` - Image/content carousel
- `chart` - Chart visualization
- `command` - Command palette
- `context-menu` - Right-click menu
- `dialog` - Modal dialog
- `drawer` - Slide-out drawer
- `dropdown-menu` - Dropdown menu
- `form` - Form with validation
- `menubar` - Menu bar
- `navigation-menu` - Navigation menu
- `pagination` - Pagination controls
- `resizable` - Resizable panels
- `select` - Select dropdown
- `sheet` - Sheet overlay
- `sidebar` - Sidebar navigation
- `table` - Data table
- `tabs` - Tabbed interface
- `toaster` - Toast container

## Import Examples

```tsx
// Import from specific component file
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/molecules/card'
import { Dialog } from '@/components/organisms/dialog'

// Import multiple from barrel exports
import { Button, Input, Label } from '@/components/atoms'
import { Card, Alert } from '@/components/molecules'
import { Dialog, Table } from '@/components/organisms'
```

## Documentation

All components include JSDoc documentation with:
- Module description
- Component category (Atom/Molecule/Organism)
- Usage examples where applicable

## Migration from `/ui`

All components have been migrated from `@/components/ui/*` to their respective atomic folders. Import paths have been updated throughout the codebase.
