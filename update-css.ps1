$cssFile = 'css/style.css'
$content = Get-Content $cssFile -Raw
# Replace the mobile media query section with expanded one
$oldMobileRule = '@media (max-width:600px){
  .svc-grid,.team-grid,.proc-grid,.test-grid,.blog-grid,.price-grid,.stats-grid,.k-grid,.footer-grid{grid-template-columns:1fr}
  .section{padding:70px 0}
  .price.pop{transform:none}
}'
$newMobileRule = '@media (max-width:600px){
  .svc-grid,.team-grid,.proc-grid,.test-grid,.blog-grid,.price-grid,.stats-grid,.k-grid,.footer-grid{grid-template-columns:1fr}
  .section{padding:60px 0}
  .price.pop{transform:none}
  .container{padding:0 16px}
  .nav-inner{gap:12px;padding:0 12px}
  .nav-logo{padding:6px 10px}
  .nav-logo-img{height:32px}
  .nav-cta{gap:8px}
  .footer{padding:50px 0 20px}
  .footer-grid{gap:28px;margin-bottom:28px}
  .footer-grid > div{text-align:center}
  .footer a{display:inline-block;padding:4px 0}
  .footer h4{margin-bottom:14px}
  .socials{justify-content:center}
  .hero-grid{gap:30px;padding:100px 0 40px}
}'
$content = $content -replace [regex]::Escape($oldMobileRule), $newMobileRule
Set-Content $cssFile $content -Encoding UTF8
