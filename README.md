# 💬 Real-Time Chat Application

## 🚀 Overview

A scalable real-time chat backend system built to support **instant messaging, user presence tracking, and efficient communication** using WebSockets.

This project demonstrates how to design and implement **event-driven, real-time systems** with secure authentication and modular architecture.



## 🎯 Problem Statement

Traditional HTTP-based systems are not suitable for real-time communication due to:

* ⏳ Latency in message delivery
* 🔄 Inefficient polling mechanisms
* ❌ Lack of real-time user presence

This system leverages WebSockets to enable **low-latency, bidirectional communication**.


## 🧱 Tech Stack

**Backend:** Node.js, Express.js
**Real-Time Engine:** Socket.IO
**Database:** PostgreSQL
**ORM:** Prisma
**Authentication:** JWT (for both REST & WebSocket)



## ⚙️ Features

* 💬 Real-time messaging using Socket.IO
* 🔐 JWT-based authentication for WebSocket connections
* 👥 Conversation-based chat system (1-1 / group ready)
* 🟢 User presence tracking (online/offline status)
* 📡 Event-driven architecture
* 🧾 Message persistence in database
* 🔔 Notification system (basic structure)
* 📎 Support for message types (text, attachments - extensible)


## 🏗️ Architecture

```bash id="archx1"
Client (Web / App)
        ↓
HTTP API (Express)
        ↓
Authentication (JWT)
        ↓
Socket.IO Server
        ↓
Event Handlers (send_message, join_conversation, etc.)
        ↓
Service Layer (Business Logic)
        ↓
Prisma ORM
        ↓
PostgreSQL Database
```



## 🔐 Authentication Flow

1. User logs in via REST API
2. Receives JWT token
3. Token is passed in Socket.IO handshake
4. Server verifies token before establishing connection
5. User is marked as **online**



## ⚙️ Core Functionalities

### 📨 Send Message

* Client emits `send_message` event
* Server validates & stores message
* Broadcasts message to conversation participants



### 👥 Conversations

* Supports multiple participants
* Uses a **Conversation + Participant model**
* Scalable for group chat



### 🟢 Presence System

* Tracks user online/offline status
* Broadcasts `presence_update` events
* Updates `lastSeen` on disconnect



## 📦 Installation & Setup

```bash id="setupc1"
# Clone repository
git clone <your-repo-url>

# Navigate into project
cd chat-application

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```



## 🧪 Example Flow

1. User logs in and gets JWT
2. Connects to Socket.IO with token
3. Joins a conversation
4. Sends a message
5. Server stores and broadcasts message
6. Other users receive message instantly

---

## 📊 Production Considerations

* ⚡ Event-driven architecture for real-time performance
* 🔐 Secure socket authentication using JWT
* 🧠 Scalable conversation model
* 🟢 Efficient presence tracking system
* 📦 Message persistence for reliability
* 🔄 Ready for horizontal scaling with Redis adapter (future)



## 🔮 Future Improvements

* 📎 File & media attachments (S3 / Cloud storage)
* 🔔 Advanced notification system
* 📡 Typing indicators
* 📍 Message read receipts
* 🌐 Horizontal scaling using Redis adapter
* 🧠 End-to-end encryption (E2EE)


## 🧠 Key Learnings

* Building real-time systems using WebSockets
* Handling authentication in socket connections
* Designing scalable chat architecture
* Managing concurrency & event-driven flows
* Implementing presence tracking systems

