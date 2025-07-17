#!/usr/bin/env python3
"""
Raspberry Pi Info Website Server
Real-time system monitoring dashboard for Raspberry Pi
"""

from flask import Flask, render_template, jsonify
import psutil
import subprocess
import json
from datetime import datetime
import os
import platform

app = Flask(__name__)

def get_cpu_temperature():
    """Get CPU temperature from Raspberry Pi thermal zone"""
    try:
        # Try to read from thermal zone (standard on Raspberry Pi)
        with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
            temp_millidegrees = int(f.read().strip())
            return temp_millidegrees / 1000.0
    except (FileNotFoundError, ValueError, PermissionError):
        try:
            # Fallback: try vcgencmd (if available)
            result = subprocess.run(['vcgencmd', 'measure_temp'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                # Output format: temp=47.1'C
                temp_str = result.stdout.strip()
                temp_value = temp_str.split('=')[1].split("'")[0]
                return float(temp_value)
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError, 
                FileNotFoundError, ValueError, IndexError):
            pass
        
        # If all else fails, return a default value
        return 35.0

def get_system_info():
    """Get comprehensive system information"""
    try:
        # CPU Usage
        cpu_usage = psutil.cpu_percent(interval=1)
        cpu_count = psutil.cpu_count()
        cpu_freq = psutil.cpu_freq()
        
        # Memory Usage
        memory = psutil.virtual_memory()
        
        # Temperature
        temperature = get_cpu_temperature()
        
        # Storage Usage
        disk = psutil.disk_usage('/')
        
        # System uptime
        boot_time = psutil.boot_time()
        uptime_seconds = datetime.now().timestamp() - boot_time
        
        # Network stats
        network = psutil.net_io_counters()
        
        # System info
        system_info = {
            'hostname': platform.node(),
            'system': platform.system(),
            'release': platform.release(),
            'machine': platform.machine(),
            'processor': platform.processor()
        }
        
        return {
            'cpu': {
                'usage_percent': round(cpu_usage, 1),
                'count': cpu_count,
                'frequency_mhz': round(cpu_freq.current, 0) if cpu_freq else 0
            },
            'memory': {
                'total_gb': round(memory.total / (1024**3), 2),
                'available_gb': round(memory.available / (1024**3), 2),
                'used_gb': round(memory.used / (1024**3), 2),
                'percent': round(memory.percent, 1)
            },
            'temperature': {
                'celsius': round(temperature, 1),
                'fahrenheit': round((temperature * 9/5) + 32, 1)
            },
            'storage': {
                'total_gb': round(disk.total / (1024**3), 1),
                'used_gb': round(disk.used / (1024**3), 1),
                'free_gb': round(disk.free / (1024**3), 1),
                'percent': round((disk.used / disk.total) * 100, 1)
            },
            'uptime': {
                'seconds': int(uptime_seconds),
                'hours': round(uptime_seconds / 3600, 1),
                'days': int(uptime_seconds // 86400)
            },
            'network': {
                'bytes_sent': network.bytes_sent,
                'bytes_recv': network.bytes_recv,
                'packets_sent': network.packets_sent,
                'packets_recv': network.packets_recv
            },
            'system': system_info,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error getting system info: {e}")
        return {
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

@app.route('/')
def index():
    """Serve the main dashboard page"""
    return render_template('index.html')

@app.route('/api/system')
def api_system():
    """API endpoint for system information"""
    return jsonify(get_system_info())

@app.route('/api/health')
def api_health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Check if running as a service or interactively
    is_service = os.environ.get('INVOCATION_ID') is not None or \
                os.environ.get('JOURNAL_STREAM') is not None
    
    if not is_service:
        # Interactive mode - show startup messages
        print("🍓 Raspberry Pi Info Website")
        print("=" * 40)
        print("Starting server...")
        print("Access dashboard at: http://localhost:5000")
        print("API endpoint at: http://localhost:5000/api/system")
        print("Press Ctrl+C to stop")
        print("=" * 40)
    
    # Disable debug mode when running as a service
    debug_mode = not is_service
    
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
