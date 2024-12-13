import os
import glob
import json
import math

def main():
    log_path = find_logs()
    data = parse_logs(log_path)
    materials_data = data[2] # Entry relating to materials is always found on line 3 of the logs file
    raw_materials_owned = materials_data["Raw"]
    encoded_materials_owned = materials_data["Encoded"]
    manufactured_materials_owned = materials_data["Manufactured"]
    all_materials_owned = count_all_materials(raw_materials_owned, encoded_materials_owned, manufactured_materials_owned)
    edsy_data = get_needed_materials()
    all_materials_needed = format_materials(edsy_data['retrofits'][0]['materials'])
    result = compare(all_materials_owned, all_materials_needed)
    print(result)
    # Then we must translate result to its actual name. 


def compare(owned, needed):
    result = {}
    print("Owned")
    print(owned)
    print("Needed")
    print(needed)
    for material, count in needed.items():
        # if material not found in logs
        if material.lower() not in owned:
            print(f"You have 0 {material.lower()}")
            result[material] = count
        else:
            difference = needed[material] - owned[material.lower()]
            if difference > 0:
                # Tthis means something is missing
                result[material] = difference
            else:
                continue
    return result


def format_materials(dict):
    all_materials_needed = {}
    for key, value in dict.items():
        # Round the .5s to 1
        all_materials_needed[key] = math.ceil(value)

    return all_materials_needed


def count_all_materials(raw, encoded, manufactured):
    all_materials_owned = {}
    for material_type in [raw, encoded, manufactured]:
        for material in material_type:
            all_materials_owned[material["Name"]] = material["Count"]
    return all_materials_owned


def find_logs():
    # Find most recent log
    user_profile = os.environ.get("USERPROFILE")
    directory_path = os.path.join(user_profile, "Saved Games\Frontier Developments\Elite Dangerous")
    all_logs = glob.glob(directory_path+"/*.log")
    if all_logs:
        log_path = max(all_logs, key=os.path.getctime)
        return log_path
    else:
        print("Logs not found, tried to access: ", directory_path)


def get_needed_materials():
    try:
        with open("EDSY.txt", "r") as f:
            for line in f:
                data = json.loads(line)
                return data
    except FileNotFoundError:
        print("File not found")
        return None


def parse_logs(log_path):
    parsed_data = []
    try:
        with open(log_path, "r") as f:
            for line in f:
                try:
                    data = json.loads(line)
                    parsed_data.append(data)
                except json.JSONDecodeError:
                    print("Decode Error")
        return parsed_data
    except FileNotFoundError:
        print("File Not Found")
        return None


if __name__ == "__main__":
    main()