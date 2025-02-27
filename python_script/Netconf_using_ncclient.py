from ncclient import manager

def  get_config_and_save(m,fileName):
    c = m.get_config(source='running')
    # print(c.xml)
    with open(fileName, 'w') as f:
        f.write(c.xml)
    print("created")


def add_a_loopback(m):
    temp = """
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces" xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">
            <interface>
                <name>Loopback1</name>
                <description>Loopback Added from python by sanjog</description>
                <type>ianaift:softwareLoopback</type>
                <enabled>true</enabled>
                <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
                    <address>
                        <ip>172.20.1.1</ip>
                        <netmask>255.255.255.0</netmask>
                    </address>
                </ipv4>
            </interface>
        </interfaces>
    </config>
    """
    c = m.edit_config(target='running', config=temp)
    print("Loopback added")
    
def edit_a_loopback(m):
    temp = """
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces" xmlns:ianaift="urn:ietf:params:xml:ns:yang:iana-if-type">
            <interface>
                <name>Loopback1</name>
                <description>Loopback updated  from python by sanjog</description>
                <type>ianaift:softwareLoopback</type>
                <enabled>true</enabled>
                <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
                    <address>
                        <ip>192.168.1.1</ip>
                        <netmask>255.255.255.0</netmask>
                    </address>
                </ipv4>
            </interface>
        </interfaces>
    </config>
    """
    c = m.edit_config(target='running', config=temp)
    print("Loopback EDITED")

def change_hostname(m, hs):
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
            <hostname>{hs}</hostname>
        </native>
    </config>
    """
    c = m.edit_config(target='running', config=temp)
    print("Hostname changed")
    
def create_username(m, us):
    temp = f"""
    <config xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
        <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
            <username>{us}</username>
        </native>
    </config>
    """
    c = m.edit_config(target='running', config=temp)
    print("Username added")

my_host="172.20.0.19"

if __name__== "__main__":
    with manager.connect(host=my_host,
                        port=830,
                        username="sanjog",
                        password="123456",
                        hostkey_verify=False) as m:
        print("connected")
        # print(m.server_capabilities)
        get_config_and_save(m,f"before_{my_host}.xml")
        # add_a_loopback(m)
        edit_a_loopback(m)
        change_hostname(m,"san4")
        create_username(m,"san_user")
        
        # get_config_and_save(m,f"after{my_host}.xml")
    