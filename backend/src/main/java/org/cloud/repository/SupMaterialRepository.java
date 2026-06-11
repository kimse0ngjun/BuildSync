package org.cloud.repository;

import java.util.List;

import org.cloud.domain.SupMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SupMaterialRepository extends JpaRepository<SupMaterial, Long> {

	@Query("SELECT c FROM Contact c WHERE c.company.companyId = :companyId")
	List<SupMaterial> findByCompanyId(@Param("companyId") Long companyId);
}
