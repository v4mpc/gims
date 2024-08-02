package com.yhm.gims.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "expenses", schema = "public")
public class Expense extends BaseEntity {
    @NotNull
    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;


    @NotNull
    @Column(name = "amount")
    private Float amount;


    @Column(name = "created_at")
    @JsonIgnore(value = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;


    @Override
    protected void onCreate() {
        setUpdatedAt(LocalDate.now());
    }
}
