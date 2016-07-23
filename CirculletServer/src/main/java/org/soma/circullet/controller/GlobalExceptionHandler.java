package org.soma.circullet.controller;

import org.soma.circullet.dto.ErrorResult;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Baek on 2016-07-23.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    @ResponseBody
    @ExceptionHandler(value = Exception.class)
    public ErrorResult handlerException(Exception e) {
        ErrorResult result = new ErrorResult();
        result.setMessage(e.getMessage());
        return result;
    }
}
