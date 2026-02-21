import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import InboxSettings from '../../components/admin/InboxSettings';
import SimpleEmailComposer from '../../components/inbox/SimpleEmailComposer';
import { 
  Plus, 
  Search, 
  Filter,
  Mail,
  MailOpen,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Flag,
  Clock,
  User,
  CheckSquare,
  RefreshCw,
  Settings,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Folder,
  FolderPlus,
  Tag,
  Download,
  Edit2,
  Check
} from 'lucide-react';

interface EmailMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  labels: string[];
  folder: string;
  threadId: string;
}

interface EmailFolder {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  isCustom?: boolean;
}

interface CustomFolder {
  id: string;
  name: string;
  color?: string;
}

const AdminInboxPage: React.FC = () => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<EmailMessage | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyMode, setReplyMode] = useState<'reply' | 'forward' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [folderCounts, setFolderCounts] = useState({ inbox: 0, sent: 0, archive: 0, trash: 0 });
  
  // Custom folders state
  const [customFolders, setCustomFolders] = useState<CustomFolder[]>([]);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  
  // More actions dropdown state
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Fetch custom folders
  const fetchCustomFolders = async () => {
    try {
      const response = await fetch('/api/inbox/folders', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomFolders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    }
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const response = await fetch('/api/inbox/folders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (response.ok) {
        const newFolder = await response.json();
        setCustomFolders(prev => [...prev, newFolder]);
        setNewFolderName('');
        setShowNewFolderInput(false);
      }
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  // Update folder name
  const handleUpdateFolder = async (folderId: string) => {
    if (!editingFolderName.trim()) return;
    try {
      const response = await fetch(`/api/inbox/folders/${folderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingFolderName.trim() }),
      });
      if (response.ok) {
        setCustomFolders(prev => prev.map(f => 
          f.id === folderId ? { ...f, name: editingFolderName.trim() } : f
        ));
        setEditingFolderId(null);
        setEditingFolderName('');
      }
    } catch (err) {
      console.error('Failed to update folder:', err);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Delete this folder? Emails in this folder will be moved to inbox.')) return;
    try {
      const response = await fetch(`/api/inbox/folders/${folderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setCustomFolders(prev => prev.filter(f => f.id !== folderId));
        if (selectedFolder === `custom_${folderId}`) {
          setSelectedFolder('inbox');
        }
      }
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  // Move email to folder
  const handleMoveToFolder = async (messageIds: string[], folderId: string) => {
    try {
      const response = await fetch('/api/inbox/emails/move', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds, folderId }),
      });
      if (response.ok) {
        setMessages(prev => prev.map(m => 
          messageIds.includes(m.id) ? { ...m, folder: folderId } : m
        ));
        setSelectedMessages([]);
        fetchFolderCounts();
      }
    } catch (err) {
      console.error('Failed to move emails:', err);
    }
  };

  // Fetch custom folders on mount
  useEffect(() => {
    fetchCustomFolders();
  }, []);

  // Fetch folder counts separately
  const fetchFolderCounts = async () => {
    try {
      // Fetch inbox count
      const inboxResponse = await fetch('/api/inbox/emails?' + Date.now(), {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      });
      const inboxData = inboxResponse.ok ? await inboxResponse.json() : [];
      
      // Fetch sent count
      const sentResponse = await fetch('/api/emails/sent?' + Date.now(), {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      });
      const sentData = sentResponse.ok ? await sentResponse.json() : [];
      
      setFolderCounts({
        inbox: Array.isArray(inboxData) ? inboxData.length : 0,
        sent: Array.isArray(sentData) ? sentData.length : 0,
        archive: 0,
        trash: 0
      });
    } catch (err) {
      // Silently fail for count fetch
    }
  };

  // Fetch folder counts on mount
  useEffect(() => {
    fetchFolderCounts();
  }, []);

  const handleRefreshEmails = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/email/refresh', {
        method: 'POST',
        credentials: 'include', // Include auth cookies
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        // console.log removed
        await fetchMessages(); // Reload messages
        await fetchFolderCounts(); // Reload folder counts
        alert(`Email refresh completed: ${result.newEmails} new emails imported`);
      } else {
        throw new Error('Failed to refresh emails');
      }
    } catch (error) {
      // console.error removed
      alert('Failed to refresh emails. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load messages from API
  useEffect(() => {
    fetchMessages();
  }, [selectedFolder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreActions) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          setShowMoreActions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreActions]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from different endpoint based on selected folder
      let endpoint = '/api/inbox/emails?' + Date.now();
      if (selectedFolder === 'sent') {
        endpoint = '/api/emails/sent?' + Date.now();
      } else if (selectedFolder.startsWith('custom_')) {
        const folderId = selectedFolder.replace('custom_', '');
        endpoint = `/api/inbox/emails?folder=${folderId}&t=${Date.now()}`;
      } else if (selectedFolder === 'archive') {
        endpoint = `/api/inbox/emails?folder=archive&t=${Date.now()}`;
      } else if (selectedFolder === 'trash') {
        endpoint = `/api/inbox/emails?folder=trash&t=${Date.now()}`;
      }
      
      const response = await fetch(endpoint, {
        credentials: 'include', // Include auth cookies
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      // console.log removed
      
      // Convert API data to EmailMessage format with proper folder separation
      const emailMessages: EmailMessage[] = data.map((msg: any) => ({
        id: msg.id,
        from: msg.senderEmail,
        fromName: msg.senderName || msg.sender_name || 'New Age Fotografie',
        to: msg.recipientEmail || msg.recipient_email || 'hallo@newagefotografie.com',
        subject: msg.subject?.replace('[SENT] ', '') || '(No Subject)',
        body: msg.content,
        timestamp: msg.createdAt || msg.created_at || msg.sentAt || msg.sent_at,
        isRead: msg.status === 'read' || msg.status === 'archived' || msg.status === 'sent' || msg.status === 'demo_sent',
        isStarred: false,
        isImportant: msg.status === 'unread',
        hasAttachments: false,
        labels: [],
        folder: msg.folder_id || ((msg.direction === 'outbound' || msg.status === 'sent' || msg.status === 'demo_sent') ? 'sent' : 'inbox'),
        threadId: msg.id
      }));
      
      setMessages(emailMessages);
    } catch (err) {
      // console.error removed
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email folders with proper counts (including custom folders)
  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: folderCounts.inbox, icon: <Mail size={16} /> },
    { id: 'sent', name: 'Sent', count: folderCounts.sent, icon: <Send size={16} /> },
    { id: 'archive', name: 'Archive', count: folderCounts.archive, icon: <Archive size={16} /> },
    { id: 'trash', name: 'Trash', count: folderCounts.trash, icon: <Trash2 size={16} /> },
    // Add custom folders
    ...customFolders.map(cf => ({
      id: `custom_${cf.id}`,
      name: cf.name,
      count: 0, // Will be updated with real counts from API
      icon: <Folder size={16} />,
      isCustom: true
    }))
  ];

  // Filter messages based on selected folder
  const filteredMessages = messages.filter(message => {
    // Since we fetch from the correct endpoint based on folder, just filter by search
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id));
    }
  };

  const handleMarkAsRead = (messageIds: string[], isRead: boolean) => {
    setMessages(prev => 
      prev.map(message => 
        messageIds.includes(message.id) 
          ? { ...message, isRead }
          : message
      )
    );
  };

  const handleStar = (messageIds: string[], isStarred: boolean) => {
    setMessages(prev => 
      prev.map(message => 
        messageIds.includes(message.id) 
          ? { ...message, isStarred }
          : message
      )
    );
  };

  const handleArchive = (messageIds: string[]) => {
    setMessages(prev => 
      prev.map(message => 
        messageIds.includes(message.id) 
          ? { ...message, folder: 'archive' }
          : message
      )
    );
    setSelectedMessages([]);
  };

  const handleDelete = async (messageIds: string[]) => {
    if (!confirm(`Are you sure you want to delete ${messageIds.length} message${messageIds.length > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      // Delete each message via API
      await Promise.all(
        messageIds.map(id => 
          fetch(`/api/crm/messages/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      // Remove from local state
      setMessages(prev => prev.filter(message => !messageIds.includes(message.id)));
      setSelectedMessages([]);
      
      // Clear current message if it was deleted
      if (currentMessage && messageIds.includes(currentMessage.id)) {
        setCurrentMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete messages:', err);
      setError('Failed to delete messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderEmailList = () => (
    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* Email List Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {selectedFolder} ({filteredMessages.length})
            </h2>
          </div>
          
          {selectedMessages.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMarkAsRead(selectedMessages, true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Mark as read"
              >
                <MailOpen size={16} />
              </button>
              <button
                onClick={() => handleStar(selectedMessages, true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Star"
              >
                <Star size={16} />
              </button>
              <button
                onClick={() => handleArchive(selectedMessages)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Archive"
              >
                <Archive size={16} />
              </button>
              <button
                onClick={() => handleDelete(selectedMessages)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No messages match your search.' : 'Your inbox is empty.'}
            </p>
          </div>
        ) : (
          filteredMessages.map(message => (
            <div 
              key={message.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedMessages.includes(message.id) ? 'bg-blue-50' : ''
              } ${!message.isRead ? 'bg-blue-25' : ''}`}
              onClick={() => setCurrentMessage(message)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedMessages.includes(message.id)}
                  onChange={() => handleMessageSelect(message.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStar([message.id], !message.isStarred);
                  }}
                  className={`${
                    message.isStarred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star size={16} fill={message.isStarred ? 'currentColor' : 'none'} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {message.fromName}
                      </span>
                      {message.isImportant && (
                        <Flag size={12} className="text-red-500" />
                      )}
                      {message.hasAttachments && (
                        <Paperclip size={12} className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  
                  <div className={`text-sm ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'} truncate`}>
                    {message.subject}
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-lg">
                    {message.body}
                  </div>

                  {message.labels.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      {message.labels.map(label => (
                        <span 
                          key={label}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderEmailDetail = () => {
    if (!currentMessage) return null;

    return (
      <div className="w-1/2 bg-white rounded-lg shadow ml-6">
        {/* Email Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMessage(null)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setReplyMode('reply');
                  setShowComposer(true);
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Reply"
              >
                <Reply size={16} />
              </button>
              <button
                onClick={() => {
                  setReplyMode('forward');
                  setShowComposer(true);
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Forward"
              >
                <Forward size={16} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  title="More actions"
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {/* Dropdown Menu */}
                {showMoreActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleMarkAsRead([currentMessage.id], !currentMessage.isRead);
                          setShowMoreActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        {currentMessage.isRead ? <MailOpen size={14} className="mr-2" /> : <Mail size={14} className="mr-2" />}
                        Mark as {currentMessage.isRead ? 'unread' : 'read'}
                      </button>
                      <button
                        onClick={() => {
                          handleStar([currentMessage.id], !currentMessage.isStarred);
                          setShowMoreActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Star size={14} className="mr-2" />
                        {currentMessage.isStarred ? 'Unstar' : 'Star'}
                      </button>
                      <button
                        onClick={() => {
                          handleArchive([currentMessage.id]);
                          setShowMoreActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Archive size={14} className="mr-2" />
                        Archive
                      </button>
                      <button
                        onClick={() => {
                          handleDelete([currentMessage.id]);
                          setShowMoreActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {currentMessage.subject}
            </h2>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div>
                <div className="font-medium">{currentMessage.fromName}</div>
                <div>{currentMessage.from}</div>
              </div>
              <div className="text-right">
                <div>{new Date(currentMessage.timestamp).toLocaleDateString()}</div>
                <div>{new Date(currentMessage.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          <div className="prose max-w-full overflow-hidden">
            <p className="text-gray-700 whitespace-pre-wrap break-words max-w-full overflow-x-auto">
              {currentMessage.body}
            </p>
          </div>

          {currentMessage.hasAttachments && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
              <div className="flex items-center space-x-2">
                <Paperclip size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">attachment.pdf</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Download size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
            <p className="text-gray-600">Manage client messages and inquiries</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRefreshEmails}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setShowComposer(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Compose</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Main Content */}
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              {folders.map(folder => (
                <div key={folder.id} className="group relative">
                  {editingFolderId === folder.id.replace('custom_', '') && folder.isCustom ? (
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateFolder(folder.id.replace('custom_', ''));
                          if (e.key === 'Escape') setEditingFolderId(null);
                        }}
                        className="flex-1 px-2 py-1 text-sm border rounded"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateFolder(folder.id.replace('custom_', ''))}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingFolderId(null)}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        selectedFolder === folder.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {folder.icon}
                        <span>{folder.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{folder.count}</span>
                        {folder.isCustom && (
                          <div className="hidden group-hover:flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingFolderId(folder.id.replace('custom_', ''));
                                setEditingFolderName(folder.name);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFolder(folder.id.replace('custom_', ''));
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Add Folder */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {showNewFolderInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder();
                      if (e.key === 'Escape') {
                        setShowNewFolderInput(false);
                        setNewFolderName('');
                      }
                    }}
                    placeholder="Folder name..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md disabled:opacity-50"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setNewFolderName('');
                    }}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <FolderPlus size={16} />
                  <span>Add Folder</span>
                </button>
              )}
            </div>

            {/* Move to Folder dropdown (shown when messages are selected) */}
            {selectedMessages.length > 0 && customFolders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Move to folder</h3>
                <div className="space-y-1">
                  {customFolders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => handleMoveToFolder(selectedMessages, folder.id)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <Folder size={14} />
                      <span>{folder.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unread</span>
                  <span className="font-medium">
                    {messages.filter(m => !m.isRead && m.folder === 'inbox').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starred</span>
                  <span className="font-medium">
                    {messages.filter(m => m.isStarred).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Important</span>
                  <span className="font-medium">
                    {messages.filter(m => m.isImportant).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email List and Detail */}
          <div className="flex-1 flex">
            {renderEmailList()}
            {currentMessage && renderEmailDetail()}
          </div>        </div>
      </div>

      {/* Inbox Settings Modal */}
      <InboxSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={(settings) => {
          // console.log removed
          // Here you would save the settings to your backend
        }}
      />

      {/* Email Composer Modal */}
      {showComposer && (
        <SimpleEmailComposer
          isOpen={showComposer}
          onClose={() => {
            setShowComposer(false);
            setReplyMode(null);
          }}
          onSent={(data) => {
            // console.log removed
            setShowComposer(false);
            setReplyMode(null);
            // Refresh messages after sending
            fetchMessages();
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminInboxPage;
