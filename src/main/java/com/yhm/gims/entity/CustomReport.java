package com.yhm.gims.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "custom_reports", schema = "public",indexes = {@Index(name = "idx_report_key", columnList="reportKey")})
public class CustomReport extends BaseEntity {

    @NotNull
    @Column(name = "reportName")
    private String reportName;

    @NotNull
    @Column(name = "reportKey",unique = true)
    private String reportKey;



    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "displayOrder")
    private Integer displayOrder;


    @NotNull
    @Column(name = "columnOption")
    private String columnOption;



    @Column(name = "filterOption")
    private String filterOption;


    @NotNull
    @Column(name = "query",length = 5000)
    private String query;

    @NotNull
    @Column(name = "active")
    private Boolean active;



}
