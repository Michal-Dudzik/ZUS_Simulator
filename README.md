# React Template

A modern, feature-rich React template built with Vite, providing a solid foundation for web applications with internationalization, theming, routing, and admin panel structure.

## Features

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Latest React with modern patterns
- 🎨 **Ant Design** - Professional UI component library
- 🌍 **Internationalization** - Multi-language support with i18next
- 🎯 **React Router** - Client-side routing with lazy loading
- 🎨 **Theme System** - Dark/light mode with CSS custom properties
- 🔐 **Admin Panel** - Pre-built admin layout with authentication patterns
- 📱 **Responsive Design** - Mobile-first responsive layouts
- 🛠️ **ESLint** - Code quality and consistency

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this template
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8888`

## Project Structure

```
src/
├── common/                 # Shared utilities and components
│   ├── components/        # Reusable UI components
│   │   ├── AppFooter.jsx  # Application footer
│   │   ├── AppHeader.jsx  # Navigation header with theme toggle
│   │   └── PublicLayout.jsx # Main layout wrapper
│   ├── config/           # Configuration files
│   │   └── featureFlags.js # Feature flag management
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.jsx # Theme management context
│   ├── hooks/           # Custom React hooks
│   │   ├── useTheme.js  # Theme switching hook
│   │   ├── useViewportHeight.js # Viewport utilities
│   │   └── useWindowSize.js # Window size tracking
│   └── services/        # API and external services
│       └── api.js       # HTTP client utilities
├── features/            # Feature-based modules
│   ├── adminPanel/     # Admin panel feature
│   │   ├── components/ # Admin-specific components
│   │   ├── hooks/      # Admin-specific hooks
│   │   ├── pages/      # Admin page components
│   │   └── styles/     # Admin-specific styles
│   ├── error/          # Error handling pages
│   │   └── NotFoundPage.jsx # 404 error page
│   └── home/           # Home page feature
│       └── HomePage.jsx # Landing page component
├── i18n/               # Internationalization
│   ├── en.json         # English translations
│   ├── pl.json         # Polish translations
│   ├── index.js        # i18n configuration
│   └── useLanguage.js  # Language switching hook
├── styles/             # Global styles and themes
│   ├── App.css         # Application styles
│   ├── index.css       # Global CSS reset and variables
│   └── theme.js        # Theme configuration
├── App.jsx             # Root application component
├── main.jsx            # Application entry point
└── router.jsx          # Route configuration
```

## Architecture Patterns

### Feature-Based Organization

The template uses a feature-based folder structure where each feature contains its own components, hooks, pages, and styles. This promotes:

- **Modularity**: Features are self-contained and can be easily added/removed
- **Scalability**: New features follow the same organizational pattern
- **Maintainability**: Related code is co-located

### Common Utilities Layer

Shared functionality is organized in the `src/common/` directory:

- **Components**: Reusable UI components used across features
- **Contexts**: React contexts for global state management
- **Hooks**: Custom hooks for common functionality
- **Services**: API clients and external service integrations

### Routing Architecture

The template uses React Router with:

- **Lazy Loading**: Components are loaded on-demand for better performance
- **Nested Routes**: Hierarchical routing structure
- **Layout Routes**: Shared layouts for different sections (public, admin)

### Theme System

A flexible theming system built with:

- **CSS Custom Properties**: Dynamic theme switching
- **Context API**: Theme state management
- **Ant Design Integration**: Consistent component theming

## Customization Guide

### Adding New Features

1. Create a new directory in `src/features/`
2. Follow the established structure:
   ```
   src/features/yourFeature/
   ├── components/
   ├── hooks/
   ├── pages/
   └── styles/
   ```
3. Add routes in `src/router.jsx`
4. Update navigation in `AppHeader.jsx` if needed

### Modifying the Admin Panel

The admin panel provides a complete authentication and layout structure:

1. **Authentication**: Modify `src/features/adminPanel/hooks/useAuth.js`
2. **Menu Items**: Update `src/features/adminPanel/components/SideMenu.jsx`
3. **Pages**: Add new admin pages in `src/features/adminPanel/pages/`
4. **Styling**: Customize admin styles in `src/features/adminPanel/styles/`

### Adding Translations

1. Add new keys to `src/i18n/en.json` and `src/i18n/pl.json`
2. Use the `useTranslation` hook in components:
   ```jsx
   import { useTranslation } from 'react-i18next';
   
   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t('myKey')}</h1>;
   }
   ```

### Customizing Themes

1. Modify CSS custom properties in `src/styles/index.css`
2. Update theme configuration in `src/styles/theme.js`
3. Add new theme variants in `ThemeContext.jsx`

### API Integration

Replace the placeholder API service in `src/common/services/api.js`:

1. Configure your API base URL
2. Add authentication headers
3. Implement error handling
4. Create feature-specific API functions

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server on port 8888
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

### Development Server

The development server runs on `http://localhost:8888` with:

- **Hot Module Replacement (HMR)**: Instant updates during development
- **Host Binding**: Accessible from other devices on the network
- **Error Overlay**: Visual error reporting in the browser

### Code Quality

The template includes ESLint configuration for:

- React best practices
- Hook usage rules
- Code consistency
- Import/export standards

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory with:

- Minified JavaScript and CSS
- Asset optimization
- Tree shaking for smaller bundle sizes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ support required
- Mobile browsers supported

## Contributing

When contributing to projects built with this template:

1. Follow the established folder structure
2. Add appropriate translations for new features
3. Maintain responsive design principles
4. Write meaningful component and function names
5. Use the existing theme system for styling

## License

This template is provided as-is for educational and development purposes. Customize as needed for your projects.
