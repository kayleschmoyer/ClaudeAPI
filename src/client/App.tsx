import React, { useState } from 'react';
import { COLORS } from '../shared/constants/colors';

interface ActivityCard {
  timestamp: string;
  mode: string;
  status: 'Created' | 'Failed';
  httpCode: number;
  requestBody: any;
  responseBody: any;
  productNumber?: string;
  message?: string;
  details?: string[];
}

interface ResultSummary {
  totalRows: number;
  succeeded: number;
  failed: number;
  results: {
    rowNumber: number;
    status: string;
    httpCode: number;
    productNumber?: string;
    message?: string;
    details?: string[];
  }[];
}

type InputMode = 'manual' | 'csv';
type FilterMode = 'all' | 'errors';

function App() {
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [mode, setMode] = useState<InputMode>('manual');
  const [manualBody, setManualBody] = useState('{\n  \n}');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [responseSummary, setResponseSummary] = useState<ResultSummary | any>(null);
  const [activityLog, setActivityLog] = useState<ActivityCard[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [loading, setLoading] = useState(false);

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }

    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setCsvRows(parsed);
      };
      reader.readAsText(file);
    }
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    setLoading(true);

    try {
      if (mode === 'manual') {
        const response = await fetch('/api/sendRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseUrl,
            token,
            body: JSON.parse(manualBody)
          })
        });

        const result = await response.json();

        setResponseSummary({
          httpStatusCode: result.httpStatusCode,
          responseBody: result.responseBody
        });

        const card: ActivityCard = {
          timestamp: new Date().toISOString(),
          mode: 'Manual',
          status: result.httpStatusCode >= 200 && result.httpStatusCode < 300 ? 'Created' : 'Failed',
          httpCode: result.httpStatusCode,
          requestBody: result.requestBody,
          responseBody: result.responseBody
        };

        setActivityLog(prev => [...prev, card]);
      } else {
        const response = await fetch('/api/bulkImport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseUrl,
            token,
            rows: csvRows
          })
        });

        const result = await response.json();

        setResponseSummary(result.summary);

        const cards: ActivityCard[] = result.logEntries.map((entry: any) => ({
          timestamp: entry.timestamp,
          mode: `Row #${entry.rowNumber}`,
          status: entry.status,
          httpCode: entry.httpStatusCode,
          requestBody: entry.requestBody,
          responseBody: entry.responseBody,
          productNumber: entry.productNumber,
          message: entry.message,
          details: entry.details
        }));

        setActivityLog(prev => [...prev, ...cards]);
      }
    } catch (error: any) {
      console.error('Request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLog = filterMode === 'errors'
    ? activityLog.filter(card => card.status === 'Failed')
    : activityLog;

  const downloadFullLog = () => {
    downloadJSON(filteredLog, 'activity-log.json');
  };

  const downloadResultsSummary = () => {
    if (responseSummary) {
      downloadJSON(responseSummary, 'results-summary.json');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: COLORS.WHITE,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        background: COLORS.BISCUIT,
        padding: '24px',
        borderBottom: `2px solid ${COLORS.CHARCOAL}`
      }}>
        <h1 style={{
          margin: 0,
          color: COLORS.CHARCOAL,
          fontSize: '28px',
          fontWeight: 700
        }}>
          API Console - Request Builder
        </h1>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px',
        padding: '24px',
        height: 'calc(100vh - 100px)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflow: 'auto'
        }}>
          <section style={{
            background: COLORS.WHITE,
            border: `1px solid ${COLORS.CHARCOAL}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h2 style={{
              margin: '0 0 16px 0',
              color: COLORS.CHARCOAL,
              fontSize: '18px',
              fontWeight: 600
            }}>
              Request Settings
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: COLORS.CHARCOAL,
                fontSize: '14px',
                fontWeight: 500
              }}>
                API Base URL
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.CHARCOAL}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: COLORS.CHARCOAL,
                fontSize: '14px',
                fontWeight: 500
              }}>
                Bearer Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Your bearer token"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.CHARCOAL}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{
              background: COLORS.BISCUIT,
              padding: '12px',
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '12px',
                color: COLORS.CHARCOAL,
                marginBottom: '8px',
                fontWeight: 600
              }}>
                Headers (auto-generated)
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: COLORS.CHARCOAL
              }}>
                <div>Content-Type: application/json</div>
                <div>Accept: application/json</div>
                <div>Authorization: Bearer {token ? '***' : '(not set)'}</div>
              </div>
            </div>
          </section>

          <section style={{
            background: COLORS.WHITE,
            border: `1px solid ${COLORS.CHARCOAL}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h2 style={{
              margin: '0 0 16px 0',
              color: COLORS.CHARCOAL,
              fontSize: '18px',
              fontWeight: 600
            }}>
              Request Input Mode
            </h2>

            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <span style={{ color: COLORS.CHARCOAL, fontSize: '14px' }}>Manual JSON</span>
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="mode"
                  value="csv"
                  checked={mode === 'csv'}
                  onChange={() => setMode('csv')}
                />
                <span style={{ color: COLORS.CHARCOAL, fontSize: '14px' }}>CSV Import</span>
              </label>
            </div>

            {mode === 'manual' ? (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: COLORS.CHARCOAL,
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Request Body (JSON)
                </label>
                <textarea
                  value={manualBody}
                  onChange={(e) => setManualBody(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '12px',
                    border: `1px solid ${COLORS.CHARCOAL}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
              </div>
            ) : (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: COLORS.CHARCOAL,
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}
                />
                {csvFile && (
                  <div style={{
                    background: COLORS.BISCUIT,
                    padding: '12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: COLORS.CHARCOAL
                  }}>
                    <div><strong>File:</strong> {csvFile.name}</div>
                    <div><strong>Rows:</strong> {csvRows.length}</div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={loading || !baseUrl || !token || (mode === 'csv' && csvRows.length === 0)}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px 24px',
                background: COLORS.KLIPBOARD_MAGENTA,
                color: COLORS.WHITE,
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Sending...' : mode === 'manual' ? 'Send Request' : 'Send All'}
            </button>
          </section>
        </div>

        <div style={{
          background: COLORS.WHITE,
          border: `1px solid ${COLORS.CHARCOAL}`,
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{
              margin: 0,
              color: COLORS.CHARCOAL,
              fontSize: '18px',
              fontWeight: 600
            }}>
              Response
            </h2>
            {responseSummary && mode === 'csv' && (
              <button
                onClick={downloadResultsSummary}
                style={{
                  padding: '6px 12px',
                  background: COLORS.CHARCOAL,
                  color: COLORS.WHITE,
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Download Results JSON
              </button>
            )}
          </div>

          <div style={{
            flex: 1,
            overflow: 'auto',
            background: COLORS.BISCUIT,
            padding: '12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: COLORS.CHARCOAL
          }}
          className="custom-scrollbar"
          >
            {responseSummary ? (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(responseSummary, null, 2)}
              </pre>
            ) : (
              <div style={{ color: '#999', fontStyle: 'italic' }}>
                No response yet. Send a request to see results.
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            background: COLORS.WHITE,
            border: `1px solid ${COLORS.CHARCOAL}`,
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h2 style={{
                margin: 0,
                color: COLORS.CHARCOAL,
                fontSize: '18px',
                fontWeight: 600
              }}>
                Activity / Results Log
              </h2>
              <button
                onClick={downloadFullLog}
                disabled={filteredLog.length === 0}
                style={{
                  padding: '6px 12px',
                  background: COLORS.CHARCOAL,
                  color: COLORS.WHITE,
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: filteredLog.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: filteredLog.length > 0 ? 1 : 0.5
                }}
              >
                Download Full Log
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${COLORS.CHARCOAL}`,
                  borderRadius: '4px',
                  fontSize: '13px',
                  background: COLORS.WHITE
                }}
              >
                <option value="all">All</option>
                <option value="errors">Errors Only</option>
              </select>
            </div>

            <div
              style={{
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              className="custom-scrollbar"
            >
              {filteredLog.length === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#999',
                  fontStyle: 'italic'
                }}>
                  No activity yet
                </div>
              ) : (
                filteredLog.map((card, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: COLORS.BISCUIT,
                      border: `1px solid ${COLORS.CHARCOAL}`,
                      borderRadius: '6px',
                      padding: '12px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '11px',
                        color: COLORS.CHARCOAL
                      }}>
                        {new Date(card.timestamp).toLocaleString()} | {card.mode}
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: card.status === 'Created' ? COLORS.KLIPBOARD_MAGENTA : COLORS.WHITE,
                        color: card.status === 'Created' ? COLORS.WHITE : COLORS.CHARCOAL,
                        border: card.status === 'Created' ? 'none' : `1px solid ${COLORS.CHARCOAL}`
                      }}>
                        {card.status}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: COLORS.CHARCOAL,
                      marginBottom: '8px'
                    }}>
                      <strong>HTTP {card.httpCode}</strong>
                      {card.productNumber && ` | Product: ${card.productNumber}`}
                    </div>

                    {card.message && (
                      <div style={{
                        fontSize: '11px',
                        color: '#D32F2F',
                        marginBottom: '8px'
                      }}>
                        {card.message}
                      </div>
                    )}

                    {card.details && card.details.length > 0 && (
                      <div style={{
                        fontSize: '11px',
                        color: '#D32F2F',
                        marginBottom: '8px'
                      }}>
                        {card.details.map((d, i) => <div key={i}>• {d}</div>)}
                      </div>
                    )}

                    <details style={{ marginTop: '8px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: COLORS.CHARCOAL,
                        fontWeight: 600,
                        marginBottom: '4px'
                      }}>
                        Request Sent
                      </summary>
                      <pre style={{
                        margin: '4px 0 0 0',
                        fontSize: '10px',
                        background: COLORS.WHITE,
                        padding: '8px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '150px'
                      }}
                      className="custom-scrollbar"
                      >
                        {JSON.stringify(card.requestBody, null, 2)}
                      </pre>
                    </details>

                    <details style={{ marginTop: '8px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: COLORS.CHARCOAL,
                        fontWeight: 600,
                        marginBottom: '4px'
                      }}>
                        Response
                      </summary>
                      <pre style={{
                        margin: '4px 0 0 0',
                        fontSize: '10px',
                        background: COLORS.WHITE,
                        padding: '8px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '150px'
                      }}
                      className="custom-scrollbar"
                      >
                        {JSON.stringify(card.responseBody, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${COLORS.BISCUIT};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${COLORS.CHARCOAL};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.KLIPBOARD_MAGENTA};
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: ${COLORS.CHARCOAL} ${COLORS.BISCUIT};
        }
      `}</style>
    </div>
  );
}

export default App;
