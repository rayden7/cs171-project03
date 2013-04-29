select experience , count(distinct riderid) numberOfDeathRiders
from (
    select riderid, count(distinct year) experience
    from riders r left join race_data d on d.rider_id = r.riderid and year != deathyear
    where  deathnumber != 0
    group by riderid
    ) t
group by experience;