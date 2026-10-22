package com.inventory;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.inventory.model.Product;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.math.BigDecimal;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ProductValidationTests {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidatorFactory() {
        validatorFactory.close();
    }

    @Test
    void rejectsInvalidProductValues() {
        Product product = new Product();
        product.setName(" ");
        product.setPrice(new BigDecimal("-1.00"));
        product.setStock(-1);

        var violations = validator.validate(product);

        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("name")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("price")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("stock")));
    }

    @Test
    void acceptsValidProductValues() {
        Product product = new Product();
        product.setName("Keyboard");
        product.setPrice(new BigDecimal("25.99"));
        product.setStock(10);
        product.setDescription("Wireless keyboard");

        assertTrue(validator.validate(product).isEmpty());
    }
}
