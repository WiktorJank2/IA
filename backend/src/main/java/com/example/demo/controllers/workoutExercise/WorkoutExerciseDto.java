package com.example.demo.controllers.workoutExercise;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;

import java.util.UUID;

public class WorkoutExerciseDto {
    public UUID id;
    public ExerciseDto exercise;
    public WorkoutDto workout;
    public int sets;
    public int reps;
    public double getWeight;


    public WorkoutExerciseDto() {}

    public WorkoutExerciseDto(UUID id, ExerciseDto exercise, WorkoutDto workout, int sets, int reps) {
        this.id = id;
        this.exercise = exercise;
        this.workout = workout;
        this.sets = sets;
        this.reps = reps;

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public double getGetWeight() {
        return getWeight;
    }

    public void setGetWeight(double getWeight) {
        this.getWeight = getWeight;
    }

    public double getWeight() {
        return getWeight;
    }

    public void setWeight(double getWeight) {
        this.getWeight = getWeight;
    }

}