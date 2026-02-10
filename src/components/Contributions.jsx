import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  getMembers, 
  addContribution, 
  getWeeklyContributions,
  getMemberContributions 
} from '../firebase/firestore';
import { format, startOfWeek, endOfWeek, isToday } from 'date-fns';

const Contributions = () => {
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    amount: 30,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [selectedWeek]);

  useEffect(() => {
    const filtered = contributions.filter(contribution =>
      contribution.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContributions(filtered);
  }, [searchTerm, contributions]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 0 });
      
      const [membersRes, contributionsRes] = await Promise.all([
        getMembers(),
        getWeeklyContributions(weekStart, weekEnd)
      ]);

      if (membersRes.success) {
        setMembers(membersRes.data);
      }
      
      if (contributionsRes.success) {
        setContributions(contributionsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedMember = members.find(m => m.id === formData.memberId);
      const contributionData = {
        ...formData,
        memberName: selectedMember.name,
        date: new Date(formData.date)
      };

      await addContribution(contributionData);
      await fetchData();
      
      setShowAddModal(false);
      setFormData({
        memberId: '',
        memberName: '',
        amount: 30,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error('Error adding contribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getWeeklyStats = () => {
    const totalExpected = members.length * 30;
    const totalActual = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
    const contributorsCount = new Set(contributions.map(c => c.memberId)).size;
    const nonContributors = members.filter(member => 
      !contributions.some(contribution => contribution.memberId === member.id)
    );

    return {
      totalExpected,
      totalActual,
      contributorsCount,
      nonContributorsCount: nonContributors.length,
      completionRate: members.length > 0 ? (contributorsCount / members.length * 100).toFixed(1) : 0
    };
  };

  const stats = getWeeklyStats();

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({
      memberId: '',
      memberName: '',
      amount: 30,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  if (loading && contributions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
          <p className="text-gray-600 mt-1">
            Track weekly member contributions (₱30 per member)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contribution
        </button>
      </div>

      {/* Week Selector */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Selected Week</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(startOfWeek(selectedWeek, { weekStartsOn: 0 }), 'MMM d')} - {' '}
                {format(endOfWeek(selectedWeek, { weekStartsOn: 0 }), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="btn-secondary"
            >
              Previous Week
            </button>
            <button
              onClick={() => setSelectedWeek(new Date())}
              className="btn-secondary"
            >
              Current Week
            </button>
            <button
              onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="btn-secondary"
            >
              Next Week
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Collection</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₱{stats.totalExpected.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actual Collection</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₱{stats.totalActual.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contributors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.contributorsCount}/{members.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats.completionRate}% completion</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Missing</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.nonContributorsCount}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contributions by member name or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Contributions List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Notes</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.length > 0 ? (
                filteredContributions.map((contribution) => (
                  <tr key={contribution.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">{contribution.memberName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        ₱{contribution.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {format(new Date(contribution.date), 'MMM d, yyyy')}
                      {isToday(new Date(contribution.date)) && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {contribution.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    {searchTerm ? 'No contributions found matching your search' : 'No contributions recorded for this week'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contribution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Add Contribution
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Member *
                      </label>
                      <select
                        name="memberId"
                        required
                        value={formData.memberId}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">Select a member</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₱)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="input"
                        placeholder="Add any notes about this contribution"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {loading ? 'Adding...' : 'Add Contribution'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contributions;
