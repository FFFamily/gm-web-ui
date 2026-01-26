// 军械库物品数据
// 可以在这里方便地修改物品信息
// 注意：img 字段现在只存储图片名称（不包含路径），实际路径通过 imageMap 获取

export const storeItems = [
  // 绿色品质
  {id: 1,name: '武器润滑油',price: 1000,quality: 'green',category: 'weapon',img: '武器润滑油',stats: { attackSpeed: 5 }},
  { id: 2, name: '等离子转换器', price: 1000, quality: 'green', category: 'weapon',img: '等离子转换器',stats: { weaponLifesteal: 10 } },
  { id: 3, name: '补偿器', price: 1000, quality: 'green', category: 'weapon', img: '补偿器', stats: { weaponStrength: 5 } },
  { id: 3, name: '弹药储备', price: 1000, quality: 'green', category: 'weapon', img: '弹药储备', stats: { maxAmmo: 20 } },
  { id: 3, name: '狂热增幅器', price: 1000, quality: 'green', category: 'weapon', img: '狂热增幅器', stats: { cooldown: 5 } },
  { id: 3, name: '平流层信标', price: 1000, quality: 'green', category: 'weapon', img: '平流层信标', stats: { cooldown: 5 } },
  { id: 7, name: '市售撞针', price: 3750, quality: 'blue', category: 'weapon', img: '市售撞针', stats: { damage: 25 } },
  { id: 4, name: '军火储备', price: 4000, quality: 'blue', category: 'weapon', img: '军火储备', stats: { damage: 8 } },
  { id: 5, name: '护盾瓦解器', price: 4000, quality: 'blue', category: 'weapon', img: '护盾瓦解器', stats: { damage: 8 } },
  { id: 6, name: '高级纳米生物', price: 4500, quality: 'blue', category: 'weapon', img: '高级纳米生物', stats: { damage: 8 } },
  { id: 5, name: '汲血技术', price: 4500, quality: 'blue', category: 'weapon', img: '汲血技术', stats: { damage: 8 } },
  { id: 5, name: '极寒冷却剂', price: 5500, quality: 'blue', category: 'weapon', img: '极寒冷却剂', stats: { damage: 8 } },
  { id: 5, name: '黑爪改造模块', price: 6000, quality: 'blue', category: 'weapon', img: '黑爪改造模块', stats: { damage: 8 } },
  { id: 5, name: '应急芯片', price: 4500, quality: 'blue', category: 'weapon', img: '应急芯片', stats: { damage: 8 } },
  
  { id: 11, name: '代码破译器', price: 1200, quality: 'purple', category: 'weapon', img: '代码破译器',stats: { damage: 50 } },
  { id: 12, name: '可回收弹头', price: 1100, quality: 'purple', category: 'weapon', img: '可回收弹头', stats: { health: 120 } },
  { id: 13, name: '沃斯卡娅军械', price: 1000, quality: 'purple', category: 'weapon', img: '沃斯卡娅军械', stats: { cooldown: 20 } },
  { id: 14, name: '指挥官的弹夹', price: 1500, quality: 'purple', category: 'weapon', img: '指挥官的弹夹', stats: { damage: 40, lifesteal: 15 } },
  { id: 15, name: '武器干扰弹', price: 1500, quality: 'purple', category: 'weapon', img: '武器干扰弹', stats: { damage: 40, lifesteal: 15 } },
  { id: 16, name: '助推喷气背包', price: 1000, quality: 'purple', category: 'weapon', img: '助推喷气背包', stats: { cooldown: 20 } },
  { id: 17, name: '艾玛莉的解毒剂', price: 1500, quality: 'purple', category: 'weapon', img: '艾玛莉的解毒剂', cooldown: 20, stats: { damage: 40, lifesteal: 15 } },
  { id: 18, name: '闪电部队抑制器', price: 1500, quality: 'purple', category: 'weapon', img: '闪电部队抑制器', cooldown: 20, stats: { damage: 40, lifesteal: 15 } },
  { id: 19, name: '高强度光子加速器', price: 1500, quality: 'purple', category: 'weapon', img: '高强度光子加速器', cooldown: 20, stats: { damage: 40, lifesteal: 15 } },
  { id: 20, name: '断魂曲', price: 1500, quality: 'purple', category: 'weapon', img: '断魂曲', cooldown: 20, stats: { damage: 40, lifesteal: 15 } },
  { id: 21, name: '蜘蛛之眼', price: 1500, quality: 'purple', category: 'weapon', img: '蜘蛛之眼', cooldown: 20, stats: { damage: 40, lifesteal: 15 } },
  { id: 22, name: '空域克星', price: 1500, quality: 'purple', category: 'weapon', img: '空域克星', cooldown: 20, stats: { damage: 40, lifesteal: 15 } },

]
