# import os
# import json

# base_path = 'images'
# output_file = os.path.join(base_path, 'generated_images.json')

# data = {}

# # Loop through topic folders like 'static', 'ripv2'
# for topic in os.listdir(base_path):
#     topic_path = os.path.join(base_path, topic)
    
#     if not os.path.isdir(topic_path):
#         continue  # Skip files like generated_images.json if present

#     images = []
#     for file in os.listdir(topic_path):
#         if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
#             caption = os.path.splitext(file)[0].replace('_', ' ')
#             images.append({"filename": file, "caption": caption})

#     data[topic] = images

# # Write JSON to file
# with open(output_file, 'w', encoding='utf-8') as f:
#     json.dump(data, f, ensure_ascii=False, indent=4)

# print(f"Image data exported to {output_file}")


import os
import json

# Base directory where images are stored
BASE_PATH = 'images'
OUTPUT_FILE = os.path.join(BASE_PATH, 'generated_images.json')

def scan_images():
    data = {}

    # Scan primary folders (e.g., nms, datacom)
    for category in os.listdir(BASE_PATH):
        category_path = os.path.join(BASE_PATH, category)

        # Ensure it's a directory (ignore files like generated_images.json)
        if not os.path.isdir(category_path):
            continue

        # Create an entry for each category (nms/datacom)
        data[category] = {}

        # Scan subfolders for topics
        for topic in os.listdir(category_path):
            topic_path = os.path.join(category_path, topic)

            # Ensure it's a valid directory
            if not os.path.isdir(topic_path):
                continue

            # Gather images from each topic folder
            images = [
                {
                    "filename": file,
                    "caption": os.path.splitext(file)[0].replace('_', ' ')
                }
                for file in os.listdir(topic_path)
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))
            ]

            # Only store non-empty topics
            if images:
                data[category][topic] = images

    return data

def save_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f" Image data exported to {output_file}")

if __name__ == "__main__":
    image_data = scan_images()
    save_json(image_data, OUTPUT_FILE)
