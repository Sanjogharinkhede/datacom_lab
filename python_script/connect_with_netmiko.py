from netmiko import ConnectHandler

from getpass import getpass

password = getpass()

# secret = getpass("Enter secret: ")
 
my_host="172.20.0.19"
username="sanjog"
password="123456"
 
 
routerConn = {
    "device_type": "cisco_ios",
    "host": my_host,
    "username": username,
    "password": password
}

net_connect = ConnectHandler(**routerConn)

print(net_connect.find_prompt())
 
# while True:

#     command = input("Enter command : ")

#     output = net_connect.send_command(command)

#     print(output)
 
 
net_connect.disconnect()

 
command_list = ["hostname vic", "do wr"]

net_connect.send_config_set(command_list)

 