package com.yhm.gims.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.security.Principal;


@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Builder
public class UserDto {

    @NotNull
    private String username;
    private String password;


    public static UserDto fromPrincipal(Principal principal) {
        return UserDto.builder().username(principal.getName()).build();

    }

}
