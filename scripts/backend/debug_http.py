import urllib.request, traceback

try:
    resp = urllib.request.urlopen('http://127.0.0.1:8001/api/v1/health', timeout=5)
    print(resp.status)
    print(resp.read().decode())
except Exception:
    traceback.print_exc()
