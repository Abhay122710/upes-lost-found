
CREATE TABLE public.deleted_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_item_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  date date NOT NULL,
  type text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'deleted',
  original_user_id uuid NOT NULL,
  deleted_by uuid NOT NULL,
  deletion_reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.deleted_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage deleted items"
  ON public.deleted_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view deleted items"
  ON public.deleted_items FOR SELECT
  TO authenticated
  USING (true);
