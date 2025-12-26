package com.example.demo.domains.workout;

import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.repository.workout.WorkoutEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WorkoutMapper {

    public WorkoutEntity toEntity(WorkoutDto dto) {
        WorkoutEntity entity = new WorkoutEntity();

        if (dto.getId() != null ) {
            entity.setId(dto.getId());
        }

        entity.setName(dto.getName());
        entity.setExercises(dto.getExercises());

        return entity;
    }

    public WorkoutDto toDto(WorkoutEntity entity) {
        WorkoutDto dto = new WorkoutDto();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setExercises(entity.getExercises());


        return dto;
    }
}