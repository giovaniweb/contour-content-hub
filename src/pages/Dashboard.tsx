
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'usuário';
  
  console.log("Dashboard - Rendering with user:", userName);
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 space-y-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {userName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Esta é sua página de dashboard.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
