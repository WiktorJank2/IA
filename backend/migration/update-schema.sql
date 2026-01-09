ALTER TABLE workouts_exercises
DROP
CONSTRAINT fkck8o55l42uhhx0wbac6d14s1r;

ALTER TABLE workouts_exercises
DROP
CONSTRAINT fkn4dxgaa8ly7xrvuxco88w0tbo;

DROP TABLE workouts_exercises CASCADE;

ALTER TABLE exercises
ALTER
COLUMN muscles TYPE TEXT[] USING (muscles::TEXT[]);

ALTER TABLE plans
ALTER
COLUMN workout_ids TYPE TEXT[] USING (workout_ids::TEXT[]);