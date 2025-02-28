from ncclient import manager


def get_config_and_save(m, fileName):
    c = m.get_config(source="running")
    # print(c.xml)
    with open(fileName, "w") as f:
        f.write(c.xml)
    print("created")


def add_a_loopback(m):
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces" xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">
            <interface>
                <name>{input("Enter loopback: ")}</name>
                <description>Loopback Added from python by sanjog</description>
                <type>ianaift:softwareLoopback</type>
                <enabled>true</enabled>
                <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
                    <address>
                        <ip>{input("Loopback Ipv4 address: ")}</ip>
                        <netmask>{input("Loopback Ipv4 netmask: ")}</netmask>
                    </address>
                </ipv4>
            </interface>
        </interfaces>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("Loopback added")


def edit_a_loopback(m):
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces" xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">
            <interface>
                <name>{input("Enter loopback: ")}</name>
                <description>Loopback Added from python by sanjog</description>
                <type>ianaift:softwareLoopback</type>
                <enabled>true</enabled>
                <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
                    <address>
                        <ip>{input("Loopback Ipv4 address: ")}</ip>
                        <netmask>{input("Loopback Ipv4 netmask: ")}</netmask>
                    </address>
                </ipv4>
            </interface>
        </interfaces>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("Loopback EDITED")


def change_hostname(m, hs):
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
            <hostname>{hs}</hostname>
        </native>
    </config>
    """
    c = m.edit_config(target="running", config=temp)
    print("Hostname changed")


def create_username(m, username, privilege, password, isSecret):
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
    print(c)


my_host = "172.20.0.19"

if __name__ == "__main__":
    with manager.connect(
        host=my_host,
        port=830,
        username="sanjog",
        password="123456",
        hostkey_verify=False,
    ) as m:
        print("connected")
        # # print(m.server_capabilities)
        # get_config_and_save(m,f"before_{my_host}.xml")
        # # add_a_loopback(m)
        # edit_a_loopback(m)
        # change_hostname(m,"san4")
        create_username(m, "san_user_no_sec", 15, 12345,False)
        create_username(m, "san_user_with_sec", 15, 12345,True)

        # get_config_and_save(m,f"after{my_host}.xml")
