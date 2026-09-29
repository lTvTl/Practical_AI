"""
Tests for GUI canvas conversion utilities.

Tests the convert_canvas_to_mnist() function that converts a 400x400 pixel
canvas drawing to MNIST-compatible 8x8 format, and the DrawingCanvas class
for managing pixel data and drawing operations.
"""

import pytest
import numpy as np
from gui import convert_canvas_to_mnist, DrawingCanvas
from digit_recognition import DigitRecognizer


class TestCanvasConversion:
    """Tests for canvas to MNIST conversion functionality."""

    def test_converts_400x400_to_8x8(self):
        """Test that 400x400 canvas is correctly resized to 8x8 and flattened to (1, 64)."""
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        result = convert_canvas_to_mnist(canvas_data)
        assert result.shape == (1, 64)
        assert result.dtype == np.float32

    def test_normalizes_pixel_values(self):
        """Test that pixel values are normalized to [0, 1] range."""
        # All black pixels (0) should normalize to 0.0
        canvas_data = np.zeros((400, 400), dtype=np.uint8)
        result = convert_canvas_to_mnist(canvas_data)
        assert np.allclose(result, 0.0)

        # All white pixels (255) should normalize to 1.0
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        result = convert_canvas_to_mnist(canvas_data)
        assert np.allclose(result, 1.0)

    def test_preserves_drawn_content(self):
        """Test that drawn content (dark areas) is preserved after conversion."""
        # Create canvas: white background with black square in center
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        canvas_data[150:250, 150:250] = 0
        result = convert_canvas_to_mnist(canvas_data)

        # Center pixels should be darker than edge pixels
        center_pixels = result[0, 25:39]
        edge_pixels = result[0, 0:5]
        assert np.mean(center_pixels) < np.mean(edge_pixels)

    def test_returns_correct_shape_for_prediction(self):
        """Test that output shape is (1, 64) for sklearn prediction compatibility."""
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        result = convert_canvas_to_mnist(canvas_data)
        assert result.shape == (1, 64)
        assert result.ndim == 2


class TestDrawingCanvas:
    """Tests for DrawingCanvas class that manages drawing operations."""

    def test_initializes_with_white_background(self):
        """Test that DrawingCanvas initializes with white (255) background."""
        canvas = DrawingCanvas(width=400, height=400)
        data = canvas.get_pixel_data()
        assert data.shape == (400, 400)
        assert np.allclose(data, 255)

    def test_stores_drawn_pixels(self):
        """Test that drawn pixels are stored with darker values than white background."""
        canvas = DrawingCanvas(width=400, height=400)
        canvas.draw_line(50, 50, 100, 100, brush_width=3)
        data = canvas.get_pixel_data()
        assert data[50, 50] < 128
        assert data[100, 100] < 128

    def test_clear_resets_to_white(self):
        """Test that clear() resets canvas to white background."""
        canvas = DrawingCanvas(width=400, height=400)
        canvas.draw_line(50, 50, 100, 100, brush_width=3)
        canvas.clear()
        data = canvas.get_pixel_data()
        assert np.allclose(data, 255)

    def test_brush_width_affects_line_thickness(self):
        """Test that larger brush_width results in thicker lines with more black pixels."""
        canvas = DrawingCanvas(width=400, height=400)
        canvas.draw_line(100, 100, 150, 100, brush_width=1)
        data_thin = canvas.get_pixel_data()
        canvas.clear()
        canvas.draw_line(100, 100, 150, 100, brush_width=5)
        data_thick = canvas.get_pixel_data()
        thin_count = np.sum(data_thin < 200)
        thick_count = np.sum(data_thick < 200)
        assert thick_count > thin_count


class TestPredictionWrapper:
    """Tests for prediction wrapper functions."""

    def test_make_prediction_returns_digit(self):
        """Test that make_prediction returns an integer digit (0-9)."""
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)
        known_digit = X_train[0:1]
        from gui import make_prediction
        result = make_prediction(recognizer, known_digit)
        assert isinstance(result, (int, np.integer))
        assert 0 <= result <= 9

    def test_make_prediction_with_canvas_data(self):
        """Test that make_prediction_from_canvas converts and predicts correctly."""
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)
        # Create a canvas with some drawn content (not empty)
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        # Draw some black pixels to make canvas non-empty
        canvas_data[150:250, 150:250] = 0
        from gui import make_prediction_from_canvas
        result = make_prediction_from_canvas(recognizer, canvas_data)
        assert isinstance(result, (int, np.integer))
        assert 0 <= result <= 9

    def test_empty_canvas_raises_error(self):
        """Test that make_prediction_from_canvas raises ValueError for empty canvas."""
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)
        canvas_data = np.ones((400, 400), dtype=np.uint8) * 255
        from gui import make_prediction_from_canvas
        with pytest.raises(ValueError) as excinfo:
            result = make_prediction_from_canvas(recognizer, canvas_data)
        assert "draw" in str(excinfo.value).lower()
