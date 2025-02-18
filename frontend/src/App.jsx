import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Container, Paper } from "@mui/material";
import { Chart } from "react-google-charts";

const App = () => {
  const [distinctIPs, setDistinctIPs] = useState([]);
  const [distinctIPsTOP, setDistinctIPsTOP] = useState([]);
  const [hourlyTraffic, setHourlyTraffic] = useState([]);
  const [topIPs, setTopIPs] = useState([]);
  const [topHours, setTopHours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const baseURL = "http://localhost:5000/api/logs";

      const distinctIPsResponse = await axios.get(`${baseURL}/distinct-ips`);
      setDistinctIPsTOP(distinctIPsResponse.data?.slice(0, 200))
      setDistinctIPs(distinctIPsResponse.data);

      const hourlyTrafficResponse = await axios.get(`${baseURL}/hourly-traffic`);
      setHourlyTraffic(hourlyTrafficResponse.data);

      const topIPsResponse = await axios.get(`${baseURL}/top-ips`);
      setTopIPs(topIPsResponse.data);

      const topHoursResponse = await axios.get(`${baseURL}/top-hours`);
      setTopHours(topHoursResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format data for Google Charts
  const formatBarChartData = (data) => {
    return [["IP Address", "Occurrences"], ...data.map((ip) => [ip.ipAddress, ip.occurrences])];
  };

  const formatLineChartData = (data) => {
    return [["Hour", "Visitors"], ...data.map((hour) => [hour.hour, hour.visitors])];
  };

  const formatPieChartData = (data, labelKey, valueKey) => {
    return [["Label", "Value"], ...data.map((item) => [item[labelKey], item[valueKey]])];
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Log Dashboard
        </Typography>
        {loading ? (
          <Typography variant="body1">Loading data...</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Max Occurrence Distinct IP Addresses
              </Typography>
              <Chart
                chartType="Histogram"
                width="100%"
                height="800px"
                data={formatBarChartData(distinctIPsTOP)}
                options={{
                  title: "Distinct IP Addresses",
                  hAxis: { title: "Max Occurrences" },
                  vAxis: { title: "IP Address" },
                }}
              />
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Distinct IP Addresses
              </Typography>
              <Chart
                chartType="Histogram"
                width="100%"
                height="800px"
                data={formatBarChartData(distinctIPs)}
                options={{
                  title: "Distinct IP Addresses",
                  hAxis: { title: "Occurrences" },
                  vAxis: { title: "IP Address" },
                }}
              />
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Hourly Traffic
              </Typography>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={formatLineChartData(hourlyTraffic)}
                options={{
                  title: "Hourly Traffic",
                  hAxis: { title: "Hour" },
                  vAxis: { title: "Visitors" },
                }}
              />
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top IPs (85% Traffic)
              </Typography>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="500px"
                data={formatPieChartData(topIPs, "ipAddress", "occurrences")}
                options={{
                  title: "Top IPs (85% Traffic)",
                }}
              />
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top Hours (70% Traffic)
              </Typography>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={formatPieChartData(topHours, "hour", "visitors")}
                options={{
                  title: "Top Hours (70% Traffic)",
                }}
              />
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default App;