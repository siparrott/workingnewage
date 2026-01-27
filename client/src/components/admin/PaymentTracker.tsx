import React, { useState, useEffect } from 'react';
import { X, Plus, CreditCard, Calendar, DollarSign, Trash2, ChevronDown, Mail, FileText, Settings, PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { addInvoicePayment } from '../../api/invoices';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  payment_date: string;
  notes?: string;
  created_at: string;
}

interface CustomPaymentMethod {
  id: string;
  name: string;
  label: string;
  is_active: boolean;
  sort_order: number;
}

interface PaymentTrackerProps {
  invoiceId: string;
  invoiceTotal: number;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentAdded: () => void;
}

const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  invoiceId,
  invoiceTotal,
  currency,
  isOpen,
  onClose,
  onPaymentAdded
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [sendEmailReceipt, setSendEmailReceipt] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [customMethods, setCustomMethods] = useState<CustomPaymentMethod[]>([]);
  const [showAddCustomMethod, setShowAddCustomMethod] = useState(false);
  const [newCustomMethodLabel, setNewCustomMethodLabel] = useState('');
  const [useCustomMethod, setUseCustomMethod] = useState(false);
  const [customMethodInput, setCustomMethodInput] = useState('');
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    payment_method: '',
    payment_reference: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPayments();
      fetchCustomMethods();
    }
  }, [isOpen, invoiceId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/crm/invoices/${invoiceId}/payments`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const data = await response.json();
      setPayments(data || []);
    } catch (err) {
      // console.error removed
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomMethods = async () => {
    try {
      const response = await fetch('/api/settings/payment-methods', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCustomMethods(data.methods || []);
      }
    } catch (err) {
      // Silently fail - custom methods are optional
    }
  };

  const handleAddCustomMethod = async () => {
    if (!newCustomMethodLabel.trim()) return;
    try {
      const response = await fetch('/api/settings/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          name: newCustomMethodLabel.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          label: newCustomMethodLabel.trim()
        })
      });
      if (response.ok) {
        setNewCustomMethodLabel('');
        setShowAddCustomMethod(false);
        await fetchCustomMethods();
      }
    } catch (err) {
      setError('Failed to add custom payment method');
    }
  };

  const handleDeleteCustomMethod = async (methodId: string) => {
    try {
      await fetch(`/api/settings/payment-methods/${methodId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      await fetchCustomMethods();
    } catch (err) {
      setError('Failed to delete payment method');
    }
  };

  const handleAddPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use custom method input if in custom mode
      const paymentMethod = useCustomMethod ? customMethodInput : newPayment.payment_method;

      const response = await fetch(`/api/crm/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newPayment,
          payment_method: paymentMethod
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add payment');
      }
      
      // Reset form
      setNewPayment({
        amount: 0,
        payment_method: '',
        payment_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setUseCustomMethod(false);
      setCustomMethodInput('');
      setShowAddPayment(false);
      setShowNotes(false);
      setSendEmailReceipt(false);
      await fetchPayments();
      onPaymentAdded();
    } catch (err) {
      // console.error removed
      setError('Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      setLoading(true);
      
      const response = await fetch(`/api/crm/invoices/${invoiceId}/payments/${paymentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }
      
      await fetchPayments();
      onPaymentAdded();
    } catch (err) {
      // console.error removed
      setError('Failed to delete payment');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = invoiceTotal - totalPaid;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getPaymentMethodLabel = (method: string) => {
    const standardMethods: { [key: string]: string } = {
      bank_transfer: 'E-Transfer / Banküberweisung',
      credit_card: 'Bankkarte',
      bankkarte: 'Bankkarte',
      bar: 'Bar',
      cash: 'Bar',
      e_transfer: 'E-Transfer / Banküberweisung',
      klarna: 'Klarna',
      paypal: 'PayPal',
      stripe: 'Stripe',
      check: 'Scheck',
      other: 'Andere'
    };
    // Check standard methods first
    if (standardMethods[method]) {
      return standardMethods[method];
    }
    // Check custom methods
    const customMethod = customMethods.find(m => m.name === method);
    if (customMethod) {
      return customMethod.label;
    }
    // Return the method name as-is (for custom free-text entries)
    return method;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Tracker</h2>
            <p className="text-gray-600">Track payments for this invoice</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Invoice Total</p>
                  <p className="text-lg font-semibold">{formatCurrency(invoiceTotal)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(remainingBalance)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Payment Button - Sprout Studio Style */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <h3 className="text-base font-semibold text-gray-800 uppercase tracking-wide">PAYMENTS</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm font-medium text-white bg-cyan-500 rounded hover:bg-cyan-600">
                Due Now
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                Due In
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                Schedule
              </button>
            </div>
          </div>
          
          {/* Payments Table Header */}
          <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b mb-2">
            <div>PAID ON</div>
            <div className="text-center">AMOUNT</div>
            <div className="text-right">PAID VIA</div>
          </div>
          
          {/* Add Payment Link */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddPayment(true)}
              className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add Payment
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Add Payment Form - Sprout Studio Style Modal */}
          {showAddPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
                      <span className="text-lg">⊖</span>
                    </button>
                    <button 
                      onClick={() => { setShowAddPayment(false); setShowNotes(false); }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                  {/* Payment Date & Method Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Payment Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={newPayment.payment_date}
                          onChange={(e) => setNewPayment(prev => ({ ...prev, payment_date: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Payment Method
                      </label>
                      {!useCustomMethod ? (
                        <div className="space-y-2">
                          <select
                            value={newPayment.payment_method}
                            onChange={(e) => {
                              if (e.target.value === '__custom__') {
                                setUseCustomMethod(true);
                                setNewPayment(prev => ({ ...prev, payment_method: '' }));
                              } else {
                                setNewPayment(prev => ({ ...prev, payment_method: e.target.value }));
                              }
                            }}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 appearance-none bg-white"
                          >
                            <option value="">Select a payment method ...</option>
                            <optgroup label="Standard Methods">
                              <option value="bankkarte">Bankkarte</option>
                              <option value="bar">Bar</option>
                              <option value="bank_transfer">E-Transfer / Banküberweisung</option>
                              <option value="klarna">Klarna</option>
                              <option value="stripe">Stripe</option>
                              <option value="paypal">PayPal</option>
                            </optgroup>
                            {customMethods.length > 0 && (
                              <optgroup label="Custom Methods">
                                {customMethods.map(method => (
                                  <option key={method.id} value={method.name}>{method.label}</option>
                                ))}
                              </optgroup>
                            )}
                            <optgroup label="Other">
                              <option value="__custom__">+ Add custom method...</option>
                            </optgroup>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customMethodInput}
                              onChange={(e) => setCustomMethodInput(e.target.value)}
                              placeholder="Enter payment method name..."
                              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setUseCustomMethod(false);
                                setCustomMethodInput('');
                              }}
                              className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                if (customMethodInput.trim()) {
                                  // Save as new custom method for future use
                                  try {
                                    const response = await fetch('/api/settings/payment-methods', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({ 
                                        name: customMethodInput.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                                        label: customMethodInput.trim()
                                      })
                                    });
                                    if (response.ok) {
                                      await fetchCustomMethods();
                                    }
                                  } catch (err) {
                                    // Silently fail
                                  }
                                }
                              }}
                              className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center"
                            >
                              <PlusCircle size={12} className="mr-1" />
                              Save for future use
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Payment Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newPayment.amount || ''}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 text-right"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </div>

                  {/* Show Notes Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                  >
                    <Plus size={14} className="mr-1" />
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                  </button>

                  {/* Notes Field (Conditional) */}
                  {showNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={newPayment.notes}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700"
                        placeholder="Additional notes about this payment..."
                      />
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() => { setShowAddPayment(false); setShowNotes(false); }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Close
                  </button>
                  
                  {/* Add Payment + Email Receipt Dropdown Button */}
                  <div className="relative">
                    <div className="flex">
                      <button
                        onClick={() => { setSendEmailReceipt(false); handleAddPayment(); }}
                        disabled={loading || newPayment.amount <= 0 || (!newPayment.payment_method && !customMethodInput)}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-l-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center"
                      >
                        {loading ? 'Adding...' : 'Add Payment'}
                      </button>
                      <button
                        onClick={() => setShowActionDropdown(!showActionDropdown)}
                        disabled={loading || newPayment.amount <= 0 || (!newPayment.payment_method && !customMethodInput)}
                        className="px-2 py-2 bg-cyan-500 text-white rounded-r-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed border-l border-cyan-400"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    
                    {showActionDropdown && (
                      <div className="absolute right-0 bottom-full mb-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setShowActionDropdown(false);
                            setSendEmailReceipt(true);
                            handleAddPayment();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-gray-700"
                        >
                          <Mail size={16} className="mr-2 text-cyan-500" />
                          Add Payment + Email Receipt
                        </button>
                        <button
                          onClick={() => {
                            setShowActionDropdown(false);
                            setSendEmailReceipt(false);
                            handleAddPayment();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-gray-700 border-t"
                        >
                          <FileText size={16} className="mr-2 text-cyan-500" />
                          Add Payment Only
                        </button>
                        <button
                          onClick={() => setShowActionDropdown(false)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-red-500 border-t"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments List */}
          {loading && !showAddPayment ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div key={payment.id} className="grid grid-cols-3 gap-4 px-4 py-3 bg-white border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="text-sm text-gray-700">
                    {new Date(payment.payment_date).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm text-gray-600">
                      {getPaymentMethodLabel(payment.payment_method)}
                    </span>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="Delete payment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No payments recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;
