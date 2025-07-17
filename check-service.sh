#!/bin/bash
# Pi Info Dashboard Service Status Check

SERVICE_NAME="pi-info-dashboard"

echo "🍓 Pi Info Dashboard Service Status"
echo "==================================="

# Check if service is installed
if ! systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
    echo "❌ Service is not installed"
    echo "   Run './install-service.sh' to install the service"
    exit 1
fi

# Show service status
echo "📊 Service Status:"
sudo systemctl status "$SERVICE_NAME" --no-pager -l

echo ""
echo "🔗 Service Details:"
echo "   • Service file: /etc/systemd/system/$SERVICE_NAME.service"
echo "   • Enabled: $(systemctl is-enabled $SERVICE_NAME 2>/dev/null || echo 'unknown')"
echo "   • Active: $(systemctl is-active $SERVICE_NAME 2>/dev/null || echo 'unknown')"

# Test if the web server is responding
echo ""
echo "🌐 Testing Web Server:"
if curl -s -f http://localhost:5000/api/health > /dev/null; then
    echo "   ✅ Dashboard is accessible at http://localhost:5000"
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    echo "   🌍 Network access: http://$LOCAL_IP:5000"
else
    echo "   ❌ Dashboard is not responding"
fi

echo ""
echo "📋 Quick Commands:"
echo "   • View logs:       sudo journalctl -u $SERVICE_NAME -f"
echo "   • Restart service: sudo systemctl restart $SERVICE_NAME"
echo "   • Stop service:    sudo systemctl stop $SERVICE_NAME"
echo "   • Start service:   sudo systemctl start $SERVICE_NAME"
