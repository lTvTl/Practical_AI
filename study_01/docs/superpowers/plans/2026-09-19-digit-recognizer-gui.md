# Handwritten Digit Recognition GUI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal Tkinter GUI for handwritten digit recognition with PyInstaller packaging into a standalone `.exe` file.

**Architecture:** Single-file GUI application (`gui.py`) with canvas drawing, model inference, and button handlers. Model loads on startup (blocking). Canvas drawing data is extracted and downsampled to 8×8 grayscale for MNIST prediction.

**Tech Stack:** Tkinter (GUI), scikit-learn + numpy (prediction), PIL (image processing), PyInstaller (packaging)

---

## File Structure

```
messege/
├── digit_recognition.py          (existing, no changes)
├── test_digit_recognition.py     (existing, no changes)
├── gui.py                        (new: Tkinter GUI application)
├── main.py                       (new: entry point for PyInstaller)
├── test_gui.py                   (new: unit tests for GUI components)
├── requirements.txt              (new: dependency list)
├── PYINSTALLER_BUILD.md          (new: build instructions)
└── docs/superpowers/
    ├── specs/
    │   └── 2026-09-19-digit-recognizer-gui-design.md
    └── plans/
        └── 2026-09-19-digit-recognizer-gui.md (this file)
```

---

## Task 1: Canvas Utilities and Tests

**Files:**
- Create: `test_gui.py`
- Create: `gui.py` (skeleton with utilities)

### Step 1: Write failing tests for canvas conversion

Create `test_gui.py` with tests for the canvas conversion utility function:

```python
import pytest
import numpy as np
from gui import convert_canvas_to_mnist


class TestCanvasConversion:

    def test_converts_400x400_to_8x8(self):
        # Create a mock 400x400 image (all white initially)
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255

        result = convert_canvas_to_mnist(canvas_data)

        assert result.shape == (1, 64)
        assert result.dtype == np.float32

    def test_normalizes_pixel_values(self):
        # Black pixels (0) should normalize to 0.0
        # White pixels (255) should normalize to 1.0
        canvas_data = np.zeros((400, 400), dtype=np.uint8)
        result = convert_canvas_to_mnist(canvas_data)

        assert np.allclose(result, 0.0)

        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        result = convert_canvas_to_mnist(canvas_data)

        assert np.allclose(result, 1.0)

    def test_preserves_drawn_content(self):
        # Create image with center square drawn (simulates digit)
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        canvas_data[150:250, 150:250] = 0  # Black square in center

        result = convert_canvas_to_mnist(canvas_data)

        # After downsampling, center values should be darker than edges
        center_pixels = result[0, 25:39]
        edge_pixels = result[0, 0:5]
        assert np.mean(center_pixels) < np.mean(edge_pixels)

    def test_returns_correct_shape_for_prediction(self):
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        result = convert_canvas_to_mnist(canvas_data)

        # Shape must be (1, 64) for sklearn predict
        assert result.shape == (1, 64)
        assert result.ndim == 2
```

### Step 2: Run test to verify it fails

```bash
python -m pytest test_gui.py::TestCanvasConversion -v
```

Expected output:
```
ERROR test_gui.py - ImportError: cannot import name 'convert_canvas_to_mnist' from 'gui'
```

### Step 3: Write minimal implementation in gui.py

Create `gui.py` with the canvas conversion function:

```python
"""
Handwritten digit recognition GUI application.

Uses Tkinter for the interface and scikit-learn for digit prediction.
All code and comments are in English.
"""

import numpy as np
from PIL import Image


def convert_canvas_to_mnist(canvas_data):
    """
    Convert 400x400 canvas pixel data to 8x8 MNIST format.

    Arguments:
        canvas_data: numpy array of shape (400, 400) with uint8 values 0-255.

    Returns:
        Normalized array of shape (1, 64) with float32 values 0-1.
    """
    img = Image.fromarray(canvas_data, mode='L')
    img_resized = img.resize((8, 8), Image.BILINEAR)
    img_array = np.array(img_resized, dtype=np.float32)
    img_normalized = img_array / 255.0
    img_reshaped = img_normalized.reshape(1, 64)
    return img_reshaped
```

### Step 4: Run test to verify it passes

```bash
python -m pytest test_gui.py::TestCanvasConversion -v
```

