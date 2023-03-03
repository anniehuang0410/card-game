const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// 定義遊戲狀態
const GAME_STATE = {
  firstCardAwaits: 'firstCardAwaits',
  secondCardAwaits: 'secondCardAwaits',
  cardMatchFailed: 'cardMatchFailed',
  cardMatched: 'cardMatched',
  gameFinished: 'gameFinished'
}

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
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  // 翻卡動作
  flipCards(...cards) { // 如有多個卡片都可以同時執行此函式
    cards.map(card => {
      if (card.classList.contains('back')) {
        // 回傳正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  // 配對成功者樣式變化
  pairedCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  }
}

const model = {
  // 管理翻開的牌
  revealedCards: [],
  // 檢查翻開的牌是否配對
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  }
}

const controller = {
  // 現在遊戲狀態
  currentState: GAME_STATE.firstCardAwaits,
  // 由 controller 中產生牌
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  // 狀態控制器
  dispatchCardAction(card) {
    // 如果卡片停在正面，不再翻牌
    if (!card.classList.contains('back')) {
      return 
    }
    // 狀態切換
    switch (this.currentState) {
      // 狀態一：：等待翻第一張牌
      case GAME_STATE.firstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.secondCardAwaits
        break // 這個動作暫停，但下面的函式可以繼續運行
      // 狀態二：：等待翻第二張牌
      case GAME_STATE.secondCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        // 判斷是否配對成功
        if (model.isRevealedCardsMatched()) {
          // 狀態三：配對成功
          this.currentState = GAME_STATE.cardMatched
          view.pairedCards(...model.revealedCards)
          model.revealedCards = []
          this.currentState = GAME_STATE.firstCardAwaits
        } else {
          // 狀態四：配對失敗
          this.currentState = GAME_STATE.cardMatchFailed
          setTimeout(this.resetCards, 1000) 
        }
        break 
    }
    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.firstCardAwaits // 此時要將前綴改成 controller，如為 this 則指向 setTimeout
  }
}
controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})