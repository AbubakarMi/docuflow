# **App Name**: Docuflow

## Core Features:

- Authentication & Tenant Isolation: Implement user authentication with Firebase Auth (email/password + Google sign-in), ensuring each user belongs to a workspace with isolated Firestore collections.
- Template Management: Allow users to upload .docx or .pdf templates, detect placeholders, and store template metadata in Firestore.
- Document Generation: Enable users to auto-generate forms from placeholders, fill data, and generate documents (PDF and DOCX), saving them to Firebase Storage.
- Inventory & Profit Tracker: Add items with name, cost, price, and quantity; auto-calculate total revenue, cost, and profit/loss, displayed in a simple analytics dashboard.
- AI Placeholder Suggestion: Suggest placeholder names for uploaded templates using AI as a tool. 

## Style Guidelines:

- Primary color: Purple (#6C2B89) to evoke trust and creativity. Purple has a slightly serious quality.
- Background color: Light gray (#F8F9FA) for clarity and calm.
- Accent color: Teal (#00C897) to represent balance and growth. Different brightness from purple and low saturation make for a balanced accent.
- Font: 'Inter' (sans-serif) for a modern and neutral look, suitable for both headlines and body text.
- Employ minimal iconography using Lucide Icons for a clean interface.
- Dashboard layout: left sidebar (logo + nav), main panel (cards + charts) to make navigation predictable and intuitive.
- Apply subtle animations using Framer Motion to enhance user experience without distraction.