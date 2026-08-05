import os
import boto3
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION_NAME')
)

BUCKET = os.getenv('AWS_STORAGE_BUCKET_NAME')

def upload_folder(local_folder, s3_prefix):
    for root, dirs, files in os.walk(local_folder):
        for file in files:
            local_path = os.path.join(root, file)
            # compute s3 key
            rel_path = os.path.relpath(local_path, local_folder)
            s3_key = f"{s3_prefix}/{rel_path}".replace("\\", "/")
            print(f"Uploading {local_path} to s3://{BUCKET}/{s3_key}")
            
            # Determine content type based on extension
            content_type = "image/jpeg"
            if file.endswith(".png"):
                content_type = "image/png"
            elif file.endswith(".svg"):
                content_type = "image/svg+xml"
            
            # We don't use ACL='public-read' directly if bucket enforces ObjectOwnership, 
            # but usually it's fine. We'll skip ACL and just let bucket policies handle it if ACLs are disabled.
            # But the user set ACLs enabled.
            try:
                s3.upload_file(
                    local_path, 
                    BUCKET, 
                    s3_key,
                    ExtraArgs={'ContentType': content_type}
                )
            except Exception as e:
                print(f"Failed to upload {file}: {e}")

if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent
    scroll_frames = base_dir / "frontend" / "public" / "scroll-frames"
    images = base_dir / "frontend" / "public" / "images"
    
    if scroll_frames.exists():
        print("Uploading scroll-frames...")
        upload_folder(str(scroll_frames), "scroll-frames")
    
    if images.exists():
        print("Uploading images...")
        upload_folder(str(images), "images")
    
    print("Upload complete!")
