import React from 'react';
import { useTheme } from '../../common/hooks/useTheme';
import SimulatorDashboard from '../simulator/components/SimulatorDashboard';
import SectionHeader from './components/SectionHeader';
import CuriositiesCard from '../curiosityCard/components/CuriositiesCard';
import DataTable from '../dataTable/DataTable';
import { sampleData, columns, handleExportExcel, handlePrint, handleRefresh } from '../dataTable/DataTableExample';
import NewsSection from '../newsSection/NewsSection';
import '../../styles/App.css'

const HomePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`home-page-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="home-page-content">
        <SectionHeader
          title="Symulator emerytalny"
          date={{
            day: "5",
            month: "października",
            year: "2025"
          }}
          hyperlinkText="Prognoza wpływów i wydatków Funduszu Emerytalnego do 2080 roku"
          hyperlinkUrl="https://www.zus.pl/documents/10182/167761/Publikacja_Fundusz_Emerytalny_2023-2080.pdf/3c2c41c9-6a50-0574-4634-ee9cfa43f286?t=1674049287158 "
        />
        
        <SimulatorDashboard />
        
        <CuriositiesCard />

        <DataTable
          data={sampleData}
          columns={columns}
          title="Losowy Przykład"
          loading={false}
          pagination={true}
          pageSize={5}
          showSizeChanger={true}
          showQuickJumper={true}
          showTotal={true}
          scroll={{ x: 'max-content' }}
          size="middle"
          bordered={true}
          striped={true}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onRefresh={handleRefresh}
        />
        
        <NewsSection />
  
      </div>
    </div>
  );
};

export default HomePage; 