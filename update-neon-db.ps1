# Update Neon database product order
Write-Host "=== Updating Voucher Product Order in Neon Database ===" -ForegroundColor Cyan

# Get DATABASE_URL from Heroku
$dbUrl = heroku config:get DATABASE_URL --app workingnewage

if ($dbUrl) {
    Write-Host "✅ Database URL retrieved" -ForegroundColor Green
    
    # Parse connection string
    if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^/]+)/(.+)") {
        $user = $matches[1]
        $password = $matches[2]
        $host = $matches[3]
        $database = $matches[4] -replace '\?.*$', ''  # Remove query params
        
        Write-Host "`nConnection Details:" -ForegroundColor Yellow
        Write-Host "  Host: $host" -ForegroundColor Gray
        Write-Host "  Database: $database" -ForegroundColor Gray
        Write-Host "  User: $user" -ForegroundColor Gray
        
        # Create SQL commands
        $sqlCommands = @"
UPDATE voucher_products SET display_order = 1 WHERE name LIKE '%Family Basic%';
UPDATE voucher_products SET display_order = 100 WHERE name LIKE '%Event%';
SELECT name, display_order FROM voucher_products WHERE is_active = true ORDER BY display_order LIMIT 10;
"@
        
        Write-Host "`n📝 SQL Commands to run:" -ForegroundColor Yellow
        Write-Host $sqlCommands -ForegroundColor Cyan
        
        Write-Host "`n⚠️  Please run these commands manually in Neon Console:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://console.neon.tech" -ForegroundColor White
        Write-Host "2. Select your project" -ForegroundColor White
        Write-Host "3. Go to SQL Editor" -ForegroundColor White
        Write-Host "4. Run the SQL commands above" -ForegroundColor White
        
        # Save SQL to file
        $sqlCommands | Out-File -FilePath "neon-update-commands.sql" -Encoding UTF8
        Write-Host "`n✅ SQL commands saved to: neon-update-commands.sql" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Could not retrieve DATABASE_URL" -ForegroundColor Red
}

Write-Host "`n=== Alternative: Use psql if installed ===" -ForegroundColor Yellow
Write-Host "psql `"$dbUrl`" -f reorder-products.sql" -ForegroundColor Cyan

