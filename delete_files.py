import os
import shutil

directories_to_remove = [
    r"app/dashboard/new-project",
    r"app/api/ml-project-estimation",
    r"app/api/generate-designs",
    r"app/dashboard/projects/[id]/designs"
]

for d in directories_to_remove:
    if os.path.exists(d):
        shutil.rmtree(d)
        print(f"Removed: {d}")
    else:
        print(f"Not found: {d}")
