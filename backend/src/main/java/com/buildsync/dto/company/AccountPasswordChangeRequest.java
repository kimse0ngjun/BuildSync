package com.buildsync.dto.company;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountPasswordChangeRequest {

    private String currentPassword;

    private String newPassword;
}