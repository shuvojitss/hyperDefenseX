import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Bug,
  Server,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Clock,
  Eye,
  ChevronDown,
  Check,
  Bell,
  Search
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import './Overview.css';

const Overview = () => {
  const stats = [
    {
      title: 'Active Threats',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Shield,
      color: 'red'
    },
    {
      title: 'Alerts Today',
      value: '156',
      change: '-8%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Vulnerabilities',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: Bug,
      color: 'orange'
    },
    {
      title: 'Protected Assets',
      value: '1,247',
      change: '+2%',
      trend: 'up',
      icon: Server,
      color: 'cyan'
    }
  ];

  const threatData = [
    { name: 'Mon', threats: 45, blocked: 42 },
    { name: 'Tue', threats: 52, blocked: 48 },
    { name: 'Wed', threats: 38, blocked: 35 },
    { name: 'Thu', threats: 65, blocked: 61 },
    { name: 'Fri', threats: 48, blocked: 45 },
    { name: 'Sat', threats: 32, blocked: 30 },
    { name: 'Sun', threats: 28, blocked: 26 }
  ];

  const severityData = [
    { name: 'Critical', value: 15, color: '#ef4444' },
    { name: 'High', value: 28, color: '#f97316' },
    { name: 'Medium', value: 42, color: '#f59e0b' },
    { name: 'Low', value: 71, color: '#10b981' }
  ];

  const attackTypesData = [
    { type: 'Malware', count: 245 },
    { type: 'Phishing', count: 189 },
    { type: 'DDoS', count: 156 },
    { type: 'SQL Injection', count: 98 },
    { type: 'XSS', count: 76 },
    { type: 'Brute Force', count: 134 }
  ];

  const networkData = [
    { time: '00:00', inbound: 120, outbound: 80 },
    { time: '04:00', inbound: 90, outbound: 60 },
    { time: '08:00', inbound: 180, outbound: 140 },
    { time: '12:00', inbound: 250, outbound: 200 },
    { time: '16:00', inbound: 220, outbound: 180 },
    { time: '20:00', inbound: 160, outbound: 120 }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      message: 'Ransomware detected on endpoint WS-042',
      time: '2 min ago',
      source: '192.168.1.105'
    },
    {
      id: 2,
      type: 'high',
      message: 'Suspicious login attempt from unknown location',
      time: '5 min ago',
      source: '45.33.32.156'
    },
    {
      id: 3,
      type: 'medium',
      message: 'Unusual outbound traffic detected',
      time: '12 min ago',
      source: '10.0.0.45'
    },
    {
      id: 4,
      type: 'low',
      message: 'Certificate expiring in 7 days',
      time: '25 min ago',
      source: 'web-server-01'
    },
    {
      id: 5,
      type: 'high',
      message: 'Port scan detected from external IP',
      time: '32 min ago',
      source: '185.220.101.1'
    }
  ];

  const liveThreats = [
    { country: 'Russia', count: 145, flag: '🇷🇺' },
    { country: 'China', count: 98, flag: '🇨🇳' },
    { country: 'North Korea', count: 67, flag: '🇰🇵' },
    { country: 'Iran', count: 45, flag: '🇮🇷' },
    { country: 'Unknown', count: 89, flag: '🏴' }
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('24h');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = [
    {
      id: 1,
      severity: 'critical',
      message: 'Critical: RCE detected',
      time: '2 min ago'
    },
    {
      id: 2,
      severity: 'high',
      message: 'High: Brute force attempt',
      time: '5 min ago'
    },
    {
      id: 3,
      severity: 'success',
      message: 'Playbook completed',
      time: '12 min ago'
    }
  ];

  const timeRanges = [
    { label: 'Real-time', value: 'real-time' },
    { label: 'Last 1 hour', value: '1h' },
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Custom range', value: 'custom' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRangeSelect = (range) => {
    setSelectedRange(range.value);
    setIsDropdownOpen(false);
  };

  const getSelectedRangeLabel = () => {
    return timeRanges.find(r => r.value === selectedRange)?.label || 'Last 24 Hours';
  };

  return (
    <div className="overview">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Security Overview</h1>
          <p className="page-subtitle">Real-time security monitoring and threat analysis</p>
        </div>
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search alerts, incidents, logs..." className="search-input" />
          <span className="search-shortcut">⌘K</span>
        </div>

        <div className="header-actions">
          <div className="status-badge">
            <span className="status-dot green"></span>
            Production
          </div>

          <div className="notification-container" ref={notificationRef}>
            <button
              className={`notification-trigger ${isNotificationOpen ? 'active' : ''}`}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>

            {isNotificationOpen && (
              <div className="notification-dropdown-menu">
                <div className="dropdown-header">
                  <span>Notifications</span>
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <div className="notification-item-header">
                        <span className={`severity-dot ${notif.severity}`}></span>
                        <span className="notification-message">{notif.message}</span>
                      </div>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  ))}
                </div>
                <button className="view-all-link" onClick={() => setIsNotificationOpen(false)}>
                  View all notifications
                </button>
              </div>
            )}
          </div>

          <div className="time-range-dropdown" ref={dropdownRef}>
            <button
              className={`btn btn-secondary dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Clock size={16} />
              {getSelectedRangeLabel()}
              <ChevronDown size={14} className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    className={`dropdown-option ${selectedRange === range.value ? 'selected' : ''}`}
                    onClick={() => handleRangeSelect(range)}
                  >
                    <span>{range.label}</span>
                    {selectedRange === range.value && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary">
            <Eye size={16} />
            View Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="card chart-card large">
          <div className="card-header">
            <h3 className="card-title">Threat Activity</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot cyan"></span>
                Detected
              </span>
              <span className="legend-item">
                <span className="legend-dot green"></span>
                Blocked
              </span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={threatData}>
                <defs>
                  <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a5a" />
                <XAxis dataKey="name" stroke="#6a6a8a" />
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
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="#00d4ff"
                  fill="url(#threatGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="#10b981"
                  fill="url(#blockedGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Severity Distribution</h3>
          </div>
          <div className="chart-container pie-chart">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1a1a3a',
                    border: '1px solid #2a2a5a',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {severityData.map((item, index) => (
                <div key={index} className="pie-legend-item">
                  <span className="pie-dot" style={{ background: item.color }}></span>
                  <span className="pie-label">{item.name}</span>
                  <span className="pie-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Attack Types</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attackTypesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a5a" />
                <XAxis type="number" stroke="#6a6a8a" />
                <YAxis dataKey="type" type="category" stroke="#6a6a8a" width={80} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a3a',
                    border: '1px solid #2a2a5a',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Network Traffic</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a5a" />
                <XAxis dataKey="time" stroke="#6a6a8a" />
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
                <Line
                  type="monotone"
                  dataKey="inbound"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="outbound"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="card alerts-card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="alerts-list">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                <div className="alert-indicator"></div>
                <div className="alert-content">
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-meta">
                    <span className="alert-source">{alert.source}</span>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card threats-origin-card">
          <div className="card-header">
            <h3 className="card-title">
              <Globe size={18} />
              Threat Origins
            </h3>
          </div>
          <div className="threats-list">
            {liveThreats.map((threat, index) => (
              <div key={index} className="threat-origin-item">
                <span className="threat-flag">{threat.flag}</span>
                <span className="threat-country">{threat.country}</span>
                <div className="threat-bar-container">
                  <div
                    className="threat-bar"
                    style={{ width: `${(threat.count / 145) * 100}%` }}
                  ></div>
                </div>
                <span className="threat-count">{threat.count}</span>
              </div>
            ))}
          </div>
          <div className="world-map-placeholder">
            <Activity size={48} className="map-icon" />
            <span>Live Threat Map</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
