package com.buildsync.repository.site;

import com.buildsync.entity.Company;
import com.buildsync.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SiteRepository extends JpaRepository<Site, Long> {

    List<Site> findByCompany(Company company);

    Optional<Site> findByIdAndCompany(Long siteId, Company company);
}