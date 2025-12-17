package com.example.demo.repository.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PlanRepository extends JpaRepository<PlanEntity, UUID> { }