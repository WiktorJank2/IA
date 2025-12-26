package com.example.demo.service;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.entities.Exercise;
import com.example.demo.entities.Workout;
import com.example.demo.entities.WorkoutExercise;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.exercise.ExerciseRepository;
import com.example.demo.repository.workout.WorkoutEntity;
import com.example.demo.repository.workout.WorkoutRepository;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutService(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public WorkoutDto toDto(WorkoutEntity workoutEntity) {
        WorkoutDto dto = new WorkoutDto();
        dto.setId(workoutEntity.getId());
        dto.setName(workoutEntity.getName());

        List<WorkoutExerciseDto> exercisesDto = workoutEntity.getExercises().stream()
                .map(we -> {
                    // Create ExerciseDto from the ExerciseEntity inside WorkoutExercise
                    ExerciseDto exerciseDto = new ExerciseDto();
                    exerciseDto.setId(we.getExercise().getId());  // or getUuid() depending on your entity
                    exerciseDto.setName(we.getExercise().getName());
                    exerciseDto.setMuscles(we.getExercise().getMuscles());
                    exerciseDto.setDifficultyRating(we.getExercise().getDifficultyRating());
                    exerciseDto.setEffectivenessRating(we.getExercise().getEffectivenessRating());
                    exerciseDto.setOverallRating(we.getExercise().getOverallRating());

                    // Create WorkoutExerciseDto
                    WorkoutExerciseDto weDto = new WorkoutExerciseDto();
                    weDto.setExercise(exerciseDto);
                    weDto.setSets(we.getSets());
                    weDto.setReps(we.getReps()); // adjust if your field name is different

                    return weDto;
                })
                .toList();
        WorkoutDto workoutDto = new WorkoutDto();
        workoutDto.setId(workoutEntity.getId());
        workoutDto.setName(workoutEntity.getName());
        workoutDto.setExercises(exercisesDto);


        return dto;
    }

}