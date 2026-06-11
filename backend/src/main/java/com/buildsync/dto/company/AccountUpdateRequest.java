package com.buildsync.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountUpdateRequest { // 거래처 수정

    @NotBlank(message = "업체명은 필수입니다.")
    private String companyName;

    @NotBlank(message = "대표자명은 필수입니다.")
    private String ceoName;

    @NotBlank(message = "연락처는 필수입니다.")
    private String phone;

    private String homepageUrl;

    @NotBlank(message = "주소는 필수입니다.")
    private String address;
}
