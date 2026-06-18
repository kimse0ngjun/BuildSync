package com.buildsync.service.material;

import com.buildsync.dto.material.MaterialRequest;
import com.buildsync.dto.material.MaterialDashboardResponse;
import com.buildsync.dto.material.MaterialResponse;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CompanyRepository companyRepository;
    private final SupMaterialRepository supMaterialRepository;
    private final SupStockRepository supStockRepository;

    // 자재 등록
    public MaterialResponse createMaterial(String loginId, MaterialRequest request) {

        Company company = getCompanyByLoginId(loginId);

        if (materialRepository.existsByMaterialCode(request.getMaterialCode())) {
            throw new RuntimeException("이미 존재하는 자재코드입니다.");
        }

        Material material = Material.builder()
                .materialCode(request.getMaterialCode())
                .materialName(request.getMaterialName())
                .materialCategory(request.getMaterialCategory())
                .unit(request.getUnit())
                .specification(request.getSpecification())
                .createdAt(LocalDateTime.now())
                .build();

        Material savedMaterial = materialRepository.save(material);

        SupMaterial supMaterial = SupMaterial.builder()
                .company(company)
                .material(savedMaterial)
                .build();

        supMaterialRepository.save(supMaterial);

        SupStock supStock = SupStock.builder()
                .company(company)
                .material(savedMaterial)
                .currentQuantity(request.getCurrentQuantity())
                .minimumQuantity(request.getMinimumQuantity())
                .unitPrice(request.getUnitPrice())
                .updatedAt(LocalDateTime.now())
                .build();

        SupStock savedStock = supStockRepository.save(supStock);

        return MaterialResponse.from(savedMaterial, savedStock);
    }

    // 전체 자재 목록 조회 + 통계 카드 + 검색/필터 + 페이징
    public MaterialDashboardResponse getMaterials(
            String keyword,
            String category,
            String status,
            Pageable pageable
    ) {
        Page<MaterialResponse> materialPage = supStockRepository
                .searchStocks(keyword, category, pageable)
                .map(stock ->
                        MaterialResponse.from(
                                stock.getMaterial(),
                                stock
                        )
                );

        List<MaterialResponse> materials = materialPage.getContent()
                .stream()
                .filter(material -> status == null || status.isBlank() || status.equals(material.getStatus()))
                .toList();

        long totalMaterialCount = materialPage.getTotalElements();

        long normalStockCount = materials.stream()
                .filter(material -> "정상".equals(material.getStatus()))
                .count();

        long shortageStockCount = materials.stream()
                .filter(material -> "부족".equals(material.getStatus()))
                .count();

        long incomingCount = 0;

        return MaterialDashboardResponse.builder()
                .totalMaterialCount(totalMaterialCount)
                .normalStockCount(normalStockCount)
                .shortageStockCount(shortageStockCount)
                .incomingCount(incomingCount)
                .currentPage(materialPage.getNumber())
                .pageSize(materialPage.getSize())
                .totalElements(materialPage.getTotalElements())
                .totalPages(materialPage.getTotalPages())
                .materials(materials)
                .build();
    }

    // 자재 상세 조회
    public MaterialResponse getMaterial(Long materialId) {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("자재가 존재하지 않습니다."));

        SupStock stock = supStockRepository.findAll()
                .stream()
                .filter(s -> s.getMaterial().getId().equals(materialId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("재고 정보가 존재하지 않습니다."));

        return MaterialResponse.from(material, stock);
    }

    // 자재 수정
    public MaterialResponse updateMaterial(Long materialId, MaterialRequest request) {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("자재가 존재하지 않습니다."));

        material.setMaterialCode(request.getMaterialCode());
        material.setMaterialName(request.getMaterialName());
        material.setMaterialCategory(request.getMaterialCategory());
        material.setUnit(request.getUnit());
        material.setSpecification(request.getSpecification());

        Material savedMaterial = materialRepository.save(material);

        SupStock stock = supStockRepository.findAll()
                .stream()
                .filter(s -> s.getMaterial().getId().equals(materialId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("재고 정보가 존재하지 않습니다."));

        stock.setCurrentQuantity(request.getCurrentQuantity());
        stock.setMinimumQuantity(request.getMinimumQuantity());
        stock.setUnitPrice(request.getUnitPrice());
        stock.setUpdatedAt(LocalDateTime.now());

        SupStock savedStock = supStockRepository.save(stock);

        return MaterialResponse.from(savedMaterial, savedStock);
    }

    // 자재 삭제
    public void deleteMaterial(Long materialId) {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("자재가 존재하지 않습니다."));

        supStockRepository.deleteByMaterial(material);
        materialRepository.delete(material);
    }

    private Company getCompanyByLoginId(String loginId) {
        return companyRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("회사를 찾을 수 없습니다."));
    }
}