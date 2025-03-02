from ncclient import manager
 
netconf_filter = """
<filter>
<native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
<hostname/>
</native>
</filter>
"""
with manager.connect(
        host="devnetsandboxiosxe.cisco.com",
        port=830,
        username="admin",
        password="C1sco12345",
        hostkey_verify=False
        ) as m:
 
    print("Sending a <get-config> operation to the device.\n")
    # Make a NETCONF <get-config> query using the filter
    netconf_reply = m.get_config(source = 'running', filter = netconf_filter)
    print(netconf_reply)
 
 
h = input("Give me new Hostname : ")
netconf_filter = f"""
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="101">
  <get-config>
    <source>
      <running/>
    </source>
    <filter>
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
        <interface>
          <name>loopback1</name>
          <description>loopback created with python oooooooooooooooooooooo</description>
          <type/>
          <enabled>true</enabled>
          <link-up-down-trap-enable>enabled</link-up-down-trap-enable>
          <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
            <address/>
            <address>
              <ip>90.90.90.90</ip>
            </address>
          </ipv4>
        </interface>
      </interfaces>
    </filter>
  </get-config>
</rpc>
"""
 
with manager.connect(
        host="devnetsandboxiosxe.cisco.com",
        port=830,
        username="admin",
        password="C1sco12345",
        hostkey_verify=False
        ) as m:
 
    print("Sending a <get-config> operation to the device.\n")
    # Make a NETCONF <get-config> query using the filter
    netconf_reply = m.edit_config(netconf_filter, target = 'running')
    print(netconf_reply)