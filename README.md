# TechPravah — Tech News Platform

A web-based **Tech News & Content Management Platform** built using the **MERN stack**, designed to let a team of authors and admins publish, manage, and share the latest technology news — without depending on a live third-party news API.

Instead of pulling articles from external News APIs, TechPravah acts as its **own content source**: authors and admins write, edit, and publish articles directly, while readers browse, search, and comment on them — similar in concept to a mini version of platforms like TechCrunch or The Verge.

---

## Project Overview

The system follows a simple, real-world **content publishing workflow**.

An **Admin** manages the overall platform (categories, users, and all articles). An **Author** writes and manages their own articles. A **User** reads articles and participates by commenting.

### Basic Workflow

```
User Registration
       ↓
     Login
       ↓
 JWT Authentication
       ↓
   Role Check (user / author / admin)
       ↓
  Browse Articles (Public)
       ↓
 Author/Admin → Create Article
       ↓
 Admin → Manage Categories
       ↓
 User → Add Comment
       ↓
 Track Views & Engagement
```

---

# Main Modules

The system consists of three major modules:

1. **User Management Module**
2. **Content Management Module (Articles & Categories)**
3. **Interaction Module (Comments)**

---

# Module 1 — User Management

The User Management module handles user registration, authentication, authorization, and role-based access.

## Registration

Users can register by providing:

- Name
- Email
- Password
- Role (optional — defaults to `user`)

### Available Roles

| Role | Responsibility |
|---|---|
| **User** | Reads articles, adds comments |
| **Author** | Writes, edits and manages their own articles |
| **Admin** | Manages categories, and can moderate/manage all articles and comments |

## Login

Users log in using:

- Email
- Password

### Authentication Flow

```
Email
  +
Password
    ↓
Authentication
    ↓
JWT Token
    ↓
Protected APIs
    ↓
Role-Based Access
```

## Technologies Used

- **JWT (JSON Web Token)** — Authentication
- **bcryptjs** — Password hashing
- **Express Middleware** — Authentication (`protect`) and Authorization (`authorize`)
- **MongoDB** — User data storage

### Security Flow

```
Registration
     ↓
Password
     ↓
bcrypt Hashing
     ↓
Store Hashed Password
     ↓
Login
     ↓
Verify Password
     ↓
Generate JWT
     ↓
Access Protected APIs
```

---

# Module 2 — Content Management (Articles & Categories)

The core module of the platform — this is where news gets created, organized, and published.

## Categories

Categories organize articles into sections such as AI, Mobile, Startups, Cybersecurity, etc. Only **Admins** can create, update, or delete categories.

| Field | Description |
|---|---|
| Name | Display name (e.g. "Artificial Intelligence") |
| Slug | URL-friendly identifier (e.g. "ai") |
| Description | Short description of the category |

## Articles

Authors and Admins can create articles. Each article is tied to an author and an optional category.

### Article Fields

- Title
- Slug (unique, SEO-friendly URL)
- Content
- Summary
- Cover Image
- Category
- Author
- Tags
- Status (`draft` / `published`)
- Views
- Published Date

### Example Article

```
Title:
ChatGPT 5 Launches with Major Upgrades

Slug:
chatgpt-5-launches

Category:
Artificial Intelligence

Author:
Rahil Koshti

Status:
Published

Tags:
AI, OpenAI, ChatGPT
```

## Article Status Workflow

Articles follow a simple two-stage publishing flow:

```
Draft
  ↓
Published
```

## Ownership Rules

An article can only be updated or deleted by:

- The **author** who created it, OR
- An **admin** (who can manage any article)

```
Request to Edit/Delete Article
        ↓
Is user the author of this article?
   ├── Yes → Allowed
   │
   └── No
        ↓
   Is user an admin?
      ├── Yes → Allowed
      └── No  → 403 Forbidden
```

## Search, Filter & Pagination

The article listing API supports:

