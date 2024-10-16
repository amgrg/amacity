import os
import shutil
from datetime import datetime

# Root directory for the Amacity project
ROOT_DIR = r"C:\amacity"

# Downloads directory (adjust if your Downloads folder is in a different location)
DOWNLOADS_DIR = os.path.join(os.path.expanduser('~'), 'Downloads')

# Mapping of file types to directories
FILE_TYPES = {
    '.py': 'backend',
    '.html': 'backend\\templates',
    '.css': 'backend\\static\\css',
    '.js': 'backend\\static\\js',
    '.db': 'database',
    '.md': 'docs',
    '.txt': 'docs',
    '.json': 'api',
    # Add more file types and corresponding directories as needed
}

def move_file(file_path, destination):
    try:
        shutil.move(file_path, destination)
        print(f"Moved {os.path.basename(file_path)} to {destination}")
    except Exception as e:
        print(f"Error moving {os.path.basename(file_path)}: {str(e)}")

def organize_downloads():
    for filename in os.listdir(DOWNLOADS_DIR):
        file_path = os.path.join(DOWNLOADS_DIR, filename)
        if os.path.isfile(file_path):
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext in FILE_TYPES:
                destination_dir = os.path.join(ROOT_DIR, FILE_TYPES[file_ext])
                if not os.path.exists(destination_dir):
                    os.makedirs(destination_dir)
                destination_path = os.path.join(destination_dir, filename)
                move_file(file_path, destination_path)
            else:
                print(f"No defined location for {filename}. Skipping.")

def main():
    print("Amacity Download Organizer")
    print("This script will move files from your Downloads folder to the appropriate Amacity project directories.")
    input("Press Enter to continue...")
    
    organize_downloads()
    
    print("\nOrganization complete. Here's the current structure of your Amacity project:")
    for root, dirs, files in os.walk(ROOT_DIR):
        level = root.replace(ROOT_DIR, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{sub_indent}{f}")

if __name__ == "__main__":
    main()