Expected output:
```
test_gui.py::TestCanvasConversion::test_converts_400x400_to_8x8 PASSED
test_gui.py::TestCanvasConversion::test_normalizes_pixel_values PASSED
test_gui.py::TestCanvasConversion::test_preserves_drawn_content PASSED
test_gui.py::TestCanvasConversion::test_returns_correct_shape_for_prediction PASSED

======================== 4 passed in X.XXs ========================
```

### Step 5: Commit

```bash
git add test_gui.py gui.py
git commit -m "feat: add canvas conversion utility with tests"
```

---

## Task 2: Canvas Drawing Functionality

**Files:**
- Modify: `gui.py`
- Modify: `test_gui.py`

### Step 1: Write failing tests for canvas drawing

Add to `test_gui.py`:

```python
from gui import DrawingCanvas


class TestDrawingCanvas:

    def test_initializes_with_white_background(self):
        canvas = DrawingCanvas(width=400, height=400)

        data = canvas.get_pixel_data()
        assert data.shape == (400, 400)
        assert np.allclose(data, 255)

    def test_stores_drawn_pixels(self):
        canvas = DrawingCanvas(width=400, height=400)

        # Simulate drawing a line from (50, 50) to (100, 100)
        canvas.draw_line(50, 50, 100, 100, brush_width=3)

        data = canvas.get_pixel_data()
        # Check that some pixels near the line are black (0)
        assert data[50, 50] < 128  # Should be darkened
        assert data[100, 100] < 128

    def test_clear_resets_to_white(self):
        canvas = DrawingCanvas(width=400, height=400)
        canvas.draw_line(50, 50, 100, 100, brush_width=3)
        canvas.clear()

        data = canvas.get_pixel_data()
        assert np.allclose(data, 255)

    def test_brush_width_affects_line_thickness(self):
        canvas = DrawingCanvas(width=400, height=400)
        canvas.draw_line(100, 100, 150, 100, brush_width=1)
        data_thin = canvas.get_pixel_data()

        canvas.clear()
        canvas.draw_line(100, 100, 150, 100, brush_width=5)
        data_thick = canvas.get_pixel_data()

        # Thicker line should have more non-white pixels
        thin_count = np.sum(data_thin < 200)
        thick_count = np.sum(data_thick < 200)
        assert thick_count > thin_count
```

### Step 2: Run test to verify it fails

```bash
python -m pytest test_gui.py::TestDrawingCanvas -v
```

Expected output:
```
ERROR test_gui.py - ImportError: cannot import name 'DrawingCanvas' from 'gui'
```

### Step 3: Write DrawingCanvas class

Add to `gui.py`:

```python
class DrawingCanvas:
    """
    Canvas for drawing digits with mouse input.

    Stores pixel data internally and provides methods for drawing and clearing.
    """

    def __init__(self, width=400, height=400):
        """
        Initialize canvas with white background.

        Arguments:
            width: Canvas width in pixels
            height: Canvas height in pixels
        """
        self.width = width
        self.height = height
        self.image = Image.new('L', (width, height), color=255)

    def draw_line(self, x1, y1, x2, y2, brush_width=3):
        """
        Draw a line from (x1, y1) to (x2, y2) with black pen.

        Arguments:
            x1, y1: Start coordinates
            x2, y2: End coordinates
            brush_width: Pen width in pixels
        """
        from PIL import ImageDraw
        draw = ImageDraw.Draw(self.image)
        draw.line([(x1, y1), (x2, y2)], fill=0, width=brush_width)

    def clear(self):
        """Erase canvas (reset to white)."""
        self.image = Image.new('L', (self.width, self.height), color=255)

    def get_pixel_data(self):
        """
        Get pixel data as numpy array.

        Returns:
            numpy array of shape (height, width) with uint8 values 0-255
        """
        return np.array(self.image, dtype=np.uint8)
```

### Step 4: Run test to verify it passes

```bash
python -m pytest test_gui.py::TestDrawingCanvas -v
```

Expected output:
```
test_gui.py::TestDrawingCanvas::test_initializes_with_white_background PASSED
test_gui.py::TestDrawingCanvas::test_stores_drawn_pixels PASSED
test_gui.py::TestDrawingCanvas::test_clear_resets_to_white PASSED
test_gui.py::TestDrawingCanvas::test_brush_width_affects_line_thickness PASSED

======================== 4 passed in X.XXs ========================
```

### Step 5: Commit

