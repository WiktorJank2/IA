package com.example.demo.controllers.workoutExercise;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;

import java.util.UUID;

public class WorkoutExerciseDto {
    private UUID id;

    private ExerciseDto exercise;
    private WorkoutDto workout;
    private int sets;
    private int reps;
    private double weight;

    public WorkoutExerciseDto() {}

    public WorkoutExerciseDto(UUID id, ExerciseDto exercise, WorkoutDto workout, int sets, int reps, double weight) {
        this.id = id;
        this.exercise = exercise;
        this.workout = workout;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ExerciseDto getExercise() {
        return exercise;
    }

    public void setExercise(ExerciseDto exercise) {
        this.exercise = exercise;
    }

    public WorkoutDto getWorkout() {
        return workout;
    }

    public void setWorkout(WorkoutDto workout) {
        this.workout = workout;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}