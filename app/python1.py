# -------------------------------
# Fuzzy C-Means Clustering (FCM)
# Iris Dataset Implementation
# -------------------------------

# Step 1: Import libraries
import numpy as np
import matplotlib.pyplot as plt
import skfuzzy as fuzz
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler


# Step 2: Load dataset
iris = load_iris()
X = iris.data          # Features
y_true = iris.target   # Actual labels


# Step 3: Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


# Step 4: Take only first 2 features (for visualization)
X_2d = X_scaled[:, :2]

# Transpose for skfuzzy
data = X_2d.T


# Step 5: Apply Fuzzy C-Means
c = 3   # number of clusters

cntr, u, _, _, _, _, fpc = fuzz.cluster.cmeans(
    data,
    c=c,
    m=2,            # fuzziness
    error=0.005,
    maxiter=1000,
    init=None
)


# Step 6: Convert fuzzy memberships to hard labels
cluster_labels = np.argmax(u, axis=0)


# Step 7: Print outputs
print("Cluster Centers:\n", cntr)
print("\nFuzzy Partition Coefficient (FPC):", fpc)
print("\nFirst 10 Membership Values:\n", u[:, :10])


# -------------------------------
# Visualization
# -------------------------------

# Plot 1: Fuzzy Clusters
plt.figure()
plt.scatter(X_2d[:, 0], X_2d[:, 1], c=cluster_labels)
plt.scatter(cntr[:, 0], cntr[:, 1], marker='X', s=200, c='red')
plt.title("Fuzzy C-Means Clustering (Iris Dataset)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()


# Plot 2: True Classes
plt.figure()
plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y_true)
plt.title("Actual Iris Classes")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()


# Plot 3: Membership Strength
plt.figure()
plt.scatter(X_2d[:, 0], X_2d[:, 1],
            s=100 * np.max(u, axis=0))
plt.title("Membership Strength (Confidence)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()