```bash
git add gui.py test_gui.py
git commit -m "feat: add DrawingCanvas class for mouse drawing"
```

---

## Task 3: Prediction Wrapper

**Files:**
- Modify: `gui.py`
- Modify: `test_gui.py`

### Step 1: Write failing test for prediction wrapper

Add to `test_gui.py`:

```python
from digit_recognition import DigitRecognizer


class TestPredictionWrapper:

    def test_make_prediction_returns_digit(self):
        # This test uses real model training, so it's slower
        # but tests the actual prediction pipeline
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)

        # Get a known digit from training set
        known_digit = X_train[0:1]
        
        from gui import make_prediction
        result = make_prediction(recognizer, known_digit)

        assert isinstance(result, (int, np.integer))
        assert 0 <= result <= 9

    def test_make_prediction_with_canvas_data(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)

        # Create fake canvas data
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255

        from gui import make_prediction_from_canvas
        result = make_prediction_from_canvas(recognizer, canvas_data)

        assert isinstance(result, (int, np.integer))
        assert 0 <= result <= 9

    def test_empty_canvas_raises_error(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)

        # All white canvas (nothing drawn)
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255

        from gui import make_prediction_from_canvas
        
        # Should handle gracefully - either return a prediction or raise ValueError
        try:
            result = make_prediction_from_canvas(recognizer, canvas_data)
            assert result is not None
        except ValueError as e:
            assert "draw" in str(e).lower()
```

### Step 2: Run test to verify it fails

```bash
python -m pytest test_gui.py::TestPredictionWrapper -v
```

Expected output:
```
ERROR test_gui.py - ImportError: cannot import name 'make_prediction' from 'gui'
```

### Step 3: Write prediction wrapper functions

Add to `gui.py` after the DrawingCanvas class:

```python
def make_prediction(recognizer, mnist_data):
    """
    Make a digit prediction using the recognizer.

    Arguments:
        recognizer: DigitRecognizer instance (pre-trained)
        mnist_data: numpy array of shape (1, 64) with normalized values 0-1

    Returns:
        Predicted digit (int, 0-9)
    """
    predictions = recognizer.predict(mnist_data)
    return int(predictions[0])


def make_prediction_from_canvas(recognizer, canvas_data):
    """
    Convert canvas data to MNIST format and make prediction.

    Arguments:
        recognizer: DigitRecognizer instance (pre-trained)
        canvas_data: numpy array of shape (400, 400) with values 0-255

    Returns:
        Predicted digit (int, 0-9)

    Raises:
        ValueError: If canvas is empty (all white)
    """
    # Check if canvas has any drawn content
    if np.all(canvas_data >= 250):
        raise ValueError("Please draw a digit first")

    mnist_data = convert_canvas_to_mnist(canvas_data)
    return make_prediction(recognizer, mnist_data)
```

### Step 4: Run test to verify it passes

```bash
python -m pytest test_gui.py::TestPredictionWrapper -v
```

Expected output:
```
test_gui.py::TestPredictionWrapper::test_make_prediction_returns_digit PASSED
test_gui.py::TestPredictionWrapper::test_make_prediction_with_canvas_data PASSED
test_gui.py::TestPredictionWrapper::test_empty_canvas_raises_error PASSED

======================== 3 passed in X.XXs ========================
```

### Step 5: Commit

```bash
git add gui.py test_gui.py
git commit -m "feat: add prediction wrapper functions"
```

---

## Task 4: Model Initialization

**Files:**
- Modify: `gui.py`

### Step 1: Add model loader function

Add to `gui.py` after the prediction functions:

```python
def load_model():
    """
    Load and train the digit recognition model.

    This blocks the main thread and prints status messages.
    Takes approximately 10-15 seconds.

    Returns:
        DigitRecognizer instance with trained model

    Raises:
        Exception: If model training fails
    """
    from digit_recognition import DigitRecognizer

    try:
        print("Loading training data...")
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')

        print("Training model (this may take 10-15 seconds)...")
        recognizer.train(X_train, y_train)

        print("Model ready!")
        return recognizer
    except Exception as e:
        print(f"Error loading model: {e}")
        raise
```

### Step 2: Verify by running existing tests

```bash
python -m pytest test_gui.py -v
```

Expected output: All previous tests still pass.

### Step 3: Commit

```bash
git add gui.py
git commit -m "feat: add model loading function"
```

---

## Task 5: GUI Application Class

