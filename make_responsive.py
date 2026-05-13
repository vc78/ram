import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def repl(match):
        class_str = match.group(1)
        # Check if already responsive (has sm, md, or lg grid-cols)
        if 'sm:grid-cols' in class_str or 'md:grid-cols' in class_str or 'lg:grid-cols' in class_str or 'xl:grid-cols' in class_str:
            return f'className="{class_str}"'
            
        new_class_str = class_str
        
        # Grid responsive replacements
        new_class_str = re.sub(r'(?<![a-z0-9:-])grid-cols-2\b', 'grid-cols-1 md:grid-cols-2', new_class_str)
        new_class_str = re.sub(r'(?<![a-z0-9:-])grid-cols-3\b', 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3', new_class_str)
        new_class_str = re.sub(r'(?<![a-z0-9:-])grid-cols-4\b', 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4', new_class_str)
        new_class_str = re.sub(r'(?<![a-z0-9:-])grid-cols-5\b', 'grid-cols-1 sm:grid-cols-3 md:grid-cols-5', new_class_str)
        new_class_str = re.sub(r'(?<![a-z0-9:-])grid-cols-6\b', 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6', new_class_str)
        
        # Flex responsive replacements
        if 'flex-row' in new_class_str and 'flex-col' not in new_class_str and 'md:flex-row' not in new_class_str and 'sm:flex-row' not in new_class_str:
            new_class_str = re.sub(r'(?<![a-z0-9:-])flex-row\b', 'flex-col md:flex-row', new_class_str)

        return f'className="{new_class_str}"'

    new_content = re.sub(r'className="([^"]+)"', repl, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('.'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.jsx'):
            process_file(os.path.join(root, file))

print("Done")
