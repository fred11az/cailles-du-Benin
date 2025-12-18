'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Save,
  Phone,
  User,
  Calendar,
  DollarSign,
  PiggyBank,
  Bird,
  Egg,
  Scale,
  FileText,
  BarChart3,
  ImageIcon,
  Upload,
  Camera,
  Users,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import { useStore, formatPrice, generateOrderNumber, formatDate } from '@/store/useStore'
import { useSyncToSupabase } from '@/hooks/useSupabaseSync'
import type { Order, Product, DeliveryZone, Expense, ExpenseCategory, ProfessionalCategory } from '@/types'
import { EXPENSE_CATEGORIES, PROFESSIONAL_CATEGORIES } from '@/types'

type TabType = 'dashboard' | 'orders' | 'products' | 'zones' | 'accounting' | 'production' | 'professionnels'

export default function AdminPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const adminSession = useStore((state) => state.adminSession)
  const logout = useStore((state) => state.logout)
  const orders = useStore((state) => state.orders)
  const products = useStore((state) => state.products)
  const zones = useStore((state) => state.zones)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !adminSession.isAuthenticated) {
      router.push('/admin/login')
    }
  }, [mounted, adminSession.isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  // Stats calculées
  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()

    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    )
    const monthOrders = orders.filter((o) => {
      const date = new Date(o.createdAt)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    })

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      // Utiliser subtotal (sans frais de livraison) pour le CA
      todayRevenue: todayOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.subtotal, 0),
      monthRevenue: monthOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.subtotal, 0),
    }
  }, [orders])

  if (!mounted || !adminSession.isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'zones' as TabType, label: 'Zones livraison', icon: MapPin },
    { id: 'professionnels' as TabType, label: 'Professionnels', icon: Users },
    { id: 'accounting' as TabType, label: 'Comptabilité', icon: PiggyBank },
    { id: 'production' as TabType, label: 'Production', icon: Bird },
  ]

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image src="/images/logo.svg" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Mahutin Ferme</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{adminSession.adminName}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative w-10 h-10">
                  <Image src="/images/logo.svg" alt="Logo" fill className="object-contain" />
                </div>
                <span className="font-bold">Admin</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-gray-900">{tabs.find((t) => t.id === activeTab)?.label}</h1>
          <div className="w-10" />
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardTab stats={stats} orders={orders} />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'zones' && <ZonesTab />}
          {activeTab === 'professionnels' && <ProfessionnelsTab />}
          {activeTab === 'accounting' && <AccountingTab />}
          {activeTab === 'production' && <ProductionTab />}
        </div>
      </main>
    </div>
  )
}