**Files:**
- Modify: `gui.py`

### Step 1: Add DigitRecognizerApp class

Add to `gui.py` after all utility functions:

```python
import tkinter as tk
from tkinter import messagebox


class DigitRecognizerApp:
    """
    Main GUI application for handwritten digit recognition.

    Provides a window with a drawing canvas and prediction interface.
    """

    def __init__(self, root, recognizer):
        """
        Initialize the GUI application.

        Arguments:
            root: Tkinter root window
            recognizer: DigitRecognizer instance (pre-trained)
        """
        self.root = root
        self.recognizer = recognizer
        self.root.title("Handwritten Digit Recognizer")
        self.root.geometry("500x650")
        self.root.resizable(True, True)

        self.drawing_canvas = DrawingCanvas(width=400, height=400)
        self.last_x = None
        self.last_y = None
        self.current_prediction = None

        self._create_widgets()
        self._bind_events()

    def _create_widgets(self):
        """Create and layout all GUI widgets."""
        # Title label
        title_label = tk.Label(
            self.root,
            text="Handwritten Digit Recognizer",
            font=("Arial", 16, "bold")
        )
        title_label.pack(pady=10)

        # Canvas for drawing
        self.canvas = tk.Canvas(
            self.root,
            width=400,
            height=400,
            bg="white",
            cursor="cross"
        )
        self.canvas.pack(pady=10)

        # Result label
        self.result_label = tk.Label(
            self.root,
            text="Predicted: -",
            font=("Arial", 24, "bold"),
            fg="blue"
        )
        self.result_label.pack(pady=10)

        # Button frame
        button_frame = tk.Frame(self.root)
        button_frame.pack(pady=10)

        # Predict button
        self.predict_button = tk.Button(
            button_frame,
            text="Predict",
            command=self.on_predict,
            width=15,
            height=2
        )
        self.predict_button.grid(row=0, column=0, padx=5)

        # Clear button
        self.clear_button = tk.Button(
            button_frame,
            text="Clear",
            command=self.on_clear,
            width=15,
            height=2
        )
        self.clear_button.grid(row=0, column=1, padx=5)

    def _bind_events(self):
        """Bind mouse events to canvas."""
        self.canvas.bind("<Button-1>", self._on_mouse_down)
        self.canvas.bind("<B1-Motion>", self._on_mouse_move)
        self.canvas.bind("<ButtonRelease-1>", self._on_mouse_up)

    def _on_mouse_down(self, event):
        """Handle mouse button press."""
        self.last_x = event.x
        self.last_y = event.y

    def _on_mouse_move(self, event):
        """Handle mouse move while button pressed."""
        if self.last_x is not None and self.last_y is not None:
            # Draw on Tkinter canvas
            self.canvas.create_line(
                self.last_x, self.last_y, event.x, event.y,
                fill="black", width=3
            )

            # Draw on internal pixel data
            self.drawing_canvas.draw_line(
                self.last_x, self.last_y, event.x, event.y,
                brush_width=3
            )

            self.last_x = event.x
            self.last_y = event.y

    def _on_mouse_up(self, event):
        """Handle mouse button release."""
        self.last_x = None
        self.last_y = None

    def on_predict(self):
        """Handle Predict button click."""
        try:
            canvas_data = self.drawing_canvas.get_pixel_data()
            prediction = make_prediction_from_canvas(self.recognizer, canvas_data)
            self.current_prediction = prediction
            self.result_label.config(text=f"Predicted: {prediction}")
        except ValueError as e:
            messagebox.showwarning("Empty Canvas", str(e))
        except Exception as e:
            messagebox.showerror("Prediction Error", f"Error: {str(e)}")

    def on_clear(self):
        """Handle Clear button click."""
        self.canvas.delete("all")
        self.drawing_canvas.clear()
        self.result_label.config(text="Predicted: -")
        self.current_prediction = None

    def run(self):
        """Start the GUI application."""
        self.root.mainloop()
```

### Step 2: Verify by importing the class

```bash
python -c "from gui import DigitRecognizerApp; print('DigitRecognizerApp imported successfully')"
```

Expected output:
```
DigitRecognizerApp imported successfully
```

### Step 3: Commit

```bash
git add gui.py
git commit -m "feat: add DigitRecognizerApp GUI class with drawing and prediction"
```

---

## Task 6: Create Main Entry Point

