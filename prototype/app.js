const range = document.getElementById('timeRange');
const label = document.getElementById('forecastTime');
const note = document.getElementById('forecastNote');
const play = document.getElementById('playBtn');
let timer = null;
function sync(){
  const v = Number(range.value);
  label.textContent = v === 0 ? 'Bây giờ' : `+${v} giờ`;
  note.textContent = v < 3 ? 'Nguy cơ đang tăng' : v < 8 ? 'Đỉnh ngập dự kiến' : 'Mực nước giảm dần';
  document.documentElement.style.setProperty('--prototype-hour', v);
}
range.addEventListener('input', sync);
play.addEventListener('click',()=>{
  if(timer){clearInterval(timer);timer=null;play.textContent='▶';return;}
  play.textContent='Ⅱ';
  timer=setInterval(()=>{
    let v=Number(range.value)+1;
    if(v>24){v=0;}
    range.value=v;sync();
  },350);
});
sync();
