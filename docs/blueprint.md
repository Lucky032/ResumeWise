# **App Name**: ResumeWise

## Core Features:

- User Authentication: Secure user authentication via email, Google, or GitHub, managed with Firebase Authentication.
- AI-Powered Summary Generation: Utilize OpenAI to generate professional resume summaries based on user input. Tool generates output based on the user input.
- Template Selection: Offer a variety of resume templates with customizable layouts and color schemes, stored and managed within Firestore.
- Real-Time Resume Editor: Provide a live resume editor with drag-and-drop functionality and instant preview updates.
- ATS Optimization Tool: Analyze resumes for ATS compatibility and suggest improvements using a Cloud Function.
- PDF Export: Enable users to download their resumes in PDF format, generated using Cloud Functions and Puppeteer.
- Resume Sharing: Allow users to generate shareable links for their resumes, with view count tracking stored in Firestore.

## Style Guidelines:

- Primary color: Deep sky blue (#00BFFF) for trustworthiness and clarity.
- Background color: Light grayish-blue (#E6F7FF), provides a clean, professional backdrop.
- Accent color: Electric indigo (#6F00FF) to draw attention to calls to action, as well as generate a unique user experience.
- Body font: 'Inter' (sans-serif) for a modern and readable text.
- Headline font: 'Space Grotesk' (sans-serif) a clean modern aesthetic for headlines.
- Use minimalist icons to represent different sections of the resume, ensuring they are ATS-friendly.
- Subtle animations to acknowledge user actions and enhance the editing experience, avoiding distracting transitions.