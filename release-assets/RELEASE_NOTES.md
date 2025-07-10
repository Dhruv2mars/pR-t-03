# pR-t-03 Code Editor v0.1.0

## 🚀 First Release - Cross-Platform Code Editor

A comprehensive coding environment and execution app for educational platforms, enabling students to write, run, and persist code in Python, JavaScript, and HTML/CSS.

### ✨ Features

#### Core Functionality
- **Monaco Editor** with VS Dark theme and syntax highlighting
- **Code Execution** via local runtimes (Python, Node.js) 
- **Interactive Console** with stdin support for user input
- **HTML/CSS Live Preview** with real-time updates as you type
- **SQLite Persistence** for code sessions across app restarts
- **VS Code-like UI/UX** with resizable panes and dark theme

#### Language Support
- **Python** - Full execution with input() support
- **JavaScript** - Console.log output and error handling  
- **HTML/CSS** - Live preview with automatic updates

#### macOS Native Features
- **Offline-first** - No internet required for code execution
- **Local runtimes** - Uses your installed Python and Node.js
- **Native performance** - Built with Tauri for optimal speed
- **macOS integration** - Proper app bundle and system integration

### 🛠️ Installation

#### System Requirements
- **macOS**: 10.15 (Catalina) or later
- **Architecture**: Apple Silicon (M1/M2/M3) - ARM64
- **Python 3**: Required for Python code execution
- **Node.js**: Required for JavaScript code execution

#### Installation Steps
1. Download `Code Editor_0.1.0_aarch64.dmg`
2. Open the DMG file
3. Drag "Code Editor" to your Applications folder
4. Launch the app from Applications

#### First Launch
- The app may show a security warning on first launch
- Go to System Preferences → Security & Privacy → General
- Click "Open Anyway" to allow the app to run

### 🔧 Usage

#### Getting Started
1. **Select Language**: Choose Python, JavaScript, or HTML from the dropdown
2. **Write Code**: Use the Monaco editor with syntax highlighting
3. **Run Code**: Click the "Run" button to execute your code
4. **View Output**: See results in the console panel

#### HTML/CSS Workflow
1. **Write HTML/CSS**: Code appears in the editor
2. **Click Run**: Preview panel shows your webpage
3. **Edit Code**: Preview updates live as you type
4. **Click Run Again**: Refreshes the preview

#### Python/JavaScript Workflow  
1. **Write Code**: Full language support with error handling
2. **Interactive Input**: Use input() in Python for user interaction
3. **Console Output**: See print statements and errors
4. **Persistent Sessions**: Code is automatically saved

### 🐛 Known Issues

- **Runtime Detection**: App will prompt if Python/Node.js is not installed
- **File Access**: Currently single-file editing only
- **Unsigned App**: May require security permission on first launch

### 🔒 Security

- **Local Execution**: All code runs locally on your machine
- **Sandboxed Preview**: HTML/CSS preview runs in isolated iframe
- **No Network**: No data sent to external servers
- **Open Source**: Full source code available on GitHub

### 📝 Technical Details

- **Built with**: Tauri 2.0, React 18, TypeScript, Monaco Editor
- **Database**: SQLite with better-sqlite3
- **Architecture**: Rust backend, React frontend
- **Bundle Size**: ~4.1MB DMG file
- **Performance**: Native speed with minimal memory usage

### 🔍 Verification

**SHA256 Checksum**: `0de137e2381815a1cbda36d1b6cb99aaf1d6da3bfd4e5a9d7a9ef2980c04f040`

Verify the download integrity:
```bash
shasum -a 256 "Code Editor_0.1.0_aarch64.dmg"
```

### 🆘 Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/Dhruv2mars/pR-t-03/issues)
- **Source Code**: Available at [GitHub Repository](https://github.com/Dhruv2mars/pR-t-03)
- **License**: MIT License

### 🙏 Acknowledgments

Built with modern web technologies and Rust for optimal performance and security.

---

**Download**: `Code Editor_0.1.0_aarch64.dmg` (4.1MB)  
**Platform**: macOS Apple Silicon (M1/M2/M3)  
**Version**: 0.1.0  
**Release Date**: July 9, 2025