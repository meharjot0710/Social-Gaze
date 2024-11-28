import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => setData(results.data),
        });
      });
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const countByKey = (key, values) => {
    if (Array.isArray(values)) {
      return data.filter((item) => values.includes(item[key])).length;
    }
    return data.filter((item) => item[key] === values).length;
  };
  const countByConditions = (conditions) => {
    return data.filter((item) => {
      return Object.entries(conditions).every(([key, value]) =>
        Array.isArray(value) ? value.includes(item[key]) : item[key] === value
      );
    }).length;
  };
  
  const activeAccounts = countByKey("activity_level", ["High", "Medium"]);
  const inactiveAccounts = data.length - activeAccounts;
  const profilePictureCount = countByKey("profile_pic", "True");



  const regionData = [
    { name: "United States", value: countByKey("region", "USA") },
    { name: "Canada", value: countByKey("region", "Canada") },
    { name: "India", value: countByKey("region", "India") },
  ];
  const infludata = [
    { name: "United States", value: countByConditions({ "region" : "USA", "real_account_type": "Influencer" }) },
    { name: "Canada", value: countByConditions({ "region": "Canada", "real_account_type": "Influencer" }) },
    { name: "India", value: countByConditions({ "region": "India", "real_account_type": "Influencer" }) },
  ];
  

  const accountTypeData = [
    { name: "Real", value: countByKey("account_type", "Real") },
    { name: "Fake", value: countByKey("account_type", "Fake") },
  ];

  const usernameByStatus = [
    { name: "Active", value: countByKey("activity_level", ["High", "Medium"]) },
    { name: "Inactive", value: inactiveAccounts },
  ];

  const followerSumByUsername = data.map((d) => ({
    name: d.username,
    followers: d.follower_count,
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Social Gaze - A Social Media Analyzing Tool</h1>

      {/* Stats */}
      <h3>Cards</h3>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div>Active Accounts: {activeAccounts}</div>
        <div>Inactive Accounts: {inactiveAccounts}</div>
        <div>Accounts with Profile Picture: {profilePictureCount}</div>
      </div>

      {/* Pie Chart for Regions */}
      <h3>Region wise accounts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={regionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {regionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28"][index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>


      {/* Bar Chart for Account Status */}
      <h3>Active vs inactive accounts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={usernameByStatus}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart for Account Type */}
      <h3>Real vs fake accounts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={accountTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {accountTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#FF8042", "#0088FE"][index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>



      
      <h3>Number of influencers in each region</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={infludata}>
          <XAxis dataKey="account_type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
