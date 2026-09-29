# Handwritten Digit Recognition GUI — Design Specification

**Date:** 2026-09-19  
**Author:** Claude Code  
**Status:** Design Approved

---

## Overview

Build a minimal, single-window GUI application for handwritten digit recognition. Users draw digits on a canvas using their mouse, click "Predict", and see the classification result instantly. The application packages as a standalone `.exe` file for Windows using PyInstaller, requiring no Python installation on the end user's machine.

---

## Requirements

### Functional Requirements

1. **Drawing Canvas**
   - 400×400 pixel white canvas
   - Capture mouse draw events (click and drag)
   - Render black lines as the user draws (pen width: 3-5 pixels)
   - Respond immediately to user input

2. **Prediction**
   - Load pre-trained Random Forest model at startup
   - Convert 400×400 canvas to 8×8 grayscale MNIST format
   - Normalize pixel values 0-1
   - Call `DigitRecognizer.predict()` from existing module
   - Display predicted digit (0-9) prominently on screen

3. **Controls**
   - "Predict" button — trigger classification
   - "Clear" button — erase canvas and reset for next drawing
   - Title label — "Handwritten Digit Recognizer"
   - Result display — show "Predicted: X" (where X is 0-9)

4. **Startup & Shutdown**
   - Load pre-trained model on app launch (~1-2 second delay)
   - Show loading indicator or "Loading model..." message
   - Clean shutdown on window close

### Non-Functional Requirements

1. **Packaging**
   - Single standalone `.exe` file
   - No Python runtime required on end-user machine
   - Double-clickable from Windows Explorer
   - ~50-60 MB total size

2. **Language**
   - All code comments and UI text in English

3. **Performance**
   - Prediction latency < 500ms
   - Drawing response < 100ms

---

## Architecture

### Components

#### 1. GUI Layer (`gui.py`)
- **Responsibility:** Tkinter window, canvas, buttons, layout
- **Exports:**
  - `DigitRecognizerApp` class with lifecycle (init, run, shutdown)
  - Canvas drawing state management
  - Event handlers for buttons and mouse events

#### 2. Canvas Handler (within `gui.py`)
- **Responsibility:** Capture and render drawing strokes
- **Internal state:**
  - Pixel array or line segment list (to reconstruct for prediction)
  - Current brush state (position, pressure)

#### 3. Prediction Wrapper (within `gui.py` or separate)
- **Responsibility:** Convert canvas → MNIST format → call `DigitRecognizer.predict()`
- **Input:** 400×400 canvas pixel data
- **Output:** Predicted digit (int, 0-9)

#### 4. Model Loader (within `gui.py`)
- **Responsibility:** Initialize `DigitRecognizer`, load/train model at startup
- **Timing:** Blocking load on app launch; show status message

#### 5. Existing Module (`digit_recognition.py`)
- **No changes required** — Use as-is
- `DigitRecognizer.load_mnist_data()` — Load training data
- `DigitRecognizer.train()` — Train model
- `DigitRecognizer.predict()` — Make predictions

---

## UI Layout

```
┌─────────────────────────────────────┐
│  Handwritten Digit Recognizer       │
├─────────────────────────────────────┤
│                                     │
│                                     │
│          [Drawing Canvas]           │
│          (400x400 pixels)           │
│                                     │
│                                     │
├─────────────────────────────────────┤
│        Predicted: [Digit]           │
├─────────────────────────────────────┤
│    [Predict Button]  [Clear Button] │
└─────────────────────────────────────┘
```

**Dimensions:** 500×650 pixels (approximate)

---

## Data Flow

1. **Startup**
   ```
   App Launch
   → Load DigitRecognizer instance
   → Train model on MNIST data (or load pre-trained)
   → Display "Ready" on canvas
   → Show blank canvas
   ```

2. **User Draws**
   ```
   Mouse Down Event
   → Capture (x, y) coordinates
   → Draw line on canvas
   → Store pixel data
   → Mouse Move/Up events update state
   ```

