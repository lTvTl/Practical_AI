"""
Example usage of the handwritten digit recognition system.

This script demonstrates how to use the DigitRecognizer class to:
1. Load training and test data
2. Train a model
3. Make predictions on new digits
4. Evaluate model accuracy
"""

import numpy as np
from digit_recognition import DigitRecognizer


def main():
    """Run example digit recognition workflow."""
    print("Handwritten Digit Recognition Example")
    print("=" * 50)

    recognizer = DigitRecognizer()

    print("\n1. Loading training data...")
    X_train, y_train = recognizer.load_mnist_data(split='train')
    print(f"   Loaded {len(X_train)} training samples")
    print(f"   Each sample has {X_train.shape[1]} features (8x8 pixel image)")

    print("\n2. Loading test data...")
    X_test, y_test = recognizer.load_mnist_data(split='test')
    print(f"   Loaded {len(X_test)} test samples")

    print("\n3. Training the model...")
    recognizer.train(X_train, y_train)
    print("   Model training complete!")

    print("\n4. Making predictions on test samples...")
    predictions = recognizer.predict(X_test[:5])
    print(f"   First 5 predictions: {predictions}")
    print(f"   First 5 actual labels: {y_test[:5]}")

    print("\n5. Evaluating model accuracy...")
    accuracy = recognizer.evaluate(X_test, y_test)
    print(f"   Accuracy: {accuracy:.2%}")

    print("\n6. Predicting individual digits...")
    for i in range(3):
        single_image = X_test[i].reshape(1, -1)
        prediction = recognizer.predict(single_image)[0]
        actual = y_test[i]
        match = "OK" if prediction == actual else "WRONG"
        print(f"   Sample {i + 1}: Predicted {prediction}, Actual {actual} [{match}]")

    print("\n" + "=" * 50)
    print("Example complete!")


if __name__ == "__main__":
    main()
