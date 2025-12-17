package com.example.demo.domains.workout;

import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.repository.workout.WorkoutEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WorkoutMapper {

    public WorkoutEntity toEntity(WorkoutDto dto) {
        WorkoutEntity entity = new WorkoutEntity();

        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setName(dto.getName());
        entity.setExercisesIds(dto.getExercisesIds());

        return entity;
    }

    public WorkoutDto toDto(WorkoutEntity entity) {
        WorkoutDto dto = new WorkoutDto();

        dto.setId(entity.getId().toString());
        dto.setName(entity.getName());
        dto.setExercisesIds(dto.getExercisesIds());

        return dto;
    }
}