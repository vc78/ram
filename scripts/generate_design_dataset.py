import csv
import random

# This script generates a synthetic dataset for architectural design images.
# The output is written to ../data/design_dataset.csv relative to this script.
# Each row contains a prompt, category, style, location, and image_url placeholder.

categories = [
    "architectural",
    "structural",
    "plumbing",
    "electrical",
    "interior",
    "exterior",
]

styles = [
    "Modern Scandinavian",
    "Neo-classical",
    "Tropical Minimal",
    "Industrial Loft",
    "Contemporary",
    "Mediterranean",
]

locations = [
    "Mumbai",
    "New York",
    "London",
    "Sydney",
    "Dubai",
    "Tokyo",
]

# Use some of the public images as placeholders for the dataset
images_by_cat = {
    "architectural": [
        "/images/architectural-floor-plan-blueprint.jpg",
        "/images/modern-villa-project.jpg",
    ],
    "structural": [
        "/images/structural-engineering-simulation-3d.jpg",
        "/images/building-foundation-concrete-construction.jpg",
    ],
    "plumbing": [
        "/images/plumbing-system-diagram-water-supply-drainage-pipe.jpg",
        "/images/electrical-plumbing-hvac-installation.jpg",
    ],
    "electrical": [
        "/images/electrical-plumbing-hvac-installation.jpg",
        "/images/structural-engineering-simulation-3d.jpg",
    ],
    "interior": [
        "/images/interior-design-3d-walkthrough.jpg",
        "/images/modern-minimalist-design.jpg",
    ],
    "exterior": [
        "/images/modern-villa-project.jpg",
        "/images/garden-landscape-project.jpg",
    ],
}

# fallback pool if category not found
base_images = [img for sub in images_by_cat.values() for img in sub]

import os

# ensure output directory exists
output_dir = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(output_dir, exist_ok=True)
output_csv = os.path.join(output_dir, "design_dataset.csv")
output_jsonl = os.path.join(output_dir, "design_dataset.jsonl")


# write both CSV and JSONL
with open(output_csv, "w", newline="", encoding="utf-8") as csvfile, open(output_jsonl, "w", encoding="utf-8") as jsonlfile:
    writer = csv.writer(csvfile)
    writer.writerow(["prompt", "category", "style", "location", "image_url"])

    for i in range(100):
        category = random.choice(categories)
        style = random.choice(styles)
        location = random.choice(locations)
        # simple prompt template
        prompt = (
            f"photorealistic {category} design {style} style for a {location} project, "
            "high detail, professional rendering"
        )
        image_url = random.choice(images_by_cat.get(category, base_images))
        writer.writerow([prompt, category, style, location, image_url])
        row = {"prompt": prompt, "category": category, "style": style, "location": location, "image_url": image_url}
        jsonlfile.write(f"{row}\n")

print(f"Generated dataset with 100 entries at {output_csv} and {output_jsonl}")