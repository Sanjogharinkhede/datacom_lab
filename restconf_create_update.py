import requests
import json,time
from requests.auth import HTTPBasicAuth

base_url = "https://3a40-202-168-85-228.ngrok-free.app/restconf/proxy/https://192.168.100.2/restconf/data/ietf-interfaces:interfaces"

username = "admin"
password = "admin"

headers = {
    "Content-Type": "application/yang-data+json",
    "Accept": "application/yang-data+json"
}

def create_loopback_payload(loopback_name, ip_address, netmask="255.255.255.0"):
    return {
        "ietf-interfaces:interface": {
            "name": loopback_name,
            "description": "Added with Python script by Sanjog sorry for inconvenience",
            "type": "iana-if-type:softwareLoopback",
            "enabled": True,
            "ietf-ip:ipv4": {
                "address": [
                    {
                        "ip": ip_address,
                        "netmask": netmask
                    }
                ]
            }
        }
    }

def interface_exists(loopback_name):
    check_url = f"{base_url}/interface={loopback_name}"
    response = requests.get(check_url, headers=headers, auth=HTTPBasicAuth(username, password))
    return response.status_code == 200



def create_multiple():
    loopbacks = [
        {
            "name": f"Loopback{186 + i}",
            "ip": f"{i % 256}.27.27.{i % 256}"
        }
        for i in range(1, 101)
    ]
    for lb in loopbacks:
        payload = create_loopback_payload(lb["name"], lb["ip"])

        try:
            if interface_exists(lb["name"]):
                # If interface exists, update with PUT
                response = requests.put(f"{base_url}/interface={lb['name']}", headers=headers,
                                        auth=HTTPBasicAuth(username, password), data=json.dumps(payload))
                action = "Updating"
            else:
                # If not, create with POST
                response = requests.post(base_url, headers=headers,
                                         auth=HTTPBasicAuth(username, password), data=json.dumps(payload))
                action = "Creating"

            print(f"{action} {lb['name']} with IP {lb['ip']} - Status: {response.status_code}")
            print(response.text)

        except requests.RequestException as e:
            print(f"Error processing {lb['name']}: {e}")
        time.sleep(1.5)
    print(" All requests completed!")

def get_present_loopbacks():
    response = requests.get(base_url, headers=headers, auth=HTTPBasicAuth(username, password))
    if response.status_code == 200:
        interfaces = response.json().get("ietf-interfaces:interfaces", {}).get("interface", [])
        print(f"Found {len(interfaces)} interfaces.")
        return interfaces
    else:
        print("Failed to fetch interfaces.")
        print(response.text)
        return

def delete_present_interfaces():
    all_interfaces = get_present_loopbacks()
    for iface in all_interfaces:
        iface_name = iface.get("name")

        if "Loopback" in iface_name:

            del_response = requests.delete(f"{base_url}/interface={iface_name}", headers=headers, auth=HTTPBasicAuth(username, password))

            if del_response.status_code == 204:
                print(f"Deleted: {iface_name}")
            else:
                print(f"Failed to delete {iface_name}. Status: {del_response.status_code}")
                print(del_response.text)
            time.sleep(1)
print(get_present_loopbacks())
delete_present_interfaces()