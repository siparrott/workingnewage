import React from 'react';

interface InvoiceTemplateProps {
  invoice: {
    id: string;
    invoice_number: string;
    client_id: string;
    amount: number;
    tax_amount: number;
    total_amount: number;
    subtotal_amount: number;
    discount_amount: number;
    currency: string;
    status: string;
    due_date: string;
    payment_terms: string;
    notes?: string;
    created_at: string;
    client?: {
      name: string;
      email: string;
      address1?: string;
      city?: string;
      country?: string;
      phone?: string;
    };
    items?: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      tax_rate: number;
      line_total: number;
    }>;
  };
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  // Debug: Log what the template receives
  console.log('📄 INVOICE TEMPLATE RECEIVED:', invoice);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }).toUpperCase();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0,00 €';
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' €';
  };

  return (
    <div className="invoice-template bg-white" style={{
      maxWidth: '850px',
      margin: '0 auto',
      padding: '60px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#2c3e50',
      backgroundColor: '#fff',
      boxShadow: '0 0 30px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Header with Logo and Company Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '50px'
      }}>
        {/* Left: Company Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            width: '140px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            borderRadius: '4px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              NEW AGE<br/>FOTOGRAFIE
            </div>
          </div>
          <div style={{ fontSize: '11px', lineHeight: '1.6', color: '#666' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#2c3e50' }}>
              Büro & Korrespondenz-Adresse:
            </div>
            <div>Julius-Tandler-Platz 5 / 13</div>
            <div>Eingang Ecke Schönbrunner Str.</div>
            <div>1090, Austria</div>
          </div>
        </div>

        {/* Right: Invoice Header */}
        <div style={{ textAlign: 'right' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '300',
            margin: '0 0 15px 0',
            color: '#2c3e50',
            letterSpacing: '3px'
          }}>
            INVOICE
          </h1>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: '#667eea',
            marginBottom: '15px'
          }}>
            #{invoice.invoice_number}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: '#666',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            INVOICED: {formatDate(invoice.created_at)}
          </div>
        </div>
      </div>

      {/* Ship To and Bill To Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginBottom: '50px'
      }}>
        {/* Ship To */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#667eea',
            marginBottom: '12px'
          }}>
            SHIP TO:
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#2c3e50' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {invoice.client?.name || 'N/A'}
            </div>
            <div style={{ color: '#666' }}>{invoice.client?.address1 || 'N/A'}</div>
            <div style={{ color: '#666' }}>
              {invoice.client?.city ? `Wien, ${invoice.client.city}` : 'Wien, Wien'}
            </div>
            <div style={{ color: '#666' }}>
              {invoice.client?.country || '1179, Austria'}
            </div>
            <div style={{ color: '#666', marginTop: '6px' }}>
              {invoice.client?.email || 'N/A'}
            </div>
            {invoice.client?.phone && (
              <div style={{ color: '#666' }}>{invoice.client.phone}</div>
            )}
          </div>
        </div>

        {/* Bill To */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#667eea',
            marginBottom: '12px'
          }}>
            BILL TO:
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#2c3e50' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {invoice.client?.name || 'N/A'}
            </div>
            <div style={{ color: '#666' }}>{invoice.client?.address1 || 'N/A'}</div>
            <div style={{ color: '#666' }}>
              {invoice.client?.city ? `Wien, ${invoice.client.city}` : 'Wien, Wien'}
            </div>
            <div style={{ color: '#666' }}>
              {invoice.client?.country || '1179, Austria'}
            </div>
            <div style={{ color: '#666', marginTop: '6px' }}>
              {invoice.client?.email || 'N/A'}
            </div>
            {invoice.client?.phone && (
              <div style={{ color: '#666' }}>{invoice.client.phone}</div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '40px'
      }}>
        <thead>
          <tr style={{
            borderBottom: '2px solid #e0e0e0'
          }}>
            <th style={{
              padding: '15px 10px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Name
            </th>
            <th style={{
              padding: '15px 10px',
              textAlign: 'right',
              fontSize: '11px',
              fontWeight: '600',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Price
            </th>
            <th style={{
              padding: '15px 10px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Qty
            </th>
            <th style={{
              padding: '15px 10px',
              textAlign: 'right',
              fontSize: '11px',
              fontWeight: '600',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Line Total
            </th>
            <th style={{
              padding: '15px 10px',
              textAlign: 'right',
              fontSize: '11px',
              fontWeight: '600',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Taxable
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, index) => (
            <tr key={index} style={{
              borderBottom: '1px solid #f0f0f0'
            }}>
              <td style={{ 
                padding: '20px 10px',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: '500', color: '#2c3e50', marginBottom: '4px' }}>
                  {item.description}
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  Image & Produktdatei
                </div>
              </td>
              <td style={{ 
                padding: '20px 10px',
                textAlign: 'right',
                fontSize: '13px',
                color: '#2c3e50'
              }}>
                {formatCurrency(item.unit_price, invoice.currency)}
              </td>
              <td style={{ 
                padding: '20px 10px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#2c3e50'
              }}>
                {item.quantity}
              </td>
              <td style={{ 
                padding: '20px 10px',
                textAlign: 'right',
                fontSize: '13px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {formatCurrency(item.line_total, invoice.currency)}
              </td>
              <td style={{ 
                padding: '20px 10px',
                textAlign: 'right',
                fontSize: '13px',
                color: '#2c3e50'
              }}>
                {formatCurrency(item.line_total * (item.tax_rate || 0) / 100, invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '60px'
      }}>
        <div style={{ width: '350px' }}>
          {/* Subtotal */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 20px',
            fontSize: '13px',
            color: '#666'
          }}>
            <span>Subtotal:</span>
            <span style={{ fontWeight: '500', color: '#2c3e50' }}>
              {formatCurrency(invoice.subtotal_amount, invoice.currency)}
            </span>
          </div>

          {/* VAT */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 20px',
            fontSize: '13px',
            color: '#666'
          }}>
            <span>VAT (20%):</span>
            <span style={{ fontWeight: '500', color: '#2c3e50' }}>
              {formatCurrency(invoice.tax_amount, invoice.currency)}
            </span>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#f8f9fa',
            marginTop: '10px',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#2c3e50' }}>Total:</span>
            <span style={{ color: '#667eea', fontSize: '16px' }}>
              {formatCurrency(invoice.total_amount, invoice.currency)}
            </span>
          </div>

          {/* Paid to Date */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 20px',
            fontSize: '13px',
            color: '#666'
          }}>
            <span>Paid to Date:</span>
            <span style={{ fontWeight: '500', color: '#2c3e50' }}>
              {formatCurrency(invoice.status === 'paid' ? invoice.total_amount : 0, invoice.currency)}
            </span>
          </div>

          {/* Invoice Balance */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '4px'
          }}>
            <span>Invoice Total:</span>
            <span>
              {formatCurrency(invoice.status === 'paid' ? 0 : invoice.total_amount, invoice.currency)}
            </span>
          </div>

          {/* Invoice Balance Label */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 20px',
            fontSize: '11px',
            color: '#999'
          }}>
            <span>Invoice Balance:</span>
            <span>
              {formatCurrency(invoice.status === 'paid' ? 0 : invoice.total_amount, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Contact */}
      <div style={{
        textAlign: 'center',
        paddingTop: '30px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{
          fontSize: '11px',
          color: '#999',
          letterSpacing: '0.5px'
        }}>
          NEW AGE FOTOGRAFIE
        </div>
        <div style={{
          fontSize: '11px',
          color: '#999',
          marginTop: '8px'
        }}>
          +43 677 633 99210
        </div>
        <div style={{
          fontSize: '11px',
          color: '#667eea',
          marginTop: '4px'
        }}>
          HALLO@NEWAGEFOTOGRAFIE.COM
        </div>
      </div>

      {/* Paid Stamp - only show if paid */}
      {invoice.status === 'paid' && (
        <div style={{
          position: 'absolute',
          top: '300px',
          right: '100px',
          transform: 'rotate(-25deg)',
          border: '4px solid #27ae60',
          color: '#27ae60',
          fontSize: '48px',
          fontWeight: 'bold',
          padding: '15px 30px',
          borderRadius: '8px',
          opacity: 0.3,
          letterSpacing: '3px'
        }}>
          PAID IN FULL
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplate;
