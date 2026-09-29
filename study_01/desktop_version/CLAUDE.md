# Desktop Version - Handwritten Digit Recognition

## Overview

Standalone desktop application for handwritten digit recognition. Built with Tkinter GUI and packaged as a single .exe file using PyInstaller for Windows distribution. No Python installation required on end-user machines.

## Architecture

- **GUI Framework:** Tkinter (built-in with Python)
- **Model:** Scikit-learn Random Forest Classifier
- **Image Processing:** PIL/Pillow
- **Packaging:** PyInstaller → standalone .exe
- **Platform:** Windows (primary), Linux/Mac support possible

## Tech Stack

```
- Python 3.8+
- Tkinter (GUI)
- numpy>=1.19.0 (numerical computing)
- scikit-learn>=0.24.0 (machine learning)
- Pillow>=8.0.0 (image processing)
- PyInstaller>=4.0 (executable packaging)
```

## Project Structure

```
desktop_version/
├── digit_recognition.py      (ML model wrapper)
├── gui.py                    (GUI application + utilities)
├── main.py                   (Entry point)
├── test_digit_recognition.py (Model tests)
├── test_gui.py              (GUI tests)
├── requirements.txt         (Dependencies)
├── DigitRecognizer.spec     (PyInstaller config)
├── PYINSTALLER_BUILD.md     (Build instructions)
├── CLAUDE.md               (this file)
├── .gitignore              (Exclude build artifacts)
├── README.md               (User guide)
└── dist/
    └── DigitRecognizer.exe (~36 MB)
```

## Development Workflow

### TDD Principles (Must Follow)

1. **Write failing tests first** - Always start with test, verify it fails
2. **Implement minimal code** - Only enough to pass the test
3. **Refactor** - Improve code while keeping tests green
4. **Run tests immediately** - After every code change
5. **Meaningful assertions** - Never test trivial things

### Implementation Order

1. **Model Layer** (digit_recognition.py)
   - Test model loading
   - Test prediction
   - Test accuracy

2. **GUI Utilities** (gui.py utilities)
   - Canvas conversion function
   - DrawingCanvas class
   - Prediction wrapper functions

3. **GUI Application** (gui.py DigitRecognizerApp)
   - Window creation
   - Canvas drawing
   - Button handlers
   - Result display

4. **Integration** (main.py)
   - Model initialization
   - GUI launch
   - Error handling

5. **Packaging** (PyInstaller)
   - Build configuration
   - Test executable
   - Verify distribution

## Key Features

### MVP (Implemented)
- [x] Drawing canvas (400×400 pixels)
- [x] Mouse input for drawing
- [x] Real-time prediction (< 500ms)
- [x] Clear button
- [x] Error handling (empty canvas)
- [x] Standalone .exe packaging
- [x] No Python required for users

### Phase 2: Enhancement
- [ ] Drawing tools (different brush sizes, colors)
- [ ] Confidence display (show probability per digit)
- [ ] Prediction history
- [ ] Model accuracy stats
- [ ] Save predictions as image
- [ ] Dark mode theme

### Phase 3: Advanced
- [ ] Batch prediction (multiple images)
- [ ] Model retraining via GUI
- [ ] Settings panel (UI customization)
- [ ] Keyboard shortcuts
- [ ] Recent drawings gallery
- [ ] Export predictions to CSV

## Code Organization

### digit_recognition.py
- `DigitRecognizer` class
- `load_mnist_data()` - Load training data
- `train()` - Train model
- `predict()` - Make predictions
- `evaluate()` - Check accuracy

### gui.py
```python
# Utilities
convert_canvas_to_mnist()      # Canvas to MNIST conversion
make_prediction()              # Prediction wrapper
make_prediction_from_canvas()  # Full pipeline
load_model()                   # Model initialization

# Canvas class
class DrawingCanvas:
  - draw_line()
  - clear()
  - get_pixel_data()

# Application class
class DigitRecognizerApp:
  - __init__()
  - _create_widgets()
  - _bind_events()
  - on_predict()
  - on_clear()
  - run()
```

### main.py
- Entry point for PyInstaller
- Load model
- Create GUI
- Start event loop

## Testing Strategy

### Unit Tests (test_gui.py)
```python
class TestCanvasConversion:
  - test_converts_400x400_to_8x8()
  - test_normalizes_pixel_values()
  - test_preserves_drawn_content()

class TestDrawingCanvas:
  - test_initializes_with_white_background()
  - test_stores_drawn_pixels()
  - test_clear_resets_to_white()

class TestPredictionWrapper:
  - test_make_prediction_returns_digit()
  - test_empty_canvas_raises_error()
```

