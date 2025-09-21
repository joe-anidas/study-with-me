
---

## 📘 React Native App (Expo + Navigation)

This is a React Native Expo project with **4 navigable screens**:  
✅ BMI Calculator  
✅ Expense Manager  
✅ Metric Converter  
✅ To-do List  

---

## 🧾 Project Structure

```
yourproject/
├── App.js
├── index.tsx
├── screens/
│   ├── Home.js
│   ├── BMI.js
│   ├── Expense.js
│   ├── Metric.js
│   └── Todo.js
```

---

## 🚀 Installation & Setup

### 1. Setup Environment
To ensure a proper setup, run the following commands:

```bash
npm install create-expo-app
npm install expo-cli
npm install react-dom@18.3.1
npm install react-native-web@~0.19.13
```

### 2. Create Expo Project
```bash
npx create-expo-app yourproject
cd yourproject
```

### 3. Install Navigation Dependencies
```bash
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler
npm install react-native-reanimated
```

---

## 📂 Files Overview

### `index.tsx`
```ts
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

---

## ✅ Run the App

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your phone.

---
