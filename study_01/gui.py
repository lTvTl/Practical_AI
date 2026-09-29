"""
GUI utilities for the digit recognition application.

Provides DrawingCanvas class for managing pixel data and drawing operations,
and functions to convert canvas drawings to MNIST-compatible format
for use with the DigitRecognizer model.
"""

import tkinter as tk
from tkinter import messagebox
import numpy as np
from PIL import Image, ImageDraw
from digit_recognition import DigitRecognizer


def convert_canvas_to_mnist(canvas_data):
    """
    Convert a 400x400 pixel canvas drawing to 8x8 MNIST format.

    Takes a 400x400 pixel canvas (typically from a drawing application) and
    converts it to 8x8 pixel format with proper normalization for MNIST model
    prediction. Outputs shape is (1, 64) compatible with sklearn predict().

    Arguments:
        canvas_data: numpy array of shape (400, 400) with uint8 pixel values.
                     Pixel values should be in range [0, 255].

    Returns:
        numpy array of shape (1, 64) with float32 dtype.
        Pixel values normalized to range [0, 1] where 0 is black and 1 is white.
    """
    # Convert numpy array to PIL Image for resizing
    image = Image.fromarray(canvas_data, mode='L')

    # Resize to 8x8 using bilinear interpolation
    # This preserves the drawing content while downsampling
    resized = image.resize((8, 8), Image.BILINEAR)

    # Convert back to numpy array
    resized_array = np.array(resized, dtype=np.float32)

    # Normalize pixel values from [0, 255] to [0, 1]
    normalized = resized_array / 255.0

    # Flatten to (8*8,) = (64,) and reshape to (1, 64) for prediction
    flattened = normalized.flatten()
    result = flattened.reshape(1, 64)

    return result


class DrawingCanvas:
    """
    Manages pixel data for drawing operations on a canvas.

    Provides a simple interface to create a canvas, draw lines on it, and
    retrieve the pixel data. Uses PIL Image internally to store grayscale
    pixel data with white (255) as background and black (0) for drawn content.

    Attributes:
        width (int): Canvas width in pixels.
        height (int): Canvas height in pixels.
    """

    def __init__(self, width=400, height=400):
        """
        Initialize a new DrawingCanvas with white background.

        Arguments:
            width (int): Canvas width in pixels. Defaults to 400.
            height (int): Canvas height in pixels. Defaults to 400.
        """
        self.width = width
        self.height = height
        # Create white image (mode 'L' for grayscale, value 255 for white)
        self._image = Image.new('L', (width, height), 255)

    def draw_line(self, x1, y1, x2, y2, brush_width=3):
        """
        Draw a black line on the canvas.

        Draws a line from (x1, y1) to (x2, y2) using black pixels (value 0)
        with the specified brush width.

        Arguments:
            x1 (int): Starting x coordinate.
            y1 (int): Starting y coordinate.
            x2 (int): Ending x coordinate.
            y2 (int): Ending y coordinate.
            brush_width (int): Width of the line in pixels. Defaults to 3.
        """
        draw = ImageDraw.Draw(self._image)
        # Draw black line (fill=0) with specified width
        draw.line([(x1, y1), (x2, y2)], fill=0, width=brush_width)

    def clear(self):
        """
        Clear the canvas by resetting it to white background.

        Erases all drawn content and resets the canvas to all white pixels (255).
        """
        self._image = Image.new('L', (self.width, self.height), 255)

    def get_pixel_data(self):
        """
        Get the canvas pixel data as a numpy array.

        Returns:
            numpy array of shape (height, width) with uint8 dtype.
            Pixel values in range [0, 255] where 0 is black and 255 is white.
        """
        return np.array(self._image, dtype=np.uint8)


def make_prediction(recognizer, mnist_data):
    """
    Make a digit prediction using the recognizer.

    Args:
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

    Args:
        recognizer: DigitRecognizer instance (pre-trained)
        canvas_data: numpy array of shape (400, 400) with values 0-255

    Returns:
        Predicted digit (int, 0-9)

    Raises:
        ValueError: If canvas is empty (all white)
    """
    # Check if canvas is empty (all white >= 250)
    if np.all(canvas_data >= 250):
        raise ValueError("Canvas is empty. Please draw a digit before making a prediction.")

    # Convert canvas to MNIST format
    mnist_data = convert_canvas_to_mnist(canvas_data)

    # Make prediction
    return make_prediction(recognizer, mnist_data)


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
    try:
        print("Loading training data...")
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')

        print("Training model (this may take 10-15 seconds)...")
        recognizer.train(X_train, y_train)

        print("Model ready!")
        return recognizer
    except Exception as e:
        raise Exception(f"Error loading model: {e}")


