// Edge Function pour envoyer une notification email lors d'une nouvelle commande
// Déployer avec: supabase functions deploy send-order-notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'fermemahutin@gmail.com'

interface OrderPayload {
  type: 'INSERT'
  table: 'orders'
  record: {
    id: string
    order_number: string
    customer_name: string
    customer_phone: string
    customer_address: string
    items: Array<{
      product_name: string
      quantity: number
      price: number
    }>
    subtotal: number
    delivery_fee: number
    total: number
    created_at: string
  }
}

serve(async (req) => {
  try {
    const payload: OrderPayload = await req.json()

    // Vérifier que c'est bien une insertion
    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Not an insert event' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const order = payload.record

    // Formater les items pour l'email
    const itemsList = order.items
      .map(item => `• ${item.product_name} x${item.quantity} - ${item.price * item.quantity} FCFA`)
      .join('\n')

    // Formater la date
    const orderDate = new Date(order.created_at).toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
    })

    // Contenu de l'email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🥚 Nouvelle Commande !</h1>
        </div>

        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #10B981; margin-top: 0;">Commande #${order.order_number}</h2>
            <p style="color: #6b7280; margin: 0;">${orderDate}</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #374151;">👤 Client</h3>
            <p><strong>Nom:</strong> ${order.customer_name}</p>
            <p><strong>Téléphone:</strong> ${order.customer_phone}</p>
            <p><strong>Adresse:</strong> ${order.customer_address}</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #374151;">📦 Produits commandés</h3>
            <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${itemsList}</pre>
          </div>

          <div style="background: #10B981; border-radius: 12px; padding: 20px; color: white;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Sous-total:</span>
              <span>${order.subtotal} FCFA</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Livraison:</span>
              <span>${order.delivery_fee} FCFA</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">
              <span>TOTAL:</span>
              <span>${order.total} FCFA</span>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://votre-site.com/admin" style="background: #10B981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
              Voir dans l'admin
            </a>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>Mahutin Ferme - Cailles du Bénin</p>
        </div>
      </div>
    `

    // Envoyer l'email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mahutin Ferme <notifications@votre-domaine.com>',
        to: [ADMIN_EMAIL],
        subject: `🥚 Nouvelle commande #${order.order_number} - ${order.total} FCFA`,
        html: emailHtml,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Erreur Resend:', data)
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('Email envoyé:', data)
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
