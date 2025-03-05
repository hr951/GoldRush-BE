import { world, system, ItemStack, EnchantmentType, EquipmentSlot, GameMode } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import playerDropBeforeEvent from "./events/playerDropBeforeEvent";

//ここにチェストの座標を入れる
const ChestLoc = { x:11, y:-11, z:11 };

let ore = [{
    gold:50,
    coal:14,
    lapis:13,
    redstone:10,
    emerald:10,
    diamond:3
}];

let dev = false;

function items(player) {
    player.runCommand(`clear @s`);
    player.runCommand(`function goldrush_items`);
    //armor
    if(player.hasTag("red")) {
        const chest = world.getDimension("overworld").getBlock(ChestLoc);
        const chestContainer = chest.getComponent("inventory")?.container;

        const helmet = chestContainer.getItem(0);
        helmet.lockMode = "slot";
        const chestplate = chestContainer.getItem(1);
        chestplate.lockMode = "slot";
        const leggings = chestContainer.getItem(2);
        leggings.lockMode = "slot";
        const boots = chestContainer.getItem(3);
        boots.lockMode = "slot";
        player.getComponent("equippable").setEquipment(EquipmentSlot.Head, helmet);
        player.getComponent("equippable").setEquipment(EquipmentSlot.Chest, chestplate);
        player.getComponent("equippable").setEquipment(EquipmentSlot.Legs, leggings);
        player.getComponent("equippable").setEquipment(EquipmentSlot.Feet, boots);
    } else if(player.hasTag("blue")) {
        const chest = world.getDimension("overworld").getBlock(ChestLoc);
        const chestContainer = chest.getComponent("inventory")?.container;

        const helmet = chestContainer.getItem(9);
        helmet.lockMode = "slot";
        const chestplate = chestContainer.getItem(10);
        chestplate.lockMode = "slot";
        const leggings = chestContainer.getItem(11);
        leggings.lockMode = "slot";
        const boots = chestContainer.getItem(12);
        boots.lockMode = "slot";
        player.getComponent("equippable").setEquipment(EquipmentSlot.Head, helmet);
        player.getComponent("equippable").setEquipment(EquipmentSlot.Chest, chestplate);
        player.getComponent("equippable").setEquipment(EquipmentSlot.Legs, leggings);
        player.getComponent("equippable").setEquipment(EquipmentSlot.Feet, boots);
    }
    //admin tool
    if (player.hasTag("admin")){
        const inventory = player.getComponent("inventory").container;
        const nether_star = new ItemStack("minecraft:nether_star",1);
        nether_star.nameTag = "Click to Start";
        const stick = new ItemStack("minecraft:stick",1);
        stick.nameTag = "鉱石設置 (殴って使用)";
        stick.setLore(["《鉱石出現確率》",`金鉱石 ${ore[0].gold}％`,`石炭鉱石 ${ore[0].coal}％`,`ラピス鉱石 ${ore[0].lapis}％`,`レッドストーン鉱石 ${ore[0].redstone}％`,`エメラルド鉱石 ${ore[0].emerald}％`,`ダイヤモンド鉱石 ${ore[0].diamond}％`]);
        inventory.setItem(17,nether_star);
        inventory.setItem(16,stick);
    }
};

