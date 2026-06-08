# Expense Tracker Mobile Application

A cross-platform mobile application built using React Native, TypeScript, and Expo to help users manage daily expenses, monitor budgets, and analyze spending patterns through an intuitive and responsive interface.

---

## Features

### Expense Management

* Add expenses with amount, title, category, date, and payment method.
* View all expenses in a structured list.
* Delete expense records.
* Search expenses by title, category, or payment method.

### Budget Monitoring

* Set a custom budget limit.
* Track total expenses in real time.
* Visual indicators for:

  * Safe spending zone
  * Near-budget warning
  * Budget exceeded alert

### Analytics Dashboard

* Category-wise expense analysis.
* Payment method distribution (UPI, Cash, Card).
* Monthly and historical expense filtering.
* Percentage-based spending insights.
* Dynamic progress indicators.

### Data Persistence

* Local storage using Async Storage.
* Automatic saving and retrieval of expense records.
* Data remains available across app sessions.

### User Interface

* Responsive mobile design.
* Smooth navigation using Expo Router.
* Modern and lightweight UI.
* Icon support using Ionicons.

---

## Technology Stack

### Frontend

* React Native
* TypeScript
* Expo

### Navigation

* Expo Router
* React Navigation

### State Management

* React Context API
* React Hooks (useState, useContext)

### Storage

* Async Storage

### UI Components

* React Native Components
* Ionicons

### Development Tools

* ESLint
* EAS Build

---

## Project Structure

```text
expense-tracker/
│
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── add.tsx
│   │   ├── index.tsx
│   │   └── stats.tsx
│   │
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   └── modal.tsx
│
├── assets/
│   └── images/
│
├── components/
├── constants/
├── context/
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── app.json
├── eas.json
├── eslint.config.js
├── package.json
└── tsconfig.json
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/bathulashireesha310/expense-tracker.git 
```

### Navigate to the Project Folder

```bash
cd expense-tracker
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npx expo start
```

### Run on Android

```bash
npx expo start --android
```

### Run on Web

```bash
npx expo start --web
```

---

## Core Functionalities

* Expense CRUD Operations
* Search and Filtering
* Budget Monitoring
* Category-Based Analytics
* Payment Method Analysis
* Local Data Persistence
* Context API State Management
* Dynamic UI Rendering

---

## Future Enhancements

* User Authentication
* Cloud Database Integration
* Expense Export to PDF/Excel
* Dark Mode Support
* Backup and Restore Functionality
* Interactive Charts and Graphs
* Monthly Financial Reports

---

## Screenshots

### 📱 Application Screenshots

<table align="center">
  <tr>
    <td align="center">
      <img src="assets/screenshots/Log%20Outflow2.jpeg" width="250" alt="Add Expense Screen"><br>
      <b>Add Expense Screen</b>
    </td>
    <td align="center">
      <img src="assets/screenshots/Log%20Outflow1.jpeg" width="250" alt="Budget Configuration"><br>
      <b>Budget Configuration</b>
    </td>
    <td align="center">
      <img src="assets/screenshots/Dashboard1.jpeg" width="250" alt="Budget Warning State"><br>
      <b>Budget Warning State</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshots/Dashboard2.jpeg" width="250" alt="Limit Breach Alert"><br>
      <b>Limit Breach Alert</b>
    </td>
    <td align="center">
      <img src="assets/screenshots/Analytics%20Tab.jpeg" width="250" alt="Analytics Dashboard"><br>
      <b>Analytics Dashboard</b>
    </td>
    <td></td>
  </tr>
</table>


## Learning Outcomes

This project helped me gain hands-on experience in:

* React Native Mobile Development
* TypeScript Development
* Expo Ecosystem
* Context API State Management
* Async Storage Integration
* Mobile UI/UX Design
* Navigation and Routing
* Component-Based Architecture

---

## Author

**Shireesha Bathula**

Aspiring Software Developer passionate about Mobile Application Development, React Native, TypeScript, and Full-Stack Development.

