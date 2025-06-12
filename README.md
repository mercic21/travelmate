# TravelMate - Full Stack Travel Booking Platform

A comprehensive travel booking platform that enables users to search and book hotels and events, with an admin dashboard for management.

## 🌟 Project Overview

TravelMate is a modern full-stack application built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides a seamless experience for travel and event booking.

[![Client](https://img.shields.io/badge/client-React-blue.svg)](client/)
[![Server](https://img.shields.io/badge/server-Node.js-green.svg)](server/)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/travelmate.git
cd travelmate

# Install dependencies for both client and server
npm run install-all

# Start both client and server
npm run dev
```

## 🔑 Admin Access

To access the admin dashboard:
- URL: http://localhost:5173/admin
- Email: admin@travelmate.com
- Password: Admin@123

## 🏗️ Project Structure

```
travelmate/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   └── README.md          # Frontend documentation
├── server/                # Backend Node.js server
│   ├── src/              # Source files
│   └── README.md         # Backend documentation
├── package.json          # Root package.json
└── README.md            # Main documentation
```

## ✨ Key Features

### User Features
- 🏨 Hotel search and booking
- 🎭 Event discovery and ticketing
- 💳 Secure payment processing
- 📱 Responsive design
- 🔔 pop-ups

### Admin Features

- 📝 Adding dummy hotels & events
- 🎫 Booking View


## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- React Query
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Integration
- APIs

## 📦 Environment Setup

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret_key
TICKETMASTER_API_KEY=your_api_key
```

## 📝 Scripts


# Install all dependencies
npm  install

# Start development servers
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


👥 Author

 - Initial work - (https://github.com/mercic21)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)

## 📞 Support

For support, email christianmerci11@gmail.com.
