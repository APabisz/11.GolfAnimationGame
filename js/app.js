import "../css/style.scss"

const btn = document.querySelector(".btn-action")
const fill = document.querySelector(".fill")
const bar = document.querySelector(".bar")
const golf_ball = document.querySelector(".golf_ball")
const stick = document.querySelector(".guy__stick")
const guy_head = document.querySelector(".guy__head")
const guy_body = document.querySelector(".guy__body")
const guy_arm_left = document.querySelector(".guy__arm-left")
const guy_arm_right = document.querySelector(".guy__arm-right")
const guy_leg_left = document.querySelector(".guy__leg-left")
const guy_leg_right = document.querySelector(".guy__leg-right")

const setGuyAnimationsOnBreathingState = () => {
  stick.style.animation = "stick-breathing 2.5s infinite"
  guy_head.style.animation = "head-breathing 2.5s 0.7s infinite"
  guy_body.style.animation = "body-breathing 2.5s infinite"
  guy_arm_left.style.animation = "arm-left-breathing 2.5s infinite"
  guy_arm_right.style.animation = "arm-right-breathing 2.5s infinite"
  guy_leg_left.style.animation = ""
  guy_leg_right.style.animation = ""
}

const setGuyAnimationsOnFocusState = () => {
  stick.style.animation = "stick-focus 2.5s infinite"
  guy_head.style.animation = "head-focus 2.5s infinite"
  guy_body.style.animation = "body-focus 2.5s infinite"
  guy_arm_left.style.animation = "arm-left-focus 2.5s infinite"
  guy_arm_right.style.animation = "arm-right-focus 2.5s infinite"
  guy_leg_left.style.animation = "leg-focus 2.5s infinite"
  guy_leg_right.style.animation = "leg-focus 2.5s infinite"
}

const setGuyAnimationsOnHitState = () => {
  golf_ball.style.animation =
    "golf-ball-x 2s .8s cubic-bezier(.18, .37, .71, .86) forwards, golf-ball-y 2s .8s cubic-bezier(0.33333, 0.66667, 0.66667, 1) forwards"

  document.documentElement.style.setProperty(
    "--golf-power-deg",
    getCurrentRotation(stick)
  )
  stick.style.animation = "stick-hit 2.5s forwards"
  guy_head.style.animation = "head-hit 2.5s forwards"
  guy_body.style.animation = "body-hit 2.5s forwards"
  guy_arm_left.style.animation = "arm-left-hit 2.5s forwards"
  guy_arm_right.style.animation = "arm-right-hit 2.5s forwards"
  guy_leg_left.style.animation = "leg-focus 2.5s forwards"
  guy_leg_right.style.animation = "leg-focus 2.5s forwards"
}

const mindFocus = () => {
  fill.style.animationName = "fill"
  fill.style.animationPlayState = "running"
  setGuyAnimationsOnFocusState()
  btn.style.backgroundColor = "orange"
  btn.textContent = "Release to hit the golf ball"

  window.addEventListener("mouseup", hitGolfBall)
  window.addEventListener("touchend", hitGolfBall)
  btn.removeEventListener("mousedown", mindFocus)
  btn.removeEventListener("touchstart", mindFocus)
}

const hitGolfBall = () => {
  btn.style.backgroundColor = "midnightblue"
  fill.style.animationPlayState = "paused"

  const fillStyles = getComputedStyle(fill)
  const fillWidth = parseInt(fillStyles.width, 10)
  const barStyles = getComputedStyle(bar)
  const barWidth = parseInt(barStyles.width, 10)
  const progressPercent = (fillWidth / barWidth).toFixed(2)
  btn.textContent = `Power of your hit: ${(progressPercent * 100).toFixed()}%`

  setBallDistance(20 + progressPercent * 70)
  setGuyAnimationsOnHitState()

  window.removeEventListener("mouseup", hitGolfBall)
  window.removeEventListener("touchend", hitGolfBall)
  golf_ball.addEventListener("animationend", resetAnimation)
}

const resetAnimation = () => {
  golf_ball.removeEventListener("animationend", resetAnimation)

  setGuyAnimationsOnBreathingState()

  setTimeout(() => {
    btn.addEventListener("mousedown", mindFocus)
    btn.addEventListener("touchstart", mindFocus)
    btn.style.backgroundColor = ""
    btn.textContent = "press and hold"
    golf_ball.style.animation = ""
    fill.style.animationName = "none"
  }, 2500)
}

btn.addEventListener("mousedown", mindFocus)
btn.addEventListener("touchstart", mindFocus)

const setBallDistance = (move) => {
  const myRules = document.styleSheets[0].cssRules
  for (const item of myRules) {
    if (item.name === "golf-ball-x") {
      item.appendRule(`100% {left:${move}vw}`)
    }
  }
}

function getCurrentRotation(el) {
  var st = window.getComputedStyle(el, null)
  var tm =
    st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") ||
    "none"
  if (tm != "none") {
    var values = tm.split("(")[1].split(")")[0].split(",")
    var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI))
    return `${angle}deg`
  }
  return `0deg`
}
