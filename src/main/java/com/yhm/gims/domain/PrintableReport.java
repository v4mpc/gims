package com.yhm.gims.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class PrintableReport {
    private byte[] dataBytes;
    private String fileName;
}
