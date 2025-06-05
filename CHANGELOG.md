# Changelog

## [v1.1.1] - 2025-06-06

### Documentation
- Improved usage documentation with better code examples
- Added comprehensive shadcn/ui integration examples with FormField usage

## [v1.1.0] - 2025-06-06

### Added
- Keyboard input restriction for numeric fields (tckn, cardNumber, expiryDate, cvv, phone)
- Only numeric keys are allowed for masked numeric inputs
- Navigation keys (Backspace, Delete, Tab, Arrow keys) support maintained

### Fixed
- Phone field pattern validation error resolved
- TCKN field now properly restricts letter input

### Changed
- Improved performance with stable function references
- Better code organization with helper functions

## [v1.0.0] - 2025-06-05

### Added
- Initial stable release
- `useFormFields` hook
- Support for 10 different input types
- TypeScript type definitions
- React Hook Form compatibility
- shadcn/ui compatibility

### Supported Field Types
- alpha, email, password, phone, tckn, text, cardNumber, expiryDate, cvv, url

### Dependencies
- React 18+
- React Hook Form 7+
- use-mask-input 3+
