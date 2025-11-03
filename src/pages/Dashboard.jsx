// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40'];

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [threats, setThreats] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);

  // This useEffect fetches the initial data
  useEffect(() => {
    const fetchIncidents = async () => {
      const { data, error } = await supabase.from('Incidents').select('*');
      if (error) console.error('Error fetching incidents:', error);
      else setIncidents(data);
    };

    const fetchThreats = async () => {
      const { data, error } = await supabase.from('Threats').select('*');
      if (error) console.error('Error fetching threats:', error);
      else setThreats(data);
    };

    const fetchVulnerabilities = async () => {
      const { data, error } = await supabase.from('Vulnerabilities').select('*');
      if (error) console.error('Error fetching vulnerabilities:', error);
      else setVulnerabilities(data);
    };

    fetchIncidents();
    fetchThreats();
    fetchVulnerabilities();
  }, []);

  // This useEffect listens for ANY change in the database
  useEffect(() => {
    const channel = supabase
      .channel('cyber-dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Change received!', payload);
          
          if (payload.table === 'Incidents') {
            if (payload.eventType === 'INSERT') {
              setIncidents(current => [...current, payload.new]);
            }
          }
          if (payload.table === 'Threats') {
            if (payload.eventType === 'INSERT') {
              setThreats(current => [...current, payload.new]);
            }
          }
          // This handles the CISA import, which inserts many at once
          if (payload.table === 'Vulnerabilities') {
             // A simple way to handle bulk inserts is to just refetch all
             const fetchVulnerabilities = async () => {
              const { data, error } = await supabase.from('Vulnerabilities').select('*');
              if (error) console.error('Error fetching vulnerabilities:', error);
              else setVulnerabilities(data);
            };
            fetchVulnerabilities();
          }
        }
      )
      .subscribe();

    // Cleanup function to remove the listener
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Run this only once

  // --- Data Processing for Charts ---

  // Process data for Incident Severity chart
  const severityData = [
    { name: 'Critical', count: incidents.filter(i => i.severity === 'Critical').length },
    { name: 'High', count: incidents.filter(i => i.severity === 'High').length },
    { name: 'Medium', count: incidents.filter(i => i.severity === 'Medium').length },
    { name: 'Low', count: incidents.filter(i => i.severity === 'Low').length },
  ];

  // Process data for Threat Type chart
  const threatData = [
    { name: 'Phishing', value: threats.filter(t => t.type === 'Phishing').length },
    { name: 'Malware', value: threats.filter(t => t.type === 'Malware').length },
    { name: 'Insider', value: threats.filter(t => t.type === 'Insider Threat').length },
    { name: 'Ransomware', value: threats.filter(t => t.type === 'Ransomware').length },
  ].filter(entry => entry.value > 0);

  // Data for Vulnerability chart
  const vulnerabilityData = [
    { name: 'Critical', count: vulnerabilities.filter(v => v.risk === 'Critical').length },
    { name: 'High', count: vulnerabilities.filter(v => v.risk === 'High').length },
    { name: 'Medium', count: vulnerabilities.filter(v => v.risk === 'Medium').length },
    { name: 'Low', count: vulnerabilities.filter(v => v.risk === 'Low').length },
  ];

  // --- Render the Dashboard ---
  return (
    <div className="dashboard">
      <div className="dashboard-grid">

        {/* Card 1: Incident Severity Chart */}
        <div className="dashboard-card">
          <h2>Incidents by Severity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <XAxis dataKey="name" stroke="#e0e0e0" />
              <YAxis allowDecimals={false} stroke="#e0e0e0" />
              <Tooltip 
                wrapperStyle={{ backgroundColor: '#333', border: 'none' }} 
              />
              <Legend wrapperStyle={{ color: '#e0e0e0' }} />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card 2: Threat Type Chart */}
        <div className="dashboard-card">
          <h2>Threats by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threatData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {threatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                wrapperStyle={{ backgroundColor: '#333', border: 'none' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Card 3: Vulnerabilities by Risk */}
        <div className="dashboard-card">
          <h2>Vulnerabilities by Risk</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnerabilityData}>
              <XAxis dataKey="name" stroke="#e0e0e0" />
              <YAxis allowDecimals={false} stroke="#e0e0e0" />
              <Tooltip 
                wrapperStyle={{ backgroundColor: '#333', border: 'none' }} 
              />
              <Legend wrapperStyle={{ color: '#e0e0e0' }} />
              <Bar dataKey="count" fill="#FF4136" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card 4: Real-time Incident Feed */}
        <div className="dashboard-card">
          <h2>Latest Incidents (Real-time)</h2>
          <ul className="incident-list">
            {incidents.length === 0 ? <p>No incidents reported.</p> :
              [...incidents].reverse().slice(0, 5).map((incident) => (
                <li key={incident.id} className="incident-item">
                  <span style={{ backgroundColor: '#ffcdd2', color: '#333' }}>{incident.severity}</span>
                  {incident.name}
                </li>
              ))
            }
          </ul>
        </div>
        {/* --- NEW CARD 5: Threats Feed --- */}
        <div className="dashboard-card">
          <h2>Latest Threats</h2>
          <ul className="data-list-container">
            {threats.length === 0 ? <p>No threats reported.</p> :
              [...threats].reverse().map((item) => (
                <li key={item.id} className="data-list-item">
                  {item.name}
                  <span className="data-list-tag" style={{ backgroundColor: '#cce5ff' }}>
                    {item.type}
                  </span>
                </li>
              ))
            }
          </ul>
        </div>

        {/* --- NEW CARD 6: Vulnerabilities Feed --- */}
        <div className="dashboard-card">
          <h2>Latest Vulnerabilities</h2>
          <ul className="data-list-container">
            {vulnerabilities.length === 0 ? <p>No vulnerabilities found.</p> :
              [...vulnerabilities].reverse().map((item) => (
                <li key={item.id} className="data-list-item">
                  {item.name}
                  <span className="data-list-tag" style={{ backgroundColor: '#ffecb3' }}>
                    {item.risk}
                  </span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;