function setting_form(source){
    const form = new ModalFormData();
            // タイトル
            form.title("§l§gGoldRush§f 開始前設定");
            // スライダー (ラベル,最小値,最大値,刻み,初期値)
            form.slider("§g金鉱石§f 生成率", 0, 100, 1, 50);
            form.slider("§0石炭鉱石§f 生成率", 0, 100, 1, 14);
            form.slider("§9ラピス鉱石§f 生成率", 0, 100, 1, 13);
            form.slider("§cレッドストーン鉱石§f 生成率", 0, 100, 1, 10);
            form.slider("§aエメラルド鉱石§f 生成率", 0, 100, 1, 10);
            form.slider("§bダイヤモンド鉱石§f 生成率", 0, 100, 1, 3);
            form.toggle("開発モード(開始しません)", false);

            form.slider("§g金鉱石§f 再生成時間(秒)", 1, 300, 1, 30);
            form.slider("§0石炭鉱石§f 再生成時間(秒)", 1, 300, 1, 90);
            form.slider("§9ラピス鉱石§f 再生成時間(秒)", 1, 300, 1, 120);
            form.slider("§cレッドストーン鉱石§f 再生成時間(秒)", 1, 300, 1, 120);
            form.slider("§aエメラルド鉱石§f 再生成時間(秒)", 1, 300, 1, 120);
            form.slider("§bダイヤモンド鉱石§f 再生成時間(秒)", 1, 300, 1, 180);
            // ドロップダウン (ラベル,配列,初期値)
            //form.dropdown("ドロップダウン", ["選択肢0", "選択肢1", "選択肢2"], 0);
            // テキストフィールド (ラベル,プレースホルダ,初期値);
            form.textField("ゲーム時間", "秒", "600");
            form.textField("ラストスパート", "秒", "200");
            // トグル (ラベル,初期値)
            form.toggle("フレンドリーファイア(未実装)", true);
    
            // フォームの表示
            form.show(source).then(res => {
                
                // res.canceled - フォームをキャンセルしたかどうか
                // res.formValues[] - フォームの入力の配列 (0から始まる)
                if (res.canceled) {
                    return;
                }

                if (!parseInt(res.formValues[13], 10) || !parseInt(res.formValues[14], 10)){
                    source.sendMessage("[Error] ゲーム時間とラストスパートの時間を確認してください。\n>>>ゲーム時間 "+res.formValues[13]+"\n>>>ラストスパート "+res.formValues[14]);
                    return;
                }

                ore = [{ 
                    gold:res.formValues[0],
                    coal:res.formValues[1],
                    lapis:res.formValues[2],
                    redstone:res.formValues[3],
                    emerald:res.formValues[4],
                    diamond:res.formValues[5]
                },
                {
                    gold:res.formValues[7]*20,
                    coal:res.formValues[8]*20,
                    lapis:res.formValues[9]*20,
                    redstone:res.formValues[10]*20,
                    emerald:res.formValues[11]*20,
                    diamond:res.formValues[12]*20
                }];

                const times = {
                    time:parseInt(res.formValues[13], 10),
                    x2time:parseInt(res.formValues[14], 10)
                };

                if(res.formValues[0] + res.formValues[1] + res.formValues[2] + res.formValues[3] + res.formValues[4] + res.formValues[5] != 100){
                    source.sendMessage("[Error] 鉱石の生成率の合計値が100になりません。")
                } else if(res.formValues[6]) {
                    source.sendMessage("開発モードです。\n棒が更新されました。");
                    source.runCommand("clear @s stick")
                    const inventory = source.getComponent("inventory").container;
                    const stick = new ItemStack("minecraft:stick",1);
                    stick.nameTag = "鉱石設置 (殴って使用)";
                    stick.setLore(["《鉱石出現確率》",`金鉱石 ${ore[0].gold}％`,`石炭鉱石 ${ore[0].coal}％`,`ラピス鉱石 ${ore[0].lapis}％`,`レッドストーン鉱石 ${ore[0].redstone}％`,`エメラルド鉱石 ${ore[0].emerald}％`,`ダイヤモンド鉱石 ${ore[0].diamond}％`]);
                    inventory.setItem(16,stick);
                } else if (times.time <= 0 || times.x2time < 0){
                    source.sendMessage("[Error] ゲーム時間とラストスパートの時間を確認してください。\n>>>ゲーム時間 "+times.time+"\n>>>ラストスパート "+times.x2time);
                } else if(times.time<times.x2time) {
                    source.sendMessage("[Error] ゲーム時間よりラストスパートの時間のほうが大きくなることはできません。")
                } else {
                    const scoreboard = world.scoreboard;
                    const object = scoreboard.getObjective("goldrush_info");
                    object.setScore("time",times.time);
                    object.setScore("x2time",times.x2time);
                    source.runCommand("clear @s");
                    source.runCommand("function goldrush_reset");
                    source.runCommand("function goldrush_team");
                    dev = true;
                    for (const player of world.getPlayers()){
                        player.setGameMode(GameMode.survival);
                        items(player);
                        player.onScreenDisplay.setTitle("§aS§fTART !");
                        player.onScreenDisplay.updateSubtitle(`マイクラ §gGold Rush`);
                        player.playSound("random.levelup", { location: player.location });
                     }
                }
            });
        };

