📱 ConnectHub – MERN Social Media Platform

A real-time social networking platform built as a full MERN (MongoDB, Express, React, Node.js) capstone project. Users can post updates, interact through comments and likes, follow each other, and receive real-time notifications.

💻 Live Demo: https://mern-final-project-micky-migwi.vercel.app/#/login

🚀 Project Overview

ConnectHub solves modern communication challenges by providing a lightweight, responsive social media platform for communities, students, teams, and organizations.

This application demonstrates mastery of:

Full-stack MERN development

Database design

Authentication & authorization

RESTful API development

Real-time updates with Socket.io

Automated testing (unit, integration, E2E)

CI/CD and deployment

UI/UX best practices

Documentation & presentation skills

Created for Week 8 – Capstone Project of the PLP Software Engineering Program.

✨ Key Features
🔐 Authentication & Profiles

JWT-based authentication

User registration & login

Profile editing (bio, avatar)

Follow/unfollow users

📝 Posts & Interactions

Create, edit, delete posts

Upload images

Like/unlike posts

Comment on posts

View full post threads

Pagination & infinite scroll

🔔 Real-Time Notifications

Powered by Socket.io:

Comment notifications

Like notifications

Follow notifications

Live online/offline status

🌓 Light & Dark Mode

Beautiful switchable themes

Preferences stored in local storage

⚙️ Modern Frontend UI

React 18 + Tailwind CSS

Reusable components

React Router

Mobile-first responsive layout

🧪 Testing

Unit tests (React + Node.js)

Integration tests (API endpoints)

End-to-end tests (Cypress)

Automated coverage reports

✈️ Deployment

Backend: Render / Railway

Frontend: Vercel (Live demo above)

CI/CD with GitHub Actions

Environment variables enabled

🧱 Tech Stack

Frontend: React, Tailwind CSS, React Router, Context API/Redux, Axios, Socket.io Client
Backend: Node.js, Express.js, MongoDB + Mongoose, JWT, Socket.io, Multer
Testing: Jest, Supertest, React Testing Library, Cypress

🗂️ Project Structure
connecthub/
 ├── client/          # React frontend
 ├── server/          # Node.js backend
 ├── tests/           # Full test suite
 ├── .github/         # CI/CD pipelines
 ├── README.md
 └── docs/            # Architecture + screenshots (optional)

🗄️ Database Schema

User:

username
email
password
bio
avatar
followers[]
following[]
createdAt


Post:

user
text
images[]
likes[]
comments[]
createdAt


Comment:

user
postId
text
createdAt


Notification:

user
type
sourceUser
postId
read
createdAt

📡 API Endpoints
🔑 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Create a new user
POST	/api/auth/login	Login & receive token
GET	/api/auth/me	Get logged-in user
👤 Users
Method	Endpoint	Description
GET	/api/users/:id	Get user profile
PUT	/api/users/:id	Update profile
POST	/api/users/:id/follow	Follow user
POST	/api/users/:id/unfollow	Unfollow user
📝 Posts
Method	Endpoint	Description
GET	/api/posts	Fetch all posts
POST	/api/posts	Create post
GET	/api/posts/:id	Get single post
PUT	/api/posts/:id	Update post
DELETE	/api/posts/:id	Delete post
💬 Comments
Method	Endpoint	Description
POST	/api/posts/:id/comments	Add comment
DELETE	/api/comments/:id	Delete comment
🔔 Notifications
Method	Endpoint	Description
GET	/api/notifications	Get all notifications
PUT	/api/notifications/read	Mark as read
🛠️ Setup Instructions
1. Clone the repository
git clone https://github.com/yourusername/connecthub.git
cd connecthub

Backend Setup
cd server
npm install


Create .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUDINARY_KEY=optional


Run server:

npm run dev

Frontend Setup
cd client
npm install
npm start

🧪 Running Tests

Backend tests:

npm run test:server


Frontend tests:

npm run test:client


End-to-end tests:

npm run test:e2e

📷 Screenshots
1. Home Feed:  <PASTE LINK HERE>
2. Post Details:  <PASTE LINK HERE>
3. Notifications: <PASTE LINK HERE>
4. Profile Page:  <PASTE LINK HERE>
5. Light/Dark Mode: <PASTE LINK HERE>

🎥 Demo Video Link
<PASTE YOUR VIDEO LINK>

🎤 Presentation Notes

Problem being solved

Tech stack overview

Architecture explanation

Security measures

Demo walkthrough

Future improvements

🤝 Contributing

Pull requests are welcome.

📜 License

MIT License.

❤️ Acknowledgment

Built as part of the Power Learn Project (PLP) Software Engineering Program.
