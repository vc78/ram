from app.main import health_check

try:
    out = health_check()
    print('OK', out)
except Exception as e:
    import traceback
    traceback.print_exc()
