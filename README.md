# 📚 BookScout

**BookScout** is a full-stack mobile application designed to help users track their reading journey and discover new books through community recommendations. It allows users to manage their book collection, view recommendations from others, and customize their experience with a sleek dark/light mode interface.

---

## 🚀 Features

- **User Authentication**: Secure Login and Signup functionality.
- **Book Discovery**: Browse a feed of books shared by the community.
- **Book Management**:
  - Add new books with details (Title, Caption, Image).
  - View a list of your shared books.
  - Delete books from your collection.
- **Profile Management**: View user details and join date.
- **Theme Customization**: Toggle between **Light Mode** and **Dark Mode** for a personalized experience.
- **Responsive Design**: Built with React Native for a smooth mobile experience.

---

## 🛠️ Tech Stack

### Backend

- **Node.js** & **Express.js**: RESTful API server.
- **MongoDB**: NoSQL database for storing user and book data.
- **Cloudinary**: Cloud storage for handling image uploads.
- **JWT**: JSON Web Tokens for secure authentication.

### Mobile

- **React Native**: Cross-platform mobile framework.
- **Expo**: Framework and platform for universal React applications.
- **Expo Router**: File-based routing for React Native.
- **Zustand**: Small, fast, and scalable bearbones state-management solution.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (or an emulator).
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas).
- A [Cloudinary](https://cloudinary.com/) account.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookscout.git
cd bookscout
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```env
PORT=3000
Mongo_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm start
```

The server should be running on `http://localhost:3000`.

### 3. Mobile Setup

Navigate to the mobile directory:

```bash
cd ../mobile
```

Install dependencies:

```bash
npm install
```

**Configuration**:
Ensure the mobile app points to your backend. Open `mobile/constants/api.js` and update the `API_URL` if you are running the backend locally:

```javascript
// mobile/constants/api.js
export const API_URL = "http://YOUR_LOCAL_IP_ADDRESS:3000"; // e.g., http://192.168.1.5:3000
```

_Note: If using an emulator, you might use `http://10.0.2.2:3000` (Android) or `http://localhost:3000` (iOS)._

Start the Expo development server:

```bash
npx expo start -c
```

_Note: The `-c` flag clears the cache, which is useful if you've made changes to assets or configuration._

Scan the QR code with the **Expo Go** app on your phone to run the application.

---

## � Usage

1.  **Sign Up/Login**: Create an account to start sharing your books.
2.  **Home Feed**: Browse books shared by other users.
3.  **Add a Book**: Tap the "Share a Book" button (or the + icon) to post a recommendation.
4.  **Profile**: View your shared books and toggle between Light/Dark mode using the sun/moon icon in the header.

---

## �📂 Project Structure

```
bookscout/
├── backend/            # Node.js/Express Server
│   ├── src/
│   │   ├── models/     # Mongoose Models
│   │   ├── routes/     # API Routes
│   │   ├── lib/        # Utilities (DB, Cloudinary)
│   │   └── index.js    # Entry Point
│   └── ...
├── mobile/             # React Native Expo App
│   ├── app/            # Expo Router Screens
│   ├── components/     # Reusable Components
│   ├── assets/         # Images and Styles
│   ├── store/          # Zustand State Management
│   └── ...
└── README.md           # Project Documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
