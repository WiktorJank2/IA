package com.example.demo.domains.workout;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.domains.exercise.ExerciseMapper;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.workout.WorkoutEntity;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WorkoutMapper {

    private ExerciseMapper exerciseMapper;

    public WorkoutMapper(ExerciseMapper exerciseMapper) {
        this.exerciseMapper = exerciseMapper;
    }

    public WorkoutEntity toEntity(WorkoutDto dto) {
        WorkoutEntity entity = new WorkoutEntity();

        if (dto.getId() != null ) {
            entity.setId(dto.getId());
        }

        entity.setName(dto.getName());


        return entity;
    }

    public WorkoutDto toDto(WorkoutEntity entity) {
        WorkoutDto dto = new WorkoutDto();

        dto.setId(entity.getId());
        dto.setName(entity.getName());

//        dto.setExercises(entity.getExercises().stream()
//                .map(ExerciseEntity::getExercise)
//                .map(this.exerciseMapper::toDto)
//                .toList());


        return dto;
    }
}