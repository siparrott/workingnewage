# Complete deployment script
Write-Host "=== Checking git status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Adding all changes ===" -ForegroundColor Cyan
git add .

Write-Host "`n=== Committing changes ===" -ForegroundColor Cyan
git commit -m "Update dist/index.html"

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan
git push origin main

Write-Host "`n=== Deploying to Heroku ===" -ForegroundColor Cyan
git push heroku main

Write-Host "`n=== Verification ===" -ForegroundColor Cyan
Write-Host "Checking final git status..." -ForegroundColor Yellow
git status

Write-Host "`nChecking Heroku releases..." -ForegroundColor Yellow
heroku releases --app workingnewage -n 3

Write-Host "`n=== COMPLETED ===" -ForegroundColor Green
Write-Host "All changes have been committed to GitHub and deployed to Heroku!" -ForegroundColor Green

