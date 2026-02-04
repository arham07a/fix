import os
import time
import requests

CATBOX_API = "https://catbox.moe/user/api.php"
IMG_DIR = r"assist\Videos"   # FIXED PATH
OUTPUT_FILE = "link.txt"

EXTENSIONS = (
    '.png', '.jpg', '.jpeg', '.gif', '.webp',
    '.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'
)

def upload_file(filepath, retries=3):
    for attempt in range(retries):
        try:
            with open(filepath, 'rb') as f:
                r = requests.post(
                    CATBOX_API,
                    data={"reqtype": "fileupload"},
                    files={"fileToUpload": f},
                    timeout=180
                )
            return r.text.strip()
        except Exception:
            print(f"Retry {attempt+1}/{retries} failed...")
            time.sleep(5)

    return "FAILED"

def main():
    if not os.path.exists(IMG_DIR):
        print("Folder not found!")
        return

    with open(OUTPUT_FILE, "a", encoding="utf-8") as out:

        for file in os.listdir(IMG_DIR):
            if file.lower().endswith(EXTENSIONS):
                path = os.path.join(IMG_DIR, file)

                print(f"Uploading {file} ...")

                link = upload_file(path)

                print("→", link)

                if link != "FAILED":
                    out.write(f"{file} → {link}\n")

                time.sleep(2)

    print("\nDone!")

if __name__ == "__main__":
    main()
