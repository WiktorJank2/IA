package com.example.demo.repository.workoutExercise;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workout.WorkoutDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.entities.WorkoutExercise;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.workout.WorkoutEntity;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "workouts")
public class WorkoutExerciseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "exercises")
    private ExerciseEntity exercise;

    @ManyToOne
    @JoinColumn(name = "workouts")
    private WorkoutEntity workout;

    private int sets;
    private int reps;
    private double weight;



    public WorkoutExerciseEntity() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setExercise(ExerciseEntity exercises) {
        this.exercise=exercise;
    }

    public ExerciseEntity getExercise() {
        return exercise;
    }

    public WorkoutEntity getWorkout() {
        return workout;
    }

    public void setWorkout(WorkoutEntity workout) {
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