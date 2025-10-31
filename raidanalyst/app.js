// app.js
class TradingDashboard {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.wsUrl = 'ws://localhost:8080';
        this.signals = [];
        this.ws = null;
        this.isConnected = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.connectWebSocket();
        this.loadSignals();
        
        // Auto-refresh every 10 seconds (fallback)
        setInterval(() => {
            if (!this.isConnected) {
                this.loadSignals();
            }
        }, 10000);
    }

    setupEventListeners() {
        document.getElementById('symbolFilter').addEventListener('change', () => this.filterSignals());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterSignals());
        document.getElementById('directionFilter').addEventListener('change', () => this.filterSignals());
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadSignals());
        document.getElementById('clearFiltersBtn').addEventListener('click', () => this.clearFilters());
    }

    connectWebSocket() {
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.updateConnectionStatus(true);
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            this.ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                this.updateConnectionStatus(false);
                
                // Try to reconnect after 5 seconds
                setTimeout(() => this.connectWebSocket(), 5000);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
            
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.updateConnectionStatus(false);
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'CONNECTED':
                console.log('WebSocket:', data.message);
                break;
                
            case 'INITIAL_SIGNALS':
                this.signals = data.data;
                this.displaySignals();
                break;
                
            case 'NEW_SIGNAL':
                // Add new signal to the beginning
                this.signals.unshift(data.data);
                this.displaySignals();
                this.showNotification('New signal received!', 'success');
                break;
                
            default:
                console.log('Unknown message type:', data.type);
        }
    }

    async loadSignals() {
        try {
            const response = await fetch(`${this.apiBase}/signals?limit=100`);
            this.signals = await response.json();
            this.displaySignals();
            this.updateLastUpdate();
        } catch (error) {
            console.error('Error loading signals:', error);
            this.showNotification('Failed to load signals', 'error');
        }
    }

    displaySignals() {
        const container = document.getElementById('signalsContainer');
        const filteredSignals = this.getFilteredSignals();
        
        container.innerHTML = '';

        if (filteredSignals.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No signals found</h4>
                    <p class="text-muted">Try changing your filters</p>
                </div>
            `;
            return;
        }

        filteredSignals.forEach(signal => {
            const signalElement = this.createSignalCard(signal);
            container.appendChild(signalElement);
        });

        this.updateStatistics();
        this.updateSignalsCount(filteredSignals.length);
    }

    createSignalCard(signal) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        const statusClass = `status-${signal.status.toLowerCase().replace('closed_', '')}`;
        const directionClass = `direction-${signal.direction.toLowerCase()}`;
        
        const timeAgo = this.getTimeAgo(new Date(signal.timestamp));
        
        col.innerHTML = `
            <div class="card signal-card ${statusClass} ${directionClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">
                            <span class="badge ${signal.direction === 'BUY' ? 'bg-success' : 'bg-danger'}">
                                ${signal.direction}
                            </span>
                            ${signal.symbol}
                        </h5>
                        <span class="badge bg-secondary">${signal.signal_type}</span>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-4">
                            <small class="text-muted">Entry</small>
                            <div class="price-up">${parseFloat(signal.entry_price).toFixed(5)}</div>
                        </div>
                        <div class="col-4">
                            <small class="text-muted">SL</small>
                            <div class="price-down">${parseFloat(signal.stop_loss).toFixed(5)}</div>
                        </div>
                        <div class="col-4">
                            <small class="text-muted">TP</small>
                            <div class="price-up">${parseFloat(signal.take_profit).toFixed(5)}</div>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge ${this.getStatusBadgeClass(signal.status)}">
                            ${signal.status.replace('_', ' ')}
                        </span>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                </div>
            </div>
        `;
        
        return col;
    }

    getFilteredSignals() {
        const symbolFilter = document.getElementById('symbolFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const directionFilter = document.getElementById('directionFilter').value;
        
        return this.signals.filter(signal => {
            return (!symbolFilter || signal.symbol === symbolFilter) &&
                   (!statusFilter || signal.status === statusFilter) &&
                   (!directionFilter || signal.direction === directionFilter);
        });
    }

    filterSignals() {
        this.displaySignals();
    }

    clearFilters() {
        document.getElementById('symbolFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('directionFilter').value = '';
        this.displaySignals();
    }

    updateStatistics() {
        const total = this.signals.length;
        const pending = this.signals.filter(s => s.status === 'PENDING').length;
        const active = this.signals.filter(s => s.status === 'ACTIVE').length;
        const tp = this.signals.filter(s => s.status === 'CLOSED_TP').length;
        const sl = this.signals.filter(s => s.status === 'CLOSED_SL').length;
        const failed = this.signals.filter(s => s.status === 'FAILED').length;

        document.getElementById('totalSignals').textContent = total;
        document.getElementById('pendingSignals').textContent = pending;
        document.getElementById('activeSignals').textContent = active;
        document.getElementById('tpSignals').textContent = tp;
        document.getElementById('slSignals').textContent = sl;
        document.getElementById('failedSignals').textContent = failed;
    }

    updateSignalsCount(count) {
        document.getElementById('signalsCount').textContent = count;
    }

    updateConnectionStatus(connected) {
        this.isConnected = connected;
        const statusElement = document.getElementById('connectionStatus');
        const statusText = document.getElementById('statusText');
        
        if (connected) {
            statusElement.className = 'connection-status connected';
            statusText.innerHTML = '<i class="fas fa-wifi"></i> Connected (Live)';
        } else {
            statusElement.className = 'connection-status disconnected';
            statusText.innerHTML = '<i class="fas fa-plug"></i> Disconnected';
        }
    }

    updateLastUpdate() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = 
            `Last update: ${now.toLocaleTimeString()}`;
    }

    getStatusBadgeClass(status) {
        const classes = {
            'PENDING': 'bg-warning',
            'ACTIVE': 'bg-info',
            'FAILED': 'bg-danger',
            'CLOSED_TP': 'bg-success',
            'CLOSED_SL': 'bg-secondary',
            'EXPIRED': 'bg-secondary'
        };
        return classes[status] || 'bg-secondary';
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    showNotification(message, type = 'info') {
        // Simple notification - you can replace with Toast library
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create bootstrap toast notification
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast after hide
        toast.addEventListener('hidden.bs.toast', () => {
            document.body.removeChild(toast);
        });
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TradingDashboard();
});