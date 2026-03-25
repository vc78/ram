import os
import shutil

# Files to remove
files_to_remove = [
    r"public/images/ext.mp4",
    r"public/images/int.mp4",
    r"pnpm-lock.yaml"
]

# Directories to remove
dirs_to_remove = [
    "SIIDSTARC-main"
]

def cleanup():
    for f in files_to_remove:
        if os.path.exists(f):
            try:
                os.remove(f)
                print(f"Removed file: {f}")
            except Exception as e:
                print(f"Error removing file {f}: {e}")
        else:
            print(f"File not found: {f}")

    for d in dirs_to_remove:
        if os.path.exists(d):
            try:
                shutil.rmtree(d)
                print(f"Removed directory: {d}")
            except Exception as e:
                print(f"Error removing directory {d}: {e}")
        else:
            print(f"Directory not found: {d}")

if __name__ == '__main__':
    cleanup()
