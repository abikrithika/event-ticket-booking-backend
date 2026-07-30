# Project Notes

## 1. Project Overview

This project is a Backend REST API for an Event Ticket Booking System. The application allows users to browse events, register an account, purchase event tickets, and manage their orders. The backend is responsible for handling authentication, business logic, database operations, and providing RESTful APIs for the frontend application.

### Users can:

- Browse available events
- Search and view event details
- Register and log in
- Add tickets to a shopping cart
- Update or remove tickets from the cart
- Checkout and place an order
- View previous orders and purchased tickets

---

## 2. User Flow

The application follows the following business flow:

Visitor

↓

Browse Events

↓

(Optional) Search Events

↓

Register

↓

Login

↓

Add Tickets to Cart

↓

View / Update Cart

↓

Checkout

↓

Order Created

↓

View Order History

↓

View Order Details

---

## 3. Core Entities

### App User

Stores information about registered users who can log in and purchase event tickets.

### Event

Stores all available events, including their title, venue, date, time, description, and ticket price.

### Cart

Represents the user's active shopping cart. A cart can belong to either an authenticated user or an anonymous visitor.

### Cart Item

Represents an individual event ticket added to a shopping cart, including the selected quantity.

### Customer Order

Represents a completed purchase after checkout.

### Order Item

Represents each event ticket purchased within an order. It stores the event, quantity, and ticket price at the time of purchase.

---

## 4. Entity Relationships

- One app user can have many customer orders.
- One app user can have one active cart.
- One cart can contain many cart items.
- Each cart item belongs to one event.
- One customer order can contain many order items.
- Each order item belongs to one event.

---

## 5. Business Rules

- Users can browse events without logging in.
- Authentication is required before checkout.
- Each authenticated user can have only one active shopping cart.
- Anonymous users can also have a shopping cart.
- Ticket inventory is considered unlimited for this project.
- During checkout, the active cart is converted into a customer order.
- After checkout, an order cannot be modified.
- Order items store the ticket price at the time of purchase so that future price changes do not affect previous orders.

---

## 6. Future Improvements

Possible future enhancements include:

- Online payment gateway integration
- Email confirmation after registration
- Email confirmation after successful checkout
- Event categories and filtering
- Seat selection
- QR code tickets
- Ticket cancellation and refund
- Admin dashboard
- Sales and revenue reports
- Event management for administrators
