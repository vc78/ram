import os

base_dir = r"c:\Users\B VENKAT CHOWDARY\Downloads\arjunmain12 (3)"

folders = [
    "app/projects/create",
    "app/projects/[id]/inputs",
    "app/ai-design",
    "app/material-calculator",
    "app/timeline",
    "app/api/projects/create",
    "app/api/materials",
    "app/api/ai-design",
    "app/api/timeline",
    "components/project-form",
    "components/ai-layout",
    "components/material-estimator"
]

for folder in folders:
    os.makedirs(os.path.join(base_dir, folder), exist_ok=True)

print("Folders created!")
