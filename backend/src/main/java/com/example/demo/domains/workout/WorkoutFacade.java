package com.example.demo.domains.workout;


import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.exercise.ExerciseRepository;
import com.example.demo.repository.workout.WorkoutEntity;
import com.example.demo.repository.workout.WorkoutRepository;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import com.example.demo.repository.workoutExercise.WorkoutExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.controllers.workout.WorkoutDto;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class WorkoutFacade {

    private final WorkoutRepository workoutRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final WorkoutMapper workoutMapper;
    private final ExerciseRepository exerciseRepository;


    public WorkoutFacade(WorkoutRepository workoutRepository, WorkoutMapper workoutMapper, ExerciseRepository exerciseRepository,  WorkoutExerciseRepository workoutExerciseRepository) {
        this.workoutRepository = workoutRepository;
        this.workoutMapper = workoutMapper;
        this.workoutExerciseRepository = workoutExerciseRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public List<WorkoutDto> getWorkout() {
        List<WorkoutEntity> workoutRepositoryAll = this.workoutRepository.findAll();

        return workoutRepositoryAll
                .stream()
                .map(workoutMapper::toDto)
                .toList();
    }

    public WorkoutDto addWorkout(WorkoutDto dto) {
        // 1. Create the workout and save it first
        WorkoutEntity workout = new WorkoutEntity();
        workout.setName(dto.getName());
        workout = workoutRepository.save(workout); // must assign the returned entity


        // No need to save workout again unless you must update bidirectional links
        return mapToDto(workout);
    }


    private WorkoutDto mapToDto(WorkoutEntity workout) {
        WorkoutDto dto = new WorkoutDto();
        dto.setId(workout.getId());
        dto.setName(workout.getName());


        return dto;
    }

    public WorkoutDto getWorkoutById(String id) {

        return workoutRepository.findById(UUID.fromString(id))
                .map(workoutMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }
    public WorkoutDto updateWorkout(String id, WorkoutDto dto) {
        WorkoutEntity workout = workoutRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));

        workout.setName(dto.getName());

        // Remove children that are not in the new D

        WorkoutEntity saved = workoutRepository.save(workout);

        return mapToDto(saved);
    }


    public void deleteWorkout(String id) {
        UUID uuid = UUID.fromString(id);

        if (!workoutRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        workoutRepository.deleteById(uuid);
    }
}
