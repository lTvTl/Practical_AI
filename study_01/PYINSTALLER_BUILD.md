# PyInstaller Build Instructions

This document provides comprehensive instructions for packaging the Handwritten Digit Recognizer GUI application as a standalone Windows executable (.exe) using PyInstaller.

## Prerequisites

Before building the executable, ensure you have the following:

- **Python 3.8 or higher** installed and available in your system PATH
- **All project dependencies** installed from `requirements.txt`
- **Project root directory** with all source files present:
  - `main.py` (entry point)
  - `gui.py` (GUI implementation)
  - `digit_recognition.py` (model and recognition logic)
  - `requirements.txt` (dependencies list)

## Installation Steps

### 1. Install Dependencies

First, install all required Python packages including PyInstaller:

```bash
pip install -r requirements.txt
```

This command installs:
- **numpy** - Numerical computing library
- **scikit-learn** - Machine learning framework for the digit recognition model
- **Pillow** - Image processing library
- **pyinstaller** - Tool for packaging Python applications as standalone executables

**Why this matters:** PyInstaller needs all dependencies available in your Python environment to bundle them into the executable. Missing dependencies will cause the .exe to fail at runtime.

### 2. Build the Executable

From the project root directory, run the following PyInstaller command:

```bash
pyinstaller --onefile --windowed --name DigitRecognizer main.py
```

**Explanation of flags:**

- `--onefile`: Creates a single executable file instead of a directory with multiple files. The Python runtime and all dependencies are bundled into one .exe file.
- `--windowed`: Removes the console window when running the GUI application. Without this flag, a black console window would appear in the background.
- `--name DigitRecognizer`: Names the output executable `DigitRecognizer.exe` instead of using the script name. This creates a more user-friendly application name.
- `main.py`: Specifies the entry point script that PyInstaller should use to start the application.

**Expected output:**
You should see output similar to:

```
94 INFO: PyInstaller hooks found in C:\...\site-packages\pyinstaller_hooks_contrib
...
[various build messages]
...
11950 INFO: Building EXE from EXE-00.toc completed successfully.
```

**Build time:** The build typically takes 30-60 seconds depending on your system performance.

### 3. Locate the Executable

After a successful build, the executable can be found at:

```
dist/DigitRecognizer.exe
```

**File size:** Approximately 100-120 MB

This large file size is normal because it contains:
- The entire Python runtime (required to run Python code)
- All installed dependencies (numpy, scikit-learn, Pillow)
- Your application code
- Supporting libraries and resources

### 4. Test the Executable

Before distributing, verify the executable runs correctly:

```bash
.\dist\DigitRecognizer.exe
```

Or from the project root:

```bash
dist\DigitRecognizer.exe
```

**Expected behavior:**
1. Application starts (this may take 5-10 seconds on first launch)
2. Console output shows: `Initializing application...`
3. The digit recognizer GUI window opens
4. Model training/loading begins automatically (takes 10-15 seconds)
5. Once complete, the drawing canvas is ready to use

### 5. Test from Windows Explorer

For a final user-experience test:

1. Open File Explorer
2. Navigate to the `dist` folder
3. Double-click `DigitRecognizer.exe`
4. Confirm the application launches and the GUI appears

This simulates how end users will run your application.

## Distribution

### How to Share the Application

1. **Locate the executable:** `dist/DigitRecognizer.exe`
2. **Copy to other machines:** Transfer the `.exe` file to any Windows machine (USB drive, email, cloud storage, etc.)
3. **No installation required:** Users can run the .exe directly without installing Python

### User Experience

Users who download `DigitRecognizer.exe` will:

1. **First launch (10-15 seconds):** The model trains automatically on startup
   - This is a one-time process
   - Console output shows progress
   - Training takes 10-15 seconds depending on system performance

2. **Subsequent launches:** Much faster (~2-3 seconds) because the model is cached

3. **Normal operation:**
   - Draw a handwritten digit on the canvas using the mouse
   - Click the "Predict" button to recognize the digit
   - Click the "Clear" button to start over
   - Repeat for multiple predictions

