// 军械库物品数据
// 可以在这里方便地修改物品信息

export const storeItems = [
  // 绿色品质
  {
    id: 1,
    name: '武器润滑油',
    price: 1000,
    quality: 'green',
    category: 'weapon',
    img: '/src/assets/ow/武器润滑油.jpg',
    stats: { weaponStrength: 10 }
  },
  { 
    id: 2, 
    name: '等离子转换器', 
    price: 1000, 
    quality: 'green', 
    category: 'weapon',
    img: '/src/assets/ow/等离子转换器.jpg',
    stats: { health: 30 } 
  },
  { id: 3, name: '补偿器', price: 1000, quality: 'green', category: 'weapon', img: '/src/assets/ow/补偿器.jpg', stats: { cooldown: 5 } },
  { id: 4, name: '弹药储备', price: 1500, quality: 'green', category: 'weapon', img: '/src/assets/ow/弹药储备.jpg', stats: { damage: 8 } },
  { id: 5, name: '狂热增幅器', price: 1500, quality: 'green', category: 'weapon', img: '/src/assets/ow/狂热增幅器.jpg', stats: { damage: 8 } },
  { id: 6, name: '平流层信标', price: 1500, quality: 'green', category: 'weapon', img: '/src/assets/ow/平流层信标.jpg', stats: { damage: 8 } },

  // 蓝色品质
  { id: 7, name: '钢剑', price: 500, quality: 'blue', category: 'weapon', stats: { damage: 25 } },
  { id: 8, name: '锁子甲', price: 450, quality: 'blue', category: 'survival', stats: { health: 60 } },
  { id: 9, name: '疾风靴', price: 400, quality: 'blue', category: 'skill', stats: { cooldown: 12 } },
  { id: 10, name: '吸血匕首', price: 600, quality: 'blue', category: 'device', stats: { damage: 15, lifesteal: 5 } },

  // 紫色品质
  { id: 11, name: '龙鳞剑', price: 1200, quality: 'purple', category: 'weapon', stats: { damage: 50 } },
  { id: 12, name: '圣光护甲', price: 1100, quality: 'purple', category: 'survival', stats: { health: 120 } },
  { id: 13, name: '时空之靴', price: 1000, quality: 'purple', category: 'skill', stats: { cooldown: 20 } },
  { id: 14, name: '血饮狂刀', price: 1500, quality: 'purple', category: 'device', stats: { damage: 40, lifesteal: 15 } }
]
