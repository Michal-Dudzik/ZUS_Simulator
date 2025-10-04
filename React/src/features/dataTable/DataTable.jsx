import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tooltip, 
  message,
  ConfigProvider
} from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined, 
  FileExcelOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './DataTable.css';

const DataTable = ({
  data = [],
  columns = [],
  title = 'Data Table',
  loading = false,
  scrollHeight = 400,
  size = 'middle',
  bordered = true,
  striped = true,
  onExportExcel,
  onPrint,
  className = ''
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  // Handle row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // Export to Excel functionality
  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      
      if (onExportExcel) {
        await onExportExcel(data, selectedRowKeys);
        return;
      }

      // Default export functionality
      const exportData = selectedRowKeys.length > 0 
        ? data.filter((_, index) => selectedRowKeys.includes(index))
        : data;

      if (exportData.length === 0) {
        message.warning('No data to export');
        return;
      }

      // Prepare data for export
      const worksheetData = exportData.map((item, index) => {
        const row = { '#': index + 1 };
        columns.forEach(col => {
          const key = col.dataIndex || col.key;
          const value = item[key];
          row[col.title || key] = value;
        });
        return row;
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
      message.success(`Data exported successfully as ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  // Print functionality
  const handlePrint = async () => {
    try {
      setPrintLoading(true);
      
      if (onPrint) {
        await onPrint(data, selectedRowKeys);
        return;
      }

      // Default print functionality
      const printData = selectedRowKeys.length > 0 
        ? data.filter((_, index) => selectedRowKeys.includes(index))
        : data;

      if (printData.length === 0) {
        message.warning('No data to print');
        return;
      }

      // Create print window
      const printWindow = window.open('', '_blank');
      const timestamp = new Date().toLocaleString();
      
      // Generate HTML for printing
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - ${timestamp}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #00993F; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .print-info { margin-bottom: 20px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="print-info">
            <p>Printed on: ${timestamp}</p>
            <p>Total records: ${printData.length}</p>
            ${selectedRowKeys.length > 0 ? `<p>Selected records: ${selectedRowKeys.length}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                ${columns.map(col => `<th>${col.title || col.key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${printData.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  ${columns.map(col => {
                    const key = col.dataIndex || col.key;
                    const value = item[key];
                    return `<td>${value || ''}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      
      message.success('Print dialog opened');
    } catch (error) {
      console.error('Print error:', error);
      message.error('Failed to print data');
    } finally {
      setPrintLoading(false);
    }
  };


  // Simple table configuration - no pagination, no footer
  const tableConfig = {
    dataSource: data,
    columns: columns,
    loading,
    pagination: false,
    scroll: {
      y: scrollHeight,
      x: 'max-content'
    },
    size,
    bordered,
    rowKey: (record) => record.id || record.key || record.name || record.title || Math.random().toString(36).substr(2, 9),
    showHeader: true
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00993F',
          colorBgContainer: '#ffffff',
          colorBorder: '#d7dbe7',
        },
      }}
    >
      <Card
        className={`data-table-card ${className}`}
        title={
          <div className="data-table-header">
            <span className="data-table-title">{title}</span>
            <div className="data-table-actions">
              <Space>
                <Tooltip title="Export to Excel">
                  <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    onClick={handleExportExcel}
                    loading={exportLoading}
                    size="small"
                  >
                    Excel
                  </Button>
                </Tooltip>
                <Tooltip title="Print">
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                    loading={printLoading}
                    size="small"
                  >
                    Print
                  </Button>
                </Tooltip>
              </Space>
            </div>
          </div>
        }
        extra={
          selectedRowKeys.length > 0 && (
            <div className="selection-info">
              {selectedRowKeys.length} selected
            </div>
          )
        }
      >
        <Table
          {...tableConfig}
          rowSelection={rowSelection}
          className={`data-table ${striped ? 'striped' : ''}`}
        />
      </Card>
    </ConfigProvider>
  );
};

export default DataTable;
