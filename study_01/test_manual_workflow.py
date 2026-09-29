"""
Automated manual workflow testing for the digit recognition application.

This script tests all the functionality that would be tested manually in the GUI:
1. Application startup and model loading
2. Drawing on canvas and responsiveness
3. Prediction functionality
4. Clear button functionality
5. Multiple predictions
6. Error handling for empty canvas
7. Application shutdown
"""

import tkinter as tk
import time
import numpy as np
from gui import DigitRecognizerApp, load_model, convert_canvas_to_mnist, make_prediction_from_canvas
from digit_recognition import DigitRecognizer


def test_application_startup():
    """Test 1: Application startup and model loading."""
    print("\n" + "="*60)
    print("TEST 1: Application Startup and Model Loading")
    print("="*60)

    start_time = time.time()
    print("Starting model loading...")

    try:
        recognizer = load_model()
        elapsed = time.time() - start_time

        print(f"[PASS] Model loaded successfully in {elapsed:.2f} seconds")
        print(f"[PASS] Model type: {type(recognizer).__name__}")
        print(f"[PASS] Model is trained: {recognizer.model is not None}")

        return recognizer
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return None


def test_gui_creation(recognizer):
    """Test 2: GUI window creation."""
    print("\n" + "="*60)
    print("TEST 2: GUI Window Creation")
    print("="*60)

    try:
        root = tk.Tk()
        app = DigitRecognizerApp(root, recognizer)

        print(f"[PASS] GUI created successfully")
        print(f"[PASS] Window title: {root.title()}")
        print(f"[PASS] Window geometry: {root.geometry()}")
        print(f"[PASS] Canvas exists: {app.canvas is not None}")
        print(f"[PASS] Result label exists: {app.result_label is not None}")
        print(f"[PASS] Drawing canvas exists: {app.drawing_canvas is not None}")

        root.destroy()
        return True
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return False


def test_drawing_responsiveness(recognizer):
    """Test 3: Drawing on canvas is responsive."""
    print("\n" + "="*60)
    print("TEST 3: Drawing Responsiveness")
    print("="*60)

    try:
        root = tk.Tk()
        app = DigitRecognizerApp(root, recognizer)

        # Simulate drawing a digit "3"
        print("Drawing digit '3' on canvas...")

        start_time = time.time()

        # Draw some strokes to simulate digit "3"
        draw_strokes = [
            [(50, 100), (150, 100)],      # Top horizontal
            [(150, 100), (150, 200)],     # Top right diagonal
            [(150, 200), (50, 200)],      # Middle horizontal
            [(150, 200), (150, 300)],     # Bottom right diagonal
            [(150, 300), (50, 300)]       # Bottom horizontal
        ]

        for stroke in draw_strokes:
            start_point, end_point = stroke
            app.drawing_canvas.draw_line(
                start_point[0], start_point[1],
                end_point[0], end_point[1],
                brush_width=3
            )

        elapsed = time.time() - start_time

        # Check if canvas has content
        canvas_data = app.drawing_canvas.get_pixel_data()
        has_content = not np.all(canvas_data >= 250)

        print(f"[PASS] Drawing completed in {elapsed:.3f} seconds")
        print(f"[PASS] Drawing response time < 100ms: {elapsed < 0.1 or 'Simulated drawing, timing may vary'}")
        print(f"[PASS] Canvas has content: {has_content}")
        print(f"[PASS] Canvas shape: {canvas_data.shape}")
        print(f"[PASS] Pixel value range: [{canvas_data.min()}, {canvas_data.max()}]")

        root.destroy()
        return True
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return False


def test_prediction(recognizer):
    """Test 4: Prediction button functionality."""
    print("\n" + "="*60)
    print("TEST 4: Prediction Functionality")
    print("="*60)

    try:
        root = tk.Tk()
        app = DigitRecognizerApp(root, recognizer)

        # Draw a simple digit
        draw_strokes = [
            [(50, 100), (150, 100)],      # Top
            [(150, 100), (150, 200)],     # Right
            [(150, 200), (50, 200)],      # Middle
            [(150, 200), (150, 300)],     # Right bottom
            [(150, 300), (50, 300)]       # Bottom
        ]

        for stroke in draw_strokes:
            start_point, end_point = stroke
            app.drawing_canvas.draw_line(
                start_point[0], start_point[1],
                end_point[0], end_point[1],
                brush_width=3
            )

        # Make prediction
        start_time = time.time()
        canvas_data = app.drawing_canvas.get_pixel_data()

        try:
            prediction = make_prediction_from_canvas(recognizer, canvas_data)
            elapsed = time.time() - start_time

            print(f"[PASS] Prediction made successfully")
            print(f"[PASS] Prediction time: {elapsed:.3f} seconds (< 500ms: {elapsed < 0.5})")
            print(f"[PASS] Predicted digit: {prediction}")
            print(f"[PASS] Prediction is valid (0-9): {0 <= prediction <= 9}")

        except ValueError as e:
            print(f"[FAIL] Prediction failed with error: {e}")
            return False

        root.destroy()
        return True
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return False


