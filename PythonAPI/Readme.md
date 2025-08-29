# Lexi Assessment - Full Stack Application

This project consists of a React frontend and a FastAPI backend.

## Backend Setup (Python API)

### 1. Create & activate virtual environment
```bash
cd PythonAPI
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the server
```bash
uvicorn app.main:app --reload
```

- Server URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
- API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 4. Adding new dependencies
If your code imports a package that is missing (e.g. error: `ModuleNotFoundError: No module named 'httpx'`), install it and update `requirements.txt`:

```bash
pip install <package-name>
```

Example `requirements.txt`:
```txt
fastapi
uvicorn
httpx
dotnenv
```

### 5. Deactivate virtual environment
When you are done working:
```bash
deactivate
```

## Frontend Setup (React App)

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

- Frontend URL: [http://localhost:5173](http://localhost:5173) (or the port shown in terminal)

### 4. Available scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Running the Full Application

### Option 1: Run both simultaneously (recommended for development)
1. **Terminal 1** - Start backend:
   ```bash
   cd PythonAPI
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. **Terminal 2** - Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Development Workflow

1. **Backend changes**: The FastAPI server will automatically reload when you make changes to Python files
2. **Frontend changes**: The Vite dev server provides hot module replacement for instant updates
3. **API calls**: Frontend can make requests to `http://127.0.0.1:8000` for backend API endpoints

## Troubleshooting

### Common Issues

**Backend:**
- If you get permission errors, ensure your virtual environment is activated
- If packages are missing, run `pip install -r requirements.txt` again

**Frontend:**
- If `npm install` fails, try clearing npm cache: `npm cache clean --force`
- If the dev server won't start, check if port 5173 is already in use
