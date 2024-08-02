package com.yhm.gims.util;

import java.util.Arrays;
import java.util.List;

public class QueryValidatorUtil {
    // List of allowed keywords
    private static final List<String> ALLOWED_KEYWORDS = Arrays.asList("SELECT", "FROM", "WHERE", "AND", "OR", "ORDER", "BY", "LIMIT", "GROUP", "HAVING","JOIN");

    // List of disallowed keywords
    private static final List<String> DISALLOWED_KEYWORDS = Arrays.asList("INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE");

    public static boolean isValidSelectQuery(String query) {
        // Normalize the query string
        String normalizedQuery = query.trim().toUpperCase();

        // Check if the query starts with SELECT
        if (!normalizedQuery.startsWith("SELECT")) {
            return false;
        }

        // Split the query into words and check for disallowed keywords
        String[] words = normalizedQuery.split("\\s+");
        for (String word : words) {
            if (DISALLOWED_KEYWORDS.contains(word)) {
                return false;
            }
        }

        // Check for allowed keywords (optional)
        for (String word : words) {
            if (!ALLOWED_KEYWORDS.contains(word) && !word.matches("[A-Z_]+")) {
                return false;
            }
        }

        return true;
    }
}