class DigitRecognizerApp:
    """
    Tkinter GUI application for handwritten digit recognition.

    Provides an interactive interface for drawing digits and getting
    predictions from a pre-trained digit recognizer model.

    Attributes:
        root: Tkinter root window
        recognizer: DigitRecognizer instance
        drawing_canvas: DrawingCanvas for managing pixel data
        canvas: Tkinter Canvas widget for display
        result_label: Label for displaying prediction results
        last_x: x coordinate of last mouse event
        last_y: y coordinate of last mouse event
        current_prediction: Currently displayed prediction
    """

    def __init__(self, root, recognizer):
        """
        Initialize the DigitRecognizerApp.

        Arguments:
            root: Tkinter root window
            recognizer: Pre-trained DigitRecognizer instance
        """
        self.root = root
        self.recognizer = recognizer

        # Set window properties
        self.root.title("Handwritten Digit Recognizer")
        self.root.geometry("500x650")
        self.root.resizable(True, True)

        # Initialize drawing canvas
        self.drawing_canvas = DrawingCanvas(400, 400)

        # Initialize tracking variables
        self.last_x = None
        self.last_y = None
        self.current_prediction = None

        # Create UI elements and bind events
        self._create_widgets()
        self._bind_events()

    def _create_widgets(self):
        """
        Create and layout all GUI widgets.

        Creates title label, drawing canvas, result label, and buttons.
        """
        # Title label
        title_label = tk.Label(
            self.root,
            text="Handwritten Digit Recognizer",
            font=("Arial", 16, "bold")
        )
        title_label.pack(pady=10)

        # Drawing canvas
        self.canvas = tk.Canvas(
            self.root,
            width=400,
            height=400,
            bg='white',
            cursor='cross'
        )
        self.canvas.pack(pady=10)

        # Result label
        self.result_label = tk.Label(
            self.root,
            text="Predicted: -",
            font=("Arial", 24, "bold"),
            fg='blue'
        )
        self.result_label.pack(pady=10)

        # Button frame
        button_frame = tk.Frame(self.root)
        button_frame.pack(pady=10)

        # Predict button
        predict_button = tk.Button(
            button_frame,
            text="Predict",
            width=15,
            height=2,
            command=self.on_predict
        )
        predict_button.pack(side=tk.LEFT, padx=5)

        # Clear button
        clear_button = tk.Button(
            button_frame,
            text="Clear",
            width=15,
            height=2,
            command=self.on_clear
        )
        clear_button.pack(side=tk.LEFT, padx=5)

    def _bind_events(self):
        """
        Bind mouse events to canvas.

        Binds mouse down, drag, and release events for drawing.
        """
        self.canvas.bind("<Button-1>", self._on_mouse_down)
        self.canvas.bind("<B1-Motion>", self._on_mouse_move)
        self.canvas.bind("<ButtonRelease-1>", self._on_mouse_up)

    def _on_mouse_down(self, event):
        """
        Handle mouse down event on canvas.

        Arguments:
            event: Tkinter event object with x and y coordinates
        """
        self.last_x = event.x
        self.last_y = event.y

    def _on_mouse_move(self, event):
        """
        Handle mouse move event on canvas.

        Draws a line from the last mouse position to the current position
        on both the Tkinter canvas (for display) and the internal drawing
        canvas (for prediction processing).

        Arguments:
            event: Tkinter event object with x and y coordinates
        """
        if self.last_x is not None and self.last_y is not None:
            # Draw on Tkinter canvas for display
            self.canvas.create_line(
                self.last_x, self.last_y,
                event.x, event.y,
                fill='black',
                width=3
            )

            # Draw on internal canvas for prediction
            self.drawing_canvas.draw_line(
                self.last_x, self.last_y,
                event.x, event.y,
                brush_width=3
            )

            # Update last position
            self.last_x = event.x
            self.last_y = event.y

    def _on_mouse_up(self, event):
        """
        Handle mouse up event on canvas.

        Arguments:
            event: Tkinter event object (unused)
        """
        self.last_x = None
        self.last_y = None

    def on_predict(self):
        """
        Make a prediction based on the current drawing.

        Converts the drawing to MNIST format and calls the recognizer.
        Updates the result label with the predicted digit.
        Shows appropriate error messages for empty canvas or other errors.
        """
        try:
            # Get pixel data from internal canvas
            canvas_data = self.drawing_canvas.get_pixel_data()

            # Make prediction
            prediction = make_prediction_from_canvas(self.recognizer, canvas_data)

            # Update result label
            self.current_prediction = prediction
            self.result_label.config(text=f"Predicted: {prediction}")

        except ValueError as e:
            # Handle empty canvas error
            messagebox.showwarning("Empty Canvas", "Please draw a digit first")

        except Exception as e:
            # Handle other errors
            messagebox.showerror("Prediction Error", f"Error: {str(e)}")

    def on_clear(self):
        """
        Clear the canvas and reset the prediction display.

        Removes all drawings from both the Tkinter canvas and the internal
        drawing canvas. Resets the prediction label to default.
        """
        # Delete all canvas drawings
        self.canvas.delete("all")

        # Clear internal drawing canvas
        self.drawing_canvas.clear()

        # Reset result label
        self.result_label.config(text="Predicted: -")

        # Reset current prediction
        self.current_prediction = None

    def run(self):
        """
        Start the Tkinter event loop.

        Blocks until the window is closed.
        """
        self.root.mainloop()
