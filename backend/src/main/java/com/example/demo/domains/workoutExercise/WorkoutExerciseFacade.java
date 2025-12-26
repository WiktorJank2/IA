package com.example.demo.domains.workoutExercise;

import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import com.example.demo.repository.workoutExercise.WorkoutExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

public class WorkoutExerciseFacade {

    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final WorkoutExerciseMapper workoutExerciseMapper;

    public WorkoutExerciseFacade(WorkoutExerciseRepository workoutExerciseRepository, WorkoutExerciseMapper workoutExerciseMapper) {
        this.workoutExerciseRepository = workoutExerciseRepository;
        this.workoutExerciseMapper = workoutExerciseMapper;
    }

    public List<WorkoutExerciseDto> getWorkoutExercise() {
        List<WorkoutExerciseEntity> workoutExerciseRepositoryAll = this.workoutExerciseRepository.findAll();

        return workoutExerciseRepositoryAll
                .stream()
                .map(workoutExerciseMapper::toDto)
                .toList();
    }

    public WorkoutExerciseDto addWorkoutExercise(WorkoutExerciseDto workoutExerciseDto) {
        WorkoutExerciseEntity workoutExerciseEntity = this.workoutExerciseMapper.toEntity(workoutExerciseDto);
        WorkoutExerciseEntity savedEntity = this.workoutExerciseRepository.save(workoutExerciseEntity);
        return workoutExerciseMapper.toDto(savedEntity);
    }

    public WorkoutExerciseDto getWorkoutExerciseById(String id) {

        return workoutExerciseRepository.findById(UUID.fromString(id))
                .map(workoutExerciseMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkoutExercise not found"));
    }
    public WorkoutExerciseDto updateWorkoutExercise(String id, WorkoutExerciseDto workoutExerciseDto) {
        WorkoutExerciseEntity workoutExercise = workoutExerciseRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkoutExercise not found"));


        workoutExercise.setExercise(workoutExercise.getExercise());
        workoutExercise.setWeight(workoutExercise.getWeight());
        workoutExercise.setWorkout(workoutExercise.getWorkout());
        workoutExercise.setReps(workoutExercise.getReps());
        workoutExercise.setSets(workoutExercise.getSets());


        workoutExerciseRepository.save(workoutExercise);


        WorkoutExerciseEntity workoutExerciseEntity = workoutExerciseRepository.save(workoutExercise);

        return workoutExerciseMapper.toDto(workoutExerciseEntity);
    }

    public void deleteWorkoutExercise(String id) {
        UUID uuid = UUID.fromString(id);

        if (!workoutExerciseRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        workoutExerciseRepository.deleteById(uuid);
    }
}
