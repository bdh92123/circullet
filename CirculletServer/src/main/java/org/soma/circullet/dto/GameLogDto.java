package org.soma.circullet.dto;

import lombok.Data;

import java.util.Date;

/**
 * Created by Baek on 2016-07-23.
 */
@Data
public class GameLogDto {
    private Integer userId;
    private Integer score;
    private Integer playtime;
    private Date gameDate;

}
