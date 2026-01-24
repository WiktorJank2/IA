package com.example.demo.domains.workout;


import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.repository.workout.WorkoutEntity;
import com.example.demo.repository.workout.WorkoutRepository;
import com.example.demo.repository.workoutExercise.WorkoutExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class WorkoutFacade {

    private final WorkoutRepository workoutRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final WorkoutMapper workoutMapper;


    public WorkoutFacade(WorkoutRepository workoutRepository, WorkoutMapper workoutMapper,  WorkoutExerciseRepository workoutExerciseRepository) {
        this.workoutRepository = workoutRepository;
        this.workoutMapper = workoutMapper;
        this.workoutExerciseRepository = workoutExerciseRepository;
    }

    public List<WorkoutDto> getWorkout() {
        List<WorkoutEntity> workoutRepositoryAll = this.workoutRepository.findAll();

        return workoutRepositoryAll
                .stream()
                .map(workoutMapper::toDto)
                .toList();
    }

    public WorkoutDto addWorkout(WorkoutDto workoutDto) {
        WorkoutEntity workoutEntity = this.workoutMapper.toEntity(workoutDto);
        WorkoutEntity savedEntity = this.workoutRepository.save(workoutEntity);
        return workoutMapper.toDto(savedEntity);
    }

    public WorkoutDto getWorkoutById(String id) {

        return workoutRepository.findById(UUID.fromString(id))
                .map(workoutMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }
    public WorkoutDto updateWorkout(String id, WorkoutDto workoutDto) {
        WorkoutEntity workout = workoutRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        var ids = workoutDto.getExercises().stream().map(WorkoutExerciseDto::getId).toList();
        var listWorkoutExercises = this.workoutExerciseRepository.findAllById(ids);

        workout.setName(workoutDto.getName());
        workout.setExercises(listWorkoutExercises);


        WorkoutEntity workoutEntity = workoutRepository.save(workout);

        return workoutMapper.toDto(workoutEntity);
    }

    public void deleteWorkout(String id) {
        UUID uuid = UUID.fromString(id);

        if (!workoutRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        workoutRepository.deleteById(uuid);
    }
}
