package com.example.demo.controllers.workout;

import com.example.demo.domains.workout.WorkoutFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    private final WorkoutFacade workoutFacade;

    public WorkoutController(WorkoutFacade workoutFacade) {
        this.workoutFacade = workoutFacade;
    }

    @GetMapping
    public List<WorkoutDto> getWorkout() {
        return workoutFacade.getWorkout();
    }

    @PostMapping
    public WorkoutDto addWorkout(@RequestBody WorkoutDto workoutDto) {
        return workoutFacade.addWorkout(workoutDto);
    }

    @GetMapping("/{id}")
    public WorkoutDto getWorkout(@PathVariable String id) {
        return workoutFacade.getWorkoutById(id);
    }

    @PutMapping("/{id}")
    public WorkoutDto updateWorkout(@PathVariable String id, @RequestBody WorkoutDto workoutDto) {
        return workoutFacade.updateWorkout(id, workoutDto);
    }

    @DeleteMapping("/{id}")
    public String deleteWorkout(@PathVariable String id) {
        workoutFacade.deleteWorkout(id);
        return "ok";
    }
}