(function(w){
    var screenTmpl = {
        id: 0,
        title:"", 
        text: "",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        usePrompt: true,
        action: function (ge, gd, answer){
            var act = {};
            switch(answer){
                case "A":

                    break;
                case "B":

                    break;
                case "C":

                    break;
                case "D":

                    break;
                case "E":

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
    };
    
    var gameData;
    
   var gameEngine = {
       tokens: ["{{NAME}}", "{{TITLE}}", "{{RESCUEE}}", "{{MATCHES}}", "{{HEARTS}}", "{{GEMS}}", "{{ENEMY}}", "{{BOSS}}", "{{INVENTORY}}"],
       tokenHandlers: ["name", "title", "rescuee", "matches", "hearts", "gems", "getEnemy", "getCurrentBossName", "formatInventory"],
       getScreen: function(gd, num){
           var scr = gd.screens[num] || false;
           return scr;
       },
       showScreen: function(gd, screenNum){
          var display = this.getScreenText(gd, screenNum);
           var answer = "";
          if (display.text) {
              var opts = display.opts ? '\n' + display.opts + display.bar + '\n' + display.stats : display.bar + '\n' + display.stats;
              if (display.stats) {
                  display.opts += display.bar + '\n' + display.stats;
              }
              if (display.usePrompt) {
                  answer = prompt(display.text + opts);
              }
              else {
                  alert(display.text);
              }
              this.process(gd, screenNum, answer);
              return true;
          }
          else {
              return false;
          }
       },
       getScreenText: function(gd, screenNum){
           var scr = gd.screens[screenNum - 1];
           var display = {
               text: "",
               opts: "",
               bar: "****************************************",
               usePrompt: false,
               stats: this.getStats()
           };
           
           if (scr) {
               display.text = scr.title + "\n" + display.bar + "\n" + scr.text + "\n";
               //opts = scr.a + "\n" + scr.b + "\n" + scr.c + "\n" + scr.d + "\n" + scr.e + "\n";
               for (var opt in scr) {
                   if (opt === "a" || opt === "b" || opt === "c" || opt === "d" || opt === "e") {
                       if (scr[opt]) {
                           display.opts += opt.toUpperCase() + ") " + scr[opt] + "\n";
                       }
                   }
               }
               
               if (display.opts.trim() || scr.usePrompt) {
                   display.usePrompt = true;
               }
               
               if (scr.hideStats) {
                   display.stats = "";
               }
               
               //pre process text
               display.text = this.parse(display.text);
               display.opts = this.parse(display.opts);
               return display;
           }
           
           return false;
           
       },
       getStats: function(){
           var text = "Hearts: {{HEARTS}}\n";
           text += "Gems: {{GEMS}}\n";
           
           text = this.parse(text);
           return text;
       },
       formatInventory: function(){
           var inv = this.getItem("inventory");
           var text = "";
           var bar = "====================";
           
           text += bar + "";
           for(var item in inv){
               var itm = inv[item];
               text += "\n" + itm.title + ": " + itm.name + "\n" + bar;
           }
           
           return text;
       },
       setInventory: function(item, title, name) {
           var inv = this.getItem("inventory");
           
           var itm = inv[item] || {title: "Unknown", name: ""};
           
           if (title){
               itm.title = title;
           }
           if (name) {
               itm.name = name;
           }

           inv[item] = itm;
       },
       getData: function(){
           return gameData;
       },
       setData: function(gd){
           gameData = gd;
       },
       getTokens: function(){
           return this.tokens;
       },
       addToken: function(tkn, meth){
           if (tkn && meth){
               this.tokens.push(tkn.toString());
               this.tokenHandlers.push(meth);
           }
       },
       parse: function(txt, tokens){//Parse tokens
           if (!tokens) {
               tokens = this.getTokens();
           }
           for (var i = 0; i < tokens.length; i++){
               var tkn = this.tokens[i];
               var item = this.tokenHandlers[i];
               var val = this.getItem(item);
               var handler = this[item] || false;
               
               if (typeof(handler) === 'function') {
                   val = handler.apply(this);
               }
               
               txt = txt.replace(tkn, val);
           }
           return txt;
       },
       //Handle common screen operations
       process: function(gd, screenNum, answer){
           this.setItem("_previousScreen", this.getItem("_currentScreen"));// Use this if you have menu commands that need to return to the current action screen
           this.setItem("_currentScreen", screenNum);
           
           if (answer) {
               answer = answer.trim().toUpperCase();
           }
           
           var act = gd.screens[screenNum - 1].action(this, gd, answer);// call screen specific logic


           if (act) {
               var hearts = act.hearts || 0;// heart adjustment
               var currentHearts = this.getItem('hearts');
               var goto = act.goto || 99999;
               var gems = act.gems || 0;
               var potion = this.getItem('heartPotion');
               var matches = act.matches || 0;
               var shield = this.getItem('_currentShield') || 0;
               
               if (matches) {
                   this.adjustItem('matches', matches);
                   var matchesText = "Matches (" + this.getItem("matches") + ")";
                    this.setInventory('light', 'Light', matchesText);
               }
               
               /*
               remove or add hearts first if hearts === 0 game is over unless hasHeartPotion === true
               return false to quit
               */
               if (hearts){
                   if (hearts < 0) {
                       //use shield
                       hearts = Math.floor(hearts + shield);
                       if (!hearts) {
                           hearts = - 0.5;
                       }
                   }
                  currentHearts = this.adjustItem('hearts', hearts);
               }
               //Revive player 
               if (!currentHearts && potion) {
                   this.adjustItem('hearts', this.getItem('_heartLimit'));
                   this.setItem('heartPotion', false);
                   ths.setInventory("potion", "", "---");
                   currentHearts = this.adjustItem('hearts', hearts);
               }
               
               
               //game over player was killed
               if (!currentHearts) {
                   console.log('Process: game over.');
                   return false;
               }
               //handle gems
               if (gems) {
                   this.adjustItem('gems', gems);
               }
               
               if (goto) {
                   this.showScreen(gd, goto);
               }
               
           }
           else {
               this.showScreen(gd, this.getItem('_currentScreen'));
           }
           return false;
       },
       rollDice: function(){
           var diceNumber = Math.random() * 12 + 1;
           diceNumber = Math.floor(diceNumber);
           return diceNumber;
       },
       getItem: function(name){
           if (name) {
               var item = gameData[name];
               return item;
           }
       },
       setItem: function(name, val){
           if (!val) {
               val = false; //use false instead of falsey
           }
           if (name){
               gameData[name] = val;
           }
       },
       showScreenTmpl: function(){
           console.log('screen template ', screenTmpl);
       },
       setTitle: function(title){
           
           if (title) {
               gameData.screens[0].title = title;
           }
               
           var ttl = gameData.screens[0].title;
           gameData.title = ttl;
       },
       getTitle: function(){
           return gameData.screens[0].title;
       },
       adjustItem: function(name, val){
           if (name && val) {
               var item = this.getItem(name);
               item = item + val;
               if (item < 0) {
                   item = 0;
               }
               gameData[name] = item;
               return gameData[name];
           }
       },
       getRandomNum: function(num){
           num = num ? num : 1;
           return Math.floor(Math.random() * num);
       },
       getEnemy: function(num){
           var nmes = gameData.enemies;
           var nme = "";
           if (num) {
               nme = nmes[num] || "";
           }
           else {
               var rnum = this.getRandomNum(nmes.length);
               nme = nmes[rnum];
           }
           return nme;
       },
       getBoss: function(num){
           var bosses = this.getItem("bosses");
           var boss = bosses[num - 1];
           
           return boss;
       },
       attack: function(target, damage){
           var hearts = target.hearts;
           hearts = hearts + damage;
           if (hearts < 0) {
               hearts = 0;
           }
           
           target.hearts = hearts;
           return hearts;
       },
       getCurrentBossName: function(){
           var boss = this.getItem('_currentBoss') || {};
           return boss.name || "";
       },
       sellItem: function(item, price){
           var gems = this.getItem('gems');
           if (gems >= price) {
               this.adjustItem('gems', (price * -1));
               this.setItem(item, true);
               return true;
           }
           return false;
       },
       start: function(gd){
           this.setData(gd);
           this.setTitle();
           this.showScreen(gd, 1);
       }
    };
    
    if (w) {
        w.ge = gameEngine;
    }
    
    return gameEngine;
    

})(window);