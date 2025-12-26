export interface ExerciseDto{
    id?: string;
    name: string;
    description: string;
    muscles: string[];
    difficultyRating: number;
    effectivenessRating: number;
    overallRating: number;

    sets?: number;
    repetitions?: number;

}
