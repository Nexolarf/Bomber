class GameScene extends Phaser.Scene {
    constructor() {//настройки сцены
        super({key: "GameScene"});
    }

    preload(){//загрузка
        //экран загрузки
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 20,
            text: 'Загрузка...',
            style: {
                font: '20px minecraft',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 30,
            text: '0%',
            style: {
                font: '24px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 75,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(300, 360, 640, 60);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(310, 370, 620 * value, 40);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Загрузка ресурса: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        //текстуры
        this.load.image('grass', 'assets/sprites/grass.png');   
        this.load.image('emerald_ore', 'assets/sprites/emerald_ore.png');
        this.load.image('gold_ore', 'assets/sprites/gold_ore.png');
        this.load.image('diamond_ore', 'assets/sprites/diamond_ore.png');
        this.load.image('redstone_ore', 'assets/sprites/redstone_ore.png');
        this.load.image('amethyst', 'assets/sprites/amethyst.png');
        this.load.image('game_over', 'assets/sprites/game_over.png');
        this.load.image('next_level', 'assets/sprites/next_level.png');
        this.load.image('retstart', 'assets/sprites/retstart.png');
        this.load.image('stone', 'assets/sprites/stone.png');
        this.load.image('tnt', 'assets/sprites/tnt.png');
        this.load.image('iron_block', 'assets/sprites/stone_bricks.png');
        this.load.image('diamond_block', 'assets/sprites/diamond_block.png');
        this.load.image('pickaxe', 'assets/sprites/iron_pickaxe.png');
        this.load.image('copper', 'assets/sprites/copper.png');
        this.load.image('exposed_copper', 'assets/sprites/exposed_copper.png');
        this.load.image('weathered_copper', 'assets/sprites/weathered_copper.png');
        this.load.image('oxidized_copper', 'assets/sprites/oxidized_copper.png');
        this.load.image('score', 'assets/sprites/score.png');
        this.load.image('shield', 'assets/sprites/shield.png');
        this.load.image('tablet', 'assets/sprites/tablet.png');
        this.load.image('button', 'assets/sprites/button.png');

        //звуки
        this.load.audio('mine0', 'assets/sounds/Stone0.mp3');
        this.load.audio('mine1', 'assets/sounds/Stone1.mp3');
        this.load.audio('mine2', 'assets/sounds/Stone2.mp3');
        this.load.audio('mine3', 'assets/sounds/Stone3.mp3');
        this.load.audio('explois', 'assets/sounds/explosion.mp3');
        this.load.audio('winis', 'assets/sounds/win.mp3');
        this.load.audio('block', 'assets/sounds/Shield.mp3');

        //гиф
        for (let i = 1; i < 16; i++) {
            this.load.image('explosion'+i, 'assets/gifs/explosion/'+i+'.png');
        }
        for (let i = 1; i < 10; i++) {
            this.load.image('win'+i, 'assets/gifs/win/'+i+'.png');
        }
    }

    showAlert(message, type = true, func) {
        this.table = this.add.sprite(640, 460, 'tablet')
        let textTable = this.add.text(640, 290, message, {font: '14px minecraft', fill: '#000',  wordWrap: {width: 460, height: 200}}).setOrigin(0.5, 0.5), okButText, cancButText
        if (type) {
            this.okBut = this.add.sprite(640, 400, 'button').setInteractive({cursor: 'pointer'})
            okButText = this.add.text(640, 400, 'ОК', {font: '30px minecraft', fill: '#000'}).setOrigin(0.5, 0.5)
        } else {
            this.cancBut = this.add.sprite(535, 400, 'button').setInteractive({cursor: 'pointer'})
            cancButText = this.add.text(535, 400, 'Омена', {font: '30px minecraft', fill: '#000'}).setOrigin(0.5, 0.5)
            this.okBut = this.add.sprite(755, 400, 'button').setInteractive({cursor: 'pointer'})
            okButText = this.add.text(755, 400, 'ОК', {font: '30px minecraft', fill: '#000'}).setOrigin(0.5, 0.5)
        }
        for (let textScale = 27; textTable.width < 440; textScale++) {
            textTable.setFontSize(textScale)
        }
        if (textTable.width > 460) {
            textTable.width = 440
        }
        this.input.off("gameobjectdown")
        this.input.on("gameobjectdown", isTable, this);

        function isTable(pointer, table){
            if (table == this.okBut) {
                this.table.destroy()
                this.okBut.destroy()
                okButText.destroy()
                textTable.destroy()
                if (!type) {
                    this.cancBut.destroy()
                    cancButText.destroy()
                    func()
                }
                this.input.on("gameobjectdown", this.onBlockClicked, this);
                return true
            }
            if (table == this.cancBut) {
                this.table.destroy()
                this.okBut.destroy()
                this.cancBut.destroy()
                okButText.destroy()
                textTable.destroy()
                cancButText.destroy()
                this.input.on("gameobjectdown", this.onBlockClicked, this);
                return false
            }
        }
    }
    
    create(){//запуск игры
        this.playerName = prompt('Ваше имя:')
        this.tntes = 2
        this.score = 0
        this.shield = false
        this.start();
        this.createBG();
        this.createBlocks(); 
        this.createText();
//        this.saveData(["Андрей", 1])
        this.getData()
        this.createLeaderboard();
    }

    start(){//начало уровня
        this.input.off("gameobjectdown");
        config.scale = 1;
        this.ores = config.table ** 2 - this.tntes;
    }

    createMatrixBlocks(firstBlock){//создание матрицы
        for (let k = 0; k < config.table; k++) {
            config.matrixBlocks.push([]);
            for (let i = 0; i < config.table; i++) {
                config.matrixBlocks[k].push(0);
            }
        }  
        config.matrixBlocks[firstBlock.value[0]][firstBlock.value[1]] = 'dmd';
        if (firstBlock.value[0] < config.table-1) {
            config.matrixBlocks[firstBlock.value[0]+1][firstBlock.value[1]] = -1;
        }
        if (firstBlock.value[1] < config.table-1) {
            config.matrixBlocks[firstBlock.value[0]][firstBlock.value[1]+1] = -1;
        }
        if(firstBlock.value[1] > 0){
            config.matrixBlocks[firstBlock.value[0]][firstBlock.value[1]-1] = -1;
        }
        if(firstBlock.value[0] > 0){
            config.matrixBlocks[firstBlock.value[0]-1][firstBlock.value[1]] = -1;
        }

        for (let i = 0; i < this.tntes;) {//создание динамита
            let testTnt = [Phaser.Math.Between(0, config.table - 1), Phaser.Math.Between(0, config.table - 1)];
            if (config.matrixBlocks[testTnt[0]][testTnt[1]] == 0){
                config.matrixBlocks[testTnt[0]][testTnt[1]] = 'tnt';
                //up
                if (testTnt[0] < config.table-1) {
                    config.matrixBlocks[testTnt[0]+1][testTnt[1]] = 'red';
                    if (testTnt[1] < config.table-1) {
                        if (config.matrixBlocks[testTnt[0]+1][testTnt[1]+1] == 0) {
                            config.matrixBlocks[testTnt[0]+1][testTnt[1]+1] = -1;
                        }
                    }
                    if(testTnt[1] > 0){
                        if (config.matrixBlocks[testTnt[0]+1][testTnt[1]-1] == 0) {
                            config.matrixBlocks[testTnt[0]+1][testTnt[1]-1] = -1;
                        }
                    }
                }
                //center
                if (testTnt[1] < config.table-1) {
                    config.matrixBlocks[testTnt[0]][testTnt[1]+1] = 'red';
                }
                if(testTnt[1] > 0){
                    config.matrixBlocks[testTnt[0]][testTnt[1]-1] = 'red';
                }
                //down
                if(testTnt[0] > 0){
                    config.matrixBlocks[testTnt[0]-1][testTnt[1]] = 'red';
                    if (testTnt[1] < config.table-1) {
                        if (config.matrixBlocks[testTnt[0]-1][testTnt[1]+1] == 0) {
                            config.matrixBlocks[testTnt[0]-1][testTnt[1]+1] = -1;
                        }
                    }
                    if(testTnt[1] > 0){
                        if (config.matrixBlocks[testTnt[0]-1][testTnt[1]-1] == 0) {
                            config.matrixBlocks[testTnt[0]-1][testTnt[1]-1] = -1;
                        }
                    }
                }
                i++;
            }
        }
        for (let i = 0; i < config.table; i++) {
            for (let k = 0; k < config.table; k++) {
                if(config.matrixBlocks[i][k] == 0 || config.matrixBlocks[i][k] == -1){
                    config.matrixBlocks[i][k] = Phaser.Utils.Array.GetRandom(['dmd', 'dmd', 'dmd', 'dmd', 'dmd', 'dmd', 'dmd', 'gld', 'gld', 'emr']);
                }
            }
        }
        //console.log(config.matrixBlocks)
    }

    async saveData(data) {
        const data_leader = await fetch('save.json');
        let get_data = await data_leader.json();
        get_data[data[0]] = data[1]
        get_data = JSON.stringify(get_data)

        const response = await fetch('save.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: get_data
            });            
        const result = await response.json();
        console.log('Данные успешно сохранены:', result);
        return result
    }

    async getData() {
        const response = await fetch('save.json');
        let data = await response.json();
        let sort_names = []
        for (let key in data){
            if(sort_names.length>0){
                for (let i in sort_names){
                    
                    if (data[key] > data[sort_names[i]]){
                        sort_names.splice(i, 0, key)
                        break
                    } else if (i == sort_names.length-1){
                        sort_names.push(key)
                    } else {
                    }
                }
            } else {
                sort_names.push(key)
            }
        }
        for (let i in sort_names.slice(10)){
            delete data[sort_names.slice(10)[i]]
        }
        sort_names = sort_names.slice(0, 10)
        const clear = await fetch('save.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: data
            });            
        console.log('Полученные данные:', data);
        return data
    }

    createLeaderboard(){//создаёт доску лидеров
        this.getData().then(obj => {
            let sort_names = []
            this.recordTable = []
            for (let key in obj){
                if(sort_names.length>0){
                    for (let i in sort_names){
                        
                        if (obj[key] > obj[sort_names[i]]){
                            sort_names.splice(i, 0, key)
                            break
                        } else if (i == sort_names.length-1){
                            sort_names.push(key)
                        } else {
                        }
                    }
                } else {
                    sort_names.push(key)
                }
            }
            for (let i in sort_names) {
                this.recordTable[i] = []
                this.recordTable[i][0] = obj[sort_names[i]]
                this.recordTable[i][1] = sort_names[i]
            }
            console.log(this.recordTable)
    
            for (let i = 0; i < this.recordTable.length; i++) {
                this.add.sprite(959, 110 + 48 * i, 'copper');
                this.add.sprite(1019, 110 + 48 * i, 'exposed_copper');
                for (let j = 0; j < 3; j++) {
                    this.add.sprite(1079 + 48*j, 110 + 48 * i, 'weathered_copper');
                }
                
                this.add.text(960, 97 + 48 * i, i+1, {font: '27px minecraft', fill: '#000'}).setOrigin(0.5, 0);
                let scoreWidth = this.add.text(990, 97 + 48 * i, this.recordTable[i][0], {font: '27px minecraft', fill: '#000'}),
                    nameWidth = this.add.text(1060, 95 + 48 * i, this.recordTable[i][1], {font: '27px minecraft', fill: '#000'});
                
                for (let scale = 1; nameWidth.width * scale > 120; scale = scale * 0.95) {
                    nameWidth.y += 0.5;
                    nameWidth.setScale(scale);
                }
                for (let scale = 1; scoreWidth.width * scale > 60; scale = scale * 0.95) {
                    scoreWidth.y += 0.5;
                    scoreWidth.setScale(scale);
                }
            }
    
        })
    }


    createText() {//создаёт надписи 
        this.amethyst = this.add.sprite(110, 150, 'score').setScale(0.8)//.setInteractive()
        this.oreQanty = this.add.text(175, 120, this.ores, {font: '72px minecraft', fill: '#fff'});
        this.tntIcon = this.add.sprite(110, 280, 'tnt').setScale(0.8).setInteractive({cursor: 'pointer'});
        this.tntQanty = this.add.text(200, 250, this.tntes, {font: '72px minecraft', fill: '#fff'});
        this.add.sprite(110, 410, 'amethyst');
        this.scoreQanty = this.add.text(200, 380, this.score, {font: '72px minecraft', fill: '#fff'});
        for (let i = 0; i < 4; i++) {
            this.add.sprite(100 + 64*i, 550, 'iron_block');
            this.add.sprite(967 + 64*i, 610, 'oxidized_copper')
        } 
        this.shieldText = this.add.text(75, 535, 'Получить щит', {font: '28px minecraft', fill: '#000'}).setInteractive({cursor: 'pointer'});
        this.call = this.add.text(947, 585, 'Связь с\nразработчиком', {font: '24px minecraft', fill: '#000'}).setInteractive({cursor: 'pointer'})
    }


    createBG(){//создание фона
        let stone = this.textures.get('grass').getSourceImage().width;
        for (let col = 0; col < this.sys.game.config.width / stone; col++) {
            for (let row = 0; row < this.sys.game.config.height / stone; row++) {
                this.bg = this.add.sprite(stone*col, stone*row, 'stone').setOrigin(0, 0);
            }
        }
    }


    newLevel(){//новый уровень
        config.table++;
        config.matrixBlocks = [];
        this.tntes = Math.round(this.tntes * (config.table ** 2) / ((config.table-1) ** 2));

        this.start();
        this.createBG();
        this.createText();
        this.createBlocks();
        //this.createLeaderboard();
    }


    initBlocks() {//раскладывает блоки
        let positions = this.getBlocksPositions();
        for (let i = 0; i < config.table; i++) {
            this.blocks[i].forEach(block => {
                let position = positions.pop();
                block.setScale(config.scale);
                block.setPosition(position.x, position.y);
            });    
        }
    }


    createBlocks() {//создаёт блоки
        this.blocks = [];
        for (let k = 0; k < config.table; k++) {
            this.blocks[k] = [];
            for (let i = 0; i < config.table; i++) {
                this.blocks[k].push(new Block(this, [k, i]));
            }; 
        };

        this.input.on("gameobjectdown", this.onBlockClicked, this);
        this.initBlocks();
    }


    onBlockClicked(pointer, block) {//событие при нажатии на блок
        switch (block) {
            case this.tntIcon:
                this.gameOver()
                break;
        
            case this.amethyst:
                this.youWin()
                break;

            case this.shieldText:
                if (this.shieldText.text == 'Получить щит'){
                    this.shield = 'true'
                    this.shieldText.setText('Щит получен')
                    this.showAlert('Щит получен');
                }
                break;

            case this.call:
                this.showAlert('Почта: leonidsugonako6@gmail.com\nТелеграмм: @nexolarf')
                break;
    
            default:
                if (block.opened) {
                    return false;
                } 

                if(this.ores == config.table ** 2 - this.tntes){
                    this.createMatrixBlocks(block)
                }

                block.opened = true
                switch (config.matrixBlocks[block.value[0]][block.value[1]]) {
                    case 'tnt':
                        block.setTexture('tnt')
                        if (this.shield == 'true') {
                            this.sound.play('block')
                            this.shieldText.setText('Щит сломан')
                            this.add.sprite(block.x, block.y, 'shield').setScale(config.scale);
                            this.shield = 'false'
                        } else {
                            this.gameOver()
                        }
                        return false
                        break;

                    case 'red':
                        block.setTexture('redstone_ore')
                        this.score += 1
                        this.ores--
                        break;

                    case 'dmd':
                        block.setTexture('diamond_ore')
                        this.score += 1
                        this.ores--
                        break;

                    case 'gld':
                        block.setTexture('gold_ore')
                        this.score += 2
                        this.ores--
                        break;

                    case 'emr':
                        block.setTexture('emerald_ore')
                        this.score += 3
                        this.ores--
                        break;
                    }

                this.scoreQanty.setText(this.score)
                this.oreQanty.setText(this.ores)

                if (this.ores <= 0) {
                    this.youWin();
                }
                this.sound.play(Phaser.Utils.Array.GetRandom(['mine0', 'mine1', 'mine2', 'mine3']))
                break;
        }
    }

    gameOver(){
        let game_over = this.add.sprite(this.sys.game.config.width/2, 275, 'game_over').setAlpha(0)
        this.sound.play('explois')
        for (let i = 0; i < config.table; i++) {
            this.blocks[i].forEach(block => block.removeInteractive())
        }

        let retstart = this.add.sprite(this.sys.game.config.width/2, 475, 'retstart').setAlpha(0),
            i = 0, o=2,
            gif = this.add.image(this.sys.game.config.width/2, 300, 'explosion1')

        let timerGif = setInterval(() =>{
            gif.destroy()
            gif = this.add.image(this.sys.game.config.width/2, 300, 'explosion'+o)
            o++
            if(o>16){
                gif.destroy()
                clearInterval(timerGif)
            }
        }, 75);

        //запись в лидерборд
        this.saveData(this.playerName, this.score)
        let timerId = setInterval(() =>{
            game_over.setAlpha(i)
            retstart.setAlpha(i)
            i += 0.05

            if(i>1){
                retstart.setInteractive()
                this.input.off("gameobjectdown")
                this.input.on("gameobjectdown", ()=> {
                     location.reload();
                }, this);
                clearInterval(timerId)
            }
        }, 20);
    }

    youWin(){
        let you_win = this.add.sprite(this.sys.game.config.width/2, 350, 'next_level').setAlpha(0)
        this.sound.play('winis')
        for (let i = 0; i < config.table; i++) {
            this.blocks[i].forEach(block => block.removeInteractive())
        }
        let m = 0, i=2,
            gif = this.add.image(this.sys.game.config.width/2, 350, 'win1')

        let timerGif = setInterval(() =>{
            gif.destroy()
            gif = this.add.image(this.sys.game.config.width/2, 350, 'win'+i)
            i++
            if(i>9){
                gif.destroy()
                clearInterval(timerGif)
            }
        }, 100);

        you_win.setInteractive()
        this.input.off("gameobjectdown")

        let timerId2 = setInterval(() =>{
            you_win.setAlpha(m)
            m += 0.05

            if(m>1){
                you_win.setInteractive()
                this.input.off("gameobjectdown")
                this.input.on("gameobjectdown", ()=> {
                    this.newLevel();
                    you_win.destroy()
                    clearInterval(timerGif)}, this);
                clearInterval(timerId2)
            }
        }, 20);
    }


    getBlocksPositions() {//создаёт позиции для блоков
        let positions = [],
            offsetX = 0,
            blockWidth,
            blockHeight,
            offsetY,
            blockTexture = this.textures.get('grass').getSourceImage();
        for (;offsetX < 250 || offsetY < 150; config.scale = config.scale * 0.95) {    
            if(config.scale == 0) {
                console.error('config.scale == 0')
                return false
            }  

            blockWidth = (blockTexture.width) * config.scale;
            blockHeight = (blockTexture.height) * config.scale;
            
            offsetX = (this.sys.game.config.width - blockWidth * config.table) / 2 + blockWidth / 2;
            offsetY = (this.sys.game.config.height - blockHeight * config.table) / 2 + blockHeight / 2;
        }

        for (let row = 0; row < config.table; row++) {
            for (let col = 0; col < config.table; col++) {
                positions.push({
                    x: offsetX + col * blockWidth,
                    y: offsetY + row * blockHeight,
                });
            }
        }

        return positions;
    }
}
