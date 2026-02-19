import urllib.request, urllib.parse, json, traceback

BASE = 'http://127.0.0.1:3000/api/backend-proxy'

try:
    data = json.dumps({'email':'testuser@example.com','password':'Password123'}).encode()
    req = urllib.request.Request(f'{BASE}/auth/login', data=data, headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req, timeout=5) as r:
        login = json.load(r)
    print('login:', login)
    token = login.get('access_token')
    if not token:
        raise SystemExit('no token')
    req2 = urllib.request.Request(f'{BASE}/auth/me', headers={'Authorization': f'Bearer {token}'})
    with urllib.request.urlopen(req2, timeout=5) as r:
        me = json.load(r)
    print('me:', me)
except Exception:
    traceback.print_exc()
