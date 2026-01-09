'use client'

import { useState } from 'react'
import {
  X,
  Download,
  Printer,
  Send,
  MessageCircle,
  Loader2,
  FileText,
  Check,
} from 'lucide-react'
import Image from 'next/image'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/store/useStore'
import {
  downloadInvoice,
  printInvoice,
  shareInvoiceViaWhatsApp,
} from '@/utils/invoiceGenerator'

// Informations de l'entreprise (même que dans invoiceGenerator)
const COMPANY_INFO = {
  name: 'FERME AGRO-PASTORALE MAHUTIN',
  address: 'HOUETO PYLÔNES ARRONDISSEMENT DE TOKAN, ABOMEY-CALAVI',
  phones: ['+229 55 55 87 64', '96 06 74 92', '95 27 85 27', '90 81 26 51'],
  email: 'MAHUTINFERME@GMAIL.COM',
  bp: '08 BP 832 TRI POSTAL COTONOU',
  ifu: '0202279027082',
}

interface InvoicePreviewProps {
  order: Order
  onClose: () => void
}

function generateInvoiceNumber(orderNumber: string): string {
  const match = orderNumber.match(/(\d{3})$/)
  if (match) {
    return match[1]
  }
  return String(Date.now()).slice(-3)
}

export default function InvoicePreview({ order, onClose }: InvoicePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const invoiceNumber = generateInvoiceNumber(order.orderNumber)
  const orderDate = new Date(order.createdAt)
  const day = orderDate.getDate().toString().padStart(2, '0')
  const month = (orderDate.getMonth() + 1).toString().padStart(2, '0')
  const year = orderDate.getFullYear()

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadInvoice(order)
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 2000)
    } catch (error) {
      console.error('Error downloading invoice:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = async () => {
    setIsPrinting(true)
    try {
      await printInvoice(order)
    } catch (error) {
      console.error('Error printing invoice:', error)
    } finally {
      setIsPrinting(false)
    }
  }

  const handleShareWhatsApp = async () => {
    setIsSharing(true)
    try {
      await shareInvoiceViaWhatsApp(order)
    } catch (error) {
      console.error('Error sharing invoice:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Facture N° {invoiceNumber}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              downloadSuccess
                ? 'bg-green-600 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            } disabled:opacity-50`}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : downloadSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloadSuccess ? 'Téléchargé!' : 'Télécharger PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            disabled={isSharing}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            <span>Envoyer WhatsApp</span>
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-[#E8F4FC] rounded-lg shadow-lg max-w-2xl mx-auto">
            {/* En-tête de la facture */}
            <div className="p-6 border-b border-[#1E5B8C]/20">
              <div className="flex items-start justify-between">
                <div className="relative w-20 h-20">
                  <Image
                    src="/images/Artboard 1@300x.png"
                    alt="Mahutin Ferme Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-right flex-1 ml-4">
                  <h1 className="text-lg font-bold text-[#1E5B8C]">
                    {COMPANY_INFO.name}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>

              {/* Numéro de facture */}
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold text-[#1E5B8C]">
                  Facture N° {invoiceNumber}
                </h2>
              </div>
            </div>

            {/* Infos client */}
            <div className="p-4 bg-white/50 flex justify-between items-center">
              <p className="text-sm">
                <span className="font-semibold">Client:</span> {order.customerName}
              </p>
              <p className="text-sm">
                le {day}/{month}/{year}
              </p>
            </div>

            {/* Tableau des produits */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1E5B8C] text-white">
                    <th className="px-4 py-3 text-left w-16">Qte</th>
                    <th className="px-4 py-3 text-left">Désignation</th>
                    <th className="px-4 py-3 text-right w-24">P.Unit.</th>
                    <th className="px-4 py-3 text-right w-28">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr
                      key={item.product.id}
                      className={index % 2 === 0 ? 'bg-white/60' : 'bg-white/30'}
                    >
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3">{item.product.name}</td>
                      <td className="px-4 py-3 text-right">
                        {formatPrice(item.product.price).replace(' FCFA', '')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatPrice(item.product.price * item.quantity).replace(' FCFA', '')}
                      </td>
                    </tr>
                  ))}
                  {/* Lignes vides pour remplir */}
                  {Array.from({ length: Math.max(0, 4 - order.items.length) }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className={(order.items.length + i) % 2 === 0 ? 'bg-white/60' : 'bg-white/30'}
                    >
                      <td className="px-4 py-3">&nbsp;</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="p-4 flex justify-end">
              <div className="space-y-2 text-sm w-64">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison ({order.deliveryZone.name}):</span>
                  <span>{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between bg-[#1E5B8C] text-white p-2 rounded font-bold">
                  <span>TOTAL:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="p-4 text-right">
              <p className="text-sm mb-4">Nom & Prénoms</p>
              <p className="text-sm">Signature</p>
            </div>

            {/* Pied de page */}
            <div className="p-4 border-t border-[#1E5B8C]/30 text-center text-xs text-[#1E5B8C] space-y-1">
              <p className="font-semibold">
                TÉL.: {COMPANY_INFO.phones.join(' / ')}
              </p>
              <p>- E-MAIL : {COMPANY_INFO.email}</p>
              <p>
                {COMPANY_INFO.bp} - IFU : {COMPANY_INFO.ifu}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
