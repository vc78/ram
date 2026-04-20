# SIID FLASH - Smart Intelligent Infrastructure Design

## 🏗️ Overview

SIID FLASH is a comprehensive construction project management platform that combines AI-powered design generation with practical project management tools. Built with Next.js, it offers multi-language support and advanced features for contractors, architects, and project managers across India.

## ✨ Key Features

### 🌍 Multi-Language Support
- **5 Languages**: English, Telugu, Hindi, Tamil, Kannada
- **Regional Accessibility**: Built for Indian construction professionals
- **Persistent Preferences**: Language choice saved locally
- **Instant Switching**: Change language anytime from any page

### 📅 Enhanced Timeline Management (27 Features)
- Real-time progress tracking
- Budget variance analysis
- Delay detection and alerts
- Task management with checkboxes
- PDF and JSON export
- Phase duplication and deletion
- Risk and milestone tracking
- Team assignment
- Search and filter capabilities
- Auto-save functionality

### 💼 Professional Career Management
- Automated approval/rejection letters
- PDF generation with company branding
- Professional document formatting
- Indian date and currency formats
- Multi-page support
- Instant downloads

### 🤖 AI-Powered Design Generation
- Generate architectural plans from text descriptions
- Multiple design variants
- Cost estimation
- Timeline projection
- Material calculations

### 👷 Contractor Marketplace
- Verified professional profiles
- Rating and review system
- Category-based search
- Direct messaging
- Project portfolio viewing

## 🚀 Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/siid-flash.git

# Navigate to project directory
cd siid-flash

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

1. **Create an account** at `/signup`
2. **Select your language** from the globe icon
3. **Start a new project** from the dashboard
4. **Explore features** through the sidebar navigation

## 📖 Documentation

- **[Features Guide](./FEATURES.md)** - Complete feature documentation
- **[API Reference](./docs/API.md)** - Backend API documentation
- **[Component Library](./docs/COMPONENTS.md)** - UI component guide
- **[Translation Guide](./docs/TRANSLATION.md)** - Adding new languages

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **PDF Generation**: jsPDF + jspdf-autotable
- **State Management**: React Context API
- **Data Persistence**: localStorage (now augmented with a simple server-side JSON database under `/data/*.json` via `/api/db/*` endpoints)
- **Icons**: Lucide React

## 📁 Project Structure

\`\`\`
siid-flash/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── careers/           # Career management
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── advanced-features/ # Feature components
│   └── language-selector.tsx
├── contexts/             # React contexts
│   └── language-context.tsx
├── lib/                  # Utility libraries
│   ├── i18n/            # Translation system
│   └── career-pdf-generator.ts
├── public/              # Static assets
└── styles/              # Global styles
\`\`\`

## 🌐 Language Support

Add new translations in `lib/i18n/translations.ts`:

\`\`\`typescript
export const translations = {
  // ... existing languages
  newLanguage: {
    dashboard: "Translation",
    projects: "Translation",
    // ... more keys
  }
}
\`\`\`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow existing code style
- Add translations for all new text

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- shadcn/ui for the component library
- Vercel for hosting and deployment
- The open-source community

## 📞 Support

- **Email**: venkatbodduluri78@gmail.com
- **Documentation**: [docs.siidflash.com](https://docs.siidflash.com)
- **Community**: [community.siidflash.com](https://community.siidflash.com)
- **Twitter**: [@siidflash](https://twitter.com/siidflash)

## 🗺️ Roadmap

- [ ] Real-time collaboration
- [ ] Mobile native apps
- [ ] Advanced analytics dashboard
- [ ] Integration with accounting software
- [ ] Video call integration
- [ ] Document management system
- [ ] More regional languages
- [ ] Offline mode support

---

**Built with ❤️ by the SIID FLASH team**
"# SIIDVC" 
"# ram" 