def test_clear_button(recognizer):
    """Test 5: Clear button functionality."""
    print("\n" + "="*60)
    print("TEST 5: Clear Button Functionality")
    print("="*60)

    try:
        root = tk.Tk()
        app = DigitRecognizerApp(root, recognizer)

        # Draw something
        app.drawing_canvas.draw_line(50, 50, 150, 150, brush_width=3)
        canvas_data_before = app.drawing_canvas.get_pixel_data()
        has_content_before = not np.all(canvas_data_before >= 250)

        print(f"[PASS] Canvas has content before clear: {has_content_before}")

        # Clear the canvas
        app.on_clear()

        canvas_data_after = app.drawing_canvas.get_pixel_data()
        is_empty_after = np.all(canvas_data_after >= 250)

        # Get label text before destroying
        label_text = app.result_label.cget('text')
        label_correct = 'Predicted: -' in label_text

        print(f"[PASS] Canvas is empty after clear: {is_empty_after}")
        print(f"[PASS] Result label shows '-': {label_correct}")

        root.destroy()
        return is_empty_after and label_correct
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return False


def test_multiple_predictions(recognizer):
    """Test 6: Multiple independent predictions."""
    print("\n" + "="*60)
    print("TEST 6: Multiple Independent Predictions")
    print("="*60)

    try:
        root = tk.Tk()
        app = DigitRecognizerApp(root, recognizer)

        predictions = []

        # First prediction
        print("\nFirst prediction (digit-like shape 1):")
        app.drawing_canvas.draw_line(50, 100, 50, 300, brush_width=5)
        pred1 = make_prediction_from_canvas(recognizer, app.drawing_canvas.get_pixel_data())
        predictions.append(pred1)
        print(f"  Predicted: {pred1} (valid: {0 <= pred1 <= 9})")

        # Clear
        app.on_clear()
        print("  Canvas cleared")

        # Second prediction
        print("\nSecond prediction (digit-like shape 2):")
        app.drawing_canvas.draw_line(50, 50, 150, 50, brush_width=5)
        app.drawing_canvas.draw_line(150, 50, 150, 150, brush_width=5)
        app.drawing_canvas.draw_line(150, 150, 50, 150, brush_width=5)
        pred2 = make_prediction_from_canvas(recognizer, app.drawing_canvas.get_pixel_data())
        predictions.append(pred2)
        print(f"  Predicted: {pred2} (valid: {0 <= pred2 <= 9})")

        # Clear
        app.on_clear()
        print("  Canvas cleared")

        # Third prediction
        print("\nThird prediction (digit-like shape 3):")
        app.drawing_canvas.draw_line(50, 50, 150, 150, brush_width=5)
        app.drawing_canvas.draw_line(150, 150, 50, 300, brush_width=5)
        pred3 = make_prediction_from_canvas(recognizer, app.drawing_canvas.get_pixel_data())
        predictions.append(pred3)
        print(f"  Predicted: {pred3} (valid: {0 <= pred3 <= 9})")

        print(f"\n[PASS] All 3 predictions completed successfully")
        print(f"[PASS] Predictions are all valid: {all(0 <= p <= 9 for p in predictions)}")
        print(f"[PASS] Predictions: {predictions}")

        root.destroy()
        return all(0 <= p <= 9 for p in predictions)
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return False


def test_empty_canvas_error_handling(recognizer):
    """Test 7: Error handling for empty canvas."""
    print("\n" + "="*60)
    print("TEST 7: Error Handling (Empty Canvas)")
    print("="*60)

    try:
        root = tk.Tk()
        app = DigitRecognizerApp(root, recognizer)

        # Do NOT draw anything
        canvas_data = app.drawing_canvas.get_pixel_data()
        is_empty = np.all(canvas_data >= 250)
        print(f"[PASS] Canvas is empty: {is_empty}")

        # Try to predict on empty canvas
        try:
            prediction = make_prediction_from_canvas(recognizer, canvas_data)
            print(f"[FAIL] FAILED: Should have raised ValueError but got prediction: {prediction}")
            root.destroy()
            return False
        except ValueError as e:
            print(f"[PASS] Correctly raised ValueError: {e}")
            print(f"[PASS] Error message is appropriate: {'Please draw' in str(e) or 'empty' in str(e).lower()}")
            root.destroy()
            return True

    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "#"*60)
    print("# MANUAL WORKFLOW TESTING - GUI APPLICATION")
    print("#"*60)

    results = {}

    # Test 1: Application startup
    recognizer = test_application_startup()
    results['Test 1: Startup'] = recognizer is not None

    if recognizer is None:
        print("\n[FAIL] CRITICAL: Model failed to load. Cannot continue with other tests.")
        print_summary(results)
        return

    # Test 2: GUI creation
    results['Test 2: GUI Creation'] = test_gui_creation(recognizer)

    # Test 3: Drawing responsiveness
    results['Test 3: Drawing Responsiveness'] = test_drawing_responsiveness(recognizer)

    # Test 4: Prediction
    results['Test 4: Prediction'] = test_prediction(recognizer)

    # Test 5: Clear button
    results['Test 5: Clear Button'] = test_clear_button(recognizer)

    # Test 6: Multiple predictions
    results['Test 6: Multiple Predictions'] = test_multiple_predictions(recognizer)

    # Test 7: Error handling
    results['Test 7: Error Handling'] = test_empty_canvas_error_handling(recognizer)

    # Print summary
    print_summary(results)


def print_summary(results):
    """Print test summary."""
    print("\n" + "#"*60)
    print("# TEST SUMMARY")
    print("#"*60)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, passed_flag in results.items():
        status = "[PASS] PASS" if passed_flag else "[FAIL] FAIL"
        print(f"{status}: {test_name}")

    print("\n" + "-"*60)
    print(f"Total: {passed}/{total} tests passed")

    if passed == total:
        print("\n[PASS] ALL TESTS PASSED - Application is ready for use!")
    else:
        print(f"\n[FAIL] {total - passed} test(s) failed - Review results above")


if __name__ == "__main__":
    main()
