import React, { useState } from 'react';
import {
  Bug,
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Clock,
  Server,
  CheckCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Vulnerabilities.css';

const Vulnerabilities = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [vulnsData, setVulnsData] = useState([
    {
      id: 'CVE-2024-1234',
      title: 'Remote Code Execution in Apache Log4j',
      severity: 'critical',
      cvss: 10.0,
      status: 'open',
      affectedAssets: 45,
      discoveredDate: '2024-01-10',
      dueDate: '2024-01-17'
    },
    {
      id: 'CVE-2024-5678',
      title: 'SQL Injection in Web Application',
      severity: 'critical',
      cvss: 9.8,
      status: 'in-progress',
      affectedAssets: 12,
      discoveredDate: '2024-01-12',
      dueDate: '2024-01-19'
    },
    {
      id: 'CVE-2024-9012',
      title: 'Cross-Site Scripting (XSS) Vulnerability',
      severity: 'high',
      cvss: 7.5,
      status: 'open',
      affectedAssets: 28,
      discoveredDate: '2024-01-08',
      dueDate: '2024-01-22'
    },
    {
      id: 'CVE-2024-3456',
      title: 'Privilege Escalation in Windows Server',
      severity: 'high',
      cvss: 8.1,
      status: 'in-progress',
      affectedAssets: 15,
      discoveredDate: '2024-01-05',
      dueDate: '2024-01-20'
    },
    {
      id: 'CVE-2024-7890',
      title: 'Denial of Service in Nginx',
      severity: 'medium',
      cvss: 5.9,
      status: 'remediated',
      affectedAssets: 8,
      discoveredDate: '2024-01-01',
      dueDate: '2024-01-25'
    },
    {
      id: 'CVE-2024-2345',
      title: 'Information Disclosure in API',
      severity: 'medium',
      cvss: 6.5,
      status: 'open',
      affectedAssets: 5,
      discoveredDate: '2024-01-11',
      dueDate: '2024-01-28'
    },
    {
      id: 'CVE-2024-6789',
      title: 'Weak Cryptography Implementation',
      severity: 'low',
      cvss: 4.3,
      status: 'remediated',
      affectedAssets: 22,
      discoveredDate: '2023-12-15',
      dueDate: '2024-01-30'
    },
    {
      id: 'CVE-2024-0123',
      title: 'Missing Security Headers',
      severity: 'low',
      cvss: 3.1,
      status: 'open',
      affectedAssets: 67,
      discoveredDate: '2024-01-13',
      dueDate: '2024-02-01'
    }
  ]);

  const filteredVulns = vulnsData.filter(vuln => {
    const matchesSeverity = selectedFilter === 'all' || vuln.severity === selectedFilter;
    const matchesSearch = vuln.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const handleRemediate = (vulnId) => {
    setVulnsData(prev => prev.map(v =>
      v.id === vulnId ? { ...v, status: 'in-progress' } : v
    ));
  };

  const handleMarkFixed = (vulnId) => {
    setVulnsData(prev => prev.map(v =>
      v.id === vulnId ? { ...v, status: 'remediated' } : v
    ));
  };

  const severityDistribution = [
    { name: 'Critical', value: 2, color: '#ef4444' },
    { name: 'High', value: 2, color: '#f97316' },
    { name: 'Medium', value: 2, color: '#f59e0b' },
    { name: 'Low', value: 2, color: '#10b981' }
  ];

  const trendData = [
    { month: 'Aug', discovered: 45, remediated: 38 },
    { month: 'Sep', discovered: 52, remediated: 45 },
    { month: 'Oct', discovered: 38, remediated: 42 },
    { month: 'Nov', discovered: 65, remediated: 55 },
    { month: 'Dec', discovered: 48, remediated: 52 },
    { month: 'Jan', discovered: 42, remediated: 35 }
  ];

  const stats = {
    total: vulnsData.length,
    critical: vulnsData.filter(v => v.severity === 'critical').length,
    open: vulnsData.filter(v => v.status === 'open').length,
    overdue: vulnsData.filter(v => v.status === 'open' && new Date(v.dueDate) < new Date()).length
  };

  const getCvssColor = (score) => {
    if (score >= 9) return 'critical';
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  return (
    <div className="vulnerabilities-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Vulnerability Management</h1>
          <p className="page-subtitle">Track and remediate security vulnerabilities</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Report
          </button>
          <button className="btn btn-primary" onClick={handleRunScan} disabled={isScanning}>
            <RefreshCw size={16} className={isScanning ? 'spinning' : ''} />
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </button>
        </div>
      </div>

      <div className="vuln-stats">
        <div className="vuln-stat-card">
          <Bug size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Vulnerabilities</span>
          </div>
        </div>
        <div className="vuln-stat-card critical">
          <AlertCircle size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
        <div className="vuln-stat-card open">
          <Clock size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>
        <div className="vuln-stat-card overdue">
          <AlertCircle size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>
      </div>

      <div className="vuln-charts">
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Vulnerability Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a5a" />
              <XAxis dataKey="month" stroke="#6a6a8a" />
              <YAxis stroke="#6a6a8a" />
              <Tooltip
                contentStyle={{
                  background: '#1a1a3a',
                  border: '1px solid #2a2a5a',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="discovered" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="remediated" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Severity Distribution</h3>
          </div>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  itemStyle={{ color: '#fff' }}
                  contentStyle={{
                    background: '#1a1a3a',
                    border: '1px solid #2a2a5a',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {severityDistribution.map((item, idx) => (
                <div key={idx} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="vuln-table-container card">
        <div className="table-header">
          <h3 className="card-title">All Vulnerabilities</h3>
          <div className="table-controls">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search CVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="filter-select" value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)}>
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <table className="vuln-table">
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>CVSS</th>
              <th>Status</th>
              <th>Affected Assets</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVulns.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">No vulnerabilities found matching your criteria</td>
              </tr>
            ) : filteredVulns.map(vuln => (
              <tr key={vuln.id}>
                <td className="cve-id">{vuln.id}</td>
                <td className="vuln-title">{vuln.title}</td>
                <td>
                  <span className={`badge badge-${vuln.severity}`}>
                    {vuln.severity}
                  </span>
                </td>
                <td>
                  <span className={`cvss-score ${getCvssColor(vuln.cvss)}`}>
                    {vuln.cvss.toFixed(1)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${vuln.status}`}>
                    {vuln.status === 'remediated' && <CheckCircle size={12} />}
                    {vuln.status}
                  </span>
                </td>
                <td>
                  <div className="affected-assets">
                    <Server size={14} />
                    {vuln.affectedAssets}
                  </div>
                </td>
                <td className="due-date">{vuln.dueDate}</td>
                <td>
                  <div className="action-buttons">
                    {vuln.status !== 'remediated' && (
                      <button
                        className="action-btn remediate"
                        title="Start Remediation"
                        onClick={() => handleRemediate(vuln.id)}
                        disabled={vuln.status === 'in-progress'}
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    <button
                      className="action-btn fix"
                      title="Mark as Fixed"
                      onClick={() => handleMarkFixed(vuln.id)}
                      disabled={vuln.status === 'remediated'}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button className="action-btn details" title="View Details">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vulnerabilities;
