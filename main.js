const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// 不適合歸類在 MVC 中
const utility = {
  // 洗牌：Fisher-Yates shuffle
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys()) // 產生要洗的牌數
    for (let index = (number.length - 1); index > 0; index--) { // 選出最底層的牌
      let randomIndex = Math.floor(Math.random() * (index + 1)); // 選出一個隨機的位置
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]] // 抽換底層排跟隨機位置的牌
    }
    return number
  }
}

const view = {
  // 卡片正面使用之 HTML 元素
  getCardContent(index) {
   const number = this.transformNumber((index % 13) + 1) // 卡片上顯示的數字
   const symbol = Symbols[Math.floor(index / 13)]

   return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    `
  },

  // 卡片背面
  getCardElement(index) {
   return `<div class="card back" data-index="${index}"></div>` // 可以用 back 來判斷卡片為覆蓋還是開啟狀態
  },

  // 特殊符號轉換
  transformNumber(number) {
    switch(number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  // 展示卡片
  displayCards() {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join('')
  },
  // 翻卡動作
  flipCard(card) {
    if(card.classList.contains('back')) {
      // 回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(card.dataset.index)
      return
    }
    // 回傳背面
    card.classList.add('back')
    card.innerHTML = null
  }
}
view.displayCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    view.flipCard(card)
  })
})