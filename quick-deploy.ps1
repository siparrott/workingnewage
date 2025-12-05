# Quick deployment without pager issues
$ErrorActionPreference = "Continue"

Write-Host "=== Building ===" -ForegroundColor Cyan
$env:GIT_PAGER = ""
npm run build --silent

Write-Host "`n=== Committing ===" -ForegroundColor Cyan
git add .
git commit -m "Fix voucher alignment - ensure logo and text use consistent centering"

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan
git push origin main

Write-Host "`n=== Deploying to Heroku ===" -ForegroundColor Cyan
git push heroku main

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Test at: https://workingnewage-2eecd723a444.herokuapp.com/voucher/pdf/preview?sku=Family-Basic&name=Test&from=Tester&message=Test" -ForegroundColor Cyan

