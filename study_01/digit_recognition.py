"""
Handwritten digit recognition using machine learning.

This module provides a DigitRecognizer class that uses sklearn
to train and make predictions on handwritten digits from the MNIST dataset.
"""

import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


class DigitRecognizer:
    """
    A machine learning classifier for recognizing handwritten digits (0-9).

    Uses the sklearn digits dataset (8x8 pixel images) and trains a
    Random Forest classifier for digit recognition.
    """

    def __init__(self):
        """Initialize the DigitRecognizer with no trained model."""
        self.model = None

    def load_mnist_data(self, split='train'):
        """
        Load handwritten digit data from sklearn's digits dataset.

        Arguments:
            split: Either 'train' or 'test'. Determines which subset to return.

        Returns:
            Tuple of (X, y) where X is feature array and y is label array.
            X has shape (num_samples, 64) representing 8x8 pixel images.
            y has shape (num_samples,) with values 0-9.
        """
        digits = load_digits()
        X = digits.data
        y = digits.target

        X = X / 16.0

        if split == 'train':
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.25, random_state=42
            )
            return X_train, y_train
        elif split == 'test':
            _, X_test, _, y_test = train_test_split(
                X, y, test_size=0.25, random_state=42
            )
            return X_test, y_test
        else:
            raise ValueError("split must be 'train' or 'test'")

    def train(self, X_train, y_train):
        """
        Train the digit recognition model.

        Arguments:
            X_train: Training feature array of shape (num_samples, 64).
            y_train: Training labels array of shape (num_samples,) with values 0-9.
        """
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_train, y_train)

    def predict(self, X):
        """
        Predict digit labels for given input images.

        Arguments:
            X: Feature array of shape (num_samples, 64) or (1, 64) for single image.

        Returns:
            Array of predicted digit labels (0-9).
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")

        predictions = self.model.predict(X)
        return predictions

    def evaluate(self, X_test, y_test):
        """
        Evaluate model accuracy on test data.

        Arguments:
            X_test: Test feature array of shape (num_samples, 64).
            y_test: Test labels array of shape (num_samples,).

        Returns:
            Accuracy score as a float between 0 and 1.
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")

        predictions = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        return accuracy