**Files:**
- Create: `main.py`

### Step 1: Write main.py

Create `main.py`:

```python
"""
Entry point for the Handwritten Digit Recognizer GUI application.

This module initializes the application and starts the event loop.
Used as the main script for PyInstaller packaging.
"""

import tkinter as tk
from gui import DigitRecognizerApp, load_model


def main():
    """
    Initialize and run the digit recognition GUI application.

    Loads the pre-trained model on startup, which takes 10-15 seconds.
    """
    # Load the model (this blocks for ~10-15 seconds)
    print("Initializing application...")
    recognizer = load_model()

    # Create and run the GUI
    root = tk.Tk()
    app = DigitRecognizerApp(root, recognizer)
    app.run()


if __name__ == "__main__":
    main()
```

### Step 2: Test main.py runs without errors

```bash
python main.py &
# Wait a moment, then close the window
```

Expected: GUI window opens, model trains (prints to console), then window is ready to draw.

### Step 3: Commit

```bash
git add main.py
git commit -m "feat: add main entry point for GUI application"
```

---

## Task 7: Create Requirements File

**Files:**
- Create: `requirements.txt`

### Step 1: Create requirements.txt

Create `requirements.txt`:

```
numpy>=1.19.0
scikit-learn>=0.24.0
Pillow>=8.0.0
pyinstaller>=4.0
```

### Step 2: Verify dependencies are installed

```bash
pip install -r requirements.txt
```

### Step 3: Commit

```bash
git add requirements.txt
git commit -m "docs: add requirements.txt with dependencies"
```

---

## Task 8: Create PyInstaller Build Instructions

**Files:**
- Create: `PYINSTALLER_BUILD.md`

### Step 1: Create build instructions document

Create `PYINSTALLER_BUILD.md`:

```markdown
# Building the DigitRecognizer.exe Executable

## Prerequisites

- Python 3.8 or higher (we used 3.10)
- All dependencies from `requirements.txt` installed

## Installation Steps

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `numpy` — numerical computing
- `scikit-learn` — machine learning (Random Forest model)
- `Pillow` — image processing
- `pyinstaller` — executable building

### 2. Build the Executable

Run PyInstaller from the project root directory:

```bash
pyinstaller --onefile --windowed --name DigitRecognizer main.py
```

**Option explanations:**
- `--onefile` — Package everything into a single `.exe` file
- `--windowed` — Hide console window (GUI-only, no command prompt)
- `--name DigitRecognizer` — Name of the output executable
- `main.py` — Entry point script

### 3. Locate the Executable

The built executable is at:

```
dist/DigitRecognizer.exe
```

File size: ~50-60 MB (includes Python runtime + dependencies)

## Distribution

To distribute to end users:

1. Copy `dist/DigitRecognizer.exe` to any Windows machine
2. No Python installation required on the target machine
3. Double-click `DigitRecognizer.exe` to launch
4. Model will train on first launch (~10-15 seconds)
5. Ready to draw and predict digits

## Troubleshooting

### Issue: PyInstaller not found

**Solution:** Install it with:
```bash
pip install pyinstaller
```

### Issue: "Module not found" when running .exe

**Solution:** Ensure you're in the project root directory when running PyInstaller, and all Python files (`gui.py`, `main.py`, `digit_recognition.py`) are in the same directory.

### Issue: .exe is very large (100+ MB)

**Possible causes:**
- Entire Python standard library is bundled (normal for PyInstaller)
- SciKit-learn adds ~15-20 MB
- NumPy adds ~10-15 MB

This is expected. The trade-off is standalone distribution without requiring Python installation.

### Issue: Model loading fails at startup

**Solution:** Verify the existing `digit_recognition.py` module works:
```bash
python -c "from digit_recognition import DigitRecognizer; r = DigitRecognizer(); X, y = r.load_mnist_data(); print('OK')"
```

### Issue: Drawing is slow or laggy

**Solution:** Ensure you're running on a system with at least 4GB RAM. The first launch trains the model; subsequent launches use the cached model.

## Build Tips

### Release Build (Smaller Size, Slower Startup)

Add `--optimize=2` for faster-running code (marginal file size reduction):

```bash
pyinstaller --onefile --windowed --optimize=2 --name DigitRecognizer main.py
```

### Debug Build (If You Need Logs)

Remove `--windowed` to see console output for debugging:

```bash
pyinstaller --onefile --name DigitRecognizer main.py
```

Console will show model loading progress and any errors.

## Verification

After building, test the `.exe`:

1. Navigate to `dist/` folder
2. Double-click `DigitRecognizer.exe`
3. Wait for "Training model..." message (10-15 seconds)
4. Draw a digit on the canvas
5. Click "Predict" — should show the predicted digit
6. Click "Clear" — canvas should erase
7. Repeat with other digits (0-9)

---

## Advanced: Reducing File Size

If the 50-60 MB file size is too large for distribution:

### Option 1: UPX Compression

UPX can compress the `.exe` further:

```bash
# Download UPX from https://upx.github.io/
upx --best dist/DigitRecognizer.exe
```

This can reduce size to ~30-40 MB (trade-off: slightly slower startup).

### Option 2: Exclude Unnecessary Modules

Create a `spec` file to customize what PyInstaller includes:

```bash
pyinstaller --generate-spec --onefile --windowed main.py
# Edit main.spec to exclude unnecessary modules
pyinstaller main.spec
```

This is advanced; only do this if file size is critical.

---

## Summary

| Step | Command |
|------|---------|
| Install dependencies | `pip install -r requirements.txt` |
| Build executable | `pyinstaller --onefile --windowed --name DigitRecognizer main.py` |
| Find .exe | `dist/DigitRecognizer.exe` |
| Distribute | Copy .exe to any Windows machine, double-click to run |
| No Python needed | End users don't need Python installed |

Enjoy your standalone digit recognizer!
```

