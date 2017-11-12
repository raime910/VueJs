
new Vue({
    el: '#app',
    data: {
        player: {
            name: 'Ryan',
            dmgMultiplier: 1.5,
            minDmg: 1,
            maxDmg: 10,
            hp: 100
        },
        monster: {
            name: 'Monster',
            dmgMultiplier: 1,
            minDmg: 1,
            maxDmg: 15,
            hp: 100
        },
        isGameActive: true,
        logs: [],
        dmgLogs: []
    },
    watch: {
        player: {
            deep: true,
            handler: function (newVal, oldVal) {
                console.log('player hp = ' + newVal.hp);
                if (newVal.hp <= 0) {
                    this.logs.push({ isPlayer: false, message: 'You lose!' });
                    this.isGameActive = false;
                }
            }
        },
        monster: {
            deep: true,
            handler: function (newVal, oldVal) {
                console.log('monster hp = ' + newVal.hp);
                if (newVal.hp <= 0) {
                    this.logs.push({ isPlayer: true, message: 'You win!' });
                    this.isGameActive = false;
                }
            }
        }
    },
    methods: {
        start: function () {
            this.player.hp = 100;
            this.monster.hp = 100;
            this.logs = [];
            this.dmgLogs = [];
            this.isGameActive = true;
            console.log('game start');
        },
        playerAtk: function (isSpecial) {
            var dmg = this.inflictDmg(
                this.player,
                this.monster,
                isSpecial
            );

            this.monsaterAtk();
        },
        playerHeal: function () {
            var heal = this.generateRand(1, 25);
            var playerHp = this.player.hp;
            playerHp += heal;

            if (playerHp > 100) {
                playerHp = 100;
            }

            this.player.hp = playerHp;

            this.logs.push({
                isPlayer: true,
                message: this.player.name + ' healed for ' + heal + ' HP'
            });

            if (this.player.hp > 0) {
                this.monsaterAtk();
            }
        },
        monsaterAtk: function () {
            var dmg = this.inflictDmg(
                this.monster,
                this.player,
                false
            );
        },
        inflictDmg: function (attacker, victim, isSpecial) {
            var min = attacker.minDmg;
            var max = attacker.maxDmg;

            if (isSpecial) {
                min = max;
                max *= attacker.dmgMultiplier;
            }

            var dmg = this.generateRand(min, max);
            var victimHp = victim.hp;
            victimHp -= dmg;

            if (victimHp < 0) {
                victimHp = 0;
            }

            victim.hp = victimHp;

            this.addDmgLog(attacker, victim, dmg);

            return dmg;
        },
        addDmgLog: function (attacker, victim, value) {
            this.logs.push({
                isPlayer: attacker === this.player,
                message: attacker.name + ' attacked ' + victim.name + ' for ' + value + ' damage'
            });
        },
        generateRand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }
});