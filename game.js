var gd = {
    name: "Tank",
    hearts: 5,
    matches: 5,
    lantern: false,// use numeric to count how many times lantern was tried to get
    gems: 0,
    rescuee: "Helga",
    enemies: ["Grublor", "Stolak"],
    forestKey: false,
    forestBossKey: false,
    silverSword: true,
    leatherShield: false,
    heartPotion: false,
    bosses: [{name: "King Malvox", hearts: 7}],
    _currentScreen: 0,
    _previousScreen: 0,
    _currentBoss: "",
    _currentShield: 0,
    _heartLimit: 5,
    _gameOverWin: 43,
    _gameOverLose: 42,
    _quitScreen: 44,
    _inventoryScreen: 40,
    _creditsScreen: 41,
    inventory: {
      sword: {
          title: "Sword",
          name: "---"
      },
      shield: {
          title: "Shield",
          name: "---"
      },
      light: {
          title: "Light",
          name: "---"
      },
      key: {
          title: "key",
          name: "---"
      }
   },
    screens: [{
        id: 1,
        title: "The Legend of Helga",
        text: "Click OK to begin.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        hideStats: true,
        action: function(ge, gd, answer){
            //initialize inventory here
            var matches = "Matches (" + ge.getItem("matches") + ")";
            ge.setInventory('light', 'Light', matches);
            return {goto: 2};
        }

    }, {
        id: 2,
        title:"Before we get started...", 
        text: "Adventurer, what is your name?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        hideStats: true,
        usePrompt: true,
        action: function (ge, gd, answer){
            var act = {};
            if (answer.match(/[A-Za-z0-9]+/)) {
                act.goto = 4;
                ge.setItem('name', answer);
            }
            else {
                act.goto = 3;
            }

            return act;
    }
    }, {
        id: 3,
        title:"That's not a name!", 
        text: "It's not that hard, just type your name.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 2};
        }
    }, {
        id: 4,
        title:"{{RESCUEE}} has been kidknapped!", 
        text: "The local village blacksmith said that he saw her taken into the forest by a shadowy figure. " +
              "He gave you a Silver Sword to help you in your quest. You'd better hurry into the forest and save her. ",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 5};
        }
    }, {
        id: 5,
        title:"{{RESCUEE}} is not going to save herself", 
        text: "where will you start?",
        a: "Venture into the Dark Forest",
        b: "Vist the Dark Forest Temple",
        c: "QUIT",
        d: "",
        e: "",
        usePrompt: true,
        action: function (ge, gd, answer){
            var act = {};
            switch(answer){
                case "A":
                    act.goto = 7;
                    break;
                case "B":
                    act.goto = 6;
                    break;
                case "STUFF":
                case "INVENTORY":
                    act.goto = ge.getItem("_inventoryScreen");
                    break;
                default:
                    act.goto = ge.getItem("_quitScreen");

            }

            return act;
        }
    }, {
        id: 6,
        title: "You need a key to get in the Dark Forest Temple.", 
        text: "Maybe you should look for one in the forest.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 5};
        }
    }, {
        id: 7,
        title:"The forest is dark.", 
        text: "you will need a lantern to find anything, what will you do?",
        a: "Look for a lantern",
        b: "Look for the temple key",
        c: "Go to the Forest Temple",
        d: "QUIT",
        e: "",
        usePrompt: true,
        action: function (ge, gd, answer){
            var act = {};
            var lantern = ge.getItem('lantern');
            var roll = ge.rollDice();
            var matches = ge.getItem('matches');
            var forestKey = ge.getItem('forestKey');

                            //remove a match if there is no lantern, this must happen before matches value read
            if (!lantern) {
                //ge.adjustItem('matches', -1);
                act.matches = -1;
            }

            //If there are no matches the game is over
            if (!matches && !lantern) {
                act.goto = 11;
                /**
                *@todo replace with real game over screen
                */
                return act;
            }

            switch(answer){
                case "A":
                    if(lantern) {
                        act.goto = 10;
                        return act;
                    }
                    //Assume no lantern if here 
                    if (roll > 6) {

                        act.goto = 8;
                    }
                    else {
                        if(matches) {
                            act.goto = 9;
                        }
                        else {
                            act.goto = 11;
                        }

                    }

                    break;
                case "B":
                    if (forestKey) {
                        act.goto = 17;
                        return act;
                    }
                    if (roll > 6) {
                        act.goto = 12;
                    }
                    else {
                        act.goto = 13;//key not found
                    }
                    break;
                case "C":
                    if (forestKey) {
                        //hide key from inventory, it has been used
                        ge.setInventory("key", "", "---");
                        act.goto = 18;
                    }
                    else {
                        act.goto = 16;
                    }
                    break;
                case "STUFF":
                case "INVENTORY":
                    act.goto = ge.getItem("_inventoryScreen");
                    break;
                default:
                    act.goto = ge.getItem("_quitScreen");

            }
            return act;
        }
    }, {
        id: 8,
        title:"You found a lantern!", 
        text: "Now you don't have to keep burning your fingers with those pesky matches.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            //change screen sevens message, zero indexed!
            ge.setItem('lantern', true);
            ge.setInventory("light", "", "Eternal Lantern");

            gd.screens[6].title = "Keep your sword ready {{NAME}}.";
            gd.screens[6].text = "The light of the lantern has show the true danger ahead. What will you do?";
            return {goto: 7};
        }
    }, {
        id: 9,
        title:"Drats, you didn't find a lantern yet.", 
        text: "You'd better hurry you only have {{MATCHES}} matches left!",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            var act = {};
            var matches = ge.getItem('matches');

            if (matches) {
                act.goto = 7;
            }
            else {
                act.goto = 11;
            }
            return act;
        }
    }, {
        id: 10,
        title:"You can't find something you already have.", 
        text: "look for the key already!",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 7};
        }
    }, {
        id: 11,
        title: "As your last match burned to cinder, you saw your hope fade to blackness.", 
        text: "You are lost forever in darkness. -GAME OVER.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 999};
        }
    }, {
        id: 12,
        title: "Hooray!", 
        text: "You found the Forest Temple key.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.setItem('forestKey', true);
            ge.setInventory("key", "", "Forest Temple Key");
            return {goto: 7};//forest temple screen
        }
    }, {
        id: 13,//battle screen
        title: "An {{ENEMY}} has appear.", 
        text: "Prepare for battle, I hope your sword is sharp.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            var act = {};
            var roll = ge.rollDice();
            if (roll > 7) {
                act.goto = 14;
            }
            else {
                act.goto = 15;
                //act.hearts = -1;
            }
            return act;
        }
    }, {
        id: 14,//battle screen
        title: "Victory is Yours {{NAME}}.", 
        text: "Your fought valiantly and earned 5 gems.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {
                goto: 7,
                gems: 5
            };
        }
    }, {
        id: 15,
        title: "The agnony of defeat!", 
        text: "Your managed to slay the beast but not before sustaining some damage.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {
                goto: 7,
                hearts: -1
            };
        }
    }, {
        id: 16,
        title: "You need a key to enter the Temple.", 
        text: "Maybe you should better equip yourself before you head to the temple.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 7};
        }
    }, {
        id: 17,
        title: "{{NAME}} you are not going to find another key.", 
        text: "Is it time to head to the temple?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 7};
        }
    }, {
        id: 18,
        title: "Forest Temple Entrance", 
        text: "Stay alert, this temple is very dangerous, {{NAME}} what will you do?",
        a: "Visit the temple shop",
        b: "Explore the temple",
        c: "Enter Boss Room",
        d: "Quit",
        e: "",
        action: function (ge, gd, answer){
            //Set _currentBoss
            if (!ge.getItem('_currentBoss')) {
                var boss = ge.getBoss(1);
                ge.setItem('_currentBoss', boss);
            }
            //change screen text if boss key found
            var bossKey = ge.getItem('forestBossKey');
            var lantern = ge.getItem('lantern');
            /* This dynamically changed he screen text
            if (bossKey) {
                var scr = ge.getScreen(gd, 17);
                if (scr){
                    scr.c = "Enter Boss Room";
                    scr.d = "Quit";
                }
            }*/

            var act = {};
            var roll = ge.rollDice();
            switch(answer){
                case "A":
                    act.goto = 19;
                    break;
                case "B":
                    if (!lantern){
                        act.matches = -1;
                    }
                    // find chest
                    if (roll === 1 || roll === 12) {
                        act.goto = 26;
                    }
                    //find 
                    if (roll === 9 || roll === 10 || roll === 11) {
                        act.goto = 27;
                    }
                    //fight here
                    if (roll === 2 || roll === 3 || roll === 4 || roll === 5 || roll === 6 || roll === 7 || roll === 8) {
                        act.goto = 28;
                    }
                    break;
                case "C":
                    console.log('boss key ', bossKey);
                    if (bossKey) {
                        act.goto = 31;
                        /**
                        *@todo send to boss screen
                        */
                        console.log('gotta key');
                    }
                    else {
                        act.goto = 32;
                        console.log('no key');
                    }
                    break;
                case "STUFF":
                case "INVENTORY":
                    act.goto = ge.getItem("_inventoryScreen");
                    break;
                default:
                    act.goto = ge.getItem("_quitScreen");
            }

            return act;
        }
    }, {
        id: 19,
        title: "Hayloo, welcome to my shop.", 
        text: "I am Dreeko, What would yoooh like to buy?",
        a: "A lantern - 20 gems",
        b: "5 matches 10 gems",
        c: "A leather shield - 25 gems",
        d: "A heart potion - 15 gems",
        e: "Exit the shop",
        action: function (ge, gd, answer){
            var lanternPrice = 20;//20
            var shieldPrice = 25;//35
            var potionPrice = 15;//15

            var act = {};
            var gems = ge.getItem('gems');
            var lantern = ge.getItem('lantern');
            var shield = ge.getItem('leatherShield');
            var potion = ge.getItem('heartPotion');

            switch(answer){
                case "A":
                    if (lantern) {
                        act.goto = 20;
                    }
                    else {
                        if (ge.sellItem('lantern', lanternPrice)) {
                            act.goto = 21;
                        }
                        else {
                            act.goto = 22;
                        }
                    }
                    break;
                case "B":
                    act.goto = 23;
                    break;
                case "C":
                    if (shield) {
                        act.goto = 20;
                    }
                    else {
                        if (ge.sellItem('leatherShield', shieldPrice)) {
                            act.goto = 24;
                        }
                        else {
                            act.goto = 22;
                        }
                    }
                    break;
                case "D":
                    if (potion) {
                        act.goto = 20;
                    }
                    else {
                        if (ge.sellItem('heartPotion', potionPrice)) {
                            act.goto = 25;
                        }
                        else {
                            act.goto = 22;
                        }
                    }
                    break;
                case "E":
                    act.goto = 18;
                    break;
                case "STUFF":
                case "INVENTORY":
                    act.goto = ge.getItem("_inventoryScreen");
                    break;
                default:
                    act.goto = ge.getItem("_quitScreen");
            }

            return act;
        }
    }, {
        id: 20,
        title: "Looks like you already have one of those.", 
        text: "As much as Dreeko would like to sell you another one, I just can't.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 19};
        }
    }, {
        id: 21,
        title: "{{NAME}} you are the owner of a shiny new lantern!", 
        text: "Dreeko thinks you could have saved money looking for one in the forest though...",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.setInventory("light", "", "Eternal Lantern");
            return {goto: 19};
        }
    }, {
        id: 22,
        title: "Dreeko really likes chraity but I have 9 kids to feed.", 
        text: "Maybe you should check the temple for treasure and come back later?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 19};
        }
    }, {
        id: 23,
        title: "I'd really like to sell you something but, in this temple, you really need a lantern.", 
        text: "Maybe there is somethign else you need?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 19};
        }
    }, {
        id: 24,
        title: "Dreeko thinks you are smart.", 
        text: "The leather shield will cut your damage in half",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.setItem('_currentShield', 1);
            ge.setInventory("shield", "", "Leather Shield");
            return {goto: 19};
        }
    }, {
        id: 25,
        title: "This potion is quite special.", 
        text: "if you fall in battle it will revive you to full health.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.setInventory("potion", "Heart Potion", "Fairy Syrup");
            return {goto: 19};
        }
    }, {
        id: 26,
        title: "What luck!", 
        text: "You found a chest that contains 10 gems.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.adjustItem('gems', 10);
            return {goto: 18};
        }
    }, {
        id: 27,
        title: "You found the boss room.",
        text: "Are you ready to do battle?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.setItem('forestBossKey', true);
            ge.setInventory("key", "", "Forest Boss Key");
            return {goto: 18};
        }
    }, {
        id: 28,
        title: "An {{ENEMY}} appeared, prepare for battle.",
        text: "",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            var act = {};
            var roll = ge.rollDice();
            if (roll > 8) {
                //win
                act.goto = 29;
            }
            else {
                act.goto = 30;
            }
            return act;
        }
    }, {
        id: 29,
        title: "BEAST-MODE activated, you slayed the enemy!",
        text: "You just earned 10 gems.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {
                goto: 18,
                gems: 10
            };
        }
    }, {
        id: 30,
        title: "Temple monsters are stonger than those found in the forest.",
        text: "You defeated your foe but were injured in the process.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {
                goto: 18,
                hearts: -2
            };
        }
    }, {
        id: 31,
        title: "<<<{{BOSS}}>>> - Forest Temple Boss.",
        text: "Strike fast or perish.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 33};
        }
    }, {
        id: 32,
        title: "You cannot enter this room.",
        text: "You must explore the temple to find the boss room key to get in.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 18};
        }
    }, {
        id: 33,
        title: "{{BOSS}} is charging you.",
        text: "What will you do?",
        a: "Sword attack",
        b: "Try special attack",
        c: "Dodge",
        d: "Quit",
        e: "",
        action: function (ge, gd, answer){
            var act = {};
            var roll1 = ge.rollDice();
            var roll2 = ge.rollDice();

            switch(answer){
                case "A":
                    if (roll1 > 6) {
                        act.goto = 34;
                    }
                    else {
                        act.goto = 35;
                    }
                    break;
                case "B":
                    if (roll1 === roll2 || (roll1 + roll2 === 14)) {
                        act.goto = 36;
                    }
                    else {
                        act.goto = 37;
                    }
                    break;
                case "C":
                    act.goto = 38;
                    break;
                case "STUFF":
                case "INVENTORY":
                    act.goto = ge.getItem("_inventoryScreen");
                    break;
                default:
                    act.goto = ge.getItem("_quitScreen");
            }
            return act;
        }
    }, {
        id: 34,
        title: "Excellent attack {{NAME}}!",
        text: "Keep this up and {{BOSS}} will be defeated soon.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            var act = {goto: 33};
            var boss = gd._currentBoss;
            var bossHearts = ge.attack(boss, -1);

            if (!bossHearts) {
                act.goto = 39;
            }
            return act;
        }
    }, {
        id: 35,
        title: "{{BOSS}} is a skilled figher.",
        text: "You have been injured, I'm not sure how much of this you can take.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {
                goto: 33, 
                hearts: -2
            };
        }
    }, {
        id: 36,
        title: "<< Five Strike Blazing Slash >> - Special Attack Unleashed!",
        text: "You inflicted major damage to {{BOSS}}.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            var act = {goto: 33};
            var boss = gd._currentBoss;
            var bossHearts = ge.attack(boss, -3);

            if (!bossHearts) {
                act.goto = 39;
            }
            return act;
        }
    }, {
        id: 37,
        title: "Special attacks are not easy to pull off.",
        text: "{{BOSS}} struck before you could power up.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {
                goto: 33, 
                hearts: -2
            };
        }
    }, {
        id: 38,
        title: "You can't run forever {{NAME}}.",
        text: "The only way to free {{RESCUEE}} is to defeat {{BOSS}}.",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 33};
        }
    }, {
        id: 39,
        title: "You defeated {{BOSS}}.",
        text: "A hidden stone door crumbles and {{RESCUEE}} runs out and hugs you. Thank you for saving me {{NAME}} I do not know how to thank you! \n" +
              "Congratulations what will you next quest be?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            ge.setItem('_currentBoss', null);
            ge.adjustItem('_heartLimit', 1);
            ge.setItem('hearts', ge.getItem('_heartLimit'));
            return {goto: 9999};
        }
    }, {
        id: 40,
        title: "Inventory",
        text: "{{INVENTORY}}",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            var screenNum = ge.getItem("_previousScreen");
            return {goto: screenNum};
        }
    }, {
        id: 41,
        title: "Credits",
        text: "{{CREDITS}}",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 9999};
        }
    }, {
        id: 42,
        title: "Game Over",
        text: "What is that sad music playing? Try again?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 9999};
        }
    }, {
        id: 43,
        title: "Game Over",
        text: "Congradulation! You saved Princess {{RESCUEE}}. {{NAME}}, perhaps now you might create your own quest?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 9999};
        }
    }, {
        id: 44,
        title: "Quitters never prosper.",
        text: "What's the matter {{NAME}} couldn't take it?",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        action: function (ge, gd, answer){
            return {goto: 9999};
        }
    }]
};

ge.start(gd);