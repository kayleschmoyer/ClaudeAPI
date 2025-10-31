import React from 'react';
import { RequestBuilder } from './features/request-builder/RequestBuilder';
import { ResponseViewer } from './features/response-viewer/ResponseViewer';
import { ActivityLog } from './features/activity-log/ActivityLog';
import { useRequestState } from './hooks/useRequestState';
import { useActivityLog } from './hooks/useActivityLog';
import { sendRequest } from './services/apiClient';
import { theme } from './styles/theme';

function App() {
  const { config, setConfig, response, setResponse, loading, setLoading } = useRequestState();
  const { activities, addActivities } = useActivityLog();

  const handleSend = async () => {
    setLoading(true);
    try {
      const result = await sendRequest(config);
      if (result.success && result.data) {
        setResponse(result.data);
      }
      if (result.activities) {
        addActivities(result.activities);
      }
    } catch (error: any) {
      console.error('Request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const headerStyle: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.lg,
    boxShadow: theme.colors.shadow,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xl,
    fontWeight: 700,
    color: theme.colors.text,
    margin: 0
  };

  const mainStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    height: 'calc(100vh - 80px)',
    overflow: 'hidden'
  };

  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden'
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>API Console</h1>
      </header>
      <main style={mainStyle}>
        <div style={columnStyle}>
          <RequestBuilder
            config={config}
            onChange={setConfig}
            onSend={handleSend}
            loading={loading}
          />
        </div>
        <div style={columnStyle}>
          <ResponseViewer response={response} />
        </div>
        <div style={columnStyle}>
          <ActivityLog activities={activities} />
        </div>
      </main>
    </div>
  );
}

export default App;
