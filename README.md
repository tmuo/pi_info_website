# 🍓 Raspberry Pi Info Website

A beautiful, real-time dashboard for monitoring your Raspberry Pi's system resources. This web application provides live updates on CPU usage, memory consumption, temperature, storage, and network statistics with a modern, responsive interface.

![Raspberry Pi Dashboard](https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=Raspberry%20Pi&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## ✨ Features

- **Real-time Monitoring**: Live updates every 5 seconds
- **System Overview**: Hostname, uptime, CPU cores, and architecture
- **CPU Monitoring**: Usage percentage and frequency
- **Memory Tracking**: RAM usage with detailed breakdown
- **Temperature Monitoring**: CPU temperature with status indicators
- **Storage Information**: Disk usage and available space
- **Network Statistics**: Bytes and packets sent/received
- **Performance History**: Interactive charts showing trends over time
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Raspberry Pi (any model)
- Python 3.6 or higher
- Internet connection for CDN resources

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tmuo/pi_info_website.git
   cd pi_info_website
   ```

2. **Install dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python3 app.py
   ```

4. **Access the dashboard**
   - Local: http://localhost:5000
   - Network: http://[your-pi-ip]:5000

## 📋 System Requirements

- **Operating System**: Raspberry Pi OS (Raspbian) or any Linux distribution
- **Python**: 3.6+
- **Memory**: 50MB RAM minimum
- **Storage**: 10MB free space
- **Network**: Optional (for remote access)

## 🛠️ Configuration

### Port Configuration
To change the default port (5000), modify the `app.py` file:
```python
app.run(host='0.0.0.0', port=YOUR_PORT, debug=True)
```

### Update Interval
To change the update frequency, modify `static/js/dashboard.js`:
```javascript
this.updateInterval = 5000; // milliseconds (5 seconds)
```

### Security
For production use, consider:
- Setting `debug=False` in `app.py`
- Using a proper WSGI server (gunicorn, uWSGI)
- Adding authentication if needed
- Configuring firewall rules

## 📱 Mobile Access

The dashboard is fully responsive and works great on mobile devices. Simply navigate to your Pi's IP address from any device on the same network.

## 🎨 Customization

### Themes
The dashboard uses CSS custom properties (variables) for easy theming. Modify the `:root` section in `static/css/style.css`:

```css
:root {
    --primary-color: #e74c3c;
    --secondary-color: #2c3e50;
    --success-color: #27ae60;
    /* ... other variables */
}
```

### Adding New Metrics
1. Extend the `get_system_info()` function in `app.py`
2. Add corresponding HTML elements in `templates/index.html`
3. Update the JavaScript in `static/js/dashboard.js`

## 🔧 API Endpoints

- `GET /` - Main dashboard page
- `GET /api/system` - System information JSON
- `GET /api/health` - Health check endpoint

### API Response Example
```json
{
    "cpu": {
        "usage_percent": 15.2,
        "count": 4,
        "frequency_mhz": 1500
    },
    "memory": {
        "total_gb": 4.0,
        "used_gb": 1.2,
        "percent": 30.0
    },
    "temperature": {
        "celsius": 45.1,
        "fahrenheit": 113.2
    },
    "storage": {
        "total_gb": 32.0,
        "used_gb": 8.5,
        "percent": 26.6
    },
    "uptime": {
        "hours": 72.3,
        "days": 3
    },
    "network": {
        "bytes_sent": 1048576,
        "bytes_recv": 2097152
    },
    "timestamp": "2025-07-17T10:30:00"
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Permission denied when reading temperature**
```bash
sudo chmod 644 /sys/class/thermal/thermal_zone0/temp
```

**2. Port already in use**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**3. Module not found errors**
```bash
pip3 install --upgrade -r requirements.txt
```

**4. Dashboard not updating**
- Check browser console for JavaScript errors
- Verify API endpoint is accessible: `curl http://localhost:5000/api/system`
- Check network connectivity

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [psutil](https://psutil.readthedocs.io/) for system monitoring
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Font Awesome](https://fontawesome.com/) for icons

## 📊 Performance Impact

The dashboard is designed to be lightweight:
- CPU impact: < 1% on average
- Memory usage: ~50MB
- Network traffic: ~1KB per update cycle
- Storage: Minimal logging

## 🔮 Future Features

- [ ] Historical data storage
- [ ] Email/SMS alerts for critical thresholds
- [ ] Multi-Pi support
- [ ] Custom dashboard layouts
- [ ] Dark mode theme
- [ ] Export data functionality
- [ ] Docker container support

---

Made with ❤️ for the Raspberry Pi community
