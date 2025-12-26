package com.example.demo.controllers.exercise;


import java.util.List;
import java.util.UUID;

public class ExerciseDto {
    private UUID id;
    private String name;
    private String description;
    private List<String> muscles;
    private int difficultyRating;
    private int effectivenessRating;
    private int overallRating;
    private double weight;
    private int numberOfReps;
    private int numberOfSets;

    public ExerciseDto() {
    }

    public ExerciseDto(UUID id, String name, String description, List<String> muscles, int difficultyRating, int effectivenessRating, int overallRating,  double weight, int numberOfReps, int numberOfSets) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.muscles = muscles;
        this.difficultyRating = difficultyRating;
        this.effectivenessRating = effectivenessRating;
        this.overallRating = overallRating;
        this.weight = weight;
        this.numberOfReps = numberOfReps;
        this.numberOfSets = numberOfSets;
    }

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

    public double getWeight() {
        return weight;
    }
    public void setWeight(double weight) {
        this.weight = weight;
    }
    public int getNumberOfReps() {
        return numberOfReps;
    }
    public void setNumberOfReps(int numberOfReps) {
        this.numberOfReps = numberOfReps;
    }
    public int getNumberOfSets() {
        return numberOfSets;
    }
    public void setNumberOfSets(int numberOfSets) {
        this.numberOfSets = numberOfSets;
    }

}