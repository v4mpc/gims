package com.yhm.gims.config;


import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


import java.io.IOException;
import java.util.Collection;


public class SameSiteCookieFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        filterChain.doFilter(request, response);

        if (response instanceof HttpServletResponse httpServletResponse) {
            Collection<String> headers = httpServletResponse.getHeaders("Set-Cookie");

            boolean firstHeader = true;
            for (String header : headers) {
                String updatedHeader = header;
                if (header.startsWith("JSESSIONID")) {
                    updatedHeader = header + "; SameSite=None"; // 🚫 No Secure
                }
                if (firstHeader) {
                    httpServletResponse.setHeader("Set-Cookie", updatedHeader);
                    firstHeader = false;
                } else {
                    httpServletResponse.addHeader("Set-Cookie", updatedHeader);
                }
            }
        }
    }
}