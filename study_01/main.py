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
