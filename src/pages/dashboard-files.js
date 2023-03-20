import React from 'react';
import Meta from 'components/Meta';
import DashboardFilesSection from 'components/DashboardFilesSection';
import { requireAuth } from 'util/auth';

function DashboardFilesPage(props) {
  return (
    <>
      <Meta title="Dashboard" />
      <DashboardFilesSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="View/Download Your Files"
        subtitle=""
      />
    </>
  );
}

export default requireAuth(DashboardFilesPage);
