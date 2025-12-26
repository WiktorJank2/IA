export interface WorkoutDto{
    id?: string;
    name: string;
    exercises: {
        id: string;
        sets: number;
        repetitions: number;
    }[];

}

