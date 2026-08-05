import os
from pathlib import Path

base_dir = Path(__file__).resolve().parent / "frontend" / "src"

search_replace = [
    ("https://madhav-pharma-images.s3.ap-south-1.amazonaws.com/images/", "/images/"),
    ("https://madhav-pharma-images.s3.ap-south-1.amazonaws.com/scroll-frames/", "/scroll-frames/"),
]

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".jsx", ".js")):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for s, r in search_replace:
                new_content = new_content.replace(s, r)
                
            if new_content != content:
                print(f"Reverted {file_path}")
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
