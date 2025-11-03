// src/pages/AdminPanel.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase';
import './AdminPanel.css';

const AdminPanel = () => {
  // State for the Incidents form
  const [incidentName, setIncidentName] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [status, setStatus] = useState('Open');

  // State for the Threats form
  const [threatName, setThreatName] = useState('');
  const [threatType, setThreatType] = useState('Phishing');
  
  // State for the Vulnerabilities form
  const [vulnName, setVulnName] = useState('');
  const [risk, setRisk] = useState('High');

  // State for the Import button
  const [isImporting, setIsImporting] = useState(false);

  // Generic submit handler for the first 3 forms
  const handleSubmit = async (e, tableName, dataToInsert) => {
    e.preventDefault();
    
    const { error } = await supabase.from(tableName).insert(dataToInsert);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(tableName + ' added successfully!');
      // Reset forms
      if (tableName === 'Incidents') {
        setIncidentName('');
      } else if (tableName === 'Threats') {
        setThreatName('');
      } else if (tableName === 'Vulnerabilities') {
        setVulnName('');
      }
    }
  };

  // Function to handle CISA Import
 const handleCisaImport = async () => {
    setIsImporting(true);
    alert('Requesting import from server... This may take a moment.');

    try {
      // 1. Call our new Edge Function
      const { data, error } = await supabase.functions.invoke('cisa-importer');

      if (error) {
        throw error;
      }

      alert(data.message); // Show the success message from the function
    } catch (error) {
      console.error('CISA Import Failed:', error);
      alert('Import Failed: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };
 
  return (
    <div className="admin-container">
      {/* --- Incident Form --- */}
      <div className="form-card">
        <h2>Add New Incident</h2>
        <form onSubmit={(e) => handleSubmit(e, 'Incidents', { name: incidentName, severity, status })}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={incidentName}
              onChange={(e) => setIncidentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button type="submit" className="form-button">Add Incident</button>
        </form>
      </div>

      {/* --- Threat Form --- */}
      <div className="form-card">
        <h2>Add New Threat</h2>
        <form onSubmit={(e) => handleSubmit(e, 'Threats', { name: threatName, type: threatType })}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={threatName}
              onChange={(e) => setThreatName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={threatType} onChange={(e) => setThreatType(e.target.value)}>
              <option value="Phishing">Phishing</option>
              <option value="Malware">Malware</option>
              <option value="Insider Threat">Insider Threat</option>
              <option value="Ransomware">Ransomware</option>
            </select>
          </div>
          <button type="submit" className="form-button">Add Threat</button>
        </form>
      </div>
      
      {/* --- Vulnerability Form --- */}
      <div className="form-card">
        <h2>Add New Vulnerability</h2>
        <form onSubmit={(e) => handleSubmit(e, 'Vulnerabilities', { name: vulnName, risk })}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={vulnName}
              onChange={(e) => setVulnName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Risk</label>
            <select value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button type="submit" className="form-button">Add Vulnerability</button>
        </form>
      </div>

      {/* --- NEW IMPORT CARD --- */}
      <div className="form-card">
        <h2>Import Live Threat Data</h2>
        <p>
          This will fetch the latest Known Exploited Vulnerabilities (KEV)
          from the CISA (Cybersecurity & Infrastructure Security Agency) API
          and add them to your dashboard.
        </p>
        <button
          onClick={handleCisaImport}
          disabled={isImporting}
          className="form-button"
          style={{ background: isImporting ? '#555' : '#16a085' }}
        >
          {isImporting ? 'Importing...' : 'Import from CISA'}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;