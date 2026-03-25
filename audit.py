import os
import re
from pathlib import Path

root_dir = r"c:\Users\B VENKAT CHOWDARY\Downloads\arjunmain12 (3)"

def run_audit():
    all_files = []
    # Collect all ts/tsx files
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in root or '.next' in root or '.git' in root or '.dist' in root:
            continue
        for f in files:
            if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
                all_files.append(os.path.join(root, f))
    
    # Extract imports
    imported_paths = set()
    dummy_files = []
    
    import_pattern = re.compile(r'import(?:[\s\S]*?)from\s+[\'"]([^\'"]+)[\'"]')
    dynamic_import_pattern = re.compile(r'import\([\'"]([^\'"]+)[\'"]\)')
    require_pattern = re.compile(r'require\([\'"]([^\'"]+)[\'"]\)')
    dummy_pattern = re.compile(r'Math\.random\(\)|dummy|placeholder|mock|toFixed', re.IGNORECASE)
    
    for file in all_files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for dummy ML logic
                if 'export async function POST' in content or 'export async function GET' in content or 'api/' in file.replace('\\', '/'):
                    if dummy_pattern.search(content):
                        dummy_files.append(file)
                
                # Extract imports
                for match in import_pattern.findall(content):
                    imported_paths.add(match)
                for match in dynamic_import_pattern.findall(content):
                    imported_paths.add(match)
                for match in require_pattern.findall(content):
                    imported_paths.add(match)
        except Exception as e:
            pass

    # Normalize extracted paths to figure out what files they point to
    # This is a basic approximation for Next.js resolution
    resolved_imports = set()
    for imp in imported_paths:
        if imp.startswith('.') or imp.startswith('@/'):
            # It's a local import
            # We won't fully resolve, but we can just use basenames for a fuzzy check
            basename = imp.split('/')[-1]
            resolved_imports.add(basename)

    unused_files = []
    next_js_special = ['page', 'layout', 'route', 'loading', 'error', 'not-found', 'middleware']
    
    for file in all_files:
        base = Path(file).stem
        if base in next_js_special:
            continue
        
        # very simple fuzzy check
        if base not in resolved_imports and base != 'next.config':
            # Maybe it's unused component or lib
            unused_files.append(file)

    print("=== POTENTIAL UNUSED FILES ===")
    for u in unused_files[:50]:
        print(u)
        
    print("\n=== DUMMY API/ML ROUTES ===")
    for d in dummy_files:
        print(d)

if __name__ == "__main__":
    run_audit()
