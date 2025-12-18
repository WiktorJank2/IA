package com.example.demo.repository.workout;

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
    private List<String> exercisesIds;


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

    public List<String> getExercisesIds() {
        return exercisesIds;
    }

  public void setExercisesIds(List<String> exercisesIds) {
        this.exercisesIds=exercisesIds;
  }

}