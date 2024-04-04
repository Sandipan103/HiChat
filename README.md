\# HiChat

This repository contains a clone of the WhatsApp messaging application developed using \[React\]\(https://reactjs.org/\) for the frontend and \[Firebase\]\(https://firebase.google.com/\) for the backend.

\#\# Features

- Real-time messaging
- User authentication
- Group chats
- Media sharing \(images, videos, documents\)
- Online presence status
- Push notifications

\#\# Installation

To run this application locally, follow these steps:

1. Clone this repository to your local machine:

\```bash
git clone https://github.com/Sandipan103/WhatsApp.git
\```

2. Navigate to the project directory:

\```bash
cd WhatsApp
\```

3. Install the dependencies:

\```bash
npm install
\```

4. Set up Firebase:
   - Create a new Firebase project.
   - Enable Authentication and Firestore.
   - Copy the Firebase configuration object.
   - Create a \`.env\` file in the root directory and add your Firebase configuration:

   \`\`\`
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   \`\`\`

5. Start the development server:

\```bash
npm start
\```

6. Open \[http://localhost:3000\](http://localhost:3000) to view the app in your browser.

\#\# Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

\#\# License

This project is licensed under the MIT License - see the \[LICENSE\](LICENSE) file for details.
