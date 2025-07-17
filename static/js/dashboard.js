// Dashboard JavaScript for Real-time Updates
class PiDashboard {
    constructor() {
        this.updateInterval = 5000; // 5 seconds
        this.intervalId = null;
        this.chart = null;
        this.chartData = {
            cpu: [],
            memory: [],
            temperature: [],
            labels: []
        };
        this.maxDataPoints = 20;
        
        this.init();
    }
    
    init() {
        this.initChart();
        this.startUpdates();
        this.setupEventListeners();
    }
    
    initChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CPU Usage (%)',
                        data: [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Memory Usage (%)',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Temperature (°C)',
                        data: [],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                animation: {
                    duration: 300
                }
            }
        });
    }
    
    async fetchSystemData() {
        try {
            const response = await fetch('/api/system');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching system data:', error);
            this.updateConnectionStatus(false);
            return null;
        }
    }
    
    updateConnectionStatus(isConnected) {
        const statusDot = document.getElementById('statusDot');
        const lastUpdate = document.getElementById('lastUpdate');
        
        if (isConnected) {
            statusDot.className = 'status-dot';
            lastUpdate.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        } else {
            statusDot.className = 'status-dot offline';
            lastUpdate.textContent = 'Connection lost';
        }
    }
    
    updateCircularProgress(elementId, percentage, maxValue = 100) {
        const element = document.getElementById(elementId);
        if (element) {
            const degrees = (percentage / maxValue) * 360;
            const color = this.getColorForPercentage(percentage);
            element.style.background = `conic-gradient(${color} ${degrees}deg, var(--background-color) ${degrees}deg)`;
        }
    }
    
    getColorForPercentage(percentage) {
        if (percentage < 50) return '#27ae60'; // Green
        if (percentage < 75) return '#f39c12'; // Orange
        return '#e74c3c'; // Red
    }
    
    getTemperatureStatus(temp) {
        if (temp < 60) return { text: 'Normal', class: 'temp-normal' };
        if (temp < 75) return { text: 'Warm', class: 'temp-warm' };
        return { text: 'Hot', class: 'temp-hot' };
    }
    
    formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    formatUptime(hours) {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.floor(hours % 24);
        const minutes = Math.floor((hours % 1) * 60);
        
        if (days > 0) {
            return `${days}d ${remainingHours}h ${minutes}m`;
        } else if (remainingHours > 0) {
            return `${remainingHours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    updateChart(data) {
        const now = new Date().toLocaleTimeString();
        
        // Add new data
        this.chartData.labels.push(now);
        this.chartData.cpu.push(data.cpu.usage_percent);
        this.chartData.memory.push(data.memory.percent);
        this.chartData.temperature.push(data.temperature.celsius);
        
        // Remove old data if we have too many points
        if (this.chartData.labels.length > this.maxDataPoints) {
            this.chartData.labels.shift();
            this.chartData.cpu.shift();
            this.chartData.memory.shift();
            this.chartData.temperature.shift();
        }
        
        // Update chart
        this.chart.data.labels = this.chartData.labels;
        this.chart.data.datasets[0].data = this.chartData.cpu;
        this.chart.data.datasets[1].data = this.chartData.memory;
        this.chart.data.datasets[2].data = this.chartData.temperature;
        this.chart.update('none');
    }
    
    updateDashboard(data) {
        if (!data || data.error) {
            console.error('Invalid system data:', data);
            return;
        }
        
        try {
            // System Overview
            document.getElementById('hostname').textContent = data.system?.hostname || 'Unknown';
            document.getElementById('uptime').textContent = this.formatUptime(data.uptime?.hours || 0);
            document.getElementById('cpuCores').textContent = data.cpu?.count || 'Unknown';
            document.getElementById('architecture').textContent = data.system?.machine || 'Unknown';
            
            // CPU
            const cpuPercent = data.cpu?.usage_percent || 0;
            document.getElementById('cpuPercentage').textContent = `${cpuPercent}%`;
            document.getElementById('cpuFreq').textContent = `${data.cpu?.frequency_mhz || 0} MHz`;
            this.updateCircularProgress('cpuProgress', cpuPercent);
            
            // Memory
            const memoryPercent = data.memory?.percent || 0;
            document.getElementById('memoryPercentage').textContent = `${memoryPercent}%`;
            document.getElementById('memoryUsed').textContent = `${data.memory?.used_gb || 0} GB`;
            document.getElementById('memoryTotal').textContent = `${data.memory?.total_gb || 0} GB`;
            this.updateCircularProgress('memoryProgress', memoryPercent);
            
            // Temperature
            const temp = data.temperature?.celsius || 0;
            const tempStatus = this.getTemperatureStatus(temp);
            document.getElementById('tempValue').textContent = `${temp}°C`;
            document.getElementById('tempFahrenheit').textContent = `${data.temperature?.fahrenheit || 0}°F`;
            const tempStatusElement = document.getElementById('tempStatus');
            tempStatusElement.textContent = tempStatus.text;
            tempStatusElement.className = tempStatus.class;
            this.updateCircularProgress('tempProgress', Math.min(temp, 100), 100);
            
            // Storage
            const storagePercent = data.storage?.percent || 0;
            document.getElementById('storagePercentage').textContent = `${storagePercent}%`;
            document.getElementById('storageUsed').textContent = `${data.storage?.used_gb || 0} GB`;
            document.getElementById('storageFree').textContent = `${data.storage?.free_gb || 0} GB`;
            document.getElementById('storageTotal').textContent = `${data.storage?.total_gb || 0} GB`;
            this.updateCircularProgress('storageProgress', storagePercent);
            
            // Network
            document.getElementById('bytesSent').textContent = this.formatBytes(data.network?.bytes_sent || 0);
            document.getElementById('bytesReceived').textContent = this.formatBytes(data.network?.bytes_recv || 0);
            document.getElementById('packetsSent').textContent = (data.network?.packets_sent || 0).toLocaleString();
            document.getElementById('packetsReceived').textContent = (data.network?.packets_recv || 0).toLocaleString();
            
            // Update chart
            this.updateChart(data);
            
            // Update connection status
            this.updateConnectionStatus(true);
            
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }
    
    async update() {
        const data = await this.fetchSystemData();
        if (data) {
            this.updateDashboard(data);
        }
    }
    
    startUpdates() {
        // Initial update
        this.update();
        
        // Set up interval for regular updates
        this.intervalId = setInterval(() => {
            this.update();
        }, this.updateInterval);
    }
    
    stopUpdates() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    setupEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopUpdates();
            } else {
                this.startUpdates();
            }
        });
        
        // Handle online/offline events
        window.addEventListener('online', () => {
            console.log('Connection restored');
            this.startUpdates();
        });
        
        window.addEventListener('offline', () => {
            console.log('Connection lost');
            this.updateConnectionStatus(false);
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new PiDashboard();
});

// Handle window unload
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.stopUpdates();
    }
});
