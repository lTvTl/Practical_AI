import pytest
import numpy as np
from digit_recognition import DigitRecognizer


class TestDigitRecognizer:

    def test_initializes_recognizer(self):
        recognizer = DigitRecognizer()
        assert recognizer is not None

    def test_loads_mnist_training_data(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')

        assert X_train is not None
        assert y_train is not None
        assert len(X_train) > 0
        assert len(y_train) > 0
        assert X_train.shape[0] == y_train.shape[0]

    def test_loads_mnist_test_data(self):
        recognizer = DigitRecognizer()
        X_test, y_test = recognizer.load_mnist_data(split='test')

        assert X_test is not None
        assert y_test is not None
        assert len(X_test) > 0
        assert len(y_test) > 0

    def test_trains_model(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)

        assert recognizer.model is not None

    def test_predicts_single_digit(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)

        single_digit = X_train[0].reshape(1, -1)
        prediction = recognizer.predict(single_digit)

        assert prediction is not None
        assert 0 <= prediction[0] <= 9
        assert isinstance(prediction[0], (int, np.integer))

    def test_predicts_multiple_digits(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        recognizer.train(X_train, y_train)

        multiple_digits = X_train[:5]
        predictions = recognizer.predict(multiple_digits)

        assert len(predictions) == 5
        assert all(0 <= p <= 9 for p in predictions)

    def test_model_achieves_acceptable_accuracy(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')
        X_test, y_test = recognizer.load_mnist_data(split='test')

        recognizer.train(X_train, y_train)
        accuracy = recognizer.evaluate(X_test, y_test)

        assert accuracy >= 0.85

    def test_handles_normalized_pixel_values(self):
        recognizer = DigitRecognizer()
        X_train, y_train = recognizer.load_mnist_data(split='train')

        assert np.max(X_train) <= 1.0
        assert np.min(X_train) >= 0.0
