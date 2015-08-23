# HelgaJS
An text based game engine designed for teaching JavaScript.

##Game Engine API

The game engine has a few methods and properties that are used to make building the game easier.. Below is a list of the available methods and properties.

addToken: This method takes two strings parameters: token and meth. It adds the token to the tokens array and meth to the tokenHandlers array.  This method can be used to add custom tokens to screens. See tokens for more information.

adjustItem: This method has two parameters: name and val.  The name is a string that identifies a game data property.  The val is the amount that should be added or subtracted from the game data property.  This is used by the game engine to do things like subtract hearts when the hero is damaged or add gems when the hero finds money.

attack: This method has two parameters: target and damage.  This method is used to reduce the hearts of game bosses or other enemies that have hearts.

formatInventory: This method is exclusively used by the game engine to create the text shown in the inventory screen.

getBoss: This method accepts a number that corresponds to the boss that you want to get returned from the game data bosses array.  See bosses for more information.

getCurrentBossName: This fetches the current bosses name.

getData: This method returns the current game data that is loaded into the game engine.

getEnemy: This method returns an enemy from the enemy array based on the number passed to it.

getItem: This method takes a string name and returns the game data property that matches it. This is one of the most commonly used methods.

getRandomNum: This method accepts a number to use as an upper limit. When this is specified, a random number from zero to the limit will be returned.

getScreen: This method accepts a number and returns the screen from the game data screens array that corresponds to it.  Unlike other methods that fetch items from arrays, the first item in this case starts with one and not zero.

getScreenText: This method takes the screen title, text, and game options and formats them for display on the screen.

getStats: This method grabs the current hearts and gems information and formats it for display on the screen.

getTitle: This method returns the title that is specified in the first screen.  By convention the first screen should be the game title screen.

getTokens: This method returns the tokens from the token array.  For more information see tokens.

hasText: This method has 2 parameters: text and optionally textType. The text passed to this method is checked to see if it is empty and contains more than empty space, often called white space (line breaks and spaces).  The textType property when set to "ABC" will only allow letters. When it is set to "ABC123", it will allow both letters and numbers.

parse: This method takes two parameters: txt which can be any string and tokens which is an array of replaceable items. Parse replaces any tokens found in txt with the appropriate value. A good example of this is the player's name.  Any text passed to parse that has the {{HERO}} token, is replaced by the value of the game data name property.

process: The process method is the main handler of screen actions.  All of the game automation is done by this method.

rollDice: This method returns a random number between one and twelve.

sellItem: This method handles subtracting gems and placing items in the game data. It has two parameters: item (string) and price (number).

setInventory: This method adds an item to the inventory object.  It has three parameters: item, title and name.  The item is the string name for the inventory property. The title is the type of item that it is.  The name is what the item is described as.  In the case of the demo game, the hero has an sword item with "sword" as the title and "Silver Sword" as the name.

setItem: This method has two parameters name  (string) and val (any type). It changes the value of the specified game data property.

setTitle: This method sets the title of the first screen.  By convention the game title is set as the title of the first screen.

showScreen: This method is used by the game engine to show the screen specified.  This method has two parameters: gd, the game data and num, the screen number to be shown.

showScreenTmpl: This method prints an empty sample screen object in the console.  This is a convenience method for new coders that forget what screens should look like.

start: This method takes the game data passed to it, sets it in the engine and then shows the first screen starting the game.

tokenHandlers: This property is an array that should contain either a property name or function name that provides data for a corresponding token.

tokens: This property contains an array of tokens that are to be replaced in any screen text.  This property along with tokenHandler is used by parse to format the screen text.
