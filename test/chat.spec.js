const { chromium } = require('playwright');

// 10 random questions and answers
const chatPairs = [
  ["What's your favorite color?", "Blue! What's yours?"],
  ["Mine is green. Do you like sports?", "Yes, I love football!"],
  ["Which team do you support?", "Manchester United. You?"],
  ["I'm a Chelsea fan. Do you play video games?", "Absolutely, mostly RPGs."],
  ["Which RPG is your favorite?", "The Witcher 3. Yours?"],
  ["I love Skyrim. Do you like movies?", "Yes, especially sci-fi."],
  ["What's your favorite sci-fi movie?", "Interstellar. What's yours?"],
  ["Blade Runner 2049. Do you code?", "Yes, mostly in JavaScript."],
  ["Me too! What's your favorite framework?", "React for frontend."],
  ["I prefer Vue. Nice chatting with you!", "You too! Have a great day!"]
];

(async () => {
  // Launch Microsoft Edge (Chromium-based)
  const browser1 = await chromium.launch({ channel: 'msedge', headless: false });
  const browser2 = await chromium.launch({ channel: 'msedge', headless: false });

  const context1 = await browser1.newContext();
  const context2 = await browser2.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // Go to local chat app
  await Promise.all([
    page1.goto('http://localhost:3000'),
    page2.goto('http://localhost:3000')
  ]);

  // Set usernames
  await page1.fill('#username', 'Alice');
  await page2.fill('#username', 'Bob');

  // Helper to send a message
  async function sendMessage(page, message) {
    await page.fill('#message', message);
    await page.waitForTimeout(500);
    await page.click('#send');
  }

  // Chat automation: alternate sending messages between Alice and Bob
  for (let i = 0; i < chatPairs.length; i++) {
    // Alice asks, Bob answers
    await sendMessage(page1, chatPairs[i][0]);
    // Wait for message to appear in both chats
    await page1.waitForTimeout(500);
    // Bob answers
    await sendMessage(page2, chatPairs[i][1]);
    // Wait for message to appear in both chats
    await page2.waitForTimeout(500);
  }

  // Take screenshots of both chats
  await page1.screenshot({ path: 'chat-alice.png' });
  await page2.screenshot({ path: 'chat-bob.png' });

  // Close browsers
  await browser1.close();
  await browser2.close();
})();