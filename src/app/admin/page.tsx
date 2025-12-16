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
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Save,
  Phone,
  User,
  Calendar,
} from 'lucide-react'
import { useStore, formatPrice, generateOrderNumber } from '@/store/useStore'
import type { Order, Product, DeliveryZone } from '@/types'

type TabType = 'dashboard' | 'orders' | 'products' | 'zones'

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
      todayRevenue: todayOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
      monthRevenue: monthOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
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
    { id: 'zones' as TabType, label: 'Zones de livraison', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">MF</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Mahutin Ferme</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{adminSession.adminName}</p>
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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MF</span>
                </div>
                <span className="font-bold">Admin</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
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
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-gray-900">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="w-10" />
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardTab stats={stats} orders={orders} />
          )}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'zones' && <ZonesTab />}
        </div>
      </main>
    </div>
  )
}

// Dashboard Tab Component
function DashboardTab({
  stats,
  orders,
}: {
  stats: { totalOrders: number; pendingOrders: number; todayRevenue: number; monthRevenue: number }
  orders: Order[]
}) {
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">
        Tableau de bord
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total commandes"
          value={stats.totalOrders.toString()}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="En attente"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="CA du jour"
          value={formatPrice(stats.todayRevenue)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="CA du mois"
          value={formatPrice(stats.monthRevenue)}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Commandes récentes
        </h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune commande</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatPrice(order.total)}
                  </p>
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

// Orders Tab Component
function OrdersTab() {
  const orders = useStore((state) => state.orders)
  const updateOrderStatus = useStore((state) => state.updateOrderStatus)
  const adminSession = useStore((state) => state.adminSession)
  const addOrder = useStore((state) => state.addOrder)
  const products = useStore((state) => state.products)
  const zones = useStore((state) => state.zones)

  const [filter, setFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status, adminSession.adminName)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">
          Commandes
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle commande</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'validated', 'delivered', 'cancelled'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' && 'Toutes'}
              {status === 'pending' && 'En attente'}
              {status === 'validated' && 'Validées'}
              {status === 'delivered' && 'Livrées'}
              {status === 'cancelled' && 'Annulées'}
            </button>
          )
        )}
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
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {order.deliveryZone.name}
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                      {order.validatedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          par {order.validatedBy}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'validated')}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg"
                            title="Valider"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'validated' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                            title="Marquer livrée"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                            title="Annuler"
                          >
                            <XCircle className="w-4 h-4" />
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

      {/* Modal Détails Commande */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Modal Ajout Commande */}
      {showAddModal && (
        <AddOrderModal
          onClose={() => setShowAddModal(false)}
          products={products}
          zones={zones}
          onAdd={addOrder}
        />
      )}
    </div>
  )
}

// Products Tab Component
function ProductsTab() {
  const products = useStore((state) => state.products)
  const updateProduct = useStore((state) => state.updateProduct)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ price: 0, description: '' })

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({ price: product.price, description: product.description })
  }

  const handleSave = (id: string) => {
    updateProduct(id, editForm)
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">
        Gestion des Produits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                    product.category === 'eggs'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.category === 'eggs' ? 'Oeufs' : 'Viande'}
                </span>
              </div>
            </div>

            {editingId === product.id ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (FCFA)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: Number(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="input-field min-h-[80px]"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(product.id)}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-outline flex-1"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                  <span className="text-sm text-gray-500 font-normal">
                    /{product.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <button
                  onClick={() => handleEdit(product)}
                  className="btn-outline w-full flex items-center justify-center space-x-2 mt-4"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Zones Tab Component
function ZonesTab() {
  const zones = useStore((state) => state.zones)
  const addZone = useStore((state) => state.addZone)
  const updateZone = useStore((state) => state.updateZone)
  const deleteZone = useStore((state) => state.deleteZone)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newZone, setNewZone] = useState({ name: '', price: 0, estimatedTime: '' })
  const [editForm, setEditForm] = useState({ name: '', price: 0, estimatedTime: '' })

  const handleAdd = () => {
    if (newZone.name && newZone.price > 0) {
      addZone({
        id: crypto.randomUUID(),
        name: newZone.name,
        price: newZone.price,
        estimatedTime: newZone.estimatedTime || '2-3 heures',
        isActive: true,
      })
      setNewZone({ name: '', price: 0, estimatedTime: '' })
      setShowAddForm(false)
    }
  }

  const handleEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id)
    setEditForm({
      name: zone.name,
      price: zone.price,
      estimatedTime: zone.estimatedTime,
    })
  }

  const handleSave = (id: string) => {
    updateZone(id, editForm)
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">
          Zones de livraison
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une zone</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
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
              onChange={(e) =>
                setNewZone({ ...newZone, price: Number(e.target.value) })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Délai estimé"
              value={newZone.estimatedTime}
              onChange={(e) =>
                setNewZone({ ...newZone, estimatedTime: e.target.value })
              }
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

      {/* Liste des zones */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Zone</th>
              <th className="text-left p-4 font-medium text-gray-600">
                Prix livraison
              </th>
              <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">
                Délai
              </th>
              <th className="text-left p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id} className="border-b">
                {editingId === zone.id ? (
                  <>
                    <td className="p-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="input-field"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: Number(e.target.value) })
                        }
                        className="input-field"
                      />
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <input
                        type="text"
                        value={editForm.estimatedTime}
                        onChange={(e) =>
                          setEditForm({ ...editForm, estimatedTime: e.target.value })
                        }
                        className="input-field"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(zone.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">{zone.name}</td>
                    <td className="p-4 text-primary font-semibold">
                      {formatPrice(zone.price)}
                    </td>
                    <td className="p-4 hidden sm:table-cell">{zone.estimatedTime}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(zone)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteZone(zone.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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
  color: 'blue' | 'yellow' | 'green' | 'purple'
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
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

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
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
          {/* Infos client */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Client</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{order.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    dateStyle: 'full',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Produits</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Livraison ({order.deliveryZone.name})
              </span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-gray-600">Statut: </span>
              <StatusBadge status={order.status} />
            </div>
            {order.validatedBy && (
              <p className="text-sm text-gray-500">
                Traitée par: {order.validatedBy}
              </p>
            )}
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
    notes: '',
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
        items: formData.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      })
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { productId, quantity: 1 }],
      })
    }
  }

  const handleSubmit = () => {
    if (!formData.customerName || !formData.phone || !selectedZone || formData.items.length === 0) {
      return
    }

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
      notes: formData.notes,
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
          <h3 className="text-xl font-bold">Nouvelle commande manuelle</h3>
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

          {/* Sélection produits */}
          <div>
            <p className="font-medium mb-2">Produits</p>
            <div className="flex flex-wrap gap-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddItem(product.id)}
                  className="btn-outline text-sm"
                >
                  + {product.name}
                </button>
              ))}
            </div>
            {formData.items.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId)
                  return (
                    <div key={item.productId} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <span>{product?.name} x {item.quantity}</span>
                      <span>{formatPrice((product?.price || 0) * item.quantity)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <textarea
            placeholder="Notes (optionnel)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field"
          />

          {/* Total */}
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
