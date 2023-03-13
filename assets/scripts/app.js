const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACT = 'ATTACK';
const MODE_STRONG_ATTACT = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
// const enteredValue = prompt('Maximum life for you and the monster' , '100');


// let chosenMaxLife = +enteredValue;
function getMaxLifeValues(){
    const enteredValue = prompt('Maximum life for you and the monster' , '100');

    const parsedValue = +enteredValue;
    if(isNaN(parsedValue) || parsedValue <=0){
        throw {message: 'Invalid user input , not a number'};

    }
    return parsedValue;
}
let chosenMaxLife;
try{
    chosenMaxLife = getMaxLifeValues();
} catch (error) {
    console.log (error);
    chosenMaxLife = 100;
    alert('You entered something wrong , default value of 100 was used.');
}

let battleLog = [];
let lastLoggedEntry;




let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealthBar){
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealthBar,
    };

    switch (event){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER' ;
            break;
        case LOG_EVENT_STRONG_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: event,
                value: value,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: event,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        default:
            logEntry = {};
        

    }


    // if(event === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target = 'MONSTER' ;
        
    // }else if (event === LOG_EVENT_STRONG_ATTACK){
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: 'MONSTER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
        
    // }else if(event === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
        
    // }else if(event === LOG_EVENT_PLAYER_HEAL){
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
        
    // }else if (event === LOG_EVENT_GAME_OVER){
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
        
    // }

    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function attackMonster(mode){
    const maxDamage = mode === MODE_ATTACT ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACT ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_STRONG_ATTACK;
    // if(mode === MODE_ATTACT){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }else if (mode === MODE_STRONG_ATTACT){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_STRONG_ATTACK;

    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth , currentPlayerHealth);

    endRound();
}

function endRound(){
    const initialPlayerlife = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage ;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth , currentPlayerHealth);


    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerlife;
        alert ('Bonus life saved you, have no more bonus life');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won');
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth , currentPlayerHealth);


    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('You lost');
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth , currentPlayerHealth);


    } else if(currentPlayerHealth <= 0 && currentMonsterHealth <=0){
        alert('You have a draw');
        writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth , currentPlayerHealth);


    }

    if(currentMonsterHealth <= 0 || currentPlayerHealth <= 0){
        reset();
    }
}

function attackHandler(){
    attackMonster(MODE_ATTACT);
}

function StorngAttackHandler(){
    attackMonster(MODE_STRONG_ATTACT);

}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You cant heal to more then your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth , currentPlayerHealth);

    endRound();
}

function printLogHandler(){
    for (let i = 0; i < 3; i++){
        console.log('---------------');
    }
    // let j = 0;
    // while(j < 3){
    //     console.log('-------------');
    //     j++;
    // }

    // for(let i = 0; i < battleLog.length; i++){
    //     console.log(battleLog[i]);
    // }
    let i = 0;
    for(const logEntry of battleLog){
        if(!lastLoggedEntry && lastLoggedEntry !==0 || lastLoggedEntry < i){
            console.log(`#${i}`);
            for(const key in logEntry){
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLoggedEntry = i;
            break;
        }
        i++;
    }

    // console.log(battleLog);
}

attackBtn.addEventListener('click' , attackHandler );
strongAttackBtn.addEventListener('click' , StorngAttackHandler );
healBtn.addEventListener('click' , healPlayerHandler);
logBtn.addEventListener('click' , printLogHandler);