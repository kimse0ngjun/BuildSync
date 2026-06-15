package com.buildsync.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sup_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sup_material_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;
}