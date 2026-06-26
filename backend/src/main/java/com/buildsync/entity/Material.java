package com.buildsync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Long id;

    @Column(name = "material_code", unique = true)
    private String materialCode;

    @Column(name = "material_name")
    private String materialName;

    @Column(name = "material_category")
    private String materialCategory;

    private String unit;

    private String specification;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}