package com.example.demo.repository.workout;

import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.repository.exercise.ExerciseEntity;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.*;


@Entity
@Table(name = "workouts")
public class WorkoutEntity {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutExerciseEntity> workoutExercises = new ArrayList<>();;

    public WorkoutEntity() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<WorkoutExerciseDto> getExercises() {
        return workoutExercises;
    }
    public void setExercises(List<WorkoutExerciseDto> workoutExercises) {
        this.workoutExercises = workoutExercises;
    }

}