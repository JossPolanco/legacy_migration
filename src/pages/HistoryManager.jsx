import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, ChevronUp, Loader } from 'lucide-react';

const HistoryManager = () => {
    const [taskId, setTaskId] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

    const { token } = useAuth();

    const apiRequest = async (url, options = {}) => {
        try {
            const response = await fetch(`/api${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    };

    const loadTaskHistory = async () => {
        if (!taskId.trim()) {
            setError('Please enter a valid task ID');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await apiRequest(`/history/task/${taskId}`);

            if (response.success) {
                setHistory(response.data || []);
                if (!response.data || response.data.length === 0) {
                    setError('No history found for this task');
                }
            } else {
                setError(response.message || 'Error loading history');
                setHistory([]);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            setError('Error loading task history');
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAllHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            setTaskId('');
            const response = await apiRequest('/history/all');

            if (response.success) {
                setHistory(response.data || []);
                if (!response.data || response.data.length === 0) {
                    setError('No history available');
                }
            } else {
                setError(response.message || 'Error loading history');
                setHistory([]);
            }
        } catch (error) {
            console.error('Error loading all history:', error);
            setError('Error loading complete history');
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionColor = (action) => {
        switch (action.toUpperCase()) {
            case 'CREATED':
                return 'bg-green-50 border-green-200';
            case 'UPDATED':
            case 'TITLE_CHANGED':
            case 'DESCRIPTION_CHANGED':
            case 'STATE_CHANGED':
            case 'PRIORITY_CHANGED':
            case 'ASSIGNED_CHANGED':
                return 'bg-blue-50 border-blue-200';
            case 'DELETED':
                return 'bg-red-50 border-red-200';
            case 'COMMENTED':
                return 'bg-purple-50 border-purple-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getActionBadgeColor = (action) => {
        switch (action.toUpperCase()) {
            case 'CREATED':
                return 'bg-green-100 text-green-800';
            case 'UPDATED':
            case 'TITLE_CHANGED':
            case 'DESCRIPTION_CHANGED':
            case 'STATE_CHANGED':
            case 'PRIORITY_CHANGED':
            case 'ASSIGNED_CHANGED':
                return 'bg-blue-100 text-blue-800';
            case 'DELETED':
                return 'bg-red-100 text-red-800';
            case 'COMMENTED':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl mb-6 text-slate-800">Change History</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg mb-4 text-slate-700 font-semibold">Search History</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task ID</label>
                        <input
                            type="number"
                            value={taskId}
                            onChange={(e) => setTaskId(e.target.value)}
                            placeholder="Enter task ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && loadTaskHistory()}
                        />
                    </div>
                    <button
                        onClick={loadTaskHistory}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                    >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                        Load History
                    </button>
                    <button
                        onClick={loadAllHistory}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                    >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                        Load All
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                    {error}
                </div>
            )}

            <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                        CHANGE HISTORY ({history.length} records)
                    </h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {history.length === 0 && !loading ? (
                        <div className="p-6 text-center text-gray-500">
                            No history records available
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {history.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`border-l-4 transition-colors ${getActionColor(item.action)}`}
                                >
                                    <div
                                        onClick={() => toggleExpand(item.id)}
                                        className="p-4 cursor-pointer hover:bg-gray-100 hover:bg-opacity-50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(item.action)}`}>
                                                        {item.action}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Task ID: {item.taskId}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-mono text-gray-700">
                                                    {formatDate(item.creationDate)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {expandedItems[item.id] ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {expandedItems[item.id] && (
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-gray-50 bg-opacity-50">
                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-700 mb-2">Description:</div>
                                                <div className="font-mono text-gray-600 bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryManager;
