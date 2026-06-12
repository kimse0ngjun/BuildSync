package com.buildsync.repository.material;

import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupMaterialRepository extends JpaRepository<SupMaterial, Long> {

    List<SupMaterial> findByCompany(Company company);

    Optional<SupMaterial> findByCompanyAndMaterial(Company company, Material material);

    boolean existsByCompanyAndMaterial(Company company, Material material);
}