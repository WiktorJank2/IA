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

        if (dto.getId() != null ) {
            entity.setId(dto.getId());
        }

        WorkoutEntity p = workoutRepository.findById(dto.getWorkout().getId()).get();
        entity.setWorkout(p);

        ExerciseEntity s = exerciseRepository.findById(dto.getExercise().getId()).get();
        entity.setExercise(s);

        entity.setReps(dto.getReps());
        entity.setSets(dto.getSets());
        entity.setWeight(dto.getWeight());


        return entity;
    }


    public WorkoutExerciseDto toDto(WorkoutExerciseEntity entity) {
        WorkoutExerciseDto dto = new WorkoutExerciseDto();

        dto.setId(entity.getId());

        WorkoutDto workoutDto = workoutMapper.toDto(entity.getWorkout());
        dto.setWorkout(workoutDto);

        ExerciseDto exerciseDto = exerciseMapper.toDto(entity.getExercise());
        dto.setExercise(exerciseDto);


        dto.setId(entity.getId());
        dto.setReps(entity.getReps());
        dto.setSets(entity.getSets());
        dto.setWeight(entity.getWeight());



        return dto;
    }
}