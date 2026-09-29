-- 0003_indexes.sql — index pendukung query katalog & admin

create index idx_cars_status on cars(status);
create index idx_cars_featured on cars(is_featured) where is_featured = true;
create index idx_cars_brand on cars(brand_id);
create index idx_inquiries_status on inquiries(status);