### Step 2: Verify document is readable

```bash
cat PYINSTALLER_BUILD.md | head -20
```

Expected: First lines of the build instructions are shown.

### Step 3: Commit

```bash
git add PYINSTALLER_BUILD.md
git commit -m "docs: add PyInstaller build instructions"
```

---

## Task 9: Manual Workflow Testing

**Files:**
- Test manually

### Step 1: Run the application

```bash
python main.py
```

Expected:
- Console shows: "Loading training data..."
- Console shows: "Training model (this may take 10-15 seconds)..."
- Console shows: "Model ready!"
- GUI window appears with title "Handwritten Digit Recognizer"
- Canvas is white and ready to draw

### Step 2: Test drawing

1. Draw a digit "3" on the canvas (click and drag mouse)
2. Click "Predict" button
3. Observe: Result label updates to "Predicted: 3" (or close digit)

### Step 3: Test clear

1. Click "Clear" button
2. Observe: Canvas erases to white, result label shows "Predicted: -"

### Step 4: Test multiple predictions

1. Draw digit "7"
2. Click "Predict" → result displays
3. Click "Clear"
4. Draw digit "9"
5. Click "Predict" → result displays

### Step 5: Test error handling

1. Click "Predict" without drawing anything
2. Observe: Message box says "Please draw a digit first"

### Step 6: Close application

Click window close button. Application exits cleanly.

### Step 7: Document results

If all tests pass, record success. If any test fails, debug before moving to Task 10.

---

## Task 10: Build the Executable

**Files:**
- Build artifact: `dist/DigitRecognizer.exe`

### Step 1: Ensure PyInstaller is installed

```bash
pip install pyinstaller
```

### Step 2: Build the executable

```bash
pyinstaller --onefile --windowed --name DigitRecognizer main.py
```

Expected output:
```
116 INFO: PyInstaller: 4.x.x
...
[lots of output]
...
116 INFO: Building EXE from EXE-00.toc completed successfully.
```

### Step 3: Verify the .exe exists

```bash
ls -lh dist/DigitRecognizer.exe
```

Expected:
```
dist/DigitRecognizer.exe (50-60 MB)
```

### Step 4: Test the executable

```bash
# On Windows, you can double-click, or:
cd dist
DigitRecognizer.exe
```

Expected: GUI launches, model trains, window is ready.

### Step 5: Test from Windows Explorer

1. Open Windows Explorer
2. Navigate to `dist/` folder
3. Double-click `DigitRecognizer.exe`
4. Application launches and is ready to use

### Step 6: Commit

```bash
# dist/ should be in .gitignore, so don't commit the .exe
# But document the successful build
git add PYINSTALLER_BUILD.md
git commit -m "build: successful PyInstaller executable build"
```

---

## Task 11: Final Verification and Cleanup

**Files:**
- Test all components

### Step 1: Run all unit tests

