const ClientCore = require('./client-core');
const UserService = require('./user-service');
const EquipmentService = require('./equipment-service');
const SkillService = require('./skill-service');

/*
    方法简介：用户登录，建立和服务器的长连接（若用户名对应数据不存在，则会新建）
    参数：
        address:类型String，服务器地址
        username：类型String，用户名
        success:成功回调函数
        fail:失败回调函数
    返回值示例：
        { _id: '5c95eb2af4beb35664c54cef',
          username: '邓逸鹏',
          roleType: 1,
          mapIndex: 0,
          xAxis: 0,
          yAxis: 0,
          level: 10,
          hp: 20,
          mp: 20,
          maxHp: 20,
          maxMp: 20,
          exp: 970,
          gold: 985,
          potential: 0,
          atk: 10,
          def: 10,
          magic: 24,
          weapon: '5c95cd5a89c0634b702cad7c',
          weaponInfo:
           { strengthenLevel: 1,
             _id: '5c95cd5a89c0634b702cad7c',
             templateKey: 'SWORD_OF_5',
             atk: 8,
             def: 0,
             magic: 0,
             username: '邓逸鹏',
             level: 5,
             tp: 0 },
          armorInfo: null
          }
 */
exports.signIn = ClientCore.init;

/*
    方法简介：获取用户当前信息及已经装备的武器、防具信息
    参数：
        success:成功回调函数
        fail:失败回调函数
    返回值示例：
        { _id: '5c95eb2af4beb35664c54cef',
          username: '邓逸鹏',
          roleType: 1,
          mapIndex: 0,
          xAxis: 0,
          yAxis: 0,
          level: 10,
          hp: 20,
          mp: 20,
          maxHp: 20,
          maxMp: 20,
          exp: 970,
          gold: 985,
          potential: 0,
          atk: 10,
          def: 10,
          magic: 24,
          weapon: '5c95cd5a89c0634b702cad7c',
          weaponInfo:
           { strengthenLevel: 1,
             _id: '5c95cd5a89c0634b702cad7c',
             templateKey: 'SWORD_OF_5',
             atk: 8,
             def: 0,
             magic: 0,
             username: '邓逸鹏',
             level: 5,
             tp: 0 },
          armorInfo: null
          }
 */
exports.getUserStatus = UserService.getUserStatus;
/*
    方法简介：更新角色所在地图及坐标
    参数：
        mapId:类型String，服务器地址
        xAxis：类型int,地图上横坐标
        yAxis:类型int,地图上纵坐标
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.markPosition = UserService.markPosition;

/*
    方法简介：查询花钱治愈自身所需要的金钱
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { COST: 2 }
 */
exports.queryHealCostConfig = UserService.queryHealCostConfig;

/*
    方法简介：花钱治愈自身（HP、MP全部恢复至最大值）
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.heal = UserService.heal;

/*
    方法简介：获取角色升级所需经验表
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { '0': 5,
          '1': 10,
          '2': 15,
          '3': 20,
          '4': 25,
          '5': 30,
          '6': 30,
          '7': 30,
          '8': 30,
          '9': 30,
          '10': 30
          }


 */
exports.getUserLevelInfo = UserService.getUserLevelInfo;
/*
    方法简介：升级
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true（经验不够会返回false）
 */
exports.levelUp = UserService.levelUp;
/*
    方法简介：分配潜力点（升级会获取）
    参数：
        magic:int,
        atk:int,
        def:int,
        hp:int.
        mp:int
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true（潜力点不够会返回false）
 */
exports.allocPotential = UserService.allocPotential;
/*
    方法简介：获取商店里可买装备列表
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { SWORD_OF_5: { TYPE: 0, ATK: 5, LEVEL: 5, VALUE: 5 },
          SWORD_OF_15: { TYPE: 0, ATK: 15, LEVEL: 15, VALUE: 20 },
          SWORD_OF_25: { TYPE: 0, ATK: 40, LEVEL: 25, VALUE: 50 },
          SWORD_OF_35: { TYPE: 0, ATK: 100, LEVEL: 35, VALUE: 200 },
          SWORD_OF_45: { TYPE: 0, ATK: 200, LEVEL: 45, VALUE: 1000 }
         }
 */
exports.queryEquipmentListInShop = EquipmentService.queryEquipmentList;
/*
    方法简介：购买装备
    参数：
        equipmentKey:String
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { strengthenLevel: 0,
          _id: '5c9642a51822f61b08c65719',
          templateKey: 'SWORD_OF_5',
          atk: 5,
          def: 0,
          magic: 0,
          username: '邓逸鹏',
          level: 5
        }
 */
