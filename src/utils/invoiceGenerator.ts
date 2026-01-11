import { jsPDF } from 'jspdf'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/store/useStore'

// Informations de l'entreprise
const COMPANY_INFO = {
  name: 'FERME AGRO-PASTORALE MAHUTIN',
  address: 'HOUETO PYLÔNES ARRONDISSEMENT DE TOKAN, ABOMEY-CALAVI',
  phones: ['+229 55 55 87 64', '96 06 74 92', '95 27 85 27', '90 81 26 51'],
  email: 'MAHUTINFERME@GMAIL.COM',
  bp: '08 BP 832 TRI POSTAL COTONOU',
  ifu: '0202279027082',
}

// Couleurs
const COLORS = {
  primary: '#1E5B8C', // Bleu foncé
  lightBlue: '#E8F4FC', // Bleu clair pour le fond
  text: '#333333',
  border: '#1E5B8C',
}

/**
 * Génère le numéro de facture basé sur le numéro de commande
 * Format: 3 chiffres séquentiels
 */
function generateInvoiceNumber(orderNumber: string): string {
  // Extraire les 3 derniers chiffres du numéro de commande
  const match = orderNumber.match(/(\d{3})$/)
  if (match) {
    return match[1]
  }
  // Fallback: générer un numéro basé sur le timestamp
  return String(Date.now()).slice(-3)
}

/**
 * Convertit une image en base64 pour l'intégrer au PDF
 */
async function loadLogoAsBase64(): Promise<string | null> {
  try {
    // En environnement client, charger l'image via fetch
    if (typeof window !== 'undefined') {
      const response = await fetch('/images/Artboard 1@300x.png')
      const blob = await response.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
    }
    return null
  } catch {
    console.warn('Could not load logo for invoice')
    return null
  }
}

/**
 * Génère une facture PDF pour une commande
 */
export async function generateInvoicePDF(order: Order): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = margin

  // Charger le logo
  const logoBase64 = await loadLogoAsBase64()

  // === EN-TÊTE ===

  // Fond bleu clair pour l'en-tête
  doc.setFillColor(232, 244, 252) // #E8F4FC
  doc.rect(0, 0, pageWidth, 50, 'F')

  // Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', margin, 8, 32, 32)
    } catch {
      // Logo non disponible, continuer sans
    }
  }

  // Nom de l'entreprise
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(30, 91, 140) // Bleu foncé
  doc.text(COMPANY_INFO.name, pageWidth / 2, 18, { align: 'center' })

  // Adresse
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(51, 51, 51)
  doc.text(COMPANY_INFO.address, pageWidth / 2, 26, { align: 'center' })

  // Numéro de facture
  yPosition = 40
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(30, 91, 140)
  const invoiceNumber = generateInvoiceNumber(order.orderNumber)
  doc.text(`Facture N° ${invoiceNumber}`, pageWidth / 2, yPosition, { align: 'center' })

  // === INFORMATIONS CLIENT ===
  yPosition = 58

  // Client et Date
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(51, 51, 51)

  // Ligne client
  doc.text(`Client: ${order.customerName}`, margin, yPosition)

  // Date
  const orderDate = new Date(order.createdAt)
  const day = orderDate.getDate().toString().padStart(2, '0')
  const month = (orderDate.getMonth() + 1).toString().padStart(2, '0')
  const year = orderDate.getFullYear()
  doc.text(`le ${day}/${month}/${year}`, pageWidth - margin - 35, yPosition)

  // === TABLEAU DES PRODUITS ===
  yPosition = 72

  // Dimensions du tableau
  const tableStartX = margin
  const tableWidth = pageWidth - (2 * margin)
  const colWidths = {
    qte: 20,
    designation: tableWidth - 20 - 30 - 35, // Reste pour désignation
    punit: 30,
    montant: 35,
  }

  // En-tête du tableau avec fond bleu
  doc.setFillColor(30, 91, 140)
  doc.rect(tableStartX, yPosition, tableWidth, 10, 'F')

  // Texte de l'en-tête
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)

  let xPos = tableStartX + 2
  doc.text('Qte', xPos + colWidths.qte / 2 - 5, yPosition + 7)
  xPos += colWidths.qte
  doc.text('Désignation', xPos + 5, yPosition + 7)
  xPos += colWidths.designation
  doc.text('P.Unit.', xPos + 3, yPosition + 7)
  xPos += colWidths.punit
  doc.text('Montant', xPos + 3, yPosition + 7)

  yPosition += 10

  // Lignes du tableau (produits)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(51, 51, 51)

  const rowHeight = 10
  const minRows = 8 // Nombre minimum de lignes à afficher

  // Dessiner les lignes de produits
  order.items.forEach((item, index) => {
    const rowY = yPosition + (index * rowHeight)

    // Fond alterné
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(tableStartX, rowY, tableWidth, rowHeight, 'F')
    }

    // Bordures
    doc.setDrawColor(200, 200, 200)
    doc.rect(tableStartX, rowY, tableWidth, rowHeight, 'S')

    // Contenu
    xPos = tableStartX + 2
    doc.text(String(item.quantity), xPos + colWidths.qte / 2 - 3, rowY + 7)
    xPos += colWidths.qte
    doc.text(item.product.name, xPos + 2, rowY + 7)
    xPos += colWidths.designation
    doc.text(formatPrice(item.product.price).replace(' FCFA', ''), xPos + 2, rowY + 7)
    xPos += colWidths.punit
    doc.text(formatPrice(item.product.price * item.quantity).replace(' FCFA', ''), xPos + 2, rowY + 7)
  })

  // Ajouter des lignes vides si nécessaire
  const emptyRowsNeeded = Math.max(0, minRows - order.items.length)
  for (let i = 0; i < emptyRowsNeeded; i++) {
    const rowY = yPosition + ((order.items.length + i) * rowHeight)

    if ((order.items.length + i) % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(tableStartX, rowY, tableWidth, rowHeight, 'F')
    }

    doc.setDrawColor(200, 200, 200)
    doc.rect(tableStartX, rowY, tableWidth, rowHeight, 'S')
  }

  yPosition += Math.max(order.items.length, minRows) * rowHeight + 5

  // === TOTAUX ===
  const totalsX = pageWidth - margin - 80

  // Sous-total
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Sous-total:', totalsX, yPosition)
  doc.text(formatPrice(order.subtotal), totalsX + 50, yPosition)
  yPosition += 6

  // Livraison
  doc.text(`Livraison (${order.deliveryZone.name}):`, totalsX, yPosition)
  doc.text(formatPrice(order.deliveryFee), totalsX + 50, yPosition)
  yPosition += 8

  // Total
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setFillColor(30, 91, 140)
  doc.rect(totalsX - 5, yPosition - 5, 85, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('TOTAL:', totalsX, yPosition + 2)
  doc.text(formatPrice(order.total), totalsX + 50, yPosition + 2)

  // === SECTION SIGNATURE ===
  yPosition += 25
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(51, 51, 51)

  // Nom & Prénoms
  doc.text('Nom & Prénoms:', pageWidth - margin - 60, yPosition)
  yPosition += 15
  doc.text('Signature:', pageWidth - margin - 60, yPosition)

  // === PIED DE PAGE ===
  const footerY = pageHeight - 25

  // Ligne de séparation
  doc.setDrawColor(30, 91, 140)
  doc.setLineWidth(0.5)
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

  // Informations de contact
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(30, 91, 140)

  const phoneText = `TÉL.: ${COMPANY_INFO.phones.join(' / ')}`
  doc.text(phoneText, pageWidth / 2, footerY, { align: 'center' })

  doc.text(`- E-MAIL : ${COMPANY_INFO.email}`, pageWidth / 2, footerY + 5, { align: 'center' })

  doc.text(`${COMPANY_INFO.bp} - IFU : ${COMPANY_INFO.ifu}`, pageWidth / 2, footerY + 10, { align: 'center' })

  return doc
}

