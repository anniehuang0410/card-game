const view = {
  // 卡片中使用之 HTML 元素
  getCardElement() {
   return `
   <div class="card">
      <p>4</p>
      <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png" alt="">
      <p>4</p>
    </div>
   `
  },
  // 展示卡片
  displayCards() {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardElement()
  }
}
view.displayCards()