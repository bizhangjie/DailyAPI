from pyrogram import Client
from pyrogram.types import Message
api_id = 5422465638
bot_token = "6550913831:AAFsuKk2TAS6O-6vcqpZPZEmuKtWcGC3c0A"

app = Client(
    "MYXIAOJI_bot",
    api_id=api_id,
    bot_token=bot_token
)

@app.on_message()
async def echo(client: Client, message: Message):
    await message.reply(message.text)

app.run()