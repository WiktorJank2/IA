package com.example.demo.repository.exercise;

import com.example.demo.repository.workout.WorkoutEntity;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Entity
@Table(name = "exercises")
public class ExerciseEntity {

    @Id
    @GeneratedValue
    private UUID id;


    private String name;
    private String description;
    private List<String> muscles;
    private int difficultyRating;
    private int effectivenessRating;
    private int overallRating;

    public ExerciseEntity() {}

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public List<String> getMuscles() {
        return muscles;
    }
    public void setMuscles(List<String> muscles) {
        this.muscles = muscles;
    }
    public int getDifficultyRating() {
        return difficultyRating;
    }
    public void setDifficultyRating(int difficultyRating) {
        this.difficultyRating = difficultyRating;
    }
    public int getEffectivenessRating() {
        return effectivenessRating;
    }
    public void setEffectivenessRating(int effectivenessRating) {
        this.effectivenessRating = effectivenessRating;
    }
    public int getOverallRating() {
        return overallRating;
    }
    public void setOverallRating(int overallRating) {
        this.overallRating = overallRating;
    }

}
