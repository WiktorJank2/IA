package com.example.demo.controllers.plan;

import com.example.demo.domains.plan.PlanFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
public class PlanController {

    private final PlanFacade planFacade;

    public PlanController(PlanFacade planFacade) {
        this.planFacade = planFacade;
    }

    @GetMapping
    public List<PlanDto> getPlans() {
        return planFacade.getPlans();
    }

    @PostMapping
    public PlanDto addPlan(@RequestBody PlanDto planDto) {
        return planFacade.addPlans(planDto);
    }

    @GetMapping("/{id}")
    public PlanDto getPlan(@PathVariable String id) {
        return planFacade.getPlansById(id);
    }

    @PutMapping("/{id}")
    public PlanDto updatePlan(@PathVariable String id, @RequestBody PlanDto planDto) {
        return planFacade.updatePlan(id, planDto);
    }

    @DeleteMapping("/{id}")
    public String deletePlan(@PathVariable String id) {
        planFacade.deletePlan(id);
        return "ok";
    }
}