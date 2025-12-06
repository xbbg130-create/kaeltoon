# 📚 Kaeltoon

A modern, feature-rich manga/manhwa reader web application built with Next.js 16, featuring a clean UI, dark mode support, and reading history tracking.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🎨 User Interface
- **Modern & Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Smooth Animations** - Fade-in/fade-out transitions for better UX
- **Lazy Loading Images** - Optimized image loading with IntersectionObserver
- **Progress Indicator** - Real-time page loading progress

### 📖 Reading Experience
- **Chapter Reader** - Clean, distraction-free reading interface
- **Navigation Controls** - Easy chapter navigation (Previous/Next)
- **Chapter List** - Quick access to all available chapters
- **Auto-save Reading History** - Automatically tracks your reading progress
- **Continue Reading** - Pick up where you left off

### 📚 Reading History
- **History Page** - View all manga you've read
- **Timestamp Tracking** - See when you last read each manga
- **Continue Reading** - Jump back to your last chapter
- **Remove Items** - Clean up your history individually
- **Clear All** - Remove all history with confirmation dialog
- **LocalStorage Based** - No account needed, data stored locally

### 🔍 Search & Discovery
- **Search Functionality** - Find manga quickly
- **Comic Details** - View manga information and chapters
- **Responsive Cards** - Beautiful manga cards with hover effects

### 🎯 Additional Features
- **Custom Confirmation Dialogs** - Modern, accessible confirmation modals
- **Mobile-Optimized** - Full-width buttons and touch-friendly interface
- **Keyboard Navigation** - Full keyboard support for accessibility
- **SEO Optimized** - Proper meta tags and semantic HTML

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/kaeltoon.git
cd kaeltoon
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
kaeltoon/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── comic/[slug]/      # Comic detail page
│   │   ├── history/           # Reading history page
│   │   ├── read/[...slug]/    # Chapter reader page
│   │   ├── search/            # Search page
│   │   ├── layout.jsx         # Root layout
│   │   └── page.jsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # UI components (Button, Card, Dialog, etc.)
│   │   ├── ConfirmDialog.jsx # Confirmation dialog component
│   │   ├── Navbar.jsx        # Navigation bar
│   │   └── ThemeProvider.jsx # Theme context provider
│   └── lib/                   # Utility functions
│       ├── api.js            # API functions
│       ├── readingHistory.js # Reading history utilities
│       └── utils.js          # Helper functions
├── public/                    # Static assets
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
  - Dialog
  - Dropdown Menu
  - Select
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classNames
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes

### Development
- **ESLint** - Code linting
- **Babel React Compiler** - Optimized React compilation
- **TypeScript Types** - Type definitions for better DX

## 🎨 Key Components

### Reading History System

The reading history feature uses localStorage to track user reading progress:

```javascript
// Save reading history
saveReadingHistory({
  comicSlug: 'manga-slug',
  chapterSlug: 'chapter-slug',
  mangaTitle: 'Manga Title',
  chapterTitle: 'Chapter 1',
});

// Get all history
const history = getReadingHistory();

// Remove specific item
removeFromHistory('manga-slug');

// Clear all history
clearReadingHistory();
```

### Theme System

Built-in dark/light mode with system preference detection:

```javascript
const { theme, isDarkMode, toggleTheme } = useTheme();
```

### Lazy Loading Images

Optimized image loading with IntersectionObserver for better performance:

```javascript
<PageImage
  src={imageUrl}
  alt="Page 1"
  index={0}
  onImageLoad={() => handleImageLoad()}
/>
```

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🔒 Data Privacy

- **No Backend Required** - All data stored locally
- **No User Accounts** - No registration needed
- **LocalStorage Only** - Reading history stored in browser
- **No Tracking** - Privacy-focused design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/kaeltoon](https://github.com/yourusername/kaeltoon)

---

Made with ❤️ using Next.js
