package com.example.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

public class DeleteProductTest {

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
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
    }

    @AfterMethod
    public void tearDown() throws InterruptedException {
        Thread.sleep(2000);
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void deleteViewedProductTest() throws Exception {
        Path editedIdFile = Paths.get("target/edited-product.id");
        Path editedNameFile = Paths.get("target/edited-product.name");

        if (!Files.exists(editedIdFile) || !Files.exists(editedNameFile)) {
            Assert.fail("Edited product details not found. Ensure EditProductTest and ViewProductTest ran first.");
            return;
        }

        String id = Files.readString(editedIdFile, StandardCharsets.UTF_8).trim();
        String updatedName = Files.readString(editedNameFile, StandardCharsets.UTF_8).trim();

        Assert.assertFalse(id.isEmpty(), "Edited product id is empty");
        Assert.assertFalse(updatedName.isEmpty(), "Edited product name is empty");

        driver.get(BASE_URL + "/show/" + id);

        org.openqa.selenium.support.ui.WebDriverWait wait = new org.openqa.selenium.support.ui.WebDriverWait(
                driver,
                Duration.ofSeconds(20));

        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated(
                By.xpath("//h1[contains(., '" + updatedName + "')]")));

        Assert.assertTrue(driver.getPageSource().contains(updatedName));
        Assert.assertTrue(driver.getPageSource().contains("Delete"));

        driver.findElement(By.xpath("//button[text()='Delete']")).click();

        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/products"));
        driver.get(BASE_URL + "/products");
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions
                .presenceOfElementLocated(By.tagName("table")));

        Assert.assertTrue(driver.getCurrentUrl().contains("/products"));
        Assert.assertFalse(driver.getPageSource().contains(updatedName), "Deleted product should no longer be visible");
    }
}