- Filtering by category
- Filtering by author
- Searching by title/summary
- Pagination (`page`, `limit`)

---

# Module 3 — Interaction Module (Comments)

The Interaction module lets logged-in users engage with articles directly.

## Comments

Any logged-in user (User, Author, or Admin) can comment on an article.

| Field | Description |
|---|---|
| Article | The article being commented on |
| User | The commenter |
| Comment | The comment text |

### Comment Permission Rules

```
Add Comment       → Any logged-in user
View Comments     → Public (no login required)
Update Comment    → Only the comment's own author
Delete Comment    → Comment owner OR Admin
```

### Example

```
Article: chatgpt-5-launches

user1:
Great article! Really excited about ChatGPT 5.

user2:
Does this support multimodal input?
```

---

# MongoDB Database

The system uses **MongoDB** with **Mongoose** as the ODM.

There are four main collections:

```
MongoDB
   │
   ├── Users
   │
   ├── Categories
   │
   ├── Articles
   │
   └── Comments
```

## 1. Users Collection

```json
{
  "name": "Rahil Koshti",
  "email": "rahil@techpravah.com",
  "password": "hashed_password",
  "role": "author"
}
```

## 2. Categories Collection

```json
{
  "name": "Artificial Intelligence",
  "slug": "ai",
  "description": "Latest AI news and updates"
}
```

## 3. Articles Collection

```json
{
  "title": "ChatGPT 5 Launches with Major Upgrades",
  "slug": "chatgpt-5-launches",
  "content": "OpenAI has officially launched ChatGPT 5...",
  "summary": "OpenAI's newest model brings major reasoning upgrades.",
  "coverImage": "https://example.com/chatgpt5.jpg",
  "category": "ObjectId(...)",
  "author": "ObjectId(...)",
  "tags": ["AI", "OpenAI", "ChatGPT"],
  "status": "published",
  "views": 128,
  "publishedAt": "2026-09-10"
}
```

## 4. Comments Collection

```json
{
  "article": "ObjectId(...)",
  "user": "ObjectId(...)",
  "comment": "Great article! Really excited about ChatGPT 5."
}
```

---

# Backend Architecture

The backend follows a modular architecture using **Node.js + Express.js + MongoDB**.

```
                CLIENT
                  │
                  ↓
              REST API
                  │
                  ↓
             Express.js
                  │
      ┌───────────┴───────────┐
      │                       │
      ↓                       ↓
Middleware                 Routes
      │                       │
      │              ┌────────┼────────┐
      │              ↓        ↓        ↓
      │        Controllers  Auth   Role Check
      │              │
      ↓              ↓
   Error         Business Logic
 Middleware            │
                      ↓
                  Mongoose
                      │
                      ↓
                   MongoDB
```

---

# Backend Folder Structure

```
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── articleController.js
│   ├── categoryController.js
│   └── commentController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Article.js
│   ├── Category.js
│   └── Comment.js
│
├── routes/
│   ├── authRoutes.js
│   ├── articleRoutes.js
│   ├── categoryRoutes.js
│   └── commentRoutes.js
│
├── utils/
│   └── generateToken.js
│
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

---

# Middleware

## Authentication Middleware (`authMiddleware.js`)

Responsible for:

- Reading the JWT token from the request header
- Verifying the JWT
- Identifying the current logged-in user
- Protecting private APIs

```
Request
   ↓
JWT Token
   ↓
authMiddleware (protect)
   ↓
Token Valid?
   ├── No → 401 Unauthorized
   │
   └── Yes
        ↓
    req.user
        ↓
    Controller
