## 1. Create & activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

## 2. Install dependencies
```bash
pip install -r requirements.txt
```

## 3. Run the server
```bash
uvicorn app.main:app --reload
```

- Server URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
- API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 4. Adding new dependencies
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

## 5. Deactivate virtual environment
When you are done working:
```bash
deactivate
```