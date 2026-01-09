package com.example.demo.domains.exercise;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.repository.exercise.ExerciseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExerciseMapper {

    public ExerciseEntity toEntity(ExerciseDto dto) {
        ExerciseEntity entity = new ExerciseEntity();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setMuscles(dto.getMuscles());
        entity.setDifficultyRating(dto.getDifficultyRating());
        entity.setEffectivenessRating(dto.getEffectivenessRating());
        entity.setOverallRating(dto.getOverallRating());


        return entity;
    }

    public ExerciseDto toDto(ExerciseEntity entity) {
        ExerciseDto dto = new ExerciseDto();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setMuscles(entity.getMuscles());
        dto.setDifficultyRating(entity.getDifficultyRating());
        dto.setEffectivenessRating(entity.getEffectivenessRating());
        dto.setOverallRating(entity.getOverallRating());


        return dto;
    }
}