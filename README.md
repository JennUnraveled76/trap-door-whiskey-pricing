# Trap Door Whiskey Pricing

A dependency-free browser application for whiskey pricing and inventory. Requires Node.js 20 or newer.

## Start the app

1. Open a terminal in this project folder.
2. Run `npm start`.
3. On your own computer, open `http://localhost:3000` in a browser. In a hosted workspace, use that platform's supported port-forwarding feature for port 3000 if available.
4. Stop the server with Ctrl+C when finished.

No package installation, API keys, or database setup is needed. Run `npm test` for the automated checks. You can also run `node tests/pricing.test.js` to see all ten individual checks.

## Using the calculator

1. Enter a whiskey name and its bottle cost, for example $34.
2. Enter the number of whole bottles in stock.
3. Choose category Whiskey, Scotch, or Bourbon.
4. Check the suggested pour price, then select **Add to inventory**.

The exact formula is bottle cost ÷ 16 pours × 5. A $32 bottle costs $2 per pour and has a suggested $10 selling price. Currency displays round to cents; dashboard potential sales use the unrounded formula (bottle cost × 5), so multiplying a displayed rounded pour price by 16 may differ by a few cents. Potential sales exclude taxes, waste, and overhead. Categories are assigned manually because no category rules or thresholds were provided.

Use Edit or Delete in the inventory table to change saved records. Search and category filters affect the table; dashboard totals always cover the full inventory. Stock counts represent whole bottles, not partial bottles or individual pour tracking.

## Automatic saving and backups

Submitted additions, edits, deletions, and imports save automatically in this browser's local storage. Unsubmitted form entries are not saved. This is a single-device app: it does not sync online or across browsers. Clearing browser data or using private browsing can lose inventory. Use **Download backup** regularly, and **Import backup** to restore it. Import replaces inventory after confirmation. Keep the same browser and server address to access the same saved inventory. No authentication is included; deploy only in a trusted setting.

## Manual acceptance check

1. Add a $34 whiskey, category Whiskey, quantity 2. Expect a $10.63 pour price, 2 bottles, $68 inventory cost, and $340 potential sales.
2. Reload the page. Confirm the record remains.
3. Edit quantity to 3. Expect 3 bottles, $102 cost, and $510 potential sales.
4. Try search and every category filter.
5. Download a backup, delete the record, and import the backup. Confirm it returns.
6. Try a zero cost or negative/fractional stock. Confirm the entry cannot be saved.

## Save the code to GitHub

These steps save application code, not your browser's inventory data.

1. Open a terminal in the project folder.
2. Run `git status` to review changed files.
3. Run `git add README.md package.json server.js index.html app.js pricing.js style.css tests/pricing.test.js`.
4. Run `git commit -m "Build whiskey passport pricing app"`.
5. Run `git push origin main` (use your actual branch name if different).
6. Open the repository on GitHub and confirm the new files appear.

If Git asks for a name and email, configure your own Git identity before committing. If the cloud proxy is unavailable, keep this workspace and retry the push once service is restored. Do not reset or delete the local files. Saving to GitHub does not host the application; run it locally or arrange hosting separately.

Legacy categories (1M, 2K, 3J, 4A) load as Whiskey, preserving inventory. Edit each record to Scotch or Bourbon as needed.
