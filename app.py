import os
import json

# Base paths constants
BASE_PATH = 'images'
OUTPUT_FILE = os.path.join(BASE_PATH, 'generated_images.json')
PY_PATH = 'Python_script'
PY_OUTPUT = 'my_py.json' 

# scan and generate a dict/json
def scan_images():
    data = {}

    # Scan primary folders 
    for category in os.listdir(BASE_PATH):
        # Add to base path with primary folder
        category_path = os.path.join(BASE_PATH, category)

        # Ensure it's a directory and ignore any other png or json
        if not os.path.isdir(category_path):
            continue

       
        data[category] = {}

        # Scan subfolders inside primary folder dir like nms etc
        for topic in os.listdir(category_path):
            # Each topic in folder nms  or datacom
            topic_path = os.path.join(category_path, topic)

            if not os.path.isdir(topic_path):
                continue

            # Gather images from each folder like from ospf, dual stack
            images = [
                {
                    "filename": file,
                    "caption": os.path.splitext(file)[0].replace('_', ' ')
                }
                for file in os.listdir(topic_path)
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))
            ]

            # if there are image then add to topic on json
            if images:
                data[category][topic] = images
    # print(data)
    return data

# create a pretty json file 
def save_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f" Image data exported to {output_file}")

def scan_scripts():
    scripts = [
        file for file in os.listdir(PY_PATH)
        if file.lower().endswith('.py')
    ]
    return scripts

# on executing
if __name__ == "__main__":
    image_data = scan_images()
    save_json(image_data, OUTPUT_FILE)
    
    py_data = scan_scripts()
    save_json(py_data, PY_OUTPUT)
