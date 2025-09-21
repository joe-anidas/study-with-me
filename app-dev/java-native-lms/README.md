

---

# 📚 Library Management System - Android (Java)

This is a simple **Library Management System** Android application built using **Java** in **Android Studio**. The app allows users to **add**, **view**, **update**, **delete**, **borrow**, and **return** books. SQLite is used for local data storage.

---

## ✅ Features

- 📖 Add new books with name and author  
- 🔍 View book details by name  
- ✏️ Update book's author by name  
- ❌ Delete a book by name  
- 📥 Borrow a book (updates issued & available count)  
- 📤 Return a book (updates issued & available count)  
- 📦 SQLite local database for CRUD operations

---

## 🛠 Tech Stack

- Android Studio (Java)
- SQLite (via `SQLiteOpenHelper`)
- XML for UI Layout

---

## 🧪 How to Run

1. **Clone or Download** this project.
2. Open it in **Android Studio**.
3. Build the project and run it on an emulator or Android device.
4. Use the UI to perform library operations.

---

## 📁 Project Structure

```
LibraryMgmtSystem/
│
├── app/src/main/
│   ├── java/com/example/librarymgmtsystem/
│   │   ├── MainActivity.java         # Main logic & UI control
│   │   └── DB.java                   # SQLite DB helper class
│   ├── res/layout/activity_main.xml # Layout XML
│   └── AndroidManifest.xml          # App permissions and activity declaration
```

---

## 🧑‍💻 MainActivity.java

Handles user inputs, button actions and uses `DB.java` for DB operations. Maintains counters for issued and available books.

---

## 🗃️ DB.java

A SQLiteOpenHelper class that implements:
- `save()` → insert book
- `retrieve()` → get author by book name
- `update()` → update author
- `delete()` → remove book by name

---

## 📱 UI Overview (activity_main.xml)

- EditTexts for book name and author input  
- Buttons for SAVE, VIEW, UPDATE, DELETE, BORROW, RETURN  
- TextView for displaying author info or borrow/return status

---

## 🔚 Output

- Toast messages for successful actions  
- TextView update for book details  
- Updated counters shown on BORROW/RETURN

---

## ✅ Result

A fully functional **Java-based native Android app** for managing library books, using **SQLite** and **standard UI elements**.

---
