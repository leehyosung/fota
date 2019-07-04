package com.fota.gateway.network;

import org.springframework.stereotype.Service;

@Service
public class RequestManager {

    public String requestVersion(){
        return "v.1.0.0";
    }

    public byte[] requestFirmware(){
        return new byte[100];
    }
}
