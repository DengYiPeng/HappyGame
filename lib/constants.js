module.exports = {
    MSG_TYPE:{
        MSG:0,
        PING:1,
        PONG:2,
        BUMPED:3,//用户被挤掉
        NEW_LOGIN:4,//某个用户新设备登录
        STATUS:5,//查询当前用户登录设备情况
        REDIRECT:6,//重定向
        ROOM_MSG_QUERY:7,//消息查询
        MARK_READ_TIME:8,//标记聊天时间
        CHECK_INDEX:9,//
        RESPONSE:10,
        ERROR:11,
        SIGN_IN:12,
        GET_UNREAD_COUNT:13,
        UPDATE_CACHE:15,
        SYSTEM:16,//消息中心
        PUSH:17,
        RESOURCE_ORDER:18, //发客户端发送的业务指令，如要求客户端更新置顶消息状态为撤回
        BUSINESS:19,  //客户端发来的信息，如果添加临时成员
        TASK_MESSAGE:20
    },
    PUSH_SERVICE_TYPE:{
        TASK:0,
        ANNOUNCEMENT:1,
        MENKOR:2,
        NOTIFICATION:3,
        AUDIT:4,
        CHAT:5,
        LIVE:6,
        Lottery:7,
        MSG:8,
        SERVICE:9
    }
    ,
    ALI_PUSH_TYPE:{
      SOCKET_ONLY:0,
      PUSH_BACKEND:1,
      PUSH_ANYHOW:2
    },
    RESPONSE_CODE:{
        SUCCESS:0,
        ERR:1
    },
    PUSH_TYPE:{
        MSG:0,
        AUDIT:16,
        TASK:20
    },
    TASK_PUSH_TYPE:{
        TASK_CREATION:0,
        TASK_MODIFICATION:1,
    },
    SYSTEM_MSG_TYPE:{
        AUDIT:200,
        NOTIFICATION:300,
    },
    BUSINESS_TYPE:{
        ADD_TEMP_MEMBER : 0,
        QUERY_TEMP_MEMBER: 2,
        MARK_READ: 3,
        QUERY_MSG: 4,
        SIGN_IN: 5,
        SIGN_OUT: 6,
        GET_UNREAD_OUT:7
    },
    CHAT_TYPE:{
        HOLDER:1,//先占位
        //FRIEND_CHAT:2,//好友私聊
        GROUP:3,//群聊
        AFFAIR_CHAT:5,//事务内私聊
        TWO_ALLIANCE_CHAT:6
    },
    CHAT_SUBTYPE:{
        DEFAULT:0,//普通信息
        FILE:1,//普通文件
        IMAGE:2,//图片
        //视频
        VIDEO:{
            RECORD:3,//小视频
            INVITATION:30,//发起视频邀请
            END:31//视频结束（系统通知）
        },
        AUDIO:4,//音频
        FUND:{
            SEND:50,//发送资金
            ACCEPT:51,//资金接受（系统通知）
            REJECT:52,//资金拒收（系统通知）
        },
        MATERIAL:{
            SEND:60,//发送物资
            ACCEPT:61,//接受物资（系统通知）
            ACCEPT_MUTI:62,//批量接受物资（系统通知）
            SENDBACK:63,//退回（系统通知）
            ACCEPT_SENDBACK:64,//同意退回（系统通知）
            REJECT_SENDBACK:65,//拒绝退回（系统通知）
            ACCEPT_ALL:66,
            SENDBACK_ALL:67,
        },
        GROUP:{
            CREATE:70,//创建讨论组（系统通知）
            INVITATION:71,//邀请成员（系统通知）
            REMOVE:72,//移除成员（系统通知）
            EXIT:73,//退出讨论组（系统通知）
            DISMISS:74,//解散讨论组（系统通知）
            MODIFY_NAME :75,  //修改讨论组名称(系统通知)
            INVALID_ROLE:76,  //停用角色(系统通知)
            JOIN:77 //因为业务逻辑，自动加入讨论组（系统讨论组）
        },
        QUESTION:{
            VOTE:80,
        },
        MENKOR:{
            INFO:90,
        },
        LIVE:{
            LIVE:100,
        },
        DEMAND:{
            DEMAND:110
        },
        TASK:{
            CREATE:1000,
            MODIFY_OWNER:1001,
            ADD_ASSISTANTS:1002,
            FORWARD:1003,
            ACCOMPLISH:1004,
            CANCEL:1005,
            AGREE_REVIEW:1006
        }
    },
    REQUEST_CODE:{
        REGISTER:0,//注册
        RELAY:1,//消息转发
        REQUEST:2,//查询是否合法
        BUSINESS:3,//业务逻辑,如添加临时成员、移除临时成员
    },
    RESPONSE_TYPE:{
        NO_PERMISSIONS:0,
    },
    CACHE_UPDATE_EVENT_TYPE:{
        UN_GROUP : 1,//群组解散
        REMOVE_MEMBER_FROM_GROUP : 2,//群组移除成员
        ADD_MEMBER_TO_GROUP : 3,//群组添加成员
        REMOVE_MEMBER_FROM_AFFAIR : 4,//事务添加成员
        ADD_MEMBER_TO_AFFAIR : 5,//事务移除成员
        DISABLE_AFFAIR : 6//失效事务
    },
    CHAT_GROUP_PUBLIC_TYPE:{
        GROUP : 0,  //群组内公开,即不公开
        TOPIC : 1,  //主题公开
        AFFAIR: 2,  //事务公开
        ALLIANCE: 3, //盟内公开
        GUEST : 4  //全部公开
    },
    CHAT_GROUP_TYPE:{
        DEFAULT : 0,  //默认讨论组
        CUSTOM : 1  //自定义创建讨论组
    },
    CHAT_GROUP_MEMBER_STATE:{
        VALID : 0,  //成员正常
        INVALID : 1 //成员失效
    },
    CHAT_GROUP_STATE:{
        VALID : 0, //会话房间正常
        INVALID : 1 //会话房间失效
    },
    CHAT_GROUP_MEMBER_TYPE:{
        SINGLE : 0,
        AFFAIR_ROLE : 10,
        AFFAIR_ALLIANCE_ROLE : 11,
        AFFAIR_GUEST_ROLE : 12,
        ANNOUNCEMENT_OFFICIAL : 20,
        ANNOUNCEMENT_AFFAIR_MEMBER :21,
        ANNOUNCEMENT_ALLIANCE_MEMBER : 22,
        ANNOUNCEMENT_GUEST_MEMBER : 23,
        ANNOUNCEMENT_FOLLOWER : 24,
        TASK_CREATOR : 30,
        TASK_OWNER : 31,
        TASK_ASSITANT : 32,
    },
    CHAT_GROUP_TOPIC_TYPE:{
        AFFAIR : 0,  //事务
        ANNOUNCEMENT_IN_OFFICIAL : 10, //官方
        ANNOUNCEMENT_IN_AFFAIR : 11 ,//事务内客方
        ANNOUNCEMENT_IN_ALLIANCE : 12,  //盟内客方
        ANNOUNCEMENT_IN_GUEST : 13, //盟外客方
        ANNOUNCEMENT_IN_FOLLOWER : 14,  //关注的游客
        TASK: 20,
        WORK_FLOW:21

    },
    MODEL_NAME:{
        CHAT_GROUP : 'chat_group',
        MEMBER_GROUP : 'member_group',
    },
    SYSTEM_TYPE:{
        GROUP:1,//群
        AFFAIR:2,//事务内
    },
    MSG_STATE:{
        DEFAULT:0,
        WITHDRAW:1,
        FUND:{
            ACCEPT:10,//资金接受
            REJECT:11,//资金拒收
        },
        MATERIAL:{
            ACCEPT:20,//接受物资
            ACCEPT_MUTI:21,//批量接受物资
            SENDBACK:22,//退回
            ACCEPT_SENDBACK:23,//接受退回
            REJECT_SENDBACK:24,//拒绝退回
            ACCEPT_ALL : 25,
            SENDBACK_ALL:26,
        },
    },
    RESOURCE_TYPE:{
        CHAT:0
    },
    RESOURCE_OPERATION_TYPE:{
        WITHDRAW:100
    },
    Permission_Category:{
        AFFAIR:1,
        ROLE:2,
        ANNOUNCEMENT:3,
        TASK:4,
        PERSON:5,
        FILE:6,
        MATERIAL:7,
        FUND:8
    }
};