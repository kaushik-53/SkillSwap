import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { Loader2, ArrowRight, Repeat, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const MySwaps = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
    const [requests, setRequests] = useState({ active: [], history: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, config);
                const allRequests = [...(res.data.received || []), ...(res.data.sent || [])];

                // Sort by newest top
                allRequests.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                const active = allRequests.filter(r => r.status === 'Pending' || r.status === 'Accepted');
                const history = allRequests.filter(r => r.status === 'Completed' || r.status === 'Rejected');

                setRequests({ active, history });
            } catch (error) {
                console.error("Failed to fetch swaps:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchRequests();
    }, [user]);

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??';
    };

    const renderSwapCard = (swap) => {
        const isReceiver = swap.receiver?._id === user?._id;
        const partner = isReceiver ? swap.sender : swap.receiver;

        let statusColor = 'text-gray-500 bg-gray-100';
        let StatusIcon = Clock;

        if (swap.status === 'Accepted') { statusColor = 'text-blue-600 bg-blue-100'; StatusIcon = Repeat; }
        if (swap.status === 'Completed') { statusColor = 'text-green-600 bg-green-100'; StatusIcon = CheckCircle; }
        if (swap.status === 'Rejected') { statusColor = 'text-red-600 bg-red-100'; StatusIcon = XCircle; }

        return (
            <div key={swap._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center">

                {/* Partner Details left side */}
                <div className="flex items-center gap-4 min-w-[200px]">
                    <img src={getAvatarUrl(partner?.avatar, partner?.name)} alt={partner?.name} className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-gray-100" />
                    <div>
                        <h4 className="font-bold text-gray-900">{partner?.name || 'Deleted User'}</h4>
                        <p className="text-xs font-bold text-gray-400 capitalize">{isReceiver ? 'Requested you' : 'You requested'}</p>
                    </div>
                </div>

                {/* Skill Details middle */}
                <div className="flex-1 bg-gray-50 p-4 rounded-2xl w-full">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2.5 py-1 bg-white text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100 shadow-sm">
                            {swap.skill?.category || 'Skill'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                            <StatusIcon size={12} /> {swap.status}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{swap.skill?.title || 'Unknown Skill'}</h3>
                </div>

                {/* Actions right side */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                    {(swap.status === 'Accepted' || swap.status === 'Completed') ? (
                        <Link
                            to={`/requests/${swap._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-600/20 w-full sm:w-auto text-center flex items-center justify-center gap-2"
                        >
                            {swap.status === 'Completed' ? 'View/Review' : 'Join Session'}
                        </Link>
                    ) : (swap.status === 'Pending' && isReceiver) ? (
                        // If pending and they received it, link to dashboard where they can accept/reject easily (or we can add buttons here later)
                        <Link to="/dashboard" className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-black transition-all w-full sm:w-auto text-center">
                            Manage Request
                        </Link>
                    ) : ( // Pending sent, or Rejected
                        <div className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 bg-gray-50 text-center w-full sm:w-auto border border-gray-100">
                            {swap.status === 'Rejected' ? 'Closed' : 'Waiting for reply'}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <Loader2 size={40} className="text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-8 px-4">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">My Swaps</h1>
                    <p className="text-gray-500 font-bold">Manage your ongoing sessions and view your past history.</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-2xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 md:w-40 py-2.5 px-4 text-sm font-black rounded-xl transition-all ${activeTab === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Active ({requests.active.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 md:w-40 py-2.5 px-4 text-sm font-black rounded-xl transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        History ({requests.history.length})
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {activeTab === 'active' ? (
                    requests.active.length > 0 ? (
                        requests.active.map(renderSwapCard)
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                            <Repeat size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No active swaps</h3>
                            <p className="text-gray-500 font-medium mb-6">You don't have any pending or accepted requests right now.</p>
                            <Link to="/explore" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                                Browse Skills <ArrowRight size={16} />
                            </Link>
                        </div>
                    )
                ) : (
                    requests.history.length > 0 ? (
                        requests.history.map(renderSwapCard)
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                            <Clock size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No swap history</h3>
                            <p className="text-gray-500 font-medium mb-6">Completed and rejected swaps will appear here.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MySwaps;