### System Requirements for Users

- Windows 7 or later
- At least 4 GB of RAM recommended
- 150 MB of available disk space

**Important:** Users do NOT need Python installed on their machines. The .exe is completely standalone.

## Troubleshooting

### Issue: "PyInstaller not found" Error

**Error message:**
```
'pyinstaller' is not recognized as an internal or external command
```

**Solution:**
Install PyInstaller using pip:
```bash
pip install pyinstaller
```

Then verify installation:
```bash
pyinstaller --version
```

---

### Issue: "Module not found" Error During Build

**Error message:**
```
ImportError: No module named 'sklearn'
(or similar for numpy, Pillow, etc.)
```

**Solution:**
1. Ensure you are in the project root directory containing `requirements.txt`
2. Verify all dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```
3. Check that all required source files exist:
   - `main.py`
   - `gui.py`
   - `digit_recognition.py`
4. Verify by importing in Python directly:
   ```bash
   python -c "from gui import DigitRecognizerApp; print('OK')"
   ```

---

### Issue: Executable is Very Large (100+ MB)

**Observed behavior:** The `.exe` file is 100+ MB, which seems large

**This is normal and expected.** The file size includes:
- Python runtime (~40 MB)
- scikit-learn (~50 MB)
- numpy, Pillow, and other dependencies (~20 MB)
- Your application code (~1 MB)

**If disk space is critical:** See the "Advanced: Reducing File Size" section below for compression options.

---

### Issue: Model Loading Fails at Runtime

**Error message:**
```
Error loading model
(or)
FileNotFoundError: Model file not found
```

**Solution:**
1. Verify the model training works in development:
   ```bash
   python digit_recognition.py
   ```
2. Check that `digit_recognition.py` is in the project root
3. Ensure the model file location is correct in `digit_recognition.py`
4. Try rebuilding the .exe with a clean Python environment:
   ```bash
   pip install --upgrade scikit-learn numpy
   pyinstaller --onefile --windowed --name DigitRecognizer main.py
   ```

---

### Issue: Drawing is Slow or Laggy

**Observed behavior:** Drawing on the canvas feels unresponsive or slow

**Solution:**
1. Close unnecessary applications to free system memory
2. Verify system meets minimum requirements:
   - At least 4 GB of RAM available
   - Reasonably modern CPU (Intel i5/Ryzen 5 or better)
3. Model training on first launch takes 10-15 seconds and may cause temporary slowness
4. Wait for model initialization to complete before drawing
5. Check system resource usage:
   - Open Task Manager (Ctrl+Shift+Esc)
   - Check if CPU or RAM usage is abnormally high
   - If Memory is >90% used, close other applications

---

## Build Tips

### Creating a Release Build

For production/distribution builds, optimize the executable:

```bash
pyinstaller --onefile --windowed --optimize=2 --name DigitRecognizer main.py
```

**The `--optimize=2` flag:**
- Removes `assert` statements from Python code
- Removes docstrings
- Optimizes bytecode compilation
- Reduces file size slightly and improves startup time by ~10%

**When to use:**
- Before final distribution to users
- When file size is critical

---

### Creating a Debug Build

For troubleshooting, build with console output visible:

```bash
pyinstaller --onefile --name DigitRecognizer main.py
```

**Remove `--windowed` flag to:**
- Show console window behind the GUI
- Display all print statements and error messages
- Useful for diagnosing problems

**When to use:**
- When debugging issues with the .exe
- When you need to see error messages or logs
- For development/testing only (not for user distribution)

---

## Verification Steps

After building, thoroughly test the executable:

### Quick Test (2-3 minutes)

1. Navigate to the `dist` folder:
   ```bash
   cd dist
   ```

2. Run the executable:
   ```bash
   .\DigitRecognizer.exe
   ```

3. Wait for model initialization (10-15 seconds)

4. Verify the GUI window appears and is responsive

5. Close the application

### Comprehensive Test (5-10 minutes)

1. **Navigate to `dist/` folder in Windows Explorer**

2. **Double-click `DigitRecognizer.exe`** (simulating user experience)

3. **Wait for application startup:**
   - Watch for console output: "Initializing application..."
   - Model training should begin automatically
   - Wait for GUI window to fully load (10-15 seconds total)

4. **Test drawing functionality:**
   - Use mouse to draw a digit (0-9) on the canvas
   - Draw naturally, like you would on paper
   - The canvas should be responsive

5. **Test prediction:**
   - Click the "Predict" button
   - Verify a prediction result appears
   - Check if the prediction is reasonable

6. **Test clearing:**
   - Click the "Clear" button
   - Verify the canvas is cleared completely
   - Cursor should still work for drawing

7. **Test multiple predictions:**
   - Draw another digit
   - Click "Predict"
   - Draw multiple different digits
   - Verify predictions remain responsive

8. **Test error handling:**
   - Click "Predict" with an empty canvas
   - Verify appropriate error message or behavior
   - Application should remain stable

9. **Graceful shutdown:**
   - Close the window (X button)
   - Verify application exits cleanly
   - No error messages should appear

---

## Advanced: Reducing File Size

The default 100+ MB executable is suitable for most users. However, if file size is critical, consider these options:

### Option 1: UPX Compression (Recommended)

UPX (Ultimate Packer for eXecutables) can reduce file size to 30-40 MB:

**Installation:**
1. Download UPX from https://upx.github.io/
2. Extract and add to your PATH or use full path

**Building with UPX:**
```bash
pyinstaller --onefile --windowed --upx-dir="C:\path\to\upx" --name DigitRecognizer main.py
```

**Advantages:**
- Reduces file size dramatically (60-70% compression)
- .exe still runs standalone
- No impact on execution speed

**Disadvantages:**
- First startup extraction adds 2-3 seconds to launch time
- Some antivirus software may flag compressed executables
- UPX may have compatibility issues with newer Windows versions

---

### Option 2: Exclude Unnecessary Modules (Advanced)

For advanced users, exclude unused dependencies to reduce size:

```bash
pyinstaller --onefile --windowed --hidden-import=PIL --hidden-import=sklearn --name DigitRecognizer --collect-all=sklearn main.py
```

**Explanation:**
- `--hidden-import`: Explicitly includes modules that PyInstaller might miss
- `--collect-all`: Includes all files for a specific package

**Challenges:**
- Requires deep knowledge of dependencies
- Easy to accidentally break the application
- Limited size savings compared to UPX

**Recommendation:** Use UPX compression instead, unless you have specific optimization needs.

---

## Summary

| Task | Command |
|------|---------|
| Install dependencies | `pip install -r requirements.txt` |
| Build executable | `pyinstaller --onefile --windowed --name DigitRecognizer main.py` |
| Optimized build | `pyinstaller --onefile --windowed --optimize=2 --name DigitRecognizer main.py` |
| Debug build (console) | `pyinstaller --onefile --name DigitRecognizer main.py` |
| Test executable | `dist\DigitRecognizer.exe` |
| Location of .exe | `dist/DigitRecognizer.exe` |
| Expected file size | 100-120 MB (normal) |
| Model initialization time | 10-15 seconds (first launch only) |
| Target systems | Windows 7 or later |
| Python required on target | No |

---

## Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Working directory: project root
- [ ] Run: `pip install -r requirements.txt`
- [ ] Run: `pyinstaller --onefile --windowed --name DigitRecognizer main.py`
- [ ] Verify: `dist\DigitRecognizer.exe` exists and runs
- [ ] Test: Draw digits and test predictions
- [ ] Distribute: Copy `dist\DigitRecognizer.exe` to other machines

---

## Additional Resources

- **PyInstaller Official Documentation:** https://pyinstaller.readthedocs.io/
- **Python Official Site:** https://www.python.org/
- **Windows Executable Best Practices:** Check your antivirus for SmartScreen certification if distribution at scale is planned

---

**Last Updated:** September 2026

For questions or issues, refer to the [digit_recognition.py](digit_recognition.py) module documentation or PyInstaller troubleshooting guide.
