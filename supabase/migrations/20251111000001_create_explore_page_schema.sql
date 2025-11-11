-- 1. Create the districts table to represent major areas of the map.
CREATE TABLE public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    map_coordinates JSONB, -- For storing {x, y} or more complex GeoJSON later
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.districts IS 'Represents major districts or wards on the game map, e.g., Shinjuku, Shibuya.';
COMMENT ON COLUMN public.districts.map_coordinates IS 'Stores coordinates for map visualization.';

-- 2. Alter the territories table to link it to a district.
ALTER TABLE public.territories
ADD COLUMN district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.territories.district_id IS 'The district this territory belongs to.';

-- 3. Create an events table for a global timeline/dashboard.
CREATE TABLE public.events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    clan_id UUID REFERENCES public.clans(id) ON DELETE SET NULL,
    territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON public.events (event_type);
CREATE INDEX ON public.events (clan_id);
CREATE INDEX ON public.events (territory_id);

COMMENT ON TABLE public.events IS 'Stores global events for the explore page dashboard and timeline.';
COMMENT ON COLUMN public.events.event_type IS 'Type of the event, e.g., TERRITORY_CONQUERED.';

-- 4. Create a trigger function to log territory changes to the events table.
CREATE OR REPLACE FUNCTION public.log_territory_change()
RETURNS TRIGGER AS $$
DECLARE
    old_clan_name TEXT;
    new_clan_name TEXT;
    territory_name_text TEXT;
BEGIN
    -- Get territory name
    SELECT name INTO territory_name_text FROM public.territories WHERE id = NEW.id;

    -- Case 1: Territory is conquered from another clan
    IF OLD.clan_id IS NOT NULL AND NEW.clan_id IS NOT NULL AND OLD.clan_id <> NEW.clan_id THEN
        SELECT name INTO old_clan_name FROM public.clans WHERE id = OLD.clan_id;
        SELECT name INTO new_clan_name FROM public.clans WHERE id = NEW.clan_id;
        INSERT INTO public.events (event_type, description, clan_id, territory_id, metadata)
        VALUES (
            'TERRITORY_CONQUERED',
            new_clan_name || ' conquistou ' || territory_name_text || ' de ' || old_clan_name || '.',
            NEW.clan_id,
            NEW.id,
            jsonb_build_object('previous_owner_id', OLD.clan_id)
        );
    -- Case 2: A neutral territory is conquered
    ELSIF OLD.clan_id IS NULL AND NEW.clan_id IS NOT NULL THEN
        SELECT name INTO new_clan_name FROM public.clans WHERE id = NEW.clan_id;
        INSERT INTO public.events (event_type, description, clan_id, territory_id)
        VALUES (
            'TERRITORY_CLAIMED',
            new_clan_name || ' reivindicou o território neutro ' || territory_name_text || '.',
            NEW.clan_id,
            NEW.id
        );
    -- Case 3: A territory becomes neutral
    ELSIF OLD.clan_id IS NOT NULL AND NEW.clan_id IS NULL THEN
        SELECT name INTO old_clan_name FROM public.clans WHERE id = OLD.clan_id;
        INSERT INTO public.events (event_type, description, clan_id, territory_id)
        VALUES (
            'TERRITORY_ABANDONED',
            old_clan_name || ' abandonou ' || territory_name_text || ', que agora é neutro.',
            OLD.clan_id,
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the trigger on the territories table.
CREATE TRIGGER on_territory_clan_change
AFTER UPDATE OF clan_id ON public.territories
FOR EACH ROW
EXECUTE FUNCTION public.log_territory_change();

-- 6. Seed the districts table with some initial data.
INSERT INTO public.districts (name, map_coordinates) VALUES
('Shinjuku', '{"x": 40, "y": 50}'),
('Shibuya', '{"x": 60, "y": 70}'),
('Roppongi', '{"x": 75, "y": 60}'),
('Akihabara', '{"x": 80, "y": 30}'),
('Ginza', '{"x": 90, "y": 55}'),
('Asakusa', '{"x": 95, "y": 20}');

-- 7. Enable RLS for new tables
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for RLS
-- Everyone can read districts and events.
CREATE POLICY "Allow public read access to districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (true);

-- Only service_role can insert/update/delete.
CREATE POLICY "Allow admin access to districts" ON public.districts FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow admin access to events" ON public.events FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
