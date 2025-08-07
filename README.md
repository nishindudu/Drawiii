<div align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./screenshots/drawiii-dark.png">
        <source media="(prefers-color-scheme: light)" srcset="./screenshots/drawiii-light.png">
        <img src="./screenshots/drawiii-dark.png" alt="Drawiii Logo" width="200">
    </picture>
</div>

<div align="center">

<h1>🎨 Drawiii</h1>

**A collaborative drawing canvas for you and your friends** ✨

</div>

## 💖 Features
- **Real Time Collaboration**: Draw together with anyone in real-time.
- **No Sign-Up Required**: Starting a drawing session only requires choosing a room name.
- **Shareable Links**: Invite anyone to your drawing session with a simple link.

## 🎯 Usage
1. **Clone the repo**: 
   ```bash
   git clone https://github.com/nishindudu/Drawiii.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd Drawiii
   ```

3. **Navigate to Frontend Code and Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run ``build`` command from the frontend directory**:
   ```bash
   npm run build
   ```

5. **Navigate to Backend Code and Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

6. **Run the Backend Server**:
   ```bash
   gunicorn -k eventlet -w 1 app:app
   ```
   or if you prefer Flask's built-in server for development:
   ```bash
   python app.py
   ```

7. **Open the Frontend**:
   Open your browser and go to `http://localhost:<port>` (port will be shown in the terminal) to start drawing!

For a live demo, visit [Drawiii Demo](https://drawiii.onrender.com/).

## 📸 Screenshots

Room Creation Page:
![Room Creation Page](<screenshots/room-selection.png>)

Drawing Canvas:
![Drawing Canvas](<screenshots/canvas.png>)

## 📁 Project Structure

```
Drawiii/
├── backend/
│   ├── app.py
│   ├── requirements.txt
├── frontend/
│   ├── drawiii/            # Main frontend directory
│   │   ├── src/app         # Main frontend code
├── screenshots             # Contains screenshots for documentation
```

## ⚙️ Technologies Used
- **Frontend**: React, Next.js, socket.io
- **Backend**: Flask, socket.io

## 🤝 Contributing

Contributions are welcome to Drawiii! If you'd like to help out, please follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of this page.
2. **Clone your fork**: 
   ```bash
   git clone https://github.com/<your-username>/Drawiii.git
   ```
3. **Create a new branch**: 
   ```bash
   git checkout -b my-feature-branch
   ```
4. **Make your changes**: Edit the code as you see fit.
5. **Commit your changes**: 
   ```bash
   git commit -m "Add my feature"
   ```
6. **Push to your fork**: 
   ```bash
   git push origin my-feature-branch
   ```
7. **Create a pull request**: Go to the original repository and click "New Pull Request".

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


Thank you for your contributions! ✨