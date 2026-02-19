#!/usr/bin/env python
"""Login Analytics Dashboard Generator"""
import sqlite3
from datetime import datetime

def generate_dashboard():
    conn = sqlite3.connect('test.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get statistics
    cursor.execute("SELECT COUNT(*) as total FROM login_logs")
    total = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(*) as active FROM login_logs WHERE status = 'active'")
    active = cursor.fetchone()['active']
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) as cnt FROM login_logs")
    unique = cursor.fetchone()['cnt']
    
    cursor.execute("SELECT COUNT(*) as failed FROM failed_login_attempts")
    failed = cursor.fetchone()['failed']
    
    success_rate = (total / (total + failed) * 100) if (total + failed) > 0 else 0
    
    # Get user data
    cursor.execute("""
        SELECT user_id, username, email, COUNT(*) as logins, MAX(login_time) as last
        FROM login_logs
        GROUP BY user_id
        ORDER BY logins DESC
    """)
    users = cursor.fetchall()
    
    # Get devices
    cursor.execute("""
        SELECT 
            CASE
                WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
                WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
                WHEN user_agent LIKE '%Safari%' THEN 'Safari'
                ELSE 'Other'
            END as browser,
            COUNT(*) as count
        FROM login_logs
        GROUP BY browser
        ORDER BY count DESC
    """)
    devices = cursor.fetchall()
    
    # Generate HTML
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Login Analytics Dashboard</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #333; margin: 20px 0; text-align: center; }}
        .stats-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }}
        .stat-card {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }}
        .stat-card h3 {{ color: #666; font-size: 14px; margin-bottom: 10px; }}
        .stat-card .value {{ font-size: 32px; font-weight: bold; color: #007bff; }}
        table {{ width: 100%; border-collapse: collapse; background: white; margin: 20px 0; border-radius: 8px; overflow: hidden; }}
        th {{ background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #dee2e6; }}
        td {{ padding: 12px; border-bottom: 1px solid #dee2e6; }}
        tr:hover {{ background: #f5f5f5; }}
        .section {{ margin: 30px 0; }}
        .section h2 {{ color: #333; margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #007bff; }}
        .timestamp {{ text-align: center; color: #999; font-size: 12px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Login Analytics Dashboard</h1>
        <p class="timestamp">Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Logins</h3>
                <div class="value">{total}</div>
            </div>
            <div class="stat-card">
                <h3>Active Sessions</h3>
                <div class="value">{active}</div>
            </div>
            <div class="stat-card">
                <h3>Unique Users</h3>
                <div class="value">{unique}</div>
            </div>
            <div class="stat-card">
                <h3>Success Rate</h3>
                <div class="value">{success_rate:.1f}%</div>
            </div>
        </div>
        
        <div class="section">
            <h2>👥 User Activity</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Total Logins</th>
                        <th>Last Login</th>
                    </tr>
                </thead>
                <tbody>
"""
    
    for user in users:
        html += f"""
                    <tr>
                        <td><strong>{user['username']}</strong></td>
                        <td>{user['email']}</td>
                        <td>{user['logins']}</td>
                        <td>{user['last']}</td>
                    </tr>
"""
    
    html += """
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>🔧 Browser Usage</h2>
            <table>
                <thead>
                    <tr>
                        <th>Browser</th>
                        <th>Usage Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
"""
    
    for device in devices:
        pct = (device['count'] / total * 100) if total > 0 else 0
        html += f"""
                    <tr>
                        <td>{device['browser']}</td>
                        <td>{device['count']}</td>
                        <td>{pct:.1f}%</td>
                    </tr>
"""
    
    html += """
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>⚠️ Failed Logins</h2>
            <p><strong>Total Failed Attempts: {}</strong></p>
        </div>
        
        <p class="timestamp">Status: ✓ System Operational | Last Update: {}</p>
    </div>
</body>
</html>
""".format(failed, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    conn.close()
    return html

if __name__ == "__main__":
    html = generate_dashboard()
    with open('login_analytics_dashboard.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("✓ Dashboard generated: login_analytics_dashboard.html")
