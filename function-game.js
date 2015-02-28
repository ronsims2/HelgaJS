(function(w){
    /**********
    GLOBALS ARE A BAD IDEA, but they are so easy to use, we will reorganize these in an advanced lesson
    Game uses flash fram model to organize scene/level concepts 
    *********/
    var gameTitle = "The Legend of {{PRINCESS}}";
    var introText = "Adventurer what is your name?";
    var backgroundStory = "The {{PRINCESS}} has been kidknapped, the  local village blacksmith said that he saw her taken into the forest by a shadowy figure. " +
        "He gave you a Silver Sword to help you in your quest. You'd better hurry into the forest and save her. ";
    var ending = "A hidden stone door crumbles and the princess runs out and hugs you. Thank you for saving me {{HERO}} I do not know how to thank you. \r\n" +
        "Congratulations what will you next quest be?";
    var playerName = "";
    var princess = "Princess Helga";
    var continueGame = true;
    var hasLantern = false;//Need to see in Dark Forest
    var hasForestKey = false; //Nee to get into Dark Forest Temple
    var hasSilverSword = true; //Defualt weapon
    var hasLeatherShield = false; //forest shield
    var matches = 5; //Can use these to temporarily look in dark places
    var money = 0;
    var hearts = 5;
    
    var enemy1 = "Grublor";
    var enemy2 = "Stolak";
    var enemy3 = "Smoke Bhort";
    var forestTempleBoss = "King Malvox";
    var foundForestTempleBoss = false;
    var forestTempleBossHearts = 6;
    
    function showStats(){
        var stats = "\n\n********************\n{{HERO}} Vital Stats\nHearts: {{HEARTS}}\nGems: {{GEMS}}\nMatches: {{MATCHES}}\n********************\n\n";
        stats = stats.replace("{{HERO}}", playerName).replace("{{HEARTS}}", hearts).replace("{{GEMS}}", money).replace("{{MATCHES}}", matches);
        return stats;
    }
    
    function xyzzy(){
        if (hearts < 10) {
            hearts++;
            alert("HAZZZAH! You get an extra heart! How did you figure that out?");
        }
        else{
            alert("I bet you thought that would do something, didn't you?");
        }
    }
    
    function playIntro(){
        
        playerName = prompt(introText);
        if (!playerName) {
            playerName = "";
        }
        playerName = playerName.trim();
        if (playerName) {
            return true;
        }
        alert("Come on, tell me your name.");
        playIntro();
    }
    
    function rollDice(){
        var diceNumber = Math.random() * 12 + 1;
        diceNumber = Math.floor(diceNumber);
        return diceNumber;
    }
    //can use odd and even numbers to distinguish differnt enemy names
    function fightEnemy(name, strength){
        if (!strength) {
            strength = 0;
        }
        var fightRoll = rollDice();
        if (fightRoll >= 6 + strength) {
            return true;
        }
        return false;
    }
    
    function fightForestTempleBoss(){
        var forestTempleFightRoll = rollDice();
        if (forestTempleFightRoll === 12) {
            alert("You found " + forestTempleBoss + "'s hidden weak spot and defeated the temple boss!");
            forestTempleBossHearts = 0;
            return true;
        }
        
        if (forestTempleFightRoll < 7) {
            hearts -= 1.5;
            if (hasLeatherShield) {
                hearts += 0.5;
            }
            alert("You tried to dodge " + forestTempleBoss + "'s attack but failed and sustained damage. You have " + hearts + " hearts left.");
        }
        
        if (forestTempleFightRoll >= 7 && forestTempleFightRoll < 12) {
            forestTempleBossHearts -= 2;
            alert("That was a quick attack, " + forestTempleBoss + " never saw that coming. The boss only has " + forestTempleBossHearts + " hearts left.");
        }
        
        if (forestTempleBossHearts < 1) {
            alert("You did it, you defeated " + forestTempleBoss + "!");
            return true;
        }
        
        if (hearts > 0) {
            alert("Hang in there, the fight is almost over, errr... one way or the other.");
            fightForestTempleBoss();
            return true;
        }
        else {
            alert("You will never defeat me " + forestTempleBoss + "! Was the last thing you heard as everything faded to black. - GAME OVER");
            continueGame = false;
            return false;
        }
    }
    
    function visitForestTempleShop(){
        var shopKeeper = "Dreecko";
        var lanternPrice = 20;//20
        var matchesPrice = 10;//10
        var shieldPrice = 25;//35
        var potionPrice = 15;//15
        
        var shopText = "Hayloo, welcome to my shop. I am {{NAME}} What would yoooh like to buy? \n" +
            "A) Buy a lantern " + lanternPrice + " gems \n" + 
            "B) Buy 5 matches " + matchesPrice + " gems \n" +
            "C) Buy a leather shield " + shieldPrice + " gems \n" +
            "D) Buy a health potion " + potionPrice + " gems \n" + 
            "E) Exit \n" +
            " You currently have " + money + " gems";
        
        shopText = shopText.replace("{{NAME}}", shopKeeper);
        //added stats 
        shopText += showStats();
        
        function checkShopChoice(choice){
            if(choice) {
                choice = choice.toUpperCase().trim();
            }
            
            if (choice === "A") {
                if (hasLantern) {
                    alert("Looks like you already have a lantern, maybe you'd like something else?");
                    visitForestTempleShop();
                    return true;
                }
                if (money >= lanternPrice) {
                    alert("You are the owner of a shiny new lamp!");
                    money -= lanternPrice;
                    hasLantern = true;
                    visitForestTempleShop();
                    return true;
                }
                else {
                    alert("Uh, you are a little short, maybe there is something else you'd like?");
                    visitForestTempleShop();
                    return true;
                }
            }
            if (choice === "B") {
                alert("I'd really like to sell you something, but in this temple, you really need a lantern. Maybe there is somethign else you need?");
                visitForestTempleShop();
                return true;
            }
            if (choice === "C") {
                if (hasLeatherShield) {
                    alert("You cannot carry two shields, maybe you would like something else?");
                    visitForestTempleShop();
                    return true;
                }
                if (money >= shieldPrice) {
                    alert("You now have a leather shield, this gives you extra protection against attacks!");
                    money -= shieldPrice;
                    hasLeatherShield = true;
                }
                else {
                    alert("I wish I could give it away but I have 9 kids to feed. Are you going to buy something?");
                }
                visitForestTempleShop();
                return true;
            }
            if (choice === "D") {
                if (hearts === 5) {
                    alert("You are already healthy, my fresh potions must be taken immediately, it wlll do you no good. Maybe you would like something else?");
                    visitForestTempleShop();
                    return true;
                }
                if (money >= potionPrice) {
                    hearts = 5;
                    alert("Your health has been fully restored. You have " + hearts + " hearts.");
                    money -= potionPrice;
                }
                else {
                    alert("You need a little more money to buy that, do you see anything else you want?");
                }
                visitForestTempleShop();
                return true;
            }
            if (choice === "E") {
                alert("Ohhh, so sad to see you go, come again!");
                playScreen3();
                return true;
            }
            
            if (choice === "XYZZY") {
                xyzzy();
                visitForestTempleShop();
                return true;
            }
            
            alert("Huh? I do have any of zat, maybe there is something else you like.");
            visitForestTempleShop();
            return true;
        }
        
        var shopChoice = prompt(shopText);
        checkShopChoice(shopChoice);
        return true;
    }
    
    function playScreen1(){
        var screen1Text = "The {{PRINCESS}} is not going to save herself, where will you start? \n" +
            "A) Venture into the Dark Forest \n" +
            "B) Vist the Dark Forest Temple \n" +
            "C) Quit";
        
        screen1Text += showStats();
        
        function checkScreen1(choice){
            if (choice) {
                choice = choice.toUpperCase().trim();
            }
            
            if (choice === "A") {
                playScreen2();
                return true;
            }
            if (choice === "B") {
                alert("You need a key to get in the Dark Forest Temple, maybe you should look for one in the forest.");
                playScreen1();
                return true;
            }
            
            if (choice === "C") {
                continueGame = false;
                return false;
            }
            
            alert("Uh-oh, I think you should stick to A, B or C, try again.");
            playScreen1();
            
        }
        var screen1Choice = prompt(screen1Text.replace("{{PRINCESS}}", princess));
        checkScreen1(screen1Choice);
        return true;
    }
    
    function playScreen2(){
        var screen2Question = "The forest is dark, you will need a lantern to find anything, what will you do? \r\n";
        if (hasLantern) {
            screen2Question = "Keep your sword ready, the light of the lantern has shown you the true danger ahead, what will you do next? \r\n";
        }
        var screen2Text = screen2Question +
            "A) Look for a lantern\n" +
            "B) Look for the Key\n" +
            "C) Quit";
        
        screen2Text += showStats();
        
        function checkScreen2(choice){
            if (choice) {
                choice = choice.toUpperCase().trim();
            }

            if (choice === "A") {
                if (hasLantern) {
                    alert("You can't find something you already have, look for the key already!");
                    playScreen2();
                    return true;
                }
                else {
                    var lanternRoll = rollDice();
                    if (matches) {
                        matches--;
                        if (lanternRoll > 6){
                        hasLantern = true;
                        alert("You found a lantern!, Now you don't have to keep burning your fingers with those pesky matches \n" + 
                             "You have " + matches + " matches left.");
                        }
                        else {
                            if (matches) {
                                alert("Ouch, you burned your finger and wasted one of your precious matches. \n" +
                                 "You'd better hurry up and find the lantern quickly, you only have " + matches + " matches left.");
                            }
                            else{
                                alert("That was your last match! You stumbled around in the dark and fell into the forest chasm - GAME OVER.");
                                continueGame = false;
                                return false;
                            }
                        }
                        playScreen2();
                        return true;
                    }
                    else {
                        alert("You don't have anymore matches left and you can't see anything.  You have been lost to the forest's darkness.");
                        continueGame = false;
                        return false;
                    }
                }
            }
            if (choice === "B") {
                if (hasLantern || matches > 0) {
                    if (!hasLantern) {
                        //use a match if there is no lantern
                        matches--;
                    }
                    var keyRoll = rollDice();
                    if (keyRoll < 5) {
                        //fight enemy
                        var enemy = enemy1;
                        if (keyRoll % 2) {
                            enemy = enemy2;
                        }
                        var fightMsg = "A " + enemy + " has appeared, prepare for battle.";
                        alert(fightMsg);
                        var fightResult = fightEnemy(enemy);
                        if (fightResult) {
                            var reward = 5;
                            alert("You fought valiantly, you earned " + reward + " gems.");
                            money += reward;
                        }
                        else {
                            hearts--;
                            if (hasLeatherShield) {
                                hearts += 0.5;
                            }
                            if (hearts){
                                alert("You faught hard, but you sustained some damage before you vanquished your foe. You have " + hearts + " hearts left.");
                            }
                            else {
                                alert("The" + enemy + " was too strong, you suffered the ultimate defeat - GAME OVER.");
                                continueGame = false;
                                return false;
                            }
                        }
                        playScreen2();
                        return true;
                    }
                    else {
                        if (keyRoll === 6 || keyRoll === 9 || keyRoll === 12) {
                            //Found key
                            var msg = "Congratulation, you found the temple key! ";
                            if (!hasLantern) {
                                msg += " I hope you have a lantern, there aren't enough matches in the world to make it through the temple. ";
                            }
                            msg += "It is time to head to the temple. ";
                            
                            alert(msg);
                            if (matches <= 0 && !hasLantern){
                                alert("Your last match just burned out and you are stuck in the dark of the forest forever. You really should have looked for a lantern! -GAME OVER.");
                                continueGame = false;
                                return false;
                            }
                            playScreen3();
                            return true;
                        }
                        else {
                            var msg2 = "Drats, you have been looking, but you have yet to find the temple key.";
                            if (!hasLantern) {
                                msg2 = "No luck yet, you'd better find the key soon, you only have " + matches + " matches left";
                            }
                            alert(msg2);
                        }
                    }
                    
                }
                else {
                    alert("You don't have a lantern or matches and have been swallowed by the dark, you are doomed to wander in the darkness of the forest forever. -GAME OVER");
                    continueGame = false;
                    return false;
                }
                
                if (matches <= 0 && !hasLantern) {
                    alert("As your last match burned to cinder, you saw your hope fade to blackness. You are lost forever in darkness. -GAME OVER.");
                    continueGame = false;
                    return false;
                }
                playScreen2();
                return true;
            }
            
            if (choice === "C") {
                continueGame = false;
                return false;
            }
            alert("I know there are 26 letters in the alphabet but you can only select A, B or C, try again.");
            playScreen2();
            return true;
        }
        
        var screen2Choice = prompt(screen2Text);
        checkScreen2(screen2Choice);
        return true;
    }
    
    function playScreen3(choice){
        if (choice) {
            choice = choice.toUpperCase().trim();
        }
        
        var screen3Text = "Stay alert, this temple is very dangerous, what will you do?\n" +
            "A) Vist the temple shop \n" +
            "B) Explore temple\n" +
            "C) Quit";
        
        if (foundForestTempleBoss) {
            screen3Text = "Stay alert, this temple is very dangers, what will you do?\n" +
            "A) Visit the temple shop \n" +
            "B) Explore the temple\n" +
            "C) Enter boss room \n" +
            "D) Quit";
        }
        
        screen3Text += showStats();
        
        function checkScreen3(choice){
            if (choice) {
                choice = choice.toUpperCase();
            }
            
            if (choice === "A"){
                visitForestTempleShop();
                return true;
            }
            if (choice === "B"){
                if (!hasLantern) {
                    matches--;
                }
                var exploreRoll = rollDice();
                if (exploreRoll === 1 || exploreRoll === 12) {
                    alert("You found a chest that contains 5 gems!");
                    money += 5;
                    if (matches <= 0 && !hasLantern) {
                        alert("Sadly, you'll never get to spend your spoils, you just burned you last match and are condemned to wander in darkness forever. - GAME OVER.");
                        continueGame = false;
                        return false;
                    }
                    playScreen3();
                    return true;
                }
                
                if(exploreRoll > 1 && exploreRoll < 9) {
                    var templeEnemy = enemy2;
                    var templeReward = 10;
                    if (exploreRoll % 2) {
                        templeEnemy = enemy3;
                    }
                    var templeFight = fightEnemy(templeEnemy, 1);
                    
                    if (templeFight) {
                        alert("BEAST-MODE activated, you slayed the " + templeEnemy + "! you earned " + templeReward + " gems.");
                        money += templeReward;
                    }
                    else {
                        hearts -= 2;
                        if (hasLeatherShield) {
                            hearts += 1;
                        }
                        if (hearts <= 0) {
                            alert("What is that sad music playing, this was your final battle, this temple is now your tomb - GAME OVER.");
                            continueGame = false;
                            return false;
                        }
                        alert("Temple monsters are much stronger than others, you defeated the " + templeEnemy + " but you were injured.");
                    }
                    if (matches <= 0 && !hasLantern) {
                        alert("To make matters worst, you just burned you last match and are condemned to wander in darkness forever. - GAME OVER.");
                        continueGame = false;
                        return false;
                    }
                    playScreen3();
                    return true;
                }
                
                if(exploreRoll === 9 || exploreRoll === 10 || exploreRoll === 11) {
                    alert("You found the boss, room, are you ready to do battle?");
                    foundForestTempleBoss = true;
                    if (matches <= 0 && !hasLantern) {
                        alert("Sadly, you'll never get to spend your spoils, you just burned you last match and are condemed to wander in darkness forever. - GAME OVER.");
                        continueGame = false;
                        return false;
                    }
                    playScreen3();
                    return true;
                }
            }
            if (choice === "C"){
                if (foundForestTempleBoss) {
                    //Fight boss
                    var templeBossMsg = "(Door Slams) I hope you have a shield, the temple boss {{BOSS}} is charging toward you!";
                    templeBossMsg = templeBossMsg.replace("{{BOSS}}", forestTempleBoss);
                    
                    alert(templeBossMsg);
                    //Boss rooms have their own loop
                    fightForestTempleBoss();             
                    
                    return true;
                }
                else {
                    continueGame = false;
                    return false;
                }
            }
            if (choice === "D") {
                if (foundForestTempleBoss) {
                    continueGame = false;
                    return false;
                }
            }
            alert("I know there are 26 letters in the alphabet but stick to the choices on the screen.");
            playScreen3();
            return true;
            
        }
        
        var screen3Choice = prompt(screen3Text);
        checkScreen3(screen3Choice);
    }
    
    function main(){
        alert( "Welcome to: " + gameTitle.replace("{{PRINCESS}}", princess));
        playIntro();
        alert(backgroundStory.replace("{{PRINCESS}}", princess));
        playScreen1();
        if (continueGame){
            alert(ending.replace("{{HERO}}", playerName));
            if (matches < 2 && !hasLantern) {
                alert("ACHIEVEMENT - you won the ***Burned Finger Award***, a special badge only given to people that beat the temple without a lantern!");
            }
            return true;
        }
        //If we get here the player quit
        alert("Couldn't take it huh? Maybe next time.");
        return false;
    }
    
    main();
})(window);