### Integration Tests (test_digit_recognition.py)
- Model loading
- Data loading
- Training
- Prediction accuracy (>85%)

### Manual Tests
- Draw various digits (0-9)
- Predict and verify
- Test edge cases (small strokes, off-center)
- Test GUI responsiveness

### Test Coverage Target
- >90% code coverage for utilities
- >80% for GUI components
- All critical paths tested

## Performance Requirements

| Requirement | Target | Actual |
|---|---|---|
| Drawing response | <100ms | <1ms |
| Prediction latency | <500ms | ~30ms |
| Model load time | ~10-15s | ~0.27s |
| Exe file size | ~50-60MB | ~36MB |

## Building for Distribution

### Development
```bash
python main.py
```

### Build Executable
```bash
pyinstaller --onefile --windowed --name DigitRecognizer main.py
```

### Output
```
dist/DigitRecognizer.exe (36 MB)
```

### Distribution
1. Copy dist/DigitRecognizer.exe to users
2. Users double-click to run
3. No Python installation needed
4. Model trains on first launch (~15 seconds)

## Error Handling

| Scenario | Behavior |
|---|---|
| Empty canvas | Show messagebox: "Please draw a digit first" |
| Model load fails | Show error dialog with message |
| Prediction error | Graceful error display, app continues |
| Window resize | Canvas size stays fixed (400×400) |
| Close window | Graceful shutdown |

## Code Standards

### Python Code
- **Style:** PEP 8 compliance
- **Formatter:** Black (consistent formatting)
- **Type hints:** Optional but recommended
- **Docstrings:** Clear, concise, English
- **Comments:** Explain WHY, not WHAT

### GUI Design
- **Layout:** Simple, focused (single window)
- **Colors:** White canvas, black drawing, blue results
- **Fonts:** Arial, appropriate sizes
- **Response:** Instant feedback for all actions
- **Accessibility:** Clear labels, obvious buttons

## Security Considerations

- **No network calls** - App is completely offline
- **No external dependencies** (except in requirements.txt)
- **No user data storage** - All processing in memory
- **No credentials** - No login required
- **File operations** - Minimal (read model, optional save predictions)

## Deployment Checklist

### Code Quality
- [ ] All tests passing (19/19)
- [ ] Code follows PEP 8
- [ ] No syntax errors or warnings
- [ ] No unused imports or variables
- [ ] All docstrings present and clear

### Testing
- [ ] Unit tests complete
- [ ] Integration tests complete
- [ ] Manual testing complete
- [ ] Edge cases tested
- [ ] Error handling tested

### Packaging
- [ ] requirements.txt accurate
- [ ] PyInstaller spec file correct
- [ ] .exe builds successfully
- [ ] .exe tests on clean Windows machine
- [ ] .exe is double-clickable and works

### Documentation
- [ ] README.md complete
- [ ] Build instructions clear
- [ ] Code comments adequate
- [ ] API documentation (docstrings)
- [ ] User guide for end-users

### Release
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Git tags created
- [ ] Release notes written
- [ ] Exe file size acceptable

## Running Locally

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Application
```bash
python main.py
```

### Run Tests
```bash
pytest test_gui.py test_digit_recognition.py -v
```

### Build Executable
```bash
pyinstaller --onefile --windowed --name DigitRecognizer main.py
cd dist
DigitRecognizer.exe
```

## File Sizes

| Component | Size |
|---|---|
| digit_recognition.py | ~5KB |
| gui.py | ~12KB |
| main.py | ~1KB |
| test files | ~10KB |
| DigitRecognizer.exe | ~36MB |

## Contributing Guidelines

1. Create feature branch
2. Follow TDD strictly
3. Write tests first
4. Keep commits small
5. Test before pushing
6. All tests must pass
7. Code review before merge

## Limitations & Future Work

### Current Limitations
- GUI only on Windows (Tkinter works on all OS, but packaging tested on Windows)
- Single digit input at a time
- No batch processing
- Model not retainable from GUI
- No prediction history

### Future Enhancements
- Multi-language support
- Custom brush sizes
- Prediction confidence display
- Batch digit detection
- Model fine-tuning
- Settings persistence
- Keyboard shortcuts

## Support & Maintenance

- Model accuracy: >95% on MNIST test set
- Performance: All operations complete in <1 second
- Stability: No memory leaks, handles edge cases
- Updates: Provide new .exe versions as improvements made
- Backwards compatibility: Maintain .exe API (always 0-9 prediction)

---

**Version:** 1.0  
**Last Updated:** 2026-09-19  
**Status:** Production Ready
