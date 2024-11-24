INSERT INTO user_subsets.property (subset_id, id, label, description, color, hidden)
select '{subset_id}', id, label, description, '#' || LPAD(TO_HEX(FLOOR(RANDOM() * 16777216)::INT), 6, '0'), False
from en.property
where id in (
    select distinct c.property from user_subsets.claims c where subset_id = '{subset_id}'
)
