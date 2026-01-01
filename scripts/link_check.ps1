$errors=0
Get-ChildItem -Path .\tryhackme -Recurse -Filter *.md | ForEach-Object {
  $file = $_.FullName
  $text = Get-Content -Raw -LiteralPath $file
  $re = [regex]'!\[.*?\]\((.*?)\)'
  $matches = $re.Matches($text)
  foreach($m in $matches){
    $path = $m.Groups[1].Value
    if($path -notmatch '^(http|https):'){
      $resolved = Resolve-Path -LiteralPath (Join-Path -Path $_.Directory.FullName -ChildPath $path) -ErrorAction SilentlyContinue
      if(-not $resolved){
        Write-Output "MISSING: $file -> $path"
        $errors++
      } else {
        Write-Output "OK: $file -> $path"
      }
    }
  }
}
if($errors -eq 0){ Write-Output 'No missing local images found.' } else { Write-Output "$errors missing files."; exit 2 }
