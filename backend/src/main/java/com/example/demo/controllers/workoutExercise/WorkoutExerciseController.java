package com.example.demo.controllers.workoutExercise;

import com.example.demo.domains.workoutExercise.WorkoutExerciseFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/workout-exercises")
public class WorkoutExerciseController {
    private final WorkoutExerciseFacade workoutExerciseFacade;

    public WorkoutExerciseController(WorkoutExerciseFacade workoutExerciseFacade) {
        this.workoutExerciseFacade = workoutExerciseFacade;
    }

    @GetMapping
    public List<WorkoutExerciseDto> getWorkoutExercise() {
        return workoutExerciseFacade.getWorkoutExercise();
    }

    @PostMapping
    public WorkoutExerciseDto addWorkoutExercise(@RequestBody WorkoutExerciseDto workoutExerciseDto) {
        return workoutExerciseFacade.addWorkoutExercise(workoutExerciseDto);
    }

    @PostMapping("/many")
    public WorkoutExerciseDto[] addWorkoutExercises(@RequestBody WorkoutExerciseDto[] workoutExerciseDtos) {
        return workoutExerciseFacade.createWorkoutExercises(workoutExerciseDtos);
    }

    @GetMapping("/{id}")
    public WorkoutExerciseDto getWorkoutExercise(@PathVariable String id) {
        return workoutExerciseFacade.getWorkoutExerciseById(id);
    }

    @PutMapping("/{id}")
    public WorkoutExerciseDto updateWorkout(@PathVariable String id, @RequestBody WorkoutExerciseDto workoutExerciseDto) {
        return workoutExerciseFacade.updateWorkoutExercise(id, workoutExerciseDto);
    }

    @DeleteMapping("/{id}")
    public String deleteWorkoutExercise(@PathVariable String id) {
        workoutExerciseFacade.deleteWorkoutExercise(id);
        return "ok";
    }
}
