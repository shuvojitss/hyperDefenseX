import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  MoreVertical,
  Eye,
  Trash2,
  Check,
  Volume2,
  VolumeX,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import './Alerts.css';

const Alerts = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsData, setAlertsData] = useState([
    {
      id: 'ALT-2024-001',
      title: 'Ransomware Detected on Endpoint',
      description: 'WannaCry variant detected on workstation WS-042. Immediate isolation recommended.',
      severity: 'critical',
      status: 'new',
      source: 'Endpoint Detection',
      timestamp: '2 minutes ago',
      assignee: 'Unassigned',
      affectedAssets: ['WS-042', 'File Server 01']
    },
    {
      id: 'ALT-2024-002',
      title: 'Suspicious Login Activity',
      description: 'Multiple failed login attempts followed by successful authentication from new location.',
      severity: 'high',
      status: 'investigating',
      source: 'SIEM',
      timestamp: '5 minutes ago',
      assignee: 'John Smith',
      affectedAssets: ['user@company.com']
    },
    {
      id: 'ALT-2024-003',
      title: 'Unusual Outbound Traffic',
      description: 'Large data transfer detected to unknown external IP address.',
      severity: 'high',
      status: 'new',
      source: 'Network Monitor',
      timestamp: '12 minutes ago',
      assignee: 'Unassigned',
      affectedAssets: ['DEV-PC-15', 'Gateway-01']
    },
    {
      id: 'ALT-2024-004',
      title: 'SSL Certificate Expiring',
      description: 'SSL certificate for api.company.com expires in 7 days.',
      severity: 'medium',
      status: 'acknowledged',
      source: 'Certificate Monitor',
      timestamp: '1 hour ago',
      assignee: 'IT Team',
      affectedAssets: ['api.company.com']
    },
    {
      id: 'ALT-2024-005',
      title: 'Firewall Rule Violation',
      description: 'Blocked connection attempt to restricted port from internal host.',
      severity: 'medium',
      status: 'resolved',
      source: 'Firewall',
      timestamp: '2 hours ago',
      assignee: 'Sarah Johnson',
      affectedAssets: ['10.0.0.45']
    },
    {
      id: 'ALT-2024-006',
      title: 'Malicious Email Blocked',
      description: 'Phishing email with malicious attachment quarantined.',
      severity: 'low',
      status: 'resolved',
      source: 'Email Security',
      timestamp: '3 hours ago',
      assignee: 'Auto-resolved',
      affectedAssets: ['marketing@company.com']
    },
    {
      id: 'ALT-2024-007',
      title: 'Port Scan Detected',
      description: 'External IP performing port scan on public-facing servers.',
      severity: 'high',
      status: 'investigating',
      source: 'IDS',
      timestamp: '4 hours ago',
      assignee: 'Mike Chen',
      affectedAssets: ['Web Server Cluster']
    },
    {
      id: 'ALT-2024-008',
      title: 'Privilege Escalation Attempt',
      description: 'User attempted to access admin resources without proper authorization.',
      severity: 'critical',
      status: 'investigating',
      source: 'Access Control',
      timestamp: '5 hours ago',
      assignee: 'Security Team',
      affectedAssets: ['user123', 'Admin Portal']
    },
    {
      id: 'ALT-2024-009',
      title: 'Backup Job Failed',
      description: 'Nightly backup of production database failed due to storage issue.',
      severity: 'medium',
      status: 'new',
      source: 'Backup System',
      timestamp: '6 hours ago',
      assignee: 'Unassigned',
      affectedAssets: ['PROD-DB-01']
    },
    {
      id: 'ALT-2024-010',
      title: 'Antivirus Definitions Outdated',
      description: '15 endpoints have antivirus definitions older than 7 days.',
      severity: 'low',
      status: 'acknowledged',
      source: 'Endpoint Protection',
      timestamp: '8 hours ago',
      assignee: 'IT Support',
      affectedAssets: ['Multiple endpoints']
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 5;

  const tabs = [
    { id: 'all', label: 'All Alerts', count: alertsData.length },
    { id: 'new', label: 'New', count: alertsData.filter(a => a.status === 'new').length },
    { id: 'investigating', label: 'Investigating', count: alertsData.filter(a => a.status === 'investigating').length },
    { id: 'resolved', label: 'Resolved', count: alertsData.filter(a => a.status === 'resolved').length }
  ];

  const filteredAlerts = alertsData.filter(alert => {
    const matchesTab = selectedTab === 'all' || alert.status === selectedTab;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * alertsPerPage,
    currentPage * alertsPerPage
  );

  const getSeverityIcon = (severity) => {
    return <AlertTriangle size={16} />;
  };

  const alertCounts = {
    critical: alertsData.filter(a => a.severity === 'critical').length,
    high: alertsData.filter(a => a.severity === 'high').length,
    medium: alertsData.filter(a => a.severity === 'medium').length,
    low: alertsData.filter(a => a.severity === 'low').length
  };

  const handleAcknowledge = (alertId) => {
    setAlertsData(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleInvestigate = (alertId) => {
    setAlertsData(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'investigating' } : alert
    ));
  };

  const handleResolve = (alertId) => {
    setAlertsData(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const handleDismiss = (alertId) => {
    setAlertsData(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Security Alerts</h1>
          <p className="page-subtitle">Real-time security event monitoring and response</p>
        </div>
        <div className="header-actions">
          <button className={`btn btn-secondary ${isMuted ? 'muted' : ''}`} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {isMuted ? 'Unmute' : 'Mute All'}
          </button>
          <button className="btn btn-primary" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="alert-summary-cards">
        <div className="summary-card critical">
          <div className="summary-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-count">{alertCounts.critical}</span>
            <span className="summary-label">Critical</span>
          </div>
        </div>
        <div className="summary-card high">
          <div className="summary-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-count">{alertCounts.high}</span>
            <span className="summary-label">High</span>
          </div>
        </div>
        <div className="summary-card medium">
          <div className="summary-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-count">{alertCounts.medium}</span>
            <span className="summary-label">Medium</span>
          </div>
        </div>
        <div className="summary-card low">
          <div className="summary-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-count">{alertCounts.low}</span>
            <span className="summary-label">Low</span>
          </div>
        </div>
      </div>

      <div className="alerts-controls">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${selectedTab === tab.id ? 'active' : ''}`}
              onClick={() => { setSelectedTab(tab.id); setCurrentPage(1); }}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="controls-right">
          <div className="search-box-alerts">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="filter-btn">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="alerts-list-container">
        {paginatedAlerts.length === 0 ? (
          <div className="no-alerts">
            <CheckCircle size={48} />
            <h3>No alerts found</h3>
            <p>No alerts match your current filters</p>
          </div>
        ) : paginatedAlerts.map((alert) => (
          <div key={alert.id} className={`alert-card ${alert.severity}`}>
            <div className="alert-severity-indicator"></div>
            <div className="alert-main">
              <div className="alert-header">
                <div className="alert-title-row">
                  <span className={`severity-badge ${alert.severity}`}>
                    {getSeverityIcon(alert.severity)}
                    {alert.severity}
                  </span>
                  <h3 className="alert-title">{alert.title}</h3>
                </div>
                <div className="alert-meta">
                  <span className="alert-id">{alert.id}</span>
                  <span className="alert-source">{alert.source}</span>
                  <span className="alert-time">
                    <Clock size={12} />
                    {alert.timestamp}
                  </span>
                </div>
              </div>
              <p className="alert-description">{alert.description}</p>
              <div className="alert-footer">
                <div className="alert-assets">
                  <span className="assets-label">Affected:</span>
                  {alert.affectedAssets.map((asset, idx) => (
                    <span key={idx} className="asset-tag">{asset}</span>
                  ))}
                </div>
                <div className="alert-assignee">
                  <span className="assignee-label">Assignee:</span>
                  <span className={`assignee-value ${alert.assignee === 'Unassigned' ? 'unassigned' : ''}`}>
                    {alert.assignee}
                  </span>
                </div>
              </div>
            </div>
            <div className="alert-actions">
              <span className={`status-indicator ${alert.status}`}>
                {alert.status === 'new' && <Bell size={14} />}
                {alert.status === 'investigating' && <Eye size={14} />}
                {alert.status === 'acknowledged' && <Check size={14} />}
                {alert.status === 'resolved' && <CheckCircle size={14} />}
                {alert.status}
              </span>
              <div className="action-buttons">
                <button 
                  className="action-btn" 
                  title="Acknowledge"
                  onClick={() => handleAcknowledge(alert.id)}
                  disabled={alert.status === 'acknowledged' || alert.status === 'resolved'}
                >
                  <Check size={16} />
                </button>
                <button 
                  className="action-btn" 
                  title="Investigate"
                  onClick={() => handleInvestigate(alert.id)}
                  disabled={alert.status === 'investigating' || alert.status === 'resolved'}
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="action-btn resolve" 
                  title="Resolve"
                  onClick={() => handleResolve(alert.id)}
                  disabled={alert.status === 'resolved'}
                >
                  <CheckCircle size={16} />
                </button>
                <button 
                  className="action-btn delete" 
                  title="Dismiss"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <span className="pagination-info">
          Showing {((currentPage - 1) * alertsPerPage) + 1} - {Math.min(currentPage * alertsPerPage, filteredAlerts.length)} of {filteredAlerts.length} alerts
        </span>
        <div className="pagination-buttons">
          <button 
            className="pagination-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button 
              key={idx + 1}
              className={`pagination-btn ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
