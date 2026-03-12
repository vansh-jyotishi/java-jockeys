package com.javajockeys.java_jockeys.controller;



import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Democontroller {
    
    @RequestMapping("/demo")
    public String demo() {
        System.out.println("working fine");
        return "working fine";
    }
}
