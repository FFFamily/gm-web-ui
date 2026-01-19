// 军械库物品数据
// 可以在这里方便地修改物品信息

export const storeItems = [
  // 绿色品质
  { id: 1, name: '铁剑', price: 200, quality: 'green', stats: { damage: 10 } },
  { id: 2, name: '布甲', price: 150, quality: 'green', stats: { health: 30 } },
  { id: 3, name: '草鞋', price: 100, quality: 'green', stats: { cooldown: 5 } },
  { id: 4, name: '小刀', price: 180, quality: 'green', stats: { damage: 8 } },
  
  // 蓝色品质
  { id: 5, name: '钢剑', price: 500, quality: 'blue', stats: { damage: 25 } },
  { id: 6, name: '锁子甲', price: 450, quality: 'blue', stats: { health: 60 } },
  { id: 7, name: '疾风靴', price: 400, quality: 'blue', stats: { cooldown: 12 } },
  { id: 8, name: '吸血匕首', price: 600, quality: 'blue', stats: { damage: 15, lifesteal: 5 } },
  
  // 紫色品质
  { id: 9, name: '龙鳞剑', price: 1200, quality: 'purple', stats: { damage: 50 } },
  { id: 10, name: '圣光护甲', price: 1100, quality: 'purple', stats: { health: 120 } },
  { id: 11, name: '时空之靴', price: 1000, quality: 'purple', stats: { cooldown: 20 } },
  { id: 12, name: '血饮狂刀', price: 1500, quality: 'purple', stats: { damage: 40, lifesteal: 15 } }
]
