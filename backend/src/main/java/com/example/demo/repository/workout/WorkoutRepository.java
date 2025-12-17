package com.example.demo.repository.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WorkoutRepository extends JpaRepository<WorkoutEntity, UUID> { }