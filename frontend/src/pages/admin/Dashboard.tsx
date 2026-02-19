import React from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleStatClick = (stat: string) => {
    navigate(`/admin/${stat}`);
  };

  return <DashboardStats onStatClick={handleStatClick} />;
};

export default Dashboard;
