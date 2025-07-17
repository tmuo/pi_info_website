#!/bin/bash
# Raspberry Pi Info Website Startup Script

echo "🍓 Starting Raspberry Pi Info Website..."
echo "================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check your internet connection."
        exit 1
    fi
fi

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 Starting the dashboard server..."
echo ""
echo "📱 Access your dashboard at:"
echo "   • Local:   http://localhost:5000"
echo "   • Network: http://$LOCAL_IP:5000"
echo ""
echo "💡 Press Ctrl+C to stop the server"
echo "================================="

# Start the Flask application
python3 app.py
