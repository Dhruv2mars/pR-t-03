# pR-t-03 - Cross-Platform Code Editor

A comprehensive coding environment and execution app for educational platforms, enabling students to write, run, and persist code in Python, JavaScript, and HTML/CSS. Built with a monorepo architecture using Turborepo, TypeScript, and Bun.

## 🚀 Features

### Core Functionality
- **Monaco Editor** with VS Dark theme and syntax highlighting for Python, JavaScript, and HTML/CSS
- **Code Execution** via Judge0 API (web) or local runtimes (macOS)
- **Interactive Console** with stdin support for user input
- **HTML/CSS Preview** with live rendering in iframe/webview
- **SQLite Persistence** for code sessions and app data across sessions
- **VS Code-like UI/UX** with resizable panes and dark theme

### Platform Support
- **Web**: Hosted on Vercel, using Judge0's hosted API (online-only)
- **macOS**: Offline-first, using user-installed Python and Node.js runtimes

## 📁 Project Structure

```
pR-t-03/
├── apps/
│   ├── web/                 # Vite + React web application
│   └── macos/               # Tauri macOS application
├── packages/
│   ├── editor-core/         # Shared React components
│   └── db-utils/           # SQLite schema and queries
├── package.json            # Root package.json with workspaces
├── turbo.json             # Turborepo configuration
└── tsconfig.json          # Shared TypeScript configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- **Bun** (recommended) or **pnpm** as package manager
- **Node.js** 18+ for development
- **Rust** (for macOS app development with Tauri)
- **Python 3** (for macOS runtime execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pR-t-03
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   pnpm install
   ```

3. **Set up environment variables (Web app)**
   ```bash
   cd apps/web
   cp .env.example .env
   # Add your RapidAPI key for Judge0
   ```

### Development

#### Web Application
```bash
# Start web development server
bun dev --filter=web
# or
cd apps/web && bun dev
```

#### macOS Application
```bash
# Start macOS development server
bun dev --filter=macos
# or
cd apps/macos && bun tauri dev
```

#### All Applications
```bash
# Start all applications
bun dev
```

### Building

#### Web Application
```bash
bun build --filter=web
```

#### macOS Application
```bash
cd apps/macos
bun tauri build
```

#### All Applications
```bash
bun build
```

## 🏗️ Architecture

### Monorepo Structure
- **Turborepo** for build orchestration and caching
- **Shared packages** for consistent components and database logic
- **Platform-specific apps** with tailored execution strategies

### Shared Components (`@project/editor-core`)
- `Editor.tsx` - Monaco Editor with language selection
- `Console.tsx` - Terminal-like console with stdin support
- `Preview.tsx` - HTML/CSS preview component
- `Buttons.tsx` - Run/Clear action buttons

### Database Layer (`@project/db-utils`)
- **Web**: sql.js (WebAssembly SQLite) with IndexedDB persistence
- **macOS**: better-sqlite3 with file-based database
- Unified query interface with platform-specific adapters

### Code Execution
- **Web**: Judge0 API with language IDs (Python: 71, JavaScript: 63)
- **macOS**: Local runtime execution with process spawning
- Consistent ExecutionResult interface across platforms

## 🎨 UI/UX Design

### VS Code-Inspired Interface
- **Dark theme** with custom color palette
- **Fira Code font** for code and UI elements
- **Resizable panes** with drag handles
- **Professional layout** mimicking VS Code's structure

### Layout Structure
- **Editor pane** (~70% width) with language selector
- **Console pane** (~30% height, resizable) below editor
- **Preview pane** (50% width, resizable) for HTML/CSS output
- **Action buttons** for Run/Clear operations

## 🔧 Configuration

### Judge0 API (Web)
- Requires RapidAPI key for Judge0 CE
- Free tier: 50 submissions/day
- Supports Python, JavaScript, and HTML execution

### Local Runtimes (macOS)
- **Python**: Requires `python3` command availability
- **Node.js**: Requires `node` command availability
- **Runtime detection** with modal prompts for missing dependencies

### Database Schema
```sql
-- Code sessions table
CREATE TABLE code_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('python', 'javascript', 'html')),
  output TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- App data table
CREATE TABLE app_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);
```

## 🧪 Testing

### Web Application Testing
```bash
cd apps/web
bun test
```

### macOS Application Testing
```bash
cd apps/macos
bun test
```

### Test Coverage
- Monaco Editor integration and theme application
- Judge0 API execution for all supported languages
- SQLite CRUD operations for both platforms
- Console stdin/stdout handling
- HTML/CSS preview rendering

## 🚀 Deployment

### Web Application (Vercel)
```bash
cd apps/web
bun build
# Deploy to Vercel
```

### macOS Application
```bash
cd apps/macos
bun tauri build
# Generates .app bundle in src-tauri/target/release/bundle/
```

## 🔒 Security Considerations

### Web Platform
- Code sanitization before Judge0 submission
- Sandboxed iframe for HTML/CSS previews
- No direct file system access

### macOS Platform
- Isolated process execution for code running
- Temporary file cleanup after execution
- Restricted file access to app data directory
- Input sanitization for Tauri commands

## 📝 Development Notes

### Known Limitations
- **Web**: Judge0 free tier rate limiting
- **macOS**: Requires manual runtime installation
- **Prototype scope**: Basic features only, no advanced IDE features

### Future Enhancements
- Syntax error highlighting
- Code autocompletion
- Multiple file support
- Git integration
- Plugin system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the GitHub Issues page
2. Review the troubleshooting section below
3. Create a new issue with detailed information

### Troubleshooting

#### Web Application
- **Monaco Editor not loading**: Check network connectivity and CDN access
- **Judge0 API errors**: Verify RapidAPI key and rate limits
- **Database issues**: Clear browser storage and reload

#### macOS Application
- **Runtime not found**: Install Python 3 or Node.js as prompted
- **Build failures**: Ensure Rust and Tauri CLI are properly installed
- **Database errors**: Check app data directory permissions

---

Built with ❤️ using Turborepo, React, Tauri, and Monaco Editor.