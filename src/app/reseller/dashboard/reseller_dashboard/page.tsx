// app/reseller-dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const { Title } = Typography;

interface DashboardData {
  subscribed_users: number;
  total_deals: number;
  active_deals: number;
}

interface ChartData {
  months: string[];
  revenue: number[];
  profit: number[];
}

interface UserEngagementData {
  'Active Users': number;
  'Inactive Users': number;
  'New Users': number;
}

const ResellerDashboard: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    subscribed_users: 0,
    total_deals: 0,
    active_deals: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    months: [],
    revenue: [],
    profit: [],
  });

  const [chartData1, setChartData1] = useState<UserEngagementData>({
    'Active Users': 0,
    'Inactive Users': 0,
    'New Users': 0,
  });

  // Auth check
  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

    if (!token) {
      toast.error('User not authenticated. Please log in.');
      router.push('/login');
    }
  }, [router]);

  // Dashboard cards data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.post(
          'https://getdemo.in/pricecut/api/vendor/dashboard',
          { vendor_id: '78' }
        );
        if (response.data) {
          setDashboardData(response.data as DashboardData);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Monthly sales chart
  useEffect(() => {
    const fetchChartData = async () => {
      const vendorId =
        typeof window !== 'undefined'
          ? localStorage.getItem('vendor_id')
          : null;

      if (!vendorId) {
        console.warn('No vendor_id found in localStorage');
        return;
      }

      try {
        const response = await axios.post(
          'https://getdemo.in/pricecut/api/vendor/getMonthlySubscriptions',
          {
            vendor_id: vendorId,
          }
        );

        if (response.data) {
          const { months, revenue, profit } = response.data as ChartData;

          setChartData({
            months: months || [],
            revenue: revenue || [],
            profit: profit || [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch chart data', err);
      }
    };

    fetchChartData();
  }, []);

  // User engagement chart
  useEffect(() => {
    const fetchUserEngagement = async () => {
      const vendorId =
        typeof window !== 'undefined'
          ? localStorage.getItem('vendor_id')
          : null;

      if (!vendorId) {
        console.warn('vendor_id not found in localStorage');
        return;
      }

      try {
        const response = await axios.post(
          'https://getdemo.in/pricecut/api/vendor/userEngagementChart',
          {
            vendor_id: vendorId,
          }
        );

        if (response.data) {
          setChartData1({
            'Active Users': response.data['Active Users'] || 0,
            'Inactive Users': response.data['Inactive Users'] || 0,
            'New Users': response.data['New Users'] || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user engagement data', error);
      }
    };

    fetchUserEngagement();
  }, []);

  const salesChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: any[]) {
        let tooltip = params[0].axisValue + '<br/>';
        params.forEach((item) => {
          tooltip += `${item.marker} ${
            item.seriesName
          }: ₹${item.data.toLocaleString()}<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: ['Revenue', 'Profit'],
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.months,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        color: '#000',
        fontWeight: 'bold',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
      axisLabel: {
        formatter: (value: number) => `₹${value.toLocaleString()}`,
      },
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: chartData.revenue,
        barWidth: '45%',
        itemStyle: {
          color: '#2a2247',
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Profit',
        type: 'line',
        data: chartData.profit,
        smooth: true,
        lineStyle: {
          color: '#b14ede',
          width: 2,
        },
        itemStyle: {
          color: '#b14ede',
        },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
  };

  const userEngagementOptions = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: 0,
    },
    series: [
      {
        name: 'Engagement',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: chartData1['Active Users'], name: 'Active Users' },
          { value: chartData1['Inactive Users'], name: 'Inactive Users' },
          { value: chartData1['New Users'], name: 'New Users' },
        ],
        color: ['#2a2247', '#6B007B', '#323232'],
      },
    ],
  };

  return (
    <div
      className="main-pad"
      style={{
        backgroundColor: '#f5f5f5',
        color:"black",  
        minHeight: '100vh',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} className="top-box">
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#2a2247',
              }}
            >
              <Statistic
                title={
                  <Title level={5} className="text-white">
                    Deal Subscribers
                  </Title>
                }
                value={dashboardData.subscribed_users}
                valueStyle={{ color: '#fff', fontSize: '24px' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} className="top-box">
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#2a2247',
              }}
            >
              <Statistic
                title={
                  <Title level={5} className="text-white">
                    Active Deal
                  </Title>
                }
                value={dashboardData.active_deals}
                valueStyle={{ color: '#fff', fontSize: '24px' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} className="top-box">
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#2a2247',
              }}
            >
              <Statistic
                title={
                  <Title level={5} className="text-white">
                    Publish Deal
                  </Title>
                }
                value={dashboardData.total_deals}
                valueStyle={{ color: '#fff', fontSize: '24px' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12} className="bottom-box-none">
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                border: 'none',
              }}
            >
              <Title level={4}>Monthly Sales Overview</Title>
              <ReactEcharts option={salesChartOptions} style={{ height: '400px' }} />
            </Card>
          </Col>

          <Col xs={24} lg={12} className="bottom-box-none">
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <Title level={4}>User Engagement</Title>
              <ReactEcharts
                option={userEngagementOptions}
                style={{ height: '400px' }}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default ResellerDashboard;
