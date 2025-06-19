# AI Playground - Workflow Builder

A modern Next.js application for creating and customizing AI workflows, inspired by Higgsfield.ai and Archetypes. This project implements a workflow-based interface for generating personalized avatars through a series of interactive steps.

## Features

- Modern, responsive UI with dark/light theme support
- Step-by-step workflow interface
- Smooth animations and transitions
- Quiz-based personality assessment
- AI-powered avatar generation
- Customizable templates for Vercel deployment

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Headless UI
- Heroicons
- Next Themes

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-playground
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Root layout with theme provider
│   ├── page.tsx      # Main page component
│   └── globals.css   # Global styles and theme variables
├── components/
│   ├── workflow-builder.tsx  # Main workflow interface
│   └── theme-toggle.tsx      # Theme switcher component
└── types/
    └── workflow.ts    # TypeScript definitions
```

## Workflow Steps

1. Photo Upload & Validation
2. Quiz Type Selection
3. Personality Assessment
4. Result Calculation
5. Prompt Generation
6. Avatar Generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
