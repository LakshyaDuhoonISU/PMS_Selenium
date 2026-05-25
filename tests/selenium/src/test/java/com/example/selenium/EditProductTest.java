package com.example.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;

public class EditProductTest {

    private WebDriver driver;
    private final String BASE_URL = System.getProperty("baseUrl", "http://localhost:5173");

    @BeforeMethod
    public void setup() {
        WebDriverManager.chromedriver().setup();
        org.openqa.selenium.chrome.ChromeOptions options = new org.openqa.selenium.chrome.ChromeOptions();
        String headlessProp = System.getProperty("headless", "false");
        System.out.println("[TEST DIAG] headless property: " + headlessProp);
        if (headlessProp.equalsIgnoreCase("true")) {
            options.addArguments("--headless=new");
        }
        System.out.println("[TEST DIAG] ChromeOptions: " + options.toString());
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
    }

    @AfterMethod
    public void tearDown() throws InterruptedException {
        Thread.sleep(3000);
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void editProductTest() throws Exception {
        // Read the id of the product created by the AddProductTest
        Path in = Paths.get("target/created-product.id");
        if (!Files.exists(in)) {
            Assert.fail("created-product.id not found. Ensure AddProductTest ran and wrote the id.");
            return;
        }
        String id = Files.readString(in, StandardCharsets.UTF_8).trim();
        Assert.assertFalse(id.isEmpty(), "Read empty product id from file");
        String updatedName = "Edited Product " + System.currentTimeMillis();

        // Navigate directly to the update page for the created product
        driver.get(BASE_URL + "/update/" + id);
        org.openqa.selenium.support.ui.WebDriverWait wait = new org.openqa.selenium.support.ui.WebDriverWait(driver,
                Duration.ofSeconds(20));
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/update/"));
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions
                .presenceOfElementLocated(By.cssSelector("input[name='name']")));

        // Update name
        WebElement nameInput = driver.findElement(By.cssSelector("input[name='name']"));
        nameInput.clear();
        nameInput.sendKeys(updatedName);
        WebElement updateBtn = driver.findElement(By.xpath("//button[text()='Update Product']"));
        updateBtn.click();

        // Verify updated name in products list
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/products"));
        driver.get(BASE_URL + "/products");
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions
                .presenceOfElementLocated(By.xpath("//td[contains(., '" + updatedName + "')]")));
        Assert.assertTrue(driver.getPageSource().contains(updatedName));

        // Persist the edited product details for the view test
        try {
            Path editedIdFile = Paths.get("target/edited-product.id");
            if (editedIdFile.getParent() != null) {
                Files.createDirectories(editedIdFile.getParent());
            }
            Files.writeString(editedIdFile, id, StandardCharsets.UTF_8);

            Path editedNameFile = Paths.get("target/edited-product.name");
            if (editedNameFile.getParent() != null) {
                Files.createDirectories(editedNameFile.getParent());
            }
            Files.writeString(editedNameFile, updatedName, StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.out.println("[TEST DIAG] Failed to persist edited product details: " + e.getMessage());
        }
    }
}
