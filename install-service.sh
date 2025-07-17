#!/bin/bash
# Pi Info Dashboard Service Installation Script

echo "🍓 Installing Pi Info Dashboard Service"
echo "======================================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root/sudo"
    echo "   The script will ask for sudo when needed"
    exit 1
fi

# Get the current directory (should be the project directory)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_NAME="pi-info-dashboard"
SERVICE_FILE="${PROJECT_DIR}/${SERVICE_NAME}.service"

echo "📁 Project directory: $PROJECT_DIR"
echo "📋 Service file: $SERVICE_FILE"

# Check if service file exists
if [ ! -f "$SERVICE_FILE" ]; then
    echo "❌ Service file not found: $SERVICE_FILE"
    exit 1
fi

# Update the service file with the correct user and paths
echo "🔧 Updating service file with current user and paths..."
CURRENT_USER=$(whoami)
TEMP_SERVICE="/tmp/${SERVICE_NAME}.service"

# Create a temporary service file with the correct paths
sed "s|User=teemu|User=$CURRENT_USER|g; s|Group=teemu|Group=$CURRENT_USER|g; s|/home/teemu/Documents/pi_info_website|$PROJECT_DIR|g" "$SERVICE_FILE" > "$TEMP_SERVICE"

echo "📋 Service configuration:"
echo "   User: $CURRENT_USER"
echo "   Working Directory: $PROJECT_DIR"
echo "   Python Virtual Environment: $PROJECT_DIR/.venv/bin/python"

# Copy service file to systemd directory
echo "📦 Installing service file..."
sudo cp "$TEMP_SERVICE" "/etc/systemd/system/${SERVICE_NAME}.service"

# Clean up temp file
rm "$TEMP_SERVICE"

# Reload systemd daemon
echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable the service to start on boot
echo "✅ Enabling service to start on boot..."
sudo systemctl enable "$SERVICE_NAME"

# Start the service now
echo "🚀 Starting the service..."
sudo systemctl start "$SERVICE_NAME"

# Wait a moment for the service to start
sleep 3

# Check service status
echo ""
echo "📊 Service Status:"
sudo systemctl status "$SERVICE_NAME" --no-pager -l

echo ""
echo "✅ Installation completed!"
echo ""
echo "🎯 Service Management Commands:"
echo "   • Check status:    sudo systemctl status $SERVICE_NAME"
echo "   • Start service:   sudo systemctl start $SERVICE_NAME"
echo "   • Stop service:    sudo systemctl stop $SERVICE_NAME"
echo "   • Restart service: sudo systemctl restart $SERVICE_NAME"
echo "   • View logs:       sudo journalctl -u $SERVICE_NAME -f"
echo "   • Disable startup: sudo systemctl disable $SERVICE_NAME"
echo ""
echo "🌐 Your dashboard should now be available at:"
echo "   • http://localhost:5000"
echo "   • http://$(hostname -I | awk '{print $1}'):5000"
echo ""
echo "🔄 The service will automatically start on every reboot!"
