package com.inventory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for the page that consumes the external REST API.
 */
@Controller
public class ApiProductsController {

    @GetMapping("/products-1")
    public String productsFromApi() {
        return "products-1";
    }
}
