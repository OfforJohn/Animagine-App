"use client";
import { User } from "firebase/auth";

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div>
      <h1>Welcome to the Dashboard, {user?.email}</h1>
    </div>
  );
};

export default Dashboard;
