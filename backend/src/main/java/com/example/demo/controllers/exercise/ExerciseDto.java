package com.example.demo.controllers.exercise;



public class ExerciseDto {
    private String id;
    private String name;
    private String description;
    private String[] muscles;
    private int difficultyRating;
    private int effectivenessRating;
    private int overallRating;

    public ExerciseDto() {
    }

    public ExerciseDto(String id, String name, String description, String[] muscles, int difficultyRating, int effectivenessRating, int overallRating) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.muscles = muscles;
        this.difficultyRating = difficultyRating;
        this.effectivenessRating = effectivenessRating;
        this.overallRating = overallRating;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescirption() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String[] getMuscles() {
        return muscles;
    }
    public void setMuscles(String[] muscles) {
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