/**
 * Télécharge la facture en PDF
 */
export async function downloadInvoice(order: Order): Promise<void> {
  const doc = await generateInvoicePDF(order)
  const invoiceNumber = generateInvoiceNumber(order.orderNumber)
  doc.save(`Facture_${invoiceNumber}_${order.customerName.replace(/\s+/g, '_')}.pdf`)
}

/**
 * Génère un blob PDF pour partage
 */
export async function getInvoiceBlob(order: Order): Promise<Blob> {
  const doc = await generateInvoicePDF(order)
  return doc.output('blob')
}

/**
 * Génère une URL de données pour prévisualisation
 */
export async function getInvoiceDataUrl(order: Order): Promise<string> {
  const doc = await generateInvoicePDF(order)
  return doc.output('dataurlstring')
}

/**
 * Ouvre la facture dans un nouvel onglet pour impression
 */
export async function printInvoice(order: Order): Promise<void> {
  const doc = await generateInvoicePDF(order)
  const pdfUrl = doc.output('bloburl')
  window.open(pdfUrl, '_blank')
}

/**
 * Partage la facture via WhatsApp
 */
export async function shareInvoiceViaWhatsApp(order: Order): Promise<void> {
  // Sur mobile, on ne peut pas directement envoyer le PDF via WhatsApp Web
  // On prépare un message avec les détails et encourage à télécharger
  const invoiceNumber = generateInvoiceNumber(order.orderNumber)
  const message = encodeURIComponent(
    `Bonjour ${order.customerName},\n\n` +
    `Merci pour votre commande chez Mahutin Ferme!\n\n` +
    `📄 *Facture N° ${invoiceNumber}*\n` +
    `📅 Date: ${formatDate(order.createdAt)}\n\n` +
    `*Détails de la commande:*\n` +
    order.items.map(item =>
      `- ${item.quantity}x ${item.product.name}: ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n') + '\n\n' +
    `Sous-total: ${formatPrice(order.subtotal)}\n` +
    `Livraison (${order.deliveryZone.name}): ${formatPrice(order.deliveryFee)}\n` +
    `*TOTAL: ${formatPrice(order.total)}*\n\n` +
    `Merci pour votre confiance!\n` +
    `Ferme Agro-Pastorale Mahutin\n` +
    `📞 +229 55 55 87 64`
  )

  // Formater le numéro de téléphone pour WhatsApp
  let phone = order.phone.replace(/\s/g, '')
  if (!phone.startsWith('+')) {
    phone = '+229' + phone
  }

  const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${message}`
  window.open(whatsappUrl, '_blank')
}

/**
 * Type pour les options de génération de facture
 */
export interface InvoiceOptions {
  includeSignature?: boolean
  customNote?: string
}
