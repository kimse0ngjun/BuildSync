package com.buildsync.repository.material;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupStock;

@Repository
public interface SupStockRepository extends JpaRepository<SupStock, Long> {

    Optional<SupStock> findByCompanyAndMaterial(Company company, Material material);

    void deleteByMaterial(Material material);
    
    Optional<SupStock> findByCompanyIdAndMaterialId(Long companyId, Long materialId);
}