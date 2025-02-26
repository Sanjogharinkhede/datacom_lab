import requests

url = "https://sandbox-sdwan-2.cisco.com:443/j_security_check"

payload = 'j_username=devnetuser&j_password=RG!_Yw919_83'
headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cookie': 'JSESSIONID=u0KJDbplUYFzXSRtcHujsHJusJqR_PZd8bSU5dtL.81ac6722-a226-4411-9d5d-45c0ca7d567b'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
