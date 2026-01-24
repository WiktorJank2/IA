import { ExerciseDto } from '@/pages/service/exercise/exercise.model'; // adjust path if needed
import { WorkoutDto } from '@/pages/service/workout/workout.model';   // if you also use WorkoutDto

export interface WorkoutExerciseDto{
    id?: string;
    sets: number;
    reps: number;
    weight:number;
    exercise: ExerciseDto;
    workout: WorkoutDto;

}
