import { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Calendar,
  TrendingDown,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import { getExpenses, addExpense } from '../firebase/firestore';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'general',
    date: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    notes: ''
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'events', label: 'Events' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  useEffect(() => {
    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExpenses(filtered);
  }, [searchTerm, expenses]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      const result = await getExpenses(monthStart, monthEnd);
      
      if (result.success) {
        setExpenses(result.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date)
      };

      await addExpense(expenseData);
      await fetchExpenses();
      
      setShowAddModal(false);
      setFormData({
        description: '',
        amount: '',
        category: 'general',
        date: new Date().toISOString().split('T')[0],
        receiptNumber: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding expense:', error);
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

  const getMonthlyStats = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return {
      totalExpenses,
      expensesByCategory,
      transactionCount: expenses.length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0
    };
  };

  const stats = getMonthlyStats();

  const getCategoryColor = (category) => {
    const colors = {
      general: 'blue',
      utilities: 'yellow',
      maintenance: 'orange',
      events: 'purple',
      outreach: 'green',
      administrative: 'gray',
      other: 'red'
    };
    return colors[category] || 'gray';
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({
      description: '',
      amount: '',
      category: 'general',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      notes: ''
    });
  };

  if (loading && expenses.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">
            Track and manage church expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Month Selector */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Selected Month</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(selectedMonth, 'MMMM yyyy')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
              className="btn-secondary"
            >
              Previous Month
            </button>
            <button
              onClick={() => setSelectedMonth(new Date())}
              className="btn-secondary"
            >
              Current Month
            </button>
            <button
              onClick={() => {
                const nextMonth = new Date(selectedMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setSelectedMonth(nextMonth);
              }}
              className="btn-secondary"
            >
              Next Month
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₱{stats.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.transactionCount}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₱{stats.averageExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Object.keys(stats.expensesByCategory).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.expensesByCategory).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.expensesByCategory).map(([category, amount]) => {
              const categoryInfo = categories.find(c => c.value === category) || { label: category };
              const color = getCategoryColor(category);
              const percentage = ((amount / stats.totalExpenses) * 100).toFixed(1);
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 bg-${color}-500 rounded-full`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{categoryInfo.label}</p>
                      <p className="text-xs text-gray-500">{percentage}% of total</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ₱{amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses by description, category, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Receipt #</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        {expense.notes && (
                          <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(expense.category)}-100 text-${getCategoryColor(expense.category)}-800`}>
                        {categories.find(c => c.value === expense.category)?.label || expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-red-600">
                        -₱{expense.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {expense.receiptNumber || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    {searchTerm ? 'No expenses found matching your search' : 'No expenses recorded for this month'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
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
                    Add Expense
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Enter expense description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₱) *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        min="0"
                        step="0.01"
                        required
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
                        Receipt Number
                      </label>
                      <input
                        type="text"
                        name="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Enter receipt number (optional)"
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
                        placeholder="Add any notes about this expense"
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
                    {loading ? 'Adding...' : 'Add Expense'}
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

export default Expenses;
