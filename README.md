# Full Stack MERN Blog App

## About the project

A blogging platform built with **React, Redux & Tailwind** on the front end, and **Node.js/Express with MongoDB** on the back end. It includes JWT/Google OAuth authentication, dark‑mode support, CRUD operations for users, posts, comments, and an admin panel for users/posts/comments management

## Installation

1.  Create .env file in the root directory with the following variables:

    `MONGODB_URI=YOUR_MONGODB_URI`
    `JWT_SECRET=YOUR_JWT_SECRET`

1.  Create .env file in the `/client` directory with the following variables:

    `VITE_FIREBASE_API_KEY=YOUR_API_KEY`
    `VITE_CLOUDINARY_URL_SECRET_KEY=YOUR_SECRET_KEY`
    `VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload`
    `VITE_CLOUDINARY_UPLOAD_PRESET=YOUR_UPLOAD_PRESET`

1.  - Run Express server and connect to MongoDB:
      `bash
$ npm run dev` - Run React app: `bash

            $ cd client
            $ npm run dev`

1.  App should be running on `http://localhost:5173/`
