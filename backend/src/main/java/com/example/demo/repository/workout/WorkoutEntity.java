package com.example.demo.repository.workout;

import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "workouts")
public class WorkoutEntity {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private List<WorkoutExerciseDto> exercises;


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
        return exercises;
    }

  public void setExercises(List<WorkoutExerciseDto> exercises) {
        this.exercises=exercises;
  }

}