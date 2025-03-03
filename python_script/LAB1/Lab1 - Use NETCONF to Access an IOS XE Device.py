"""
    Creted By:Sanjog Harinkhede
    For : Milestone assessment 4
    Topic: Use Netconf to Access on IOS XE DEVICE (CSR 1000v)
"""

from ncclient import manager

def get_config_and_save(m, fileName):
    """
    Retrieves the running configuration from the device using NETCONF and saves it to a file.

    Parameters:
    m (ncclient.manager.Manager): The active NETCONF session manager.
    fileName (str): The name of the file where the configuration will be saved.

    Returns:
    None
    """
    c = m.get_config(source="running")
    with open(fileName, "w") as f:
        f.write(c.xml)
    print("Running configuration saved to", fileName)

def add_a_loopback(m):
    """
    Prompts the user to enter loopback interface details and adds it to the running configuration.

    Parameters:
    m (ncclient.manager.Manager): The active NETCONF session manager.

    Returns:
    None
    """
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces" xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">
            <interface>
                <name>{input("Enter loopback: ")}</name>
                <description>Loopback Added from Python by sanjog</description>
                <type>ianaift:softwareLoopback</type>
                <enabled>true</enabled>
                <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
                    <address>
                        <ip>{input("Loopback IPv4 address: ")}</ip>
                        <netmask>{input("Loopback IPv4 netmask: ")}</netmask>
                    </address>
                </ipv4>
            </interface>
        </interfaces>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("Loopback interface added")

def edit_a_loopback(m):
    """
    Prompts the user to enter loopback interface details and modifies the existing configuration.

    Parameters:
    m (ncclient.manager.Manager): The active NETCONF session manager.

    Returns:
    None
    """
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces" xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">
            <interface>
                <name>{input("Enter loopback: ")}</name>
                <description>Loopback Edited from Python by sanjog</description>
                <type>ianaift:softwareLoopback</type>
                <enabled>true</enabled>
                <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
                    <address>
                        <ip>{input("Loopback IPv4 address: ")}</ip>
                        <netmask>{input("Loopback IPv4 netmask: ")}</netmask>
                    </address>
                </ipv4>
            </interface>
        </interfaces>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("Loopback interface edited")

def change_hostname(m, hs):
    """
    Changes the device's hostname.

    Parameters:
    m (ncclient.manager.Manager): The active NETCONF session manager.
    hs (str): The new hostname to be set.

    Returns:
    None
    """
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
            <hostname>{hs}</hostname>
        </native>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("Hostname changed to", hs)

def create_username(m, username, privilege, password, isSecret):
    """
    Creates a new user account on the device.

    Parameters:
    m (ncclient.manager.Manager): The active NETCONF session manager.
    username (str): The new username to be created.
    privilege (int): User privilege level (e.g., 15 for admin access).
    password (str): The password or secret for the new user.
    isSecret (bool): Whether to store the password as a secret (encrypted).

    Returns:
    None
    """
    pas = f"""<password>
            <password>{password}</password>
          </password>
        """
    sec = f"""
    <secret>
        <secret>{password}</secret>
    </secret>
    """
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
      <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
        <username>
          <name>{username}</name>
          <privilege>{privilege}</privilege>
          {sec if isSecret else pas}
        </username>
      </native>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("User", username, "created")

my_host = "172.20.0.20"

if __name__ == "__main__":
    with manager.connect(
        host=my_host,
        port=830,
        username="sanjog",
        password="NMS@2025",
        hostkey_verify=False,
    ) as m:
        print("Connected to", my_host)
        for i in m.server_capabilities:
            print(i)

        while True:
            print("1. Get and Save Running Configuration")
            print("2. Add Loopback Interface")
            print("3. Edit Loopback Interface")
            print("4. Change Hostname")
            print("5. Create User")
            print("6. Exit")

            choice = input("Select an option: ")

            if choice == "1":
                get_config_and_save(m, "running_config.xml")
            elif choice == "2":
                add_a_loopback(m)
            elif choice == "3":
                edit_a_loopback(m)
            elif choice == "4":
                new_hostname = input("Enter new hostname: ")
                change_hostname(m, new_hostname)
            elif choice == "5":
                username = input("Enter username: ")
                privilege = input("Enter privilege level (e.g., 15): ")
                password = input("Enter password: ")
                is_secret = input("Use secret? (yes/no): ").lower() == "yes"
                create_username(m, username, privilege, password, is_secret)
            elif choice == "6":
                print("Exiting...")
                break
            else:
                print("Invalid option. Please try again.")
