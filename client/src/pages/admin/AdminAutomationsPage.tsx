import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';
import {
  Zap, Plus, Edit, Trash2, Play, Pause, Send, Clock, CalendarCheck,
  ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle, Loader2,
  Mail, TestTube
} from 'lucide-react';

interface Automation {
  id: number;
  name: string;
  description: string | null;
  triggerType: string;
  offsetHours: number;
  emailSubject: string;
  emailBodyHtml: string;
  questionnaireSlug: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AutomationLog {
  id: number;
  automationId: number;
  bookingId: string;
  clientEmail: string;
  clientName: string | null;
  status: string;
  errorMessage: string | null;
  sentAt: string;
}

const OFFSET_PRESETS = [
  { label: '7 Tage vorher', value: -168 },
  { label: '3 Tage vorher', value: -72 },
  { label: '2 Tage vorher', value: -48 },
  { label: '1 Tag vorher', value: -24 },
  { label: '2 Stunden vorher', value: -2 },
  { label: '1 Stunde danach', value: 1 },
  { label: '2 Stunden danach', value: 2 },
  { label: '1 Tag danach', value: 24 },
  { label: '3 Tage danach', value: 72 },
  { label: '1 Woche danach', value: 168 },
];

function formatOffset(hours: number): string {
  const abs = Math.abs(hours);
  const direction = hours < 0 ? 'vor' : 'nach';
  if (abs >= 168) return `${Math.round(abs / 168)} Woche(n) ${direction} dem Termin`;
  if (abs >= 24) return `${Math.round(abs / 24)} Tag(e) ${direction} dem Termin`;
  return `${abs} Stunde(n) ${direction} dem Termin`;
}

const AdminAutomationsPage: React.FC = () => {
  const { language } = useLanguage();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<number | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [testSending, setTestSending] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTriggerType, setFormTriggerType] = useState('before_booking');
  const [formOffsetHours, setFormOffsetHours] = useState(-48);
  const [formSubject, setFormSubject] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formQuestionnaire, setFormQuestionnaire] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAutomations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/automations', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAutomations(data);
    } catch (err) {
      setError('Fehler beim Laden der Automatisierungen');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAutomations(); }, [fetchAutomations]);

  const fetchLogs = async (automationId: number) => {
    if (expandedLogs === automationId) {
      setExpandedLogs(null);
      return;
    }
    setLogsLoading(true);
    setExpandedLogs(automationId);
    try {
      const res = await fetch(`/api/admin/automations/${automationId}/logs`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch { }
    setLogsLoading(false);
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormTriggerType('before_booking');
    setFormOffsetHours(-48);
    setFormSubject('');
    setFormBody('');
    setFormQuestionnaire('');
    setFormEnabled(true);
    setEditingId(null);
  };

  const openNew = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (a: Automation) => {
    setFormName(a.name);
    setFormDescription(a.description || '');
    setFormTriggerType(a.triggerType);
    setFormOffsetHours(a.offsetHours);
    setFormSubject(a.emailSubject);
    setFormBody(a.emailBodyHtml);
    setFormQuestionnaire(a.questionnaireSlug || '');
    setFormEnabled(a.enabled);
    setEditingId(a.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName || !formSubject || !formBody) {
      setError('Name, Betreff und E-Mail-Inhalt sind erforderlich');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: formName,
        description: formDescription || null,
        triggerType: formTriggerType,
        offsetHours: formOffsetHours,
        emailSubject: formSubject,
        emailBodyHtml: formBody,
        questionnaireSlug: formQuestionnaire || null,
        enabled: formEnabled,
      };

      const url = editingId ? `/api/admin/automations/${editingId}` : '/api/admin/automations';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method, credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');
      setShowForm(false);
      resetForm();
      fetchAutomations();
      setSuccessMsg(editingId ? 'Automatisierung aktualisiert' : 'Automatisierung erstellt');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setError('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Diese Automatisierung wirklich löschen?')) return;
    try {
      await fetch(`/api/admin/automations/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchAutomations();
    } catch {
      setError('Fehler beim Löschen');
    }
  };

  const handleToggle = async (a: Automation) => {
    try {
      await fetch(`/api/admin/automations/${a.id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !a.enabled }),
      });
      fetchAutomations();
    } catch {
      setError('Fehler beim Ändern des Status');
    }
  };

  const handleTest = async (id: number) => {
    setTestSending(id);
    try {
      const res = await fetch(`/api/admin/automations/${id}/test`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Test-E-Mail gesendet!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.error || 'Test fehlgeschlagen');
      }
    } catch {
      setError('Fehler beim Senden der Test-E-Mail');
    } finally {
      setTestSending(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="text-purple-600" size={28} />
              E-Mail-Automatisierungen
            </h1>
            <p className="text-gray-600 mt-1">
              Automatische E-Mails vor und nach Fotoshooting-Terminen
            </p>
          </div>
          <button
            onClick={openNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Neue Automatisierung
          </button>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>So funktioniert's:</strong> Automatisierungen senden E-Mails basierend auf dem Datum bestätigter Buchungen.
            Das System prüft alle 30 Minuten, ob eine E-Mail fällig ist. Verwenden Sie <code className="bg-blue-100 px-1 rounded">{'{{clientName}}'}</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">{'{{bookingDate}}'}</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">{'{{bookingTime}}'}</code> und{' '}
            <code className="bg-blue-100 px-1 rounded">{'{{questionnaireLink}}'}</code> als Platzhalter.
          </p>
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} /> {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {/* Automation List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : automations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Mail className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Noch keine Automatisierungen erstellt</p>
            <button onClick={openNew} className="mt-4 text-purple-600 hover:text-purple-700 font-medium">
              + Erste Automatisierung erstellen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {automations.map(a => (
              <div key={a.id} className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${a.enabled ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{a.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${a.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {a.enabled ? <><CheckCircle size={12} /> Aktiv</> : <><Pause size={12} /> Pausiert</>}
                        </span>
                      </div>
                      {a.description && <p className="text-gray-500 text-sm mb-2">{a.description}</p>}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatOffset(a.offsetHours)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {a.emailSubject.substring(0, 50)}{a.emailSubject.length > 50 ? '...' : ''}
                        </span>
                        {a.questionnaireSlug && (
                          <span className="flex items-center gap-1 text-purple-600">
                            <CalendarCheck size={14} />
                            Fragebogen: {a.questionnaireSlug}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleTest(a.id)}
                        disabled={testSending === a.id}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Test-E-Mail senden"
                      >
                        {testSending === a.id ? <Loader2 size={16} className="animate-spin" /> : <TestTube size={16} />}
                      </button>
                      <button
                        onClick={() => handleToggle(a)}
                        className={`p-2 rounded-lg transition-colors ${a.enabled ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={a.enabled ? 'Pausieren' : 'Aktivieren'}
                      >
                        {a.enabled ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={() => openEdit(a)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => fetchLogs(a.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Gesendete E-Mails anzeigen"
                      >
                        {expandedLogs === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logs */}
                {expandedLogs === a.id && (
                  <div className="border-t bg-gray-50 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Gesendete E-Mails</h4>
                    {logsLoading ? (
                      <Loader2 className="animate-spin text-gray-400" size={20} />
                    ) : logs.length === 0 ? (
                      <p className="text-gray-400 text-sm">Noch keine E-Mails gesendet</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {logs.map(log => (
                          <div key={log.id} className="flex items-center justify-between bg-white p-3 rounded border text-sm">
                            <div className="flex items-center gap-3">
                              {log.status === 'sent' ? (
                                <CheckCircle size={14} className="text-green-500" />
                              ) : (
                                <XCircle size={14} className="text-red-500" />
                              )}
                              <span className="font-medium">{log.clientName || log.clientEmail}</span>
                              <span className="text-gray-400">{log.clientEmail}</span>
                            </div>
                            <div className="text-gray-400">
                              {new Date(log.sentAt).toLocaleString('de-AT', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Automatisierung bearbeiten' : 'Neue Automatisierung'}
                </h2>
              </div>
              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                    placeholder="z.B. Fragebogen vor dem Shooting"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                  <input
                    type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Kurze Beschreibung des Zwecks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zeitpunkt</label>
                    <select
                      value={formOffsetHours}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        setFormOffsetHours(v);
                        setFormTriggerType(v < 0 ? 'before_booking' : 'after_booking');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {OFFSET_PRESETS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fragebogen-Slug (optional)</label>
                    <input
                      type="text" value={formQuestionnaire} onChange={(e) => setFormQuestionnaire(e.target.value)}
                      placeholder="z.B. pre-shoot"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Betreff *</label>
                  <input
                    type="text" value={formSubject} onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Verwenden Sie {{clientName}}, {{bookingDate}}, {{bookingTime}}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Inhalt (HTML) *</label>
                  <textarea
                    value={formBody} onChange={(e) => setFormBody(e.target.value)}
                    rows={12}
                    placeholder="HTML-E-Mail-Inhalt mit {{clientName}}, {{bookingDate}}, {{bookingTime}}, {{questionnaireLink}}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Platzhalter: {'{{clientName}}'}, {'{{bookingDate}}'}, {'{{bookingTime}}'}, {'{{questionnaireLink}}'}
                  </p>
                </div>

                {/* Enabled */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox" checked={formEnabled} onChange={(e) => setFormEnabled(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Automatisierung sofort aktivieren</label>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {editingId ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAutomationsPage;
