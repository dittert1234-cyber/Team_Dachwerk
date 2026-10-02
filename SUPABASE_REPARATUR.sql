-- DACHWERK – Reparatur der Berechtigungen
-- Dieses SQL im Supabase SQL Editor ausführen.
-- Es behebt: "permission denied for table dachwerk_orders"

-- Schema-Zugriff für den Supabase API-Rollen
GRANT USAGE ON SCHEMA public TO authenticated;

-- Aufträge
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.dachwerk_orders TO authenticated;

-- Material-Stammdaten
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.dachwerk_material_master TO authenticated;

-- Baustelleneinrichtung-Stammdaten
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.dachwerk_setup_master TO authenticated;

-- Zentrale Auftragsnummer
GRANT EXECUTE ON FUNCTION public.next_dachwerk_order_number() TO authenticated;

-- RLS sicher aktivieren
ALTER TABLE public.dachwerk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dachwerk_material_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dachwerk_setup_master ENABLE ROW LEVEL SECURITY;

-- Aufträge: alle angemeldeten DACHWERK-Benutzer dürfen gemeinsame Aufträge lesen,
-- anlegen, bearbeiten und löschen.
DROP POLICY IF EXISTS "authenticated users can read orders" ON public.dachwerk_orders;
DROP POLICY IF EXISTS "authenticated users can insert orders" ON public.dachwerk_orders;
DROP POLICY IF EXISTS "authenticated users can update orders" ON public.dachwerk_orders;
DROP POLICY IF EXISTS "authenticated users can delete orders" ON public.dachwerk_orders;

CREATE POLICY "authenticated users can read orders"
ON public.dachwerk_orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert orders"
ON public.dachwerk_orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated users can update orders"
ON public.dachwerk_orders FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete orders"
ON public.dachwerk_orders FOR DELETE TO authenticated USING (true);

-- Material
DROP POLICY IF EXISTS "authenticated users can read material" ON public.dachwerk_material_master;
DROP POLICY IF EXISTS "authenticated users can insert material" ON public.dachwerk_material_master;
DROP POLICY IF EXISTS "authenticated users can update material" ON public.dachwerk_material_master;
DROP POLICY IF EXISTS "authenticated users can delete material" ON public.dachwerk_material_master;

CREATE POLICY "authenticated users can read material"
ON public.dachwerk_material_master FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated users can insert material"
ON public.dachwerk_material_master FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated users can update material"
ON public.dachwerk_material_master FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated users can delete material"
ON public.dachwerk_material_master FOR DELETE TO authenticated USING (true);

-- Baustelleneinrichtung
DROP POLICY IF EXISTS "authenticated users can read setup" ON public.dachwerk_setup_master;
DROP POLICY IF EXISTS "authenticated users can insert setup" ON public.dachwerk_setup_master;
DROP POLICY IF EXISTS "authenticated users can update setup" ON public.dachwerk_setup_master;
DROP POLICY IF EXISTS "authenticated users can delete setup" ON public.dachwerk_setup_master;

CREATE POLICY "authenticated users can read setup"
ON public.dachwerk_setup_master FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated users can insert setup"
ON public.dachwerk_setup_master FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated users can update setup"
ON public.dachwerk_setup_master FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated users can delete setup"
ON public.dachwerk_setup_master FOR DELETE TO authenticated USING (true);

-- Kontrolle: danach Seite neu laden und erneut speichern.
