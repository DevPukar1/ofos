# OFOS(Online Food Ordering System)

This web application allows users to place food orders online. It is developed using Express, React, Node.js and MySQL. The application streamlines order management, enabling the hotels to efficiently receive, prepare, and manage orders for student pickup.

## Features

- **User Interation**: Users can browser the menu, place orders and track their orders
- **Admin Interface**: Canteen staff can manage menu items, view and update orders, track orders delivery.
- **API**: A robust backend API to handle order processing, user management, and data storage

## Installation

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/<yourusername>/<repo>.git
   cd <repo>
   ```

2. **Install Dependencies**

   Navigate to the backend directory and install the dependencies:

   ```bash
   cd backend
   npm install
   ```

   Then navigate to the frontend directory and install the dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

   Then, navigate to the admin directory and install the dependencies:

   ```bash
   cd ../admin
   npm install
   ```

3. **Setup Up MySQL Database**

   Create a new MySQL Database and run the provided SQL script to set up the required tables

4. \*\*Setup Environment Variables

   Copy the sample environment to create a new `.env` file and add your database credentials:

   ```bash
   cd ..
   cp backend/.env.sample backend/.env
   ```

   Edit the ```backend/.env` file to include your database credentials

5. **Run the Application**

   Start the backend server:

   ```bash
   cd backend
   npm start
   ```

   Start the frontend

   ```bash
   cd ../frontend
   npm start
   ```

6. **Access the Application** at

   Open your browser and go to `http://localhost:5173` for user interface
   Open your browser and go to `http://localhost:5174` for admin interface
