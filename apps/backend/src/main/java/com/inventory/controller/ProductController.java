package com.inventory.controller;

import com.inventory.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller for the Products page using the MVC pattern.
 */
@Controller
@RequestMapping("/products")
public class ProductController {

    // Service dependency that provides product data
    private final ProductService productService;

    // Constructor injection for ProductService
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/products";
    }

    /**
     * HTTP GET /products
     * This method displays the products page.
     * It sends the list of products to the view.
     */
    @GetMapping
    public String products(Model model) {
        // Send list of all products to the HTML view
        model.addAttribute("products", productService.findAll());

        // Return the view name (src/main/resources/templates/products.html)
        return "products";
    }
}
