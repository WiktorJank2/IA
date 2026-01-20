package com.example.demo.repository.plan;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "plans")
public class PlanEntity {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private List<String> workoutIds;
    private boolean selected;
    private boolean current;


    public PlanEntity() {}

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

    public List<String> getWorkoutIds() {
        return workoutIds;
    }

    public void setWorkoutIds(List<String> workoutIds) {
        this.workoutIds = workoutIds;
    }

    public boolean isSelected() {return selected;}

    public void setSelected(boolean selected) {this.selected = selected;}

    public boolean isCurrent() {return current;}
    public void setCurrent(boolean current) {this.current = current;}

}