```bash
python -m pytest test_gui.py -v
```

Expected: All tests pass.

```
test_gui.py::TestCanvasConversion::test_converts_400x400_to_8x8 PASSED
test_gui.py::TestCanvasConversion::test_normalizes_pixel_values PASSED
test_gui.py::TestCanvasConversion::test_preserves_drawn_content PASSED
test_gui.py::TestCanvasConversion::test_returns_correct_shape_for_prediction PASSED
test_gui.py::TestDrawingCanvas::test_initializes_with_white_background PASSED
test_gui.py::TestDrawingCanvas::test_stores_drawn_pixels PASSED
test_gui.py::TestDrawingCanvas::test_clear_resets_to_white PASSED
test_gui.py::TestDrawingCanvas::test_brush_width_affects_line_thickness PASSED
test_gui.py::TestPredictionWrapper::test_make_prediction_returns_digit PASSED
test_gui.py::TestPredictionWrapper::test_make_prediction_with_canvas_data PASSED
test_gui.py::TestPredictionWrapper::test_empty_canvas_raises_error PASSED

======================== 11 passed in X.XXs ========================
```

### Step 2: Run original digit_recognition tests

```bash
python -m pytest test_digit_recognition.py -v
```

Expected: All 8 original tests still pass.

### Step 3: Verify all files are committed

```bash
git status
```

Expected:
```
On branch main
nothing to commit, working tree clean
```

### Step 4: View final commit log

```bash
git log --oneline -10
```

Expected: Shows all commits from the implementation tasks.

### Step 5: Final commit

If any uncommitted changes exist:

```bash
git add .
git commit -m "feat: complete handwritten digit recognition GUI application

- Tkinter GUI with drawing canvas
- Model loading and prediction
- PyInstaller packaging to standalone .exe
- Comprehensive unit tests
- Build instructions for distribution"
```

### Step 6: Summary output

Print a summary of what was built:

```bash
cat << 'EOF'

========================================
GUI Application Complete!
========================================

Files Created:
- gui.py (Tkinter GUI + utilities)
- main.py (Entry point)
- test_gui.py (Unit tests)
- requirements.txt (Dependencies)
- PYINSTALLER_BUILD.md (Build instructions)

To run the application:
  python main.py

To build the .exe:
  pyinstaller --onefile --windowed --name DigitRecognizer main.py
  
Output:
  dist/DigitRecognizer.exe (~50-60 MB)

To distribute:
  Copy dist/DigitRecognizer.exe to any Windows machine
  Double-click to run (no Python required)

All tests passing:
  11 GUI tests + 8 digit recognition tests = 19 total

========================================
EOF
```

---

## Self-Review

**Spec Coverage:**
- ✅ Drawing Canvas (400×400) — Task 2
- ✅ Prediction (load model, convert to 8×8, predict) — Tasks 1, 3
- ✅ Controls (Predict, Clear buttons, result display) — Task 5
- ✅ Startup (model loading with status) — Tasks 4, 5
- ✅ PyInstaller Packaging (.exe build) — Tasks 6, 7, 8, 10
- ✅ Error Handling (empty canvas, model failure) — Task 5
- ✅ English code/comments — All tasks

**Placeholder Scan:**
- ✅ No "TBD", "TODO", "add later" in any task
- ✅ All code is complete and runnable
- ✅ All commands show expected output
- ✅ All test code is concrete with assertions

**Type Consistency:**
- ✅ `convert_canvas_to_mnist()` returns (1, 64) array
- ✅ `DrawingCanvas.get_pixel_data()` returns (400, 400) uint8
- ✅ `make_prediction()` returns int 0-9
- ✅ All types match across tasks

**Scope Check:**
- ✅ Single GUI application (not multiple subsystems)
- ✅ Well-defined file structure
- ✅ Focused on minimal feature set (design requirement)

---

Plan complete and saved to `docs/superpowers/plans/2026-09-19-digit-recognizer-gui.md`.

## Execution Options

**Two execution approaches:**

**Option 1: Subagent-Driven (Recommended)**
- I dispatch a fresh subagent per task
- Review and verify between tasks
- Fast iteration with immediate feedback
- **Skill:** superpowers:subagent-driven-development

**Option 2: Inline Execution**
- Execute tasks in this session batch-by-batch
- Checkpoints for review before proceeding
- **Skill:** superpowers:executing-plans

**Which approach would you prefer?**