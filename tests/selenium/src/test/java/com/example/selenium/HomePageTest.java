package com.example.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class HomePageTest {

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
    public void homePageTest() {
        driver.get(BASE_URL + "/");

        org.openqa.selenium.support.ui.WebDriverWait wait = new org.openqa.selenium.support.ui.WebDriverWait(
                driver,
                Duration.ofSeconds(20));

        // Basic homepage assertions
        wait.until(org.openqa.selenium.support.ui.ExpectedConditions.or(
                org.openqa.selenium.support.ui.ExpectedConditions.titleContains("PMS"),
                org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated(By.tagName("body"))));

        Assert.assertTrue(driver.getCurrentUrl().startsWith(BASE_URL));
        Assert.assertTrue(driver.findElement(By.tagName("body")).isDisplayed());

        // Assert common navigation/content exists on the home page
        Assert.assertTrue(
                driver.getPageSource().contains("Products")
                        || driver.getPageSource().contains("Home")
                        || driver.getPageSource().contains("All Products"));
    }
}
