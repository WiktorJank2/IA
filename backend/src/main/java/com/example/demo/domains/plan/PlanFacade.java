package com.example.demo.domains.plan;


import com.example.demo.controllers.plan.PlanDto;
import com.example.demo.repository.plan.PlanEntity;
import com.example.demo.repository.plan.PlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PlanFacade {

    private final PlanRepository planRepository;
    private final PlanMapper planMapper;

    public PlanFacade(PlanRepository planRepository, PlanMapper planMapper) {
        this.planRepository = planRepository;
        this.planMapper = planMapper;
    }

    public List<PlanDto> getPlans() {
        List<PlanEntity> planRepositoryAll = this.planRepository.findAll();

        return planRepositoryAll
                .stream()
                .map(planMapper::toDto)
                .toList();
    }

    public PlanDto addPlans(PlanDto planDto) {
        PlanEntity planEntity = this.planMapper.toEntity(planDto);
        PlanEntity savedEntity = this.planRepository.save(planEntity);
        return planMapper.toDto(savedEntity);
    }

    public PlanDto getPlansById(String id) {

        return planRepository.findById(UUID.fromString(id))
                .map(planMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));
    }
    public PlanDto updatePlan(String id, PlanDto planDto) {
        PlanEntity plan = planRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        plan.setName(planDto.getName());
        plan.setWorkoutIds(planDto.getWorkoutIds());



        PlanEntity planEntity = planRepository.save(plan);

        return planMapper.toDto(planEntity);
    }

    public void deletePlan(String id) {
        UUID uuid = UUID.fromString(id);

        if (!planRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        planRepository.deleteById(uuid);
    }
}