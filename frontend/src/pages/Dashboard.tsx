import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';

const Dashboard: React.FC = () => {
  return (
    <PageLayout>
      <Container className="py-12">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      </Container>
    </PageLayout>
  );
};

export default Dashboard;