package com.buildsync.repository.material;

import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupStockRepository extends JpaRepository<SupStock, Long> {

    Optional<SupStock> findByCompanyAndMaterial(Company company, Material material);

    void deleteByMaterial(Material material);
}