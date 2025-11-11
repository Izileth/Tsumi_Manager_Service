-- 1. Create territories table
CREATE TABLE public.territories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clan_id uuid NOT NULL REFERENCES public.clans(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.territories IS 'Territories controlled by clans.';

-- 2. Create missions table
CREATE TABLE public.missions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    territory_id uuid NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    reward JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.missions IS 'Missions available in territories.';

-- 3. Enable RLS for new tables
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- 4. Create helper function to check clan membership
CREATE OR REPLACE FUNCTION is_clan_member(p_clan_id uuid, p_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE clan_id = p_clan_id AND id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create helper function to check clan ownership
CREATE OR REPLACE FUNCTION is_clan_owner(p_clan_id uuid, p_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.clans
        WHERE id = p_clan_id AND owner_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Policies for territories table
CREATE POLICY "Clan members can view territories"
ON public.territories
FOR SELECT
USING (is_clan_member(clan_id, auth.uid()));

CREATE POLICY "Clan owners can create territories"
ON public.territories
FOR INSERT
WITH CHECK (is_clan_owner(clan_id, auth.uid()));

CREATE POLICY "Clan owners can update territories"
ON public.territories
FOR UPDATE
USING (is_clan_owner(clan_id, auth.uid()));

CREATE POLICY "Clan owners can delete territories"
ON public.territories
FOR DELETE
USING (is_clan_owner(clan_id, auth.uid()));

-- 7. Policies for missions table
CREATE POLICY "Clan members can view missions"
ON public.missions
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.territories t
        JOIN public.profiles p ON t.clan_id = p.clan_id
        WHERE t.id = missions.territory_id AND p.id = auth.uid()
    )
);

CREATE POLICY "Clan owners can create missions"
ON public.missions
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.territories t
        WHERE t.id = missions.territory_id AND is_clan_owner(t.clan_id, auth.uid())
    )
);

CREATE POLICY "Clan owners can update missions"
ON public.missions
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM public.territories t
        WHERE t.id = missions.territory_id AND is_clan_owner(t.clan_id, auth.uid())
    )
);

CREATE POLICY "Clan owners can delete missions"
ON public.missions
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM public.territories t
        WHERE t.id = missions.territory_id AND is_clan_owner(t.clan_id, auth.uid())
    )
);

-- 8. Create indexes for foreign keys
CREATE INDEX idx_territories_clan_id ON public.territories(clan_id);
CREATE INDEX idx_missions_territory_id ON public.missions(territory_id);
