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

public class AddEditProductTest {

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
    public void createAndEditProduct() throws InterruptedException {
        String originalName = "Selenium Test Product" + System.currentTimeMillis();
        String updatedName = originalName + " Updated";

        // Create product
        driver.get(BASE_URL + "/create");
        org.openqa.selenium.support.ui.WebDriverWait wait = new org.openqa.selenium.support.ui.WebDriverWait(driver,
                Duration.ofSeconds(20));
        System.out.println("Navigating to: " + BASE_URL + "/create");
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated(By.name("name")));
        driver.findElement(By.cssSelector("input[placeholder='Enter name']")).sendKeys(originalName);
        driver.findElement(By.cssSelector("input[placeholder='Enter price']")).sendKeys("10");
        driver.findElement(By.cssSelector("input[placeholder='Enter quantity']")).sendKeys("2");
        driver.findElement(By.cssSelector("input[placeholder='Enter image URL']"))
                .sendKeys("https://example.com/img.png");
        driver.findElement(By.cssSelector("input[placeholder='Enter category']")).sendKeys("TESTCAT");
        WebElement addBtn = driver.findElement(By.xpath("//button[text()='Add Product']"));
        addBtn.click();
        // give the client a short moment to POST to backend
        Thread.sleep(3000);

        // Navigate to products list and verify the product appears
        driver.get(BASE_URL + "/products");
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions
                .presenceOfElementLocated(By.xpath("//td[contains(., '" + originalName + "')]")));
        Assert.assertTrue(driver.getPageSource().contains(originalName));

        // Click edit for the product row
        WebElement editLink = driver.findElement(
                By.xpath("//tr[.//td[contains(., '" + originalName + "')]]//a[contains(@href, '/update')]"));
        editLink.click();

        // Wait for the update form to hydrate with the loaded product values
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/update/"));
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.attributeToBe(
                By.cssSelector("input[name='name']"), "value", originalName));

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
    }
}
