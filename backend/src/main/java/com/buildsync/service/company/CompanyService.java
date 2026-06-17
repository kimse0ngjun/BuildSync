package com.buildsync.service.company;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.company.CompanyDeleteResponse;
import com.buildsync.dto.company.CompanyResponse;
import com.buildsync.dto.company.CompanyUpdateRequest;
import com.buildsync.dto.company.CompanyUpdateResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;
import com.buildsync.entity.CompanyType;
import com.buildsync.repository.company.CompanyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

	private final CompanyRepository companyRepository;
	
	
	// 업체 목록 조회
    public List<CompanyResponse> getCompanies(
            CompanyType type,
            String keyword
    ) {

        return companyRepository
        		.findCompanies(
        			    type == null ? null : type.name(),
        			    keyword
        			)
                .stream()
                .map(item ->

                    CompanyResponse.builder()

                    .companyId(
                        item.getCompanyId()
                    )

                    .companyType(
                        item.getCompanyType()
                    )

                    .companyName(
                        item.getCompanyName()
                    )

                    .ceoName(
                        item.getCeoName()
                    )

                    .phone(
                        item.getPhone()
                    )

                    .address(
                        item.getAddress()
                    )

                    .createdAt(
                        item.getCreatedAt()
                    )

                    .materials(
                        item.getMaterials() == null
                        ? List.of()
                        : Arrays.asList(
                            item.getMaterials()
                                .split(",")
                          )
                    )

                    .build()

                )
                .toList();
    }
    
    // 업체 수정
    @Transactional
    public CompanyUpdateResponse updateCompany(
            Long companyId,
            CompanyUpdateRequest request
    ){

        Company company =
            companyRepository.findById(companyId)
            .orElseThrow();


        company.setCompanyType(
            request.getCompanyType()
        );

        company.setCompanyName(
            request.getCompanyName()
        );

        company.setCeoName(
            request.getCeoName()
        );

        company.setBusinessNumber(
            request.getBusinessNumber()
        );

        company.setPhone(
            request.getPhone()
        );

        company.setHomepageUrl(
            request.getHomepageUrl()
        );

        company.setAddress(
            request.getAddress()
        );


        return CompanyUpdateResponse.from(company);
    }
    
    // 업체 삭제
    @Transactional
    public CompanyDeleteResponse deleteCompany(Long id){

        Company company =
            companyRepository.findById(id)
            .orElseThrow();


        company.setStatus(
            CompanyStatus.INACTIVE
        );


        return new CompanyDeleteResponse(
            company.getId(),
            "업체가 삭제되었습니다."
        );
    }
}
