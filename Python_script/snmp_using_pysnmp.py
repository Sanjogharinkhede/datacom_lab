
from pysnmp.hlapi import getCmd, SnmpEngine, CommunityData, UdpTransportTarget, ContextData, ObjectType, ObjectIdentity

iterator = getCmd(
    SnmpEngine(),
    CommunityData('public', mpModel=1),  # SNMPv2c
    UdpTransportTarget(('172.20.0.20', 161), timeout=5.0, retries=2),  # Added timeout and retries
    ContextData(),
    ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysDescr', 0))
)

try:
    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)
except Exception as e:
    print(f"Failed to execute SNMP request: {e}")
    exit(1)

if errorIndication:
    print(f"Error: {errorIndication}")
elif errorStatus:
    error_at = varBinds[int(errorIndex) - 1] if errorIndex > 0 else "unknown"
    print(f"Agent Error: {errorStatus.prettyPrint()} at {error_at}")
else:
    for varBind in varBinds:
        print(f"{varBind[0]} = {varBind[1]}")


'''
    IMP Note:
    NOT work as intended due to library issues 
'''
