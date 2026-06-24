package com.buildsync.repository.site;

import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SiteRepository extends JpaRepository<Site, Long> {

    Optional<Site> findByIdAndCompany(Long siteId, Company company);

    List<Site> findAllByCompany(Company company);

    @Query("SELECT s FROM Site s " +
            "WHERE s.company = :company " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "OR s.siteName LIKE CONCAT('%', :keyword, '%') " +
            "OR s.address LIKE CONCAT('%', :keyword, '%') " +
            "OR s.constructionType LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:constructionType IS NULL OR :constructionType = '' OR s.constructionType = :constructionType) " +
            "AND (:status IS NULL OR :status = '' OR s.status = :status)")
    Page<Site> searchSites(
            @Param("company") Company company,
            @Param("keyword") String keyword,
            @Param("constructionType") String constructionType,
            @Param("status") String status,
            Pageable pageable
    );
    
    @Query("""
    	    SELECT new com.buildsync.dto.inout.SelectResponse(
    	        s.id,
    	        CONCAT(s.siteName, '|', s.address)
    	    )
    	    FROM Site s
    	    ORDER BY s.siteName
    	""")
    	List<SelectResponse> findAllForSelect();
}