world.afterEvents.playerSpawn.subscribe(ev => {
    const player = ev.player;
    player.runCommand("clear @s");
    player.addEffect("night_vision", 10000000, { amplifier: 0, showParticles: false });
    if(player.hasTag("admin")){
        const inventory = player.getComponent("inventory").container;
        const nether_star = new ItemStack("minecraft:nether_star",1);
        nether_star.nameTag = "Click to Start";
        const stick = new ItemStack("minecraft:stick",1);
        stick.nameTag = "鉱石設置 (殴って使用)";
        stick.setLore(["《鉱石出現確率》",`金鉱石 ${ore[0].gold}％`,`石炭鉱石 ${ore[0].coal}％`,`ラピス鉱石 ${ore[0].lapis}％`,`レッドストーン鉱石 ${ore[0].redstone}％`,`エメラルド鉱石 ${ore[0].emerald}％`,`ダイヤモンド鉱石 ${ore[0].diamond}％`]);
        inventory.setItem(17,nether_star);
        inventory.setItem(16,stick);
    }
    if(ev.initialSpawn) return;
    items(player);
    });
//採掘キャンセル
world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const dimension = world.getDimension("overworld")
    const gamemode = ev.player.getGameMode();
    const player = ev.player;
    const block = ev.block;
    const block_loc = ev.block.location;
    const itemstack = ev.itemStack;
    if (player.hasTag("admin")){
        if (!itemstack) return;
        if (itemstack.nameTag === "鉱石設置 (殴って使用)" && itemstack.typeId === "minecraft:stick"){
        if (block.type.id === "minecraft:stone"){
            system.run(() => {
                    var random = Math.floor( Math.random() * 100 );
                    if (random <= ore[0].gold-1) {
                        dimension.getBlock(block_loc).setType("minecraft:gold_ore");
                    } else if (random <= ore[0].gold-1 + ore[0].coal) {
                        dimension.getBlock(block_loc).setType("minecraft:coal_ore");
                    } else if (random <= ore[0].gold-1 + ore[0].coal + ore[0].lapis) {
                        dimension.getBlock(block_loc).setType("minecraft:lapis_ore");
                    } else if (random <= ore[0].gold-1 + ore[0].coal + ore[0].lapis + ore[0].redstone) {
                        dimension.getBlock(block_loc).setType("minecraft:redstone_ore");
                    } else if (random <= ore[0].gold-1 + ore[0].coal + ore[0].lapis + ore[0].redstone + ore[0].emerald) {
                        dimension.getBlock(block_loc).setType("minecraft:emerald_ore");
                    } else if (random <= ore[0].gold-1 + ore[0].coal + ore[0].lapis + ore[0].redstone + ore[0].emerald + ore[0].diamond) {
                        dimension.getBlock(block_loc).setType("minecraft:diamond_ore");
                    } else {
                        dimension.getBlock(block_loc).setType("minecraft:stone");
                    }
            })
        } else if (block.type.id === "minecraft:gold_ore" || block.type.id === "minecraft:coal_ore" || block.type.id === "minecraft:lapis_ore" || block.type.id === "minecraft:redstone_ore" || block.type.id === "minecraft:lit_redstone_ore" || block.type.id === "minecraft:emerald_ore" || block.type.id === "minecraft:diamond_ore"){
            system.run(() => {
                dimension.getBlock(block_loc).setType("minecraft:stone");
            });
        }
        }
     }
    if (gamemode === "creative") return;
    if (ev.block.typeId === 'minecraft:coal_ore' || ev.block.typeId === 'minecraft:gold_ore' || ev.block.typeId === 'minecraft:diamond_ore' || ev.block.typeId === 'minecraft:lapis_ore' || ev.block.typeId === 'minecraft:redstone_ore' || ev.block.typeId === 'minecraft:lit_redstone_ore' || ev.block.typeId === 'minecraft:emerald_ore') {
        ev.cancel = false;  
    } else {
        ev.cancel = true;
    }
    });

    playerDropBeforeEvent.subscribe(ev => {
        ev.cancel = true;
    });
    //鉱石右クリ
    world.beforeEvents.playerInteractWithBlock.subscribe(ev => {
        const player = ev.player;
        const block = ev.block.type.id;
        if (ev.isFirstEvent){
        if (block === "minecraft:gold_ore"){
            player.sendMessage("[System] 金の原石を入手できます。")
        } else if (block === "minecraft:coal_ore"){
            player.sendMessage("[System] 採掘速度が上昇します。")
        } else if (block === "minecraft:lapis_ore"){
            player.sendMessage("[System] 回復薬を入手できます。")
        } else if (block === "minecraft:redstone_ore" || block === "minecraft:lit_redstone_ore"){
            player.sendMessage("[System] 攻撃力が上昇します。")
        } else if (block === "minecraft:emerald_ore"){
            player.sendMessage("[System] HPが増加します。")
        } else if (block === "minecraft:diamond_ore"){
            player.sendMessage("[System] 採掘速度とスピードが上昇します。")
        }
        }
    });
    //Block右クリ(after)
    /*world.afterEvents.playerInteractWithBlock.subscribe(ev => {
        const player = ev.player;
        const itemstack = ev.itemStack;
        const dimension = ev.block.dimension;
        const block_loc = ev.block.location;
        if (ev.isFirstEvent){
        
    }
    });*/
    //item use
    world.afterEvents.itemUse.subscribe((ev) => {
        //source･･･右クリしたプレイヤー
        //itemStack･･･右クリされたアイテム
        const { source, itemStack } = ev;
        if (source.hasTag("admin")){
        if (itemStack.typeId === "minecraft:nether_star" && itemStack.nameTag === "Click to Start") {
            //start処理
            setting_form(source);
            }
        }
        if (itemStack.typeId === "minecraft:red_dye" && itemStack.nameTag === "回復薬 (右クリックで使用)") {
            source.playSound("random.orb", { location: source.location });
            source.addEffect("instant_health", 1, { amplifier: 1, showParticles: false });
            source.runCommand("clear @s red_dye 0 1")
        }
    });
    //アイテム消去
    world.afterEvents.entitySpawn.subscribe(ev => {
        const item = ev.entity;
        const dimension = world.getDimension('overworld');
        if (item.typeId === "minecraft:item"){
            try {
            item.kill();
            const player = dimension.getPlayers({
                location: ev.location,
                closest: 1
            })[0];
            player.sendMessage(`[System] アイテムは消えてしまいました...`);
            } catch (error){

            }
        }
    });
    //鉱石採掘処理
    world.afterEvents.playerBreakBlock.subscribe(ev => {
        const gamemode = ev.player.getGameMode();
        if (gamemode === "creative") return;
        const brokenBlockPermutation = ev.brokenBlockPermutation;
        const dimension = ev.dimension;
        const player = ev.player;
        const blocklocation = ev.block.location;
        world.scoreboard.getObjective("mine_count")?.addScore(player,1);
        if (brokenBlockPermutation.type.id === 'minecraft:gold_ore') {
            world.scoreboard.getObjective("gold_mine_count")?.addScore(player,1);
            const raw_gold = new ItemStack("minecraft:raw_gold",1);
            raw_gold.setLore(["捨てると消えます。"]);
            const inventory = player.getComponent("inventory").container;
            inventory.addItem(raw_gold);
            dimension.getBlock(blocklocation).setType("minecraft:cobblestone");
            system.runTimeout(() => {
                dimension.getBlock(blocklocation).setType("minecraft:gold_ore");
            }, ore[1].gold); 
        } else if (brokenBlockPermutation.type.id === 'minecraft:emerald_ore') {
            player.addEffect("health_boost", 600, { amplifier: 4, showParticles: false });
            player.addEffect("instant_health", 1, { amplifier: 255, showParticles: false });
            player.sendMessage("[System] HPが30秒間2倍になります。");
            dimension.getBlock(blocklocation).setType("minecraft:cobblestone");
            system.runTimeout(() => {
                dimension.getBlock(blocklocation).setType("minecraft:emerald_ore");
            }, ore[1].emerald); 
        } else if (brokenBlockPermutation.type.id === 'minecraft:coal_ore') {
            player.addEffect("haste", 300, { amplifier: 0, showParticles: false });
            player.sendMessage("[System] 採掘速度が15秒間上昇します。");
            dimension.getBlock(blocklocation).setType("minecraft:cobblestone");
            system.runTimeout(() => {
                dimension.getBlock(blocklocation).setType("minecraft:coal_ore");
            }, ore[1].coal); 
        } else if (brokenBlockPermutation.type.id === 'minecraft:diamond_ore') {
            player.addEffect("haste", 300, { amplifier: 2, showParticles: false });
            player.addEffect("speed", 300, { amplifier: 0, showParticles: false });
            player.sendMessage("[System] 採掘速度とスピードが15秒間上昇します。");
            dimension.getBlock(blocklocation).setType("minecraft:cobblestone");
            system.runTimeout(() => {
                dimension.getBlock(blocklocation).setType("minecraft:diamond_ore");
            }, ore[1].diamond); 
        } else if (brokenBlockPermutation.type.id === 'minecraft:lapis_ore') {
            const red_dye = new ItemStack("minecraft:red_dye",1);
            red_dye.nameTag = "回復薬 (右クリックで使用)";
            const inventory = player.getComponent("inventory").container;
            inventory.addItem(red_dye);
            player.sendMessage("[System] 回復薬を入手しました。");
            dimension.getBlock(blocklocation).setType("minecraft:cobblestone");
            system.runTimeout(() => {
                dimension.getBlock(blocklocation).setType("minecraft:lapis_ore");
            }, ore[1].lapis); 
        } else if (brokenBlockPermutation.type.id === 'minecraft:lit_redstone_ore' || brokenBlockPermutation.type.id === 'minecraft:redstone_ore') {
            player.addEffect("strength", 200, { amplifier: 0, showParticles: false });
            player.sendMessage("[System] 攻撃力が10秒間上昇します。");
            dimension.getBlock(blocklocation).setType("minecraft:cobblestone");
            system.runTimeout(() => {
                dimension.getBlock(blocklocation).setType("minecraft:redstone_ore");
            }, ore[1].redstone); 
        }
        });
        //金の原石カウント処理
        system.runInterval(() => {
            const scoreboard = world.scoreboard;
            const object = scoreboard.getObjective("goldrush_info");
            const time = object.getScore("time");
            const x2time = object.getScore("x2time");
            for(const player of world.getPlayers()){
          if (player.isSneaking) {
              const dimension = player.dimension;
              const location = {
                  x: Math.floor(player.location.x),
                  y: Math.floor(player.location.y) - 1,
                  z: Math.floor(player.location.z)
              }
              const block = dimension.getBlock(location);
          
              if (block.typeId === "minecraft:redstone_block") {
                try {
                  if(time > x2time){
                        player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add @s gold_nouhin_count 1`);
                        player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add "red" goldrush_info 1`);
                    } else {
                        player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add @s gold_nouhin_count 2`);
                        player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add "red" goldrush_info 2`);
                    }
                    player.runCommand("clear @s[hasitem={item=raw_gold,quantity=1..}] raw_gold 0 1");
                } catch(error) {

                }
              } else if (block.typeId === "minecraft:lapis_block") {
                try {
                  if(time > x2time){
                    player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add @s gold_nouhin_count 1`);
                    player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add "blue" goldrush_info 1`);
                  } else {
                    player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add @s gold_nouhin_count 2`);
                    player.runCommand(`execute if entity @s[hasitem={item=raw_gold,quantity=1..}] run scoreboard players add "blue" goldrush_info 2`);
                  }
                  player.runCommand("clear @s[hasitem={item=raw_gold,quantity=1..}] raw_gold 0 1");
                } catch(error) {

                }
              }
          }
            }
          },2);

          function getranking(objname,countstr) {
            const scoreboard = world.scoreboard;
            const allplayer = world.getAllPlayers()
            let rankdata = []
            let ranking = []

            allplayer.forEach(target => {
                if(target.hasTag("red")){
                rankdata.push({
                    name: `§c${target.nameTag}§f`,
                    score: scoreboard.getObjective(objname).getScore(target)
                })
            } else if(target.hasTag("blue")){
                rankdata.push({
                    name: `§9${target.nameTag}§f`,
                    score: scoreboard.getObjective(objname).getScore(target)
                })
            } else {
                rankdata.push({
                    name: `${target.nameTag}`,
                    score: scoreboard.getObjective(objname).getScore(target)
                })
            }
            })
        
            rankdata.sort((a,b) => b.score - a.score)
        
            for (let f = 0; f < rankdata.length; f++) {
                let data = rankdata[f]
                ranking.push(`${f + 1}位 ${data.name}: ${data.score}${countstr}`)
            }
        
            return ranking.join('\n');
        }
        //諸制御
        system.runInterval(() => {
            const scoreboard = world.scoreboard;
            const object = scoreboard.getObjective("goldrush_info");
            const red = object.getScore("red");
            const blue = object.getScore("blue");
            const time = object.getScore("time");
            const x2time = object.getScore("x2time");
            for (const player of world.getPlayers()){
                //アクションバー処理
                if(time > x2time){
                player.onScreenDisplay.setActionBar(`§cRed Team§f : §a${red} §9Blue Team§f : §a${blue}`);
                } else if(dev){
                    dev = false;
                    player.playSound("random.levelup", { location: player.location });
                    player.sendMessage("[System] 残り時間あとわずか！\n[System] ただいまから納品個数が2倍に！");
                }
            }
            if(time === 0){
                for (const player of world.getPlayers()){
                    object.setScore("time",-1)
                    player.runCommand("clear @s");
                    player.setGameMode(GameMode.adventure);
                    if (red > blue){
                        player.onScreenDisplay.setTitle("§cRed Team §gWIN!");
                        player.onScreenDisplay.updateSubtitle(`§l§c${red} §r§f- §9${blue}`);
                    } else if (red < blue){
                        player.onScreenDisplay.setTitle("§9Blue Team §gWIN!");
                        player.onScreenDisplay.updateSubtitle(`§c${red} §f- §l§9${blue}`);
                    } else {
                        player.onScreenDisplay.setTitle("DRAW");
                        player.onScreenDisplay.updateSubtitle(`§c${red} §f- §9${blue}`);
                    }
                    const mine_count = scoreboard.getObjective("mine_count");
                    const gold_mine_count = scoreboard.getObjective("gold_mine_count");
                    const gold_nouhin_count = scoreboard.getObjective("gold_nouhin_count");
                    mine_count.addScore(player,0);
                    gold_mine_count.addScore(player,0);
                    gold_nouhin_count.addScore(player,0);
                    if (player.hasTag("admin")){
                    const nether_star = new ItemStack("minecraft:nether_star",1);
                    nether_star.nameTag = "Click to Start";
                    const inventory = player.getComponent("inventory").container;
                    inventory.setItem(17,nether_star);
                    }
                }
                system.runTimeout(() => {
                    world.sendMessage(`§b━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n§e鉱石採掘数ランキング`);
                    world.sendMessage(getranking("mine_count","回"));
                    world.sendMessage(`§e金鉱石採掘数ランキング`);
                    world.sendMessage(getranking("gold_mine_count","回"));
                    world.sendMessage(`§e金鉱石納品数ランキング`);
                    world.sendMessage(getranking("gold_nouhin_count","個"));
                    world.sendMessage(`§b━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                    for (const player of world.getPlayers()){
                    player.playSound("random.levelup", { location: player.location });
                    }
                },10);
            }
        });
        //時間制御
        system.runInterval(() => {
            const scoreboard = world.scoreboard;
            const object = scoreboard.getObjective("goldrush_info");
            const time = object.getScore("time");
            if(time > 0) {
            object.addScore("time",-1);
            }
        },20);
