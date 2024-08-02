package com.yhm.gims.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yhm.gims.domain.ReportColumn;
import com.yhm.gims.domain.ReportFilter;
import com.yhm.gims.dto.ReportFilterRequest;
import com.yhm.gims.entity.CustomReport;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CustomReportRepository;
import com.yhm.gims.util.QueryValidatorUtil;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomReportService {
    private final CustomReportRepository customReportRepository;

    private final EntityManager entityManager;

    private final JdbcTemplate jdbcTemplate;


    public List<CustomReport> findAll() {
        return customReportRepository.findAll();
    }

    public List<Map<String, Object>> fetchData(ReportFilterRequest filterOptions) {
        Optional<CustomReport> optionalReport = customReportRepository.findById(filterOptions.getReport());
        if (optionalReport.isEmpty()) {
            throw new RuntimeException("Report not found with id " + filterOptions.getReport());
        }
        CustomReport report = optionalReport.get();
        List<ReportFilter> dbFilters = extractFilters(report.getFilterOption());
        List<ReportColumn> dbColumns = extractColumns(report.getColumnOption());
        String dbQuery = getDbQuery(filterOptions, report, dbFilters);
        List<Map<String, Object>> resultList = executeQueryWithColumnNames(dbQuery);

        return resultList.stream().map(result -> {
            Map<String, Object> transformedMap = new HashMap<>();
            dbColumns.forEach(column -> transformedMap.put(column.getName(), result.get(column.getName())));
            return transformedMap;
        }).toList();
    }


    public List<Map<String, Object>> executeQueryWithColumnNames(String queryString) {

        if (!QueryValidatorUtil.isValidSelectQuery(queryString)) {
            throw new IllegalArgumentException("Invalid query. Only SELECT queries are allowed.");
        }
        return jdbcTemplate.query(queryString, new ResultSetExtractor<List<Map<String, Object>>>() {
            @Override
            public List<Map<String, Object>> extractData(ResultSet rs) {
                List<Map<String, Object>> resultList = new ArrayList<>();
                try {
                    ResultSetMetaData metaData = rs.getMetaData();
                    int columnCount = metaData.getColumnCount();
                    while (rs.next()) {
                        Map<String, Object> rowMap = new HashMap<>();
                        for (int i = 1; i <= columnCount; i++) {
                            String columnName = metaData.getColumnName(i);
                            Object columnValue = rs.getObject(i);
                            rowMap.put(columnName, columnValue);
                        }
                        resultList.add(rowMap);
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                    // Handle exception
                }
                return resultList;
            }
        });
    }

    private static String getDbQuery(ReportFilterRequest filterOptions, CustomReport report, List<ReportFilter> dbFilters) {
        String dbQuery = report.getQuery();

        for (ReportFilter filter : dbFilters) {
            if (filter.getName().equals("product")) {
                dbQuery = dbQuery.replaceAll("\\$\\{product\\}", filterOptions.getProduct().toString());
            }
            if (filter.getName().equals("dateRange")) {
                dbQuery = dbQuery.replaceAll("\\$\\{dateFrom\\}", filterOptions.getDateFrom().toString());
                dbQuery = dbQuery.replaceAll("\\$\\{dateTo\\}", filterOptions.getDateTo().toString());
            }
        }
        return dbQuery;
    }

    public void save(CustomReport customReport) {
        customReportRepository.save(customReport);
    }

    public CustomReport update(CustomReport customReport, int id) {
        CustomReport updateReport = customReportRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Report not exist with id " + id));
        updateReport.setReportName(customReport.getReportName());
        updateReport.setReportKey(customReport.getReportKey());
        updateReport.setDescription(customReport.getDescription());
        updateReport.setDisplayOrder(customReport.getDisplayOrder());
        updateReport.setColumnOption(customReport.getColumnOption());
        updateReport.setFilterOption(customReport.getFilterOption());
        updateReport.setQuery(customReport.getQuery());
        updateReport.setActive(customReport.getActive());
        customReportRepository.save(updateReport);
        return updateReport;
    }


    private List<ReportFilter> extractFilters(String dbFilters) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(dbFilters, new TypeReference<List<ReportFilter>>() {
            });
        } catch (JsonProcessingException exc) {
            throw new RuntimeException("Can not parse database filter " + dbFilters);
        }
    }


    private List<ReportColumn> extractColumns(String dbColumns) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(dbColumns, new TypeReference<List<ReportColumn>>() {
            });
        } catch (JsonProcessingException exc) {
            throw new RuntimeException("Can not parse database filter " + dbColumns);
        }
    }


}
