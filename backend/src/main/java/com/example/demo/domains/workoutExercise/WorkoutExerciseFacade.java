package com.example.demo.domains.workoutExercise;

import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.repository.exercise.ExerciseRepository;
import com.example.demo.repository.workout.WorkoutRepository;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import com.example.demo.repository.workoutExercise.WorkoutExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class WorkoutExerciseFacade {

    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final WorkoutExerciseMapper workoutExerciseMapper;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutRepository workoutRepository;

    public WorkoutExerciseFacade(WorkoutExerciseRepository workoutExerciseRepository, WorkoutExerciseMapper workoutExerciseMapper, ExerciseRepository exerciseRepository, WorkoutRepository workoutRepository) {
        this.workoutExerciseRepository = workoutExerciseRepository;
        this.workoutExerciseMapper = workoutExerciseMapper;
        this.exerciseRepository = exerciseRepository;
        this.workoutRepository = workoutRepository;
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


        workoutExercise.setExercise(
                exerciseRepository.findById(workoutExerciseDto.getExercise().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"))
        );
        workoutExercise.setWorkout(
                workoutRepository.findById(workoutExerciseDto.getWorkout().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"))
        );

        workoutExercise.setReps(workoutExerciseDto.getReps());
        workoutExercise.setSets(workoutExerciseDto.getSets());
        workoutExercise.setWeight(workoutExerciseDto.getWeight());

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

    public WorkoutExerciseDto[] createWorkoutExercises(WorkoutExerciseDto[] workoutExerciseDtos) {
        return Arrays.stream(workoutExerciseDtos)
                .map(this::addWorkoutExercise)
                .toArray(WorkoutExerciseDto[]::new);
    }

    public WorkoutExerciseDto[] getWorkoutExercisesByWorkoutId(String workoutId) {
        UUID workoutUuid = UUID.fromString(workoutId);

        return Arrays.stream(workoutExerciseRepository.findByWorkoutId(workoutUuid))
                .map(workoutExerciseMapper::toDto)
                .toArray(WorkoutExerciseDto[]::new);
    }
}
