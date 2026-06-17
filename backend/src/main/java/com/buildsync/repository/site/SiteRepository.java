package com.buildsync.repository.site;

import com.buildsync.entity.Company;
import com.buildsync.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SiteRepository extends JpaRepository<Site, Long> {

    List<Site> findByCompany(Company company);

    Optional<Site> findByIdAndCompany(Long siteId, Company company);

    @Query("SELECT s FROM Site s " +
            "WHERE s.company = :company " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "OR s.siteName LIKE CONCAT('%', :keyword, '%') " +
            "OR s.address LIKE CONCAT('%', :keyword, '%') " +
            "OR s.constructionType LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:constructionType IS NULL OR :constructionType = '' OR s.constructionType = :constructionType) " +
            "AND (:status IS NULL OR :status = '' OR s.status = :status)")
    List<Site> searchSites(
            @Param("company") Company company,
            @Param("keyword") String keyword,
            @Param("constructionType") String constructionType,
            @Param("status") String status
    );
}