// Dashboard Tab
function DashboardTab({
  stats,
  orders,
}: {
  stats: { totalOrders: number; pendingOrders: number; todayRevenue: number; monthRevenue: number }
  orders: Order[]
}) {
  const productionStats = useStore((state) => state.productionStats)
  const getTotalExpenses = useStore((state) => state.getTotalExpenses)
  const getTotalRevenue = useStore((state) => state.getTotalRevenue)
  const getNetProfit = useStore((state) => state.getNetProfit)

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Tableau de bord</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total commandes" value={stats.totalOrders.toString()} icon={ShoppingCart} color="blue" />
        <StatCard title="En attente" value={stats.pendingOrders.toString()} icon={Clock} color="yellow" />
        <StatCard title="CA du jour" value={formatPrice(stats.todayRevenue)} icon={TrendingUp} color="green" />
        <StatCard title="CA du mois" value={formatPrice(stats.monthRevenue)} icon={TrendingUp} color="purple" />
      </div>

      {/* Production & Finance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Œufs en stock"
          value={`${Math.floor(productionStats.totalEggsInStock / 30)} plateaux`}
          icon={Egg}
          color="yellow"
        />
        <StatCard title="Viande en stock" value={`${productionStats.totalMeatInStock} unités`} icon={Scale} color="red" />
        <StatCard title="Cailles totales" value={productionStats.totalQuails.toString()} icon={Bird} color="blue" />
        <StatCard
          title="Bénéfice net"
          value={formatPrice(getNetProfit())}
          icon={getNetProfit() >= 0 ? TrendingUp : TrendingDown}
          color={getNetProfit() >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes récentes</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune commande</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Accounting Tab - Comptabilité
function AccountingTab() {
  const expenses = useStore((state) => state.expenses)
  const addExpense = useStore((state) => state.addExpense)
  const deleteExpense = useStore((state) => state.deleteExpense)
  const getTotalExpenses = useStore((state) => state.getTotalExpenses)
  const getTotalRevenue = useStore((state) => state.getTotalRevenue)
  const getNetProfit = useStore((state) => state.getNetProfit)
  const adminSession = useStore((state) => state.adminSession)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'provende' as ExpenseCategory,
    description: '',
    amount: 0,
  })

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      addExpense({
        id: crypto.randomUUID(),
        ...newExpense,
        createdAt: new Date().toISOString(),
        createdBy: adminSession.adminName,
      })
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        category: 'provende',
        description: '',
        amount: 0,
      })
      setShowAddForm(false)
    }
  }

  // Grouper les dépenses par catégorie
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {}
    expenses.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount
    })
    return grouped
  }, [expenses])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Comptabilité</h2>
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle dépense</span>
        </button>
      </div>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-green-600 font-medium">Revenus totaux</span>
          </div>
          <p className="text-3xl font-bold text-green-700">{formatPrice(getTotalRevenue())}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <span className="text-red-600 font-medium">Dépenses totales</span>
          </div>
          <p className="text-3xl font-bold text-red-700">{formatPrice(getTotalExpenses())}</p>
        </div>
        <div className={`${getNetProfit() >= 0 ? 'bg-primary/10' : 'bg-orange-50'} rounded-2xl p-6`}>
          <div className="flex items-center space-x-3 mb-2">
            <PiggyBank className={`w-8 h-8 ${getNetProfit() >= 0 ? 'text-primary' : 'text-orange-600'}`} />
            <span className={`font-medium ${getNetProfit() >= 0 ? 'text-primary' : 'text-orange-600'}`}>
              Bénéfice net
            </span>
          </div>
          <p className={`text-3xl font-bold ${getNetProfit() >= 0 ? 'text-primary' : 'text-orange-700'}`}>
            {formatPrice(getNetProfit())}
          </p>
        </div>
      </div>

      {/* Répartition par catégorie */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dépenses par catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EXPENSE_CATEGORIES.map((cat) => (
            <div key={cat.value} className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">{cat.label}</p>
              <p className="text-lg font-bold text-gray-900">{formatPrice(expensesByCategory[cat.value] || 0)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Nouvelle dépense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="input-field"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
              className="input-field"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Montant (FCFA)"
              value={newExpense.amount || ''}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleAddExpense} className="btn-primary">
              Ajouter
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-outline">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des dépenses */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Historique des dépenses</h3>
        </div>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Aucune dépense enregistrée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Catégorie</th>
                  <th className="text-left p-4 font-medium text-gray-600">Description</th>
                  <th className="text-left p-4 font-medium text-gray-600">Montant</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {formatDate(expense.date)}
                      {expense.createdBy && (
                        <span className="block text-xs text-gray-400 lowercase">(par {expense.createdBy})</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {EXPENSE_CATEGORIES.find((c) => c.value === expense.category)?.label}
                      </span>
                    </td>
                    <td className="p-4">{expense.description}</td>
                    <td className="p-4 font-semibold text-red-600">{formatPrice(expense.amount)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Production Tab - Suivi Production
function ProductionTab() {
  const productionStats = useStore((state) => state.productionStats)
  const updateProductionStats = useStore((state) => state.updateProductionStats)
  const collectEggs = useStore((state) => state.collectEggs)
  const processQuails = useStore((state) => state.processQuails)
  const recordQuailLoss = useStore((state) => state.recordQuailLoss)
  const dailyProductions = useStore((state) => state.dailyProductions)
  const addDailyProduction = useStore((state) => state.addDailyProduction)
  const adminSession = useStore((state) => state.adminSession)

  const [showCollectModal, setShowCollectModal] = useState(false)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [showLossModal, setShowLossModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // États pour les formulaires avec date et notes
  const [collectForm, setCollectForm] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 0,
    notes: ''
  })
  const [processForm, setProcessForm] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 0,
    notes: ''
  })
  const [lossForm, setLossForm] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 0,
    notes: ''
  })
  const [editStats, setEditStats] = useState(productionStats)

  // Réinitialiser les formulaires
  const resetCollectForm = () => setCollectForm({ date: new Date().toISOString().split('T')[0], quantity: 0, notes: '' })
  const resetProcessForm = () => setProcessForm({ date: new Date().toISOString().split('T')[0], quantity: 0, notes: '' })
  const resetLossForm = () => setLossForm({ date: new Date().toISOString().split('T')[0], quantity: 0, notes: '' })

  const handleCollectEggs = () => {
    if (collectForm.quantity > 0) {
      collectEggs(collectForm.quantity)
      addDailyProduction({
        id: crypto.randomUUID(),
        date: collectForm.date,
        eggsCollected: collectForm.quantity,
        quailsProcessed: 0,
        quailsLost: 0,
        notes: collectForm.notes || undefined,
        createdAt: new Date().toISOString(),
        createdBy: adminSession.adminName,
      })
      resetCollectForm()
      setShowCollectModal(false)
    }
  }

  const handleProcessQuails = () => {
    if (processForm.quantity > 0) {
      processQuails(processForm.quantity, processForm.quantity)
      addDailyProduction({
        id: crypto.randomUUID(),
        date: processForm.date,
        eggsCollected: 0,
        quailsProcessed: processForm.quantity,
        quailsLost: 0,
        notes: processForm.notes || `${processForm.quantity} unités de viande produites`,
        createdAt: new Date().toISOString(),
        createdBy: adminSession.adminName,
      })
      resetProcessForm()
      setShowProcessModal(false)
    }
  }

  const handleRecordLoss = () => {
    if (lossForm.quantity > 0) {
      recordQuailLoss(lossForm.quantity)
      addDailyProduction({
        id: crypto.randomUUID(),
        date: lossForm.date,
        eggsCollected: 0,
        quailsProcessed: 0,
        quailsLost: lossForm.quantity,
        notes: lossForm.notes || `${lossForm.quantity} cailles perdues`,
        createdAt: new Date().toISOString(),
        createdBy: adminSession.adminName,
      })
      resetLossForm()
      setShowLossModal(false)
    }
  }

  const handleSaveStats = () => {
    updateProductionStats({ ...editStats, lastUpdatedBy: adminSession.adminName })
    setShowEditModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Suivi Production</h2>
        <button onClick={() => { setEditStats(productionStats); setShowEditModal(true) }} className="btn-outline flex items-center space-x-2">
          <Edit2 className="w-4 h-4" />
          <span>Modifier stats</span>
        </button>
      </div>

      {/* Stats de production */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bird className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total cailles</p>
              <p className="text-2xl font-bold text-gray-900">{productionStats.totalQuails}</p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-600">♂ {productionStats.maleQuails} mâles</span>
            <span className="text-pink-600">♀ {productionStats.femaleQuails} femelles</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Egg className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Œufs en stock</p>
              <p className="text-2xl font-bold text-gray-900">{productionStats.totalEggsInStock}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            = {Math.floor(productionStats.totalEggsInStock / 30)} plateaux de 30
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cailles prêtes (viande)</p>
              <p className="text-2xl font-bold text-gray-900">{productionStats.totalMeatInStock} unités</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Dernière mise à jour: {formatDate(productionStats.lastUpdated)}
            {productionStats.lastUpdatedBy && (
              <span className="lowercase"> (par {productionStats.lastUpdatedBy})</span>
            )}
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => { resetCollectForm(); setShowCollectModal(true) }}
          className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 text-left transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-yellow-200 rounded-xl flex items-center justify-center">
              <Egg className="w-8 h-8 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Ramasser des œufs</h3>
              <p className="text-sm text-gray-600">Enregistrer la collecte</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => { resetProcessForm(); setShowProcessModal(true) }}
          className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-2xl p-6 text-left transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Traiter des cailles</h3>
              <p className="text-sm text-gray-600">Enregistrer l&apos;abattage</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => { resetLossForm(); setShowLossModal(true) }}
          className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl p-6 text-left transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-red-200 rounded-xl flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Pertes / Morts</h3>
              <p className="text-sm text-gray-600">Enregistrer les pertes</p>
            </div>
          </div>
        </button>
      </div>

      {/* Historique de production */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Historique de production</h3>
        </div>
        {dailyProductions.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Aucune production enregistrée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Œufs</th>
                  <th className="text-left p-4 font-medium text-gray-600">Traitement</th>
                  <th className="text-left p-4 font-medium text-gray-600">Pertes</th>
                  <th className="text-left p-4 font-medium text-gray-600">Notes</th>
                </tr>
              </thead>
              <tbody>
                {dailyProductions.slice(0, 30).map((prod) => (
                  <tr key={prod.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {formatDate(prod.date)}
                      {prod.createdBy && (
                        <span className="block text-xs text-gray-400 lowercase">(par {prod.createdBy})</span>
                      )}
                    </td>
                    <td className="p-4">
                      {prod.eggsCollected > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                          +{prod.eggsCollected} œufs
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {prod.quailsProcessed > 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          {prod.quailsProcessed} cailles
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {(prod.quailsLost ?? 0) > 0 && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                          -{prod.quailsLost} mortes
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{prod.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Collecte d'œufs */}
      {showCollectModal && (
        <Modal title="Ramasser des œufs" onClose={() => setShowCollectModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={collectForm.date}
                onChange={(e) => setCollectForm({ ...collectForm, date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d&apos;œufs collectés</label>
              <input
                type="number"
                value={collectForm.quantity || ''}
                onChange={(e) => setCollectForm({ ...collectForm, quantity: Number(e.target.value) })}
                className="input-field"
                placeholder="Ex: 150"
              />
              {collectForm.quantity > 0 && (
                <p className="text-sm text-gray-500 mt-1">= {Math.floor(collectForm.quantity / 30)} plateaux</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
              <textarea
                value={collectForm.notes}
                onChange={(e) => setCollectForm({ ...collectForm, notes: e.target.value })}
                className="input-field min-h-[60px]"
                placeholder="Observations, remarques..."
              />
            </div>
            <button onClick={handleCollectEggs} className="btn-primary w-full">
              Enregistrer la collecte
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Traitement cailles */}
      {showProcessModal && (
        <Modal title="Traiter des cailles" onClose={() => setShowProcessModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={processForm.date}
                onChange={(e) => setProcessForm({ ...processForm, date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de cailles à traiter</label>
              <input
                type="number"
                value={processForm.quantity || ''}
                onChange={(e) => setProcessForm({ ...processForm, quantity: Number(e.target.value) })}
                className="input-field"
                placeholder="Ex: 20"
              />
              {processForm.quantity > 0 && (
                <p className="text-sm text-gray-500 mt-1">= {processForm.quantity} unités de viande</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
              <textarea
                value={processForm.notes}
                onChange={(e) => setProcessForm({ ...processForm, notes: e.target.value })}
                className="input-field min-h-[60px]"
                placeholder="Observations, remarques..."
              />
            </div>
            <button onClick={handleProcessQuails} className="btn-primary w-full">
              Enregistrer le traitement
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Pertes */}
      {showLossModal && (
        <Modal title="Enregistrer des pertes" onClose={() => setShowLossModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={lossForm.date}
                onChange={(e) => setLossForm({ ...lossForm, date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de cailles perdues/mortes</label>
              <input
                type="number"
                value={lossForm.quantity || ''}
                onChange={(e) => setLossForm({ ...lossForm, quantity: Number(e.target.value) })}
                className="input-field"
                placeholder="Ex: 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cause / Notes</label>
              <textarea
                value={lossForm.notes}
                onChange={(e) => setLossForm({ ...lossForm, notes: e.target.value })}
                className="input-field min-h-[60px]"
                placeholder="Ex: Maladie, stress thermique, prédateur..."
              />
            </div>
            <button onClick={handleRecordLoss} className="btn-primary w-full bg-red-600 hover:bg-red-700">
              Enregistrer les pertes
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Modification stats */}
      {showEditModal && (
        <Modal title="Modifier les statistiques" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total cailles</label>
                <input
                  type="number"
                  value={editStats.totalQuails || ''}
                  onChange={(e) => setEditStats({ ...editStats, totalQuails: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mâles</label>
                <input
                  type="number"
                  value={editStats.maleQuails || ''}
                  onChange={(e) => setEditStats({ ...editStats, maleQuails: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Femelles</label>
                <input
                  type="number"
                  value={editStats.femaleQuails || ''}
                  onChange={(e) => setEditStats({ ...editStats, femaleQuails: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Œufs en stock</label>
                <input
                  type="number"
                  value={editStats.totalEggsInStock || ''}
                  onChange={(e) => setEditStats({ ...editStats, totalEggsInStock: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Viande en stock (unités)</label>
                <input
                  type="number"
                  value={editStats.totalMeatInStock || ''}
                  onChange={(e) => setEditStats({ ...editStats, totalMeatInStock: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <button onClick={handleSaveStats} className="btn-primary w-full">
              Sauvegarder
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Orders Tab
function OrdersTab() {
  const orders = useStore((state) => state.orders)
  const updateOrderStatus = useStore((state) => state.updateOrderStatus)
  const adminSession = useStore((state) => state.adminSession)
  const addOrder = useStore((state) => state.addOrder)
  const products = useStore((state) => state.products)
  const zones = useStore((state) => state.zones)
  const { syncOrderStatus } = useSyncToSupabase()

  const [filter, setFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status, adminSession.adminName)
    await syncOrderStatus(orderId, status, adminSession.adminName)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Commandes</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle commande</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'validated', 'delivered', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === status ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status === 'all' && 'Toutes'}
            {status === 'pending' && 'En attente'}
            {status === 'validated' && 'Validées'}
            {status === 'delivered' && 'Livrées'}
            {status === 'cancelled' && 'Annulées'}
          </button>
        ))}
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Aucune commande</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">N°</th>
                  <th className="text-left p-4 font-medium text-gray-600">Client</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Zone</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">{order.deliveryZone.name}</td>
                    <td className="p-4 font-semibold text-primary">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'validated')}
                              className="p-2 hover:bg-green-100 text-green-600 rounded-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {order.status === 'validated' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {showAddModal && (
        <AddOrderModal onClose={() => setShowAddModal(false)} products={products} zones={zones} onAdd={addOrder} />
      )}
    </div>
  )
}

// Products Tab
function ProductsTab() {
  const products = useStore((state) => state.products)
  const addProduct = useStore((state) => state.addProduct)
  const updateProduct = useStore((state) => state.updateProduct)
  const deleteProductStore = useStore((state) => state.deleteProduct)
  const { syncProduct, addProductToDb, removeProductFromDb } = useSyncToSupabase()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ price: 0, description: '', image: '', professionalDiscount: 0 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'unité',
    category: 'eggs' as 'eggs' | 'meat',
    image: '/images/eggs.jpg',
    professionalDiscount: 0,
  })

  // Liste des images prédéfinies disponibles
  const predefinedImages = [
    { src: '/images/eggs.jpg', label: 'Oeufs de caille' },
    { src: '/images/meat.jpg', label: 'Viande de caille' },
    { src: '/images/quails-bg.jpg', label: 'Cailles' },
    { src: '/images/hero-quail.jpg', label: 'Caille hero' },
  ]

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({ price: product.price, description: product.description, image: product.image, professionalDiscount: product.professionalDiscount || 0 })
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    updateProduct(id, editForm)
    await syncProduct(id, editForm)
    setIsSaving(false)
    setEditingId(null)
  }

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price > 0) {
      const product = {
        id: crypto.randomUUID(),
        ...newProduct,
        stock: 100,
        isAvailable: true,
      }
      addProduct(product)
      await addProductToDb(product)
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        unit: 'unité',
        category: 'eggs',
        image: '/images/eggs.jpg',
        professionalDiscount: 0,
      })
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProductStore(id)
      await removeProductFromDb(id)
    }
  }

  // Fonction pour gérer l'upload d'image (conversion en base64)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'new' | 'edit'
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image est trop grande. Taille maximum: 2 Mo')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        if (target === 'new') {
          setNewProduct({ ...newProduct, image: base64 })
        } else {
          setEditForm({ ...editForm, image: base64 })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Fonction pour changer l'image d'un produit existant
  const handleChangeProductImage = async (productId: string, newImage: string) => {
    updateProduct(productId, { image: newImage })
    await syncProduct(productId, { image: newImage })
    setShowImageModal(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Gestion des Produits</h2>
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Nouveau produit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Oeufs de caille - Plateau de 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  category: e.target.value as 'eggs' | 'meat',
                  image: e.target.value === 'eggs' ? '/images/eggs.jpg' : '/images/meat.jpg'
                })}
                className="input-field"
              >
                <option value="eggs">Oeufs</option>
                <option value="meat">Viande</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                className="input-field"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité *</label>
              <input
                type="text"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="input-field"
                placeholder="plateau, unité, kg..."
              />
            </div>
            {/* Réduction pro uniquement pour la viande */}
            {newProduct.category === 'meat' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réduction Pro (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProduct.professionalDiscount || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, professionalDiscount: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="input-field"
                  placeholder="Ex: 20 pour -20%"
                />
                <p className="text-xs text-gray-500 mt-1">Réduction appliquée sur la page professionnels</p>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="input-field min-h-[80px]"
                placeholder="Description du produit..."
              />
            </div>

            {/* Section Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Aperçu de l'image */}
                <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={newProduct.image}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  {/* Bouton upload */}
                  <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Télécharger une image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'new')}
                      className="hidden"
                    />
                  </label>
                  {/* Sélection d'images prédéfinies */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Ou choisir une image existante:</p>
                    <div className="flex flex-wrap gap-2">
                      {predefinedImages.map((img) => (
                        <button
                          key={img.src}
                          onClick={() => setNewProduct({ ...newProduct, image: img.src })}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                            newProduct.image === img.src ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={img.label}
                        >
                          <Image src={img.src} alt={img.label} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleAddProduct} className="btn-primary">
              Ajouter le produit
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-outline">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start space-x-4">
              {/* Image avec bouton de modification */}
              <div className="relative group">
                <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <button
                  onClick={() => setShowImageModal(product.id)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center"
                  title="Modifier l'image"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                    product.category === 'eggs' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.category === 'eggs' ? 'Oeufs' : 'Viande'}
                </span>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {editingId === product.id ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="input-field min-h-[80px]"
                  />
                </div>
                {/* Réduction pro pour la viande */}
                {product.category === 'meat' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Réduction Pro (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm.professionalDiscount || ''}
                      onChange={(e) => setEditForm({ ...editForm, professionalDiscount: e.target.value === '' ? 0 : Number(e.target.value) })}
                      className="input-field"
                      placeholder="Ex: 20 pour -20%"
                    />
                    <p className="text-xs text-gray-500 mt-1">Réduction appliquée sur la page professionnels</p>
                  </div>
                )}
                {/* Section modification image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={editForm.image} alt="Aperçu" fill className="object-cover" />
                    </div>
                    <label className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Changer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'edit')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedImages.map((img) => (
                      <button
                        key={img.src}
                        onClick={() => setEditForm({ ...editForm, image: img.src })}
                        className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-colors ${
                          editForm.image === img.src ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title={img.label}
                      >
                        <Image src={img.src} alt={img.label} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleSave(product.id)} className="btn-primary flex-1">
                    Sauvegarder
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn-outline flex-1">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                  <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>
                </p>
                {product.category === 'meat' && product.professionalDiscount && product.professionalDiscount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    🏷️ Réduction Pro: -{product.professionalDiscount}%
                  </p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <button onClick={() => handleEdit(product)} className="btn-outline w-full mt-4">
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  Modifier
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de modification d'image rapide */}
      {showImageModal && (
        <ImageChangeModal
          productId={showImageModal}
          currentImage={products.find(p => p.id === showImageModal)?.image || ''}
          predefinedImages={predefinedImages}
          onClose={() => setShowImageModal(null)}
          onSelect={handleChangeProductImage}
        />
      )}
    </div>
  )
}

// Modal pour changer l'image d'un produit
function ImageChangeModal({
  productId,
  currentImage,
  predefinedImages,
  onClose,
  onSelect,
}: {
  productId: string
  currentImage: string
  predefinedImages: { src: string; label: string }[]
  onClose: () => void
  onSelect: (productId: string, image: string) => void
}) {
  const [selectedImage, setSelectedImage] = useState(currentImage)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image est trop grande. Taille maximum: 2 Mo')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <ImageIcon className="w-6 h-6" />
            <span>Modifier l&apos;image</span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Aperçu de l'image sélectionnée */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40 bg-gray-100 rounded-2xl overflow-hidden">
              <Image src={selectedImage} alt="Aperçu" fill className="object-cover" />
            </div>
          </div>

          {/* Upload personnalisé */}
          <label className="flex items-center justify-center space-x-3 px-4 py-4 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-colors">
            <Upload className="w-6 h-6 text-gray-500" />
            <div className="text-center">
              <span className="font-medium text-gray-700">Télécharger une nouvelle image</span>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu&apos;à 2 Mo</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Images prédéfinies */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Ou choisir parmi les images existantes:</p>
            <div className="grid grid-cols-4 gap-3">
              {predefinedImages.map((img) => (
                <button
                  key={img.src}
                  onClick={() => setSelectedImage(img.src)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                    selectedImage === img.src
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={img.label}
                >
                  <Image src={img.src} alt={img.label} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onSelect(productId, selectedImage)}
              className="btn-primary flex-1"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Enregistrer
            </button>
            <button onClick={onClose} className="btn-outline flex-1">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Zones Tab
function ZonesTab() {
  const zones = useStore((state) => state.zones)
  const addZone = useStore((state) => state.addZone)
  const updateZone = useStore((state) => state.updateZone)
  const deleteZone = useStore((state) => state.deleteZone)
  const { syncZone, addZoneToDb, removeZoneFromDb } = useSyncToSupabase()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newZone, setNewZone] = useState({ name: '', price: 0, estimatedTime: '' })
  const [editForm, setEditForm] = useState({ name: '', price: 0, estimatedTime: '' })

  const handleAdd = async () => {
    if (newZone.name && newZone.price > 0) {
      const zone = {
        id: crypto.randomUUID(),
        name: newZone.name,
        price: newZone.price,
        estimatedTime: newZone.estimatedTime || '2-3 heures',
        isActive: true,
      }
      addZone(zone)
      await addZoneToDb(zone)
      setNewZone({ name: '', price: 0, estimatedTime: '' })
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
      deleteZone(id)
      await removeZoneFromDb(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Zones de livraison</h2>
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter une zone</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Nouvelle zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nom de la zone"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Prix (FCFA)"
              value={newZone.price || ''}
              onChange={(e) => setNewZone({ ...newZone, price: Number(e.target.value) })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Délai estimé"
              value={newZone.estimatedTime}
              onChange={(e) => setNewZone({ ...newZone, estimatedTime: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleAdd} className="btn-primary">
              Ajouter
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-outline">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Zone</th>
              <th className="text-left p-4 font-medium text-gray-600">Prix livraison</th>
              <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Délai</th>
              <th className="text-left p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id} className="border-b">
                <td className="p-4 font-medium">{zone.name}</td>
                <td className="p-4 text-primary font-semibold">{formatPrice(zone.price)}</td>
                <td className="p-4 hidden sm:table-cell">{zone.estimatedTime}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(zone.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Professionnels Tab - Gestion des tarifs professionnels
function ProfessionnelsTab() {
  const professionalPricing = useStore((state) => state.professionalPricing)
  const updateProfessionalPricing = useStore((state) => state.updateProfessionalPricing)
  const { syncProfessionalPricing } = useSyncToSupabase()

  const [editingId, setEditingId] = useState<ProfessionalCategory | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    pricePerTray: 0,
    minQuantity: 10,
    description: '',
    hasBranding: false,
    isActive: true,
  })

  const categoryIcons: Record<ProfessionalCategory, React.ElementType> = {
    restaurants: UtensilsCrossed,
    supermarches: Store,
    evenements: Calendar,
    revendeurs: Users,
  }

  const handleEdit = (pricing: typeof professionalPricing[0]) => {
    setEditingId(pricing.id)
    setEditForm({
      pricePerTray: pricing.pricePerTray || 0,
      minQuantity: pricing.minQuantity,
      description: pricing.description,
      hasBranding: pricing.hasBranding,
      isActive: pricing.isActive,
    })
  }

  const handleSave = async () => {
    if (editingId) {
      setIsSaving(true)
      const updates = {
        pricePerTray: editForm.pricePerTray || null,
        minQuantity: editForm.minQuantity,
        description: editForm.description,
        hasBranding: editForm.hasBranding,
        isActive: editForm.isActive,
      }

      // Mettre à jour localement
      updateProfessionalPricing(editingId, updates)

      // Synchroniser avec Supabase
      await syncProfessionalPricing(editingId, updates)

      setIsSaving(false)
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Tarifs Professionnels</h2>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note :</strong> Ces tarifs s&apos;appliquent sur la page professionnels pour les commandes en gros (minimum 10 plateaux).
          Le prix normal d&apos;un plateau d&apos;œufs est de <strong>1 000 FCFA</strong>.
        </p>
      </div>

      {/* Grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professionalPricing.map((pricing) => {
          const IconComponent = categoryIcons[pricing.id]
          const isEditing = editingId === pricing.id

          return (
            <div
              key={pricing.id}
              className={`bg-white rounded-2xl shadow-lg p-6 ${!pricing.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pricing.isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{pricing.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pricing.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {pricing.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix par plateau (FCFA)
                    </label>
                    <input
                      type="number"
                      value={editForm.pricePerTray || ''}
                      onChange={(e) => setEditForm({ ...editForm, pricePerTray: Number(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="Laissez vide pour 'Sur devis'"
                    />
                    <p className="text-xs text-gray-500 mt-1">Laissez 0 pour afficher &quot;Sur devis&quot;</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité minimum (plateaux)
                    </label>
                    <input
                      type="number"
                      value={editForm.minQuantity}
                      onChange={(e) => setEditForm({ ...editForm, minQuantity: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editForm.hasBranding}
                        onChange={(e) => setEditForm({ ...editForm, hasBranding: e.target.checked })}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-sm text-gray-700">Avec plateau (emballage inclus)</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-sm text-gray-700">Catégorie active</span>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1">
                      <Save className="w-4 h-4 inline mr-2" />
                      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button onClick={() => setEditingId(null)} disabled={isSaving} className="btn-outline flex-1">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{pricing.description}</p>
                  <div className="flex items-baseline space-x-2">
                    {pricing.pricePerTray ? (
                      <>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(pricing.pricePerTray)}
                        </span>
                        <span className="text-gray-500 text-sm">/ plateau</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-600">Sur devis</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Min: {pricing.minQuantity} plateaux</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pricing.hasBranding
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {pricing.hasBranding ? 'Avec plateau' : 'Sans plateau'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEdit(pricing)}
                    className="btn-outline w-full mt-4"
                  >
                    <Edit2 className="w-4 h-4 inline mr-2" />
                    Modifier
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Résumé */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Récapitulatif des tarifs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-medium text-gray-600">Catégorie</th>
                <th className="text-left p-3 font-medium text-gray-600">Prix/plateau</th>
                <th className="text-left p-3 font-medium text-gray-600">Min.</th>
                <th className="text-left p-3 font-medium text-gray-600">Emballage</th>
                <th className="text-left p-3 font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {professionalPricing.map((pricing) => (
                <tr key={pricing.id} className="border-b">
                  <td className="p-3 font-medium">{pricing.name}</td>
                  <td className="p-3 text-primary font-semibold">
                    {pricing.pricePerTray ? formatPrice(pricing.pricePerTray) : 'Sur devis'}
                  </td>
                  <td className="p-3">{pricing.minQuantity} plateaux</td>
                  <td className="p-3">
                    {pricing.hasBranding ? (
                      <span className="text-green-600">Avec plateau</span>
                    ) : (
                      <span className="text-gray-500">Sans plateau</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pricing.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {pricing.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  icon: React.ElementType
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'red'
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-500 truncate">{title}</p>
          <p className="text-lg md:text-xl font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const badges = {
    pending: 'badge-pending',
    validated: 'badge-validated',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  }
  const labels = {
    pending: 'En attente',
    validated: 'Validée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }
  return <span className={badges[status]}>{labels[status]}</span>
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold">Commande {order.orderNumber}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Client</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p>
                <User className="w-4 h-4 inline mr-2 text-gray-500" />
                {order.customerName}
              </p>
              <p>
                <Phone className="w-4 h-4 inline mr-2 text-gray-500" />
                {order.phone}
              </p>
              <p>
                <MapPin className="w-4 h-4 inline mr-2 text-gray-500" />
                {order.address}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Produits</h4>
            {order.items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center bg-gray-50 rounded-xl p-3 mb-2">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatPrice(item.product.price)}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison ({order.deliveryZone.name})</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddOrderModal({
  onClose,
  products,
  zones,
  onAdd,
}: {
  onClose: () => void
  products: Product[]
  zones: DeliveryZone[]
  onAdd: (order: Order) => void
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    zoneId: '',
    items: [] as { productId: string; quantity: number }[],
  })

  const activeZones = zones.filter((z) => z.isActive)
  const selectedZone = zones.find((z) => z.id === formData.zoneId)
  const subtotal = formData.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)
  const total = subtotal + (selectedZone?.price || 0)

  const handleAddItem = (productId: string) => {
    const existing = formData.items.find((i) => i.productId === productId)
    if (existing) {
      setFormData({
        ...formData,
        items: formData.items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)),
      })
    } else {
      setFormData({ ...formData, items: [...formData.items, { productId, quantity: 1 }] })
    }
  }

  const handleSubmit = () => {
    if (!formData.customerName || !formData.phone || !selectedZone || formData.items.length === 0) return
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      deliveryZone: selectedZone,
      items: formData.items.map((item) => ({
        product: products.find((p) => p.id === item.productId)!,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryFee: selectedZone.price,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onAdd(order)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold">Nouvelle commande</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Nom du client"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="input-field"
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Adresse"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="input-field"
          />
          <select
            value={formData.zoneId}
            onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
            className="input-field"
          >
            <option value="">Sélectionnez une zone</option>
            {activeZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} - {formatPrice(zone.price)}
              </option>
            ))}
          </select>
          <div>
            <p className="font-medium mb-2">Produits</p>
            <div className="flex flex-wrap gap-2">
              {products.map((product) => (
                <button key={product.id} onClick={() => handleAddItem(product.id)} className="btn-outline text-sm">
                  + {product.name}
                </button>
              ))}
            </div>
            {formData.items.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId)
                  return (
                    <div key={item.productId} className="flex justify-between bg-gray-50 p-3 rounded-xl">
                      <span>
                        {product?.name} x {item.quantity}
                      </span>
                      <span>{formatPrice((product?.price || 0) * item.quantity)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            Créer la commande
          </button>
        </div>
      </div>
    </div>
  )
}
