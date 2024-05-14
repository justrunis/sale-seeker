# About Sale Seeker

This repository contains the source code for Sale Seeker, a platform that allows users to buy items online. Users can create an account, purchase items from the store, and rate them using a star system. Administrators can manage users, items, and orders.

## Key Functionalities

### For Users:

- Create an account to access personalized features
- Browse a wide range of items available for purchase
- Rate items using a star rating system
- Manage user profiles and preferences
- Add items to a shopping cart for easy checkout
- View order history and track shipping status
- Contact customer support for assistance

### For Sellers

- Add, edit, and delete items in the store
- Set prices and update inventory levels
- View and respond to customer reviews

### For Administrators:

- Manage user accounts and permissions
- Add, edit, and delete items in the store
- View and process orders from customers

## Used Technologies

Sale Seeker is built using the following technologies:

- **React**: A JavaScript library for building user interfaces.
- **ExpressJs**: A backend framework for Node.js.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Framer Motion**: An open-source and production-ready motion library.
- **Redux**: A powerful state container for JavaScript apps.
- **TanStack Query**: A data-fetching library for React that helps you fetch, cache, and update data in your React applications.
- **React Toastify**: A React library that helps you add notifications to your app.
- **React Icons**: A library that provides popular icons for your React projects.
- **React Credit Cards**: A library that provides credit card components for your React projects.
- **Tailwind and daisyUI**: A utility-first CSS framework for rapidly building custom designs.

## Setup

## Prerequisites

- Clone the repository

```sh
git clone https://github.com/justrunis/sale-seeker.git
```

- Have node installed
- Have PgAdmin for database
- Have cloudinary account
- Enviromental variables are explained in additional README.md files inside backend and frontend folders

### For database

- Install PgAdmin on your system
- Inside backend folder copy all queries from `queries.sql` file to create tables and populate with starting data
- Inside backend folder add enviromental values: `DB_USER` `DB_HOST` `DB_DB` `DB_PASSWORD` `DB_PORT`
- Also add `JWT_SECRET` for token generation and `EMAIL` `EMAIL_PASSWORD` for email to send refresh token

### For cloudinary

- Create a cloudinary account
- In `Media Explorer` tab create a folder `sale-seeker`
- Add the following enviromental values: `CLOUDINARY_CLOUD_NAME` `CLOUDINARY_API_KEY` `CLOUDINARY_API_SECRET`

### For back-end

- Navigate to backend folder:

```sh
cd ./backend
```

- Install all dependencies

```sh
npm install
```

- Run the server

```sh
node start
```

### For front-end

- Add enviromental variables: `VITE_API_URL` `VITE_SITE_KEY` `VITE_SITE_SECRET`
- Navigate to frontend folder

```sh
cd frontend/sale-seeker
```

- Install all dependencies

```sh
npm install
```

- Run the server

```sh
npm run dev
```

## Contact

Thank you for your interest in Sale Seeker! If you have any questions, feedback, or inquiries, please don't hesitate to reach out:

- Send me a message on [GitHub](https://github.com/justrunis)
- Connect with me on [Discord](https://discord.com/users/264059136378011649)
- Write me an email at [justrunis@gmail.com](mailto:justrunis@gmail.com)

I'm looking forward to hearing from you and will do my best to respond promptly.
