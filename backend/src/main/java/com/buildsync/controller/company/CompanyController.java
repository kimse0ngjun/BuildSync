package com.buildsync.controller.company;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.company.CompanyDeleteResponse;
import com.buildsync.dto.company.CompanyResponse;
import com.buildsync.dto.company.CompanyUpdateRequest;
import com.buildsync.dto.company.CompanyUpdateResponse;
import com.buildsync.dto.paging.PageResponse;
import com.buildsync.entity.CompanyType;
import com.buildsync.service.company.CompanyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

	private final CompanyService companyService;
	
	// 업체 목록 조회 + 검색 + 유형 필터
	@GetMapping
	public PageResponse<CompanyResponse> getCompanies(

	        @RequestParam(
	            name = "type",
	            required = false
	        ) CompanyType type,

	        @RequestParam(
	            name = "keyword",
	            required = false
	        ) String keyword,
	        
	        @PageableDefault(
	        	page = 0,
	        	size = 10,
	        	sort = "createdAt",
	        	direction = Sort.Direction.DESC
	        )
	        Pageable pageable
	){

	    return companyService.getCompanies(
	            type,
	            keyword,
	            pageable
	    );
	}
	
	// 업체 수정
	@PutMapping("/{companyId}")
    public CompanyUpdateResponse updateCompany(
            @PathVariable("companyId") Long companyId,

            @RequestBody CompanyUpdateRequest request
    ){

        return companyService.updateCompany(
                companyId,
                request
        );
    }
	
	// 업체 삭제
	@DeleteMapping("/{companyId}")
	public CompanyDeleteResponse deleteCompany(
            @PathVariable("companyId") Long companyId
    ){

        companyService.deleteCompany(companyId);

        return companyService.deleteCompany(companyId);
    }
}
