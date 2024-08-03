package com.yhm.gims.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payment_catalogs")
public class PaymentCatalog extends BaseEntity {


    @NotNull
    private String accountName;
    private String accountNumber;
    private Boolean insurance = false;

}
