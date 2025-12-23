-- Schema pour Mahutin Ferme - Cailles du Bénin
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  unit VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('eggs', 'meat')),
  image TEXT,
  stock INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des zones de livraison
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  estimated_time VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'delivered', 'cancelled')),
  validated_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des données initiales - Produits
INSERT INTO products (name, description, price, unit, category, image, stock, is_available) VALUES
  ('Oeufs de Cailles - Plateau de 30', 'Oeufs de caille frais de notre ferme, riches en protéines et en nutriments. Plateau de 30 œufs parfaits pour une alimentation saine.', 1000, 'plateau', 'eggs', '/images/eggs.jpg', 100, true),
  ('Viande de Caille Déplumée', 'Caille entière fraîche, soigneusement déplumée et nettoyée, prête à cuisiner. Idéale pour vos grillades et plats raffinés.', 1200, 'unité', 'meat', '/images/meat.jpg', 50, true)
ON CONFLICT DO NOTHING;

-- Insertion des données initiales - Zones de livraison
INSERT INTO delivery_zones (name, price, estimated_time, is_active) VALUES
  ('Cotonou', 1000, '1-2 heures', true),
  ('Calavi', 600, '2-3 heures', true),
  ('Porto-Novo', 1500, '3-4 heures', true)
ON CONFLICT DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_is_active ON delivery_zones(is_active);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_zones_updated_at ON delivery_zones;
CREATE TRIGGER update_delivery_zones_updated_at
  BEFORE UPDATE ON delivery_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table des tarifs professionnels