3. **Predict**
   ```
   User clicks "Predict"
   → Extract canvas pixel data (400×400)
   → Resize to 8×8 grayscale
   → Normalize to [0, 1]
   → Call DigitRecognizer.predict(resized_image)
   → Display result: "Predicted: X"
   ```

4. **Clear**
   ```
   User clicks "Clear"
   → Erase canvas (draw white rectangle)
   → Reset drawing state
   → Clear result display
   → Ready for next drawing
   ```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Model fails to load | Display error dialog: "Failed to load model. Check your installation." |
| Empty canvas when predict clicked | Show message: "Please draw a digit first" (non-blocking) |
| Prediction fails unexpectedly | Display: "Prediction error. Please try again." |
| Window resize | Canvas size remains fixed (400×400); window resizable but canvas does not scale |

---

## Implementation Details

### Canvas Conversion (400×400 → 8×8)

1. Read pixel data from Tkinter canvas as grayscale (convert RGB if needed)
2. Downsample from 400×400 to 8×8 using bilinear interpolation
3. Normalize: divide by 255 to get [0, 1] range
4. Reshape to (1, 64) for sklearn prediction

### Model Training

- Load MNIST data from `DigitRecognizer.load_mnist_data(split='train')`
- Train on startup (takes ~10-15 seconds); show "Training model..." message during load
- Cache trained model in memory for remainder of session
- One-time cost per app launch; prediction is instant afterward

### Threading Consideration

- Model training blocks UI on startup (acceptable for 10-15 seconds with status message)
- Prediction is fast (<500ms) and can be synchronous
- No threading required for MVP

---

## PyInstaller Packaging

### Build Command

```bash
pyinstaller --onefile --windowed --name DigitRecognizer gui.py
```

### Options Explained

| Flag | Purpose |
|------|---------|
| `--onefile` | Package as single `.exe` instead of directory |
| `--windowed` | No console window (GUI-only) |
| `--name DigitRecognizer` | Output file name |

### Deliverable

- **Location:** `dist/DigitRecognizer.exe`
- **Size:** ~50-60 MB (includes Python 3.10 runtime + numpy + scikit-learn)
- **Distribution:** Users download `.exe`, double-click, app runs

### Dependencies Packaged

- numpy
- scikit-learn
- Tkinter (bundled with Python)

---

## Testing Strategy

### Unit Tests
- Canvas drawing: verify pixel data stored correctly
- Canvas resize: verify 400×400 → 8×8 conversion works
- Prediction wrapper: test with known digit samples
- Error handling: test with invalid inputs

### Integration Tests
- Full workflow: draw → predict → verify result matches expected digit
- Clear button: verify canvas resets
- Multiple predictions: train once, predict multiple times

### Manual Testing
- Draw digits 0-9, verify predictions are correct
- Test edge cases (very small/large strokes, off-center)
- Verify `.exe` runs on clean Windows machine without Python installed

---

## Future Enhancements (Out of Scope)

- Batch predictions (upload multiple images)
- Model retraining via GUI
- Confidence scores displayed
- Drawing history / prediction log
- Custom drawing size / brush size options
- Dark mode

---

## Files & Structure

```
messege/
├── digit_recognition.py          (existing, unchanged)
├── test_digit_recognition.py     (existing, unchanged)
├── gui.py                        (new: Tkinter GUI application)
├── main.py                       (new: entry point for PyInstaller)
├── docs/
│   └── superpowers/specs/
│       └── 2026-09-19-digit-recognizer-gui-design.md
└── dist/
    └── DigitRecognizer.exe       (PyInstaller output)
```

---

## Success Criteria

- ✅ Draw on canvas responds in <100ms
- ✅ Prediction displays result in <500ms
- ✅ Clear button erases canvas instantly
- ✅ Model loads on startup with status message
- ✅ `DigitRecognizer.exe` runs on Windows without Python
- ✅ Double-click `.exe` launches app immediately
- ✅ No visible errors or warnings in normal usage
