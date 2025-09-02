# Lexi Assessment - Full Stack Application

A comprehensive full-stack application built with React frontend and FastAPI backend for case management and search functionality.

## 🚀 Project Overview

This project consists of:
- **Frontend**: React application built with Vite for fast development and building
- **Backend**: FastAPI Python API providing case search and management endpoints


## 🛠️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.9+
- npm or yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd lexi-assessment
```

### 2. Backend Setup
```bash
cd PythonAPI
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Backend will be available at:**
- API: http://127.0.0.1:8000
- Documentation: http://127.0.0.1:8000/docs

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

**Frontend will be available at:** http://localhost:5173

## 🔧 Development

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd PythonAPI
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `uvicorn app.main:app --reload` - Start development server with auto-reload

## 🧪 Testing

### Frontend Testing
Use the following parameters for testing the case search functionality:

- **State**: KARNATAKA
- **Commission**: Bangalore 1st & Rural Additional
- **From Date**: 01/01/2025
- **To Date**: 29/08/2025
- **Search By**: complainant
- **Case Number**: Reddy

## 📚 API Documentation

Once the backend is running, visit http://127.0.0.1:8000/docs for interactive API documentation powered by Swagger UI.

## 🏗️ Architecture

- **Frontend**: React with Vite for fast development and optimized builds
- **Backend**: FastAPI with automatic API documentation and validation
- **Communication**: RESTful API between frontend and backend
- **Development**: Hot module replacement (frontend) and auto-reload (backend)

## 🔍 Key Features

- Case search and management
- Real-time search functionality
- Responsive web interface
- RESTful API endpoints
- Automatic API documentation
- Development-friendly setup with hot reloading

## 📖 Detailed Documentation

- **Backend Setup**: See [PythonAPI/Readme.md](PythonAPI/Readme.md) for detailed backend configuration
- **Frontend Setup**: See [frontend/README.md](frontend/README.md) for frontend-specific details

## 🚨 Troubleshooting

### Common Issues

**Backend:**
- Ensure virtual environment is activated
- Check if port 8000 is available
- Verify all dependencies are installed

**Frontend:**
- Check if port 5173 is available
- Clear npm cache if installation fails: `npm cache clean --force`
- Ensure Node.js version is compatible

**Port Conflicts:**
- Backend: 8000 (configurable in uvicorn command)
- Frontend: 5173 (configurable in vite.config.js)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

