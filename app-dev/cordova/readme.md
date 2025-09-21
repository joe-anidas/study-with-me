
---

## 📘 Cordova Android App – Login & Location

This is an Apache Cordova project with two key screens:  
✅ Login Screen with form, validation, and reset  
✅ Location App using Geolocation API  

---

## 🚀 Setup Environment

### 1. Install Cordova CLI globally  
```bash
npm install -g cordova
```

### 2. Create a Cordova Project  
```bash
cordova create myApp
cd myApp
```

### 3. Add Android Platform  
```bash
cordova platform add android
cordova platform add browser
```

### 4. Add Geolocation Plugin  
```bash
cordova plugin add cordova-plugin-geolocation
```

### 5. Project Structure  
```
myApp/
├── www/
│   ├── index.html         # Home page
│   ├── login.html         # Login screen
│   ├── location.html      # Location screen
│   ├── css/
│   │   ├── styles.css     # Shared styles
│   │   ├── login.css
│   │   └── location.css
│   ├── js/
│   │   ├── login.js
│   │   └── location.js
│   └── img/
│       └── img.png        # Header image for login
```

---

## ✅ Run the App

```bash
cordova build android
cordova run android
```

Use an emulator or connected device.

---