exports.buyEquipment = EquipmentService.buyEquipment;
/*
    方法简介：获取不同角色类型的信息，及其对潜力点分配的影响
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { '0':
           { name: '冒险者',
             type: 0,
             ATK_OF_EACH_LEVEL: 5,
             DEF_OF_EACH_LEVEL: 5,
             MAGIC_OF_EACH_LEVEL: 5,
             HP_OF_EACH_LEVEL: 5,
             MP_OF_EACH_LEVEL: 5 },
          '1':
           { name: '战士',
             type: 1,
             ATK_OF_EACH_LEVEL: 5,
             DEF_OF_EACH_LEVEL: 5,
             MAGIC_OF_EACH_LEVEL: 5,
             HP_OF_EACH_LEVEL: 5,
             MP_OF_EACH_LEVEL: 5 },
          '2':
           { name: '法师',
             type: 2,
             ATK_OF_EACH_LEVEL: 5,
             DEF_OF_EACH_LEVEL: 5,
             MAGIC_OF_EACH_LEVEL: 5,
             HP_OF_EACH_LEVEL: 5,
             MP_OF_EACH_LEVEL: 5 },
          '3':
           { name: '牧师',
             type: 3,
             ATK_OF_EACH_LEVEL: 5,
             DEF_OF_EACH_LEVEL: 5,
             MAGIC_OF_EACH_LEVEL: 5,
             HP_OF_EACH_LEVEL: 5,
             MP_OF_EACH_LEVEL: 5 }
        }
 */
exports.queryRoleTypeConfig = UserService.queryRoleTypeConfig;

/*
    方法简介：设置角色类型（一旦从初始类型设置为其他类型，则不可再进行设置）
    参数：
        roleType:int
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.initRoleType = UserService.initRoleType;

/*
    方法简介：将一件武器或防具装备在身上
    参数：
        equipmentId:String
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.equip = EquipmentService.equip;
/*
    方法简介：将一件武器或防具进行强化，可选择强化方向
    参数：
        equipmentId:String
        key:String,从['ATK','DEF','MAGIC']中三选一
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.strengthen = EquipmentService.strengthen;

/*
    方法简介：获取自己已有的装备（包括已经装备在身上的）
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.getEquipmentsInBag = EquipmentService.getEquipmentByUsername;

/*
    方法简介：获取所有技能列表
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { ATTACK:
           { NAME: '普通攻击',
             ATK_COEFFICIENT: { '1': 1, '2': 1.05, '3': 1.1, '4': 1.15, '5': 1.2 },
             DESCRIPTION: '造成基于攻击力的加成伤害',
             MAGIC_COST: 0 },
          DASH:
           { NAME: '冲刺',
             ATK_COEFFICIENT: { '1': 1.2, '2': 1.3, '3': 1.4, '4': 1.5, '5': 1.6 },
             DESCRIPTION: '造成基于攻击力的加成伤害',
             MAGIC_COST: 3 },
          FIRE_BALL:
           { NAME: '火球术',
             MAGIC_COEFFICIENT: { '1': 1.2, '2': 1.3, '3': 1.4, '4': 1.5, '5': 1.6 },
             DESCRIPTION: '造成基于法力值的加成伤害',
             MAGIC_COST: 5 },
          PRAY:
           { NAME: '祈祷',
             DEF_COEFFICIENT: { '1': 1.2, '2': 1.3, '3': 1.4, '4': 1.5, '5': 1.6 },
             DESCRIPTION: '产生基于防御值的治疗效果',
             MAGIC_COST: 4 }
         }
 */
exports.querySkillList = SkillService.querySkillList;

/*
    方法简介：获取升级技能的相关配置
    参数：
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        { '0': { GOLD_COST: 20 },
          '1': { GOLD_COST: 40 },
          '2': { GOLD_COST: 100 },
          '3': { GOLD_COST: 250 },
          '4': { GOLD_COST: 700 },
          '5': { GOLD_COST: 2000 }
         }
 */
exports.queryUpskillConfig = SkillService.queryUpskillConfig;


/*
    方法简介：升级技能
    参数：
        key:String，技能的key，['ATTACK','DASH','FIRE_BALL','PRAY']
        success:失败回调函数
        fail:失败回调函数
    返回值示例：
        true
 */
exports.upSkill = SkillService.upSkill;