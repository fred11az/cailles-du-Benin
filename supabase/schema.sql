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
  ('Oeufs de Cailles - Plateau de 30', 'Oeufs de caille frais de notre ferme, riches en protéines et en nutriments. Plateau de 30 œufs parfaits pour une alimentation saine.', 2500, 'plateau de 30', 'eggs', 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=800&q=80', 100, true),
  ('Viande de Caille Déplumée', 'Viande de caille fraîche, soigneusement déplumée et nettoyée, prête à cuisiner. Idéale pour vos grillades et plats raffinés.', 15000, 'kg', 'meat', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80', 50, true)
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

-- Activer Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique des produits et zones
CREATE POLICY "Produits visibles par tous" ON products FOR SELECT USING (true);
CREATE POLICY "Zones visibles par tous" ON delivery_zones FOR SELECT USING (true);

-- Policy pour création de commandes par tous
CREATE POLICY "Créer commandes" ON orders FOR INSERT WITH CHECK (true);

-- Policy pour lecture des commandes (pour l'admin)
CREATE POLICY "Lecture commandes" ON orders FOR SELECT USING (true);
