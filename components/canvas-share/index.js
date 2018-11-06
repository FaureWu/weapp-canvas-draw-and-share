function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(visible) {
        if (visible && !this.beginDraw) {
          this.draw()
          this.beginDraw = true
        }
      }
    },
    userInfo: {
      type: Object,
      value: false
    }
  },

  data: {
    beginDraw: false,
    isDraw: false,

    canvasWidth: 281,
    canvasHeight: 500,
  },

  methods: {
    draw() {
      wx.showLoading()
      const { userInfo, canvasWidth, canvasHeight } = this.data
      const { avatarUrl, nickName } = userInfo
      const avatarPromise = getImageInfo(avatarUrl)
      const backgroundPromise = getImageInfo('https://img.xiaomeipingou.com/_assets_home-share-bg.jpg')

      Promise.all([avatarPromise, backgroundPromise])
        .then(([avatar, background]) => {
          const ctx = wx.createCanvasContext('share', this)

          // 绘制背景
          ctx.drawImage(
            background.path,
            0,
            0,
            canvasWidth,
            canvasHeight
          )

          // 绘制头像
          const radius = 30
          const y = 40
          ctx.drawImage(
            avatar.path,
            canvasWidth / 2 - radius,
            y - radius,
            radius * 2,
            radius * 2,
          )

          // 绘制用户名
          ctx.setFontSize(20)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#ffffff')
          ctx.fillText(
            nickName,
            canvasWidth / 2,
            y + 50,
          )
          ctx.stroke()

          ctx.draw()
          wx.hideLoading()
          this.setData({ isDraw: true })
        })
        .catch(() => {
          this.setData({ beginDraw: false })
          wx.hideLoading()
        })
    }
  }
})