CREATE TABLE IF NOT EXISTS professional_pricing (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_tray INTEGER,
  min_quantity INTEGER DEFAULT 10,
  has_tray BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des données initiales - Tarifs professionnels
INSERT INTO professional_pricing (id, name, description, price_per_tray, min_quantity, has_tray, is_active) VALUES
  ('restaurants', 'Restaurants', '800F sans plateau - Contactez-nous sur WhatsApp', 800, 10, false, true),
  ('supermarches', 'Supermarchés', '900F avec plateau - Branding personnalisé disponible sur WhatsApp', 900, 10, true, true),
  ('evenements', 'Événements', '800F sans plateau - Mariages, séminaires, fêtes...', 800, 10, false, true),
  ('revendeurs', 'Revendeurs', '900F avec plateau - Partenariat pour la revente', 900, 10, true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_per_tray = EXCLUDED.price_per_tray,
  min_quantity = EXCLUDED.min_quantity,
  has_tray = EXCLUDED.has_tray,
  is_active = EXCLUDED.is_active;

-- Trigger pour updated_at sur professional_pricing
DROP TRIGGER IF EXISTS update_professional_pricing_updated_at ON professional_pricing;
CREATE TRIGGER update_professional_pricing_updated_at
  BEFORE UPDATE ON professional_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_pricing ENABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes avant de les recréer
DROP POLICY IF EXISTS "Produits visibles par tous" ON products;
DROP POLICY IF EXISTS "Zones visibles par tous" ON delivery_zones;
DROP POLICY IF EXISTS "Tarifs pro visibles par tous" ON professional_pricing;
DROP POLICY IF EXISTS "Créer commandes" ON orders;
DROP POLICY IF EXISTS "Lecture commandes" ON orders;
DROP POLICY IF EXISTS "Update products" ON products;
DROP POLICY IF EXISTS "Update zones" ON delivery_zones;
DROP POLICY IF EXISTS "Update orders" ON orders;
DROP POLICY IF EXISTS "Update professional_pricing" ON professional_pricing;
DROP POLICY IF EXISTS "Insert products" ON products;
DROP POLICY IF EXISTS "Insert zones" ON delivery_zones;
DROP POLICY IF EXISTS "Delete products" ON products;
DROP POLICY IF EXISTS "Delete zones" ON delivery_zones;

-- Policies pour lecture publique des produits et zones
CREATE POLICY "Produits visibles par tous" ON products FOR SELECT USING (true);
CREATE POLICY "Zones visibles par tous" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Tarifs pro visibles par tous" ON professional_pricing FOR SELECT USING (true);

-- Policy pour création de commandes par tous
CREATE POLICY "Créer commandes" ON orders FOR INSERT WITH CHECK (true);

-- Policy pour lecture des commandes (pour l'admin)
CREATE POLICY "Lecture commandes" ON orders FOR SELECT USING (true);

-- Policies pour mise à jour admin (avec anon key pour simplifier)
CREATE POLICY "Update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Update zones" ON delivery_zones FOR UPDATE USING (true);
CREATE POLICY "Update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Update professional_pricing" ON professional_pricing FOR UPDATE USING (true);
CREATE POLICY "Insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert zones" ON delivery_zones FOR INSERT WITH CHECK (true);
CREATE POLICY "Delete products" ON products FOR DELETE USING (true);
CREATE POLICY "Delete zones" ON delivery_zones FOR DELETE USING (true);

-- Table des statistiques de production
CREATE TABLE IF NOT EXISTS production_stats (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  total_quails INTEGER DEFAULT 500,
  male_quails INTEGER DEFAULT 100,
  female_quails INTEGER DEFAULT 400,
  eggs_collected_today INTEGER DEFAULT 0,
  total_eggs_in_stock INTEGER DEFAULT 3000,
  total_meat_in_stock INTEGER DEFAULT 50,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de production journalière
CREATE TABLE IF NOT EXISTS daily_production (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  eggs_collected INTEGER DEFAULT 0,
  quails_processed INTEGER DEFAULT 0,
  quails_lost INTEGER DEFAULT 0,
  notes TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des données initiales - Production stats
INSERT INTO production_stats (id, total_quails, male_quails, female_quails, eggs_collected_today, total_eggs_in_stock, total_meat_in_stock)
VALUES ('main', 500, 100, 400, 0, 3000, 50)
ON CONFLICT (id) DO NOTHING;

-- Index pour daily_production
CREATE INDEX IF NOT EXISTS idx_daily_production_date ON daily_production(date);
CREATE INDEX IF NOT EXISTS idx_daily_production_created_by ON daily_production(created_by);

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_production_stats_updated_at ON production_stats;
CREATE TRIGGER update_production_stats_updated_at
  BEFORE UPDATE ON production_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_production_updated_at ON daily_production;
CREATE TRIGGER update_daily_production_updated_at
  BEFORE UPDATE ON daily_production
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS sur les nouvelles tables
ALTER TABLE production_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_production ENABLE ROW LEVEL SECURITY;

-- Policies pour production_stats
DROP POLICY IF EXISTS "Production stats visibles par tous" ON production_stats;
DROP POLICY IF EXISTS "Update production_stats" ON production_stats;
DROP POLICY IF EXISTS "Insert production_stats" ON production_stats;

CREATE POLICY "Production stats visibles par tous" ON production_stats FOR SELECT USING (true);
CREATE POLICY "Update production_stats" ON production_stats FOR UPDATE USING (true);
CREATE POLICY "Insert production_stats" ON production_stats FOR INSERT WITH CHECK (true);

-- Policies pour daily_production
DROP POLICY IF EXISTS "Daily production visible par tous" ON daily_production;
DROP POLICY IF EXISTS "Insert daily_production" ON daily_production;
DROP POLICY IF EXISTS "Update daily_production" ON daily_production;
DROP POLICY IF EXISTS "Delete daily_production" ON daily_production;

CREATE POLICY "Daily production visible par tous" ON daily_production FOR SELECT USING (true);
CREATE POLICY "Insert daily_production" ON daily_production FOR INSERT WITH CHECK (true);
CREATE POLICY "Update daily_production" ON daily_production FOR UPDATE USING (true);
CREATE POLICY "Delete daily_production" ON daily_production FOR DELETE USING (true);

-- Table des dépenses (comptabilité)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('provende', 'medicament', 'equipement', 'salaire', 'transport', 'electricite', 'eau', 'autre')),
  description TEXT,
  amount INTEGER NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour expenses
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Trigger pour updated_at sur expenses
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS sur expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policies pour expenses
DROP POLICY IF EXISTS "Expenses visible par tous" ON expenses;
DROP POLICY IF EXISTS "Insert expenses" ON expenses;
DROP POLICY IF EXISTS "Update expenses" ON expenses;
DROP POLICY IF EXISTS "Delete expenses" ON expenses;

CREATE POLICY "Expenses visible par tous" ON expenses FOR SELECT USING (true);
CREATE POLICY "Insert expenses" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Update expenses" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Delete expenses" ON expenses FOR DELETE USING (true);

-- ============ NOTIFICATION EMAIL AUTOMATIQUE ============
-- Active l'extension pg_net pour les requêtes HTTP
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Fonction pour envoyer une notification email via SMTP
CREATE OR REPLACE FUNCTION send_order_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  smtp_host TEXT := 'smtp.gmail.com';
  smtp_port INTEGER := 465;
  smtp_user TEXT := current_setting('app.smtp_user', true);
  smtp_password TEXT := current_setting('app.smtp_password', true);
  admin_email TEXT := 'fermemahutin@gmail.com';
  email_subject TEXT;
  email_body TEXT;
  items_text TEXT := '';
  item RECORD;
BEGIN
  -- Construire la liste des produits
  FOR item IN SELECT * FROM jsonb_to_recordset(NEW.items::jsonb) AS x(product_name TEXT, quantity INTEGER, price INTEGER)
  LOOP
    items_text := items_text || '• ' || item.product_name || ' x' || item.quantity || ' - ' || (item.price * item.quantity) || ' FCFA' || E'\n';
  END LOOP;

  -- Sujet de l'email
  email_subject := '🥚 Nouvelle commande #' || NEW.order_number || ' - ' || NEW.total || ' FCFA';

  -- Corps de l'email
  email_body := 'NOUVELLE COMMANDE #' || NEW.order_number || E'\n\n' ||
    'CLIENT:' || E'\n' ||
    'Nom: ' || NEW.customer_name || E'\n' ||
    'Téléphone: ' || NEW.customer_phone || E'\n' ||
    'Adresse: ' || NEW.customer_address || E'\n\n' ||
    'PRODUITS:' || E'\n' || items_text || E'\n' ||
    'Sous-total: ' || NEW.subtotal || ' FCFA' || E'\n' ||
    'Livraison: ' || NEW.delivery_fee || ' FCFA' || E'\n' ||
    'TOTAL: ' || NEW.total || ' FCFA' || E'\n\n' ||
    '-- Mahutin Ferme - Cailles du Bénin';

  -- Appeler l'Edge Function via HTTP (si déployée)
  -- Ou envoyer via un service externe
  PERFORM net.http_post(
    url := current_setting('app.supabase_url', true) || '/functions/v1/send-order-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key', true)
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'orders',
      'record', jsonb_build_object(
        'id', NEW.id,
        'order_number', NEW.order_number,
        'customer_name', NEW.customer_name,
        'customer_phone', NEW.customer_phone,
        'customer_address', NEW.customer_address,
        'items', NEW.items,
        'subtotal', NEW.subtotal,
        'delivery_fee', NEW.delivery_fee,
        'total', NEW.total,
        'created_at', NEW.created_at
      )
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne bloque pas l'insertion
    RAISE WARNING 'Erreur envoi notification email: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour envoyer l'email à chaque nouvelle commande
DROP TRIGGER IF EXISTS on_new_order_send_email ON orders;
CREATE TRIGGER on_new_order_send_email
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION send_order_email_notification();

-- ============ CONFIGURATION REQUISE ============
-- Exécuter ces commandes une seule fois pour configurer les paramètres:
--
-- ALTER DATABASE postgres SET app.supabase_url = 'https://VOTRE-PROJECT.supabase.co';
-- ALTER DATABASE postgres SET app.supabase_anon_key = 'VOTRE-ANON-KEY';
-- ALTER DATABASE postgres SET app.smtp_user = 'fermemahutin@gmail.com';
-- ALTER DATABASE postgres SET app.smtp_password = 'VOTRE-MOT-DE-PASSE-APP';
