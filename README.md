# 🛠️ Service Platform Web Application

A modern **role-based service management platform** built using **React.js** and **Asgardeo** for secure authentication and identity management. This platform allows users to register and log in as **Customers**, **Service Providers**, or **Admins**. Each role gets access to different parts of the application based on their permissions.

---

## 🚀 Features

### 🔐 Secure Authentication
- Integrated with [Asgardeo](https://wso2.com/asgardeo/) using OpenID Connect.
- Login and logout flows handled via `@asgardeo/auth-react`.

### 👥 Role-Based Access
- **Customers** can:
  - View a list of services.
- **Service Providers** can:
  - View and manage their own services (add, edit).
- **Admins** can:
  - View all users and all services.

### 👤 Profile Management
- Users can view their name, email, and assigned roles.
- Future updates can allow editing profile info.

### 📋 Service Management
- Service Providers can:
  - Add and edit services they created.
- Admins can:
  - View all services in the system.

### 🧭 Navigation
- Collapsible sidebar navigation with dynamic links.
- Responsive design with Tailwind CSS.

---
## ⚙️ Technologies Used

- **React.js** (frontend framework)
- **Tailwind CSS** (styling)
- **React Router** (routing)
- **Asgardeo Auth SDK** (`@asgardeo/auth-react`)
- **Role-based logic** (custom roles parsed from JWT `groups` claim)

