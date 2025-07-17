#!/bin/bash
# Pi Info Dashboard Service Uninstallation Script

echo "🍓 Uninstalling Pi Info Dashboard Service"
echo "========================================"

SERVICE_NAME="pi-info-dashboard"

# Check if service exists
if ! systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
    echo "ℹ️  Service $SERVICE_NAME is not installed"
    exit 0
fi

echo "🛑 Stopping the service..."
sudo systemctl stop "$SERVICE_NAME"

echo "❌ Disabling service from startup..."
sudo systemctl disable "$SERVICE_NAME"

echo "🗑️  Removing service file..."
sudo rm -f "/etc/systemd/system/${SERVICE_NAME}.service"

echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "🧹 Resetting failed state (if any)..."
sudo systemctl reset-failed

echo ""
echo "✅ Service uninstalled successfully!"
echo "   The Pi Info Dashboard service will no longer start automatically on boot."
echo "   You can still run it manually using: python3 app.py"
