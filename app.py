import os
import json

base_path = 'images'
output_file = os.path.join(base_path, 'generated_images.json')

data = {}

# Loop through topic folders like 'static', 'ripv2'
for topic in os.listdir(base_path):
    topic_path = os.path.join(base_path, topic)
    
    if not os.path.isdir(topic_path):
        continue  # Skip files like generated_images.json if present

    images = []
    for file in os.listdir(topic_path):
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            caption = os.path.splitext(file)[0].replace('_', ' ')
            images.append({"filename": file, "caption": caption})

    data[topic] = images

# Write JSON to file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Image data exported to {output_file}")
