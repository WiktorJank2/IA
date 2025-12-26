package com.example.demo.domains.plan;

import com.example.demo.controllers.plan.PlanDto;
import com.example.demo.repository.plan.PlanEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PlanMapper {

    public PlanEntity toEntity(PlanDto dto) {
        PlanEntity entity = new PlanEntity();

        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setName(dto.getName());
        entity.setWorkoutIds(dto.getWorkoutIds());
        entity.setSelected(dto.isSelected());

        return entity;
    }

    public PlanDto toDto(PlanEntity entity) {
        PlanDto dto = new PlanDto();

        dto.setId(entity.getId().toString());
        dto.setName(entity.getName());
        dto.setWorkoutIds(entity.getWorkoutIds());
        dto.setSelected(entity.isSelected());

        return dto;
    }
}