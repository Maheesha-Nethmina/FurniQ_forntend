# FurniQ - Full-stack furniture shop web application using Spring Boot, React, and PostgreSQL 🛋️

This is the complete frontend for **FurniQ**, a full-stack e-commerce platform for a modern furniture store. This application is built with React, Vite, and React Router, and it communicates with a separate Spring Boot backend API.



<img width="1891" height="939" alt="FurniQ" src="https://github.com/user-attachments/assets/869e8ae2-3e18-435f-b761-fa99d563ce6f" />


## ✨ Key Features

This application features a complete, secure, and personalized user experience.

### 👤 User & Authentication Features
* **Secure Authentication:** Full user registration and login functionality using JWT (JSON Web Tokens).
* **Role-Based Access:** Distinct privileges for standard `ROLE_USER` and `ROLE_ADMIN`.
* **Personalized Dashboard:** A private, protected route for users to:
    * View their order history.
    * Save and edit shipping/billing addresses.
* **Full E-commerce Flow:**
    * **Product Catalog:** Browse, search, and filter all furniture products.
    * **Shopping Cart:** Add, remove item selections.
    * **Checkout Process:** A complete checkout flow.

### 🔒 Admin Functionality
* **Full Admin Dashboard:** A protected, role-based area for store management.
* **Product Management (CRUD):** Admins can Add, View, Edit, and Delete furniture items in the catalog.
* **User Management:** Admins can view and manage all registered user accounts.
* **Order Management:** Admins can view all customer orders and update their statuses (e.g., "Pending," "Shipped," "Delivered").

---

## 🎨 Design & Project Links

* **Figma Design:** [**View the complete UI/UX design on Figma**](https://www.figma.com/proto/NoQpT0VO8o6Nlepjo9N6j4/FurniQ?node-id=0-1&t=FWEZ14CNglEUvEYH-1)
* **Backend Repository:** [**Find the Spring Boot API (Backend) on GitHub**](https://github.com/Maheesha-Nethmina/FurniQ_backend)

---

## 🛠️ Tech Stack

This project is built with a modern, full-stack architecture.

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, React Router, Axios |
| **Backend** | Java, Spring Boot, Spring Security (JWT), Spring Data JPA |
| **Database** | PostgreSQL |
| **Authentication** | JSON Web Tokens (JWT) |

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps. You will need to run **both** the backend API and this frontend application.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or newer)
* [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) (or newer)
* [Maven](https://maven.apache.org/)
* [PostgreSQL](https://www.postgresql.org/download/)

### 1. Backend Setup (Spring Boot API)

First, get the backend server running.

1.  Clone the backend repository:
    ```sh
    git clone https://github.com/Maheesha-Nethmina/FurniQ_backend
    cd FurniQ_backend
    ```
2.  Configure your PostgreSQL database:
    * Create a new database (e.g., `furniq_db`).
    * Open `src/main/resources/application.properties`.
    * Update `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` with your local Postgres credentials.
    * Set your `jwt.secret` key.
3.  Run the backend server:
    ```sh
    mvn spring-boot:run
    ```
    The API will be running on `http://localhost:8080`.

### 2. Frontend Setup (React App - This Repo)

Now, get this frontend application running.

1.  Clone this repository (or if you already have it, navigate into the directory):
    ```sh
    git clone https://github.com/Maheesha-Nethmina/FurniQ_forntend
    cd FurniQ_forntend
    ```
2.  Install all required NPM packages:
    ```sh
    npm install
    ```
3.  Run the React development server:
    ```sh
    npm run dev
    ```
    The application will open and run on `http://localhost:5173` (or the next available port).
