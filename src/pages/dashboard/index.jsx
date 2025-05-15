import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Dashboard from '../../components/dashboard';

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';



function DashboardPage() {
  return (
    <div className="App">
      <div>
        <Dashboard />
      </div>
    </div>
  );
}

export default DashboardPage;
