import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { 
  getMembers, 
  getWeeklyContributions, 
  getExpenses, 
  getWeeklySummaries 
} from '../firebase/firestore';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    weeklyExpected: 0,
    weeklyActual: 0,
    totalBalance: 0,
    recentContributions: [],
    recentExpenses: [],
    weeklySummaries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current week dates
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
      
      // Fetch data
      const [membersRes, contributionsRes, expensesRes, summariesRes] = await Promise.all([
        getMembers(),
        getWeeklyContributions(weekStart, weekEnd),
        getExpenses(weekStart, weekEnd),
        getWeeklySummaries(4)
      ]);

      if (membersRes.success) {
        const totalMembers = membersRes.data.length;
        const weeklyExpected = totalMembers * 30; // ₱30 per member
        
        const weeklyActual = contributionsRes.success 
          ? contributionsRes.data.reduce((sum, contribution) => sum + contribution.amount, 0)
          : 0;
          
        const totalExpenses = expensesRes.success
          ? expensesRes.data.reduce((sum, expense) => sum + expense.amount, 0)
          : 0;
          
        const totalBalance = weeklyActual - totalExpenses;

        setStats({
          totalMembers,
          weeklyExpected,
          weeklyActual,
          totalBalance,
          recentContributions: contributionsRes.success ? contributionsRes.data.slice(0, 5) : [],
          recentExpenses: expensesRes.success ? expensesRes.data.slice(0, 5) : [],
          weeklySummaries: summariesRes.success ? summariesRes.data : []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? `₱${value.toLocaleString()}` : value}
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`h-12 w-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Church fund overview for {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Weekly Expected"
          value={stats.weeklyExpected}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Weekly Actual"
          value={stats.weeklyActual}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Current Balance"
          value={stats.totalBalance}
          icon={stats.totalBalance >= 0 ? TrendingUp : TrendingDown}
          changeType={stats.totalBalance >= 0 ? 'positive' : 'negative'}
          color={stats.totalBalance >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contributions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contributions</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentContributions.length > 0 ? (
              stats.recentContributions.map((contribution) => (
                <div key={contribution.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contribution.memberName}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(contribution.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    +₱{contribution.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No contributions this week</p>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <Receipt className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentExpenses.length > 0 ? (
              stats.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    -₱{expense.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No expenses this week</p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      {stats.weeklySummaries.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Summary</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Week</th>
                  <th className="text-right py-2 font-medium text-gray-700">Expected</th>
                  <th className="text-right py-2 font-medium text-gray-700">Actual</th>
                  <th className="text-right py-2 font-medium text-gray-700">Expenses</th>
                  <th className="text-right py-2 font-medium text-gray-700">Balance</th>
                </tr>
              </thead>
              <tbody>
                {stats.weeklySummaries.map((summary) => (
                  <tr key={summary.id} className="border-b border-gray-100">
                    <td className="py-2">
                      {format(new Date(summary.weekStart), 'MMM d')} - {format(new Date(summary.weekEnd), 'MMM d')}
                    </td>
                    <td className="text-right py-2">₱{summary.expectedAmount.toLocaleString()}</td>
                    <td className="text-right py-2">₱{summary.actualAmount.toLocaleString()}</td>
                    <td className="text-right py-2">₱{summary.expenses.toLocaleString()}</td>
                    <td className={`text-right py-2 font-medium ${
                      summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₱{summary.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