```

## Role Middleware (`roleMiddleware.js`)

Controls which roles are allowed to perform specific operations, using a reusable `authorize(...roles)` function.

Example role-based permission table:

| Operation | User | Author | Admin |
|---|---|---|---|
| Create Category | ❌ | ❌ | ✅ |
| Create Article | ❌ | ✅ | ✅ |
| Update Own Article | ❌ | ✅ | ✅ |
| Update Any Article | ❌ | ❌ | ✅ |
| Delete Own Article | ❌ | ✅ | ✅ |
| Add Comment | ✅ | ✅ | ✅ |
| Edit Own Comment | ✅ | ✅ | ✅ |
| Delete Any Comment | ❌ | ❌ | ✅ |
| View Articles | ✅ | ✅ | ✅ |

## Error Middleware (`errorMiddleware.js`)

A centralized error handler processes errors from anywhere in the app, instead of repeating error-response logic in every controller.

```
Controller
    ↓
Error Occurs
    ↓
next(error)
    ↓
errorMiddleware
    ↓
Standard JSON Response
```

Example response:

```json
{
  "message": "Article not found",
  "stack": null
}
```

---

# API Endpoints

## Auth

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

## Categories

```
GET    /api/categories
POST   /api/categories          (admin only)
PUT    /api/categories/:id      (admin only)
DELETE /api/categories/:id      (admin only)
```

## Articles

```
GET    /api/articles                  (public, filter + search + pagination)
GET    /api/articles/mine             (author/admin — own articles)
GET    /api/articles/:slug            (public, single article)
POST   /api/articles                  (author/admin)
PUT    /api/articles/:id              (owner author or admin)
DELETE /api/articles/:id              (owner author or admin)
```

## Comments

```
POST   /api/comments                        (any logged-in user)
GET    /api/comments/article/:articleId     (public)
PUT    /api/comments/:id                    (comment owner only)
DELETE /api/comments/:id                    (comment owner or admin)
```

---

# Technology Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Frontend (Planned)

- React.js
- React Router
- Axios
- Context API
- CSS / Tailwind CSS

## Development Tools

- VS Code
- Thunder Client / Postman
- MongoDB Atlas
- Git & GitHub

---

# Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key
```

---

# Local Setup

```bash
# Clone the repository
git clone https://github.com/Rahilkoshti29/techpravah.git
cd techpravah/backend

# Install dependencies
npm install

# Add your .env file (see above)

# Run in development mode
npm run dev
```

Server will start at:
```
http://localhost:5000
```

---

# Key Features

### Authentication
- User registration
- Secure password hashing
- Login
- JWT authentication
- Protected routes
- Role-based authorization

### Content Management
- Create, update, delete articles
- Draft / Published workflow
- Category management
- Tags
- View count tracking
- Search, filter & pagination

### Collaboration
- Add comments
- View comments
- Edit/delete own comments
- Admin moderation of comments

---

# Future Enhancements

- Frontend build using React (public pages + author/admin dashboards)
- Like/bookmark system for articles
- Nested comment replies
- Newsletter subscription
- Trending/featured articles section
- Image upload (Cloudinary/Multer) instead of image URLs
- Editor approval workflow (Author submits → Admin approves → Published)
- Deployment (Render/Railway for backend, Vercel/Netlify for frontend)

---

# Project Objective

The primary objective of **TechPravah** is to provide a centralized platform for publishing and consuming technology news, without relying on external News APIs — giving full control over content creation, moderation, and presentation.

```
Users
   +
Authors
   +
Articles
   +
Categories
   +
Comments
   =
TechPravah — Tech News Platform
```

---

# User Roles Summary

| Role | Main Responsibility |
|---|---|
| **User** | Reads articles, adds comments |
| **Author** | Writes and manages own articles |
| **Admin** | Manages categories, moderates all articles and comments |

---

# Expected Outcome

After completing the project, the application will provide a complete workflow for:

```
User
 ↓
Authentication
 ↓
Role-Based Access
 ↓
Article Creation
 ↓
Publishing
 ↓
Comments
 ↓
Reading & Engagement
```

The final application will function as a **mini tech-news publishing platform**, developed as a MERN-based academic (CE) project.