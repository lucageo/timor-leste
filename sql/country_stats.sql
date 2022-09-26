--CREATE TABLE analyst.countries_25112021 as
WITH country as(
select fid, "id", id_gaul,geom, area_calcu, adm0_code, adm0_name, iso3
	from analyst.countries_latest
),
average_val_c as(
SELECT adm0_code,
(AVG(carbon)::double precision) AS carbon_a,
(AVG(water)::double precision) AS water_a, 
(AVG("natural")::double precision) AS nat_a, 
(AVG(forest)::double precision) AS forest_a, 
(AVG(mammals)::double precision) AS mam_a, 
(AVG(mammals_th)::double precision) AS th_mam_a, 
(AVG(amphibians)::double precision) AS amp_a, 
(AVG(amphi_th)::double precision) AS th_amp_a, 
(AVG(birds)::double precision) AS birds_a,
(AVG(birds_th)::double precision) AS th_birds_a
FROM analyst.points_3857_25112021
WHERE protection = 0 
group by adm0_code
),

average_val_c_tot as(
SELECT adm0_code,
(AVG(carbon)::double precision) AS carbon_a_u,
(AVG(water)::double precision) AS water_a_u, 
(AVG("natural")::double precision) AS nat_a_u, 
(AVG(forest)::double precision) AS forest_a_u, 
(AVG(mammals)::double precision) AS mam_a_u, 
(AVG(mammals_th)::double precision) AS th_mam_a_u, 
(AVG(amphibians)::double precision) AS amp_a_u, 
(AVG(amphi_th)::double precision) AS th_amp_a_u, 
(AVG(birds)::double precision) AS birds_a_u,
(AVG(birds_th)::double precision) AS th_birds_a_u
FROM analyst.points_3857_25112021
group by adm0_code
),

average_val_p as(
SELECT adm0_code,
(AVG(carbon)::double precision) AS carbon_a_p,
(AVG(water)::double precision) AS water_a_p, 
(AVG("natural")::double precision) AS nat_a_p, 
(AVG(forest)::double precision) AS forest_a_p, 
(AVG(mammals)::double precision) AS mam_a_p, 
(AVG(mammals_th)::double precision) AS th_mam_a_p, 
(AVG(amphibians)::double precision) AS amp_a_p, 
(AVG(amphi_th)::double precision) AS th_amp_a_p, 
(AVG(birds)::double precision) AS birds_a_p,
(AVG(birds_th)::double precision) AS th_birds_a_p
FROM analyst.points_3857_25112021
WHERE protection = 1 
group by adm0_code
),
all_vals as(
select country.fid, country."id", country.id_gaul, average_val_c.adm0_code, country.geom, country.adm0_name, country.area_calcu, country.iso3,
COALESCE(average_val_c.carbon_a + average_val_c.water_a + average_val_c.nat_a + average_val_c.forest_a + average_val_c.mam_a + average_val_c.th_mam_a + average_val_c.amp_a + average_val_c.th_amp_a+average_val_c.birds_a + average_val_c.th_birds_a, 0) as all_avg_c,
COALESCE(average_val_p.carbon_a_p + average_val_p.water_a_p + average_val_p.nat_a_p + average_val_p.forest_a_p + average_val_p.mam_a_p + average_val_p.th_mam_a_p + average_val_p.amp_a_p + average_val_p.th_amp_a_p +average_val_p.birds_a_p + average_val_p.th_birds_a_p, 0) as all_avg_p,
COALESCE(average_val_c_tot.carbon_a_u + average_val_c_tot.water_a_u + average_val_c_tot.nat_a_u + average_val_c_tot.forest_a_u + average_val_c_tot.mam_a_u + average_val_c_tot.th_mam_a_u + average_val_c_tot.amp_a_u + average_val_c_tot.th_amp_a_u+average_val_c_tot.birds_a_u + average_val_c_tot.th_birds_a_u, 0) as all_avg_tot,
COALESCE(average_val_c.carbon_a, 0) as carbon_a, 
COALESCE(average_val_c.water_a, 0) as water_a, 
COALESCE(average_val_c.nat_a, 0) as nat_a, 
COALESCE(average_val_c.forest_a, 0) as forest_a, 
COALESCE(average_val_c.mam_a, 0) as mam_a, 
COALESCE(average_val_c.th_mam_a, 0) as th_mam_a, 
COALESCE(average_val_c.amp_a, 0) as amp_a, 
COALESCE(average_val_c.th_amp_a, 0) as th_amp_a, 
COALESCE(average_val_c.birds_a, 0) as birds_a, 
COALESCE(average_val_c.th_birds_a, 0) as th_birds_a, 
COALESCE(average_val_p.carbon_a_p, 0) as carbon_a_p, 
COALESCE(average_val_p.water_a_p, 0) as water_a_p, 
COALESCE(average_val_p.nat_a_p, 0) as nat_a_p, 
COALESCE(average_val_p.forest_a_p, 0) as forest_a_p, 
COALESCE(average_val_p.mam_a_p, 0) as mam_a_p, 
COALESCE(average_val_p.th_mam_a_p, 0) as th_mam_a_p, 
COALESCE(average_val_p.amp_a_p, 0) as amp_a_p, 
COALESCE(average_val_p.th_amp_a_p, 0) as th_amp_a_p, 
COALESCE(average_val_p.birds_a_p, 0) as birds_a_p,
COALESCE(average_val_p.th_birds_a_p, 0) as th_birds_a_p 
from average_val_c
LEFT JOIN country on average_val_c.adm0_code::character varying = country.adm0_code::character varying
LEFT JOIN average_val_p on average_val_c.adm0_code::character varying = average_val_p.adm0_code::character varying
LEFT JOIN average_val_c_tot on average_val_c.adm0_code::character varying = average_val_c_tot.adm0_code::character varying
)

SELECT fid, "id",adm0_code,adm0_name, geom, id_gaul, area_calcu, iso3, all_avg_c, all_avg_p, all_avg_tot, all_avg_c-all_avg_p as all_avg_diff,
       CASE
           WHEN all_avg_c-all_avg_p < -0.2
		    THEN 'Low'
		   WHEN all_avg_c-all_avg_p BETWEEN -0.2 AND 0
			THEN 'Medium'
			ELSE 'High'
       END deserve_att,
carbon_a,water_a,nat_a,forest_a,mam_a,th_mam_a,amp_a,th_amp_a,birds_a,th_birds_a,
carbon_a_p,water_a_p,nat_a_p,forest_a_p,mam_a_p,th_mam_a_p,amp_a_p,th_amp_a_p,birds_a_p,th_birds_a_p
FROM all_vals

order by all_avg_diff





