from time import sleep
import httpx
import os
import base64

url = os.environ.get('WP_URL')
username = os.environ.get('WP_USERNAME')
password = os.environ.get('WP_PASSWORD')
secret = os.environ.get('WP_SECRET')

print(f'URL: {url}')
print(f'Username: {username}')
print(f'Password: {password}')
print(f'Secret: {secret}')

auth_header = base64.b64encode(f"{username}:{password}".encode("utf-8")).decode("utf-8")

client = httpx.Client()

# login to obtain the cookie

r = None

while True:
    sleep(1)

    try:
        r = httpx.post(
        url,
        params={'rest_route': '/wp/v2/posts'},
        json={
            'title': 'Is this what you are looking for?',
            'content': f'Congratulations challenger!\n\n\n{secret}',
            'status': 'private',
            },
          auth=(username, password),
        )
    except Exception as e:
        print(e)
        continue

    if r.status_code < 400:
        break

    print(r)

print(r)
print(r.json())