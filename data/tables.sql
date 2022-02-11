-- SCHEMA TESTS???

CREATE EXTENSION ltree;

-- USERS
CREATE TABLE public.users
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    email text NOT NULL,
    password text NOT NULL,
    username text,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.users;

-- PLANTS
CREATE TABLE public.plants
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    common_name text NOT NULL,
    scientific_name text,
    PRIMARY KEY (id),
    CONSTRAINT plants_creator_key_fkey FOREIGN KEY (creator_key) REFERENCES users (id)
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
    users_key bigint NOT NULL,
    medium_key bigint,
    CONSTRAINT inventory_pkey PRIMARY KEY (id),
    CONSTRAINT inventory_plants_key_fkey FOREIGN KEY (plants_key)
        REFERENCES public.plants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT inventory_status_key_fkey FOREIGN KEY (status_key)
        REFERENCES public.inventory_statuses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT inventory_users_key_fkey FOREIGN KEY
    CONSTRAINT inventory_medium_key_fkey FOREIGN KEY(medium_key) 
        REFERENCES public.growing_medium (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    (users_key)
        REFERENCES public.users (id) MATCH SIMPLE
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

CREATE TABLE public.growing_medium
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    medium text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.medium_history
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    inventory_key bigint NOT NULL,
    medium_key bigint NOT NULL,
    insertion_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (inventory_key)
        REFERENCES public.inventory (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    FOREIGN KEY (medium_key)
        REFERENCES public.growing_medium (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE OR REPLACE FUNCTION medium_history_audit_trigger_func()
RETURNS trigger AS $body$
BEGIN
   if (UPPER(TG_OP) = 'INSERT') then
       INSERT INTO medium_history (
           inventory_key,
		   medium_key,
		   insertion_date
       )
       VALUES(
           NEW.id,
		   NEW.medium_key,
		   NOW()::date
       );
             
       RETURN NEW;
	  elsif (UPPER(TG_OP) = 'UPDATE' AND OLD.medium_key != NEW.medium_key) then
           INSERT INTO medium_history (
           inventory_key,
		   medium_key,
		   insertion_date
       )
       VALUES(
           OLD.id,
		   NEW.medium_key,
		   NOW()::date
       );
             
       RETURN NEW;
	   else RETURN null;
   end if;   
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER medium_history_audit_trigger
AFTER INSERT OR UPDATE
ON inventory
FOR EACH ROW
EXECUTE FUNCTION medium_history_audit_trigger_func();

-- where it came from
-- acquire date
-- personal, mother, not available, for sale, sold, dead

-- how much an original purchase has paid off
-- keep track of plant statuses
-- tag scanning ???


    --   select i.*, p.id as plant_id, p.common_name, p.scientific_name, s.id as status_id, s.status, m.id as medium_id, medium from inventory i
    --   JOIN plants p on i.plants_key = p.id
    --   JOIN inventory_statuses s on i.status_key = s.id
    --   JOIN users u on i.users_key = u.id
	--   JOIN growing_medium m on i.medium_key = m.id
    --   WHERE u.id = 1


--     CREATE OR REPLACE FUNCTION medium_history_audit_trigger_func()
-- RETURNS trigger AS $body$
-- BEGIN
--    if (UPPER(TG_OP) = 'INSERT') then
--        INSERT INTO medium_history (
--            inventory_key,
-- 		   medium_key,
-- 		   insertion_date
--        )
--        VALUES(
--            NEW.id,
-- 		   NEW.medium_key,
-- 		   NOW()::date
--        );
             
--        RETURN NEW;
-- 	  elsif (UPPER(TG_OP) = 'UPDATE' AND OLD.medium_key != NEW.medium_key) then
--            INSERT INTO medium_history (
--            inventory_key,
-- 		   medium_key,
-- 		   insertion_date
--        )
--        VALUES(
--            OLD.id,
-- 		   NEW.medium_key,
-- 		   NOW()::date
--        );
             
--        RETURN NEW;
-- 	   else RETURN null;
--    end if;   
-- END;
-- $body$
-- LANGUAGE plpgsql




-- CREATE TRIGGER medium_history_audit_trigger
-- AFTER INSERT OR UPDATE
-- ON inventory
-- FOR EACH ROW
-- EXECUTE FUNCTION medium_history_audit_trigger_func()