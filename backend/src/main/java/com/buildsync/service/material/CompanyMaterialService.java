package com.buildsync.service.material;

import com.buildsync.dto.material.CompanyMaterialResponse;
import com.buildsync.dto.material.CompanyMaterialDashboardResponse;
import com.buildsync.dto.material.MaterialRequest;
import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupMaterial;
import com.buildsync.entity.SupStock;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.material.MaterialRepository;
import com.buildsync.repository.material.SupMaterialRepository;
import com.buildsync.repository.material.SupStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyMaterialService {

    private final SupMaterialRepository supMaterialRepository;
    private final SupStockRepository supStockRepository;
    private final MaterialRepository materialRepository;
    private final CompanyRepository companyRepository;

    // 내 회사 자재 목록 조회 + 통계 카드 + 검색/필터
    public CompanyMaterialDashboardResponse getCompanyMaterials(
            String loginId,
            String keyword,
            String category,
            String status
    ) {
        Company company = getCompanyByLoginId(loginId);

        List<CompanyMaterialResponse> materials = supMaterialRepository
                .searchCompanyMaterials(company.getId(), keyword, category)
                .stream()
                .map(supMaterial -> {
                    SupStock stock = supStockRepository
                            .findByCompanyAndMaterial(company, supMaterial.getMaterial())
                            .orElseThrow(() -> new RuntimeException("재고 정보가 존재하지 않습니다."));

                    return CompanyMaterialResponse.from(supMaterial, stock);
                })
                .filter(material -> status == null || status.isBlank() || status.equals(material.getStatus()))
                .toList();

        long totalMaterialCount = materials.size();

        long normalStockCount = materials.stream()
                .filter(material -> "정상".equals(material.getStatus()))
                .count();

        long shortageStockCount = materials.stream()
                .filter(material -> "부족".equals(material.getStatus()))
                .count();

        long incomingCount = 0;

        return CompanyMaterialDashboardResponse.builder()
                .totalMaterialCount(totalMaterialCount)
                .normalStockCount(normalStockCount)
                .shortageStockCount(shortageStockCount)
                .incomingCount(incomingCount)
                .materials(materials)
                .build();
    }

    // 내 회사 자재 수정
    public CompanyMaterialResponse updateCompanyMaterial(
            String loginId,
            Long materialId,
            MaterialRequest request
    ) {
        Company company = getCompanyByLoginId(loginId);

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("자재가 존재하지 않습니다."));

        SupMaterial supMaterial = supMaterialRepository.findByCompanyAndMaterial(company, material)
                .orElseThrow(() -> new RuntimeException("내 회사 자재에 등록되지 않은 자재입니다."));

        SupStock stock = supStockRepository.findByCompanyAndMaterial(company, material)
                .orElseThrow(() -> new RuntimeException("재고 정보가 존재하지 않습니다."));

        material.setMaterialCode(request.getMaterialCode());
        material.setMaterialName(request.getMaterialName());
        material.setMaterialCategory(request.getMaterialCategory());
        material.setUnit(request.getUnit());
        material.setSpecification(request.getSpecification());

        Material savedMaterial = materialRepository.save(material);

        stock.setCurrentQuantity(request.getCurrentQuantity());
        stock.setMinimumQuantity(request.getMinimumQuantity());
        stock.setUnitPrice(request.getUnitPrice());
        stock.setUpdatedAt(LocalDateTime.now());

        SupStock savedStock = supStockRepository.save(stock);

        return CompanyMaterialResponse.from(supMaterial, savedStock);
    }

    // 내 회사 자재 삭제
    public void deleteCompanyMaterial(String loginId, Long materialId) {
        Company company = getCompanyByLoginId(loginId);

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("자재가 존재하지 않습니다."));

        SupMaterial supMaterial = supMaterialRepository.findByCompanyAndMaterial(company, material)
                .orElseThrow(() -> new RuntimeException("내 회사 자재에 등록되지 않은 자재입니다."));

        SupStock stock = supStockRepository.findByCompanyAndMaterial(company, material)
                .orElse(null);

        if (stock != null) {
            supStockRepository.delete(stock);
        }

        supMaterialRepository.delete(supMaterial);
    }

    private Company getCompanyByLoginId(String loginId) {
        return companyRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("회사를 찾을 수 없습니다."));
    }
}