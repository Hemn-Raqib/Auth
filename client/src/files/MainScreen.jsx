import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import useAuth from '../auth/useAuth';
import { tableStyles } from '../css/Styles';

function MainScreen() {
  const [activityData, setActivityData] = useState({
    devices: [],
    recentActivity: []
  });
  const [activeTab, setActiveTab] = useState('devices');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL1}/activity/${user?.login_id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'success') {
        setActivityData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activity data');
      console.error('Error fetching activity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateDevice = async (deviceId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_TERMINATE}/devices/${deviceId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setActivityData(prev => ({
          ...prev,
          devices: prev.devices.filter(device => device.deviceId !== deviceId)
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to terminate device');
      console.error('Error terminating device:', err);
    }
  };

  const renderDevicesTable = () => (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th className="hide-sm">Browser</th>
              <th className="hide-sm">OS</th>
              <th>Location</th>
              <th>Last Used</th>
              <th>Trusted Since</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activityData.devices.map((device) => (
              <tr key={device.deviceId}>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td className="hide-sm">{device.browser}</td>
                <td className="hide-sm">{device.os}</td>
                <td>
                  {device.location.city}, {device.location.country}
                  <br />
                  <small>
                    {device.location.coordinates.latitude}, {device.location.coordinates.longitude}
                  </small>
                </td>
                <td>{new Date(device.lastUsed).toLocaleString()}</td>
                <td>{new Date(device.trustedSince).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleTerminateDevice(device.deviceId)}
                    className="terminate-button"
                  >
                    Terminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderActivityTable = () => (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Activity Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Device</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activityData.recentActivity.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.type}</td>
                <td>
                  <span className={`status-${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </td>
                <td>
                  {activity.location.city}, {activity.location.country}
                  <br />
                  <small>{activity.location.ip}</small>
                </td>
                <td>{activity.deviceName}</td>
                <td>{new Date(activity.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="header">
        <h1>Account Activity</h1>
      </div>

      <div className="action-buttons">
        <button 
          onClick={fetchActivityData} 
          className="refresh-button"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <button 
        onClick={logout}
          className="refresh-button"
          disabled={loading}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="button-container">
        <button
          onClick={() => setActiveTab('devices')}
          className={`collect-button ${activeTab === 'devices' ? 'active' : ''}`}
        >
          Trusted Devices
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`collect-button ${activeTab === 'activity' ? 'active' : ''}`}
        >
          Recent Activity
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {activeTab === 'devices' && renderDevicesTable()}
          {activeTab === 'activity' && renderActivityTable()}
        </>
      )}

      <style>
        {tableStyles}
      </style>
    </div>
  );
}

export default MainScreen;