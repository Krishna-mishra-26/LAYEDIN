import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import { 
  ArrowLeft, Send, Search, User, MessageSquare, MoreVertical, Trash2, Bell, Archive,
  Edit3, X, Check, MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import { messagesAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PageLoader } from '../components/LoadingSpinner';

export default function MessagesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [mutedConversations, setMutedConversations] = useState(new Set());
  const [archivedConversations, setArchivedConversations] = useState(new Set());
  const [showArchived, setShowArchived] = useState(false);
  // Message edit/delete state
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [messageMenuId, setMessageMenuId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const editInputRef = useRef(null);

  // Socket.io connection setup
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Join with user ID to receive direct messages
      socket.emit('join', user._id);
    });

    socket.on('newMessage', (message) => {
      console.log('New message received via socket:', message);
      // Add message to state if it's in the current conversation
      if (message.sender === userId || message.receiver === userId) {
        setMessages(prev => [...prev, message]);
      }
      // Refresh conversations to show latest message
      fetchConversations();
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to access messages');
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchConversation(userId);
    }
  }, [userId, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data.data);
      
      // Sync archived conversations from backend
      const archived = new Set();
      response.data.data.forEach(conv => {
        if (conv.isArchived) {
          archived.add(conv._id);
        }
      });
      setArchivedConversations(archived);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversation = async (otherUserId) => {
    try {
      const response = await messagesAPI.getConversation(otherUserId);
      setActiveConversation(response.data.data);
      setMessages(response.data.data.messages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    setIsSending(true);
    try {
      const response = await messagesAPI.sendMessage({
        receiverId: userId,
        content: newMessage.trim()
      });
      
      const sentMessage = response.data.data;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Emit socket event to recipient
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          receiverId: userId,
          message: sentMessage
        });
      }
      
      fetchConversations(); // Refresh conversations list
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const selectConversation = (conv) => {
    const otherUser = conv.participants.find(p => p._id !== user._id);
    if (otherUser) {
      navigate(`/messages/${otherUser._id}`);
    }
  };

  const handleDeleteConversation = async (convId) => {
    try {
      // Permanently delete the conversation for the current user
      await messagesAPI.deleteConversation(convId);
      
      // Remove from local state completely
      setConversations(prev => prev.filter(c => c._id !== convId));
      setArchivedConversations(prev => {
        const newSet = new Set(prev);
        newSet.delete(convId);
        return newSet;
      });
      setOpenMenuId(null);
      toast.success('Conversation deleted');
    } catch (error) {
      console.error('Delete conversation error:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const handleMuteConversation = (convId) => {
    setMutedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(convId)) {
        newSet.delete(convId);
        toast.success('Notifications enabled');
      } else {
        newSet.add(convId);
        toast.success('Notifications muted');
      }
      return newSet;
    });
    setOpenMenuId(null);
  };

  const handleArchiveConversation = async (convId) => {
    try {
      const isArchived = archivedConversations.has(convId);
      
      if (isArchived) {
        // Unarchive
        await messagesAPI.unarchiveConversation(convId);
        // Update conversation in array
        setConversations(prev => prev.map(c => 
          c._id === convId ? { ...c, isArchived: false } : c
        ));
        setArchivedConversations(prev => {
          const newSet = new Set(prev);
          newSet.delete(convId);
          return newSet;
        });
        toast.success('Conversation unarchived');
      } else {
        // Archive
        await messagesAPI.archiveConversation(convId);
        // Update conversation in array
        setConversations(prev => prev.map(c => 
          c._id === convId ? { ...c, isArchived: true } : c
        ));
        setArchivedConversations(prev => {
          const newSet = new Set(prev);
          newSet.add(convId);
          return newSet;
        });
        toast.success('Conversation archived');
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error('Archive error:', error);
      toast.error('Failed to update archive status');
    }
  };

  // Check if message can be edited (within 5 minutes - but can edit anytime, tag logic is server-side)
  const canEditMessage = (message) => {
    const isOwn = message.sender === user._id || message.sender._id === user._id;
    return isOwn;
  };

  // Start editing a message
  const startEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
    setMessageMenuId(null);
    // Focus input after render
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 100);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  // Save edited message
  const saveEditMessage = async (messageId) => {
    if (!editContent.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      const response = await messagesAPI.editMessage(messageId, editContent.trim());
      // Update message in state
      setMessages(prev => prev.map(m => 
        m._id === messageId ? { ...m, ...response.data.data } : m
      ));
      setEditingMessageId(null);
      setEditContent('');
      toast.success('Message updated');
    } catch (error) {
      console.error('Edit message error:', error);
      toast.error('Failed to update message');
    }
  };

  // Delete a single message
  const handleDeleteMessage = async (messageId) => {
    try {
      await messagesAPI.deleteMessage(messageId);
      // Remove from local state
      setMessages(prev => prev.filter(m => m._id !== messageId));
      setMessageMenuId(null);
      toast.success('Message deleted');
    } catch (error) {
      console.error('Delete message error:', error);
      toast.error('Failed to delete message');
    }
  };

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (messageMenuId && !e.target.closest('.message-menu')) {
        setMessageMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [messageMenuId]);

  if (authLoading || isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            Back to Dashboard
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <MessageSquare className="text-neutral-400" size={20} />
            Messages
          </h1>

          <div className={`grid grid-cols-1 ${userId ? 'lg:grid-cols-3' : ''} gap-4 sm:gap-6 h-[calc(100vh-200px)] sm:h-[calc(100vh-280px)] min-h-[400px] sm:min-h-[500px]`}>
            {/* Conversations List - Hide on mobile when viewing a conversation */}
            <div className={`card p-0 overflow-hidden ${userId ? 'hidden lg:block' : 'block'}`}>
              <div className="p-3 sm:p-4 border-b border-neutral-700">
                <div className="relative mb-3 sm:mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-field pl-12 py-2 w-full text-sm"
                  />
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowArchived(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      !showArchived
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setShowArchived(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      showArchived
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Archived {conversations.filter(c => archivedConversations.has(c._id)).length > 0 && 
                      `(${conversations.filter(c => archivedConversations.has(c._id)).length})`}
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-130px)]">
                {(() => {
                  const activeConvs = conversations.filter(c => !archivedConversations.has(c._id));
                  const archivedConvs = conversations.filter(c => archivedConversations.has(c._id));
                  const displayConvs = showArchived ? archivedConvs : activeConvs;
                  
                  return displayConvs.length > 0 ? (
                  displayConvs.map((conv) => {
                    const isArchived = archivedConversations.has(conv._id);
                    
                    const otherUser = conv.otherUser;
                    const isActive = userId === otherUser?.profile?.user || 
                                    conv.participants.find(p => p._id !== user._id)?._id === userId;
                    const isMuted = mutedConversations.has(conv._id);
                    
                    return (
                      <div
                        key={conv._id}
                        className={`relative p-4 text-left border-b border-neutral-700/50 hover:bg-neutral-800/50 transition-colors group ${
                          isActive ? 'bg-neutral-800/50' : ''
                        }`}
                      >
                        <button
                          onClick={() => selectConversation(conv)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {otherUser?.profile?.profilePhoto ? (
                                <img 
                                  src={otherUser.profile.profilePhoto} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={20} className="text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-white truncate">
                                  {otherUser?.profile 
                                    ? `${otherUser.profile.firstName} ${otherUser.profile.lastName}`
                                    : otherUser?.email || 'Unknown'}
                                </p>
                                {conv.unreadCount > 0 && (
                                  <span className="w-5 h-5 bg-neutral-500 rounded-full text-xs flex items-center justify-center text-white">
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-400 truncate">
                                {otherUser?.profile?.currentTitle || otherUser?.profile?.headline || ''}
                              </p>
                              {conv.lastMessage && (
                                <p className="text-xs text-neutral-500 truncate mt-1">
                                  {conv.lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Three-dot menu */}
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === conv._id ? null : conv._id)}
                              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              <MoreVertical size={16} className="text-neutral-400" />
                            </button>

                            {/* Dropdown menu */}
                            {openMenuId === conv._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50"
                              >
                                <button
                                  onClick={() => handleMuteConversation(conv._id)}
                                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-700 transition-colors text-left text-sm text-neutral-300 border-b border-neutral-700"
                                >
                                  <Bell size={14} />
                                  {isMuted ? 'Unmute' : 'Mute Notifications'}
                                </button>
                                <button
                                  onClick={() => handleArchiveConversation(conv._id)}
                                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-700 transition-colors text-left text-sm text-neutral-300 border-b border-neutral-700"
                                >
                                  <Archive size={14} />
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteConversation(conv._id)}
                                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/20 transition-colors text-left text-sm text-red-400"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">
                      {showArchived ? 'No archived conversations' : 'No conversations yet'}
                    </p>
                    <p className="text-sm text-neutral-500 mt-2">
                      {showArchived ? 'Archived messages will appear here' : 'Start a conversation by visiting a profile'}
                    </p>
                  </div>
                );
                })()}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`lg:col-span-2 card p-0 flex flex-col overflow-hidden ${userId ? 'block' : 'hidden lg:flex'}`}>
              {userId && activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 sm:p-4 border-b border-neutral-700 flex items-center gap-3">
                    {/* Back button for mobile */}
                    <button
                      onClick={() => navigate('/messages')}
                      className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={18} className="text-neutral-400" />
                    </button>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {activeConversation.otherUser?.profilePhoto ? (
                        <img 
                          src={activeConversation.otherUser.profilePhoto} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm sm:text-base truncate">
                        {activeConversation.otherUser 
                          ? `${activeConversation.otherUser.firstName} ${activeConversation.otherUser.lastName}`
                          : 'Unknown'}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-400 truncate">
                        {activeConversation.otherUser?.currentTitle || ''}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender === user._id || message.sender._id === user._id;
                      const isEditing = editingMessageId === message._id;
                      const showMenu = messageMenuId === message._id;
                      
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Message bubble */}
                            <div className="relative">
                              {isEditing ? (
                                // Edit mode
                                <div className="bg-neutral-700 rounded-2xl px-4 py-2 min-w-[200px]">
                                  <textarea
                                    ref={editInputRef}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full bg-transparent text-white resize-none outline-none"
                                    rows={Math.min(5, editContent.split('\n').length + 1)}
                                    maxLength={5000}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        saveEditMessage(message._id);
                                      }
                                      if (e.key === 'Escape') {
                                        cancelEdit();
                                      }
                                    }}
                                  />
                                  <div className="flex justify-end gap-2 mt-2 border-t border-neutral-600 pt-2">
                                    <button
                                      onClick={cancelEdit}
                                      className="p-1 hover:bg-neutral-600 rounded text-neutral-400 hover:text-white transition-colors"
                                    >
                                      <X size={16} />
                                    </button>
                                    <button
                                      onClick={() => saveEditMessage(message._id)}
                                      className="p-1 hover:bg-neutral-600 rounded text-green-400 hover:text-green-300 transition-colors"
                                    >
                                      <Check size={16} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // Normal message display
                                <div
                                  className={`rounded-2xl px-4 py-2 ${
                                    isOwn
                                      ? 'bg-neutral-600 text-white'
                                      : 'bg-neutral-700 text-neutral-100'
                                  }`}
                                >
                                  <p className="break-words whitespace-pre-wrap">{message.content}</p>
                                  <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <p className={`text-xs ${isOwn ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                      {format(new Date(message.createdAt), 'h:mm a')}
                                    </p>
                                    {/* Show "edited" tag only if server says so (edited after 5 min) */}
                                    {message.showEditedTag && (
                                      <span className={`text-xs ${isOwn ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                        (edited)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Message actions - only for own messages */}
                            {isOwn && !isEditing && (
                              <div className="message-menu relative opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMessageMenuId(showMenu ? null : message._id);
                                  }}
                                  className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
                                >
                                  <MoreHorizontal size={14} className="text-neutral-400" />
                                </button>
                                
                                <AnimatePresence>
                                  {showMenu && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="absolute right-0 bottom-full mb-1 w-32 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden"
                                    >
                                      <button
                                        onClick={() => startEditMessage(message)}
                                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700 transition-colors text-left text-sm text-neutral-300"
                                      >
                                        <Edit3 size={14} />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMessage(message._id)}
                                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-500/20 transition-colors text-left text-sm text-red-400"
                                      >
                                        <Trash2 size={14} />
                                        Delete
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-neutral-700">
                    <div className="flex gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input-field flex-1 py-2 sm:py-3 text-sm sm:text-base"
                        maxLength={5000}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="btn-primary px-3 sm:px-4 py-2 sm:py-3"
                      >
                        {isSending ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">Select a conversation</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      Choose from your existing conversations or start a new one
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
