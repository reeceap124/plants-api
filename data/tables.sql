-- SCHEMA TESTS???

-- CREATE EXTENSION ltree;
-- PLANTS
CREATE TABLE public.plants
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    common_name text NOT NULL,
    scientific_name text,
    PRIMARY KEY (id)
);
-- INVENTORY STATUSES
CREATE TABLE public.inventory_statuses
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    status text NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_status UNIQUE (status)
);
-- INVENTORY
CREATE TABLE IF NOT EXISTS public.inventory
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    plants_key bigint NOT NULL,
    ancestry ltree NOT NULL,
    status_key bigint NOT NULL,
    cost numeric NOT NULL DEFAULT 0,
    acquired_from text,
    acquired_date date DEFAULT NOW()::date,
    CONSTRAINT inventory_pkey PRIMARY KEY (id),
    CONSTRAINT inventory_plants_key_fkey FOREIGN KEY (plants_key)
        REFERENCES public.plants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT inventory_status_key_fkey FOREIGN KEY (status_key)
        REFERENCES public.inventory_statuses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
CREATE INDEX ancestry_ltree_idx ON public.inventory USING gist (ancestry);
-- SALE VENUES
CREATE TABLE public.sale_venues
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    PRIMARY KEY (id)
);
-- SALES
CREATE TABLE IF NOT EXISTS public.sales
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    venue_key bigint NOT NULL,
    sale_amount numeric DEFAULT 0,
    tax_amount numeric DEFAULT 0,
    inventory_key bigint NOT NULL,
    sale_date date NOT NULL,
    shipping_amount integer DEFAULT 0,
    shipped boolean DEFAULT false,
    CONSTRAINT sales_pkey PRIMARY KEY (id),
    CONSTRAINT sales_inventory_key_fkey FOREIGN KEY (inventory_key)
        REFERENCES public.inventory (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT sales_venue_key_fkey FOREIGN KEY (venue_key)
        REFERENCES public.sale_venues (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- where it came from
-- acquire date
-- personal, mother, not available, for sale, sold, dead

-- how much an original purchase has paid off
-- keep track of plant statuses
-- tag scanning ???