package com.example.demo.domains.workoutExercise;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.domains.exercise.ExerciseMapper;
import com.example.demo.domains.workout.WorkoutMapper;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.exercise.ExerciseRepository;
import com.example.demo.repository.workout.WorkoutEntity;
import com.example.demo.repository.workout.WorkoutRepository;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WorkoutExerciseMapper {

    private final ExerciseMapper exerciseMapper;
    private final WorkoutMapper workoutMapper;
    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutExerciseMapper(ExerciseMapper exerciseMapper, WorkoutMapper workoutMapper, WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository) {
        this.exerciseMapper = exerciseMapper;
        this.workoutMapper = workoutMapper;
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
    }


    public WorkoutExerciseEntity toEntity(WorkoutExerciseDto dto) {
        WorkoutExerciseEntity entity = new WorkoutExerciseEntity();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        // Fetch related entities from repositories
        WorkoutEntity workout = workoutRepository.findById(dto.getWorkout().getId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));
        entity.setWorkout(workout);

        ExerciseEntity exercise = exerciseRepository.findById(dto.getExercise().getId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        entity.setExercise(exercise);

        entity.setSets(dto.getSets());
        entity.setReps(dto.getReps());
        entity.setWeight(dto.getWeight());

        return entity;
    }


    public WorkoutExerciseDto toDto(WorkoutExerciseEntity entity) {
        WorkoutExerciseDto dto = new WorkoutExerciseDto();

        dto.setId(entity.getId());

        ExerciseDto exerciseDto = exerciseMapper.toDto(entity.getExercise());
        dto.setExercise(exerciseDto);

        WorkoutDto workoutDto = workoutMapper.toDto(entity.getWorkout());
        dto.setWorkout(workoutDto);

        dto.setSets(entity.getSets());
        dto.setReps(entity.getReps());
        dto.setWeight(entity.getWeight());

        return dto;
    }
}