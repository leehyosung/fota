package com.fota.gateway.network;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ListenerController {

    @GetMapping(value = "/hello")
    public String hello(){
        return "Hello World!";
    }

    @GetMapping(value = "/version")
    public String getVersion(){
        //TODO version 정보
        return "v.1.1.0";
    }

    @GetMapping(value = "/firmware")
    public byte[] getFirmware(){
        //TODO firmware read
        return new byte[100];
    }
}
