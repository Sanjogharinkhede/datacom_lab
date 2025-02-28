
from ncclient import manager
import xml.etree.ElementTree as ET
import xml.dom.minidom

def create_static_route(m):
    destination = input("Enter Destination IPv4 subnet: ")
    next_hop = input("Enter Next hop address: ")

    static_route_temp = f"""
    <config>
      <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
        <ip>
          <route>
            <ip-route-interface-forwarding-list>
              <prefix>{destination}</prefix>
              <mask>255.255.255.0</mask>
              <fwd-list>
                <fwd>{next_hop}</fwd>
              </fwd-list>
            </ip-route-interface-forwarding-list>
          </route>
        </ip>
      </native>
    </config>
    """
    c = m.edit_config(target="running", config=static_route_temp)
    print(c)




def get_routing_table(m):
    routing_table_filter = """
    <filter xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <routing xmlns="urn:ietf:params:xml:ns:yang:ietf-routing">
        <routing-instance>
        <name>default</name>
        <ribs>
            <rib>
            <name>ipv4-unicast</name>
            <routes/>
            </rib>
        </ribs>
        </routing-instance>
    </routing>
    </filter>
    """


    response = m.get(filter=routing_table_filter)
    print(xml.dom.minidom.parseString(response.xml).toprettyxml())
    
    return response.xml



if __name__== "__main__":
    my_host="172.20.0.19"
    with manager.connect(host=my_host,
                        port=830,
                        username="sanjog",
                        password="123456",
                        hostkey_verify=False) as m:
        print("connected")
        # print(m.server_capabilities)
        # create_static_route(m)
        # print("Static route create")
        get_routing_table(m)