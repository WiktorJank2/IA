package com.example.demo.domains.exercise;


import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.exercise.ExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ExerciseFacade {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    public ExerciseFacade(ExerciseRepository exerciseRepository, ExerciseMapper exerciseMapper) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
    }

    public List<ExerciseDto> getExercises() {
        List<ExerciseEntity> exerciseRepositoryAll = this.exerciseRepository.findAll();

        return exerciseRepositoryAll
                .stream()
                .map(exerciseMapper::toDto)
                .toList();
    }

    public ExerciseDto addExercises(ExerciseDto exerciseDto) {
        ExerciseEntity exerciseEntity = this.exerciseMapper.toEntity(exerciseDto);
        ExerciseEntity savedEntity = this.exerciseRepository.save(exerciseEntity);
        return exerciseMapper.toDto(savedEntity);
    }

    public ExerciseDto getExercisesById(String id) {

        return exerciseRepository.findById(UUID.fromString(id))
                .map(exerciseMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }
    public ExerciseDto updateExercise(String id, ExerciseDto exerciseDto) {
        ExerciseEntity exercise = exerciseRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));

        exercise.setName(exerciseDto.getName());
        exercise.setDescription(exerciseDto.getDescription());
        exercise.setMuscles(exerciseDto.getMuscles());
        exercise.setDifficultyRating(exerciseDto.getDifficultyRating());
        exercise.setEffectivenessRating(exerciseDto.getEffectivenessRating());
        exercise.setOverallRating(exerciseDto.getOverallRating());
        exercise.setWeight(exercise.getWeight());
        exercise.setNumberOfReps(exerciseDto.getNumberOfReps());
        exercise.setNumberOfSets(exerciseDto.getNumberOfSets());


        ExerciseEntity exerciseEntity = exerciseRepository.save(exercise);

        return exerciseMapper.toDto(exerciseEntity);
    }

    public void deleteExercise(String id) {
        UUID uuid = UUID.fromString(id);

        if (!exerciseRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        exerciseRepository.deleteById(uuid);
    }
}