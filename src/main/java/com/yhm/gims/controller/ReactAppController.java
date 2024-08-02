package com.yhm.gims.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ReactAppController {
    @GetMapping(value = {"/", ""})
    public String index() {
        return "index.html";
}
}
